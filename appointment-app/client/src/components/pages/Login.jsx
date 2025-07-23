import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      navigate('/appointments');
    } catch (err) {
      console.error(err);
      alert('Invalid login credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>Register Here: <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;
