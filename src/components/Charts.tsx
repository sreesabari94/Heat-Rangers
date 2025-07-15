import React from 'react';

const Charts: React.FC = () => {
  const lineData = [
    { year: '2019', grants: 1200000, lives: 45000 },
    { year: '2020', grants: 1450000, lives: 52000 },
    { year: '2021', grants: 1680000, lives: 68000 },
    { year: '2022', grants: 1920000, lives: 78000 },
    { year: '2023', grants: 2100000, lives: 95000 },
    { year: '2024', grants: 2400000, lives: 124000 },
  ];

  const focusAreas = [
    { name: 'Clean Water', value: 35, color: 'from-blue-500 to-blue-600' },
    { name: 'Food Security', value: 28, color: 'from-green-500 to-green-600' },
    { name: 'Digital Access', value: 22, color: 'from-purple-500 to-purple-600' },
    { name: 'Climate Action', value: 15, color: 'from-orange-500 to-orange-600' },
  ];

  const strategicPillars = [
    { name: 'Education', value: 40, color: 'from-indigo-500 to-indigo-600' },
    { name: 'Healthcare', value: 30, color: 'from-red-500 to-red-600' },
    { name: 'Environment', value: 20, color: 'from-emerald-500 to-emerald-600' },
    { name: 'Economic Dev', value: 10, color: 'from-yellow-500 to-yellow-600' },
  ];

  const maxGrants = Math.max(...lineData.map(d => d.grants));
  const maxLives = Math.max(...lineData.map(d => d.lives));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Grant Trends Over Time</h3>
        
        <div className="h-64 relative">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#grid)" />
            
            {/* Grants line */}
            <polyline
              fill="none"
              stroke="url(#grantsGradient)"
              strokeWidth="2"
              points={lineData.map((d, i) => `${10 + i * 15},${55 - (d.grants / maxGrants) * 40}`).join(' ')}
            />
            
            {/* Lives line */}
            <polyline
              fill="none"
              stroke="url(#livesGradient)"
              strokeWidth="2"
              points={lineData.map((d, i) => `${10 + i * 15},${55 - (d.lives / maxLives) * 40}`).join(' ')}
            />
            
            {/* Data points */}
            {lineData.map((d, i) => (
              <g key={i}>
                <circle cx={10 + i * 15} cy={55 - (d.grants / maxGrants) * 40} r="2" fill="#3b82f6" />
                <circle cx={10 + i * 15} cy={55 - (d.lives / maxLives) * 40} r="2" fill="#10b981" />
              </g>
            ))}
            
            <defs>
              <linearGradient id="grantsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="livesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
            {lineData.map((d) => (
              <span key={d.year}>{d.year}</span>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">Total Grants</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Lives Impacted</span>
          </div>
        </div>
      </div>

      {/* Donut Charts */}
      <div className="space-y-6">
        {/* Focus Areas */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Focus Area Distribution</h3>
          <div className="flex items-center space-x-6">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                {focusAreas.map((area, index) => {
                  const offset = focusAreas.slice(0, index).reduce((sum, a) => sum + a.value, 0);
                  const circumference = 2 * Math.PI * 15.91549430918954;
                  const strokeDasharray = `${(area.value / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((offset / 100) * circumference);
                  
                  return (
                    <circle
                      key={area.name}
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke={`url(#${area.name.replace(' ', '')}Gradient)`}
                      strokeWidth="3"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 hover:stroke-width-4"
                    />
                  );
                })}
                <defs>
                  {focusAreas.map((area) => (
                    <linearGradient key={area.name} id={`${area.name.replace(' ', '')}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={area.color.split(' ')[1]} />
                      <stop offset="100%" stopColor={area.color.split(' ')[3]} />
                    </linearGradient>
                  ))}
                </defs>
              </svg>
            </div>
            <div className="space-y-2">
              {focusAreas.map((area) => (
                <div key={area.name} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${area.color}`}></div>
                  <span className="text-sm text-gray-600">{area.name}</span>
                  <span className="text-sm font-medium text-gray-800">{area.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Pillars */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Strategic Pillar Distribution</h3>
          <div className="flex items-center space-x-6">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                {strategicPillars.map((pillar, index) => {
                  const offset = strategicPillars.slice(0, index).reduce((sum, p) => sum + p.value, 0);
                  const circumference = 2 * Math.PI * 15.91549430918954;
                  const strokeDasharray = `${(pillar.value / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((offset / 100) * circumference);
                  
                  return (
                    <circle
                      key={pillar.name}
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke={`url(#${pillar.name}Gradient)`}
                      strokeWidth="3"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 hover:stroke-width-4"
                    />
                  );
                })}
                <defs>
                  {strategicPillars.map((pillar) => (
                    <linearGradient key={pillar.name} id={`${pillar.name}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={pillar.color.split(' ')[1]} />
                      <stop offset="100%" stopColor={pillar.color.split(' ')[3]} />
                    </linearGradient>
                  ))}
                </defs>
              </svg>
            </div>
            <div className="space-y-2">
              {strategicPillars.map((pillar) => (
                <div key={pillar.name} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${pillar.color}`}></div>
                  <span className="text-sm text-gray-600">{pillar.name}</span>
                  <span className="text-sm font-medium text-gray-800">{pillar.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;