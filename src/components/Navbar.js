import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import AuthModal from './AuthModal'; // Assuming you built this already

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          KidneyCare
        </Link>
        <div className="nav-links">
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <button className="auth-button" onClick={() => setShowModal(true)}>
          Login / Sign Up
        </button>
      </nav>

      {showModal && <AuthModal closeModal={() => setShowModal(false)} />}
    </>
  );
}
