import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './dashboard.css';

const allCards = [
  'Registration', 'Regularity', 'Newsprint', 'Helpdesk',
  'Annual Statement', 'Management Information System', 'Day to Day Operations', 'Main Profile',
  'User Management', 'Fee Structure', 'Suspension/Cancellation', 'About'
];

export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [userAccess, setUserAccess] = useState([]);
  const { name = 'guest' } = state || {};

  useEffect(() => {
    const storedAccess = localStorage.getItem('userAccess');
    if (storedAccess) {
      try {
        setUserAccess(JSON.parse(storedAccess));
      } catch (e) {
        console.error("Failed to parse userAccess from local storage", e);
        setUserAccess([]);
      }
    }
  }, []);

  const handleClick = (card) => {
    if (userAccess.includes(card)) {
      alert(`Accessing ${card}`);
    } else {
      alert(`Access not granted for "${card}"`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userAccess');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar based on the image, now without icons */}
      <aside className="sidebar">
        <h2>PRGI Press Sewa Portal</h2>
        <ul>
          <li>Dashboard</li>
          <li>Printing Press List</li>
          <li>Transaction Report</li>
          <li>User Manual</li>
          <li>Search Verified Titles</li>
          <li>Search Registered Titles</li>
          <li>Download DC / REJECTION</li>
          <li>SA Applications</li>
          <li>View User Role Activity</li>
          <li>Application Status</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
          <div>
            <strong>User:</strong> {name}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="card-grid">
          {allCards.map(card => (
            <div className="card" key={card} onClick={() => handleClick(card)}>
              <h4 className="card-title">{card}</h4>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}