import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      {/* Navbar */}
      <header>
        <nav className="navbar">
          <div className="logo">Kidney Care</div>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Testimonials</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
          <div className="auth-actions">
            <a href="/login" className="login-button">Login / Sign Up</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Empower your journey</h1>
        <p>Manage your health with ease</p>
        <a href="#" className="cta-button">View services</a>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="text">
          <span className="highlight">Empowering Patients</span>
          <h2>Your partner in kidney health</h2>
          <p>
            Kidney Care is a pioneering health-tech company in Bellevue, dedicated to empowering dialysis patients with a comprehensive mobile solution tailored to their unique health management needs. We understand the daily challenges faced by individuals with chronic kidney disease (CKD) and those undergoing dialysis. Our platform simplifies the management of hydration, nutrient intake, and overall well-being while fostering better communication between patients and their medical teams.
          </p>
          <a href="/contact" className="cta-button">Get in touch</a>
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
          <li><a href="#">Schedule Appointment</a></li>
          <li><a href="#">Complete Intake</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Resources</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
        <p>Web design by B12</p>
      </footer>
    </div>
  );
};

export default HomePage;
