import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error('Failed to load user session');
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center'
      }}
    >
      {/* Hero Section */}
      <div
        className="animated-fade-in"
        style={{
          maxWidth: '800px',
          marginBottom: '50px'
        }}
      >
        <h1
          style={{
            fontSize: '56px',
            fontWeight: '800',
            lineHeight: '1.1',
            color: '#2563eb',
            marginBottom: '20px'
          }}
        >
          Seamless & Secure Visitor Operations
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            marginBottom: '35px'
          }}
        >
          Create printable pass badges, verify visitors with
          real-time entry logs, email alerts, and
          multi-organization tenant separation.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}
        >
          <Link
            to="/book"
            className="btn btn-primary"
            style={{
              padding: '14px 28px',
              fontSize: '15px'
            }}
          >
            Book Visitor Pass
          </Link>

          <Link
            to="/org-setup"
            className="btn btn-secondary"
            style={{
              padding: '14px 28px',
              fontSize: '15px'
            }}
          >
            Register Organization
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div
        className="stats-grid animated-fade-in"
        style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          marginTop: '20px'
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '30px',
            textAlign: 'left'
          }}
        >
          <div
            style={{
              fontSize: '28px',
              marginBottom: '15px'
            }}
          >
            🎫
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '10px'
            }}
          >
            Instant Pass Badges
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              lineHeight: '1.5'
            }}
          >
            Hosts receive notifications and approve visitor
            requests. Approved visitors receive digital
            passes with QR verification by email.
          </p>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '30px',
            textAlign: 'left'
          }}
        >
          <div
            style={{
              fontSize: '28px',
              marginBottom: '15px'
            }}
          >
            🛡️
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '10px'
            }}
          >
            Front Desk Console
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              lineHeight: '1.5'
            }}
          >
            Security staff can verify visitors through QR
            scans and maintain accurate check-in and
            check-out records.
          </p>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '30px',
            textAlign: 'left'
          }}
        >
          <div
            style={{
              fontSize: '28px',
              marginBottom: '15px'
            }}
          >
            📊
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '10px'
            }}
          >
            Audit & Analytics
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              lineHeight: '1.5'
            }}
          >
            Monitor visitor activity through audit logs,
            daily metrics, and trend reports to improve
            visitor management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;