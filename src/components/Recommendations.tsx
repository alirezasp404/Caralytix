import React from 'react';
import { Sparkles } from 'lucide-react';

const Recommendations: React.FC<any> = ({ recommendations, isLoading }) => (
  <div className="recommendations-card">
    <h2 className="card-title">
      <Sparkles size={24} className="icon-accent" />
      Smart Recommendations
    </h2>
    <div className="recommendations-content">
      {isLoading ? (
        <div className="loading-state">Loading recommendations...</div>
      ) : recommendations && recommendations.length > 0 ? (
        <ul className="recommendations-list">
          {recommendations.map((rec: string, idx: number) => (
            <li key={idx} className="recommendation-item">{rec}</li>
          ))}
        </ul>
      ) : (
        <div className="placeholder-content">
          <p className="placeholder-text">No recommendations yet. Predict a price to get suggestions!</p>
        </div>
      )}
    </div>
  </div>
);

export default Recommendations;
