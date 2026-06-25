import requests
import sqlite3

def get_token():
    conn = sqlite3.connect('../database/ez4gear.db')
    cursor = conn.cursor()
    cursor.execute("SELECT access_token FROM users LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None

token = get_token()
if token:
    res = requests.get('http://localhost:8000/api/wishlist', headers={'Authorization': f'Bearer {token}'})
    print(res.status_code)
    print(res.json())
else:
    print("No token")
