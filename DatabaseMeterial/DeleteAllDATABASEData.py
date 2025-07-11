import sqlite3

conn = sqlite3.connect('user.db')
cursor = conn.cursor()


cursor.execute("DELETE FROM users")  


cursor.execute("DELETE FROM sqlite_sequence WHERE name='users'")

conn.commit()
conn.close()

print("All data deleted.")
