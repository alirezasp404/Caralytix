import React, { useEffect, useState } from 'react';
import './BrandsMarquee.css';

interface Brand {
  name: string;
}

const BrandsMarquee: React.FC<{ brands: Brand[] }> = ({ brands }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  
  // Split brands into two rows for a more dynamic effect
  const row1 = [...brands, ...brands];
  const row2 = [...brands.reverse(), ...brands.reverse()];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveRow((prev) => (prev + 1) % 2);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const getBrandColor = (brandName: string) => {
    const colors: Record<string, string> = {
      bmw: '#0066B1',
      mercedes: '#00A19C',
      audi: '#BB0A30',
      toyota: '#EB0A1E',
      honda: '#047BC0',
      hyundai: '#002C5F',
      kia: '#BB162B',
      nissan: '#C3002F',
      default: 'var(--accent-primary)'
    };
    const key = brandName.toLowerCase();
    return key in colors ? colors[key] : colors.default;
  };

  return (
    <div 
      className="brands-marquee-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="brands-track">
        <div className={`brands-marquee ${isHovered ? 'paused' : ''}`}>
          {row1.map((brand, index) => (
            <div 
              key={`row1-${index}`} 
              className={`brand-item ${activeRow === 0 ? 'active' : ''}`}
              style={{ 
                '--brand-color': getBrandColor(brand.name),
                '--delay': `${index * 0.1}s`
              } as React.CSSProperties}
            >
              <span className="brand-name">{brand.name}</span>
              <div className="brand-glow"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="brands-track reverse">
        <div className={`brands-marquee ${isHovered ? 'paused' : ''}`}>
          {row2.map((brand, index) => (
            <div 
              key={`row2-${index}`}
              className={`brand-item ${activeRow === 1 ? 'active' : ''}`}
              style={{ 
                '--brand-color': getBrandColor(brand.name),
                '--delay': `${index * 0.1}s`
              } as React.CSSProperties}
            >
              <span className="brand-name">{brand.name}</span>
              <div className="brand-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsMarquee;
