// Helper: Convert Persian/Arabic digits to English
function toEnglishDigits(input: any) {
  if (typeof input !== 'string' && typeof input !== 'number') return input;
  return String(input)
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

// Helper: Convert between Rial and Toman
function rialToToman(rial: number) {
  return Math.round(rial / 10);
}

function tomanToRial(toman: number) {
  return toman * 10;
}

// Helper: Format year to Persian with English numbers
function getYearName(year: string | number) {
  const y = Number(toEnglishDigits(year));
  // If it's a Gregorian year (greater than 1900), convert to Persian
  if (y > 1900) {
    return (y - 621).toString();
  }
  // If it's already Persian year (1300-1500 range), just ensure it's in English digits
  if (y > 1300 && y < 1500) {
    return y.toString();
  }
  return year.toString();
}

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Search, Car } from 'lucide-react';
import { fetchCarRecommendations } from '../api';
import Swal from 'sweetalert2';
import './Recommendations.css';
import CarLoader from './CarLoader';

interface RecommendationsProps {
  recommendations?: string[];
  isLoading?: boolean;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations: propRecommendations, isLoading: propIsLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [price, setPrice] = useState(() => {
    const state = location.state as { formData?: { price: string } } | null;
    return state?.formData?.price || '';
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Check if we should auto submit after sign in
  useEffect(() => {
    const state = location.state as { justSignedIn?: boolean; formData?: { price: string } } | null;
    if (state?.justSignedIn && state.formData?.price) {
      setShouldAutoSubmit(true);
      setPrice(state.formData.price);
      // Clear navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  // Auto submit if needed
  useEffect(() => {
    if (shouldAutoSubmit && price) {
      const submitEvent = new Event('submit', { cancelable: true }) as any;
      submitEvent.preventDefault = () => {};
      handleSubmit(submitEvent);
      setShouldAutoSubmit(false);
    }
  }, [shouldAutoSubmit, price]);

  // Format number with commas as thousand separators
  const formatPrice = (value: string) => {
    // Remove any non-digit characters
    const number = value.replace(/\D/g, '');
    // Format with commas
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle price input with automatic formatting
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPrice(e.target.value);
    setPrice(formattedValue.replace(/,/g, '')); // Store the numeric value without commas
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token && !shouldAutoSubmit) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please sign in to get car recommendations.',
        confirmButtonColor: '#667eea',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Sign In'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signin', { 
            state: { 
              from: '/prediction',
              formData: { price },
              activeTab: 1 // Set to Recommendations tab index
            }
          });
        }
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      // Convert input from Rial to Toman before sending to API
      const priceRial = Number(price.replace(/,/g, '')); // Remove commas before converting
      const priceToman = rialToToman(priceRial);
      const res = await fetchCarRecommendations(priceToman);
      setRecommendations(res.suggested_cars || []);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to fetch recommendations.');
    }
    setIsLoading(false);
  };

  return (
    <div className="recommendations-card improved-recommendations">
      <h2 className="card-title">
        <Sparkles size={28} className="icon-accent" />
        <span>Smart Car Recommendations</span>
      </h2>
      <form className="recommendations-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="input-group">
          <input
            className="price-input"
            type="text"
            inputMode="numeric"
            pattern="\d{1,3}(,\d{3})*"
            placeholder="Enter your budget in Rial (e.g., 1,000,000)"
            value={price ? formatPrice(price) : ''}
            onChange={handlePriceChange}
            required
          />
          <button className="submit-btn" type="submit" disabled={isLoading || !price}>
            {isLoading ? <Car className="spin" size={20} /> : <><Search size={18} /> Get Suggestions</>}
          </button>
        </div>
      </form>
      <div className="recommendations-content">
        {isLoading ? (
          <div className="loading-state">
            <CarLoader />
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : hasSearched && recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map((rec: any, idx: number) => {
              // rec.predicted_price is in toman, convert to rial for display
              const priceToman = rec.predicted_price;
              const priceRial = tomanToRial(priceToman);
              return (
                <div key={idx} className="recommendation-item-card">
                  <div className="rec-title">
                    <b>{rec.name} {rec.model}</b>
                    <span className="rec-year">{getYearName(rec.year)}</span>
                  </div>
                  <div className="rec-details">
                    <span>Gearbox: <b>{rec.gearbox || 'N/A'}</b></span>
                    <span>Mile: <b>{toEnglishDigits(rec.mile).toLocaleString()}</b></span>
                  </div>
                  <div className="rec-details">
                    <span>Body Health: <b>{toEnglishDigits(rec.body_health)}</b></span>
                    <span>Engine Status: <b>{rec.engine_status === 'نیست' ? 'Original' : rec.engine_status === 'هست' ? 'Replaced' : 'N/A'}</b></span>
                  </div>
                  <div className="rec-price">
                    <div className="price-label">Price:</div>
                      <div className="price-value">{priceRial.toLocaleString()} Rial</div>
                      {rec.price_usd && <div className="price-value dollar">${rec.price_usd.toLocaleString()} USD</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="placeholder-content">
            <p className="placeholder-text">
              {!hasSearched ? 
                "Enter your budget above to discover personalized car recommendations" 
                : "No matching cars found for your budget. Try adjusting your budget range"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
