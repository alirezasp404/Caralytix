import React, { useState, useEffect } from 'react'
import { getTheme, setTheme } from '../theme'
import { Link } from 'react-router-dom'
import { Car, Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'
import './Contact.css'
import Footer from './Footer'
import Header from './Header'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })
  const [theme, setThemeState] = useState<'dark' | 'light'>(getTheme())
  useEffect(() => {
    const applyTheme = (themeValue: 'dark' | 'light') => {
      setThemeState(themeValue)
      setTheme(themeValue)
    }
    const current = getTheme()
    applyTheme(current)
    const handler = (e: any) => {
      applyTheme(e.detail)
    }
    window.addEventListener('themechange', handler)
    return () => window.removeEventListener('themechange', handler)
  }, [])

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert('Thank you for your message! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      })
    }, 1000)
  }

  return (
    <div className={`contact-container ${theme}`}>
      <Header></Header>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <p>Find answers to common questions about Caralytix features and implementation.</p>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@company.com"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="demo">Request Demo</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your needs..."
                  rows={6}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button" disabled={isLoading}>
                <Send size={20} />
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
          {/* Contact Info */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon">
                  <Mail />
                </div>
                <h3>Email Us</h3>
                <p>Get in touch via email</p>
                <a href="mailto:hello@caralytix.com">hello@caralytix.com</a>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <Phone />
                </div>
                <h3>Call Us</h3>
                <p>Speak with our team</p>
                <a href="tel:+1-555-123-4567">+1 (555) 123-4567</a>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <MapPin />
                </div>
                <h3>Visit Us</h3>
                <p>Our headquarters</p>
                <address>
                  123 Innovation Drive<br />
                  Tech Valley, CA 94000<br />
                  United States
                </address>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <Clock />
                </div>
                <h3>Business Hours</h3>
                <p>We're here to help</p>
                <div className="hours">
                  <div>Mon - Fri: 9:00 AM - 6:00 PM PST</div>
                  <div>Sat - Sun: 10:00 AM - 4:00 PM PST</div>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-button" onClick={() => window.open('https://calendly.com/caralytix-demo', '_blank')}>
                  <MessageSquare size={20} />
                  Schedule Demo
                </button>
              </div>
            </div>
            {/* FAQ Link */}
            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <p>Find answers to common questions about Caralytix features and implementation.</p>
              <Link to="/faq" className="faq-link">Browse FAQ →</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>

    </div>
  )
}

export default Contact