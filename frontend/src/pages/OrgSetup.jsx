import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

const OrgSetup = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterOrg = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post(`${API_URL}/orgs`, {
        name: name.trim(),
        address: address.trim(),
      });

      setSuccess(true);
      setName("");
      setAddress("");
    } catch (error) {
      console.error("Organization Registration Error:", error);

      setError(
        error.response?.data?.message || "Failed to register organization.",
      );
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
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "40px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Register Organization
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Set up a new organization before registering users.
        </p>

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
            }}
          >
            🎉 <strong>Success!</strong> Organization registered successfully.
            <div style={{ marginTop: "10px" }}>
              <Link
                to="/register"
                style={{
                  color: "#ffffff",
                  fontWeight: "700",
                  textDecoration: "underline",
                }}
              >
                Go to Registration →
              </Link>
            </div>
          </div>
        )}

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
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegisterOrg}>
          <div className="input-group">
            <label className="input-label">Organization Name</label>

            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Acme Corporation"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div
            className="input-group"
            style={{
              marginBottom: "25px",
            }}
          >
            <label className="input-label">Address</label>

            <textarea
              className="form-control"
              required
              rows="3"
              placeholder="Enter organization address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "14px",
            }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Organization"}
          </button>
        </form>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          <Link
            to="/"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrgSetup;
