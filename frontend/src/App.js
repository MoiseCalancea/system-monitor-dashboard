import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./App.css";

function App() {
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState({});
  const [disk, setDisk] = useState({});
  const [system, setSystem] = useState({});
  const [cpuHistory, setCpuHistory] = useState([]);

  // adresa backend-ului
  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cpuRes, memRes, diskRes, sysRes] = await Promise.all([
          axios.get(`${API_BASE}/cpu`),
          axios.get(`${API_BASE}/memory`),
          axios.get(`${API_BASE}/disk`),
          axios.get(`${API_BASE}/system`),
        ]);

        setCpu(cpuRes.data.cpu_percent);
        setMemory(memRes.data);
        setDisk(diskRes.data);
        setSystem(sysRes.data);

        // actualizăm graficul CPU
        setCpuHistory(prev => [...prev.slice(-19), { name: new Date().toLocaleTimeString(), value: cpuRes.data.cpu_percent }]);
      } catch (error) {
        console.error("Eroare la conectare:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>🖥️ System Monitor Dashboard !</h1>
      <h3>{system.os} — {system.hostname}</h3>

      <div className="stats">
        <div className="card">
          <h2>CPU</h2>
          <p>{cpu.toFixed(1)}%</p>
        </div>
        <div className="card">
          <h2>Memory</h2>
          <p>{memory.used?.toFixed(1)} / {memory.total?.toFixed(1)} GB</p>
        </div>
        <div className="card">
          <h2>Disk</h2>
          <p>{disk.used?.toFixed(1)} / {disk.total?.toFixed(1)} GB</p>
        </div>
      </div>

      <div className="chart">
        <h2>CPU Usage Over Time</h2>
        <LineChart width={700} height={300} data={cpuHistory}>
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="value" stroke="#007bff" />
        </LineChart>
      </div>
    </div>
  );
}

export default App;
console.log('test');
