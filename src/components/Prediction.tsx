import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Prediction.css';
import Footer from './Footer';
import Header from './Header';
import PredictPrice from './PredictPrice';
import Recommendations from './Recommendations';
import ChatBot from './ChatBot';
import { getTheme, setTheme } from '../theme'

const Prediction: React.FC = () => {
  const location = useLocation() as { state?: { formData?: any } };

  // Initialize formData from navigation state if it exists
  const [formData, setFormData] = useState<any>(() => {
    return location.state?.formData || {};
  });
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Clear navigation state after restoring form data
  useEffect(() => {
    if (location.state?.formData) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictionResult(null);
    setTimeout(() => {
      setIsLoading(false);
      setPredictionResult(25000 + Math.floor(Math.random() * 10000));
      setRecommendations([
        'Toyota Camry 2020 - $22,000',
        'Honda Accord 2019 - $21,500',
        'Mazda 6 2021 - $23,000',
      ]);
    }, 2000);
  };

  const handleSendMessage = (message: string) => {
    setChatMessages((prev) => [...prev, { sender: 'user', text: message }]);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'This is a mock response from Caralytix ChatBot.' },
      ]);
    }, 1000);
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
            Predict Price
          </button>
          <button
            className={`capsule-btn${activeTab === 1 ? ' active' : ''}`}
            onClick={() => setActiveTab(1)}
            aria-label="Recommendations"
          >
            Recommendations
          </button>
          <button
            className={`capsule-btn${activeTab === 2 ? ' active' : ''}`}
            onClick={() => setActiveTab(2)}
            aria-label="Chatbot"
          >
            Chatbot
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
              recommendations={recommendations}
              isLoading={isLoading}
            />
          )}
          {activeTab === 2 && (
            <ChatBot
              chatMessages={chatMessages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Prediction;
            <span>Chatbot</span>
