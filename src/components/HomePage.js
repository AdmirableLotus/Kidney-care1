import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Footer from './Footer'; // You already wrote it. Might as well use it.

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <header>
        <nav className="navbar">
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

      {/* Hero */}
      <section className="hero">
        <h1>Empower your journey</h1>
        <p>Manage your health with ease</p>
        <Link to="/services" className="cta-button">View services</Link>
      </section>

      {/* About */}
      <section className="about" id="about">
        <div className="text">
          <span className="highlight">Empowering Patients</span>
          <h2>Your partner in kidney health</h2>
          <p>
            Kidney Care is a pioneering health-tech company in Bellevue, dedicated to empowering dialysis patients with a comprehensive mobile solution tailored to their unique health management needs. Our platform simplifies the management of hydration, nutrient intake, and overall well-being while fostering better communication between patients and their medical teams.
          </p>
          <Link to="/contact" className="cta-button">Get in touch</Link>
        </div>
        <div className="image">
          <img src="/images/kidney-about.webp" alt="About Kidney Care" />
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <span className="highlight">Empower Your Health</span>
        <h2>Transforming dialysis management.</h2>
        <div className="feature-grid">
          {[
            {
              img: "/images/feature-tracking.png",
              title: "Health tracking",
              desc: "Monitor your health with precision and ease."
            },
            {
              img: "/images/feature-connection.png",
              title: "Patient-medical team connection",
              desc: "Enhance communication with your healthcare providers."
            },
            {
              img: "/images/feature-insights.png",
              title: "Personalized health insights",
              desc: "Receive tailored information for better health decisions."
            },
            {
              img: "/images/feature-transplant.png",
              title: "Transplant tracker",
              desc: "Stay informed about your transplant journey."
            }
          ].map((f, i) => (
            <div className="feature" key={i}>
              <img src={f.img} alt={f.title} />
              <div className="content">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <span className="highlight">What Our Users Say</span>
        <h2>Empowering dialysis patients daily</h2>
        <div className="testimonial-grid">
          {[
            "Kidney Care has transformed my experience with dialysis. The app makes it easy to track my hydration and nutrient intake. I feel supported and in control of my health.",
            "As a healthcare provider, I’ve seen firsthand how Kidney Care improves communication and helps patients stay on track with their treatment. It’s a game changer.",
            "I was overwhelmed after my diagnosis, but Kidney Care simplified everything—diet, hydration, and communication with my team. It gave me peace of mind."
          ].map((quote, i) => (
            <div className="testimonial" key={i}>
              <p>{quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

