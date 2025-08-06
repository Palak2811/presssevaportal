import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const allCards = [
  'Registration', 'Regularity', 'Newsprint', 'Helpdesk',
  'Annual Statement', 'Management Info', 'Day to Day Operations', 'Main Profile',
  'User Management', 'Fee Structure', 'Suspension/Cancellation', 'About'
];

export default function Admin() {
  const [view, setView] = useState(null);
  const [users, setUsers] = useState([]);
  const [accessMap, setAccessMap] = useState({});
  const [formerAdmins, setFormerAdmins] = useState([]);
  const [showFormerAdmins, setShowFormerAdmins] = useState(false);

  useEffect(() => {
    const fetchFormerAdmins = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/former-admins');
        setFormerAdmins(res.data);
      } catch (err) {
        console.error("Failed to fetch former admins:", err);
      }
    };
    fetchFormerAdmins();
  }, []);

  const fetchUsers = async (type) => {
    setView(type);
    const route = type === 'pending' ? 'unapproved' : 'approved';
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/${route}`);
      setUsers(res.data);
      const init = {};
      res.data.forEach(u => {
        init[u.name] = u.access || ['About'];
      });
      setAccessMap(init);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      setAccessMap({});
    }
  };

  const toggle = (name, card) => {
    setAccessMap(prev => {
      if (card === 'About') return prev;
      const curr = prev[name] || [];
      return {
        ...prev,
        [name]: curr.includes(card)
          ? curr.filter(c => c !== card)
          : [...curr, card]
      };
    });
  };

  const save = async (name) => {
    if (!view) return;
    const route = view === 'pending' ? 'approve' : 'update-access';
    try {
      await axios.post(`http://localhost:5000/api/admin/${route}`, {
        name,
        access: accessMap[name]
      });
      alert(view === 'pending' ? 'User approved!' : 'Access updated!');
      fetchUsers(view);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save. Check console.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ flexDirection: 'column', alignItems: 'center' }}>
        <h1>Admin Panel</h1>

        {/* First horizontal line: centered Pending / Approved */}
        <div className="button-row center-row">
          <button className="button" onClick={() => fetchUsers('pending')}>Pending Registrations</button>
          <button className="button secondary" onClick={() => fetchUsers('approved')}>Approved Employees</button>
        </div>

        {/* Second line: old admins toggle centered */}
        <div className="button-row center-row" style={{ marginTop: 12 }}>
          <button
            className="button secondary former-admins-toggle"
            onClick={() => setShowFormerAdmins(prev => !prev)}
          >
            {showFormerAdmins ? 'Hide Old Admins' : 'See Old Admins'}
          </button>
        </div>
      </div>

      {view && users.length === 0 && (
        <div className="empty-state">
          <p>No {view === 'pending' ? 'pending' : 'approved'} users.</p>
        </div>
      )}

      <div className="section">
        {users.map(u => (
          <div key={u._id} className="user-card">
            <div className="user-header">
              <h3>{u.name}</h3>
            </div>
            <div className="user-info">
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Phone:</strong> {u.phoneno}</p>
            </div>
            <div className="access-grid">
              {allCards.map(card => (
                <label key={card} className="access-label">
                  <input
                    type="checkbox"
                    checked={accessMap[u.name]?.includes(card) || false}
                    onChange={() => toggle(u.name, card)}
                    disabled={card === 'About'}
                  />
                  {card}
                </label>
              ))}
            </div>
            <div className="user-action">
              <button className="button" onClick={() => save(u.name)}>
                {view === 'pending' ? 'Approve User' : 'Update Access'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr className="divider" />

      {showFormerAdmins && (
        <div className="former-admins">
          <h2>Former Admins</h2>
          {formerAdmins.length === 0 ? (
            <div className="empty-state">
              <p>No former admins found.</p>
            </div>
          ) : (
            <div className="former-grid">
              {formerAdmins.map((admin, index) => (
                <div key={index} className="former-card">
                  <h4>{admin.name}</h4>
                  <p><strong>Email:</strong> {admin.email}</p>
                  <p><strong>Phone:</strong> {admin.phoneno}</p>
                  <p className="tenure">
                    <strong>Tenure:</strong> {admin.startDate} to {admin.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
