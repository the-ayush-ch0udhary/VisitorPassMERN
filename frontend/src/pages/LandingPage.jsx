import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>

      {/* Title / Hero section */}
      <div className="animated-fade-in" style={{ maxWidth: '800px', marginBottom: '50px' }}>
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
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '35px' }}>
          Create printable pass badges, verify visitors with real-time entry logs, email alerts, and multi-organization tenant separation.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/book" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }}>
            Book Visitor Pass
          </Link>
          <Link to="/org-setup" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
            Register Organization
          </Link>
        </div>
      </div>

      {/* Info grid */}
      <div className="stats-grid animated-fade-in" style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '20px' }}>

        <div className="glass-panel" style={{ padding: '30px', textAlign: 'left' }}>
          <div style={{ fontSize: '28px', marginBottom: '15px' }}>🎫</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Instant Pass Badges</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Hosts receive notification alerts and approve visits. Upon approval, print badges with details and automated QR validation keys are emailed instantly.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px', textAlign: 'left' }}>
          <div style={{ fontSize: '28px', marginBottom: '15px' }}>🛡️</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Front-Desk Console</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Security guards scan digital passes or verify badge IDs manually. Automated logs keep track of exact check-in/out timestamps.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px', textAlign: 'left' }}>
          <div style={{ fontSize: '28px', marginBottom: '15px' }}>📊</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Audit & Analytics</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Comprehensive activity logging records every system operation. Visual trends and KPI charts help administrators keep check of daily visitor flow.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
