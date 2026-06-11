import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const HostDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch appointments assigned to the logged-in host
  const fetchAppointments = async () => {
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
        `${API_URL}/appointments`,
        { headers }
      );

      setAppointments(response.data);

    } catch (error) {
      console.error(error);
      setError('Failed to fetch appointment logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Approve or reject appointment
  const handleAction = async (id, action) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const headers = {
        Authorization: `Bearer ${user.token}`
      };

      await axios.put(
        `${API_URL}/appointments/${id}/${action}`,
        {},
        { headers }
      );

      // Refresh appointment list
      fetchAppointments();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        'Action failed.'
      );
    }
  };

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
          to="/host"
          className="sidebar-link active"
        >
          Appointments List
        </Link>

        <Link
          to="/visitors-list"
          className="sidebar-link"
        >
          Visitor Profiles
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
          Host Employee Hub
        </h2>

        <p
          style={{
            color: 'var(--text-muted)',
            marginBottom: '30px'
          }}
        >
          Approve or reject visitor entry requests.
        </p>

        <div
          className="glass-panel"
          style={{
            padding: '30px'
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              marginBottom: '15px'
            }}
          >
            Visitor Booking Requests
          </h3>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Purpose</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th
                    style={{
                      textAlign: 'center'
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}
                    >
                      No appointment requests found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td
                        style={{
                          fontWeight: '600'
                        }}
                      >
                        {appointment.visitorId?.name}
                      </td>

                      <td>
                        {appointment.purpose}
                      </td>

                      <td>
                        {new Date(
                          appointment.date
                        ).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`status-pill ${
                            appointment.status === 'Approved'
                              ? 'status-approved'
                              : appointment.status === 'Rejected'
                              ? 'status-rejected'
                              : 'status-pending'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      <td
                        style={{
                          display: 'flex',
                          gap: '10px',
                          justifyContent: 'center'
                        }}
                      >
                        {appointment.status === 'Pending' ? (
                          <>
                            <button
                              className="btn btn-success"
                              style={{
                                padding: '8px 16px',
                                fontSize: '12px'
                              }}
                              onClick={() =>
                                handleAction(
                                  appointment._id,
                                  'approve'
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-danger"
                              style={{
                                padding: '8px 16px',
                                fontSize: '12px'
                              }}
                              onClick={() =>
                                handleAction(
                                  appointment._id,
                                  'reject'
                                )
                              }
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            style={{
                              fontSize: '13px',
                              color:
                                'var(--text-muted)',
                              fontStyle: 'italic'
                            }}
                          >
                            Decision Made
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