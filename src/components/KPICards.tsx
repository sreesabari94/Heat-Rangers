import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Heart, TreePine, FolderOpen } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  trend: number[];
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, trend, icon, color }) => {
  const isPositive = change > 0;
  const maxTrend = Math.max(...trend);
  const minTrend = Math.min(...trend);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        
        {/* Mini Sparkline */}
        <div className="h-12 flex items-end space-x-1">
          {trend.map((point, index) => {
            const height = ((point - minTrend) / (maxTrend - minTrend)) * 100;
            return (
              <div
                key={index}
                className={`w-2 rounded-t transition-all hover:opacity-80 bg-gradient-to-t ${color}`}
                style={{ height: `${Math.max(height, 10)}%` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const KPICards: React.FC = () => {
  const kpis = [
    {
      title: 'Total Grants Paid',
      value: '$2.4M',
      change: 12.5,
      trend: [40, 45, 52, 48, 65, 59, 72, 68, 75, 82, 78, 85],
      icon: <DollarSign className="w-5 h-5 text-white" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Lives Impacted',
      value: '124K',
      change: 18.2,
      trend: [30, 35, 42, 38, 55, 48, 62, 58, 65, 70, 68, 75],
      icon: <Heart className="w-5 h-5 text-white" />,
      color: 'from-red-500 to-pink-600'
    },
    {
      title: 'Trees Planted',
      value: '89.2K',
      change: 24.1,
      trend: [25, 30, 35, 32, 45, 42, 55, 52, 58, 65, 62, 68],
      icon: <TreePine className="w-5 h-5 text-white" />,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Active Projects',
      value: '156',
      change: -2.1,
      trend: [60, 65, 58, 62, 55, 58, 52, 55, 50, 48, 52, 45],
      icon: <FolderOpen className="w-5 h-5 text-white" />,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};

export default KPICards;