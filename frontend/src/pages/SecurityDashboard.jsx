import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SecurityDashboard = () => {
  const [passIdInput, setPassIdInput] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchLogs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${user.token}` };
      const res = await axios.get('http://localhost:5000/api/check-logs', { headers });
      setLogs(res.data);
    } catch (err) {
      setError('Failed to fetch check logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleScanAction = async (action) => {
    setActionMessage('');
    setActionError('');
    if (!passIdInput.trim()) {
      setActionError('Please enter a Pass ID or scan a QR code first.');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${user.token}` };
      const endpoint = `http://localhost:5000/api/check-logs/${action}`;

      const res = await axios.post(endpoint, { passId: passIdInput.trim() }, { headers });
      
      setActionMessage(res.data.message);
      setPassIdInput('');
      fetchLogs(); // refresh log table
    } catch (err) {
      setActionError(err.response?.data?.message || 'Transaction failed.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Security terminal...</div>;
  if (error) return <div style={{ padding: '40px', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div className="dashboard-layout animated-fade-in">
      {/* Sidebar panel */}
      <aside className="sidebar">
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '15px' }}>Navigation</h3>
        <Link to="/security" className="sidebar-link active">Scan Console</Link>
        <Link to="/visitors-list" className="sidebar-link">Visitor Profiles</Link>
        <Link to="/reports" className="sidebar-link">Reports</Link>
      </aside>

      {/* Main dashboard center */}
      <main className="main-content">
        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Front-Desk Security Console</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Verify digital QR codes to check-in or check-out visitors.</p>

        {/* Scan controller panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', marginBottom: '30px' }}>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>QR Code & ID Scan Port</h3>
            
            {actionMessage && (
              <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', padding: '12px 16px', borderRadius: '8px', color: 'var(--success)', fontSize: '13px', marginBottom: '15px' }}>
                ✅ {actionMessage}
              </div>
            )}
            {actionError && (
              <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '12px 16px', borderRadius: '8px', color: 'var(--danger)', fontSize: '13px', marginBottom: '15px' }}>
                ⚠️ {actionError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Paste Pass ID or QR code text here (e.g. 66088c5f...)"
                value={passIdInput}
                onChange={(e) => setPassIdInput(e.target.value)}
              />
              <button className="btn btn-success" onClick={() => handleScanAction('check-in')} style={{ padding: '12px 24px' }}>
                Check In
              </button>
              <button className="btn btn-danger" onClick={() => handleScanAction('check-out')} style={{ padding: '12px 24px' }}>
                Check Out
              </button>
            </div>
          </div>
        </div>

        {/* Entry Logs Table */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>On-Site Guest Logs</h3>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pass ID</th>
                  <th>Visitor Name</th>
                  <th>Host Employee</th>
                  <th>Check-In Time</th>
                  <th>Check-Out Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No visitor entry logs recorded.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id}>
                      <td style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.passId?._id}</td>
                      <td style={{ fontWeight: '600' }}>{log.visitorId?.name}</td>
                      <td>{log.passId?.appointmentId?.hostId?.name || 'N/A'}</td>
                      <td>{log.checkInTime ? new Date(log.checkInTime).toLocaleString() : 'N/A'}</td>
                      <td>{log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : '-'}</td>
                      <td>
                        {log.checkOutTime ? (
                          <span className="status-pill status-rejected">Checked Out</span>
                        ) : (
                          <span className="status-pill status-approved">Checked In (Active)</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityDashboard;
