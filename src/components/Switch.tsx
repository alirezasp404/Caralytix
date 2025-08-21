import React from 'react';
import './Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel: string;
  rightLabel: string;
  id?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, leftLabel, rightLabel, id }) => {
  return (
    <div className="switch-container">
      <span className={`switch-label${!checked ? ' active' : ''}`}>{leftLabel}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          id={id}
        />
        <span className="slider" />
      </label>
      <span className={`switch-label${checked ? ' active' : ''}`}>{rightLabel}</span>
    </div>
  );
};

export default Switch;
