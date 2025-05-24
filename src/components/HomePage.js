import React from "react";
import "./HomePage.css"; 

const HomePage = () => (
  <div>
    <header>
      <nav className="navbar">
        <div className="logo">Kidney Care</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div className="auth-actions">
          <a href="/login" className="login-button">Login / Sign Up</a>
        </div>
      </nav>
    </header>

    <section className="hero">
      <h1>Empower your journey</h1>
      <p>Manage your health with ease</p>
      <a href="#" className="cta-button">View services</a>
    </section>

    <section className="about">
      <h2>Empowering patients</h2>
      <p>Kidney Care is a pioneering health-tech company...</p>
    </section>

    {/* Add more sections here just like this */}

    <footer>
      <div className="container">
        <ul className="footer-links">
          <li><a href="#">Schedule Appointment</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
        <p>Web design by B12</p>
      </div>
    </footer>
  </div>
);

export default HomePage;
