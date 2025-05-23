import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="navbar">
        <h1 className="logo">KidneyCare</h1>
        <button className="auth-button" onClick={() => setShowModal(true)}>
          Login / Sign Up
        </button>
      </nav>

      {/* Modal will be added later */}
    </>
  );
}
