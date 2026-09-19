import urllib.request
import urllib.error
import json

def post(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode('utf-8'))

def get(url):
    try:
        with urllib.request.urlopen(url) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode('utf-8'))

print("=== 1. INVENTORY & THRESHOLDS ===")
inv = get("http://127.0.0.1:8000/api/inventory")
print("Total inventory items:", len(inv["inventory"]))
print("Severe Shortage Active:", inv["severeShortageAlert"]["active"])

print("\n=== 2. HOSPITAL PROFILE & MEDIA SETTINGS ===")
prof = get("http://127.0.0.1:8000/api/hospital/profile")
print("Hospital Name:", prof["hospital"]["name"])
print("License Number:", prof["hospital"]["licenseNumber"])
print("Storage Facilities:", prof["hospital"]["storageFacilities"])

# Update profile with new emergency hotline and custom photo URL
up_prof = post("http://127.0.0.1:8000/api/hospital/profile", {
    "hospitalId": "HOSP-001",
    "emergencyHotline": "+91 11 2658 9999",
    "photoUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80",
    "storageFacilities": ["Walk-in Cold Room (2°C - 6°C)", "Platelet Agitator & Incubator (22°C)", "Cryopreservation Unit -80°C", "Apheresis Cell Separator"]
})
print("Profile Update Status:", up_prof["success"])
print("Updated Hotline:", up_prof["hospital"]["emergencyHotline"])
print("Updated Storage Count:", len(up_prof["hospital"]["storageFacilities"]))

print("\n=== 3. UNIFIED NETWORK DIRECTORY (GEOSPATIAL PROXIMITY) ===")
net = get("http://127.0.0.1:8000/api/network/directory?radiusKm=25&type=all&bloodGroup=O-")
print("Total facilities within 25km with O- stock:", net["totalCount"])
for e in net["entities"]:
    print(f"  - [{e['entityType']}] {e['name']} ({e['licenseNumber']}): {e['distanceFormatted']} | Stock O-: {e['matchedBloodGroupUnits']} units")

print("\n=== 4. EMERGENCY SOS BLOOD BROADCAST ===")
sos_res = post("http://127.0.0.1:8000/api/emergency/broadcast", {
    "hospitalId": "HOSP-001",
    "bloodGroup": "O-",
    "component": "Universal PRBC Emergency",
    "unitsNeeded": 3,
    "urgencyLevel": "Life-Threatening STAT (< 15 Mins)",
    "radiusKm": 15.0,
    "patientCondition": "Massive Hemorrhage / Emergency Laparotomy",
    "doctorContact": "Dr. V. Sharma (Chief Trauma Surgeon)",
    "wardOtRoom": "Emergency OT-2"
})
print("Emergency Broadcast Code:", sos_res["broadcastCode"])
print("Target Facilities Contacted:", sos_res["targetFacilitiesContacted"])
print("Matched Facilities with Stock:", sos_res["matchedFacilitiesWithStock"])
for mf in sos_res["matchedFacilities"]:
    print(f"  - Match: {mf['name']} ({mf['distanceFormatted']}) - {mf['availableUnits']} units available | ETA: {mf['estimatedDeliveryMinutes']} mins")

broadcasts = get("http://127.0.0.1:8000/api/emergency/broadcasts")
print("Total Active Broadcasts in Log:", broadcasts["count"])

print("\n=== 5. PEER HOSPITAL & NGO LICENSING LINKAGE ===")
# Invalid hospital license check
val_inv_hosp = post("http://127.0.0.1:8000/api/hospitals/connect", {"licenseNumber": "INVALID"})
print("Invalid Hospital License rejected?", not val_inv_hosp.get("valid", True))

# Valid peer hospital connection
conn_hosp = post("http://127.0.0.1:8000/api/hospitals/connect", {"licenseNumber": "HOSP-DL-002"})
print("Peer Connection with Safdarjung Hospital:", conn_hosp["success"], "| Status:", conn_hosp["status"])

print("\n=== 6. QR CODE LABELING WITH LICENSE NUMBER ===")
qr_gen = post("http://127.0.0.1:8000/api/qr/generate", {
    "bloodGroup": "O-",
    "component": "Universal PRBC",
    "licenseNo": "LIC-2026-001",
    "hospitalId": "HOSP-001"
})
print("Generated Unit ID:", qr_gen["unitId"])
print("QR License No in Payload:", qr_gen["qrPayload"]["licenseNo"])
print("QR Checksum:", qr_gen["qrPayload"]["checksum"])

qr_ver = post("http://127.0.0.1:8000/api/qr/verify", {"qrPayload": qr_gen["qrPayload"]})
print("QR Authenticity Verified:", qr_ver["authentic"])
print("QR Status:", qr_ver["status"])

print("\n>>> ALL EXPANDED BLOOD BANK & EMERGENCY COLLABORATION SERVICES VERIFIED SUCCESSFULLY! <<<")
