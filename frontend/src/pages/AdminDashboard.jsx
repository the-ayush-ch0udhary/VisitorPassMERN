import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.token) {
          setError('User session not found');
          return;
        }

        const headers = {
          Authorization: `Bearer ${user.token}`
        };

        const [statsRes, trendsRes] = await Promise.all([
          axios.get(`${API_URL}/analytics/stats`, {
            headers
          }),
          axios.get(`${API_URL}/analytics/trends`, {
            headers
          })
        ]);

        setStats(statsRes.data);
        setTrends(trendsRes.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center'
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '40px',
          color: 'var(--danger)'
        }}
      >
        {error}
      </div>
    );
  }

  const maxCount = Math.max(
    ...trends.map(item => item.count),
    1
  );

  return (
    <div className="dashboard-layout animated-fade-in">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3
          style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '15px'
          }}
        >
          Navigation
        </h3>

        <Link
          to="/admin"
          className="sidebar-link active"
        >
          Dashboard Home
        </Link>

        <Link
          to="/visitors-list"
          className="sidebar-link"
        >
          Visitor Profiles
        </Link>

        <Link
          to="/reports"
          className="sidebar-link"
        >
          Entry/Exit Reports
        </Link>

        <Link
          to="/audit-logs"
          className="sidebar-link"
        >
          Audit Trail Logs
        </Link>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2
          style={{
            fontSize: '32px',
            marginBottom: '8px'
          }}
        >
          Administrative Hub
        </h2>

        <p
          style={{
            color: 'var(--text-muted)',
            marginBottom: '30px'
          }}
        >
          Real-time overview of visitor activity and
          system analytics.
        </p>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <span className="label">
              Total Visitors
            </span>
            <div className="value">
              {stats?.totalVisitors || 0}
            </div>
          </div>

          <div className="glass-panel stat-card">
            <span className="label">
              Generated Passes
            </span>
            <div className="value">
              {stats?.totalPasses || 0}
            </div>
          </div>

          <div className="glass-panel stat-card">
            <span className="label">
              Currently Onsite
            </span>
            <div
              className="value"
              style={{
                color: 'var(--success)'
              }}
            >
              {stats?.activeVisitors || 0}
            </div>
          </div>

          <div className="glass-panel stat-card">
            <span className="label">
              Today's Check-ins
            </span>
            <div className="value">
              {stats?.todayCheckIns || 0}
            </div>
          </div>

          <div className="glass-panel stat-card">
            <span className="label">
              Today's Check-outs
            </span>
            <div className="value">
              {stats?.todayCheckOuts || 0}
            </div>
          </div>
        </div>

        {/* Weekly Trends */}
        <div
          className="glass-panel"
          style={{
            padding: '30px',
            marginTop: '30px'
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              marginBottom: '20px'
            }}
          >
            Weekly Entry Trends
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '220px',
              padding: '10px 0',
              background:
                'rgba(15, 23, 42, 0.4)',
              borderRadius: '8px',
              border:
                '1px solid var(--panel-border)'
            }}
          >
            {trends.map((item, index) => {
              const heightPercentage =
                (item.count / maxCount) * 80;

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-main)',
                      marginBottom: '6px'
                    }}
                  >
                    {item.count}
                  </span>

                  <div
                    style={{
                      width: '32px',
                      height: `${Math.max(
                        item.count > 0
                          ? heightPercentage
                          : 4,
                        4
                      )}px`,
                      background:
                        'linear-gradient(to top, var(--primary) 0%, #a5b4fc 100%)',
                      borderRadius:
                        '4px 4px 0 0',
                      transition:
                        'height 0.3s ease'
                    }}
                  />

                  <span
                    style={{
                      fontSize: '11px',
                      color:
                        'var(--text-muted)',
                      marginTop: '8px'
                    }}
                  >
                    {item.label}
                  </span>
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