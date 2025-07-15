import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
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

const WorldMap: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPillar, setSelectedPillar] = useState('All');
  const [selectedFocus, setSelectedFocus] = useState('All');
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const countries = [
    { name: 'United States', impact: 45000, grants: 89, x: 25, y: 30 },
    { name: 'Brazil', impact: 38000, grants: 67, x: 35, y: 55 },
    { name: 'India', impact: 52000, grants: 124, x: 70, y: 40 },
    { name: 'Nigeria', impact: 28000, grants: 45, x: 50, y: 45 },
    { name: 'Kenya', impact: 15000, grants: 23, x: 55, y: 50 },
    { name: 'Philippines', impact: 19000, grants: 34, x: 80, y: 45 },
  ];

  const getIntensity = (impact: number) => {
    const max = Math.max(...countries.map(c => c.impact));
    return impact / max;
  };

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
          options={['2024', '2023', '2022', '2021']}
          onChange={setSelectedYear}
        />
        <FilterDropdown
          label="Strategic Pillar"
          value={selectedPillar}
          options={['All', 'Education', 'Healthcare', 'Environment', 'Economic Development']}
          onChange={setSelectedPillar}
        />
        <FilterDropdown
          label="Focus Area"
          value={selectedFocus}
          options={['All', 'Clean Water', 'Food Security', 'Digital Access', 'Climate Action']}
          onChange={setSelectedFocus}
        />
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden">
        {/* Simplified World Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            {/* Simplified continent shapes */}
            <path d="M10 20 L25 15 L35 18 L40 25 L35 35 L25 40 L15 35 Z" fill="#e5e7eb" />
            <path d="M30 35 L45 30 L55 35 L50 50 L35 55 L25 45 Z" fill="#e5e7eb" />
            <path d="M60 15 L85 12 L90 25 L85 35 L70 40 L65 30 Z" fill="#e5e7eb" />
            <path d="M45 40 L60 35 L70 40 L65 55 L50 50 Z" fill="#e5e7eb" />
          </svg>
        </div>

        {/* Country Impact Dots */}
        {countries.map((country) => {
          const intensity = getIntensity(country.impact);
          const size = 8 + intensity * 12;
          const opacity = 0.3 + intensity * 0.7;
          
          return (
            <div
              key={country.name}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110"
              style={{ left: `${country.x}%`, top: `${country.y}%` }}
              onMouseEnter={() => setHoveredCountry(country.name)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <div
                className="rounded-full bg-gradient-to-br from-blue-500 to-green-500 animate-pulse"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: opacity,
                }}
              />
              
              {/* Tooltip */}
              {hoveredCountry === country.name && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                  <div className="font-medium">{country.name}</div>
                  <div>Lives Impacted: {country.impact.toLocaleString()}</div>
                  <div>Active Grants: {country.grants}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
          <div className="text-xs font-medium text-gray-700 mb-2">Lives Impacted</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-green-500 opacity-40" />
            <span className="text-xs text-gray-600">Low</span>
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-green-500 opacity-70" />
            <span className="text-xs text-gray-600">Medium</span>
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-green-500" />
            <span className="text-xs text-gray-600">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;