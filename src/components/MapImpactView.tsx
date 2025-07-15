import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface GRIData {
  GRI_year: number;
  focus_area: string;
  strategic_pillar: string;
  lives_impacted_total: number;
  lives_impacted_country_name: string;
}

interface CountryCoordinates {
  [key: string]: [number, number]; // [longitude, latitude]
}

interface CountryImpact {
  country: string;
  totalImpact: number;
  coordinates: [number, number];
  level: 'low' | 'medium' | 'high';
}

interface MapImpactViewProps {
  selectedYear: string;
  selectedFocusArea: string;
  selectedPillar: string;
}

function getImpactLevel(val: number): 'low' | 'medium' | 'high' {
  if (val < 1000) return 'low';
  if (val < 10000) return 'medium';
  return 'high';
}

const colorMap = {
  low: '#cceeff',
  medium: '#40b4d4',
  high: '#008ecc'
};

const MapImpactView: React.FC<MapImpactViewProps> = ({
  selectedYear,
  selectedFocusArea,
  selectedPillar
}) => {
  const [griData, setGriData] = useState<GRIData[]>([]);
  const [countryCoordinates, setCountryCoordinates] = useState<CountryCoordinates>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [griResponse, coordResponse] = await Promise.all([
          fetch('/data/gri_data.json'),
          fetch('/data/country-coordinates.json')
        ]);
        
        const griData = await griResponse.json();
        const coordinates = await coordResponse.json();
        
        setGriData(griData);
        setCountryCoordinates(coordinates);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return griData.filter(row => {
      const yearMatch = selectedYear === 'All' || String(row.GRI_year) === selectedYear;
      const focusMatch = selectedFocusArea === 'All' || row.focus_area === selectedFocusArea;
      const pillarMatch = selectedPillar === 'All' || row.strategic_pillar === selectedPillar;
      
      return yearMatch && focusMatch && pillarMatch;
    });
  }, [griData, selectedYear, selectedFocusArea, selectedPillar]);

  const countryImpacts = useMemo(() => {
    const impacts: { [key: string]: number } = {};
    
    filteredData.forEach(row => {
      const countries = row.lives_impacted_country_name.split(';').map(c => c.trim());
      const impactPerCountry = row.lives_impacted_total / countries.length;
      
      countries.forEach(country => {
        impacts[country] = (impacts[country] || 0) + impactPerCountry;
      });
    });

    return Object.entries(impacts)
      .map(([country, totalImpact]) => {
        const coordinates = countryCoordinates[country];
        if (!coordinates) return null;
        
        return {
          country,
          totalImpact,
          coordinates,
          level: getImpactLevel(totalImpact)
        };
      })
      .filter((item): item is CountryImpact => item !== null);
  }, [filteredData, countryCoordinates]);

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-white rounded-2xl shadow-md overflow-hidden flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-white rounded-2xl shadow-md overflow-hidden relative">
      {/* World Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Simplified world map continents */}
          <g fill="#e5e7eb" opacity="0.3">
            {/* North America */}
            <path d="M100 100 L250 80 L280 120 L320 140 L300 200 L250 220 L200 200 L150 180 Z" />
            {/* South America */}
            <path d="M250 250 L300 240 L320 280 L340 350 L320 400 L280 420 L260 380 L240 320 Z" />
            {/* Europe */}
            <path d="M450 80 L520 70 L540 100 L530 130 L500 140 L470 120 Z" />
            {/* Africa */}
            <path d="M480 150 L540 140 L560 180 L570 250 L550 320 L520 340 L490 320 L470 280 L460 220 Z" />
            {/* Asia */}
            <path d="M550 60 L750 50 L800 80 L820 120 L840 160 L820 200 L780 220 L720 200 L680 180 L640 160 L600 140 L570 100 Z" />
            {/* Australia */}
            <path d="M750 320 L820 310 L840 340 L830 370 L800 380 L770 370 Z" />
          </g>
        </svg>

        {/* Country Impact Circles */}
        {countryImpacts.map((impact, index) => {
          const x = ((impact.coordinates[0] + 180) / 360) * 1000;
          const y = ((90 - impact.coordinates[1]) / 180) * 500;
          const size = Math.max(8, Math.min(40, impact.totalImpact / 500));
          
          return (
            <motion.div
              key={impact.country}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              <div
                className="rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: colorMap[impact.level],
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="font-medium">{impact.country}</div>
                <div>Lives Impacted: {Math.round(impact.totalImpact).toLocaleString()}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-lg">
        <div className="text-sm font-medium text-gray-700 mb-3">Lives Impacted</div>
        <div className="space-y-2">
          {Object.entries(colorMap).map(([level, color]) => (
            <div key={level} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600 capitalize">
                {level} {level === 'low' ? '(<1K)' : level === 'medium' ? '(1K-10K)' : '(>10K)'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-lg">
        <div className="text-sm font-medium text-gray-700 mb-2">Current View</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Countries: {countryImpacts.length}</div>
          <div>Total Impact: {Math.round(countryImpacts.reduce((sum, c) => sum + c.totalImpact, 0)).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default MapImpactView;