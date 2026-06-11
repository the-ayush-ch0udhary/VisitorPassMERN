import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

const RequestAppointment = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Profile and appointment fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState(null);

  const [orgs, setOrgs] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [hosts, setHosts] = useState([]);
  const [selectedHostId, setSelectedHostId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load organizations
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const orgRes = await axios.get(`${API_URL}/orgs`);
        setOrgs(orgRes.data);
        if (orgRes.data.length > 0) {
          setSelectedOrgId(orgRes.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load organizations:", err);
      }
    };
    fetchOrgs();

    // Prefill visitor email if user is already logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "Visitor") {
      setEmail(user.email);
    }
  }, []);

  // Fetch hosts when selected organization changes
  useEffect(() => {
    const fetchHosts = async () => {
      if (!selectedOrgId) return;
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

const res = await axios.get(
  `${API_URL}/auth/hosts?organizationId=${selectedOrgId}`,
  {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  }
);
        setHosts(res.data);
        if (res.data.length > 0) {
          setSelectedHostId(res.data[0]._id);
        } else {
          setSelectedHostId("");
        }
      } catch (err) {
        console.error("Failed to load host list:", err);
      }
    };
    fetchHosts();
  }, [selectedOrgId]);

  // Send verification OTP to email
  const handleSendOTP = async () => {
    setError("");
    setOtpLoading(true);
    try {
      await axios.post(`${API_URL}/otp/send`, { email });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP code.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify code
  const handleVerifyOTP = async () => {
    setError("");
    setOtpLoading(true);
    try {
      const res = await axios.post(`${API_URL}/otp/verify`, {
        email,
        otp,
      });
      if (res.data.success) {
        setOtpVerified(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect or expired OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Submit appointment booking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!selectedHostId) {
      setError("Please choose a host employee to schedule with.");
      setLoading(false);
      return;
    }

    if (!otpVerified) {
      setError("Please verify OTP first.");
      setLoading(false);
      return;
    }

    if (new Date(date) <= new Date()) {
      setError("Please select a future appointment date.");
      setLoading(false);
      return;
    }

    if (phone.trim().length < 10) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }
    try {
      // 1. Create or verify visitor profile
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const config = user?.token
        ? {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        : {};

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("organizationId", selectedOrgId);
      if (photo) {
        formData.append("photo", photo);
      }

      // Upsert/Create visitor record
      const newProfileRes = await axios.post(
        `${API_URL}/visitors`,
        formData,
        config,
      );
      const createdVisitorId = newProfileRes.data._id;

      // 2. Book appointment
      await axios.post(
        `${API_URL}/appointments`,
        {
          visitorId: createdVisitorId,
          hostId: selectedHostId,
          organizationId: selectedOrgId,
          date,
          purpose,
        },
        config,
      );
      setSuccess(
        "Appointment request submitted successfully! Pending host employee approval.",
      );
      setTimeout(() => {
        navigate("/");
      }, 3500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        className="glass-panel animated-fade-in"
        style={{ width: "100%", maxWidth: "520px", padding: "40px" }}
      >
        <h2
          style={{ fontSize: "28px", textAlign: "center", marginBottom: "8px" }}
        >
          Schedule Appointment
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          Verify email and book pass with organization hosts
        </p>

        {error && (
          <div
            style={{
              background: "var(--danger-bg)",
              border: "1px solid var(--danger)",
              padding: "12px 16px",
              borderRadius: "8px",
              color: "var(--danger)",
              fontSize: "13px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "var(--success-bg)",
              border: "1px solid var(--success)",
              padding: "16px",
              borderRadius: "8px",
              color: "var(--success)",
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            🎉 <strong>Success!</strong> {success}
          </div>
        )}

        {/* Step 1: Email OTP validation */}
        {!otpVerified ? (
          <div>
            <div className="input-group">
              <label className="input-label">Visitor Email Address</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="e.g. guest@example.com"
                  disabled={otpSent}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!otpSent && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSendOTP}
                    disabled={otpLoading || !email}
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                )}
              </div>
            </div>

            {otpSent && (
              <div className="input-group animated-fade-in">
                <label className="input-label">Enter 6-digit OTP Code</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleVerifyOTP}
                    disabled={otpLoading || !otp}
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    marginTop: "8px",
                  }}
                >
                  Check your mail (or Mailtrap inbox) for the code.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Rest of booking form */
          <form onSubmit={handleSubmitBooking} className="animated-fade-in">
            <div
              style={{
                background: "var(--success-bg)",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--success)",
                fontSize: "12px",
                color: "var(--success)",
                marginBottom: "20px",
              }}
            >
              ✓ Email Verified: {email}
            </div>

            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Richard Hendricks"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. +1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div className="input-group">
                <label className="input-label">Organization</label>
                <select
                  className="form-control form-select"
                  required
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                >
                  {orgs.map((o) => (
                    <option key={o._id} value={o._id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Host Employee</label>
                <select
                  className="form-control form-select"
                  required
                  value={selectedHostId}
                  onChange={(e) => setSelectedHostId(e.target.value)}
                >
                  {hosts.length === 0 ? (
                    <option value="">No hosts available...</option>
                  ) : (
                    hosts.map((h) => (
                      <option key={h._id} value={h._id}>
                        {h.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Appointment Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Purpose of Visit</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Business Consultation"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: "30px" }}>
              <label className="input-label">Upload Photo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px" }}
              disabled={loading}
            >
              {loading ? "Submitting request..." : "Book Pass"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestAppointment;
