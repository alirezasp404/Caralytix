import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { getTheme, setTheme, syncThemeWithBody } from '../theme'
import { Link } from 'react-router-dom'
import { Car, Check, X, Star, Zap, Shield, Users, BarChart3, Globe, ArrowRight } from 'lucide-react'
import './Pricing.css'

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState('professional')
  const [theme, setThemeState] = useState<'dark' | 'light'>(getTheme())

  useEffect(() => {
    const applyTheme = (themeValue: 'dark' | 'light') => {
      setThemeState(themeValue)
      document.body.classList.toggle('light-mode', themeValue === 'light')
      document.body.classList.toggle('dark-mode', themeValue === 'dark')
    }
    const current = getTheme()
    applyTheme(current)
    const handler = (e: any) => {
      applyTheme(e.detail)
    }
    window.addEventListener('themechange', handler)
    return () => window.removeEventListener('themechange', handler)
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    setThemeState(newTheme)
  }

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small dealerships getting started',
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        'Up to 100 vehicles',
        'Basic analytics dashboard',
        'Market trend insights',
        'Email support',
        'Monthly reports',
        'Basic inventory management'
      ],
      limitations: [
        'Limited to 1 location',
        'No API access',
        'Standard support only'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing dealerships',
      monthlyPrice: 299,
      annualPrice: 249,
      features: [
        'Up to 500 vehicles',
        'Advanced analytics & AI insights',
        'Predictive pricing recommendations',
        'Priority support',
        'Weekly reports',
        'Multi-location support',
        'API access',
        'Custom integrations',
        'Performance benchmarking'
      ],
      limitations: [
        'Limited to 3 locations'
      ],
      popular: true,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large dealership groups',
      monthlyPrice: 799,
      annualPrice: 649,
      features: [
        'Unlimited vehicles',
        'Full AI-powered analytics suite',
        'Real-time pricing optimization',
        'Dedicated account manager',
        'Daily reports & alerts',
        'Unlimited locations',
        'Full API access',
        'White-label solutions',
        'Advanced security features',
        'Custom training & onboarding',
        'SLA guarantee'
      ],
      limitations: [],
      popular: false,
      color: 'gold'
    }
  ]

  const addOns = [
    {
      name: 'Advanced Reporting',
      price: 49,
      description: 'Detailed custom reports and data exports'
    },
    {
      name: 'Mobile App',
      price: 29,
      description: 'iOS and Android apps for on-the-go access'
    },
    {
      name: 'Training & Onboarding',
      price: 199,
      description: 'Comprehensive team training (one-time fee)'
    }
  ]

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  return (
    <div className={`pricing-container ${theme}`}> 
      {/* Header */}
      <header className="pricing-header">
        <Link to="/" className="pricing-logo">
          <Car className="logo-icon" />
          <span className="logo-text">Caralytix</span>
        </Link>
        <nav className="pricing-nav">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/signin">Sign In</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="hero-content">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your dealership. No hidden fees, no surprises.</p>
          
          {/* Billing Toggle */}
          <div className="billing-toggle">
            <span className={!isAnnual ? 'active' : ''}>Monthly</span>
            <button 
              className="toggle-switch"
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div className={`toggle-slider ${isAnnual ? 'annual' : 'monthly'}`}></div>
            </button>
            <span className={isAnnual ? 'active' : ''}>
              Annual
              <span className="savings-badge">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pricing-plans">
        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="period">/month</span>
                </div>
                {isAnnual && (
                  <div className="annual-savings">
                    Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                  </div>
                )}
              </div>

              <div className="plan-features">
                <h4>What's included:</h4>
                <ul className="features-list">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <Check size={16} className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <ul className="limitations-list">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="limitation-item">
                        <X size={16} className="x-icon" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Link 
                to="/signup" 
                className={`plan-button ${plan.popular ? 'popular' : ''}`}
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="add-ons-section">
        <div className="add-ons-content">
          <h2>Optional Add-ons</h2>
          <p>Enhance your Caralytix experience with these additional features</p>
          
          <div className="add-ons-grid">
            {addOns.map((addon, index) => (
              <div key={index} className="addon-card">
                <h3>{addon.name}</h3>
                <p>{addon.description}</p>
                <div className="addon-price">
                  <span className="currency">$</span>
                  <span className="amount">{addon.price}</span>
                  <span className="period">/month</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="features-comparison">
        <div className="comparison-content">
          <h2>Feature Comparison</h2>
          <div className="comparison-table">
            <div className="table-header">
              <div className="feature-column">Features</div>
              <div className="plan-column">Starter</div>
              <div className="plan-column">Professional</div>
              <div className="plan-column">Enterprise</div>
            </div>
            
            <div className="table-body">
              <div className="table-row">
                <div className="feature-name">Vehicle Limit</div>
                <div className="plan-value">100</div>
                <div className="plan-value">500</div>
                <div className="plan-value">Unlimited</div>
              </div>
              <div className="table-row">
                <div className="feature-name">Locations</div>
                <div className="plan-value">1</div>
                <div className="plan-value">3</div>
                <div className="plan-value">Unlimited</div>
              </div>
              <div className="table-row">
                <div className="feature-name">API Access</div>
                <div className="plan-value"><X size={16} /></div>
                <div className="plan-value"><Check size={16} /></div>
                <div className="plan-value"><Check size={16} /></div>
              </div>
              <div className="table-row">
                <div className="feature-name">Dedicated Support</div>
                <div className="plan-value"><X size={16} /></div>
                <div className="plan-value"><X size={16} /></div>
                <div className="plan-value"><Check size={16} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pricing-faq">
        <div className="faq-content">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Can I change plans anytime?</h3>
              <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a free trial?</h3>
              <p>We offer a 14-day free trial for all plans. No credit card required to get started.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept all major credit cards, ACH transfers, and can arrange invoicing for Enterprise customers.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer custom pricing?</h3>
              <p>Yes, we offer custom pricing for large dealership groups with specific requirements. Contact our sales team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Dealership?</h2>
          <p>Join thousands of dealers already using Caralytix to boost their sales and optimize their operations.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button primary">
              Start Free Trial
            </Link>
            <Link to="/contact" className="cta-button secondary">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pricing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Car className="logo-icon" />
            <span className="logo-text">Caralytix</span>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Caralytix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Pricing
