// Helper: Convert Persian/Arabic digits to English
function toEnglishDigits(input: any) {
  if (typeof input !== 'string' && typeof input !== 'number') return input;
  return String(input)
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

// Helper: Convert price Rial to Dollar (assume 1 USD = 50,000 IRR for demo)
function toDollar(price: number) {
  if (!price) return '-';
  const dollar = Number(price) / 50000; // 1 USD = 50,000 IRR (adjust as needed)
  return dollar.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// Helper: Get year name (e.g., 1401 => 2022)
function getYearName(year: string | number) {
  const y = Number(toEnglishDigits(year));
  if (y > 1300 && y < 1500) return (y + 621).toString();
  return year;
}






import React, { useState } from 'react';
import { Sparkles, Loader2, Search } from 'lucide-react';
import { fetchCarRecommendations } from '../api';
import './Recommendations.css';




const Recommendations: React.FC = () => {
  const [price, setPrice] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const res = await fetchCarRecommendations(Number(price));
      setRecommendations(res.suggested_cars || []);
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
            type="number"
            min="0"
            placeholder="Enter your budget (e.g. 1,000,000,000)"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit" disabled={isLoading || !price}>
            {isLoading ? <Loader2 className="spin" size={20} /> : <><Search size={18} /> Get Suggestions</>}
          </button>
        </div>
      </form>
      <div className="recommendations-content">
        {isLoading ? (
          <div className="loading-state">
            <Loader2 className="spin" size={32} />
            <span>Loading recommendations...</span>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="recommendation-item-card">
                <div className="rec-title">
                  <b>{rec.name} {rec.model}</b>
                  <span className="rec-year">({getYearName(rec.year)})</span>
                </div>
                <div className="rec-details">
                  <span>Gearbox: <b>{rec.gearbox || 'N/A'}</b></span>
                  <span>Mile: <b>{toEnglishDigits(rec.mile).toLocaleString()}</b></span>
                </div>
                <div className="rec-details">
                  <span>Body Health: <b>{toEnglishDigits(rec.body_health)}</b></span>
                  <span>Engine: <b>{rec.engine_status === 'نیست' ? 'Original' : rec.engine_status === 'هست' ? 'Replaced' : 'N/A'}</b></span>
                </div>
                <div className="rec-price">
                  <span>Predicted Price:</span>
                  <span className="price-value">${toDollar(rec.predicted_price)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="placeholder-content">
            <p className="placeholder-text">No recommendations yet. Enter your budget to get suggestions!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
