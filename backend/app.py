from flask import Flask, jsonify
from flask_cors import CORS
import system_stats

app = Flask(__name__)
CORS(app)  # permite accesul de la frontend (React)

@app.route('/api/cpu')
def cpu():
    return jsonify({"cpu_percent": system_stats.get_cpu_usage()})

@app.route('/api/memory')
def memory():
    return jsonify(system_stats.get_memory_usage())

@app.route('/api/disk')
def disk():
    return jsonify(system_stats.get_disk_usage())

@app.route('/api/uptime')
def uptime():
    return jsonify({"uptime": system_stats.get_uptime()})

@app.route('/api/system')
def system():
    return jsonify(system_stats.get_system_info())

@app.route('/api/services')
def services():
    return jsonify(system_stats.get_services_status())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
