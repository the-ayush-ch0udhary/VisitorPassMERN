import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HostDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${user.token}` };
      const res = await axios.get('http://localhost:5000/api/appointments', { headers });
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to fetch appointment logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${user.token}` };
      
      // PUT API request: /api/appointments/:id/approve or reject
      await axios.put(`http://localhost:5000/api/appointments/${id}/${action}`, {}, { headers });
      
      // Refresh list
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '40px', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div className="dashboard-layout animated-fade-in">
      {/* Sidebar panel */}
      <aside className="sidebar">
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '15px' }}>Navigation</h3>
        <Link to="/host" className="sidebar-link active">Appointments List</Link>
        <Link to="/visitors-list" className="sidebar-link">Visitor Profiles</Link>
      </aside>

      {/* Main dashboard center */}
      <main className="main-content">
        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Host Employee Hub</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Approve or reject visitor entry request passes.</p>

        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Visitor Booking Requests</h3>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Purpose</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No appointment requests logged.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: '600' }}>{a.visitorId?.name}</td>
                      <td>{a.purpose}</td>
                      <td>{new Date(a.date).toLocaleString()}</td>
                      <td>
                        <span className={`status-pill ${
                          a.status === 'Approved' ? 'status-approved' : 
                          a.status === 'Rejected' ? 'status-rejected' : 
                          'status-pending'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {a.status === 'Pending' ? (
                          <>
                            <button className="btn btn-success" onClick={() => handleAction(a._id, 'approve')} style={{ padding: '8px 16px', fontSize: '12px' }}>
                              Approve
                            </button>
                            <button className="btn btn-danger" onClick={() => handleAction(a._id, 'reject')} style={{ padding: '8px 16px', fontSize: '12px' }}>
                              Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Decided
                          </span>
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

export default HostDashboard;
