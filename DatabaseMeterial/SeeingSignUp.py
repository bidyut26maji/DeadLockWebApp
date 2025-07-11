import sqlite3
import os


db_path = os.path.join(os.getcwd(), "user.db")


conn = sqlite3.connect(db_path)
cursor = conn.cursor()


cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()


if rows:
    print("\nRegistered Users:")
    print("-" * 60)
    for row in rows:
        user_id, user_name, user_email, user_password = row
        print(f"ID: {user_id}, Name: {user_name}, Email: {user_email}, Password: {user_password}")
else:
    print("No users found in the database.")


cursor.close()
conn.close()
