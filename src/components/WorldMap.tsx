import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
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

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

  // Color and size mapping for impact levels
  const getMarkerProps = (level: 'low' | 'medium' | 'high') => {
    const props = {
      low: { fill: '#60a5fa', r: 4 },
      medium: { fill: '#3b82f6', r: 6 },
      high: { fill: '#1d4ed8', r: 8 }
    };
    return props[level];
  };

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
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Global Impact Map</h3>
        <p className="text-sm text-gray-600">Visualizing lives impacted across countries and regions</p>
      </div>

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
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20]
          }}
          width={800}
          height={400}
          className="w-full h-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e5e7eb"
                  stroke="#d1d5db"
                  strokeWidth={0.5}
                  className="hover:fill-gray-300 transition-colors"
                />
              ))
            }
          </Geographies>
          
          {/* Country Impact Markers */}
          {countryImpacts.map((impact) => {
            const markerProps = getMarkerProps(impact.level);
            
            return (
              <Marker
                key={impact.country}
                coordinates={impact.coordinates}
                onMouseEnter={() => setHoveredCountry(impact.country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                <circle
                  {...markerProps}
                  className="cursor-pointer transition-all hover:scale-125 animate-pulse"
                  style={{
                    filter: `drop-shadow(0 0 ${markerProps.r}px ${markerProps.fill}40)`,
                  }}
                />
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Tooltip */}
        {hoveredCountry && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-20">
            {(() => {
              const impact = countryImpacts.find(c => c.country === hoveredCountry);
              return impact ? (
                <>
                  <div className="font-semibold text-blue-200">{impact.country}</div>
                  <div className="text-gray-300">Lives Impacted: {Math.round(impact.totalImpact).toLocaleString()}</div>
                  <div className="text-gray-400 text-xs">Impact Level: {impact.level}</div>
                </>
              ) : null;
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="text-sm font-semibold text-gray-800 mb-3">Lives Impacted</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-xs text-gray-600">Low (<10K)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-blue-600" />
              <span className="text-xs text-gray-600">Medium (10K-30K)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-blue-800" />
              <span className="text-xs text-gray-600">High (>30K)</span>
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