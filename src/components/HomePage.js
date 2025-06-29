import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* ===== Navbar ===== */}
      <header>
        <nav className="navbar" role="navigation" aria-label="Main navigation">
          <div className="logo">Kidney Care</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Services</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#news">News</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
          <div className="auth-actions">
            <Link to="/login" className="login-button">Login / Sign Up</Link>
          </div>
        </nav>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="hero" style={{ background: 'linear-gradient(to right, #1e88e5, #43cea2)', padding: '100px 20px', color: 'white', textAlign: 'center' }}>
        <h1>Empower your journey</h1>
        <p>Manage your health with ease</p>
        <Link to="/services" className="cta-button">View Services</Link>
      </section>

      {/* ===== About Section ===== */}
      <section className="about" id="about">
        <div className="text">
          <span className="highlight">Empowering Patients</span>
          <h2>Your partner in kidney health</h2>
          <p>
            Kidney Care is a pioneering health-tech company in Bellevue, dedicated to empowering dialysis patients with a comprehensive mobile solution tailored to their unique health management needs. Our platform simplifies the management of hydration, nutrient intake, and overall well-being while fostering better communication between patients and their medical teams.
          </p>
          <Link to="/contact" className="cta-button">Get in Touch</Link>
        </div>
        <div className="image">
          <div style={{
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            backgroundColor: '#23b500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 0 30px rgba(0,0,0,0.3)'
          }}>
            Kidney Health
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="features" id="features">
        <span className="highlight">Empower Your Health</span>
        <h2>Transforming dialysis management</h2>
        <div className="feature-grid">
          {[
            {
              title: "Health Tracking",
              desc: "Monitor your health with precision and ease."
            },
            {
              title: "Team Connection",
              desc: "Enhance communication with your healthcare providers."
            },
            {
              title: "Personalized Insights",
              desc: "Receive tailored info for better decisions."
            },
            {
              title: "Transplant Tracker",
              desc: "Stay informed about your transplant journey."
            }
          ].map((f, i) => (
            <div className="feature" key={i}>
              <div className="content">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimonials Section ===== */}
      <section className="testimonials" id="testimonials">
        <span className="highlight">What Our Users Say</span>
        <h2>Empowering dialysis patients daily</h2>
        <div className="testimonial-grid">
          {[
            "Kidney Care has transformed my experience with dialysis. The app makes it easy to track my hydration and nutrient intake.",
            "As a healthcare provider, I’ve seen firsthand how Kidney Care improves communication and helps patients stay on track.",
            "I was overwhelmed after my diagnosis, but Kidney Care simplified everything—diet, hydration, and communication with my team."
          ].map((quote, i) => (
            <div className="testimonial" key={i}>
              <p>{quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
};

export default HomePage;
