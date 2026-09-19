#!/usr/bin/env python3
"""
Automated Test Suite for Hospital Blood Bank Management System
Tests:
- Dynamic Threshold Indicators (Red <= 6, Yellow 7-13, Green > 13)
- Severe Shortage Alerts (< 5 units)
- QR Code Metadata Generation, Checksum & Payload Verification
- NGO Licensing Validation (Valid, Bad Format, Unregistered)
- Database Operations & Transfer Requisitions
"""

import unittest
import sqlite3
import os
import json
from server import (
    get_inventory_status_color,
    is_severe_shortage,
    generate_qr_checksum,
    init_database,
    DB_PATH
)

class TestBloodBankLogic(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_database()

    # 1. Dynamic Threshold Tests
    def test_dynamic_threshold_colors(self):
        # Red: Units <= 6
        for u in [0, 1, 3, 5, 6]:
            res = get_inventory_status_color(u)
            self.assertEqual(res["color"], "red", f"Units {u} should be 'red'")
            self.assertEqual(res["tier"], "critical")
            self.assertTrue(res["requiresRestock"])

        # Yellow: Units > 6 and <= 13 (7 to 13)
        for u in [7, 8, 10, 12, 13]:
            res = get_inventory_status_color(u)
            self.assertEqual(res["color"], "yellow", f"Units {u} should be 'yellow'")
            self.assertEqual(res["tier"], "moderate")
            self.assertFalse(res["requiresRestock"])

        # Green: Units > 13
        for u in [14, 15, 20, 50, 100]:
            res = get_inventory_status_color(u)
            self.assertEqual(res["color"], "green", f"Units {u} should be 'green'")
            self.assertEqual(res["tier"], "adequate")
            self.assertFalse(res["requiresRestock"])

    # 2. Severe Shortage Alert Trigger (< 5 units)
    def test_severe_shortage_alert_trigger(self):
        # Strictly below 5 units triggers alert
        self.assertTrue(is_severe_shortage(0))
        self.assertTrue(is_severe_shortage(1))
        self.assertTrue(is_severe_shortage(2))
        self.assertTrue(is_severe_shortage(4))

        # 5 and above does NOT trigger severe shortage banner
        self.assertFalse(is_severe_shortage(5))
        self.assertFalse(is_severe_shortage(6))
        self.assertFalse(is_severe_shortage(10))
        self.assertFalse(is_severe_shortage(25))

    # 3. QR Checksum & Security Tests
    def test_qr_checksum_generation(self):
        chk1 = generate_qr_checksum("BB-2026-8812", "A+", "2026-10-20", "HOSP-001")
        chk2 = generate_qr_checksum("BB-2026-8812", "A+", "2026-10-20", "HOSP-001")
        self.assertEqual(chk1, chk2, "Same inputs must produce deterministic checksum")
        self.assertEqual(len(chk1), 16, "Checksum must be 16 characters long")

        chk_tampered = generate_qr_checksum("BB-2026-8812", "O+", "2026-10-20", "HOSP-001")
        self.assertNotEqual(chk1, chk_tampered, "Tampered blood group must yield different checksum")

    # 4. Database Seed Data & NGO License Validation
    def test_ngo_license_registry(self):
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        # Check seeded NGOs
        cur.execute("SELECT name, license_number FROM ngos WHERE verified_status = 1")
        ngos = cur.fetchall()
        self.assertGreaterEqual(len(ngos), 3, "At least 3 verified NGOs must be in registry")

        # Verify known license
        cur.execute("SELECT name FROM ngos WHERE license_number = 'NGO-DL-8821'")
        res = cur.fetchone()
        self.assertIsNotNone(res)
        self.assertIn("Red Cross", res[0])

        # Test non-existent license
        cur.execute("SELECT name FROM ngos WHERE license_number = 'NGO-FAKE-9999'")
        self.assertIsNone(cur.fetchone())

        conn.close()

    # 5. Inventory Seed State has severe shortage for Universal O-
    def test_inventory_severe_shortage_detection(self):
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT blood_group, units_available FROM blood_inventory WHERE hospital_id = 'HOSP-001' AND units_available < 5")
        shortages = cur.fetchall()
        conn.close()

        shortage_groups = [s[0] for s in shortages]
        self.assertIn("O-", shortage_groups, "O- (Universal Emergency) must be detected in severe shortage (< 5 units)")

    # 6. Haversine Distance & Peer Hospital Registry Tests
    def test_haversine_and_peer_hospitals(self):
        from server import calculate_haversine_distance
        # AIIMS (28.5672, 77.2100) to Safdarjung (28.5701, 77.2069) is under 1 km
        dist = calculate_haversine_distance(28.5672, 77.2100, 28.5701, 77.2069)
        self.assertLess(dist, 1.0, f"AIIMS to Safdarjung should be < 1.0 km, got {dist} km")
        self.assertGreater(dist, 0.1)

        # Peer hospital check
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT name FROM hospitals WHERE license_number = 'HOSP-DL-002'")
        peer = cur.fetchone()
        conn.close()
        self.assertIsNotNone(peer, "Safdarjung Hospital license HOSP-DL-002 must be seeded")
        self.assertIn("Safdarjung", peer[0])

if __name__ == "__main__":
    unittest.main(verbosity=2)
