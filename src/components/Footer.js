import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Kidney Care. All rights reserved.</p>
      <div className="footer-links">
        <a href="#faq">FAQ</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#resources">Resources</a>
      </div>
    </footer>
  );
}

export default Footer;
