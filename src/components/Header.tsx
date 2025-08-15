import React, { useState, useEffect } from 'react';
import { Car, Sun, Moon, Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getTheme, setTheme } from '../theme';
import './Header.css';

interface HeaderProps {
  showThemeToggle?: boolean;
  showAuthButtons?: boolean;
  onSectionScroll?: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ showThemeToggle = true, showAuthButtons = true, onSectionScroll }) => {
  const [isDarkMode, setIsDarkMode] = useState(getTheme() === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const handleThemeChange = (e: any) => setIsDarkMode(e.detail === 'dark');
    window.addEventListener('themechange', handleThemeChange);
    setIsDarkMode(getTheme() === 'dark');
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  const handleSectionScroll = (sectionId: string) => {
    if (onSectionScroll) {
      onSectionScroll(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <Car className="logo-icon" />
            <span className="logo-text">Caralytix</span>
          </Link>
        </div>
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a onClick={() => navigate('/prediction')}>Prediction</a>
          <a onClick={() => navigate('/contact')}>Contact</a>
          <a onClick={() => navigate('/aboutus')}>About Us</a>
        </div>
        <div className="nav-actions">
          {showThemeToggle && (
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
            </button>
          )}
          {showAuthButtons && (
            <div className="nav-buttons">
              <button className="btn-secondary" onClick={() => navigate('/signin')}>Sign In</button>
              <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
            </div>
          )}
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
