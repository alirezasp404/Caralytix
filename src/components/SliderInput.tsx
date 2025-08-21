import React from 'react';
import './SliderInput.css';

interface SliderInputProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  id?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({ value, min = 1, max = 10, step = 0.1, onChange, label, id }) => {
  return (
    <div className="slider-input-group">
      {label && <label htmlFor={id} className="slider-label">{label}</label>}
      <div className="slider-row">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="slider-input"
        />
        <span className="slider-value">{value}</span>
      </div>
    </div>
  );
};

export default SliderInput;
