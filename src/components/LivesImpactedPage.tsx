import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Users, TrendingUp } from 'lucide-react';
import { readSheet, GRIData } from '../utils/dataReader';

interface AggregatedData {
  focus_area: string;
  total_lives: number;
  percentage: number;
}

const LivesImpactedPage: React.FC = () => {
  const [data, setData] = useState<GRIData[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const griData = await readSheet<GRIData>('/data/GRI Data 2023 & 2024.xlsx', 'GRI');
        setData(griData);
        
        // Aggregate by focus area
        const aggregated = griData.reduce((acc, item) => {
          const focusArea = item.focus_area || 'Unknown';
          const lives = item.lives_impacted_total || 0;
          
          if (!acc[focusArea]) {
            acc[focusArea] = 0;
          }
          acc[focusArea] += lives;
          
          return acc;
        }, {} as Record<string, number>);
        
        const totalLives = Object.values(aggregated).reduce((sum, val) => sum + val, 0);
        
        const aggregatedArray = Object.entries(aggregated)
          .map(([focus_area, total_lives]) => ({
            focus_area,
            total_lives,
            percentage: totalLives > 0 ? (total_lives / totalLives) * 100 : 0
          }))
          .sort((a, b) => b.total_lives - a.total_lives);
        
        setAggregatedData(aggregatedArray);
      } catch (err) {
        setError('Failed to load lives impacted data');
        console.error('Error loading lives impacted data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalLives = aggregatedData.reduce((sum, item) => sum + item.total_lives, 0);
  const maxLives = Math.max(...aggregatedData.map(item => item.total_lives));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lives Impacted</h1>
        <p className="text-gray-600">Track the human impact of our initiatives across focus areas</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200/50"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Lives</h3>
              <p className="text-3xl font-bold text-red-600">{totalLives.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Focus Areas</h3>
              <p className="text-3xl font-bold text-blue-600">{aggregatedData.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Avg per Area</h3>
              <p className="text-3xl font-bold text-green-600">
                {aggregatedData.length > 0 ? Math.round(totalLives / aggregatedData.length).toLocaleString() : 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Lives Impacted by Focus Area</h3>
        
        <div className="space-y-4">
          {aggregatedData.map((item, index) => (
            <motion.div
              key={item.focus_area}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.focus_area}</span>
                <span className="text-sm text-gray-600">
                  {item.total_lives.toLocaleString()} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.total_lives / maxLives) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Breakdown</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Focus Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lives Impacted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {aggregatedData.map((item, index) => (
                <motion.tr
                  key={item.focus_area}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.focus_area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.total_lives.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.percentage.toFixed(1)}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LivesImpactedPage;