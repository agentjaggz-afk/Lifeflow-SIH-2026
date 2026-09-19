import sqlite3

conn = sqlite3.connect('backend/lifeflow_bloodbank.db')
cur = conn.cursor()
for t in ['partnership_requests', 'emergency_sos']:
    row = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name=?", (t,)).fetchone()
    if row:
        print(f"[{t}]\n{row[0]}\n")
conn.close()
