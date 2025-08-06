import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './App.css';
export default function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', password: '', passkey: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      console.log('hii');
      const { token, isAdmin, userAccess } = res.data;
      console.log(isAdmin)
      
      if (isAdmin) {
        navigate('/admin');
        return;
      }
      localStorage.setItem('authToken', token);
      localStorage.setItem('userAccess', JSON.stringify(userAccess));
      navigate('/dashboard', { state: { name: formData.name } });

    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>Welcome to Press Seva Portal</h1>
      </div>
      <div className="right-panel">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="text" name="passkey" placeholder="Passkey" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{' '}
          <button className="link-button" onClick={() => navigate('/register')}>
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
}