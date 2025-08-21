import React, { useState, useEffect } from 'react'
import { Car, TrendingUp, Shield, Users, ArrowRight, Star, DollarSign, Moon, Sun, Menu, X, Zap, BarChart3, Globe } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { getTheme, setTheme } from '../theme'
import { fetchCarNames, fetchCarModels } from '../api'
import Select from 'react-select'
import './LandingPage.css'
import Footer from './Footer'
import Header from './Header'

// Custom styles for React Select to support dark mode
const customSelectStyles = {
  control: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    backgroundColor: 'var(--bg-secondary)',
    borderColor: state.isFocused ? 'var(--accent-primary)' : 'var(--border-color)',
    color: 'var(--text-primary)',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.10)' : '0 1px 6px rgba(102,126,234,0.08)',
    borderRadius: '1.5rem',
    minHeight: '44px',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    borderRadius: '1.2rem',
    zIndex: 20,
  }),
  option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'var(--accent-primary)'
      : state.isFocused
      ? 'rgba(102,126,234,0.08)'
      : 'var(--bg-card)',
    color: state.isSelected ? '#fff' : 'var(--text-primary)',
    borderRadius: '0.8rem',
    cursor: 'pointer',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'var(--accent-primary)',
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--border-color)',
  }),
};

interface FormData {
  name: string;
  model: string;
  mile: string;
  year: string;
  gearbox: 'automatic' | 'manual';
  engine_status: 'هست' | 'نیست';
  body_health: string;
}

type BrandType = { name: string };
type ModelType = { model: string };

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(getTheme() === 'dark')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [models, setModels] = useState<ModelType[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    model: '',
    mile: '',
    year: '',
    gearbox: 'manual',
    engine_status: 'هست',
    body_health: '10'
  });

  // Fetch car brands on mount
  useEffect(() => {
    fetchCarNames().then(setBrands).catch(() => setBrands([]));
  }, []);

  // Fetch car models when brand changes
  useEffect(() => {
    if (formData.name) {
      fetchCarModels(formData.name).then(setModels).catch(() => setModels([]));
    } else {
      setModels([]);
    }
  }, [formData.name]);

  const handleChange = (e: { target: { name: string; value: any } }) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleHeroSubmit = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If not logged in, redirect to sign in with form data
      navigate('/signin', {
        state: {
          from: '/prediction',
          formData: {
            ...formData,
            // Set default values for fields not in hero form
            gearbox: 'manual',
            engine_status: 'هست',
            body_health: '10'
          },
          autoSubmit: true
        }
      });
    } else {
      // If logged in, go directly to prediction with auto-submit
      navigate('/prediction', {
        state: {
          formData: {
            ...formData,
            // Set default values for fields not in hero form
            gearbox: 'manual',
            engine_status: 'هست',
            body_health: '10'
          },
          autoSubmit: true
        }
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    // Listen for theme changes from other pages
    const handleThemeChange = (e: any) => {
      setIsDarkMode(e.detail === 'dark')
    }
    window.addEventListener('themechange', handleThemeChange)

    // Sync with current theme on mount
    setIsDarkMode(getTheme() === 'dark')

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('themechange', handleThemeChange)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setTheme(newTheme)
    setIsDarkMode(newTheme === 'dark')
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
     
     <Header></Header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-particles"></div>
          {/* Animated car driving across the hero section */}
          <div className="hero-car-drive">
            <Car className="hero-car-icon" />
          </div>
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
              <Link to="/prediction" className="btn-primary btn-large">
                <DollarSign size={20} />
                Get an Estimate
              </Link>
              <Link to="/contact" className="btn-secondary btn-large">
                Learn More
              </Link>
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
              <div className="hero-card animated-card">
                <div className="card-header">
                  <Car className="card-icon animated-card-car" />
                  <span>Price Prediction</span>
                  <div className="card-badge">Live</div>
                </div>
              <div className="prediction-form">
                <div className="form-group">
                  <label>Brand</label>
                  <Select
                    id="name"
                    name="name"
                    options={brands.map(brand => ({
                      value: brand.name,
                      label: brand.name
                    }))}
                    value={brands.map(brand => ({
                      value: brand.name,
                      label: brand.name
                    })).find(option => option.value === formData.name) || null}
                    onChange={(selectedOption) => {
                      const value = selectedOption ? selectedOption.value : '';
                      handleChange({
                        target: {
                          name: 'name',
                          value: value,
                        },
                      });
                    }}
                    placeholder="Select brand"
                    styles={customSelectStyles}
                  />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <Select
                    id="model"
                    name="model"
                    options={models.map(model => ({
                      value: model.model,
                      label: model.model
                    }))}
                    value={models.map(model => ({
                      value: model.model,
                      label: model.model
                    })).find(option => option.value === formData.model) || null}
                    onChange={(selectedOption) => {
                      const value = selectedOption ? selectedOption.value : '';
                      handleChange({
                        target: {
                          name: 'model',
                          value: value,
                        },
                      });
                    }}
                    placeholder="Select model"
                    isDisabled={!formData.name}
                    styles={customSelectStyles}
                  />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="e.g. 2020"
                  />
                </div>
                <div className="form-group">
                  <label>Mileage (km)</label>
                  <input
                    type="number"
                    name="mile"
                    value={formData.mile}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                  />
                </div>
                <button 
                  className="btn-primary btn-full" 
                  onClick={handleHeroSubmit}
                  disabled={!formData.name || !formData.model || !formData.year || !formData.mile}>
                  <Zap className="btn-icon" />
                  Predict Price
                </button>
              </div>
              <div className="card-footer">

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
      <Footer></Footer>
    </div>
  )
}

export default LandingPage