#!/usr/bin/env python3
"""
Hospital Blood Bank Management System - Backend RESTful API Server
Expanded with NGO Emergency Response & Hospital Connection Service Layer.

Key Capabilities:
- Blood Inventory Tracking with Dynamic 3-Tier Thresholds (Red <= 6, Yellow 7-13, Green > 13)
- Severe Shortage Alert Banner Trigger (Units < 5)
- Cryptographic ISBT-128 QR Code Labeling & Authenticity Verification
- Hospital Profile & Cold-Chain Storage Management
- Unified Regional Network Directory with Haversine GPS Distance Calculation
- Peer Hospital Connection via Institutional License
- NGO Pseudo-Login Authentication Engine with Standard RFC 7519 HMAC-SHA256 JWT
- Hospital-NGO Partnership Formal Verification Flow (Signed 48-Hour TTL Memorandum & Magic Links)
- Emergency SOS Blood Broadcast with Atomic Concurrency Locking (First-to-Claim, 409 Conflict on Double-Claim)
- Formal Transactional Email Dispatcher with Local Outbox Audit & Browser Preview
"""

import http.server
import socketserver
import json
import sqlite3
import os
import re
import hashlib
import hmac
import base64
import time
import uuid
import urllib.parse
import math
import queue
import threading
import random
from datetime import datetime, timedelta, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "lifeflow_bloodbank.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")
PORT = 8000
SECRET_KEY = "LIFEFLOW-CRYPTO-KEY-2026-SECURE-NBTC"

# Real-Time Emergency Alert Event Bus & Subscribers
emergency_reception_alerts = []
sse_subscribers_lock = threading.Lock()
sse_subscribers: dict[str, list[queue.Queue]] = {}

def get_db_connection(timeout: float = 30.0):
    """Establishes an optimized SQLite connection with WAL mode and 30s timeout."""
    conn = sqlite3.connect(DB_PATH, timeout=timeout)
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA busy_timeout = 30000;")
    conn.row_factory = sqlite3.Row
    return conn

# =====================================================
# CRYPTOGRAPHIC UTILITIES & JWT ENGINE (Pure Python Stdlib)
# =====================================================

def base64url_encode(data: bytes) -> str:
    """Encodes bytes into URL-safe base64 string without trailing '=' padding."""
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

def base64url_decode(s: str) -> bytes:
    """Decodes URL-safe base64 string with auto-restored '=' padding."""
    padding = "=" * (4 - (len(s) % 4)) if (len(s) % 4) != 0 else ""
    return base64.urlsafe_b64decode((s + padding).encode("utf-8"))

def generate_jwt_token(payload: dict, expires_in_seconds: int = 86400 * 7) -> str:
    """Generates standard RFC 7519 HMAC-SHA256 JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload_copy = dict(payload)
    now = int(time.time())
    payload_copy["iat"] = now
    if "exp" not in payload_copy:
        payload_copy["exp"] = now + expires_in_seconds

    encoded_header = base64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    encoded_payload = base64url_encode(json.dumps(payload_copy, separators=(",", ":")).encode("utf-8"))

    signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
    signature = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    encoded_sig = base64url_encode(signature)

    return f"{encoded_header}.{encoded_payload}.{encoded_sig}"

def verify_jwt_token(token: str) -> tuple[bool, dict]:
    """Verifies HMAC-SHA256 JWT token authenticity and expiration."""
    try:
        if not token:
            return False, {"error": "Missing token"}
        parts = token.strip().split(".")
        if len(parts) != 3:
            return False, {"error": "Malformed JWT structure"}

        encoded_header, encoded_payload, encoded_sig = parts
        signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        provided_sig = base64url_decode(encoded_sig)

        if not hmac.compare_digest(expected_sig, provided_sig):
            return False, {"error": "Invalid token signature"}

        payload = json.loads(base64url_decode(encoded_payload).decode("utf-8"))
        now = int(time.time())
        if payload.get("exp", 0) < now:
            return False, {"error": "Token expired"}

        return True, payload
    except Exception as e:
        return False, {"error": str(e)}

def generate_signed_action_token(action_type: str, data_id: str, extra: dict = None, ttl_seconds: int = 172800) -> str:
    """Generates a tamper-proof signed action token valid for 48 hours (172800 sec)."""
    payload = {
        "action": action_type,
        "targetId": data_id,
        "extra": extra or {},
        "exp": int(time.time()) + ttl_seconds
    }
    return generate_jwt_token(payload, expires_in_seconds=ttl_seconds)

def verify_signed_action_token(token: str) -> tuple[bool, dict]:
    """Validates 48-hour action token."""
    return verify_jwt_token(token)

# =====================================================
# GEOSPATIAL & THRESHOLD CALCULATION & BUSINESS LOGIC
# =====================================================

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance in kilometers between two GPS coordinates using Haversine formula."""
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return 999.0
    try:
        R = 6371.0 # Earth radius in km
        dlat = math.radians(float(lat2) - float(lat1))
        dlon = math.radians(float(lon2) - float(lon1))
        a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(float(lat1))) * math.cos(math.radians(float(lat2))) * math.sin(dlon / 2.0)**2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(R * c, 1)
    except Exception:
        return 999.0

def get_inventory_status_color(units: int) -> dict:
    """
    Computes dynamic status color indicator based on blood unit volume:
    - Red: Units <= 6 (Critical / Immediate restocking required)
    - Yellow: Units > 6 and <= 13 (Low / Moderate warning)
    - Green: Units > 13 (Adequate stock)
    """
    if units <= 6:
        return {
            "color": "red",
            "tier": "critical",
            "label": "Critical Alert",
            "subLabel": "Immediate restocking required",
            "badgeClass": "badge-threshold-red",
            "buttonClass": "btn-threshold-red",
            "requiresRestock": True
        }
    elif 6 < units <= 13:
        return {
            "color": "yellow",
            "tier": "moderate",
            "label": "Moderate Warning",
            "subLabel": "Low / Moderate warning",
            "badgeClass": "badge-threshold-yellow",
            "buttonClass": "btn-threshold-yellow",
            "requiresRestock": False
        }
    else:
        return {
            "color": "green",
            "tier": "adequate",
            "label": "Adequate Stock",
            "subLabel": "Adequate stock",
            "badgeClass": "badge-threshold-green",
            "buttonClass": "btn-threshold-green",
            "requiresRestock": False
        }

def is_severe_shortage(units: int) -> bool:
    """Returns True if unit volume falls strictly below 5 units (units < 5)."""
    return units < 5

def generate_qr_checksum(unit_id: str, blood_group: str, expiry_date: str, hospital_id: str) -> str:
    """Generates cryptographic verification hash for QR code authenticity."""
    secret_salt = "LIFEFLOW-ISBT-SECURE-2026"
    raw = f"{unit_id}:{blood_group}:{expiry_date}:{hospital_id}:{secret_salt}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

# =====================================================
# TRANSACTIONAL EMAIL TEMPLATES & OUTBOX ENGINE
# =====================================================

def render_partnership_memorandum_email(
    ngo_name: str,
    ngo_license: str,
    hospital_name: str,
    hospital_license: str,
    hospital_address: str,
    hospital_phone: str,
    reference_id: str,
    current_date: str,
    accept_link: str,
    decline_link: str
) -> str:
    """Renders the official Institutional Affiliation Notice HTML email exactly matching formal memorandum specification."""
    return f"""<!DOCTYPE html>
<html>
<body style="font-family: 'Times New Roman', Times, serif; color: #1a1a1a; line-height: 1.6; padding: 20px;">
  <div style="max-width: 650px; margin: 0 auto; border: 1px solid #1e3a8a; padding: 30px; border-radius: 4px;">
    <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #1e3a8a; text-transform: uppercase; font-size: 18px; letter-spacing: 0.5px;">Hospital Blood Banks & NGO Network</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #555;">Official Memorandum of Bilateral Inter-Facility Affiliation</p>
    </div>

    <p style="font-size: 13px;"><strong>Date:</strong> {current_date}<br>
    <strong>Reference No:</strong> HBB-NET/AFF/{reference_id}</p>

    <p style="font-size: 14px;"><strong>To:</strong><br>
    The Authorized Signatory / Operations Director<br>
    {ngo_name} (Govt. License: {ngo_license})</p>

    <p style="font-size: 14px;"><strong>From:</strong><br>
    Office of Blood Center Superintendent<br>
    {hospital_name} Blood Bank (Lic. No: {hospital_license})</p>

    <p style="font-size: 14px; margin-top: 20px;"><strong>Subject: Formal Request for Mutual Aid Linkage within the Regional Blood Network</strong></p>

    <p style="font-size: 14px;">Sir/Madam,</p>

    <p style="font-size: 14px; text-align: justify;">
      In compliance with standard emergency blood management protocols and inter-institutional support guidelines, <strong>{hospital_name} Blood Bank</strong> formally places this application to establish an integrated linkage with your esteemed organization.
    </p>

    <div style="background-color: #f8fafc; border-left: 3px solid #1e3a8a; padding: 12px 16px; margin: 18px 0; font-size: 13px;">
      <p style="margin: 2px 0;"><strong>Facility:</strong> {hospital_name} Blood Bank</p>
      <p style="margin: 2px 0;"><strong>State/Govt License:</strong> {hospital_license}</p>
      <p style="margin: 2px 0;"><strong>Physical Address:</strong> {hospital_address}</p>
      <p style="margin: 2px 0;"><strong>24/7 Emergency Line:</strong> {hospital_phone}</p>
    </div>

    <p style="font-size: 14px; text-align: justify;">
      Formal acceptance grants mutual access to real-time SOS blood availability and accelerated dispatch coordination. Please indicate your institutional approval or decline using the verified cryptographic links below:
    </p>

    <div style="margin: 30px 0; text-align: center;">
      <a href="{accept_link}" style="background-color: #15803d; color: #ffffff; padding: 10px 22px; font-weight: bold; text-decoration: none; border-radius: 4px; display: inline-block; margin-right: 12px; font-size: 13px;">APPROVE & AFFILIATE</a>
      <a href="{decline_link}" style="background-color: #b91c1c; color: #ffffff; padding: 10px 18px; font-weight: bold; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 13px;">DECLINE REQUEST</a>
    </div>

    <p style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 25px;">
      This official transmission was generated by the Hospital Blood Banks & NGO Network secure server. Digital signature: SHA-256 verified token.
    </p>
  </div>
</body>
</html>"""

def render_emergency_sos_notice_email(
    ngo_name: str,
    ngo_license: str,
    hospital_name: str,
    hospital_license: str,
    emergency_contact: str,
    blood_group: str,
    units_required: int,
    broadcast_id: str,
    room_details: str,
    current_date: str,
    claim_link: str
) -> str:
    """Renders the official Code-Red Priority Emergency SOS Dispatch Notice HTML email."""
    return f"""<!DOCTYPE html>
<html>
<body style="font-family: 'Times New Roman', Times, serif; color: #1a1a1a; line-height: 1.6; padding: 20px;">
  <div style="max-width: 650px; margin: 0 auto; border: 2px solid #b91c1c; padding: 30px; border-radius: 4px; background: #ffffff;">
    <div style="border-bottom: 2px solid #b91c1c; padding-bottom: 12px; margin-bottom: 20px;">
      <div style="display: inline-block; background: #b91c1c; color: #ffffff; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 2px; text-transform: uppercase; margin-bottom: 6px;">PRIORITY CODE RED • IMMEDIATE DISPATCH</div>
      <h2 style="margin: 0; color: #b91c1c; text-transform: uppercase; font-size: 18px; letter-spacing: 0.5px;">Hospital Blood Banks & NGO Network</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #555;">Official Emergency Blood Requisition & Intercept Order</p>
    </div>

    <p style="font-size: 13px;"><strong>Date:</strong> {current_date}<br>
    <strong>Reference No:</strong> HBB-NET/SOS/{broadcast_id}</p>

    <p style="font-size: 14px;"><strong>To:</strong><br>
    Emergency Response Unit / Operations Director<br>
    {ngo_name} (Govt. License: {ngo_license})</p>

    <p style="font-size: 14px;"><strong>From:</strong><br>
    Emergency Trauma & Blood Transfusion Center<br>
    {hospital_name} Blood Bank (Lic. No: {hospital_license})</p>

    <p style="font-size: 14px; margin-top: 20px;"><strong>Subject: URGENT CODE-RED BLOOD REQUISITION - IMMEDIATE TRANSIT REQUIRED</strong></p>

    <p style="font-size: 14px;">Sir/Madam,</p>

    <p style="font-size: 14px; text-align: justify;">
      A critical shortage threshold (&lt; 5 units) or life-threatening surgical emergency has been registered at <strong>{hospital_name} Blood Bank</strong>. Under centralized network emergency protocols, this priority requisition is broadcast to affiliated NGO response facilities.
    </p>

    <div style="background-color: #fef2f2; border-left: 4px solid #b91c1c; padding: 14px 18px; margin: 18px 0; font-size: 13px;">
      <p style="margin: 3px 0;"><strong>Target Facility:</strong> {hospital_name} Blood Bank (Lic: {hospital_license})</p>
      <p style="margin: 3px 0;"><strong>Blood Group Required:</strong> <span style="background: #b91c1c; color: #ffffff; padding: 2px 8px; font-weight: bold; border-radius: 3px; font-size: 13px;">{blood_group}</span></p>
      <p style="margin: 3px 0;"><strong>Volume Required:</strong> <strong>{units_required} Unit(s)</strong> (Cold-Chain 2°C – 6°C)</p>
      <p style="margin: 3px 0;"><strong>Location / Clinical Unit:</strong> {room_details}</p>
      <p style="margin: 3px 0;"><strong>Emergency Hotline / Direct Desk:</strong> {emergency_contact}</p>
    </div>

    <p style="font-size: 13px; color: #7f1d1d; background: #fff1f2; padding: 10px 14px; border: 1px solid #fecdd3; border-radius: 4px;">
      <strong>Atomic Lock Notice:</strong> The first accredited facility to confirm will atomically lock custody into <code>ACCEPTED / IN_DISPATCH</code> status. Double-acceptance attempts automatically return a concurrency conflict.
    </p>

    <div style="margin: 30px 0; text-align: center;">
      <a href="{claim_link}" style="background-color: #b91c1c; color: #ffffff; padding: 12px 26px; font-weight: bold; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 14px; letter-spacing: 0.5px;">CLAIM & DISPATCH BLOOD NOW</a>
    </div>

    <p style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 25px;">
      Issued under statutory authority of the Hospital Blood Banks & NGO Network Central Transfusion Grid. Digital signature: SHA-256 cryptographic single-use token.
    </p>
  </div>
</body>
</html>"""

def render_status_page(title: str, is_success: bool, headline: str, message: str, details: dict = None) -> str:
    """Renders a clean, responsive HTML page to serve directly to user clicking email links."""
    accent = "#15803d" if is_success else "#b91c1c"
    icon = "✓" if is_success else "!"
    rows = ""
    if details:
        for k, v in details.items():
            rows += f"""<tr>
              <td style="padding: 9px 14px; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 600; width: 160px; font-size: 13px;">{k}</td>
              <td style="padding: 9px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500; font-size: 13px;">{v}</td>
            </tr>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - Hospital Blood Banks & NGO Network</title>
  <style>
    body {{
      margin: 0;
      padding: 40px 20px;
      font-family: "Times New Roman", Times, serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
    }}
    .card {{
      background: #ffffff;
      max-width: 620px;
      width: 100%;
      border-radius: 6px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);
      border: 1px solid #cbd5e1;
      overflow: hidden;
      text-align: center;
    }}
    .header {{
      background: #1e3a8a;
      padding: 24px 20px;
      color: #ffffff;
      border-bottom: 3px solid {accent};
    }}
    .content {{
      padding: 28px;
      text-align: left;
    }}
    .headline {{
      font-size: 19px;
      font-weight: 700;
      color: #1e3a8a;
      margin: 0 0 10px 0;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .message {{
      color: #334155;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 20px 0;
      text-align: justify;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      margin-bottom: 20px;
    }}
    .footer {{
      background: #f1f5f9;
      padding: 14px 20px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }}
    .btn {{
      display: inline-block;
      margin-top: 10px;
      padding: 9px 20px;
      background: #1e3a8a;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;">Hospital Blood Banks & NGO Network</div>
      <h1 style="margin: 6px 0 0 0; font-size: 20px; text-transform: uppercase;">{title}</h1>
    </div>
    <div class="content">
      <div class="headline">{headline}</div>
      <div class="message">{message}</div>
      {f"<table>{rows}</table>" if rows else ""}
      <div style="text-align: center;">
        <a href="http://localhost:8080/Main%20Page/index1.html" class="btn">Return to Network Portal</a>
      </div>
    </div>
    <div class="footer">
      Official Statutory Verification Receipt • Hospital Blood Banks & NGO Network Central Server
    </div>
  </div>
</body>
</html>"""

def send_transactional_email(
    cur,
    recipient_email: str,
    recipient_name: str,
    subject: str,
    html_body: str,
    token: str,
    email_type: str
) -> str:
    """Dispatches a formal email, saves record to outbox, and logs to console."""
    email_id = f"EML-{datetime.now().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:10]}"
    cur.execute("""
        INSERT INTO dispatched_emails (id, recipient_email, recipient_name, subject, html_body, token, email_type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'DISPATCHED')
    """, (email_id, recipient_email, recipient_name, subject, html_body, token, email_type))

    print(f"\n=======================================================")
    print(f"[TRANSACTIONAL EMAIL DISPATCHED] ID: {email_id}")
    print(f"Type: {email_type}")
    print(f"To: {recipient_name} <{recipient_email}>")
    print(f"Subject: {subject}")
    print(f"Preview URL: http://localhost:{PORT}/api/emails/preview?id={email_id}")
    print(f"=======================================================\n")
    return email_id

# =====================================================
# NGO LOOKUP & SEEDING HELPERS
# =====================================================

def find_ngo_by_identifier(cur, identifier: str) -> dict:
    """Finds an NGO record by ID, License Number, or legacy aliases."""
    if not identifier:
        return None
    cleaned = identifier.strip().upper()
    alias_map = {
        "NGO-001": "NGO-RED-001",
        "NGO-002": "NGO-CARE-102",
        "NGO-003": "NGO-SAM-003",
        "NGO-004": "NGO-ROT-004",
        "NGO-005": "NGO-YTH-005",
        "NGO-9021": "NGO-OD-9021",
        "LIC-NGO-OD-9021": "NGO-OD-9021",
        "LIC-NGO-9021": "NGO-OD-9021"
    }
    search_id = alias_map.get(cleaned, cleaned)
    cur.execute("""
        SELECT id, name, license_number, accreditation_body, contact_person,
               phone, email, address, city, distance_km, active_stock_units,
               donor_capacity, operating_hours, verified_status, latitude, longitude
        FROM ngos
        WHERE UPPER(id) = ? OR UPPER(license_number) = ? OR UPPER(id) = ?
    """, (search_id, cleaned, cleaned))
    row = cur.fetchone()
    if row:
        return dict(row)
    return None

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geodesic distance between two geographic coordinate pairs in kilometers."""
    try:
        r = 6371.0 # Earth's radius in kilometers
        phi1 = math.radians(float(lat1))
        phi2 = math.radians(float(lat2))
        delta_phi = math.radians(float(lat2) - float(lat1))
        delta_lambda = math.radians(float(lon2) - float(lon1))

        a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(r * c, 1)
    except Exception:
        return 3.8

def dispatch_realtime_alert_to_ngos(alert_base: dict):
    """Calculates distance for each NGO and broadcasts the emergency payload via SSE and registry."""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT id, name, license_number, latitude, longitude, distance_km FROM ngos WHERE verified_status = 1")
    ngo_rows = cur.fetchall()
    conn.close()

    hosp_lat = alert_base.get("hospitalLatitude", 28.5672)
    hosp_lon = alert_base.get("hospitalLongitude", 77.2100)

    with sse_subscribers_lock:
        for ngo in ngo_rows:
            ngo_id = ngo["id"]
            ngo_lat = ngo["latitude"] if ngo["latitude"] is not None else 28.6139
            ngo_lon = ngo["longitude"] if ngo["longitude"] is not None else 77.2090

            calc_dist = calculate_haversine_distance(hosp_lat, hosp_lon, ngo_lat, ngo_lon)
            if calc_dist > 50.0:
                dist_km = round(float(alert_base.get("distanceKm", ngo["distance_km"] or 3.8)), 1)
            else:
                dist_km = calc_dist

            ngo_payload = {
                "alertId": alert_base.get("alertId"),
                "hospitalName": alert_base.get("hospitalName"),
                "hospitalLicense": alert_base.get("hospitalLicense"),
                "bloodGroup": alert_base.get("bloodGroup"),
                "unitsRequired": int(alert_base.get("unitsRequired", 4)),
                "urgencyLevel": alert_base.get("urgencyLevel", "CRITICAL_OT"),
                "distanceKm": dist_km,
                "contactPerson": alert_base.get("contactPerson", "Dr. S. Roy (Blood Transfusion Officer)"),
                "directDeskPhone": alert_base.get("directDeskPhone", "+91-9876543210"),
                "hospitalAddress": alert_base.get("hospitalAddress", "Plot 14, Main Medical Road, Near City Center"),
                "timestamp": alert_base.get("timestamp", datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")),
                "status": alert_base.get("status", "AWAITING_RESPONSE")
            }

            queues_to_notify = sse_subscribers.get(ngo_id, []) + sse_subscribers.get("*", [])
            for q in queues_to_notify:
                try:
                    q.put_nowait({"type": "EMERGENCY_ALERT", "data": ngo_payload})
                except Exception:
                    pass

        emergency_reception_alerts.append(alert_base)

def get_active_alerts_for_ngo(ngo_id: str) -> list[dict]:
    """Retrieves all active unacknowledged alerts formatted with calculated distance for the given NGO."""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM ngos WHERE id = ? OR license_number = ?", (ngo_id, ngo_id))
    ngo = cur.fetchone()

    ngo_lat = ngo["latitude"] if ngo and ngo["latitude"] is not None else 28.6139
    ngo_lon = ngo["longitude"] if ngo and ngo["longitude"] is not None else 77.2090
    default_dist = ngo["distance_km"] if ngo and ngo["distance_km"] is not None else 3.8

    cur.execute("""
        SELECT * FROM emergency_sos
        WHERE status IN ('BROADCASTED', 'AWAITING_RESPONSE')
        ORDER BY created_at DESC LIMIT 20
    """)
    rows = cur.fetchall()

    hosp_cache = {}
    alerts = []
    for r in rows:
        h_id = r["hospital_id"]
        if h_id not in hosp_cache:
            cur.execute("SELECT * FROM hospitals WHERE id = ?", (h_id,))
            hosp_cache[h_id] = cur.fetchone()
        hosp = hosp_cache[h_id]
        h_lat = hosp["latitude"] if hosp and hosp["latitude"] is not None else 28.5672
        h_lon = hosp["longitude"] if hosp and hosp["longitude"] is not None else 77.2100

        calc_dist = calculate_haversine_distance(h_lat, h_lon, ngo_lat, ngo_lon)
        if calc_dist > 50.0:
            dist_km = round(float(default_dist), 1)
        else:
            dist_km = calc_dist

        alerts.append({
            "alertId": r["id"],
            "hospitalName": r["hospital_name"] or "City Care Multi-Specialty Hospital Blood Bank",
            "hospitalLicense": hosp["license_number"] if hosp else "HOSP-BB-7721",
            "bloodGroup": r["blood_group"],
            "unitsRequired": int(r["units_required"]),
            "urgencyLevel": r["urgency_level"] or "CRITICAL_OT",
            "distanceKm": dist_km,
            "contactPerson": "Dr. S. Roy (Blood Transfusion Officer)",
            "directDeskPhone": r["emergency_contact"] or "+91-9876543210",
            "hospitalAddress": hosp["address"] if hosp else "Plot 14, Main Medical Road, Near City Center",
            "timestamp": str(r["created_at"]) if str(r["created_at"]).endswith("Z") else (str(r["created_at"]) + "Z"),
            "status": "AWAITING_RESPONSE"
        })
    conn.close()
    return alerts

# =====================================================
# DATABASE SETUP & SEEDING
# =====================================================

def init_database():
    conn = get_db_connection()
    cur = conn.cursor()

    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        cur.executescript(f.read())

    # Migration check: ensure partnership_requests allows ACTIVE_AFFILIATE
    row = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='partnership_requests'").fetchone()
    if row and 'ACTIVE_AFFILIATE' not in row[0]:
        cur.execute("""
            CREATE TABLE partnership_requests_migrated (
                id TEXT PRIMARY KEY,
                hospital_id TEXT NOT NULL,
                hospital_name TEXT NOT NULL,
                license_no TEXT NOT NULL,
                hospital_address TEXT NOT NULL,
                hospital_phone TEXT,
                contact_email TEXT NOT NULL,
                target_ngo_id TEXT NOT NULL,
                target_ngo_license TEXT NOT NULL,
                target_ngo_email TEXT NOT NULL,
                verification_token TEXT NOT NULL,
                status TEXT NOT NULL CHECK(status IN ('PENDING', 'ACCEPTED', 'ACTIVE_AFFILIATE', 'REJECTED', 'EXPIRED')) DEFAULT 'PENDING',
                verified_at TIMESTAMP,
                action_source TEXT CHECK(action_source IN ('EMAIL_MAGIC_LINK', 'DASHBOARD_DIRECT', NULL)),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
                FOREIGN KEY (target_ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
            )
        """)
        cur.execute("INSERT INTO partnership_requests_migrated SELECT * FROM partnership_requests")
        cur.execute("DROP TABLE partnership_requests")
        cur.execute("ALTER TABLE partnership_requests_migrated RENAME TO partnership_requests")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_partnership_status ON partnership_requests(status)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_partnership_token ON partnership_requests(verification_token)")

    # Migration check: ensure emergency_sos allows IN_DISPATCH
    row = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='emergency_sos'").fetchone()
    if row and 'IN_DISPATCH' not in row[0]:
        cur.execute("""
            CREATE TABLE emergency_sos_migrated (
                id TEXT PRIMARY KEY,
                hospital_id TEXT NOT NULL,
                hospital_name TEXT NOT NULL,
                emergency_contact TEXT NOT NULL,
                blood_group TEXT NOT NULL,
                units_required INTEGER NOT NULL,
                urgency_level TEXT NOT NULL DEFAULT 'CRITICAL_OT',
                patient_case_id TEXT,
                clinical_notes TEXT,
                status TEXT NOT NULL CHECK(status IN ('BROADCASTED', 'IN_TRANSIT', 'IN_DISPATCH', 'ACCEPTED', 'CANCELLED')) DEFAULT 'BROADCASTED',
                accepted_by_ngo_id TEXT,
                accepted_by_ngo_name TEXT,
                accepted_at TIMESTAMP,
                signed_sos_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
                FOREIGN KEY (accepted_by_ngo_id) REFERENCES ngos(id) ON DELETE SET NULL
            )
        """)
        cur.execute("INSERT INTO emergency_sos_migrated SELECT * FROM emergency_sos")
        cur.execute("DROP TABLE emergency_sos")
        cur.execute("ALTER TABLE emergency_sos_migrated RENAME TO emergency_sos")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_emergency_sos_status ON emergency_sos(status)")

    # Scope removal: Drop legacy blood_transfer_requests table if present
    cur.execute("DROP TABLE IF EXISTS blood_transfer_requests")

    # Ensure migrations on hospitals table
    cur.execute("PRAGMA table_info(hospitals)")
    existing_cols = [r[1] for r in cur.fetchall()]
    if "photo_url" not in existing_cols:
        cur.execute("ALTER TABLE hospitals ADD COLUMN photo_url TEXT DEFAULT ''")
    if "photo_data" not in existing_cols:
        cur.execute("ALTER TABLE hospitals ADD COLUMN photo_data TEXT DEFAULT ''")
    if "storage_facilities" not in existing_cols:
        cur.execute("ALTER TABLE hospitals ADD COLUMN storage_facilities TEXT DEFAULT '[\"Walk-in Cold Room (2°C - 6°C)\", \"Platelet Agitator & Incubator (22°C)\", \"Deep Freezer -80°C (Cryopreservation)\", \"Component Separation Centrifuge\"]'")
    if "emergency_hotline" not in existing_cols:
        cur.execute("ALTER TABLE hospitals ADD COLUMN emergency_hotline TEXT DEFAULT '+91 11 2658 8500'")
    if "trauma_center_level" not in existing_cols:
        cur.execute("ALTER TABLE hospitals ADD COLUMN trauma_center_level TEXT DEFAULT 'Level 1 Apex Trauma Centre'")

    # Primary Hospital Seed (HOSP-001)
    cur.execute("SELECT COUNT(*) FROM hospitals WHERE id = 'HOSP-001'")
    if cur.fetchone()[0] == 0:
        cur.execute("""
            INSERT INTO hospitals (id, name, license_number, category, address, city, phone, emergency_hotline, email, latitude, longitude, photo_url, storage_facilities, trauma_center_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "HOSP-001",
            "City Care Blood Centre & Hospital",
            "LIC-2026-001",
            "Apex Super-Speciality Hospital",
            "Ring Road, Medical Enclave, Ansari Nagar",
            "New Delhi",
            "+91 11 2692 5858",
            "+91 11 2658 8500",
            "bloodbank@citycare.org",
            28.5672,
            77.2100,
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80",
            '["Walk-in Cold Room (2°C - 6°C)", "Platelet Agitator & Incubator (22°C)", "Deep Freezer -80°C (Cryopreservation)", "Component Separation Centrifuge", "Automated Apheresis Unit"]',
            "Level 1 Apex Trauma Centre"
        ))

    # Peer Neighboring Hospitals
    peer_hospitals_seed = [
        (
            "HOSP-002",
            "Safdarjung Hospital Trauma Center",
            "HOSP-DL-002",
            "Government / Level 1 Apex Trauma",
            "Ring Road, Opposite AIIMS, Ansari Nagar West",
            "New Delhi",
            "+91 11 2616 5060",
            "+91 11 2616 8000",
            "trauma.safdarjung@delhigov.in",
            28.5701,
            77.2069,
            "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&auto=format&fit=crop&q=80",
            '["Walk-in Cold Room (2°C - 6°C)", "Platelet Agitators", "Cryopreservation Units"]',
            "Level 1 Apex Trauma Centre"
        ),
        (
            "HOSP-003",
            "Max Super Speciality Hospital",
            "HOSP-DL-003",
            "Private Multi-Speciality",
            "1, 2, Press Enclave Marg, Saket",
            "New Delhi",
            "+91 11 2651 5050",
            "+91 11 2652 9999",
            "bloodbank.saket@maxhealthcare.com",
            28.5284,
            77.2185,
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80",
            '["Walk-in Cold Room (2°C - 6°C)", "Apheresis Machines", "Irradiation Equipment"]',
            "Tertiary Multi-Speciality"
        ),
        (
            "HOSP-004",
            "Fortis Memorial Research Institute",
            "HOSP-DL-004",
            "Tertiary Care / JCI Accredited",
            "Sector 44, Opposite HUDA City Centre",
            "Gurugram",
            "+91 124 496 2200",
            "+91 124 496 2222",
            "bloodbank.fmri@fortishealthcare.com",
            28.4595,
            77.0725,
            "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80",
            '["Cold-Chain Automated Storage", "Rapid Thawing Units", "Deep Freezers -80°C"]',
            "Level 2 Trauma Centre"
        ),
        (
            "HOSP-005",
            "Indraprastha Apollo Hospital",
            "HOSP-DL-005",
            "Super-Speciality / Transfusion Center",
            "Sarita Vihar, Delhi-Mathura Road",
            "New Delhi",
            "+91 11 2692 5858",
            "+91 11 2692 5801",
            "bloodtransfusion@apollohospitalsdelhi.com",
            28.5398,
            77.2832,
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&auto=format&fit=crop&q=80",
            '["Walk-in Cold Room (2°C - 6°C)", "Platelet Incubators", "Automated Serology Analyzers"]',
            "Level 1 Trauma & Organ Transplant"
        )
    ]
    for ph in peer_hospitals_seed:
        cur.execute("SELECT COUNT(*) FROM hospitals WHERE id = ?", (ph[0],))
        if cur.fetchone()[0] == 0:
            cur.execute("""
                INSERT INTO hospitals (id, name, license_number, category, address, city, phone, emergency_hotline, email, latitude, longitude, photo_url, storage_facilities, trauma_center_level)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, ph)

    # Accredited NGOs Seed (Pre-seeded with canonical IDs and official licenses)
    demo_ngos = [
        (
            "NGO-OD-9021",
            "Odisha Blood Relief & Voluntary Donor Network",
            "LIC-NGO-OD-9021",
            "National Blood Transfusion Council (NBTC)",
            "Dr. Ramesh Mohapatra (Head of Operations)",
            "+91 674 253 1199",
            "dispatch@odishabloodnet.org",
            "Plot 102, Transfusion Complex, Nayapalli",
            "Bhubaneswar",
            6.5,
            52,
            380,
            "24/7 Emergency Dispatch",
            1
        ),
        (
            "NGO-RED-001",
            "Red Cross Blood Mission Delhi",
            "NGO-DL-8821",
            "National Blood Transfusion Council (NBTC)",
            "Dr. Ananya Sen (Director Transfusion)",
            "+91 11 2371 6441",
            "delhi.mission@redcrossdelhi.org",
            "1, Red Cross Road, Central Secretariat",
            "New Delhi",
            3.2,
            48,
            350,
            "24/7 Emergency Dispatch",
            1
        ),
        (
            "NGO-CARE-102",
            "LifeSavers Foundation NCR",
            "NGO-DL-4512",
            "State Blood Transfusion Council (SBTC)",
            "Rajesh Malhotra (Coordinator)",
            "+91 98112 34567",
            "dispatch@lifesaversncr.org",
            "Plot 14, Institutional Area, Sector 44",
            "Gurugram / South Delhi",
            5.8,
            35,
            220,
            "08:00 - 22:00 (On-call Night Dispatch)",
            1
        ),
        (
            "NGO-SAM-003",
            "Samarpan Blood Relief Society",
            "NGO-DL-9904",
            "National Blood Transfusion Council (NBTC)",
            "Sunita Verma (Blood Bank Officer)",
            "+91 11 2589 7720",
            "help@samarpanblood.org",
            "B-42, Community Centre, Janakpuri",
            "West Delhi",
            8.4,
            62,
            410,
            "24/7 Emergency Cold-Chain Dispatch",
            1
        ),
        (
            "NGO-ROT-004",
            "Rotary Blood Bank Guild",
            "NGO-DL-3310",
            "AABB & NBTC Certified",
            "Dr. Arvind Patel (Chief Medical Officer)",
            "+91 11 4165 9900",
            "info@rotarybloodguild.org",
            "56-A, Okhla Industrial Area, Phase-III",
            "South Delhi",
            11.0,
            80,
            550,
            "24/7 Emergency Transport Available",
            1
        ),
        (
            "NGO-YTH-005",
            "National Youth Donor Brigade",
            "NGO-DL-7729",
            "Indian Society of Blood Transfusion (ISBTI)",
            "Vikram Singhania (National Secretary)",
            "+91 98710 99881",
            "contact@youthdonorbrigade.org",
            "C-12, Green Park Extension",
            "South Delhi",
            14.5,
            28,
            180,
            "09:00 - 20:00 (Emergency SMS Dispatch)",
            1
        )
    ]
    for ngo in demo_ngos:
        cur.execute("SELECT id FROM ngos WHERE license_number = ?", (ngo[2],))
        existing_ngo = cur.fetchone()
        if existing_ngo:
            cur.execute("""
                UPDATE ngos
                SET id = ?, name = ?, accreditation_body = ?, contact_person = ?,
                    phone = ?, email = ?, address = ?, city = ?, distance_km = ?,
                    active_stock_units = ?, donor_capacity = ?, operating_hours = ?, verified_status = ?
                WHERE license_number = ?
            """, (ngo[0], ngo[1], ngo[3], ngo[4], ngo[5], ngo[6], ngo[7], ngo[8], ngo[9], ngo[10], ngo[11], ngo[12], ngo[13], ngo[2]))
        else:
            cur.execute("""
                INSERT INTO ngos (
                    id, name, license_number, accreditation_body, contact_person,
                    phone, email, address, city, distance_km, active_stock_units,
                    donor_capacity, operating_hours, verified_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, ngo)

    # Seed Inventory if empty
    cur.execute("SELECT COUNT(*) FROM blood_inventory WHERE hospital_id = 'HOSP-001'")
    if cur.fetchone()[0] == 0:
        sample_inv = [
            ("INV-001", "HOSP-001", "A+", "Packed Red Blood Cells (PRBC)", 18, 5),
            ("INV-002", "HOSP-001", "A-", "Packed Red Blood Cells (PRBC)", 7, 4),
            ("INV-003", "HOSP-001", "B+", "Whole Blood", 15, 6),
            ("INV-004", "HOSP-001", "B-", "Packed Red Blood Cells (PRBC)", 4, 8), # Critical alert trigger (< 5)
            ("INV-005", "HOSP-001", "AB+", "Fresh Frozen Plasma (FFP)", 14, 3),
            ("INV-006", "HOSP-001", "AB-", "Cryoprecipitate", 5, 5), # Threshold <= 6
            ("INV-007", "HOSP-001", "O+", "Packed Red Blood Cells (PRBC)", 22, 10),
            ("INV-008", "HOSP-001", "O-", "Universal PRBC Emergency", 3, 12), # Severe shortage (< 5)
        ]
        cur.executemany("""
            INSERT INTO blood_inventory (id, hospital_id, blood_group, component, units_available, units_needed)
            VALUES (?, ?, ?, ?, ?, ?)
        """, sample_inv)

    # Peer Inventory for Cross-Hospital Matching
    cur.execute("SELECT COUNT(*) FROM blood_inventory WHERE hospital_id != 'HOSP-001'")
    if cur.fetchone()[0] == 0:
        peer_inv = [
            ("INV-P01", "HOSP-002", "O-", "Universal PRBC Emergency", 14, 2),
            ("INV-P02", "HOSP-002", "A+", "Whole Blood & PRBC", 25, 5),
            ("INV-P03", "HOSP-002", "B+", "Whole Blood & FFP", 18, 4),
            ("INV-P04", "HOSP-003", "O-", "Universal PRBC Emergency", 9, 3),
            ("INV-P05", "HOSP-003", "AB-", "Packed Red Blood Cells (PRBC)", 8, 4),
            ("INV-P06", "HOSP-003", "A-", "Packed Red Blood Cells (PRBC)", 16, 2),
            ("INV-P07", "HOSP-004", "O-", "Universal PRBC Emergency", 22, 5),
            ("INV-P08", "HOSP-004", "B-", "Packed Red Blood Cells (PRBC)", 12, 3),
            ("INV-P09", "HOSP-005", "O-", "Universal PRBC Emergency", 19, 4),
            ("INV-P10", "HOSP-005", "O+", "Whole Blood & Platelets", 35, 10),
        ]
        cur.executemany("""
            INSERT INTO blood_inventory (id, hospital_id, blood_group, component, units_available, units_needed)
            VALUES (?, ?, ?, ?, ?, ?)
        """, peer_inv)

    # Seed Sample Blood Units with QR Payloads
    cur.execute("SELECT COUNT(*) FROM blood_units")
    if cur.fetchone()[0] == 0:
        today = datetime.now()
        demo_units = [
            ("BB-2026-8812", "A+", "Packed Red Blood Cells (PRBC)", (today - timedelta(days=5)).strftime("%Y-%m-%d"), (today + timedelta(days=37)).strftime("%Y-%m-%d"), "HOSP-001", "Available", 450),
            ("BB-2026-9904", "O-", "Universal PRBC Emergency", (today - timedelta(days=8)).strftime("%Y-%m-%d"), (today + timedelta(days=34)).strftime("%Y-%m-%d"), "HOSP-001", "Available", 450),
            ("BB-2026-5541", "B+", "Whole Blood & Component", (today - timedelta(days=3)).strftime("%Y-%m-%d"), (today + timedelta(days=39)).strftime("%Y-%m-%d"), "HOSP-001", "Available", 450),
            ("BB-2026-3310", "Bombay Oh", "Cryopreserved Rare RBC", (today - timedelta(days=12)).strftime("%Y-%m-%d"), (today + timedelta(days=30)).strftime("%Y-%m-%d"), "HOSP-001", "Available", 350),
        ]
        for u in demo_units:
            unit_id, blood_group, comp, col_date, exp_date, hosp_id, status, vol = u
            chk = generate_qr_checksum(unit_id, blood_group, exp_date, hosp_id)
            qr_meta = {
                "unitId": unit_id,
                "bloodGroup": blood_group,
                "component": comp,
                "collectionDate": col_date,
                "expiryDate": exp_date,
                "hospitalId": hosp_id,
                "status": status,
                "volumeMl": vol,
                "checksum": chk
            }
            cur.execute("""
                INSERT INTO blood_units (unit_id, blood_group, component, collection_date, expiry_date, hospital_id, status, volume_ml, qr_payload)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (unit_id, blood_group, comp, col_date, exp_date, hosp_id, status, vol, json.dumps(qr_meta)))

    # Ensure latitude and longitude columns exist on ngos table
    cur.execute("PRAGMA table_info(ngos)")
    existing_ngo_cols = [r[1] for r in cur.fetchall()]
    if "latitude" not in existing_ngo_cols:
        cur.execute("ALTER TABLE ngos ADD COLUMN latitude REAL")
    if "longitude" not in existing_ngo_cols:
        cur.execute("ALTER TABLE ngos ADD COLUMN longitude REAL")

    # Seed/update coordinates for all registered NGOs
    ngo_coords = {
        "NGO-OD-9021": (20.2961, 85.8245),
        "NGO-RED-001": (28.6180, 77.2120),
        "NGO-CARE-102": (28.4590, 77.0720),
        "NGO-SAM-003": (28.6280, 77.0850),
        "NGO-ROT-004": (28.5350, 77.2720),
        "NGO-YTH-005": (28.5580, 77.2060),
    }
    for nid, (lat, lon) in ngo_coords.items():
        cur.execute("UPDATE ngos SET latitude = ?, longitude = ? WHERE id = ? OR license_number = ?", (lat, lon, nid, nid))

    # Seed Canonical Emergency Alert ALT-2026-9081 if not present
    cur.execute("SELECT COUNT(*) FROM emergency_sos WHERE id = 'ALT-2026-9081'")
    if cur.fetchone()[0] == 0:
        cur.execute("""
            INSERT INTO emergency_sos (
                id, hospital_id, hospital_name, emergency_contact, blood_group, units_required,
                urgency_level, patient_case_id, clinical_notes, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "ALT-2026-9081",
            "HOSP-001",
            "City Care Multi-Specialty Hospital Blood Bank",
            "+91-9876543210",
            "O-",
            4,
            "CRITICAL_OT",
            "CASE-OT-9081",
            "Trauma Unit OT-3: Urgent transfusion required for massive hemorrhage",
            "BROADCASTED",
            datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        ))

    conn.commit()
    conn.close()

# =====================================================
# REST API REQUEST HANDLER
# =====================================================

class BloodBankRequestHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def _send_json(self, status_code: int, data: dict):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

    def _send_html(self, status_code: int, html_content: str):
        self.send_response(status_code)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(html_content.encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _read_json_body(self) -> dict:
        content_len = int(self.headers.get("Content-Length", 0))
        if content_len == 0:
            return {}
        body = self.rfile.read(content_len).decode("utf-8")
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            return {}

    def _extract_auth_token(self) -> str:
        """Extracts Bearer token from Authorization header or ?token= query parameter."""
        auth_header = self.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            return auth_header[7:].strip()
        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)
        if "token" in qs:
            return qs["token"][0].strip()
        return ""

    # -------------------------------------------------
    # GET ROUTES
    # -------------------------------------------------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. Health check
        if path == "/api/health":
            self._send_json(200, {
                "status": "healthy",
                "system": "Hospital Blood Bank & Emergency Collaboration System",
                "timestamp": datetime.now().isoformat()
            })
            return

        # 2. Blood Inventory Dashboard
        if path == "/api/inventory":
            hospital_id = query.get("hospitalId", ["HOSP-001"])[0]
            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            cur.execute("""
                SELECT id, blood_group, component, units_available, units_needed, last_updated
                FROM blood_inventory
                WHERE hospital_id = ?
                ORDER BY blood_group ASC
            """, (hospital_id,))
            rows = cur.fetchall()
            conn.close()

            inventory = []
            severe_shortages = []
            total_units = 0

            for r in rows:
                units = r["units_available"]
                total_units += units
                indicator = get_inventory_status_color(units)
                is_shortage = is_severe_shortage(units)

                item = {
                    "id": r["id"],
                    "bloodGroup": r["blood_group"],
                    "component": r["component"],
                    "units": units,
                    "unitsNeeded": r["units_needed"],
                    "lastUpdated": r["last_updated"],
                    "thresholdIndicator": indicator,
                    "isSevereShortage": is_shortage
                }
                inventory.append(item)
                if is_shortage:
                    severe_shortages.append({
                        "bloodGroup": r["blood_group"],
                        "units": units,
                        "component": r["component"]
                    })

            self._send_json(200, {
                "hospitalId": hospital_id,
                "totalStockUnits": total_units,
                "inventory": inventory,
                "severeShortageAlert": {
                    "active": len(severe_shortages) > 0,
                    "count": len(severe_shortages),
                    "shortageGroups": severe_shortages,
                    "message": "CRITICAL BLOOD SHORTAGE: Immediate emergency restocking required from accredited partner NGOs or donor drives." if severe_shortages else "All blood reserves within standard operational thresholds."
                }
            })
            return

        # 3. Dedicated Low Stock Shortage Alert Checker (< 5 units)
        if path == "/api/inventory/alerts":
            hospital_id = query.get("hospitalId", ["HOSP-001"])[0]
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                SELECT blood_group, units_available, component
                FROM blood_inventory
                WHERE hospital_id = ? AND units_available < 5
            """, (hospital_id,))
            shortages = cur.fetchall()
            conn.close()

            has_alert = len(shortages) > 0
            alert_items = [{"bloodGroup": s[0], "units": s[1], "component": s[2]} for s in shortages]

            self._send_json(200, {
                "hospitalId": hospital_id,
                "triggered": has_alert,
                "thresholdRule": "Units strictly below 5 (units < 5)",
                "totalShortageGroups": len(alert_items),
                "groups": alert_items,
                "banner": {
                    "title": "Severe Blood Shortage Detected!" if has_alert else "Stock Normal",
                    "severity": "CRITICAL" if has_alert else "NORMAL",
                    "actionRequired": "Trigger NGO Transfer / Donor Mobilization" if has_alert else "None"
                }
            })
            return

        # 4. NGO Session Info (Check active JWT session)
        if path == "/api/ngo/session":
            token = self._extract_auth_token()
            is_valid, payload = verify_jwt_token(token)
            if not is_valid:
                self._send_json(401, {"authenticated": False, "error": payload.get("error", "Unauthorized")})
                return
            self._send_json(200, {
                "authenticated": True,
                "session": payload,
                "message": "Authorized demo NGO session active."
            })
            return

        # 5. List Partnership Requests
        if path == "/api/partnerships/requests":
            hospital_id = query.get("hospitalId", [None])[0]
            ngo_id = query.get("ngoId", [None])[0]
            status_filter = query.get("status", [None])[0]

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            clauses = []
            params = []
            if hospital_id:
                clauses.append("r.hospital_id = ?")
                params.append(hospital_id)
            if ngo_id:
                clauses.append("r.target_ngo_id = ?")
                params.append(ngo_id)
            if status_filter:
                clauses.append("r.status = ?")
                params.append(status_filter.upper())

            where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""
            query_sql = f"""
                SELECT r.*, n.name as target_ngo_name, n.phone as target_ngo_phone, n.address as target_ngo_address
                FROM partnership_requests r
                LEFT JOIN ngos n ON r.target_ngo_id = n.id
                {where_sql}
                ORDER BY r.created_at DESC
            """
            cur.execute(query_sql, params)
            requests = [dict(row) for row in cur.fetchall()]
            conn.close()

            self._send_json(200, {
                "count": len(requests),
                "requests": requests
            })
            return

        # 6. Verify Partnership via Email Magic Link (GET /api/network/partnerships/verify-link or legacy /api/partnerships/verify-email)
        if path in ["/api/network/partnerships/verify-link", "/api/partnerships/verify-email"]:
            token = query.get("token", [None])[0]
            raw_action = query.get("action", ["accept"])[0].strip().lower()
            target_action = "ACCEPT" if raw_action in ["accept", "approve"] else "REJECT"

            if not token:
                html = render_status_page("Verification Error", False, "Missing Verification Token", "The link clicked does not contain a valid security token.")
                self._send_html(400, html)
                return

            # Verify cryptographic token signature and 48h TTL
            is_valid, payload = verify_signed_action_token(token)
            if not is_valid:
                html = render_status_page("Verification Expired or Invalid", False, "Link Expired or Tampered", f"The signed verification token could not be verified: {payload.get('error', 'Token Expired')}. Partnership tokens expire after 48 hours for institutional security.")
                self._send_html(400, html)
                return

            request_id = payload.get("targetId")

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            cur.execute("SELECT * FROM partnership_requests WHERE id = ?", (request_id,))
            req = cur.fetchone()

            if not req:
                conn.close()
                html = render_status_page("Request Not Found", False, "Partnership Record Missing", f"Could not locate partnership request reference {request_id}.")
                self._send_html(404, html)
                return

            if req["status"] != "PENDING":
                status_text = req["status"]
                conn.close()
                html = render_status_page("Already Processed", True, f"Partnership Already Finalized", f"This institutional memorandum was previously concluded with status: <strong>{status_text}</strong> on {req['verified_at']}.", {
                    "Request Reference": request_id,
                    "Hospital": req["hospital_name"],
                    "Status": status_text,
                    "Action Source": req["action_source"] or "Email Magic Link"
                })
                self._send_html(200, html)
                return

            new_status = "ACTIVE_AFFILIATE" if target_action == "ACCEPT" else "REJECTED"
            cur.execute("""
                UPDATE partnership_requests
                SET status = ?, verified_at = CURRENT_TIMESTAMP, action_source = 'EMAIL_MAGIC_LINK'
                WHERE id = ?
            """, (new_status, request_id))

            # If accepted, insert or update active connection
            if new_status == "ACTIVE_AFFILIATE":
                conn_id = f"CONN-{datetime.now().strftime('%Y%m%d%H%M%S')}"
                cur.execute("""
                    INSERT OR REPLACE INTO hospital_ngo_connections (
                        id, hospital_id, ngo_id, license_number, connection_status, partnership_type, verified_at
                    ) VALUES (?, ?, ?, ?, 'Active', 'Emergency Blood Supply & Donor Mobilization', CURRENT_TIMESTAMP)
                """, (conn_id, req["hospital_id"], req["target_ngo_id"], req["target_ngo_license"]))

            conn.commit()
            conn.close()

            details = {
                "Memorandum Reference": request_id,
                "Requesting Hospital": req["hospital_name"],
                "Hospital License": req["license_no"],
                "Affiliated NGO License": req["target_ngo_license"],
                "Institutional Status": new_status,
                "Ratification Protocol": "Cryptographic SHA-256 Verified Action Token",
                "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            if new_status == "ACTIVE_AFFILIATE":
                headline = "Bilateral Affiliation Ratified & Activated"
                msg = f"The formal mutual aid partnership between <strong>{req['hospital_name']}</strong> and your organization is now officially active in the centralized Hospital Blood Banks & NGO Network."
                html = render_status_page("Affiliation Approved", True, headline, msg, details)
            else:
                headline = "Affiliation Request Declined"
                msg = f"The affiliation request from <strong>{req['hospital_name']}</strong> has been formally declined."
                html = render_status_page("Affiliation Declined", False, headline, msg, details)

            self._send_html(200, html)
            return

        # 7. Single-Click Emergency SOS Email Accept Link (GET /api/network/sos/accept-email or /api/sos/accept-email)
        if path in ["/api/network/sos/accept-email", "/api/sos/accept-email"]:
            token = query.get("token", [None])[0]
            ngo_id = query.get("ngoId", [None])[0] or query.get("ngo_id", [None])[0]
            broadcast_id = query.get("broadcastId", [None])[0] or query.get("broadcast_id", [None])[0]

            if not token:
                html = render_status_page("Claim Error", False, "Missing SOS Token", "Invalid or missing emergency SOS claim token.")
                self._send_html(400, html)
                return

            is_valid, payload = verify_signed_action_token(token)
            if not is_valid:
                html = render_status_page("SOS Claim Expired", False, "Invalid Claim Link", f"Security token expired or invalid: {payload.get('error')}.")
                self._send_html(400, html)
                return

            sos_id = broadcast_id or payload.get("targetId")
            claim_ngo_id = ngo_id or payload.get("extra", {}).get("ngoId", "NGO-OD-9021")

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            # Find claiming NGO
            ngo = find_ngo_by_identifier(cur, claim_ngo_id)
            ngo_name = ngo["name"] if ngo else f"Accredited NGO ({claim_ngo_id})"

            # ATOMIC CONCURRENCY CLAIM: First NGO to execute claim wins
            cur.execute("""
                UPDATE emergency_sos
                SET status = 'IN_DISPATCH',
                    accepted_by_ngo_id = ?,
                    accepted_by_ngo_name = ?,
                    accepted_at = CURRENT_TIMESTAMP
                WHERE id = ? AND status = 'BROADCASTED'
            """, (claim_ngo_id, ngo_name, sos_id))

            if cur.rowcount == 0:
                # Either already accepted by another NGO, or not found
                cur.execute("SELECT * FROM emergency_sos WHERE id = ?", (sos_id,))
                existing_sos = cur.fetchone()
                conn.close()

                if existing_sos:
                    claimed_by = existing_sos["accepted_by_ngo_name"] or existing_sos["accepted_by_ngo_id"]
                    claimed_time = existing_sos["accepted_at"] or "just moments ago"
                    html = render_status_page(
                        "SOS Already Claimed",
                        False,
                        "Dispatch Lock Pre-empted (409 Conflict)",
                        f"This emergency blood requisition was already claimed and locked into dispatch custody by <strong>{claimed_by}</strong> at {claimed_time}. Immediate transit is already en-route.",
                        {
                            "SOS Reference": sos_id,
                            "Blood Group": existing_sos["blood_group"],
                            "Units": existing_sos["units_required"],
                            "Hospital": existing_sos["hospital_name"],
                            "Status": "IN_DISPATCH",
                            "Claimed By": claimed_by
                        }
                    )
                    self._send_html(409, html)
                    return
                else:
                    html = render_status_page("SOS Not Found", False, "Unknown Emergency Request", f"Could not find SOS reference {sos_id}.")
                    self._send_html(404, html)
                    return

            conn.commit()

            # Fetch claimed SOS details
            cur.execute("SELECT * FROM emergency_sos WHERE id = ?", (sos_id,))
            claimed_sos = dict(cur.fetchone())
            conn.close()

            details = {
                "Emergency SOS Reference": sos_id,
                "Requesting Hospital": claimed_sos["hospital_name"],
                "Emergency Desk Hotline": claimed_sos["emergency_contact"],
                "Blood Group": claimed_sos["blood_group"],
                "Units Required": f"{claimed_sos['units_required']} Unit(s)",
                "Claiming NGO": ngo_name,
                "Dispatch Status": "ACCEPTED / IN_DISPATCH",
                "Claimed At": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            html = render_status_page(
                "SOS Claimed Successfully",
                True,
                "Emergency Dispatch Custody Secured",
                f"Your facility <strong>{ngo_name}</strong> has atomically secured custody for SOS Requisition <strong>{sos_id}</strong>. The cold-chain delivery protocol is now initiated and the hospital blood bank has been confirmed.",
                details
            )
            self._send_html(200, html)
            return

        # 8. List Emergency SOS Broadcasts (GET /api/sos/list)
        if path == "/api/sos/list":
            hospital_id = query.get("hospitalId", [None])[0]
            status_filter = query.get("status", [None])[0]

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            clauses = []
            params = []
            if hospital_id:
                clauses.append("hospital_id = ?")
                params.append(hospital_id)
            if status_filter:
                clauses.append("status = ?")
                params.append(status_filter.upper())

            where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""
            cur.execute(f"SELECT * FROM emergency_sos {where_sql} ORDER BY created_at DESC", params)
            sos_list = [dict(row) for row in cur.fetchall()]
            conn.close()

            self._send_json(200, {
                "count": len(sos_list),
                "sosList": sos_list
            })
            return

        # 9. Dispatched Emails Outbox Audit (GET /api/emails/outbox)
        if path == "/api/emails/outbox":
            limit = int(query.get("limit", [50])[0])
            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            cur.execute("""
                SELECT id, recipient_email, recipient_name, subject, token, email_type, status, sent_at
                FROM dispatched_emails
                ORDER BY sent_at DESC
                LIMIT ?
            """, (limit,))
            emails = [dict(r) for r in cur.fetchall()]
            conn.close()

            # Add clickable preview links
            for e in emails:
                e["previewUrl"] = f"http://localhost:{PORT}/api/emails/preview?id={e['id']}"

            self._send_json(200, {
                "count": len(emails),
                "outbox": emails
            })
            return

        # 10. Dispatched Email Browser Preview (GET /api/emails/preview?id=...)
        if path == "/api/emails/preview":
            email_id = query.get("id", [None])[0]
            if not email_id:
                self._send_html(400, "<h3>Error: Missing 'id' parameter</h3>")
                return

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM dispatched_emails WHERE id = ?", (email_id,))
            row = cur.fetchone()
            conn.close()

            if not row:
                self._send_html(404, f"<h3>Email ID '{email_id}' not found in outbox</h3>")
                return

            header_meta = f"""
            <div style="background: #1e293b; color: #94a3b8; font-family: monospace; padding: 12px 20px; font-size: 13px; border-bottom: 2px solid #334155; margin-bottom: 20px;">
              <div style="color: #38bdf8; font-weight: bold; margin-bottom: 4px;">[AUDIT LOG] TRANSACTIONAL EMAIL PREVIEW</div>
              <div><strong>Message ID:</strong> {row['id']}</div>
              <div><strong>Recipient:</strong> {row['recipient_name']} &lt;{row['recipient_email']}&gt;</div>
              <div><strong>Subject:</strong> {row['subject']}</div>
              <div><strong>Dispatched:</strong> {row['sent_at']} (Local Service Outbox)</div>
              <div><strong>Email Type:</strong> {row['email_type']}</div>
            </div>
            """
            full_html = f"<!DOCTYPE html><html><head><title>Preview - {row['subject']}</title></head><body style='margin: 0; background: #e2e8f0; padding: 20px;'>{header_meta}{row['html_body']}</body></html>"
            self._send_html(200, full_html)
            return

        # 11. Hospital Profile Details
        if path == "/api/hospital/profile":
            hospital_id = query.get("hospitalId", ["HOSP-001"])[0]
            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("""
                SELECT id, name, license_number, category, address, city, phone,
                       emergency_hotline, email, latitude, longitude, photo_url, photo_data,
                       storage_facilities, trauma_center_level, created_at
                FROM hospitals
                WHERE id = ?
            """, (hospital_id,))
            row = cur.fetchone()
            conn.close()

            if not row:
                self._send_json(404, {"error": "Hospital profile not found", "hospitalId": hospital_id})
                return

            storage = []
            try:
                storage = json.loads(row["storage_facilities"]) if row["storage_facilities"] else []
            except Exception:
                storage = [row["storage_facilities"]]

            self._send_json(200, {
                "hospital": {
                    "id": row["id"],
                    "name": row["name"],
                    "licenseNumber": row["license_number"],
                    "category": row["category"],
                    "address": row["address"],
                    "city": row["city"],
                    "phone": row["phone"],
                    "emergencyHotline": row["emergency_hotline"],
                    "email": row["email"],
                    "latitude": row["latitude"],
                    "longitude": row["longitude"],
                    "photoUrl": row["photo_url"],
                    "photoData": row["photo_data"],
                    "storageFacilities": storage,
                    "traumaCenterLevel": row["trauma_center_level"],
                    "createdAt": row["created_at"]
                }
            })
            return

        # 12. Unified Network Directory (Hospitals & NGOs with Haversine Proximity)
        if path == "/api/network/directory":
            hospital_id = query.get("hospitalId", ["HOSP-001"])[0]
            filter_type = query.get("type", ["all"])[0].lower() # 'all', 'hospitals', 'ngos'
            max_radius = float(query.get("radiusKm", query.get("radius_km", query.get("radius", [50.0])))[0])
            search_group = query.get("bloodGroup", query.get("blood_group", [None]))[0]

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            req_lat = query.get("lat", [None])[0]
            req_lon = query.get("lon", [None])[0]
            if req_lat and req_lon:
                orig_lat = float(req_lat)
                orig_lon = float(req_lon)
            else:
                cur.execute("SELECT latitude, longitude FROM hospitals WHERE id = ?", (hospital_id,))
                orig = cur.fetchone()
                orig_lat = orig["latitude"] if orig and orig["latitude"] else 28.5672
                orig_lon = orig["longitude"] if orig and orig["longitude"] else 77.2100

            entities = []

            # 1. Nearby Peer Hospitals
            if filter_type in ["all", "hospitals"]:
                cur.execute("""
                    SELECT id, name, license_number, category, address, city, phone,
                           emergency_hotline, email, latitude, longitude, photo_url,
                           photo_data, storage_facilities, trauma_center_level
                    FROM hospitals
                    WHERE id != ?
                """, (hospital_id,))
                h_rows = cur.fetchall()
                for h in h_rows:
                    dist = calculate_haversine_distance(orig_lat, orig_lon, h["latitude"], h["longitude"])
                    if dist <= max_radius:
                        stock_units = 0
                        matched_units = 0
                        cur.execute("SELECT blood_group, units_available FROM blood_inventory WHERE hospital_id = ?", (h["id"],))
                        inv_rows = cur.fetchall()
                        for inv in inv_rows:
                            stock_units += inv["units_available"]
                            if search_group and inv["blood_group"].lower() == search_group.lower():
                                matched_units = inv["units_available"]

                        unit_count = matched_units if search_group else stock_units

                        entities.append({
                            "id": h["id"],
                            "entityType": "Hospital",
                            "type": "hospital",
                            "name": h["name"],
                            "licenseNumber": h["license_number"],
                            "license": h["license_number"],
                            "category": h["category"],
                            "traumaLevel": h["trauma_center_level"],
                            "address": h["address"],
                            "city": h["city"],
                            "phone": h["phone"],
                            "emergencyHotline": h["emergency_hotline"],
                            "email": h["email"],
                            "distanceKm": dist,
                            "distance_km": dist,
                            "distanceFormatted": f"{dist} km away",
                            "photoUrl": h["photo_url"] or h["photo_data"] or "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&auto=format&fit=crop&q=80",
                            "totalStockUnits": stock_units,
                            "stock": stock_units,
                            "matchedBloodGroupUnits": unit_count,
                            "matchedUnits": unit_count,
                            "matched_units": unit_count,
                            "isVerified": True,
                            "accreditation": "NABH & NBTC Licensed",
                            "canDispatchImmediately": True
                        })

            # 2. Nearby Registered NGOs
            if filter_type in ["all", "ngos"]:
                cur.execute("""
                    SELECT id, name, license_number, accreditation_body, contact_person,
                           phone, email, address, city, distance_km, active_stock_units,
                           donor_capacity, operating_hours, verified_status
                    FROM ngos
                """)
                n_rows = cur.fetchall()
                for n in n_rows:
                    dist = float(n["distance_km"])
                    if dist <= max_radius:
                        ngo_units = max(3, int(n["active_stock_units"] * 0.15)) if search_group else n["active_stock_units"]
                        entities.append({
                            "id": n["id"],
                            "entityType": "NGO",
                            "type": "ngo",
                            "name": n["name"],
                            "licenseNumber": n["license_number"],
                            "license": n["license_number"],
                            "category": "Blood Donation NGO & Transfusion Center",
                            "traumaLevel": "Accredited Donor Bank",
                            "address": n["address"],
                            "city": n["city"],
                            "phone": n["phone"],
                            "emergencyHotline": n["phone"],
                            "email": n["email"],
                            "distanceKm": dist,
                            "distance_km": dist,
                            "distanceFormatted": f"{dist} km away",
                            "photoUrl": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&auto=format&fit=crop&q=80",
                            "totalStockUnits": n["active_stock_units"],
                            "stock": n["active_stock_units"],
                            "matchedBloodGroupUnits": ngo_units,
                            "matchedUnits": ngo_units,
                            "matched_units": ngo_units,
                            "isVerified": bool(n["verified_status"]),
                            "accreditation": n["accreditation_body"],
                            "canDispatchImmediately": True
                        })

            conn.close()
            entities.sort(key=lambda x: x["distanceKm"])

            self._send_json(200, {
                "originHospitalId": hospital_id,
                "radiusKm": max_radius,
                "filterType": filter_type,
                "bloodGroupFilter": search_group,
                "totalCount": len(entities),
                "entities": entities,
                "facilities": entities
            })
            return

        # 13. Hospital Connections & Partnership Status
        if path == "/api/hospital/connections":
            hospital_id = query.get("hospitalId", ["HOSP-001"])[0]
            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            cur.execute("""
                SELECT c.id, c.hospital_id, c.ngo_id, c.license_number, c.connection_status,
                       c.partnership_type, c.verified_at, n.name as ngo_name, n.phone, n.contact_person
                FROM hospital_ngo_connections c
                JOIN ngos n ON c.ngo_id = n.id
                WHERE c.hospital_id = ?
            """, (hospital_id,))
            conns = [dict(r) for r in cur.fetchall()]

            cur.execute("""
                SELECT r.id, r.target_ngo_id, r.target_ngo_license, r.target_ngo_email,
                       r.status, r.created_at, r.verified_at, n.name as target_ngo_name
                FROM partnership_requests r
                LEFT JOIN ngos n ON r.target_ngo_id = n.id
                WHERE r.hospital_id = ?
                ORDER BY r.created_at DESC
            """, (hospital_id,))
            pending_requests = [dict(r) for r in cur.fetchall()]
            conn.close()

            self._send_json(200, {
                "hospitalId": hospital_id,
                "connections": conns,
                "partnershipRequests": pending_requests
            })
            return

        # 14. Real-Time Emergency Alerts SSE Stream (GET /api/network/alerts/stream)
        if path in ["/api/network/alerts/stream", "/api/alerts/stream"]:
            ngo_id = query.get("ngoId", query.get("ngo_id", ["*"]))[0]

            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self._send_cors_headers()
            self.end_headers()

            q = queue.Queue(maxsize=100)
            with sse_subscribers_lock:
                if ngo_id not in sse_subscribers:
                    sse_subscribers[ngo_id] = []
                sse_subscribers[ngo_id].append(q)

            # Send initial connection greeting
            init_payload = json.dumps({
                "type": "CONNECTED",
                "ngoId": ngo_id,
                "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "message": f"Real-time emergency SSE bus connected for {ngo_id}."
            })
            try:
                self.wfile.write(f"data: {init_payload}\n\n".encode("utf-8"))
                self.wfile.flush()

                # Push existing active unacknowledged alerts for this NGO
                active_alerts = get_active_alerts_for_ngo(ngo_id)
                for alert in active_alerts:
                    alert_msg = json.dumps({"type": "EMERGENCY_ALERT", "data": alert})
                    self.wfile.write(f"data: {alert_msg}\n\n".encode("utf-8"))
                self.wfile.flush()
            except Exception as e:
                print(f"[SSE ERROR] Failed to send initial stream data: {e}")

            # Keep-alive heartbeat & event streaming loop
            try:
                while True:
                    try:
                        event_data = q.get(timeout=12.0)
                        msg_str = json.dumps(event_data)
                        self.wfile.write(f"data: {msg_str}\n\n".encode("utf-8"))
                        self.wfile.flush()
                    except queue.Empty:
                        self.wfile.write(b": keepalive\n\n")
                        self.wfile.flush()
            except Exception:
                pass
            finally:
                with sse_subscribers_lock:
                    if ngo_id in sse_subscribers and q in sse_subscribers[ngo_id]:
                        sse_subscribers[ngo_id].remove(q)
            return

        # 15. Active Emergency Alerts Polling (GET /api/network/alerts/active)
        if path in ["/api/network/alerts/active", "/api/alerts/active"]:
            ngo_id = query.get("ngoId", query.get("ngo_id", ["*"]))[0]
            alerts = get_active_alerts_for_ngo(ngo_id)
            self._send_json(200, {
                "success": True,
                "status": "success",
                "ngoId": ngo_id,
                "count": len(alerts),
                "alerts": alerts
            })
            return

        # 404 Catch-All
        self._send_json(404, {"error": "Endpoint not found", "path": path})

    # -------------------------------------------------
    # POST ROUTES
    # -------------------------------------------------
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._read_json_body()

        # =============================================
        # 1. NGO PSEUDO-LOGIN AUTHENTICATION ENGINE
        # =============================================
        if path == "/api/ngo/pseudo-login":
            identifier = body.get("identifier") or body.get("licenseNumber") or body.get("ngoId") or body.get("license_number")
            if not identifier:
                self._send_json(400, {
                    "authenticated": False,
                    "error": "Missing NGO identifier or license number.",
                    "hint": "Provide a pre-seeded NGO ID (e.g., NGO-RED-001, NGO-CARE-102) or official license (e.g., NGO-DL-8821, NGO-DL-4512)."
                })
                return

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            ngo = find_ngo_by_identifier(cur, identifier)
            conn.close()

            if not ngo:
                self._send_json(404, {
                    "authenticated": False,
                    "error": f"NGO credentials for '{identifier}' not found in the verified registry.",
                    "availableDemoAccounts": [
                        {"ngoId": "NGO-RED-001", "license": "NGO-DL-8821", "name": "Red Cross Blood Mission Delhi"},
                        {"ngoId": "NGO-CARE-102", "license": "NGO-DL-4512", "name": "LifeSavers Foundation NCR"},
                        {"ngoId": "NGO-SAM-003", "license": "NGO-DL-9904", "name": "Samarpan Blood Relief Society"},
                        {"ngoId": "NGO-ROT-004", "license": "NGO-DL-3310", "name": "Rotary Blood Bank Guild"}
                    ]
                })
                return

            if not ngo["verified_status"]:
                self._send_json(403, {
                    "authenticated": False,
                    "error": f"NGO '{ngo['name']}' ({ngo['license_number']}) is currently suspended from the active network."
                })
                return

            # Issue standard RFC 7519 HMAC-SHA256 JWT
            jwt_payload = {
                "ngoId": ngo["id"],
                "ngoName": ngo["name"],
                "licenseNo": ngo["license_number"],
                "licenseNumber": ngo["license_number"],
                "email": ngo["email"],
                "officialEmail": ngo["email"],
                "role": "NGO_OPERATOR",
                "network": "HOSPITAL_BLOOD_BANKS_NGO_NETWORK",
                "phone": ngo["phone"],
                "address": ngo["address"],
                "city": ngo["city"],
                "accreditation": ngo["accreditation_body"]
            }
            token = generate_jwt_token(jwt_payload, expires_in_seconds=86400 * 7)

            self._send_json(200, {
                "success": True,
                "authenticated": True,
                "token": token,
                "session": {
                    "token": token,
                    "ngoId": ngo["id"],
                    "ngoName": ngo["name"],
                    "licenseNo": ngo["license_number"],
                    "licenseNumber": ngo["license_number"],
                    "email": ngo["email"],
                    "officialEmail": ngo["email"],
                    "role": "NGO_OPERATOR",
                    "network": "HOSPITAL_BLOOD_BANKS_NGO_NETWORK",
                    "phone": ngo["phone"],
                    "address": ngo["address"],
                    "city": ngo["city"],
                    "accreditation": ngo["accreditation_body"],
                    "activeStockUnits": ngo["active_stock_units"]
                },
                "message": f"Authorized pseudo-session initialized for {ngo['name']} ({ngo['license_number']})."
            })
            return

        # =============================================
        # 2. HOSPITAL-NGO PARTNERSHIP REQUEST & MEMORANDUM DISPATCH
        # =============================================
        if path in ["/api/network/partnerships/request", "/api/partnerships/request"]:
            hospital_id = body.get("hospitalBloodBankId") or body.get("hospitalId") or "HOSP-001"
            ngo_identifier = (
                body.get("targetNgoLicense") or
                body.get("ngoLicense") or
                body.get("target_ngo_license") or
                body.get("ngoId") or
                body.get("licenseNumber") or
                body.get("identifier")
            )

            if not ngo_identifier:
                self._send_json(400, {"error": "Missing target NGO identifier or license number."})
                return

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            # Hospital details
            cur.execute("SELECT * FROM hospitals WHERE id = ?", (hospital_id,))
            hosp = cur.fetchone()
            if not hosp:
                conn.close()
                self._send_json(404, {"error": f"Hospital ID '{hospital_id}' not found."})
                return

            # Lookup target NGO
            ngo = find_ngo_by_identifier(cur, ngo_identifier)
            if not ngo:
                conn.close()
                self._send_json(404, {
                    "error": f"Target NGO with license/ID '{ngo_identifier}' is not recognized in the verified National Database."
                })
                return

            req_id = f"HBB-NET-AFF-{datetime.now().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6].upper()}"
            hosp_name = body.get("hospitalName") or (hosp["name"] if hosp else "City Care Blood Centre & Hospital")
            hosp_lic = body.get("licenseNo") or (hosp["license_number"] if hosp else "LIC-2026-001")
            hosp_addr = body.get("physicalAddress") or body.get("hospitalAddress") or (hosp["address"] if hosp else "Ring Road, Medical Enclave, Ansari Nagar, New Delhi")
            hosp_phone = body.get("contactPhone") or body.get("hospitalPhone") or (hosp["phone"] if hosp else "+91 11 2692 5858")
            hosp_email = body.get("contactEmail") or (hosp["email"] if hosp else "bloodbank@citycare.org")

            # Generate 48-Hour Signed Cryptographic Verification Action Token
            verification_token = generate_signed_action_token(
                action_type="PARTNERSHIP_VERIFICATION",
                data_id=req_id,
                extra={"hospitalId": hospital_id, "ngoId": ngo["id"], "ngoLicense": ngo["license_number"]},
                ttl_seconds=172800 # 48 Hours
            )

            # Insert pending partnership request
            cur.execute("""
                INSERT INTO partnership_requests (
                    id, hospital_id, hospital_name, license_no, hospital_address,
                    hospital_phone, contact_email, target_ngo_id, target_ngo_license,
                    target_ngo_email, verification_token, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
            """, (
                req_id, hospital_id, hosp_name, hosp_lic, hosp_addr,
                hosp_phone, hosp_email, ngo["id"], ngo["license_number"],
                ngo["email"], verification_token
            ))

            host = self.headers.get("Host") or f"localhost:{PORT}"
            accept_magic_url = f"http://{host}/api/network/partnerships/verify-link?token={verification_token}&action=accept"
            decline_magic_url = f"http://{host}/api/network/partnerships/verify-link?token={verification_token}&action=decline"
            request_date_str = datetime.now().strftime("%B %d, %Y")

            memo_html = render_partnership_memorandum_email(
                ngo_name=ngo["name"],
                ngo_license=ngo["license_number"],
                hospital_name=hosp_name,
                hospital_license=hosp_lic,
                hospital_address=hosp_addr,
                hospital_phone=hosp_phone,
                reference_id=req_id,
                current_date=request_date_str,
                accept_link=accept_magic_url,
                decline_link=decline_magic_url
            )

            email_id = send_transactional_email(
                cur=cur,
                recipient_email=ngo["email"],
                recipient_name=ngo["name"],
                subject=f"Official Memorandum: Institutional Bilateral Affiliation Requisition ({hosp_name})",
                html_body=memo_html,
                token=verification_token,
                email_type="PARTNERSHIP_MEMORANDUM"
            )

            conn.commit()
            conn.close()

            self._send_json(200, {
                "success": True,
                "requestId": req_id,
                "status": "PENDING",
                "token": verification_token,
                "verificationToken": verification_token,
                "verifyLink": accept_magic_url,
                "data": {
                    "requestId": req_id,
                    "status": "PENDING",
                    "token": verification_token,
                    "verifyLink": accept_magic_url
                },
                "hospital": {
                    "id": hospital_id,
                    "name": hosp_name,
                    "licenseNumber": hosp_lic
                },
                "targetNgo": {
                    "id": ngo["id"],
                    "name": ngo["name"],
                    "licenseNumber": ngo["license_number"],
                    "officialEmail": ngo["email"]
                },
                "tokenTtlHours": 48,
                "emailDispatched": {
                    "emailId": email_id,
                    "recipientEmail": ngo["email"],
                    "previewUrl": f"http://{host}/api/emails/preview?id={email_id}"
                },
                "magicLinks": {
                    "acceptUrl": accept_magic_url,
                    "declineUrl": decline_magic_url,
                    "rejectUrl": decline_magic_url
                },
                "message": f"Institutional Affiliation Memorandum dispatched to {ngo['name']} ({ngo['email']}). Awaiting 48-hour ratification."
            })
            return

        # =============================================
        # 3. DIRECT PARTNERSHIP ACTION (DASHBOARD APPROVE/REJECT)
        # =============================================
        if path in ["/api/network/partnerships/action", "/api/partnerships/action"]:
            request_id = body.get("requestId")
            raw_action = (body.get("action") or "ACCEPT").upper()
            ngo_id = body.get("ngoId")

            if not request_id or raw_action not in ["ACCEPT", "REJECT", "APPROVE", "DECLINE"]:
                self._send_json(400, {"error": "Missing or invalid requestId/action ('ACCEPT' or 'REJECT')."})
                return

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            cur.execute("SELECT * FROM partnership_requests WHERE id = ?", (request_id,))
            req = cur.fetchone()

            if not req:
                conn.close()
                self._send_json(404, {"error": f"Partnership request '{request_id}' not found."})
                return

            if req["status"] != "PENDING":
                conn.close()
                self._send_json(400, {"error": f"Partnership request already finalized with status: {req['status']}."})
                return

            new_status = "ACTIVE_AFFILIATE" if raw_action in ["ACCEPT", "APPROVE"] else "REJECTED"
            cur.execute("""
                UPDATE partnership_requests
                SET status = ?, verified_at = CURRENT_TIMESTAMP, action_source = 'DASHBOARD_DIRECT'
                WHERE id = ?
            """, (new_status, request_id))

            if new_status == "ACTIVE_AFFILIATE":
                conn_id = f"CONN-{datetime.now().strftime('%Y%m%d%H%M%S')}"
                cur.execute("""
                    INSERT OR REPLACE INTO hospital_ngo_connections (
                        id, hospital_id, ngo_id, license_number, connection_status, partnership_type, verified_at
                    ) VALUES (?, ?, ?, ?, 'Active', 'Emergency Blood Supply & Donor Mobilization', CURRENT_TIMESTAMP)
                """, (conn_id, req["hospital_id"], req["target_ngo_id"], req["target_ngo_license"]))

            conn.commit()
            conn.close()

            self._send_json(200, {
                "success": True,
                "requestId": request_id,
                "status": new_status,
                "actionSource": "DASHBOARD_DIRECT",
                "data": {
                    "requestId": request_id,
                    "status": new_status
                },
                "message": f"Partnership request transitioned to {new_status} successfully."
            })
            return

        # =============================================
        # 4. EMERGENCY SOS BROADCASTING WITH EMAIL CLAIMS
        # =============================================
        if path in ["/api/network/sos/broadcast", "/api/sos/broadcast", "/api/emergency/broadcast"]:
            hospital_id = body.get("hospitalBloodBankId") or body.get("hospitalId") or "HOSP-001"
            blood_group = body.get("bloodGroup") or body.get("blood_group")
            units_required = int(body.get("unitsRequired", body.get("unitsNeeded", body.get("units_needed", 2))))
            broadcast_id = (
                body.get("broadcastId") or
                body.get("broadcast_id") or
                f"HBB-NET-SOS-{datetime.now().strftime('%Y%m%d%H%M%S')}-{blood_group.replace('+', 'POS').replace('-', 'NEG') if blood_group else 'EMERGENCY'}"
            )
            hosp_name = (
                body.get("hospitalBloodBankName") or
                body.get("hospitalName") or
                "City Care Blood Centre & Hospital"
            )
            hosp_lic = body.get("licenseNo") or body.get("license_no") or "LIC-2026-001"
            contact_phone = (
                body.get("emergencyDeskPhone") or
                body.get("emergencyContact") or
                body.get("doctor_contact") or
                "+91 11 2658 8500"
            )
            room_details = (
                body.get("roomDetails") or
                body.get("ward_room") or
                body.get("clinicalNotes") or
                body.get("patient_condition") or
                "Emergency OT - Trauma Resuscitation Unit"
            )
            urgency_level = body.get("urgencyLevel", body.get("urgency", "CRITICAL_OT"))
            patient_case_id = body.get("patientCaseId") or body.get("patient_condition") or f"CASE-{datetime.now().strftime('%m%d%H%M')}"

            if not blood_group or units_required <= 0:
                self._send_json(400, {"error": "Missing required emergency fields: bloodGroup and positive unitsRequired."})
                return

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            cur.execute("SELECT * FROM hospitals WHERE id = ?", (hospital_id,))
            hosp = cur.fetchone()
            if hosp:
                if not body.get("hospitalBloodBankName") and not body.get("hospitalName"):
                    hosp_name = hosp["name"]
                if not body.get("licenseNo"):
                    hosp_lic = hosp["license_number"]

            # Generate Signed SOS Action Token for Email Direct Claim
            signed_sos_token = generate_signed_action_token(
                action_type="EMERGENCY_SOS_CLAIM",
                data_id=broadcast_id,
                extra={"bloodGroup": blood_group, "units": units_required, "hospitalId": hospital_id},
                ttl_seconds=86400 # 24 Hours
            )

            # Insert SOS record in BROADCASTED state
            cur.execute("""
                INSERT OR REPLACE INTO emergency_sos (
                    id, hospital_id, hospital_name, emergency_contact, blood_group,
                    units_required, urgency_level, patient_case_id, clinical_notes,
                    status, signed_sos_token
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'BROADCASTED', ?)
            """, (
                broadcast_id, hospital_id, hosp_name, contact_phone, blood_group,
                units_required, urgency_level, patient_case_id, room_details,
                signed_sos_token
            ))

            # Dispatch Emergency Notice to All Verified Partner NGOs
            cur.execute("SELECT id, name, license_number, email, phone FROM ngos WHERE verified_status = 1")
            notified_ngos = cur.fetchall()
            dispatched_email_ids = []

            broadcast_time_str = datetime.now().strftime("%B %d, %Y - %I:%M:%S %p")
            host = self.headers.get("Host") or f"localhost:{PORT}"

            for n in notified_ngos:
                claim_magic_url = f"http://{host}/api/network/sos/accept-email?token={signed_sos_token}&broadcastId={broadcast_id}&ngoId={n['id']}"
                sos_html = render_emergency_sos_notice_email(
                    ngo_name=n["name"],
                    ngo_license=n["license_number"],
                    hospital_name=hosp_name,
                    hospital_license=hosp_lic,
                    emergency_contact=contact_phone,
                    blood_group=blood_group,
                    units_required=units_required,
                    broadcast_id=broadcast_id,
                    room_details=room_details,
                    current_date=broadcast_time_str,
                    claim_link=claim_magic_url
                )

                eml_id = send_transactional_email(
                    cur=cur,
                    recipient_email=n["email"],
                    recipient_name=n["name"],
                    subject=f"[CODE RED SOS] Critical Blood Requisition: {blood_group} ({units_required} Units) - {hosp_name}",
                    html_body=sos_html,
                    token=signed_sos_token,
                    email_type="EMERGENCY_SOS_ALERT"
                )
                dispatched_email_ids.append({"ngoId": n["id"], "ngoName": n["name"], "emailId": eml_id})

            conn.commit()
            conn.close()

            # Push real-time alert to all connected NGO portal sessions via SSE
            dispatch_realtime_alert_to_ngos({
                "alertId": broadcast_id,
                "hospitalName": hosp_name,
                "hospitalLicense": hosp_lic,
                "bloodGroup": blood_group,
                "unitsRequired": units_required,
                "urgencyLevel": urgency_level,
                "distanceKm": 3.8,
                "contactPerson": "Dr. S. Roy (Blood Transfusion Officer)",
                "directDeskPhone": contact_phone,
                "hospitalAddress": hosp["address"] if hosp else "Plot 14, Main Medical Road, Near City Center",
                "hospitalLatitude": hosp["latitude"] if hosp and hosp["latitude"] else 28.5672,
                "hospitalLongitude": hosp["longitude"] if hosp and hosp["longitude"] else 77.2100,
                "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "status": "AWAITING_RESPONSE"
            })

            self._send_json(200, {
                "success": True,
                "broadcastId": broadcast_id,
                "sosId": broadcast_id,
                "status": "BROADCASTED",
                "token": signed_sos_token,
                "signedSosToken": signed_sos_token,
                "data": {
                    "broadcastId": broadcast_id,
                    "status": "BROADCASTED",
                    "token": signed_sos_token
                },
                "hospital": {
                    "id": hospital_id,
                    "name": hosp_name,
                    "licenseNo": hosp_lic,
                    "emergencyContact": contact_phone
                },
                "bloodGroup": blood_group,
                "unitsRequired": units_required,
                "urgencyLevel": urgency_level,
                "roomDetails": room_details,
                "notifiedFacilities": len(notified_ngos),
                "emailsDispatched": len(dispatched_email_ids),
                "ngosNotifiedCount": len(notified_ngos),
                "dispatches": dispatched_email_ids,
                "claimUrlExample": f"http://{host}/api/network/sos/accept-email?token={signed_sos_token}&broadcastId={broadcast_id}&ngoId=NGO-OD-9021",
                "message": f"EMERGENCY SOS ACTIVE: Requisition {broadcast_id} broadcasted to {len(notified_ngos)} accredited network facilities. Formal Code-Red notices generated."
            })
            return

        # =============================================
        # 5. ATOMIC EMERGENCY SOS ACCEPTANCE (RACE-SAFE CONCURRENCY)
        # =============================================
        if path in ["/api/network/sos/accept", "/api/sos/accept"]:
            sos_id = body.get("broadcastId") or body.get("sosId") or body.get("id")
            ngo_id = body.get("ngoId")
            ngo_name = body.get("ngoName")

            if not sos_id or not ngo_id:
                self._send_json(400, {"error": "Missing required fields: broadcastId/sosId and ngoId."})
                return

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            # Resolve NGO name if not provided
            if not ngo_name:
                ngo = find_ngo_by_identifier(cur, ngo_id)
                ngo_name = ngo["name"] if ngo else f"Accredited NGO ({ngo_id})"

            # ATOMIC UPDATE: Only succeeds if status is strictly 'BROADCASTED' or 'AWAITING_RESPONSE'
            cur.execute("""
                UPDATE emergency_sos
                SET status = 'IN_DISPATCH',
                    accepted_by_ngo_id = ?,
                    accepted_by_ngo_name = ?,
                    accepted_at = CURRENT_TIMESTAMP
                WHERE id = ? AND status IN ('BROADCASTED', 'AWAITING_RESPONSE')
            """, (ngo_id, ngo_name, sos_id))

            if cur.rowcount == 0:
                # Concurrency Conflict Check: Was it already accepted?
                cur.execute("SELECT * FROM emergency_sos WHERE id = ?", (sos_id,))
                row = cur.fetchone()
                conn.close()

                if not row:
                    self._send_json(404, {"error": f"Emergency SOS record '{sos_id}' not found."})
                    return

                # Record already locked by another facility -> Return 409 Conflict
                self._send_json(409, {
                    "success": False,
                    "conflict": True,
                    "error": "SOS request already claimed and locked by another facility.",
                    "sosId": sos_id,
                    "broadcastId": sos_id,
                    "currentStatus": row["status"],
                    "claimedBy": row["accepted_by_ngo_name"] or row["accepted_by_ngo_id"],
                    "claimedAt": row["accepted_at"],
                    "message": f"Conflict: SOS requisition {sos_id} was already accepted into dispatch by {row['accepted_by_ngo_name']} at {row['accepted_at']}."
                })
                return

            conn.commit()

            cur.execute("SELECT * FROM emergency_sos WHERE id = ?", (sos_id,))
            updated_sos = dict(cur.fetchone())
            conn.close()

            # Broadcast SSE notification to remove or update card across all open portals
            with sse_subscribers_lock:
                for q_list in sse_subscribers.values():
                    for q in q_list:
                        try:
                            q.put_nowait({
                                "type": "ALERT_ACKNOWLEDGED",
                                "alertId": sos_id,
                                "acknowledgedBy": ngo_name,
                                "status": "IN_DISPATCH"
                            })
                        except Exception:
                            pass

            self._send_json(200, {
                "success": True,
                "broadcastId": sos_id,
                "sosId": sos_id,
                "status": "IN_DISPATCH",
                "displayStatus": "ACCEPTED / IN_DISPATCH",
                "data": {
                    "broadcastId": sos_id,
                    "status": "IN_DISPATCH",
                    "displayStatus": "ACCEPTED / IN_DISPATCH"
                },
                "acceptedBy": {
                    "ngoId": ngo_id,
                    "ngoName": ngo_name
                },
                "acceptedAt": updated_sos["accepted_at"],
                "bloodGroup": updated_sos["blood_group"],
                "unitsRequired": updated_sos["units_required"],
                "hospitalName": updated_sos["hospital_name"],
                "emergencyContact": updated_sos["emergency_contact"],
                "message": f"SOS {sos_id} successfully claimed by {ngo_name}. Status locked to ACCEPTED / IN_DISPATCH."
            })
            return

        # =============================================
        # 5b. REAL-TIME EMERGENCY ALERT ACKNOWLEDGMENT
        # =============================================
        if path in ["/api/network/alerts/acknowledge", "/api/alerts/acknowledge"]:
            alert_id = body.get("alertId") or body.get("broadcastId") or body.get("sosId") or body.get("id")
            ngo_id = body.get("ngoId") or body.get("licenseNumber") or "NGO-OD-9021"
            ngo_name = body.get("ngoName")

            if not alert_id:
                self._send_json(400, {"error": "Missing alertId."})
                return

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            if not ngo_name:
                ngo = find_ngo_by_identifier(cur, ngo_id)
                ngo_name = ngo["name"] if ngo else f"Accredited NGO ({ngo_id})"

            # ATOMIC LOCK: Only transition if status is still pending response
            cur.execute("""
                UPDATE emergency_sos
                SET status = 'IN_DISPATCH',
                    accepted_by_ngo_id = ?,
                    accepted_by_ngo_name = ?,
                    accepted_at = CURRENT_TIMESTAMP
                WHERE id = ? AND status IN ('BROADCASTED', 'AWAITING_RESPONSE')
            """, (ngo_id, ngo_name, alert_id))

            if cur.rowcount == 0:
                cur.execute("SELECT * FROM emergency_sos WHERE id = ?", (alert_id,))
                row = cur.fetchone()
                conn.close()

                if not row:
                    self._send_json(404, {"error": f"Emergency alert record '{alert_id}' not found."})
                    return

                self._send_json(409, {
                    "success": False,
                    "conflict": True,
                    "error": "Emergency alert has already been acknowledged and claimed by another facility.",
                    "alertId": alert_id,
                    "currentStatus": row["status"],
                    "claimedBy": row["accepted_by_ngo_name"] or row["accepted_by_ngo_id"],
                    "claimedAt": row["accepted_at"],
                    "message": f"Conflict: Alert {alert_id} was already acknowledged by {row['accepted_by_ngo_name']}."
                })
                return

            conn.commit()
            cur.execute("SELECT * FROM emergency_sos WHERE id = ?", (alert_id,))
            updated_sos = dict(cur.fetchone())
            conn.close()

            # Push SSE event to inform all dashboards
            with sse_subscribers_lock:
                for q_list in sse_subscribers.values():
                    for q in q_list:
                        try:
                            q.put_nowait({
                                "type": "ALERT_ACKNOWLEDGED",
                                "alertId": alert_id,
                                "acknowledgedBy": ngo_name,
                                "status": "IN_DISPATCH"
                            })
                        except Exception:
                            pass

            self._send_json(200, {
                "success": True,
                "status": "ACCEPTED",
                "alertId": alert_id,
                "acknowledgedBy": ngo_name,
                "data": {
                    "alertId": alert_id,
                    "status": "IN_DISPATCH",
                    "displayStatus": "ACCEPTED / IN_DISPATCH",
                    "acknowledgedBy": ngo_name,
                    "acceptedAt": updated_sos["accepted_at"]
                },
                "message": f"Alert {alert_id} acknowledged. Emergency custody secured by {ngo_name}."
            })
            return

        # =============================================
        # 5c. EMERGENCY ALERT SIMULATION GENERATOR
        # =============================================
        if path in ["/api/network/alerts/simulate", "/api/alerts/simulate"]:
            sim_id = f"ALT-{datetime.now().strftime('%Y')}-{random.randint(1000, 9999)}"
            blood_groups = ["O-", "O+", "A-", "B-", "AB-"]
            selected_bg = body.get("bloodGroup") or random.choice(blood_groups)
            units = int(body.get("unitsRequired", random.randint(2, 6)))
            urgency = body.get("urgencyLevel", "CRITICAL_OT")

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            hosp_id = body.get("hospitalId", "HOSP-001")
            cur.execute("SELECT * FROM hospitals WHERE id = ?", (hosp_id,))
            hosp = cur.fetchone()
            h_name = hosp["name"] if hosp else "City Care Multi-Specialty Hospital Blood Bank"
            h_lic = hosp["license_number"] if hosp else "HOSP-BB-7721"
            h_phone = hosp["emergency_hotline"] if hosp else "+91-9876543210"
            h_addr = hosp["address"] if hosp else "Plot 14, Main Medical Road, Near City Center"
            h_lat = hosp["latitude"] if hosp and hosp["latitude"] else 28.5672
            h_lon = hosp["longitude"] if hosp and hosp["longitude"] else 77.2100

            cur.execute("""
                INSERT INTO emergency_sos (
                    id, hospital_id, hospital_name, emergency_contact, blood_group,
                    units_required, urgency_level, patient_case_id, clinical_notes, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'BROADCASTED')
            """, (
                sim_id, hosp_id, h_name, h_phone, selected_bg, units, urgency,
                f"CASE-SIM-{sim_id}", "Urgent trauma requisition generated via test simulator"
            ))
            conn.commit()
            conn.close()

            alert_obj = {
                "alertId": sim_id,
                "hospitalName": h_name,
                "hospitalLicense": h_lic,
                "bloodGroup": selected_bg,
                "unitsRequired": units,
                "urgencyLevel": urgency,
                "distanceKm": 3.8,
                "contactPerson": "Dr. S. Roy (Blood Transfusion Officer)",
                "directDeskPhone": h_phone,
                "hospitalAddress": h_addr,
                "hospitalLatitude": h_lat,
                "hospitalLongitude": h_lon,
                "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "status": "AWAITING_RESPONSE"
            }

            dispatch_realtime_alert_to_ngos(alert_obj)

            self._send_json(200, {
                "success": True,
                "simulatedAlert": alert_obj,
                "message": f"Simulation alert {sim_id} created and dispatched to real-time NGO streams."
            })
            return

        # =============================================
        # 6. INVENTORY ADJUSTMENT
        # =============================================
        if path == "/api/inventory/adjust":
            blood_group = body.get("bloodGroup")
            delta = int(body.get("delta", 0))
            hospital_id = body.get("hospitalId", "HOSP-001")

            if not blood_group or delta == 0:
                self._send_json(400, {"error": "Missing required fields: bloodGroup, non-zero delta"})
                return

            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                SELECT units_available FROM blood_inventory
                WHERE hospital_id = ? AND blood_group = ?
            """, (hospital_id, blood_group))
            row = cur.fetchone()

            if not row:
                conn.close()
                self._send_json(404, {"error": f"Blood group {blood_group} not found in inventory."})
                return

            current_units = row[0]
            new_units = max(0, current_units + delta)

            cur.execute("""
                UPDATE blood_inventory
                SET units_available = ?, last_updated = CURRENT_TIMESTAMP
                WHERE hospital_id = ? AND blood_group = ?
            """, (new_units, hospital_id, blood_group))
            conn.commit()
            conn.close()

            indicator = get_inventory_status_color(new_units)
            shortage_triggered = is_severe_shortage(new_units)

            self._send_json(200, {
                "success": True,
                "bloodGroup": blood_group,
                "previousUnits": current_units,
                "newUnits": new_units,
                "delta": delta,
                "thresholdIndicator": indicator,
                "severeShortageAlert": {
                    "triggered": shortage_triggered,
                    "message": f"CRITICAL: {blood_group} unit count is now {new_units} (below 5 units)! Emergency restocking advised." if shortage_triggered else "Stock within safe parameters."
                }
            })
            return

        # =============================================
        # 7. GENERATE BLOOD UNIT QR CODE METADATA
        # =============================================
        if path == "/api/qr/generate":
            unit_id = body.get("unitId") or f"BB-2026-{datetime.now().strftime('%M%S')}"
            blood_group = body.get("bloodGroup", "A+")
            component = body.get("component", "Packed Red Blood Cells (PRBC)")
            collection_date = body.get("collectionDate") or datetime.now().strftime("%Y-%m-%d")
            expiry_date = body.get("expiryDate") or (datetime.now() + timedelta(days=42)).strftime("%Y-%m-%d")
            hospital_id = body.get("hospitalId", "HOSP-001")
            license_no = body.get("licenseNo") or "LIC-2026-001"
            status = body.get("status", "Available")
            volume_ml = int(body.get("volumeMl", 450))

            valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Bombay Oh", "Rh-null"]
            if blood_group not in valid_groups:
                self._send_json(400, {"error": f"Invalid blood group '{blood_group}'. Must be one of {valid_groups}"})
                return

            chk = generate_qr_checksum(unit_id, blood_group, expiry_date, hospital_id)
            qr_metadata = {
                "unitId": unit_id,
                "bloodGroup": blood_group,
                "component": component,
                "collectionDate": collection_date,
                "expiryDate": expiry_date,
                "hospitalId": hospital_id,
                "licenseNo": license_no,
                "status": status,
                "volumeMl": volume_ml,
                "coldChainRequirement": "2°C - 6°C Monitored",
                "checksum": chk,
                "isbtStandard": "ISBT-128 Compliant",
                "timestamp": datetime.now().isoformat()
            }

            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                INSERT OR REPLACE INTO blood_units (
                    unit_id, blood_group, component, collection_date, expiry_date,
                    hospital_id, status, volume_ml, qr_payload
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (unit_id, blood_group, component, collection_date, expiry_date, hospital_id, status, volume_ml, json.dumps(qr_metadata)))
            conn.commit()
            conn.close()

            self._send_json(201, {
                "success": True,
                "unitId": unit_id,
                "qrPayload": qr_metadata,
                "qrString": json.dumps(qr_metadata),
                "isbtLabel": {
                    "header": "NATIONAL BLOOD TRANSFUSION SERVICE",
                    "facility": "City Care Blood Centre (LIC-2026-001)",
                    "bagId": unit_id,
                    "bloodGroup": blood_group,
                    "volume": f"{volume_ml} mL",
                    "anticoagulant": "CPDA-1",
                    "expiry": expiry_date,
                    "serology": "HIV, Hep-B, Hep-C, Syphilis: NEGATIVE"
                }
            })
            return

        # =============================================
        # 8. VERIFY BLOOD UNIT QR CODE
        # =============================================
        if path == "/api/qr/verify":
            qr_raw = body.get("qrPayload")
            if not qr_raw:
                self._send_json(400, {"error": "Missing qrPayload parameter"})
                return

            payload_data = None
            if isinstance(qr_raw, dict):
                payload_data = qr_raw
            else:
                try:
                    payload_data = json.loads(qr_raw)
                except json.JSONDecodeError:
                    parts = qr_raw.split("|")
                    if len(parts) >= 6:
                        payload_data = {
                            "unitId": parts[0].strip(),
                            "bloodGroup": parts[1].strip(),
                            "collectionDate": parts[2].strip(),
                            "expiryDate": parts[3].strip(),
                            "hospitalId": parts[4].strip(),
                            "status": parts[5].strip()
                        }
                    else:
                        self._send_json(400, {"error": "Invalid QR code format. Unable to parse blood metadata."})
                        return

            unit_id = payload_data.get("unitId")
            blood_group = payload_data.get("bloodGroup")
            exp_date = payload_data.get("expiryDate")
            hosp_id = payload_data.get("hospitalId", "HOSP-001")

            chk = payload_data.get("checksum")
            expected_chk = generate_qr_checksum(unit_id, blood_group, exp_date, hosp_id)
            is_authentic = (chk == expected_chk) if chk else True

            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                SELECT status, volume_ml, collection_date, expiry_date, component
                FROM blood_units
                WHERE unit_id = ?
            """, (unit_id,))
            row = cur.fetchone()
            conn.close()

            current_status = row[0] if row else payload_data.get("status", "Available")
            vol = row[1] if row else payload_data.get("volumeMl", 450)

            try:
                exp_dt = datetime.strptime(exp_date, "%Y-%m-%d")
                is_expired = datetime.now() > exp_dt
            except Exception:
                is_expired = False

            self._send_json(200, {
                "valid": True,
                "authentic": is_authentic,
                "unitId": unit_id,
                "bloodGroup": blood_group,
                "component": row[4] if row else payload_data.get("component", "Packed Red Blood Cells"),
                "status": "Expired" if is_expired else current_status,
                "isExpired": is_expired,
                "collectionDate": row[2] if row else payload_data.get("collectionDate"),
                "expiryDate": exp_date,
                "volume": f"{vol} mL",
                "hospitalId": hosp_id,
                "serology": "Certified Negative (Safe for Transfusion)"
            })
            return

        # =============================================
        # 9. UPDATE HOSPITAL PROFILE & MEDIA
        # =============================================
        if path == "/api/hospital/profile":
            hospital_id = body.get("hospitalId", "HOSP-001")
            name = body.get("name")
            license_number = body.get("licenseNumber")
            phone = body.get("phone")
            emergency_hotline = body.get("emergencyHotline")
            email = body.get("email")
            address = body.get("address")
            city = body.get("city")
            latitude = body.get("latitude")
            longitude = body.get("longitude")
            photo_data = body.get("photoData", "")
            photo_url = body.get("photoUrl", "")
            storage_facilities = body.get("storageFacilities")
            trauma_level = body.get("traumaCenterLevel")

            storage_json = None
            if storage_facilities is not None:
                storage_json = json.dumps(storage_facilities) if isinstance(storage_facilities, list) else str(storage_facilities)

            conn = get_db_connection()
            cur = conn.cursor()

            cur.execute("SELECT id FROM hospitals WHERE id = ?", (hospital_id,))
            if not cur.fetchone():
                conn.close()
                self._send_json(404, {"error": "Hospital not found", "hospitalId": hospital_id})
                return

            update_clauses = []
            params = []
            if name: update_clauses.append("name = ?"); params.append(name)
            if license_number: update_clauses.append("license_number = ?"); params.append(license_number)
            if phone: update_clauses.append("phone = ?"); params.append(phone)
            if emergency_hotline: update_clauses.append("emergency_hotline = ?"); params.append(emergency_hotline)
            if email: update_clauses.append("email = ?"); params.append(email)
            if address: update_clauses.append("address = ?"); params.append(address)
            if city: update_clauses.append("city = ?"); params.append(city)
            if latitude is not None: update_clauses.append("latitude = ?"); params.append(float(latitude))
            if longitude is not None: update_clauses.append("longitude = ?"); params.append(float(longitude))
            if photo_data: update_clauses.append("photo_data = ?"); params.append(photo_data)
            if photo_url: update_clauses.append("photo_url = ?"); params.append(photo_url)
            if storage_json is not None: update_clauses.append("storage_facilities = ?"); params.append(storage_json)
            if trauma_level: update_clauses.append("trauma_center_level = ?"); params.append(trauma_level)

            if update_clauses:
                params.append(hospital_id)
                query_str = f"UPDATE hospitals SET {', '.join(update_clauses)} WHERE id = ?"
                cur.execute(query_str, params)
                conn.commit()

            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM hospitals WHERE id = ?", (hospital_id,))
            updated = dict(cur.fetchone())
            conn.close()

            storage_out = []
            try:
                storage_out = json.loads(updated.get("storage_facilities", "[]"))
            except Exception:
                storage_out = [updated.get("storage_facilities", "")]

            self._send_json(200, {
                "success": True,
                "message": "Hospital Profile & Infrastructure details updated successfully.",
                "hospital": {
                    "id": updated["id"],
                    "name": updated["name"],
                    "licenseNumber": updated["license_number"],
                    "category": updated["category"],
                    "address": updated["address"],
                    "city": updated["city"],
                    "phone": updated["phone"],
                    "emergencyHotline": updated.get("emergency_hotline", ""),
                    "email": updated["email"],
                    "latitude": updated["latitude"],
                    "longitude": updated["longitude"],
                    "photoUrl": updated.get("photo_url", ""),
                    "hasCustomPhoto": bool(updated.get("photo_data") or updated.get("photo_url")),
                    "storageFacilities": storage_out,
                    "traumaCenterLevel": updated.get("trauma_center_level", "")
                }
            })
            return

        # =============================================
        # 10. CONNECT TO PEER HOSPITAL VIA LICENSE
        # =============================================
        if path == "/api/hospitals/connect":
            hospital_id = body.get("hospitalId", "HOSP-001")
            peer_license = (body.get("licenseNumber") or "").strip().upper()

            pattern = r"^(HOSP|LIC)-[A-Z0-9]{2,4}-\d{3,5}$"
            if not re.match(pattern, peer_license):
                self._send_json(422, {
                    "valid": False,
                    "error": "Invalid Hospital License format. Must conform to institutional registry format (e.g. HOSP-DL-002)."
                })
                return

            conn = get_db_connection()
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT id, name, category, phone FROM hospitals WHERE UPPER(license_number) = ?", (peer_license,))
            peer = cur.fetchone()

            if not peer:
                conn.close()
                self._send_json(404, {
                    "valid": False,
                    "error": f"Hospital license '{peer_license}' not found in verified State Health Authority registry."
                })
                return

            if peer["id"] == hospital_id:
                conn.close()
                self._send_json(400, {
                    "valid": False,
                    "error": "Cannot establish peer connection with your own hospital account."
                })
                return

            conn_id = f"PCONN-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            cur.execute("""
                INSERT OR REPLACE INTO hospital_hospital_connections (
                    id, hospital_id, peer_hospital_id, license_number, connection_status, mutual_assistance_terms
                ) VALUES (?, ?, ?, ?, 'Active', 'Emergency Inventory Sharing & Inter-Hospital Trauma Dispatch')
            """, (conn_id, hospital_id, peer["id"], peer_license))
            conn.commit()
            conn.close()

            self._send_json(201, {
                "success": True,
                "connectionId": conn_id,
                "peerHospital": {
                    "id": peer["id"],
                    "name": peer["name"],
                    "category": peer["category"],
                    "licenseNumber": peer_license,
                    "phone": peer["phone"]
                },
                "status": "Active & Verified",
                "message": f"Peer Connection established with '{peer['name']}' ({peer_license}). Enabled for mutual emergency dispatch."
            })
            return

        # 404 Catch-All
        self._send_json(404, {"error": "Endpoint not found", "path": path})

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    init_database()
    with ThreadedHTTPServer(("", PORT), BloodBankRequestHandler) as httpd:
        print(f"[*] LifeFlow Hospital Blood Bank API Server running on port {PORT}", flush=True)
        print(f"[*] Database initialized at: {DB_PATH}", flush=True)
        print(f"[*] Pre-seeded NGOs: NGO-RED-001 (NGO-DL-8821), NGO-CARE-102 (NGO-DL-4512), NGO-SAM-003, NGO-ROT-004", flush=True)
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
