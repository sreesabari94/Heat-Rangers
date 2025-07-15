import React from 'react';
import { Calendar, Building, DollarSign, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const recentGrants = [
    {
      id: 'G-2024-001',
      org: 'Clean Water Initiative',
      amount: '$45,000',
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: 'G-2024-002',
      org: 'Rural Education Foundation',
      amount: '$32,500',
      date: '2024-01-14',
      status: 'processing'
    },
    {
      id: 'G-2024-003',
      org: 'Healthcare Access Project',
      amount: '$67,800',
      date: '2024-01-13',
      status: 'approved'
    },
    {
      id: 'G-2024-004',
      org: 'Digital Literacy Program',
      amount: '$28,900',
      date: '2024-01-12',
      status: 'approved'
    },
    {
      id: 'G-2024-005',
      org: 'Climate Action Network',
      amount: '$54,200',
      date: '2024-01-11',
      status: 'under review'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'under review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Grants Table */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Grants Issued</h3>
        
        <div className="space-y-4">
          {recentGrants.map((grant) => (
            <div key={grant.id} className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-gray-200/30 hover:bg-white/60 transition-all">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{grant.org}</div>
                  <div className="text-sm text-gray-600">{grant.id}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-800">{grant.amount}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {grant.date}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grant.status)}`}>
                  {grant.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View All Grants
        </button>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200/50 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">AI-Driven Insights</h3>
        </div>
        
        <div className="space-y-6">
          {/* Main Insight */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/50">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Impact Exceeded Expectations</h4>
                <p className="text-gray-700 text-sm mb-3">
                  This year, we exceeded our planned impact by <span className="font-bold text-green-600">18%</span>, 
                  reaching 124K lives compared to our target of 105K. Clean water initiatives 
                  showed the highest efficiency with a 4.2x ROI.
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <span>Confidence: 94%</span>
                  <span>•</span>
                  <span>Updated 2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Predictions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/50">
            <h4 className="font-semibold text-gray-800 mb-3">What's Next</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Q2 2024 projected to show 22% growth in rural education grants</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Climate action funding likely to increase by 35% next quarter</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>New partnership opportunities identified in Southeast Asia</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2">
            <span>View Full Predictions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;