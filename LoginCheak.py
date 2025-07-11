import sys
import sqlite3
import os

db_path = os.path.join(os.getcwd(), "user.db")


if len(sys.argv) < 3:
    print("Usage: python LoginCheck.py <email> <password>")
    sys.exit(1)

email = sys.argv[1]
password = sys.argv[2]

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()

    if user:
        print("valid")
        sys.exit(0)
    else:
        print("invalid")
        sys.exit(1)

except Exception as e:
    print(f"error: {str(e)}")
    sys.exit(2)

finally:
    cursor.close()
    conn.close()
