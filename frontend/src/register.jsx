import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Register.css';

// Firebase imports
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase'; // <-- create firebase.js with config

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    password: '',
    passkey: '',
    email: '',
    phoneno: ''
  });
  const [isVerified, setIsVerified] = useState(false);

  const change = e => setData({ ...data, [e.target.name]: e.target.value });

  // Step 1: Send verification email
  const sendVerificationLink = async () => {
    try {
      // Create temporary Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, 'TempPassword123!');
      await sendEmailVerification(userCredential.user);
      alert('Verification email sent. Check your inbox.');
    } catch (err) {
      alert(err.message);
    }
  };

  // Step 2: Check if email is verified
  const checkVerification = async () => {
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setIsVerified(true);
        alert('Email verified! You can now register.');
      } else {
        alert('Email not verified yet. Please click the link sent to your email.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Step 3: Submit registration only after verification
  const submit = async e => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please verify your email first.');
      return;
    }
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
        <div className="email-verification">
          <input name="email" type="email" placeholder="Email" onChange={change} required />
          <button onClick={sendVerificationLink}>Send Verification Link</button>
          <button onClick={checkVerification}>Check Verification</button>
        </div>

        {isVerified && (
          <form className="register-form" onSubmit={submit}>
            <input name="name" placeholder="Name" onChange={change} required />
            <input name="password" type="password" placeholder="Password" onChange={change} required />
            <input name="passkey" placeholder="Passkey" onChange={change} required />
            <input name="phoneno" placeholder="Phone No." onChange={change} required />
            <button type="submit">Register</button>
          </form>
        )}

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
