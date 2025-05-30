import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  patient: '',
  date: '',
  albumin: '',
  enPCR: '',
  spKtV: '',
  potassium: '',
  hemoglobin: '',
  phosphorus: '',
  calciumTotal: '',
  iPTH: '',
  avgFluidWeightGain: '',
  notes: ''
};

export default function StaffLabResultForm({ onAdded }) {
  const [form, setForm] = useState(initialState);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch all patients for dropdown
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users?role=patient', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch {
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/labresults', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Lab result added!');
      setForm(initialState);
      if (onAdded) onAdded();
    } catch (err) {
      setError('Failed to add lab result.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="staff-labresult-form" style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 600, margin: '2rem auto', boxShadow: '0 2px 12px #0001', color: '#222' }}>
      <h3 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 24 }}>Add Lab Result</h3>
      <label>Patient:
        <select name="patient" value={form.patient} onChange={handleChange} required style={{ width: '100%', marginBottom: 12 }}>
          <option value="">Select patient</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>{p.name || p.email}</option>
          ))}
        </select>
      </label>
      <label>Date: <input name="date" type="date" value={form.date} onChange={handleChange} required style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>Albumin: <input name="albumin" type="number" step="any" value={form.albumin} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>enPCR: <input name="enPCR" type="number" step="any" value={form.enPCR} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>spKt/V: <input name="spKtV" type="number" step="any" value={form.spKtV} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>Potassium: <input name="potassium" type="number" step="any" value={form.potassium} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>Hemoglobin: <input name="hemoglobin" type="number" step="any" value={form.hemoglobin} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>Phosphorus: <input name="phosphorus" type="number" step="any" value={form.phosphorus} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>Calcium Total: <input name="calciumTotal" type="number" step="any" value={form.calciumTotal} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>iPTH: <input name="iPTH" type="number" step="any" value={form.iPTH} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>Avg Fluid Weight Gain: <input name="avgFluidWeightGain" type="number" step="any" value={form.avgFluidWeightGain} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <label>Notes: <input name="notes" value={form.notes} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} /></label>
      <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: '#23b500', color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginTop: 12, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Adding...' : 'Add Lab Result'}</button>
      {error && <div className="error" style={{ color: '#ff4c4c', marginTop: 12 }}>{error}</div>}
      {success && <div className="success" style={{ color: '#23b500', marginTop: 12 }}>{success}</div>}
    </form>
  );
}
