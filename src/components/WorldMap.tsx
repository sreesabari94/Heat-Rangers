import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

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

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all"
      >
        <span className="text-sm font-medium text-gray-700">{label}: {value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white/90 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/50 first:rounded-t-xl last:rounded-b-xl transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function getImpactLevel(val: number): 'low' | 'medium' | 'high' {
  if (val < 10000) return 'low';
  if (val < 30000) return 'medium';
  return 'high';
}

const WorldMap: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedPillar, setSelectedPillar] = useState('All');
  const [selectedFocus, setSelectedFocus] = useState('All');
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
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

  // Filter data based on selections
  const filteredData = griData.filter(row => {
    const yearMatch = selectedYear === 'All' || String(row.GRI_year) === selectedYear;
    const pillarMatch = selectedPillar === 'All' || row.strategic_pillar === selectedPillar;
    const focusMatch = selectedFocus === 'All' || row.focus_area === selectedFocus;
    
    return yearMatch && pillarMatch && focusMatch;
  });

  // Aggregate impact by country
  const countryImpacts: CountryImpact[] = React.useMemo(() => {
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

  // Get unique values for filters
  const years = Array.from(new Set(griData.map(item => String(item.GRI_year)))).sort();
  const pillars = Array.from(new Set(griData.map(item => item.strategic_pillar).filter(Boolean))).sort();
  const focusAreas = Array.from(new Set(griData.map(item => item.focus_area).filter(Boolean))).sort();

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        <FilterDropdown
          label="Year"
          value={selectedYear}
          options={['All', ...years]}
          onChange={setSelectedYear}
        />
        <FilterDropdown
          label="Strategic Pillar"
          value={selectedPillar}
          options={['All', ...pillars]}
          onChange={setSelectedPillar}
        />
        <FilterDropdown
          label="Focus Area"
          value={selectedFocus}
          options={['All', ...focusAreas]}
          onChange={setSelectedFocus}
        />
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden">
        {/* World Map Background with SVG */}
        <svg viewBox="0 0 1000 500" className="w-full h-full absolute inset-0">
          {/* World map continents - simplified paths */}
          <g fill="#e5e7eb" opacity="0.4" stroke="#d1d5db" strokeWidth="0.5">
            {/* North America */}
            <path d="M100 80 L180 60 L220 70 L280 90 L320 110 L340 140 L320 180 L280 200 L240 190 L200 170 L160 150 L120 130 Z" />
            
            {/* South America */}
            <path d="M240 220 L280 210 L300 230 L320 270 L340 320 L350 370 L330 410 L300 430 L270 420 L250 390 L230 350 L220 300 L230 260 Z" />
            
            {/* Europe */}
            <path d="M450 60 L500 50 L530 60 L550 80 L540 110 L520 120 L490 110 L470 90 Z" />
            
            {/* Africa */}
            <path d="M480 130 L520 120 L550 130 L570 160 L580 200 L590 250 L580 300 L560 340 L530 360 L500 350 L480 320 L470 280 L460 240 L465 200 L470 160 Z" />
            
            {/* Asia */}
            <path d="M550 40 L650 30 L750 35 L820 50 L880 70 L900 100 L920 140 L910 180 L890 210 L850 230 L800 240 L750 230 L700 210 L650 190 L600 170 L570 150 L560 120 L555 80 Z" />
            
            {/* Australia */}
            <path d="M750 300 L800 290 L840 300 L860 320 L850 350 L820 360 L780 355 L760 340 Z" />
            
            {/* Antarctica */}
            <path d="M100 450 L900 450 L900 480 L100 480 Z" />
          </g>
          
          {/* Grid lines for reference */}
          <defs>
            <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 25" fill="none" stroke="#f3f4f6" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="1000" height="500" fill="url(#grid)" />
        </svg>

        {/* Country Impact Points */}
        {countryImpacts.map((impact, index) => {
          // Convert lat/lng to SVG coordinates
          const x = ((impact.coordinates[0] + 180) / 360) * 1000;
          const y = ((90 - impact.coordinates[1]) / 180) * 500;
          
          // Size based on impact level
          const sizeMap = { low: 8, medium: 12, high: 18 };
          const size = sizeMap[impact.level];
          
          // Color based on impact level
          const colorMap = {
            low: '#60a5fa',
            medium: '#3b82f6', 
            high: '#1d4ed8'
          };
          
          return (
            <div
              key={impact.country}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 z-10"
              style={{ left: `${x}px`, top: `${y}px` }}
              onMouseEnter={() => setHoveredCountry(impact.country)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <div
                className="rounded-full shadow-lg animate-pulse"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: colorMap[impact.level],
                  boxShadow: `0 0 ${size}px ${colorMap[impact.level]}40`,
                }}
              />
              
              {/* Tooltip */}
              {hoveredCountry === impact.country && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-20">
                  <div className="font-semibold text-blue-200">{impact.country}</div>
                  <div className="text-gray-300">Lives Impacted: {Math.round(impact.totalImpact).toLocaleString()}</div>
                  <div className="text-gray-400 text-xs">Impact Level: {impact.level}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="text-sm font-semibold text-gray-800 mb-3">Lives Impacted</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-xs text-gray-600">Low (&lt;10K)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-xs text-gray-600">Medium (10K-30K)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-blue-800" />
              <span className="text-xs text-gray-600">High (&gt;30K)</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="text-sm font-semibold text-gray-800 mb-2">Current View</div>
          <div className="space-y-1 text-xs text-gray-600">
            <div>Countries: {countryImpacts.length}</div>
            <div>Total Impact: {Math.round(countryImpacts.reduce((sum, c) => sum + c.totalImpact, 0)).toLocaleString()}</div>
            <div className="text-gray-500 mt-2">
              {selectedYear !== 'All' && `Year: ${selectedYear}`}
              {selectedPillar !== 'All' && ` • ${selectedPillar}`}
              {selectedFocus !== 'All' && ` • ${selectedFocus}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;