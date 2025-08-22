import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Car } from 'lucide-react';
import { searchCars, type CarSearchResult } from '../api';
import Swal from 'sweetalert2';
import CarLoader from './CarLoader';
import './CaraExplorer.css';

interface CaraExplorerProps {
  isLoading?: boolean;
}

const CaraExplorer: React.FC<CaraExplorerProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [searchInput, setSearchInput] = useState<string>(() => {
    const state = location.state as { formData?: { searchInput: string } } | null;
    return state?.formData?.searchInput || '';
  });
  const [searchResults, setSearchResults] = useState<CarSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Check if we should auto submit after sign in
  useEffect(() => {
    const state = location.state as { justSignedIn?: boolean; formData?: { searchInput: string } } | null;
    if (state?.justSignedIn && state.formData?.searchInput) {
      setShouldAutoSubmit(true);
      setSearchInput(state.formData.searchInput);
      // Clear navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  // Auto submit if needed
  useEffect(() => {
    if (shouldAutoSubmit && searchInput.trim()) {
      const submitEvent = new Event('submit', { cancelable: true }) as any;
      submitEvent.preventDefault = () => {};
      handleSubmit(submitEvent);
      setShouldAutoSubmit(false);
    }
  }, [shouldAutoSubmit, searchInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token && !shouldAutoSubmit) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please sign in to search for cars.',
        confirmButtonColor: '#667eea',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Sign In'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signin', { 
            state: { 
              from: '/prediction',
              formData: { searchInput },
              activeTab: 2 // Set to CaraExplorer tab index
            }
          });
        }
      });
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setSearchResults([]);
    
    try {
      const { data } = await searchCars(searchInput);
      setSearchResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching cars:', error);
      setError(error instanceof Error ? error.message : 'Failed to search cars');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="recommendations-card improved-recommendations">
      <h2 className="card-title">
        <Car size={28} className="icon-accent" />
        <span>Car Market Explorer</span>
      </h2>
      
      <form className="recommendations-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="input-group">
          <input
            className="search-input"
            type="text"
            placeholder="Enter car name to search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit" disabled={isSearching || !searchInput.trim()}>
            {isSearching ? <Car className="spin" size={20} /> : <><Search size={18} /> Search Cars</>}
          </button>
        </div>
      </form>

      <div className="recommendations-content">
        {isSearching ? (
          <div className="loading-state">
            <CarLoader />
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : hasSearched && searchResults.length > 0 ? (
          <div className="search-results">
            {searchResults.map((car, index) => (
              <div key={index} className="recommendation-item-card">
                <div className="car-image-container">
                  <img src={car.image} alt={car.name} className="car-image" />
                  {car.source === 'khdro45' && (
                    <img 
                      src="https://khodro45.com/build/images/khodro45-dark.svg" 
                      alt="Khodro45" 
                      className="image-source-logo"
                    />
                  )}
                  {car.source === 'hamrah-mechanic' && (
                    <img 
                      src="https://www.hamrah-mechanic.com/_next/static/media/new-logo.25cc4dfa.svg" 
                      alt="Hamrah Mechanic" 
                      className="image-source-logo"
                    />
                  )}
                </div>
                <div className="car-info">
                  <div className="rec-title">
                    <b>{car.name}</b>
                  </div>
                  <div className="rec-price">
                    <div className="price-label">Price:</div>
                    <div className="price-value">{(car.price * 10).toLocaleString()} Rial</div>
                  </div>

                  <a href={car.link} target="_blank" rel="noopener noreferrer" className="view-link">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="placeholder-content">
            <p className="placeholder-text">
              {!hasSearched ? 
                "Enter a car name above to explore available listings" 
                : "No cars found matching your search. Try a different keyword"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaraExplorer;
