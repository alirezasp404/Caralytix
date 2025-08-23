import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Car, TrendingUp, Shield, Users, ArrowRight, Star, DollarSign, Moon, Sun, Menu, X, Zap, BarChart3, Globe } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { getTheme, setTheme } from '../theme'
import { fetchCarNames, fetchCarModels } from '../api'
import Select from 'react-select'
import './LandingPage.css'
import Footer from './Footer'
import Header from './Header'
import BrandsMarquee from './BrandsMarquee'

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

interface Brand3D {
  name: string;
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
  color: string;
  opacity: number;
  isPremium: boolean;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(getTheme() === 'dark')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [brands3D, setBrands3D] = useState<Brand3D[]>([]);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleQuestion = (questionId: number) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId)
  }
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

    // Initialize 3D brands
  const initialize3DBrands = useCallback((data: BrandType[]) => {
    return data.map((brand, index) => {
      const phi = Math.acos(-1 + (2 * index) / data.length);
      const theta = Math.sqrt(data.length * Math.PI) * phi;
      
      // Calculate position on a sphere with larger radius
      const radius = 250; // Increased radius for better spacing
      const x = Math.cos(theta) * Math.sin(phi) * radius;
      const y = Math.sin(theta) * Math.sin(phi) * radius;
      const z = Math.cos(phi) * radius;
      
      // Enhanced premium brand selection
      const premiumBrands = ['bmw', 'mercedes', 'audi', 'lexus', 'porsche', 'tesla', 'toyota', 'honda'];
      const isPremium = premiumBrands.includes(brand.name.toLowerCase());
      
      // Use subtle transparent white for all brands
      return {
        name: brand.name,
        x,
        y,
        z,
        rotationX: Math.random() * 360,
        rotationY: Math.random() * 360,
        rotationZ: Math.random() * 360,
        scale: isPremium ? 1.15 : 1,
        color: isPremium ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
        opacity: 0.9,
        isPremium
      };
    });
  }, []);

  // Handle mouse interaction for 3D rotation with smooth interpolation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !autoRotate) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    // Calculate target rotation with easing
    const targetX = y * 35; // Increased rotation range
    const targetY = x * 35;
    
    setRotation(prev => ({
      x: prev.x + (targetX - prev.x) * 0.1, // Smooth interpolation
      y: prev.y + (targetY - prev.y) * 0.1
    }));
  }, [autoRotate]);

  // Enhanced auto-rotation animation with floating effect
  useEffect(() => {
    if (!autoRotate) return;

    let frame: number;
    let time = 0;
    
    const animate = () => {
      time += 0.016; // Approximately 60fps
      
      setRotation(prev => ({
        x: prev.x + Math.sin(time * 0.5) * 0.02, // Add gentle floating motion
        y: prev.y + 0.15 // Slightly faster rotation
      }));
      
      frame = requestAnimationFrame(animate);
    };
    
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [autoRotate]);

  // Toggle auto-rotation on click
  const handleContainerClick = () => {
    setAutoRotate(prev => !prev);
  };

  // Initialize brands
  useEffect(() => {
    fetchCarNames().then((data) => {
      setBrands(data);
      setBrands3D(initialize3DBrands(data));
    }).catch(() => setBrands([]));
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
      <Header />

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
              <Link to="/prediction" className="btn-primary btn-large btn-estimate">
                <DollarSign size={20} />
                Get an Estimate
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
                  <label>Name</label>
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
                    placeholder="Select name"
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
                    placeholder="e.g. 1400"
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

      {/* Brands Section */}
      <section className="brands-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Car className="badge-icon" />
              <span>Our Supported Brands</span>
            </div>
            <h2>Browse Through Popular Car Brands</h2>
            <p>We analyze prices for all major automotive brands in the market</p>
          </div>
          <BrandsMarquee brands={brands} />
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

      {/* Market Insights Section */}
      <section className="market-insights">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <BarChart3 className="badge-icon" />
              <span>Market Intelligence</span>
            </div>
            <h2>Data-Driven Market Insights</h2>
            <p>Stay ahead with real-time market analytics and trends</p>
          </div>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-content">
                <h3>Price Trends</h3>
                <p>Track price movements and market dynamics across different car segments</p>
                <ul className="insight-list">
                  <li>Historical price analysis</li>
                  <li>Seasonal price variations</li>
                  <li>Market demand indicators</li>
                </ul>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-content">
                <h3>Market Comparison</h3>
                <p>Compare prices across different regions and platforms</p>
                <ul className="insight-list">
                  <li>Regional price differences</li>
                  <li>Platform-wise analysis</li>
                  <li>Competitive benchmarking</li>
                </ul>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-content">
                <h3>Value Factors</h3>
                <p>Understand what affects your car's value</p>
                <ul className="insight-list">
                  <li>Mileage impact analysis</li>
                  <li>Age depreciation curves</li>
                  <li>Feature value assessment</li>
                </ul>
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



      {/* Benefits Section */}
            <section className="benefits-section">
        <div className="container">
          <h2>Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>For Buyers</h3>
              <ul>
                <li>Fair price verification</li>
                <li>Negotiation leverage</li>
                <li>Market value insights</li>
                <li>Historical price trends</li>
              </ul>
            </div>
            <div className="benefit-card">
              <h3>For Sellers</h3>
              <ul>
                <li>Maximum value assessment</li>
                <li>Optimal selling time</li>
                <li>Competitive positioning</li>
                <li>Quick sale strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="faq-section" id='faq'>
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <p className="section-description">Find answers to common questions about our car price prediction service</p>
          
          <div className="faq-grid">
            <div className="faq-item">
              <button 
                className={`faq-question ${activeQuestion === 1 ? 'active' : ''}`}
                onClick={() => toggleQuestion(1)}
              >
                How accurate are your car price predictions?
                <span className="faq-icon">{activeQuestion === 1 ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeQuestion === 1 ? 'active' : ''}`}>
                Our predictions are based on advanced machine learning algorithms that analyze vast amounts of market data, 
                including historical prices, market trends, and vehicle conditions. We typically achieve accuracy rates 
                of 85-95% depending on the vehicle type and available data.
              </div>
            </div>

            <div className="faq-item">
              <button 
                className={`faq-question ${activeQuestion === 2 ? 'active' : ''}`}
                onClick={() => toggleQuestion(2)}
              >
                What factors do you consider in price predictions?
                <span className="faq-icon">{activeQuestion === 2 ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeQuestion === 2 ? 'active' : ''}`}>
                We analyze multiple factors including make, model, year, mileage, condition, location, market trends, 
                seasonal variations, and historical sales data to provide accurate price predictions.
              </div>
            </div>

            <div className="faq-item">
              <button 
                className={`faq-question ${activeQuestion === 3 ? 'active' : ''}`}
                onClick={() => toggleQuestion(3)}
              >
                How often is your pricing data updated?
                <span className="faq-icon">{activeQuestion === 3 ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeQuestion === 3 ? 'active' : ''}`}>
                Our database is updated daily with new market data, ensuring that our predictions reflect the most 
                current market conditions and trends in the automotive industry.
              </div>
            </div>

            <div className="faq-item">
              <button 
                className={`faq-question ${activeQuestion === 4 ? 'active' : ''}`}
                onClick={() => toggleQuestion(4)}
              >
                Can I use this service for both buying and selling?
                <span className="faq-icon">{activeQuestion === 4 ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeQuestion === 4 ? 'active' : ''}`}>
                Yes! Our service is designed for both buyers and sellers. Buyers can verify fair prices and negotiate 
                effectively, while sellers can optimize their listing prices and understand the best time to sell.
              </div>
            </div>

            <div className="faq-item">
              <button 
                className={`faq-question ${activeQuestion === 5 ? 'active' : ''}`}
                onClick={() => toggleQuestion(5)}
              >
                How do I get started with Caralytix?
                <span className="faq-icon">{activeQuestion === 5 ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeQuestion === 5 ? 'active' : ''}`}>
                Simply sign up for an account, enter your vehicle details or search for a specific model, and get 
                instant access to our price predictions and market insights. Our intuitive interface makes it easy 
                to get started.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
};

export default LandingPage;