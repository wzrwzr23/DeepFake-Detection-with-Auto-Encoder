from flask import Flask, jsonify
import pyodbc

app = Flask(__name__)

# Database connection configuration
conn_str = (
    r'DRIVER={SQL Server};'
    r'SERVER=your_server;'
    r'DATABASE=your_database;'
    r'UID=your_username;'
    r'PWD=your_password;'
)
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

# Route to get counters data
@app.route('/api/counters')
def get_counters():
    try:
        cursor.execute('SELECT * FROM [dbo].[counter]')
        rows = cursor.fetchall()
        counters = [{'id': row.id, 'name': row.name} for row in rows]  # Adjust column names accordingly
        return jsonify(counters)
    except Exception as e:
        print('Error querying counter data:', e)
        return 'Internal Server Error', 500

# Route to get current counters data
@app.route('/api/cur_counters')
def get_cur_counters():
    try:
        cursor.execute('SELECT * FROM [dbo].[current_counter]')
        rows = cursor.fetchall()
        cur_counters = [{'id': row.id, 'name': row.name} for row in rows]  # Adjust column names accordingly
        return jsonify(cur_counters)
    except Exception as e:
        print('Error querying current counter data:', e)
        return 'Internal Server Error', 500

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=True for development, remove for production
