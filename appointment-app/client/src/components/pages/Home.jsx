import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Appointments.css';

function Appointments() {
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      navigate('/');
    }
  }, [navigate]);

  const handleBook = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:4000/appointments',
        { time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Appointment booked!');
      setTime('');
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    }
  };

  return (
    <div className="appointments-container">
      <h2>Book Appointment</h2>
      <form onSubmit={handleBook}>
        <input 
          type="datetime-local" 
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">Book</button>
      </form>
    </div>
  );
}

export default Appointments;