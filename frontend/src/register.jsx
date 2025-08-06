import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    password: '',
    passkey: '',
    email: '',
    phoneno: ''
  });

  const change = e => setData({ ...data, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', data);
      alert('Registration successful. Please wait for admin approval.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>Join Press Seva Portal</h1>
      </div>
      <div className="register-right">
        <h2>Register</h2>
        <form className="register-form" onSubmit={submit}>
          <input name="name" placeholder="Name" onChange={change} required />
          <input name="password" type="password" placeholder="Password" onChange={change} required />
          <input name="passkey" placeholder="Passkey" onChange={change} required />
          <input name="email" type="email" placeholder="Email" onChange={change} required />
          <input name="phoneno" placeholder="Phone No." onChange={change} required />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account?{' '}
          <button className="link-button" onClick={() => navigate('/')}>
            Login Here
          </button>
        </p>
      </div>
    </div>
  );
}
