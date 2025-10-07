import psutil
import platform
import subprocess
import time

def get_cpu_usage():
    return psutil.cpu_percent(interval=1)

def get_memory_usage():
    mem = psutil.virtual_memory()
    return {
        "total": round(mem.total / (1024 ** 3), 2),
        "used": round(mem.used / (1024 ** 3), 2),
        "percent": mem.percent
    }

def get_disk_usage():
    disk = psutil.disk_usage('/')
    return {
        "total": round(disk.total / (1024 ** 3), 2),
        "used": round(disk.used / (1024 ** 3), 2),
        "percent": disk.percent
    }

def get_uptime():
    boot_time = psutil.boot_time()
    uptime_seconds = time.time() - boot_time
    hours = int(uptime_seconds // 3600)
    minutes = int((uptime_seconds % 3600) // 60)
    return f"{hours}h {minutes}m"

def get_system_info():
    return {
        "os": platform.system(),
        "hostname": platform.node(),
        "kernel": platform.release(),
    }

def check_service_status(service_name):
    try:
        output = subprocess.check_output(
            ["systemctl", "is-active", service_name],
            stderr=subprocess.STDOUT
        ).decode().strip()
        return "running" if output == "active" else "stopped"
    except subprocess.CalledProcessError:
        return "unknown"

def get_services_status():
    services = ["nginx", "docker", "ssh"]
    return {service: check_service_status(service) for service in services}
