import { useState, useEffect } from 'react';

const API = 'http://192.168.1.100:8000';

function Card({ title, children }) {
  return (
    <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h2 style={{ color: '#38bdf8', marginTop: 0, fontSize: '1rem' }}>{title}</h2>
      {children}
    </div>
  );
}

function Badge({ value }) {
  const ok = value === 'ok' || value === 'queued';
  return (
    <span style={{ background: ok ? '#22c55e' : '#ef4444', color: 'white', padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem' }}>
      {value}
    </span>
  );
}

function App() {
  const [health, setHealth] = useState(null);
  const [pools, setPools] = useState(null);
  const [bgp, setBgp] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchAll = () => {
    fetch(`${API}/health/`).then(r => r.json()).then(setHealth).catch(() => setHealth({ status: 'error' }));
    fetch(`${API}/api/pools/`).then(r => r.json()).then(setPools).catch(() => setPools([]));
    fetch(`${API}/api/bgp/status/`).then(r => r.json()).then(setBgp).catch(() => setBgp({ status: 'error' }));
    setLastChecked(new Date().toLocaleTimeString());
  };

  useEffect(() => { fetchAll(); const t = setInterval(fetchAll, 15000); return () => clearInterval(t); }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0f172a', minHeight: '100vh', color: '#e2e8f0', maxWidth: '600px' }}>
      <h1 style={{ color: '#38bdf8' }}>LB Automation Dashboard</h1>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2rem' }}>Last updated: {lastChecked} · <button onClick={fetchAll} style={{ background: 'none', border: '1px solid #475569', color: '#94a3b8', padding: '2px 8px', cursor: 'pointer', borderRadius: '4px' }}>Refresh</button></p>

      <Card title="Platform Health">
        {health ? <><p><strong>Service:</strong> {health.service}</p><p><strong>Status:</strong> <Badge value={health.status} /></p></> : <p>Loading...</p>}
      </Card>

      <Card title="Nginx Pools">
        {pools === null ? <p>Loading...</p> : pools.length === 0 ? <p style={{ color: '#64748b' }}>No pools configured</p> : <pre style={{ fontSize: '0.8rem' }}>{JSON.stringify(pools, null, 2)}</pre>}
      </Card>

      <Card title="BGP Status">
        {bgp ? <><p><strong>Status:</strong> <Badge value={bgp.status} /></p>{bgp.task_id && <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Task: {bgp.task_id}</p>}</> : <p>Loading...</p>}
      </Card>
    </div>
  );
}

export default App;
