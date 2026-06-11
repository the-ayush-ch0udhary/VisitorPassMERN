import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.token) {
          setError('User session not found');
          return;
        }

        const headers = {
          Authorization: `Bearer ${user.token}`
        };

        const response = await axios.get(
          `${API_URL}/audit-logs`,
          { headers }
        );

        setLogs(response.data);

      } catch (error) {
        console.error(error);
        setError('Failed to fetch activity audit logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center'
        }}
      >
        Loading system logs...
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

  return (
    <div
      className="animated-fade-in"
      style={{
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <h2
        style={{
          fontSize: '32px',
          marginBottom: '4px'
        }}
      >
        System Audit Trail
      </h2>

      <p
        style={{
          color: 'var(--text-muted)',
          marginBottom: '30px'
        }}
      >
        Immutable activity log of all host, security,
        and admin actions.
      </p>

      <div
        className="glass-panel"
        style={{ padding: '30px' }}
      >
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: 'center',
                      color: 'var(--text-muted)'
                    }}
                  >
                    No activities recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      {log.userId ? (
                        <div>
                          <div
                            style={{
                              fontWeight: '600'
                            }}
                          >
                            {log.userId.name}
                          </div>

                          <div
                            style={{
                              fontSize: '11px',
                              color:
                                'var(--text-muted)'
                            }}
                          >
                            {log.userId.email}
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            color:
                              'var(--text-muted)',
                            fontStyle: 'italic'
                          }}
                        >
                          Anonymous / System
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          log.userId?.role === 'Admin'
                            ? 'status-approved'
                            : log.userId?.role === 'Host'
                            ? 'status-pending'
                            : log.userId?.role === 'Security'
                            ? 'status-rejected'
                            : 'status-pending'
                        }`}
                        style={{
                          fontSize: '11px'
                        }}
                      >
                        {log.userId?.role || 'Guest'}
                      </span>
                    </td>

                    <td>{log.action}</td>

                    <td>
                      {new Date(
                        log.timestamp
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;