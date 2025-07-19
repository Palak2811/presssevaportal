import { useLocation } from 'react-router-dom';
import './dashboard.css';

const cardGrid = [
  ['Registration', 'Regularity', 'Newsprint', 'Helpdesk'],
  ['Annual Statement', 'Management Info', 'Day to Day operationOps', 'Main Profile'],
  ['User Management', 'Fee Structure', 'Suspension/Cancellation', 'About']
];

const accessConfig = {
  palak: ['Registration', 'Regularity', 'Newsprint', 'Helpdesk'],
  gaurav: ['Annual Statement', 'Management Info', 'Day to Day operationOps', 'Main Profile'],
  poonam: ['User Management', 'Fee Structure', 'Suspension/Cancellation', 'About'],
};

export default function Dashboard() {
  const { state } = useLocation();
  const { name = 'guest', passkey = '' } = state || {};

  const handleClick = (card) => {
    if (card === 'About') {
      alert('Opening About...');
      return;
    }

    const allowedCards = accessConfig[name] || [];

    if (allowedCards.includes(card)) {
      alert(`Access granted to ${card}`);
    } else {
      alert('You are not authorized to access this card.');
    }
  };

  const sidebarItems = [
    'Dashboard',
    'Printing Press List',
    'Transaction Report',
    'User Manual',
    'Search Verified Titles',
    'Search Registered Titles',
    'Download DC / REJECTION',
    'SA Applications',
    'View User Role Activity',
    'Application Status'
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Press Sewa Portal</h2>
        <ul>
          {sidebarItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div>
            <strong>User:</strong> {name} 
            
          </div>
        </div>

        {cardGrid.map((row, rowIndex) => (
          <div className="card-row" key={rowIndex}>
            {row.map((card, colIndex) => (
              <div className="card" key={colIndex} onClick={() => handleClick(card)}>
                {card}
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}
