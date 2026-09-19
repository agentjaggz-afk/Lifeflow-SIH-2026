#!/usr/bin/env python3
"""
Comprehensive Automated Test Suite for NGO Emergency Response & Hospital Connection Service Layer
Verifies:
1. NGO Pseudo-Login Engine & RFC 7519 HMAC-SHA256 JWT generation
2. NGO Session Inspection & Authorization validation
3. Hospital-NGO Formal Partnership Request & Memorandum Email Dispatch (48-Hour TTL)
4. Outbox Logging & Email Preview Endpoints
5. Single-Click Magic Link Verification (Ratification & Decline)
6. In-App Direct Dashboard Partnership Action
7. Emergency SOS Broadcasting & Email Claims
8. Atomic Concurrency Locking on SOS Claims (200 OK for winner, 409 Conflict on double-claim)
9. Single-Click SOS Email Claiming & Conflict Handling
10. Decoupling verification of legacy endpoints
"""

import urllib.request
import urllib.error
import urllib.parse
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def request(method, path, body=None, headers=None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content_type = resp.headers.get("Content-Type", "")
            raw = resp.read()
            if "application/json" in content_type:
                return resp.status, json.loads(raw.decode("utf-8")), resp.headers
            else:
                return resp.status, raw.decode("utf-8"), resp.headers
    except urllib.error.HTTPError as e:
        raw = e.read()
        content_type = e.headers.get("Content-Type", "")
        if "application/json" in content_type:
            try:
                return e.code, json.loads(raw.decode("utf-8")), e.headers
            except Exception:
                return e.code, raw.decode("utf-8"), e.headers
        return e.code, raw.decode("utf-8"), e.headers

passed = 0
failed = 0

def test(name, condition, details=""):
    global passed, failed
    if condition:
        print(f"  [PASS] {name}")
        passed += 1
    else:
        print(f"  [FAIL] {name}: {details}")
        failed += 1

print("\n=======================================================")
print("  RUNNING NGO EMERGENCY & HOSPITAL CONNECTION TEST SUITE")
print("=======================================================\n")

# 1. Health Check
status, data, _ = request("GET", "/api/health")
test("Server Health Check", status == 200 and data.get("status") == "healthy", str(data))

# 2. NGO Pseudo-Login with pre-seeded ID
status, data, _ = request("POST", "/api/ngo/pseudo-login", {"identifier": "NGO-RED-001"})
test("Pseudo-Login with Pre-seeded ID (NGO-RED-001)", status == 200 and data.get("authenticated") is True and "token" in data, str(data))
red_token = data.get("token") if status == 200 else None

# 3. NGO Pseudo-Login with official license
status, data, _ = request("POST", "/api/ngo/pseudo-login", {"licenseNumber": "NGO-DL-4512"})
test("Pseudo-Login with License Number (NGO-DL-4512)", status == 200 and data["session"]["ngoId"] == "NGO-CARE-102", str(data))
care_token = data.get("token") if status == 200 else None

# 4. NGO Pseudo-Login with invalid identifier
status, data, _ = request("POST", "/api/ngo/pseudo-login", {"identifier": "NGO-INVALID-999"})
test("Pseudo-Login 404 on Invalid Credentials", status == 404 and data.get("authenticated") is False, str(data))

# 5. NGO Session Check with valid JWT
status, data, _ = request("GET", "/api/ngo/session", headers={"Authorization": f"Bearer {red_token}"})
test("Verify Valid JWT Session via Authorization Header", status == 200 and data.get("session", {}).get("ngoId") == "NGO-RED-001", str(data))

# 6. NGO Session Check with invalid JWT
status, data, _ = request("GET", "/api/ngo/session", headers={"Authorization": "Bearer invalid.jwt.token"})
test("Reject Invalid JWT Session with 401 Unauthorized", status == 401 and data.get("authenticated") is False, str(data))

# 7. Hospital-NGO Partnership Request & Memorandum Dispatch
part_req_body = {
    "hospitalId": "HOSP-001",
    "hospitalName": "City Care Blood Centre & Hospital",
    "licenseNo": "LIC-2026-001",
    "hospitalAddress": "Ring Road, Medical Enclave, Ansari Nagar, New Delhi",
    "hospitalPhone": "+91 11 2692 5858",
    "contactEmail": "bloodbank@citycare.org",
    "ngoLicense": "NGO-DL-8821"
}
status, data, _ = request("POST", "/api/partnerships/request", part_req_body)
test("Hospital Partnership Request Created (201 PENDING)", status == 201 and data.get("status") == "PENDING" and "verificationToken" in data, str(data))
part_req_id = data.get("requestId")
verification_token = data.get("verificationToken")
accept_magic_url = data.get("magicLinks", {}).get("acceptUrl")
reject_magic_url = data.get("magicLinks", {}).get("rejectUrl")

# 8. Check Dispatched Emails Outbox
status, data, _ = request("GET", "/api/emails/outbox")
test("Dispatched Emails Outbox Contains Memorandum", status == 200 and data.get("count", 0) > 0 and data["outbox"][0]["email_type"] == "PARTNERSHIP_MEMORANDUM", f"Count: {data.get('count')}")
latest_email_id = data["outbox"][0]["id"] if status == 200 and data.get("count", 0) > 0 else None

# 9. Preview Rendered Email in Browser Endpoint
if latest_email_id:
    status, html_data, headers = request("GET", f"/api/emails/preview?id={latest_email_id}")
    test("Dispatched Email HTML Preview Endpoint", status == 200 and "Official Memorandum: Institutional Blood Supply Partnership" in html_data and "text/html" in headers.get("Content-Type", ""), f"Status: {status}")

# 10. Single-Click Magic Link Verification (Ratify Partnership)
if verification_token:
    verify_path = f"/api/partnerships/verify-email?token={verification_token}&action=ACCEPT"
    status, html_data, _ = request("GET", verify_path)
    test("Single-Click Magic Link Ratification (200 OK)", status == 200 and "Partnership Ratified" in html_data, f"Status: {status}")

    # 11. Idempotency check: Re-clicking the link should state already finalized
    status, html_data, _ = request("GET", verify_path)
    test("Magic Link Re-click Idempotency (Already Processed)", status == 200 and "Partnership Already Finalized" in html_data, f"Status: {status}")

# 12. Check Hospital Connections List reflects active partnership
status, data, _ = request("GET", "/api/hospital/connections?hospitalId=HOSP-001")
test("Hospital Connections Contains Activated NGO", status == 200 and any(c["ngo_id"] == "NGO-RED-001" and c["connection_status"] == "Active" for c in data.get("connections", [])), str(data))

# 13. In-App Direct Dashboard Partnership Action (Decline another request)
part_req_2_body = {
    "hospitalId": "HOSP-001",
    "ngoLicense": "NGO-DL-4512"
}
status, data, _ = request("POST", "/api/partnerships/request", part_req_2_body)
test("Second Partnership Request for NGO-DL-4512", status == 201, str(data))
req_2_id = data.get("requestId")

status, data, _ = request("POST", "/api/partnerships/action", {"requestId": req_2_id, "action": "REJECT"})
test("Direct Dashboard Partnership Action (REJECT)", status == 200 and data.get("status") == "REJECTED", str(data))

# 14. Emergency SOS Broadcasting
sos_body = {
    "hospitalId": "HOSP-001",
    "hospitalName": "City Care Blood Centre",
    "emergencyContact": "+91 11 2658 8500",
    "bloodGroup": "O-",
    "unitsRequired": 3,
    "urgencyLevel": "LIFE_THREATENING_STAT",
    "patientCaseId": "TRAUMA-OT-4412",
    "clinicalNotes": "Acute polytrauma patient with hemorrhagic shock in OT-2"
}
status, data, _ = request("POST", "/api/sos/broadcast", sos_body)
test("Emergency SOS Broadcast Created (201 BROADCASTED)", status == 201 and data.get("status") == "BROADCASTED" and data.get("ngosNotifiedCount", 0) >= 4, str(data))
sos_id = data.get("sosId")
signed_sos_token = data.get("signedSosToken")

# 15. Emergency SOS Atomic Claiming - Winner
status, data, _ = request("POST", "/api/sos/accept", {"sosId": sos_id, "ngoId": "NGO-RED-001", "ngoName": "Red Cross Blood Mission Delhi"})
test("Atomic SOS Claim by First NGO (200 IN_TRANSIT)", status == 200 and data.get("status") == "IN_TRANSIT" and data["acceptedBy"]["ngoId"] == "NGO-RED-001", str(data))

# 16. Emergency SOS Atomic Claiming - Concurrency Conflict (409)
status, data, _ = request("POST", "/api/sos/accept", {"sosId": sos_id, "ngoId": "NGO-CARE-102", "ngoName": "LifeSavers Foundation NCR"})
test("Atomic SOS Double-Claim Returns 409 Conflict", status == 409 and data.get("conflict") is True and "already claimed and locked" in data.get("error", ""), str(data))

# 17. Single-Click SOS Email Claim Link Test
# Broadcast a second SOS for email testing
sos_body_2 = {
    "hospitalId": "HOSP-001",
    "bloodGroup": "B-",
    "unitsRequired": 2,
    "urgencyLevel": "CRITICAL_OT",
    "patientCaseId": "SURGERY-9901"
}
status, data, _ = request("POST", "/api/sos/broadcast", sos_body_2)
test("Second SOS Broadcast Created for Email Claim", status == 201, str(data))
sos_id_2 = data.get("sosId")
sos_token_2 = data.get("signedSosToken")

# Claim via email link
status, html_data, _ = request("GET", f"/api/sos/accept-email?token={sos_token_2}&ngoId=NGO-CARE-102")
test("Single-Click SOS Email Claim Success (200 OK)", status == 200 and "SOS Claimed Successfully" in html_data, f"Status: {status}")

# Attempt to claim same SOS via email link again
status, html_data, _ = request("GET", f"/api/sos/accept-email?token={sos_token_2}&ngoId=NGO-SAM-003")
test("Single-Click SOS Email Double-Claim Returns 409 Conflict HTML", status == 409 and "409 Conflict" in html_data and "already claimed and locked" in html_data, f"Status: {status}")

# 18. SOS List Filter
status, data, _ = request("GET", "/api/sos/list?hospitalId=HOSP-001")
test("List SOS Broadcasts", status == 200 and len(data.get("sosList", [])) >= 2, f"Count: {len(data.get('sosList', []))}")

# 19. Decoupled Legacy Endpoint Verification (Should be 404)
status, data, _ = request("POST", "/api/ngos/transfer-request", {"hospitalId": "HOSP-001"})
test("Decoupled Legacy Route /api/ngos/transfer-request Returns 404", status == 404, f"Status: {status}")

print("\n=======================================================")
print(f"  TEST RESULTS: {passed} PASSED, {failed} FAILED")
print("=======================================================\n")

if failed > 0:
    sys.exit(1)
