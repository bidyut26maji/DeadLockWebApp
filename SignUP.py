import sys
import sqlite3
import os


name = sys.argv[1]
email = sys.argv[2]
password = sys.argv[3]


db_path = os.path.join(os.getcwd(), "user.db")


conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
''')

try:
    cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
    conn.commit()
    print("User added successfully.")
except sqlite3.IntegrityError:
    print("Email already exists.")
    sys.exit(1)

cursor.close()
conn.close()
sys.exit(0)
