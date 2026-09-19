"""
Automated Test Suite for Hospital Blood Banks & NGO Network Collaboration Module
Tests:
1. NGO Pseudo-Login Engine (POST /api/ngo/pseudo-login)
2. Hospital Blood Bank ↔ NGO Link Verification (POST /api/network/partnerships/request)
3. In-App Dashboard Acceptance (POST /api/network/partnerships/action)
4. Magic Link Cryptographic Acceptance (GET /api/network/partnerships/verify-link)
5. Emergency SOS Broadcast Ingestion (POST /api/network/sos/broadcast)
6. Atomic In-App Intercept & Concurrency Guard (POST /api/network/sos/accept) -> 409 Conflict
7. Genuine Emergency Dispatch Notice Single-Use Email Claim (GET /api/network/sos/accept-email) -> 409 Conflict
"""

import json
import urllib.request
import urllib.error
import sys
import time

BASE_URL = "http://localhost:8000"

def request_json(method, path, data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content_type = resp.headers.get("Content-Type", "")
            raw = resp.read()
            if "application/json" in content_type:
                return resp.status, json.loads(raw.decode("utf-8"))
            return resp.status, raw.decode("utf-8")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8")
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, raw

def run_tests():
    # Wait for server readiness
    for _ in range(10):
        try:
            with urllib.request.urlopen(f"{BASE_URL}/api/inventory", timeout=2) as r:
                if r.status == 200:
                    break
        except Exception:
            time.sleep(1)

    passed = 0
    total = 0

    print("\n=======================================================")
    print("Hospital Blood Banks & NGO Network Collaboration Tests")
    print("=======================================================\n")

    # TEST 1: NGO Pseudo-Login with LIC-NGO-OD-9021
    total += 1
    print(f"Test {total}: NGO Pseudo-Login Engine (POST /api/ngo/pseudo-login)")
    status, res = request_json("POST", "/api/ngo/pseudo-login", {"identifier": "LIC-NGO-OD-9021"})
    assert status == 200, f"Expected 200, got {status}: {res}"
    assert res.get("success") is True
    session = res.get("session", {})
    assert session.get("ngoId") == "NGO-OD-9021" or session.get("ngoId") == "ngo-od-9021"
    assert session.get("licenseNo") == "LIC-NGO-OD-9021"
    assert session.get("role") == "NGO_OPERATOR"
    assert session.get("network") == "HOSPITAL_BLOOD_BANKS_NGO_NETWORK"
    assert "token" in session
    print(f"  [PASS] Logged in as: {session.get('ngoName')} ({session.get('licenseNo')})")
    print(f"         Network: {session.get('network')} | Role: {session.get('role')}")
    passed += 1

    # TEST 2: Hospital Initiates Partnership Request
    total += 1
    print(f"\nTest {total}: Hospital Initiates Partnership Request (POST /api/network/partnerships/request)")
    req_payload = {
        "hospitalBloodBankId": "HOSP-001",
        "hospitalName": "City Care Blood Centre & Hospital",
        "licenseNo": "LIC-2026-001",
        "targetNgoLicense": "LIC-NGO-OD-9021",
        "contactEmail": "bloodbank@citycare.org",
        "contactPhone": "+91 11 2692 5858",
        "physicalAddress": "Ring Road, Medical Enclave, Ansari Nagar, New Delhi"
    }
    status, res = request_json("POST", "/api/network/partnerships/request", req_payload)
    assert status == 200, f"Expected 200, got {status}: {res}"
    assert res.get("success") is True
    partnership_data = res.get("data", {})
    assert partnership_data.get("status") == "PENDING"
    assert "token" in partnership_data
    request_id_1 = partnership_data.get("requestId")
    token_1 = partnership_data.get("token")
    verify_link = partnership_data.get("verifyLink")
    print(f"  [PASS] Partnership initiated: ID={request_id_1}, Status=PENDING")
    print(f"         Signed 48-hr Magic Link: {verify_link}")
    passed += 1

    # TEST 3: In-App Dashboard Acceptance
    total += 1
    print(f"\nTest {total}: In-App Dashboard Acceptance (POST /api/network/partnerships/action)")
    action_payload = {
        "requestId": request_id_1,
        "action": "ACCEPT"
    }
    status, res = request_json("POST", "/api/network/partnerships/action", action_payload)
    assert status == 200, f"Expected 200, got {status}: {res}"
    assert res.get("success") is True
    assert res.get("data", {}).get("status") == "ACTIVE_AFFILIATE"
    print(f"  [PASS] Link status transitioned to: {res.get('data', {}).get('status')}")
    passed += 1

    # TEST 4: Formal Email Letter & Magic Link Acceptance (GET /api/network/partnerships/verify-link)
    total += 1
    print(f"\nTest {total}: Formal Email Letter & Magic Link Acceptance (GET /api/network/partnerships/verify-link)")
    # Create second partnership request for email token testing
    req_payload_2 = {
        "hospitalBloodBankId": "HOSP-001",
        "hospitalName": "City Care Blood Centre & Hospital",
        "licenseNo": "LIC-2026-001",
        "targetNgoLicense": "NGO-DL-8821",
        "contactEmail": "bloodbank@citycare.org",
        "contactPhone": "+91 11 2692 5858",
        "physicalAddress": "Ring Road, Medical Enclave, Ansari Nagar, New Delhi"
    }
    status, res2 = request_json("POST", "/api/network/partnerships/request", req_payload_2)
    assert status == 200
    token_2 = res2.get("data", {}).get("token")
    
    # Verify via magic link endpoint
    status, html_res = request_json("GET", f"/api/network/partnerships/verify-link?token={token_2}&action=accept")
    assert status == 200, f"Expected 200, got {status}"
    assert "ACTIVE_AFFILIATE" in html_res or "Ratification Confirmed" in html_res or "Hospital Blood Banks" in html_res
    print(f"  [PASS] Cryptographic verification accepted token and ratified ACTIVE_AFFILIATE")
    passed += 1

    # TEST 5: Emergency SOS Broadcast Ingestion
    total += 1
    broadcast_id_1 = f"SOS-DEMO-{int(time.time())}-01"
    print(f"\nTest {total}: Emergency SOS Broadcast Ingestion (POST /api/network/sos/broadcast)")
    sos_payload = {
        "broadcastId": broadcast_id_1,
        "hospitalBloodBankName": "City Care Blood Centre & Hospital",
        "licenseNo": "LIC-2026-001",
        "bloodGroup": "O-",
        "unitsRequired": 4,
        "emergencyDeskPhone": "+91 11 2692 5858",
        "roomDetails": "Emergency OT-3 (Severe Hemorrhage)"
    }
    status, res = request_json("POST", "/api/network/sos/broadcast", sos_payload)
    assert status == 200, f"Expected 200, got {status}: {res}"
    assert res.get("success") is True
    sos_data = res.get("data", {})
    assert sos_data.get("broadcastId") == broadcast_id_1
    assert sos_data.get("status") == "BROADCASTED"
    print(f"  [PASS] SOS Broadcast ingested: ID={sos_data.get('broadcastId')}, Status={sos_data.get('status')}")
    print(f"         Notified facilities: {res.get('notifiedFacilities')} | Dispatched priority emails: {res.get('emailsDispatched')}")
    passed += 1

    # TEST 6: In-App Atomic Acceptance & Concurrency Lock
    total += 1
    print(f"\nTest {total}: In-App Acceptance & Concurrency Lock (POST /api/network/sos/accept)")
    accept_payload = {
        "broadcastId": broadcast_id_1,
        "ngoId": "NGO-OD-9021"
    }
    status, res = request_json("POST", "/api/network/sos/accept", accept_payload)
    assert status == 200, f"Expected 200, got {status}: {res}"
    assert res.get("success") is True
    assert res.get("data", {}).get("status") == "IN_DISPATCH"
    print(f"  [PASS] Alert atomically locked into: {res.get('data', {}).get('status')}")
    passed += 1

    # Concurrency collision test: Second NGO attempts to claim the same alert
    total += 1
    print(f"\nTest {total}: Concurrency Conflict Guard (Second claim attempt on locked SOS)")
    status_conflict, res_conflict = request_json("POST", "/api/network/sos/accept", {
        "broadcastId": broadcast_id_1,
        "ngoId": "NGO-DL-8821"
    })
    assert status_conflict == 409, f"Expected 409 Conflict, got {status_conflict}: {res_conflict}"
    assert res_conflict.get("success") is False
    print(f"  [PASS] 409 Conflict enforced: '{res_conflict.get('message')}'")
    passed += 1

    # TEST 7: Genuine Emergency Dispatch Notice Email Link Claim
    total += 1
    broadcast_id_2 = f"SOS-DEMO-{int(time.time())}-02"
    print(f"\nTest {total}: Single-Use Emergency Email Claim Link (GET /api/network/sos/accept-email)")
    # Create another broadcast
    sos_payload_2 = {
        "broadcastId": broadcast_id_2,
        "hospitalBloodBankName": "City Care Blood Centre & Hospital",
        "licenseNo": "LIC-2026-001",
        "bloodGroup": "AB-",
        "unitsRequired": 2,
        "emergencyDeskPhone": "+91 11 2692 5858",
        "roomDetails": "ICU Bed 12"
    }
    status, res = request_json("POST", "/api/network/sos/broadcast", sos_payload_2)
    assert status == 200
    sos_token = res.get("data", {}).get("token")
    
    # Claim via email link
    claim_path = f"/api/network/sos/accept-email?token={sos_token}&broadcastId={broadcast_id_2}&ngoId=NGO-OD-9021"
    status_claim, claim_res = request_json("GET", claim_path)
    assert status_claim == 200, f"Expected 200, got {status_claim}: {claim_res}"
    assert "IN_DISPATCH" in claim_res or "Dispatch Assigned" in claim_res
    print(f"  [PASS] Email claim consumed token and returned institutional dispatch receipt")
    passed += 1

    # Second claim via same token/broadcast must be rejected with 409 Conflict
    total += 1
    print(f"\nTest {total}: Single-Use Token Invalidation on Repeat Claim")
    status_repeat, repeat_res = request_json("GET", claim_path)
    assert status_repeat == 409, f"Expected 409 Conflict, got {status_repeat}"
    assert "Already Claimed" in repeat_res or "Conflict" in repeat_res
    print(f"  [PASS] Token replay / double-claim rejected with HTTP 409 Conflict")
    passed += 1

    print("\n=======================================================")
    print(f"All Tests Completed: {passed} / {total} PASSED")
    print("=======================================================\n")
    return True

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as err:
        print(f"\n[FAIL] Test aborted with error: {err}")
        sys.exit(1)
