import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Visitor');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [orgs, setOrgs] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load organizations for dropdown
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(`${API_URL}/orgs`);

        setOrgs(response.data);

        if (response.data.length > 0) {
          setSelectedOrg(response.data[0]._id);
        }
      } catch (error) {
        console.error(
          'Failed to load organizations:',
          error
        );
      }
    };

    fetchOrganizations();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        organizationId: selectedOrg
      };

      await axios.post(
        `${API_URL}/auth/register`,
        payload
      );

      navigate('/login');

    } catch (error) {
      console.error(
        'Registration Error:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Registration failed. Please verify all inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}
    >
      <div
        className="glass-panel animated-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px'
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            textAlign: 'center',
            marginBottom: '8px'
          }}
        >
          Create Account
        </h2>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >
          Register to book visits or access the staff console
        </p>

        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger)',
              padding: '12px 16px',
              borderRadius: '8px',
              color: 'var(--danger)',
              fontSize: '13px',
              marginBottom: '20px'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label className="input-label">
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              required
              placeholder="e.g. johndoe@gmail.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px'
            }}
          >
            <div className="input-group">
              <label className="input-label">
                User Role
              </label>

              <select
                className="form-control form-select"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >
                <option value="Visitor">
                  Visitor
                </option>
                <option value="Host">
                  Host / Employee
                </option>
                <option value="Security">
                  Security Guard
                </option>
                <option value="Admin">
                  Admin
                </option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">
                Organization
              </label>

              <select
                className="form-control form-select"
                required
                value={selectedOrg}
                onChange={(e) =>
                  setSelectedOrg(e.target.value)
                }
              >
                {orgs.length === 0 ? (
                  <option value="">
                    No organizations available
                  </option>
                ) : (
                  orgs.map((org) => (
                    <option
                      key={org._id}
                      value={org._id}
                    >
                      {org.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {orgs.length === 0 && (
            <p
              style={{
                fontSize: '11px',
                color: 'var(--danger)',
                marginBottom: '15px'
              }}
            >
              Please create an organization first.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '10px'
            }}
            disabled={
              loading || orgs.length === 0
            }
          >
            {loading
              ? 'Creating Account...'
              : 'Sign Up'}
          </button>
        </form>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: '25px'
          }}
        >
          Already registered?{' '}
          <Link
            to="/login"
            style={{
              color: '#818cf8',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;