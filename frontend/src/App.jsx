import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages (to be created in subsequent steps)
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OrgSetup from './pages/OrgSetup';
import AdminDashboard from './pages/AdminDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import HostDashboard from './pages/HostDashboard';
import VisitorDashboard from './pages/VisitorDashboard';
import RequestAppointment from './pages/RequestAppointment';
import Visitors from './pages/Visitors';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';

// Main Application shell containing navbar and router pathways
function App() {
  // Simple logout helper
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Transparent glass header navigation */}
        <header className="nav-container glass-panel" style={{ margin: '15px 15px 0 15px', padding: '12px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-title)' }}>
              VISITOR PASS
            </span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Home</Link>
            {user ? (
              <>
                {user.role === 'Admin' && <Link to="/admin" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Admin Dashboard</Link>}
                {user.role === 'Security' && <Link to="/security" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Security Dashboard</Link>}
                {user.role === 'Host' && <Link to="/host" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Host Dashboard</Link>}
                {user.role === 'Visitor' && <Link to="/visitor" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>My Pass</Link>}
                
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ({user.role}) {user.name}
                </span>
                
                <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '12px' }}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Log In</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>Sign Up</Link>
              </>
            )}
          </nav>
        </header>

        {/* Routes definitions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/org-setup" element={<OrgSetup />} />
            
            {/* Protected Visitor booking page */}
            <Route path="/book" element={<RequestAppointment />} />

            {/* Protected Role-Based Dashboard Gates */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/security" element={
              <ProtectedRoute allowedRoles={['Security', 'Admin']}>
                <SecurityDashboard />
              </ProtectedRoute>
            } />
            <Route path="/host" element={
              <ProtectedRoute allowedRoles={['Host', 'Admin']}>
                <HostDashboard />
              </ProtectedRoute>
            } />
            <Route path="/visitor" element={
              <ProtectedRoute allowedRoles={['Visitor']}>
                <VisitorDashboard />
              </ProtectedRoute>
            } />

            {/* Additional Protected CRUD & Log Views */}
            <Route path="/visitors-list" element={
              <ProtectedRoute allowedRoles={['Admin', 'Security', 'Host']}>
                <Visitors />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['Admin', 'Security', 'Host']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/audit-logs" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AuditLogs />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
