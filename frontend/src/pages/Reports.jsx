import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem('user') || '{}'
        );

        if (!user.token) {
          setError('Please login again.');
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${user.token}`
        };

        const res = await axios.get(
          `${API_URL}/check-logs`,
          { headers }
        );

        setLogs(res.data);
      } catch (error) {
        console.error('Report Fetch Error:', error);
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = searchTerm
      ? log.visitorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.visitorId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.visitorId?.phone?.includes(searchTerm)
      : true;

    let matchesDates = true;

    if (log.checkInTime) {
      const checkInDate = new Date(log.checkInTime);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (checkInDate < start) {
          matchesDates = false;
        }
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (checkInDate > end) {
          matchesDates = false;
        }
      }
    }

    return matchesSearch && matchesDates;
  });

  const handlePrint = () => {
    window.print();
  };

  const downloadCSV = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem('user') || '{}'
      );

      const response = await axios.get(
        `${API_URL}/reports/export/csv`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        'visitor_report.csv'
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('CSV Export Error:', error);
      alert('Failed to export CSV.');
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
        Loading reports...
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
    <div
      style={{
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%'
      }}
      className="animated-fade-in"
    >
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          flexWrap: 'wrap',
          gap: '15px'
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '32px',
              marginBottom: '4px'
            }}
          >
            Entry & Exit Reports
          </h2>

          <p style={{ color: 'var(--text-muted)' }}>
            Generate, filter, and print visitor check logs.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px'
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={downloadCSV}
          >
            📄 Export CSV
          </button>

          <button
            className="btn btn-primary"
            onClick={handlePrint}
          >
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div
        className="glass-panel no-print"
        style={{
          padding: '24px',
          marginBottom: '30px'
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '15px'
          }}
        >
          Filter Reports
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}
        >
          <div className="input-group">
            <label className="input-label">
              Search Visitor
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Name, email or phone..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Start Date
            </label>

            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              End Date
            </label>

            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Keep your existing table section exactly as it is */}

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