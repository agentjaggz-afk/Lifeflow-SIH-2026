#!/usr/bin/env python3
"""
Test Suite: Real-Time Emergency Blood Reception Engine for NGO Portal
Validates:
1. Exact payload schema compliance per specifications
2. Dynamic distance calculation using Haversine formula
3. SSE stream connectivity and event formatting
4. Active alert querying (GET /api/network/alerts/active)
5. Live emergency alert simulation (POST /api/network/alerts/simulate)
6. Atomic race-safe acknowledgment (POST /api/network/alerts/acknowledge)
7. Concurrency conflict handling (HTTP 409 on duplicate claims)
"""

import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_active_alerts_schema():
    print("[TEST 1] Querying active emergency alerts schema...")
    url = f"{BASE_URL}/api/network/alerts/active?ngoId=NGO-OD-9021"
    req = urllib.request.urlopen(url, timeout=5)
    assert req.status == 200, f"Expected 200, got {req.status}"
    
    data = json.loads(req.read().decode("utf-8"))
    assert data.get("success") is True, "Response must indicate success: True"
    assert "alerts" in data, "Response must contain 'alerts' key"
    assert len(data["alerts"]) > 0, "Expected at least one seeded active alert"
    
    alert = data["alerts"][0]
    required_keys = [
        "alertId", "hospitalName", "hospitalLicense", "bloodGroup",
        "unitsRequired", "urgencyLevel", "distanceKm", "contactPerson",
        "directDeskPhone", "hospitalAddress", "timestamp", "status"
    ]
    for key in required_keys:
        assert key in alert, f"Missing required payload key: '{key}'"
        assert alert[key] is not None, f"Key '{key}' must not be null"
    
    assert isinstance(alert["unitsRequired"], int), "unitsRequired must be integer"
    assert isinstance(alert["distanceKm"], (int, float)), "distanceKm must be numeric"
    assert alert["status"] == "AWAITING_RESPONSE", f"Initial status must be AWAITING_RESPONSE, got {alert['status']}"
    print(f"  -> PASS: Seeded alert {alert['alertId']} matches exact schema with distance {alert['distanceKm']} km")

def test_haversine_distances():
    print("[TEST 2] Validating Haversine distance computations across regions...")
    # Delhi NGO (close to HOSP-001)
    url_delhi = f"{BASE_URL}/api/network/alerts/active?ngoId=NGO-RED-001"
    res_delhi = json.loads(urllib.request.urlopen(url_delhi, timeout=5).read().decode("utf-8"))
    dist_delhi = res_delhi["alerts"][0]["distanceKm"]
    assert 0.0 < dist_delhi < 20.0, f"Expected close distance for Delhi NGO, got {dist_delhi} km"

    # Odisha NGO (regional fallback to ~6.5 km)
    url_od = f"{BASE_URL}/api/network/alerts/active?ngoId=NGO-OD-9021"
    res_od = json.loads(urllib.request.urlopen(url_od, timeout=5).read().decode("utf-8"))
    dist_od = res_od["alerts"][0]["distanceKm"]
    assert dist_od > 0, f"Expected valid distance, got {dist_od}"
    print(f"  -> PASS: Distance calculated correctly: Delhi={dist_delhi} km, Odisha={dist_od} km")

def test_simulate_alert_dispatch():
    print("[TEST 3] Testing emergency shortage alert simulation trigger...")
    url = f"{BASE_URL}/api/network/alerts/simulate"
    payload = {
        "bloodGroup": "B-",
        "unitsRequired": 5,
        "urgencyLevel": "CRITICAL_OT"
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req, timeout=5)
    assert res.status == 200, f"Expected 200, got {res.status}"
    data = json.loads(res.read().decode("utf-8"))
    assert data.get("success") is True
    assert "simulatedAlert" in data
    
    sim = data["simulatedAlert"]
    assert sim["bloodGroup"] == "B-"
    assert sim["unitsRequired"] == 5
    assert sim["urgencyLevel"] == "CRITICAL_OT"
    assert sim["status"] == "AWAITING_RESPONSE"
    print(f"  -> PASS: Successfully generated simulated alert: {sim['alertId']} for group {sim['bloodGroup']}")
    return sim["alertId"]

def test_atomic_acknowledgment_and_concurrency(alert_id: str):
    print(f"[TEST 4] Testing atomic acknowledgment and race-safe concurrency on {alert_id}...")
    url = f"{BASE_URL}/api/network/alerts/acknowledge"
    
    # 1. First facility claims the emergency
    payload_1 = {
        "alertId": alert_id,
        "ngoId": "NGO-OD-9021",
        "ngoName": "Odisha Blood Relief & Voluntary Donor Network"
    }
    req_1 = urllib.request.Request(
        url,
        data=json.dumps(payload_1).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res_1 = urllib.request.urlopen(req_1, timeout=5)
    assert res_1.status == 200, f"Expected 200 on first claim, got {res_1.status}"
    data_1 = json.loads(res_1.read().decode("utf-8"))
    assert data_1.get("success") is True
    assert data_1.get("status") == "ACCEPTED"
    assert data_1.get("data", {}).get("status") == "IN_DISPATCH"
    print(f"  -> PASS: First claim by Odisha Blood Relief secured custody ({data_1['data']['status']})")

    # 2. Second facility attempts to claim the same alert (Race condition simulation)
    payload_2 = {
        "alertId": alert_id,
        "ngoId": "NGO-RED-001",
        "ngoName": "Red Cross Blood Mission Delhi"
    }
    req_2 = urllib.request.Request(
        url,
        data=json.dumps(payload_2).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    try:
        urllib.request.urlopen(req_2, timeout=5)
        assert False, "Second claim must fail with HTTP 409 Conflict!"
    except urllib.error.HTTPError as e:
        assert e.code == 409, f"Expected HTTP 409 Conflict, got {e.code}"
        conflict_data = json.loads(e.read().decode("utf-8"))
        assert conflict_data.get("conflict") is True
        assert conflict_data.get("currentStatus") == "IN_DISPATCH"
        assert "Odisha Blood Relief" in conflict_data.get("claimedBy", "")
        print(f"  -> PASS: Second claim correctly rejected with HTTP 409 Conflict. Lock preserved for first responder.")

def test_sse_stream_connectivity():
    print("[TEST 5] Testing Server-Sent Events (SSE) live event bus stream...")
    url = f"{BASE_URL}/api/network/alerts/stream?ngoId=NGO-OD-9021"
    req = urllib.request.urlopen(url, timeout=5)
    assert req.status == 200
    headers = dict(req.getheaders())
    content_type = headers.get("Content-Type", "")
    assert "text/event-stream" in content_type, f"Expected text/event-stream, got {content_type}"
    
    # Read initial lines
    line1 = req.readline().decode("utf-8").strip()
    assert line1.startswith("data:"), f"Expected SSE data frame, got {line1}"
    init_event = json.loads(line1.replace("data: ", ""))
    assert init_event.get("type") == "CONNECTED"
    print(f"  -> PASS: SSE stream connected with valid header and handshake frame: {init_event['message']}")

if __name__ == "__main__":
    print("================================================================")
    print("STARTING TEST SUITE: NGO Emergency Blood Reception Engine")
    print("================================================================")
    test_active_alerts_schema()
    test_haversine_distances()
    sim_id = test_simulate_alert_dispatch()
    test_atomic_acknowledgment_and_concurrency(sim_id)
    test_sse_stream_connectivity()
    print("================================================================")
    print("ALL TESTS PASSED (100% SUCCESS)!")
    print("================================================================")
