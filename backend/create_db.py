import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    conn = psycopg2.connect(user='postgres', password='123456', host='localhost', port='5432')
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    cursor.execute('CREATE DATABASE "EZ4ENCE"')
    cursor.close()
    conn.close()
    print("Database EZ4ENCE created successfully.")
except psycopg2.errors.DuplicateDatabase:
    print("Database EZ4ENCE already exists.")
except Exception as e:
    print(f"Error: {e}")
