import React, { useState, useEffect } from 'react'
import { Car, TrendingUp, Shield, Users, ArrowRight, Star, CheckCircle, Moon, Sun, Menu, X, Zap, BarChart3, Globe } from 'lucide-react'
import './LandingPage.css'

const LandingPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('light-mode')
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <Car className="logo-icon" />
            <span className="logo-text">Caralytix</span>
          </div>
          
          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <a onClick={() => scrollToSection('features')}>Features</a>
            <a onClick={() => scrollToSection('how-it-works')}>How it Works</a>
            <a onClick={() => scrollToSection('pricing')}>Pricing</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
          </div>
          
          <div className="nav-actions">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
            </button>
            
            <div className="nav-buttons">
              <button className="btn-secondary">Sign In</button>
              <button className="btn-primary">Get Started</button>
            </div>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-particles"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap className="badge-icon" />
              <span>AI-Powered Analytics</span>
            </div>
            <h1 className="hero-title">
              Predict Car Prices with
              <span className="gradient-text"> Machine Learning</span>
            </h1>
            <p className="hero-subtitle">
              Get accurate car price predictions using advanced AI algorithms. 
              Analyze market trends, compare prices, and make informed decisions with 95% accuracy.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary btn-large">
                Start Free Analysis
                <ArrowRight className="btn-icon" />
              </button>
              <button className="btn-outline btn-large">
                <BarChart3 className="btn-icon" />
                View Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Cars Analyzed</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="card-header">
                <Car className="card-icon" />
                <span>Price Prediction</span>
                <div className="card-badge">Live</div>
              </div>
              <div className="prediction-form">
                <div className="form-group">
                  <label>Car Model</label>
                  <input type="text" placeholder="e.g., Toyota Camry 2020" />
                </div>
                <div className="form-group">
                  <label>Mileage</label>
                  <input type="number" placeholder="50,000" />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="number" placeholder="2020" />
                </div>
                <button className="btn-primary btn-full">
                  <Zap className="btn-icon" />
                  Predict Price
                </button>
              </div>
              <div className="card-footer">
                <div className="prediction-preview">
                  <span className="preview-label">Estimated Price:</span>
                  <span className="preview-value">$25,000 - $28,000</span>
                </div>
              </div>
            </div>
            

          </div>
          

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Globe className="badge-icon" />
              <span>Why Choose Caralytix?</span>
            </div>
            <h2>Advanced AI Technology</h2>
            <p>State-of-the-art machine learning algorithms power our predictions</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp />
              </div>
              <h3>Accurate Predictions</h3>
              <p>Our ML models analyze thousands of data points to provide precise price predictions with 95% accuracy.</p>
              <div className="feature-stats">
                <span className="feature-stat">95% Accuracy</span>
                <span className="feature-stat">Real-time Data</span>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3>Data Security</h3>
              <p>Your data is protected with enterprise-grade security. We never share your information with third parties.</p>
              <div className="feature-stats">
                <span className="feature-stat">256-bit Encryption</span>
                <span className="feature-stat">GDPR Compliant</span>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users />
              </div>
              <h3>Expert Support</h3>
              <p>Get help from our automotive experts and data scientists whenever you need assistance.</p>
              <div className="feature-stats">
                <span className="feature-stat">24/7 Support</span>
                <span className="feature-stat">Live Chat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to get your car price prediction</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Enter Car Details</h3>
              <p>Provide basic information about your car including make, model, year, and mileage.</p>
              <div className="step-icon">
                <Car />
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our advanced machine learning algorithms analyze market data and similar vehicles.</p>
              <div className="step-icon">
                <Zap />
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get Results</h3>
              <p>Receive detailed price predictions with confidence intervals and market insights.</p>
              <div className="step-icon">
                <BarChart3 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Trusted by car dealers and individuals worldwide</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <p>"Caralytix helped me get the best price for my car. The predictions were spot on!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <h4>John Doe</h4>
                  <span>Car Dealer</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <p>"The AI predictions are incredibly accurate. Saved me thousands on my car purchase."</p>
              <div className="testimonial-author">
                <div className="author-avatar">JS</div>
                <div className="author-info">
                  <h4>Jane Smith</h4>
                  <span>Individual Buyer</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <p>"As a dealership, we use Caralytix for all our pricing decisions. Game changer!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">MS</div>
                <div className="author-info">
                  <h4>Mike Stevens</h4>
                  <span>Dealership Owner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who trust Caralytix for accurate car price predictions</p>
            <div className="cta-buttons">
              <button className="btn-primary btn-large">
                Start Your Analysis
                <ArrowRight className="btn-icon" />
              </button>
              <button className="btn-outline btn-large">
                <Globe className="btn-icon" />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Car className="logo-icon" />
                <span className="logo-text">Caralytix</span>
              </div>
              <p>AI-powered car price prediction platform</p>
              <div className="social-links">
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">GitHub</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#api">API</a>
              <a href="#integrations">Integrations</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
              <a href="#blog">Blog</a>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#docs">Documentation</a>
              <a href="#status">Status</a>
              <a href="#contact">Contact Us</a>
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
    </div>
  )
}

export default LandingPage 