import { useState, useEffect } from 'react';

function StatusBadge({ status }) {
  const color = status === 'ok' ? '#22c55e' : '#ef4444';
  return (
    <span style={{ background: color, color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem' }}>
      {status}
    </span>
  );
}

function App() {
  const [health, setHealth] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = () => {
    fetch('http://192.168.1.100:8000/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data);
        setLastChecked(new Date().toLocaleTimeString());
      })
      .catch(() => setHealth({ status: 'error', service: 'unknown' }));
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0f172a', minHeight: '100vh', color: '#e2e8f0' }}>
      <h1 style={{ color: '#38bdf8' }}>LB Automation Dashboard</h1>
      {health ? (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', maxWidth: '400px' }}>
          <p><strong>Service:</strong> {health.service}</p>
          <p><strong>Status:</strong> <StatusBadge status={health.status} /></p>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Last checked: {lastChecked}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
