import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './register.css'; // Make sure this path is correct

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', password: '', passkey: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      alert(res.data.message);
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="left-panel">
        <h1>Welcome to<br />Press Seva Portal</h1>
      </div>
      <div className="right-panel">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="text" name="passkey" placeholder="Passkey" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account?{' '}
          <button onClick={() => navigate('/')}>Login Here</button>
        </p>
      </div>
    </div>
  );
}
