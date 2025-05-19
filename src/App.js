import React from 'react';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Top Navigation Bar with Login/Sign Up button */}
      <Navbar />

      {/* Hero Section Placeholder */}
      <section className="hero">
        <h1>Welcome to Kidney Care</h1>
        <p>Empowering patients and providers with smarter kidney health tracking.</p>
        <button>Learn More</button>
      </section>

      {/* Future sections (Features, Contact, Footer) can go here */}
    </div>
  );
}

export default App;
