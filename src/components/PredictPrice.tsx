import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Send, DollarSign, Loader2 } from 'lucide-react';
import { fetchCarNames, fetchCarModels, predictPrice } from '../api';
import Switch from './Switch';
import SliderInput from './SliderInput';
import './Switch.css';
import './SliderInput.css';
import Select from 'react-select';

// Custom styles for React Select to support dark mode
const customSelectStyles = {
  control: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    backgroundColor: 'var(--bg-secondary)',
    borderColor: state.isFocused ? 'var(--accent-primary)' : 'var(--border-color)',
    color: 'var(--text-primary)',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.10)' : '0 1px 6px rgba(102,126,234,0.08)',
    borderRadius: '1.5rem',
    minHeight: '44px',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    borderRadius: '1.2rem',
    zIndex: 20,
  }),
  option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'var(--accent-primary)'
      : state.isFocused
      ? 'rgba(102,126,234,0.08)'
      : 'var(--bg-card)',
    color: state.isSelected ? '#fff' : 'var(--text-primary)',
    borderRadius: '0.8rem',
    cursor: 'pointer',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'var(--accent-primary)',
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--border-color)',
  }),
};

interface FormData {
  name: string;
  model: string;
  mile: string;
  year: string;
  gearbox: 'automatic' | 'manual';
  engine_status: 'هست' | 'نیست';
  body_health: string;
}

interface PredictPriceProps {
  formData: FormData;
  handleChange: (e: { target: { name: string; value: any } }) => void;
  isLoading: boolean;
  predictionResult: number | null;
  setPredictionResult: (value: number | null) => void;
  setIsLoading: (value: boolean) => void;
}

const PredictPrice: React.FC<PredictPriceProps> = ({ formData, handleChange, isLoading, predictionResult, setPredictionResult, setIsLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  type BrandType = { name: string };
  type ModelType = { model: string };
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [models, setModels] = useState<ModelType[]>([]);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  
  // Check if we should auto submit after sign in or direct from landing
  useEffect(() => {
    const state = location.state as { justSignedIn?: boolean; autoSubmit?: boolean; formData?: any } | null;
    console.log('Location state:', state); // For debugging

    if (state?.formData) {
      const token = localStorage.getItem('token');
      const shouldAutoSubmit = (state.justSignedIn || state.autoSubmit) && token;

      if (shouldAutoSubmit && formData.name && formData.model) {
        console.log('Setting should auto-submit'); // For debugging
        setShouldAutoSubmit(true);
      }

      // Clear the flags to prevent re-submission
      navigate(location.pathname, { 
        replace: true,
        state: { ...state, justSignedIn: false, autoSubmit: false }
      });
    }
  }, [location.state]);
  const [engineStatus, setEngineStatus] = useState(formData.engine_status === 'هست' ? true : false);

  useEffect(() => {
    fetchCarNames().then(setBrands).catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    if (formData.name) {
      fetchCarModels(formData.name).then(setModels).catch(() => setModels([]));
    } else {
      setModels([]);
    }
  }, [formData.name]);

  // Auto submit the form when coming back from sign in
  useEffect(() => {
    if (shouldAutoSubmit) {
      console.log('Auto-submitting form...'); // For debugging
      const submitEvent = new Event('submit', { cancelable: true }) as any;
      submitEvent.preventDefault = () => {}; // Prevent the default event from being called
      handleSubmit(submitEvent);
      setShouldAutoSubmit(false);
    }
  }, [shouldAutoSubmit]);

  // For engine status: 'Replaced' or 'Original' in UI, send 'هست' or 'نیست' to API
  const handleEngineStatusSwitch = (checked: boolean) => {
    setEngineStatus(checked);
    handleChange({
      target: {
        name: 'engine_status',
        value: checked ? 'هست' : 'نیست',
      }
    });
  };

  // Handle form submit and send to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token && !shouldAutoSubmit) { // Don't show login prompt on auto-submit
      // Show login required message and redirect to sign in
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please sign in to get your car price prediction.',
        confirmButtonColor: '#667eea',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Sign In'
      }).then((result) => {
        if (result.isConfirmed) {
          // Save form data in navigation state
          navigate('/signin', { 
            state: { 
              from: '/prediction',
              formData: formData 
            }
          });
        }
      });
      return;
    }
    
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const data = await predictPrice({
        name: formData.name,
        model: formData.model,
        gearbox: formData.gearbox,
        year: Number(formData.year),
        mile: Number(formData.mile),
        body_health: Number(formData.body_health),
        engine_status: formData.engine_status,
      });
      setPredictionResult(data.predicted_price || null);
    } catch (err) {
      setPredictionResult(null);
      // Optionally show error to user
    } finally {
      setIsLoading(false);
    }
  };
  const modelOptions = models.map((model) => ({
    value: model.model,
    label: model.model,
  }));

  const brandOptions = brands.map((brand) => ({
    value: brand.name,
    label: brand.name,
  }));

  // Find the selected brand and model options based on formData values
  const selectedBrandOption = brandOptions.find(option => option.value === formData.name) || null;
  const selectedModelOption = modelOptions.find(option => option.value === formData.model) || null;


  return (
  <div className="content-grid" style={{gap: '1.5rem', alignItems: 'start', minHeight: 'unset'}}>
      {/* Prediction Form */}
  <div className="form-card" style={{padding: '1.5rem 1.2rem', minWidth: 0}}>
        <h2 className="card-title">Predict Your Car's Price</h2>

  <form onSubmit={handleSubmit} className="prediction-form" style={{gap: '1rem'}}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
<Select
        id="name"
        name="name"
        options={brandOptions}
        value={selectedBrandOption}
        onChange={(selectedOption) => {
          const value = selectedOption ? selectedOption.value : '';
          handleChange({
            target: {
              name: 'name',
              value: value,
            },
          });
        }}
        placeholder="Select name"
        required
  styles={customSelectStyles}
      />
          </div>
          <div className="form-group">
            <label htmlFor="model">Model *</label>
      <Select
        id="model"
        name="model"
        options={modelOptions}
        value={selectedModelOption}
        onChange={(selectedOption) => {
          const value = selectedOption ? selectedOption.value : '';
          handleChange({
            target: {
              name: 'model',
              value: value,
            },
          });
        }}
        placeholder="Select model"
        isDisabled={!formData.name}
        styles={customSelectStyles}
      />
          </div>
          <div className="form-row">
            <div className="form-group input">
              <label htmlFor="mile">Mileage (km) *</label>
              <input
                type="number"
                id="mile"
                name="mile"
                value={formData.mile || ''}
                onChange={handleChange}
                placeholder="e.g. 10000"
                required
              />
            </div>
            <div className="form-group input">
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year || ''}
                onChange={handleChange}
                placeholder="e.g. 2020"
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gearbox">Gearbox *</label>
              <Switch
                checked={formData.gearbox === 'automatic'}
                onChange={checked => handleChange({ target: { name: 'gearbox', value: checked ? 'automatic' : 'manual' } })}
                leftLabel="Manual"
                rightLabel="Automatic"
                id="gearbox"
              />
            </div>
            <div className="form-group">
              <label htmlFor="engine_status">Engine Status *</label>
              <Switch
                checked={engineStatus}
                onChange={handleEngineStatusSwitch}
                leftLabel="Original"
                rightLabel="Replaced"
                id="engine_status"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{width: '100%'}}>
              <SliderInput
                value={Number(formData.body_health) || 1}
                min={1}
                max={10}
                step={0.1}
                onChange={val => handleChange({ target: { name: 'body_health', value: val } })}
                label="Body Health (1-10) *"
                id="body_health"
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
  );
};

export default PredictPrice;
