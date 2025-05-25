import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      {/* Navbar */}
      <header>
        <nav className="navbar">
          <div className="logo">Kidney Care</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
          <div className="auth-dropdown">
            <button className="login-button">Login / Sign Up ▼</button>
            <div className="dropdown-content">
              <Link to="/login">Login</Link>
              <Link to="/register/patient">Patient Sign Up</Link>
              <Link to="/register/staff">Medical Staff Sign Up</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Empower your journey</h1>
        <p>Manage your health with ease</p>
        <Link to="/services" className="cta-button">View services</Link>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="text">
          <span className="highlight">Empowering Patients</span>
          <h2>Your partner in kidney health</h2>
          <p>
            Kidney Care is a pioneering health-tech company in Bellevue, dedicated to empowering dialysis patients with a comprehensive mobile solution tailored to their unique health management needs. We understand the daily challenges faced by individuals with chronic kidney disease (CKD) and those undergoing dialysis. Our platform simplifies the management of hydration, nutrient intake, and overall well-being while fostering better communication between patients and their medical teams.
          </p>
          <Link to="/contact" className="cta-button">Get in touch</Link>
        </div>
        <div className="image">
          <img src="/images/kidney-about.jpg" alt="About Kidney Care" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <span className="highlight">Empower Your Health</span>
        <h2>Transforming dialysis management.</h2>
        <div className="feature-grid">
          <div className="feature">
            <img src="/images/feature-tracking.jpg" alt="Health Tracking" />
            <div className="content">
              <h3>Health tracking</h3>
              <p>Monitor your health with precision and ease.</p>
            </div>
          </div>
          <div className="feature">
            <img src="/images/feature-connection.jpg" alt="Team Connection" />
            <div className="content">
              <h3>Patient-medical team connection</h3>
              <p>Enhance communication with your healthcare providers.</p>
            </div>
          </div>
          <div className="feature">
            <img src="/images/feature-insights.jpg" alt="Health Insights" />
            <div className="content">
              <h3>Personalized health insights</h3>
              <p>Receive tailored information for better health decisions.</p>
            </div>
          </div>
          <div className="feature">
            <img src="/images/feature-transplant.jpg" alt="Transplant Tracker" />
            <div className="content">
              <h3>Transplant tracker</h3>
              <p>Stay informed about your transplant journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <span className="highlight">What Our Users Say</span>
        <h2>Empowering dialysis patients daily</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>
              Kidney Care has transformed my experience with dialysis. The app makes it easy to track my hydration and nutrient intake. I feel supported and in control of my health.
            </p>
          </div>
          <div className="testimonial">
            <p>
              As a healthcare provider, I’ve seen firsthand how Kidney Care improves communication and helps patients stay on track with their treatment. It’s a game changer.
            </p>
          </div>
          <div className="testimonial">
            <p>
              I was overwhelmed after my diagnosis, but Kidney Care simplified everything—diet, hydration, and communication with my team. It gave me peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <ul className="footer-links">
          <li><Link to="/appointment">Schedule Appointment</Link></li>
          <li><Link to="/intake">Complete Intake</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/resources">Resources</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
        </ul>
        <p>Web design by B12</p>
      </footer>
    </div>
  );
};

export default HomePage;
