
import React, { useState, useEffect } from 'react';
import { getTheme, setTheme } from '../theme';
import { Send, DollarSign, Loader2, Tag, Star, MessageCircle } from 'lucide-react';
import './Prediction.css';
import Footer from './Footer';
import Header from './Header';

interface FormData {
  make: string;
  model: string;
  year: string;
  mileage: number | '';
  condition: string;
  location: string;
}

const Prediction: React.FC = () => {
  // State for form inputs
  const [formData, setFormData] = useState<FormData>({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    location: ''
  });

  // State for prediction result and loading state
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setThemeState] = useState<'dark' | 'light'>(getTheme());

  // Effect to handle theme changes
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

  // Function to handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'mileage' ? Number(value) || '' : value
    }));
  };

  // Function to handle form submission and mock API call
  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictionResult(null); // Clear previous result

    // Simulate an API call with a setTimeout
    setTimeout(() => {
      // Logic for mock prediction based on form data
      const basePrice = 25000;
      const mileageFactor = formData.mileage ? -0.1 * (Number(formData.mileage) / 10000) : 0;
      const conditionFactor = formData.condition === 'Excellent' ? 1.2 : (formData.condition === 'Good' ? 1.0 : 0.8);
      
      const predictedPrice = Math.floor(basePrice * conditionFactor + mileageFactor + Math.random() * 5000);

      setIsLoading(false);
      setPredictionResult(predictedPrice);
    }, 2000);
  };

  // Tab state: 0 = Predict Price, 1 = Recommendations, 2 = Chatbot
  const [activeTab, setActiveTab] = React.useState(0);

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
            <Tag size={20} style={{marginRight: 8}} />
            <span>Predict Price</span>
          </button>
          <button
            className={`capsule-btn${activeTab === 1 ? ' active' : ''}`}
            onClick={() => setActiveTab(1)}
            aria-label="Recommendations"
          >
            <Star size={20} style={{marginRight: 8}} />
            <span>Recommendations</span>
          </button>
          <button
            className={`capsule-btn${activeTab === 2 ? ' active' : ''}`}
            onClick={() => setActiveTab(2)}
            aria-label="Chatbot"
          >
            <MessageCircle size={20} style={{marginRight: 8}} />
            <span>Chatbot</span>
          </button>
        </div>
      </div>
      <main className="main-content">
        <div className="tab-content">
          {activeTab === 0 && (
            <div className="content-grid">
              {/* Prediction Form */}
              <div className="form-card">
                <h2 className="card-title">Predict Your Car's Price</h2>
                <p className="card-description">
                  Fill out the details below to get an estimated market value of your vehicle.
                </p>
                <form onSubmit={handlePredict} className="prediction-form">
                  <div className="form-group">
                    <label htmlFor="make">Car Make *</label>
                    <input
                      type="text"
                      id="make"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      placeholder="e.g. Toyota"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="model">Model *</label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g. Camry"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="year">Year *</label>
                      <input
                        type="number"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="e.g. 2020"
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="mileage">Mileage (miles) *</label>
                      <input
                        type="number"
                        id="mileage"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        placeholder="e.g. 50000"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="condition">Condition *</label>
                      <select
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select condition</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">Location *</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. New York, NY"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="predict-button" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Get Prediction
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Prediction Results */}
              <div className="results-card">
                <h2 className="card-title">Estimated Price</h2>
                <div className="results-content">
                  {isLoading ? (
                    <div className="loading-state">
                      <Loader2 size={48} className="animate-spin text-accent-primary" />
                      <p className="loading-text">Calculating the best price for you...</p>
                    </div>
                  ) : predictionResult !== null ? (
                    <div className="price-display">
                      <div className="price-icon">
                        <DollarSign size={48} />
                      </div>
                      <span className="price-value">${predictionResult.toLocaleString()}</span>
                      <p className="price-label">Based on current market data.</p>
                    </div>
                  ) : (
                    <div className="placeholder-content">
                      <p className="placeholder-text">
                        Enter your car's details on the left to get a real-time price estimate.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="recommendations-tab">
              <h2 className="card-title">Car Recommendations</h2>
              <p className="card-description">Get personalized car recommendations based on your predicted price and preferences. (Coming soon!)</p>
              {/* TODO: Implement recommendations logic */}
            </div>
          )}
          {activeTab === 2 && (
            <div className="chatbot-tab">
              <h2 className="card-title">CarBot Chat</h2>
              <p className="card-description">Chat with our AI assistant for car advice, buying tips, and more. (Coming soon!)</p>
              {/* TODO: Implement chatbot logic */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Prediction;
