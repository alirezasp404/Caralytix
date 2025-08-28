import {Twitter, Linkedin, Github } from 'lucide-react';
import './Footer.css';
import LogoIcon from '../assets/caralytix-logo.png';

import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src={LogoIcon} className="logo-icon" />
                <span className="logo-text">Caralytix</span>
              </div>
              <p>AI-powered car price prediction platform</p>
              <div className="social-links">
                <a href="#" className="social-link"><Twitter size={20} /></a>
                <a href="#" className="social-link"><Linkedin size={20} /></a>
                <a href="#" className="social-link"><Github size={20} /></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
             <Link to="/prediction">Features</Link>
              <a href="#api">API</a>
              <a href="#integrations">Integrations</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
             <Link to="/contact">Contact</Link>
             <Link to="/aboutus">About Us</Link>
              <a href="#blog">Blog</a>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#docs">Documentation</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Caralytix. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
