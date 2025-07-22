import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Appointments.css';

function Appointments() {
  const [time, setTime] = useState('');
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([])
  const token = localStorage.getItem('token')
  const [editingId, setEditingId] = useState(null);
  const [editedTime, setEditedTime] = useState('');


  const handleDelete = async (id) => {
    try{
        await axios.delete(`http://localhost:4000/appointments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        alert('Appointment Deleted')
        await fetchAppointments()
    }
    catch(err) {
        console.error('Error deleting appointment: ', err)
        alert('Failed to delete appointment')
        }
    }

    const handleEdit = async (id, newTime) => {
      try {
        await axios.put(`http://localhost:4000/appointments/${id}`, {
          time_slot: newTime
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Appointment updated!');
        // Optionally, refresh appointments list here
        await fetchAppointments();
      } catch (error) {
        console.error('Failed to update appointment:', error);
        alert('Failed to update appointment');
      }
    };
    

  const fetchAppointments = async () => {
    try{
        const res = await axios.get('http://localhost:4000/appointments', {
            headers: { Authorization: `Bearer ${token}` },
        })
        setAppointments(res.data)
    }catch (err) {
            console.error('Error fetching Appointments: ', err)
        }
    }

  useEffect(() => {
    //const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      navigate('/');
    }
    fetchAppointments();
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
      await fetchAppointments()
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
                  onChange={e => setEditedTime(e.target.value)}
                />
                <button onClick={() => {
                  handleEdit(appt.id, editedTime);
                  setEditingId(null);
                }}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{new Date(appt.time_slot).toLocaleString()}</span>
                <button className="delete-btn" onClick={() => handleDelete(appt.id)}>Delete</button>
                <button onClick={() => {
                  setEditingId(appt.id);
                  setEditedTime(appt.time_slot);
                }}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default Appointments;
