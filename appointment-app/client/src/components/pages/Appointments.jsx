import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Appointments.css';

function Appointments() {
  const [time, setTime] = useState('');
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTime, setEditedTime] = useState('');
  const token = localStorage.getItem('token');

  // Use environment variable or fallback to localhost
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${backendUrl}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments: ', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Appointment Deleted');
      await fetchAppointments();
    } catch (err) {
      console.error('Error deleting appointment: ', err);
      alert('Failed to delete appointment');
    }
  };

  const handleEdit = async (id, newTime) => {
    try {
      await axios.put(
        `${backendUrl}/appointments/${id}`,
        { time_slot: newTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Appointment updated!');
      setEditingId(null);
      await fetchAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${backendUrl}/appointments`,
        { time },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Appointment booked!');
      setTime('');
      await fetchAppointments();
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed');
    }
  };

  useEffect(() => {
    if (!token) {
      alert('Please log in first.');
      navigate('/');
      return;
    }
    fetchAppointments();
  }, [navigate, token]);

  return (
    <div className="appointments-container">
      <h2>Book Appointment</h2>
      <div className="appointments-container">
    
      
      {/* existing JSX below */}
      <h2>Book Appointment</h2>
      {/* rest of your component */}
    </div>
      <form onSubmit={handleBook}>
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">Book</button>
      </form>

      <h2>Booked Appointments</h2>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            <p>Appointment Number: {appt.id}</p>
            {editingId === appt.id ? (
              <>
                <input
                  type="datetime-local"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                />
                <button
                  onClick={() => handleEdit(appt.id, editedTime)}
                >
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{new Date(appt.time_slot).toLocaleString()}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(appt.id)}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setEditingId(appt.id);
                    setEditedTime(appt.time_slot);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;
