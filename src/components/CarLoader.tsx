import React from 'react';
import { Car } from 'lucide-react';
import './CarLoader.css';

const CarLoader: React.FC = () => (
  <div className="car-loader">
    <div className="car-loader-car">
      <Car className="car-loader-icon" />
      <div className="car-loader-wheels">
        <div className="car-loader-wheel left"></div>
        <div className="car-loader-wheel right"></div>
      </div>
    </div>
    <div className="car-loader-road"></div>
  </div>
);

export default CarLoader;
