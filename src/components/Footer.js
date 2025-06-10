import React from "react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <p>&copy; {currentYear} Kidney Care. All rights reserved.</p>
        <nav aria-label="Footer navigation" className="footer-links">
          <a href="#faq">FAQ</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#resources">Resources</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

