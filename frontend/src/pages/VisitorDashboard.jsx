import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VisitorDashboard = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const headers = {
        Authorization: `Bearer ${user.token}`
      };

      const appointmentRes = await axios.get(
        'http://localhost:5000/api/appointments',
        { headers }
      );
      console.log("Appointments", appointmentRes.data);

      setAppointments(appointmentRes.data);

      const passRes = await axios.get(
        'http://localhost:5000/api/passes',
        { headers }
      );
      console.log("Passes", passRes.data);
      setPasses(passRes.data);

    } catch (err) {
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const getPdfUrl = (filename) => {
    return `http://localhost:5000/uploads/passes/${filename}`;
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading pass details...</div>;
  if (error) return <div style={{ padding: '40px', color: 'var(--danger)' }}>{error}</div>;

  
return (
  <div
    className="animated-fade-in"
    style={{
      flex: 1,
      padding: "40px",
      maxWidth: "900px",
      margin: "0 auto",
      width: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "15px",
      }}
    >
      <h2 style={{ fontSize: "32px", margin: 0 }}>
        Visitor Dashboard
      </h2>

      <Link to="/book" className="btn btn-primary">
        + Book Appointment
      </Link>
    </div>

    <p
      style={{
        color: "var(--text-muted)",
        marginBottom: "30px",
      }}
    >
      View your appointments and approved visitor passes.
    </p>

    {/* APPOINTMENTS SECTION */}
    <div style={{ marginBottom: "40px" }}>
      <h3 style={{ marginBottom: "20px" }}>
        My Appointments
      </h3>

      {appointments.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: "25px",
            textAlign: "center",
          }}
        >
          <p>No appointments found.</p>

          <Link
            to="/book"
            className="btn btn-primary"
            style={{ marginTop: "15px" }}
          >
            Schedule Appointment
          </Link>
        </div>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="glass-panel"
            style={{
              padding: "20px",
              marginBottom: "15px",
            }}
          >
            <h4>{appointment.purpose}</h4>

            <p>
              📅{" "}
              {new Date(
                appointment.date
              ).toLocaleString()}
            </p>

            <p>
              👤 Host:{" "}
              {appointment.hostId?.name ||
                "Not Assigned"}
            </p>

            <p>
              Status:{" "}
              <strong>{appointment.status}</strong>
            </p>
          </div>
        ))
      )}
    </div>

    {/* PASSES SECTION */}
    <div>
      <h3 style={{ marginBottom: "20px" }}>
        My Digital Passes
      </h3>

      {passes.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "15px",
            }}
          >
            🎫
          </div>

          <h3>No Active Passes</h3>

          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "20px",
            }}
          >
            Your appointment may still be pending approval.
          </p>

          <Link
            to="/book"
            className="btn btn-primary"
          >
            Schedule Appointment
          </Link>
        </div>
      ) : (
        passes.map((pass) => (
          <div
            key={pass._id}
            className="glass-panel"
            style={{
              display: "flex",
              gap: "30px",
              padding: "30px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                minWidth: "220px",
                textAlign: "center",
              }}
            >
              <img
                src={pass.qrCode}
                alt="QR Code"
                style={{
                  width: "180px",
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              />

              <div
                style={{
                  marginTop: "10px",
                  fontSize: "11px",
                }}
              >
                Pass ID: {pass._id}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3>{pass.visitorId?.name}</h3>

              <p>{pass.visitorId?.email}</p>

              <p>
                Host:{" "}
                {pass.appointmentId?.hostId?.name}
              </p>

              <p>
                Purpose:{" "}
                {pass.appointmentId?.purpose}
              </p>

              <p>
                Expires:{" "}
                {new Date(
                  pass.expiryDate
                ).toLocaleString()}
              </p>

              <a
                href={getPdfUrl(pass.pdfPath)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Download PDF
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)};
export default VisitorDashboard;