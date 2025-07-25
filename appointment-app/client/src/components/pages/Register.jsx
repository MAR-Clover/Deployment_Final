import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        email,
        password,
      });

      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <div>
      <h3>Backend URL from env:</h3>
    
    </div>
      <form onSubmit={handleRegister}>
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <p>Login Here: <Link to="/">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
