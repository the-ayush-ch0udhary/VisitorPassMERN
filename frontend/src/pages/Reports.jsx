import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const headers = { Authorization: `Bearer ${user.token}` };
        const res = await axios.get('http://localhost:5000/api/check-logs', { headers });
        setLogs(res.data);
      } catch (err) {
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter logs locally based on search term and dates
  const filteredLogs = logs.filter((log) => {
    // 1. Search term check (across name, email, phone)
    const matchesSearch = searchTerm 
      ? log.visitorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.visitorId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.visitorId?.phone?.includes(searchTerm)
      : true;

    // 2. Date range check
    let matchesDates = true;
    if (log.checkInTime) {
      const checkInDate = new Date(log.checkInTime);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (checkInDate < start) matchesDates = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (checkInDate > end) matchesDates = false;
      }
    }

    return matchesSearch && matchesDates;
  });

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Generating reports database...</div>;
  if (error) return <div style={{ padding: '40px', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%' }} className="animated-fade-in">
      
      {/* Header section (hidden on print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '4px' }}>Entry & Exit Reports</h2>
          <p style={{ color: 'var(--text-muted)' }}>Generate, filter, and print visitor check logs.</p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          🖨️ Print / Export PDF
        </button>
      </div>

      {/* Filter Options Panel (hidden on print) */}
      <div className="glass-panel no-print" style={{ padding: '24px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '15px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '15px' }}>Filter Reports</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Search Guest</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Printable Report Section */}
      <div className="glass-panel" style={{ padding: '30px', background: 'rgba(15, 23, 42, 0.3)' }}>
        <div className="print-header" style={{ display: 'none', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
          <h2>VISITOR PASS MANAGEMENT SYSTEM - REPORT</h2>
          <p>Generated on: {new Date().toLocaleString()}</p>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Visitor Details</th>
                <th>Phone</th>
                <th>Host Employee</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No matching entry logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{log.visitorId?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.visitorId?.email}</div>
                    </td>
                    <td>{log.visitorId?.phone}</td>
                    <td>{log.passId?.appointmentId?.hostId?.name || 'N/A'}</td>
                    <td>{log.checkInTime ? new Date(log.checkInTime).toLocaleString() : 'N/A'}</td>
                    <td>{log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : '-'}</td>
                    <td>
                      {log.checkOutTime ? (
                        <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Checked Out</span>
                      ) : (
                        <span style={{ color: 'var(--success)', fontWeight: '600' }}>Checked In (Active)</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add standard print-media CSS block */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          .glass-panel {
            background: none !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .custom-table th {
            color: #000000 !important;
            border-bottom: 2px solid #000000 !important;
          }
          .custom-table td {
            color: #000000 !important;
            border-bottom: 1px solid #cccccc !important;
          }
          .print-header {
            display: block !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
