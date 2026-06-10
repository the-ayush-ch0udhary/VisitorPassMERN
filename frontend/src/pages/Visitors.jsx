import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states for Add/Edit Visitor Modal
  const [showForm, setShowForm] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const fetchVisitors = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${user.token}` };
      const endpoint = search
        ? `http://localhost:5000/api/visitors?search=${encodeURIComponent(search)}`
        : 'http://localhost:5000/api/visitors';

      const res = await axios.get(endpoint, { headers });
      setVisitors(res.data);
    } catch (err) {
      setError('Failed to fetch visitor profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search]);

  const handleEditClick = (v) => {
    setEditingVisitor(v);
    setName(v.name);
    setPhone(v.phone);
    setEmail(v.email);
    setAddress(v.address);
    setPhotoFile(null);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingVisitor(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPhotoFile(null);
    setShowForm(true);
  };

  const handleSaveVisitor = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'multipart/form-data'
      };

      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', address);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      if (editingVisitor) {
        await axios.put(`http://localhost:5000/api/visitors/${editingVisitor._id}`, formData, { headers });
      } else {
        formData.append('organizationId', user.organizationId);
        await axios.post('http://localhost:5000/api/visitors', formData, { headers });
      }

      setShowForm(false);
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save visitor profile.');
    }
  };

  const handleDeleteVisitor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this visitor profile?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.delete(`http://localhost:5000/api/visitors/${id}`, { headers });
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete profile.');
    }
  };

  const getPhotoUrl = (filename) => {
    return `http://localhost:5000/uploads/${filename}`;
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%' }} className="animated-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '4px' }}>Visitor Database</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create, read, update, and delete visitor profiles.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          + New Visitor Profile
        </button>
      </div>

      {/* Search Bar & Stats */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form modal backdrop */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                marginBottom: "20px",
                color: "#2563eb"
              }}
            >
              {editingVisitor ? "Edit Visitor Profile" : "Create Visitor Profile"}
            </h2>

            <form onSubmit={handleSaveVisitor}>
              <div className="input-group">
                <label className="input-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoFile(e.target.files[0])
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px"
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visitor profiles grid */}
      {loading ? (
        <div>Loading visitor database...</div>
      ) : visitors.length === 0 ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No visitor records found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {visitors.map((v) => (
            <div key={v._id} className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid var(--panel-border)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)' }}>
                {v.photo ? (
                  <img src={getPhotoUrl(v.photo)} alt="Visitor profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '20px' }}>👤</span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '16px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{v.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.email}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.phone}</p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => handleEditClick(v)} style={{ padding: '6px 12px', fontSize: '11px' }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteVisitor(v._id)} style={{ padding: '6px 12px', fontSize: '11px' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Visitors;
