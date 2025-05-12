import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <div className="App">
      <Navbar />

      {/* Hero Section */}
      <header className="hero" id="home">
        <h1>Empower your journey</h1>
        <p>Manage your health with ease</p>
        <a href="#services" className="btn-primary">View services</a>
      </header>

      {/* About Section */}
      <section className="about" id="about">
        <h2>Your partner in kidney health</h2>
        <p>
          Kidney Care is a pioneering health-tech company in Bellevue, dedicated to empowering dialysis patients with a comprehensive mobile solution tailored to their unique health needs.
        </p>
      </section>

      {/* Registration Form Placeholder */}
      <section id="register">
        <h2>Register Now</h2>
        <RegisterForm />
      </section>

      <Footer />
    </div>
  );
}

export default App;

