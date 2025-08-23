import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTheme, setTheme } from '../theme';
import { Car, Target, Users, Sparkles, Github } from 'lucide-react';
import './AboutUs.css';
import Footer from './Footer';
import Header from './Header';

interface TeamMember {
  name: string;
  image: string;
  github: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Reza Ebadi',
    image: 'https://placehold.co/150x150/667eea/ffffff?text=RE',
    github: 'https://github.com/rezaebadi',
  },
  {
    name: 'Mohammad Ehsan Moslemi',
    image: 'https://placehold.co/150x150/764ba2/ffffff?text=EM',
    github: 'https://github.com/Ehsanmelm',
  },
  {
    name: 'Alireza SadeghiPour',
    image: 'https://placehold.co/150x150/667eea/ffffff?text=AS',
    github: 'https://github.com/alirezasp404',
  }
];

const AboutUs: React.FC = () => {
  const [theme, setThemeState] = useState<'dark' | 'light'>(getTheme());

  useEffect(() => {
    const applyTheme = (themeValue: 'dark' | 'light') => {
      setThemeState(themeValue);
      setTheme(themeValue);
    };

    const current = getTheme();
    applyTheme(current);

    const handler = (e: any) => {
      applyTheme(e.detail);
    };

    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  }, []);

  return (
    <div className={`about-container ${theme}`}>
     <Header></Header>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">
            Driving the future of vehicle analytics.
          </h1>
          <p className="about-subtitle">
            At Caralytix, we transform raw data into actionable insights for the automotive industry. Our platform empowers businesses to make smarter decisions and accelerate innovation.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Mission</h2>
          </div>
          <div className="mission-content">
            <div className="mission-icon">
              <Target size={48} />
            </div>
            <p className="mission-text">
              Our mission is to provide the most comprehensive and intuitive vehicle data platform, helping our partners optimize fleet performance, enhance driver safety, and build the next generation of connected car services.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-description">
              Behind Caralytix is a dedicated team of engineers, data scientists, and industry experts.
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-photo">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="github-link"
                  aria-label={`Visit ${member.name}'s GitHub profile`}
                >
                  <Github size={20} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Accelerate Your Business?</h2>
            <p>Join the countless companies already using Caralytix to drive innovation and efficiency.</p>
            <Link to="/prediction" className="cta-button cta-button-large">
              <Sparkles size={20} />
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <Footer></Footer>     
    </div>
  );
};

export default AboutUs;
