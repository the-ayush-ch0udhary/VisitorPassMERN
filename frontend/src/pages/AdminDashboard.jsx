import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const headers = { Authorization: `Bearer ${user.token}` };

        const [statsRes, trendsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/analytics/stats', { headers }),
          axios.get('http://localhost:5000/api/analytics/trends', { headers })
        ]);

        setStats(statsRes.data);
        setTrends(trendsRes.data);
      } catch (err) {
        setError('Failed to fetch analytical dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading metrics...</div>;
  if (error) return <div style={{ padding: '40px', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div className="dashboard-layout animated-fade-in">
      {/* Sidebar panel */}
      <aside className="sidebar">
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '15px' }}>Navigation</h3>
        <Link to="/admin" className="sidebar-link active">Dashboard Home</Link>
        <Link to="/visitors-list" className="sidebar-link">Visitor Profiles</Link>
        <Link to="/reports" className="sidebar-link">Entry/Exit Reports</Link>
        <Link to="/audit-logs" className="sidebar-link">Audit Trail Logs</Link>
      </aside>

      {/* Main dashboard center */}
      <main className="main-content">
        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Administrative Hub</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Real-time overview of visitor activity and system analytics.</p>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <span className="label">Total Visitors</span>
            <div className="value">{stats?.totalVisitors}</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="label">Generated Passes</span>
            <div className="value">{stats?.totalPasses}</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="label">Currently Onsite</span>
            <div className="value" style={{ color: 'var(--success)' }}>{stats?.activeVisitors}</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="label">Today's Check-ins</span>
            <div className="value">{stats?.todayCheckIns}</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="label">Today's Check-outs</span>
            <div className="value">{stats?.todayCheckOuts}</div>
          </div>
        </div>

        {/* Charts & Trends Panel */}
        <div className="glass-panel" style={{ padding: '30px', marginTop: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Weekly Entry Trends</h3>
          
          {/* Simple custom SVG bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', padding: '10px 0', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
            {trends.map((item, index) => {
              // Find max value to determine relative height percentage
              const maxCount = Math.max(...trends.map(t => t.count), 1);
              const heightPercentage = (item.count / maxCount) * 80; // max height 80%

              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-main)', marginBottom: '6px' }}>{item.count}</span>
                  <div style={{
                    width: '32px',
                    height: `${Math.max(item.count > 0 ? heightPercentage : 4, 4)}px`,
                    background: 'linear-gradient(to top, var(--primary) 0%, #a5b4fc 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
