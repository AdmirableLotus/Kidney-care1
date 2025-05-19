import React from 'react';
import './HeroLayout.css';
import { FaPills, FaAppleAlt, FaHeartbeat, FaCalendarCheck } from 'react-icons/fa';

export default function HeroLayout() {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <h1>Welcome to Kidney Care</h1>
        <p>Empowering your health journey with digital tools.</p>
      </div>

      {/* Centerpiece image */}
      <div className="hero-centerpiece">
        <img src="/images/dietitian.jpg" alt="Central feature" />
      </div>

      {/* Floating Feature Cards with Icons */}
      <div className="hero-feature feature-top-left">
        <FaPills size={32} />
        <h3>Track Medications</h3>
        <p>Manage prescriptions & doses</p>
      </div>
      <div className="hero-feature feature-top-right">
        <FaAppleAlt size={32} />
        <h3>Dietitian Access</h3>
        <p>Personalized meal plans</p>
      </div>
      <div className="hero-feature feature-bottom-left">
        <FaHeartbeat size={32} />
        <h3>Symptom Log</h3>
        <p>Monitor your daily health</p>
      </div>
      <div className="hero-feature feature-bottom-right">
        <FaCalendarCheck size={32} />
        <h3>Appointments</h3>
        <p>Stay on track with dialysis</p>
      </div>
    </section>
  );
}
