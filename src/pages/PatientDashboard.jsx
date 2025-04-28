// src/pages/PatientDashboard.jsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase'; // adjust the path if needed

function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*');

    console.log('Fetched doctors:', data);
    console.error('Fetch doctor error:', error);

    if (error) {
      setError(error.message);
    } else {
      setDoctors(data);
    }

    setLoading(false);
  }

  async function requestAppointment(doctorId) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        { doctor_id: doctorId, patient_id: 'example_patient_id', status: 'pending' }
      ]);

    if (error) {
      console.error('Appointment request failed:', error);
      alert('Failed to request appointment.');
    } else {
      console.log('Appointment requested:', data);
      alert('Appointment request sent!');
    }
  }

  if (loading) {
    return <div>Loading doctors...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <h2>Available Doctors</h2>

      {doctors.length === 0 ? (
        <p>No doctors available.</p>
      ) : (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              {doctor.name} - {doctor.specialization}
              <button onClick={() => requestAppointment(doctor.id)}>
                Request Appointment
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatientDashboard;
