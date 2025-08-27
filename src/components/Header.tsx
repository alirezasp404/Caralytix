import React, { useState, useEffect, useRef } from 'react';
import { Car, Sun, Moon, Menu, X, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null); // New ref for the account menu wrapper

  // --- General Hooks and Handlers ---
  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setShowAccountMenu(false);
    navigate('/', { replace: true });
  };

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

  // --- Account Menu Fix ---
  const toggleAccountMenu = () => {
    setShowAccountMenu(prev => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [accountMenuRef]);

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
          <Link to="/prediction" onClick={() => setIsMobileMenuOpen(false)}>Cara</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <Link to="/aboutus" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
        </div>
        <div className="nav-actions">
          {showAuthButtons && (
            <div className="nav-buttons">
              {isLoggedIn ? (
                <div className="account-menu-wrapper" style={{ position: 'relative', display: 'inline-block' }} ref={accountMenuRef}>
                  <button
                    className="btn-secondary account-icon-rounded"
                    aria-label="Account Menu"
                    style={{ borderRadius: '50%', padding: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={toggleAccountMenu} // New click handler
                  >
                    <User size={22} />
                  </button>
                  {showAccountMenu && (
                    <div
                      className="account-dropdown"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '110%',
                        background: 'var(--bg-card, #fff)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                        minWidth: '140px',
                        zIndex: 1000,
                        padding: '0.5rem 0',
                      }}
                    >
                      <button
                        className="dropdown-item"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: 'none', padding: '0.5rem 1.2rem', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-primary)'
                        }}
                        onClick={handleLogout}
                      >
                        <LogOut size={18} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="btn-secondary" onClick={() => navigate('/signin', { state: { from: location.pathname } })}>Sign In</button>
                  <button className="btn-primary" onClick={() => navigate('/signup', { state: { from: location.pathname } })}>Get Started</button>
                </>
              )}

              {showThemeToggle && (
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                  {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
                </button>
              )}
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