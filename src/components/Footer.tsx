import React from 'react';
import { HelpCircle, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/40 backdrop-blur-sm border-t border-gray-200/30 mt-12">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>© 2025 GrantFlow</span>
            <span>•</span>
            <span>App v1.0</span>
            <span>•</span>
            <span>Data last refreshed: Jan 15, 2025 at 3:24 PM</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span>Help Center</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Live Chat</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;