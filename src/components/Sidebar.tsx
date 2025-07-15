import React from 'react';
import { Home, BarChart3, Globe, Users, TreePine, Brain, ChevronLeft, HeartPulse } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'grants-old', label: 'Analytics', icon: BarChart3 },
    { id: 'geography', label: 'Geography', icon: Globe },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'grants', label: 'Grants', icon: BarChart3 },
    { id: 'lives-impacted', label: 'Lives Impacted', icon: HeartPulse },
    { id: 'trees-planted', label: 'Trees Planted', icon: TreePine },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} bg-white/80 backdrop-blur-md border-r border-gray-200/20 shadow-sm pt-20`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg hover:bg-gray-100/50 transition-all ${!isOpen ? 'rotate-180' : ''}`}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-green-500/10 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-800'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'} whitespace-nowrap font-medium`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/20">
          <div className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-xs text-gray-500 text-center">
              © 2025 GrantFlow v1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;