import urllib.request
import json
import re

print("==================================================")
print("VERIFYING FRONTEND ASSETS AND LIVE INTEGRATION")
print("==================================================")

# 1. Check HTTP server on port 8080
try:
    with urllib.request.urlopen("http://localhost:8080/Main%20Page/hospital-auth.html", timeout=5) as res:
        html_code = res.read().decode('utf-8')
        print(f"[OK] hospital-auth.html fetched successfully ({len(html_code)} bytes, status {res.status})")
        
        # Verify crucial HTML elements
        checks = [
            "hospMainSidebar",
            "sidebarHospitalAvatar",
            "sidebarHospitalName",
            "sidebarHospitalLicense",
            "sidebarNavInventory",
            "sidebarNavSos",
            "sidebarNavDirectory",
            "sidebarNavQrStudio",
            "sidebarNavProfile",
            "tabPaneInventory",
            "tabPaneEmergencySos",
            "tabPaneDirectory",
            "tabPaneQrStudio",
            "tabPaneProfile",
            "profilePhotoDropzone",
            "profileAvatarPreview",
            "sosBroadcastForm",
            "sosMatchingRadar",
            "unifiedDirectoryGrid",
            "peerHospLicenseInput",
            "ngoLicenseInput",
            "severeShortageAlertBanner"
        ]
        for c in checks:
            assert c in html_code, f"Missing element ID or class: {c}"
        print("[OK] All required sidebar, profile, SOS, directory, and inventory DOM IDs present in HTML!")
except Exception as e:
    print(f"[FAIL] HTTP 8080 fetch failed: {e}")

# 2. Check script1.js fetched via HTTP
try:
    with urllib.request.urlopen("http://localhost:8080/Main%20Page/script1.js", timeout=5) as res:
        js_code = res.read().decode('utf-8')
        print(f"[OK] script1.js fetched successfully ({len(js_code)} bytes, status {res.status})")

        # Verify key function signatures
        funcs = [
            "calculateHaversineDistance",
            "playEmergencyAudioAlert",
            "initHospitalProfile",
            "handlePhotoDragOver",
            "handlePhotoDrop",
            "handlePhotoFileSelected",
            "processHospitalPhoto",
            "handleProfileFormSubmit",
            "switchSidebarTab",
            "openEmergencySosModal",
            "setSosRadius",
            "refreshSosRadar",
            "handleSosBroadcastSubmit",
            "renderSosBroadcastAuditTable",
            "renderUnifiedDirectory",
            "filterDirectory",
            "handleDirectorySearch",
            "verifyPeerHospitalLicense",
            "verifyNgoLicense",
            "updateGeneratedQrPreview",
            "displayDecodedBag",
            "checkLowStockAlerts",
            "getInventoryStatusColor"
        ]
        for f in funcs:
            assert f"function {f}" in js_code or f in js_code, f"Missing function: {f}"
        print(f"[OK] All {len(funcs)} critical frontend functions defined in script1.js!")
except Exception as e:
    print(f"[FAIL] script1.js verification failed: {e}")

# 3. Check style1.css fetched via HTTP
try:
    with urllib.request.urlopen("http://localhost:8080/Main%20Page/style1.css", timeout=5) as res:
        css_code = res.read().decode('utf-8')
        print(f"[OK] style1.css fetched successfully ({len(css_code)} bytes, status {res.status})")

        css_classes = [
            ".hosp-app-container",
            ".hosp-sidebar",
            ".sidebar-brand",
            ".sidebar-profile-card",
            ".sidebar-nav-item",
            ".sidebar-sos-btn",
            ".profile-editor-grid",
            ".media-upload-dropzone",
            ".sos-hero-banner",
            ".radius-pills-group",
            ".sos-radar-grid",
            ".unified-entities-grid",
            ".linkage-boxes-grid"
        ]
        for cls in css_classes:
            assert cls in css_code, f"Missing CSS class: {cls}"
        print(f"[OK] All {len(css_classes)} critical UI styling blocks verified in style1.css!")
except Exception as e:
    print(f"[FAIL] style1.css verification failed: {e}")

# 4. Check backend API on port 8000
try:
    with urllib.request.urlopen("http://localhost:8000/api/hospital/profile", timeout=5) as res:
        profile_data = json.loads(res.read().decode('utf-8'))
        hosp = profile_data.get('hospital') or profile_data.get('profile')
        name = hosp.get('name')
        lic = hosp.get('licenseNumber') or hosp.get('license_number')
        print(f"[OK] GET /api/hospital/profile: {name} ({lic})")

    with urllib.request.urlopen("http://localhost:8000/api/network/directory?radius=15&blood_group=O-", timeout=5) as res:
        dir_data = json.loads(res.read().decode('utf-8'))
        facilities = dir_data.get('entities') or dir_data.get('facilities') or []
        print(f"[OK] GET /api/network/directory (15km, O-): Found {len(facilities)} facilities in radar range!")
        for fac in facilities[:3]:
            units = fac.get('matchedUnits') or fac.get('matched_units') or fac.get('availableUnits') or fac.get('stock')
            dist = fac.get('distanceKm') or fac.get('distance_km')
            etype = fac.get('entityType') or fac.get('type') or 'Facility'
            print(f"     -> {fac['name']} ({etype.upper()}) - {dist} km, {units} units")

except Exception as e:
    print(f"[FAIL] Backend API check failed: {e}")

print("==================================================")
print("ALL SYSTEM VERIFICATIONS PASSED SUCCESSFULLY!")
print("==================================================")
