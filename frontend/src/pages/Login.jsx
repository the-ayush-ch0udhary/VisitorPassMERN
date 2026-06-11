import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.trim(),
        password,
      });

      if (!response.data) {
        throw new Error("No response received from server");
      }

      // Save user session
      localStorage.setItem("user", JSON.stringify(response.data));

      const { role } = response.data;

      // Redirect based on role
      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "Security") {
        navigate("/security");
      } else if (role === "Host") {
        navigate("/host");
      } else {
        navigate("/visitor");
      }

      // Refresh navbar/header after login
      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please verify credentials.",
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
          maxWidth: "420px",
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
          Welcome Back
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Log in with your credentials to access the console
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

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email Address</label>

            <input
              type="email"
              className="form-control"
              required
              placeholder="e.g. admin@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div
            className="input-group"
            style={{
              marginBottom: "25px",
            }}
          >
            <label className="input-label">Password</label>

            <input
              type="password"
              className="form-control"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Sign In"}
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
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#818cf8",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
