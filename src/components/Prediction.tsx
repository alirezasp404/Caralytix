import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Prediction.css';
import Footer from './Footer';
import Header from './Header';
import PredictPrice from './PredictPrice';
import Recommendations from './Recommendations';
import { getTheme, setTheme } from '../theme'
import CaraExplorer from './CaraExplorer';

const Prediction: React.FC = () => {
  const location = useLocation() as { 
    state?: { 
      formData?: any; 
      activeTab?: number;
      justSignedIn?: boolean;
      autoSubmit?: boolean;
    } 
  };

  // Initialize formData and active tab from navigation state if it exists
  const [formData, setFormData] = useState<any>(() => {
    return location.state?.formData || {};
  });
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState(() => {
    return location.state?.activeTab ?? 0;
  });

  // Handle auto-submit and state restoration
  useEffect(() => {
    if (location.state?.justSignedIn) {
      // Let the child components handle their auto-submit first
      setTimeout(() => {
        // Clear navigation state after components have processed it
        window.history.replaceState({}, document.title);
      }, 0);
    } else if (location.state?.formData || location.state?.activeTab !== undefined) {
      // Clear non-signin related state immediately
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };


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

  return (
    <div className={`prediction-container ${theme}`}>
      <Header />
      <div className="tabs-capsule-container">
        <div className="tabs-capsule">
          <button
            className={`capsule-btn${activeTab === 0 ? ' active' : ''}`}
            onClick={() => setActiveTab(0)}
            aria-label="Predict Price"
          >
            CaraPredict 
          </button>
          <button
            className={`capsule-btn${activeTab === 1 ? ' active' : ''}`}
            onClick={() => setActiveTab(1)}
            aria-label="Recommendations"
          >
            CaraRecom
          </button>
          <button
            className={`capsule-btn${activeTab === 2 ? ' active' : ''}`}
            onClick={() => setActiveTab(2)}
            aria-label="CaraExplorer"
          >
            CaraExplorer
          </button>
        </div>
      </div>
      <main className="main-content">
        <div className="tab-content">
          {activeTab === 0 && (
            <PredictPrice
              formData={formData}
              handleChange={handleChange}
              isLoading={isLoading}
              predictionResult={predictionResult}
              setPredictionResult={setPredictionResult}
              setIsLoading={setIsLoading}
            />
          )}
          {activeTab === 1 && (
            <Recommendations
              isLoading={isLoading}
            />
          )}
          {activeTab === 2 && (
            <CaraExplorer />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Prediction;
            <span>Chatbot</span>
