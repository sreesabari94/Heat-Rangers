import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import WorldMap from './components/WorldMap';
import Charts from './components/Charts';
import ActivityFeed from './components/ActivityFeed';
import Footer from './components/Footer';
import GrantsPage from './components/GrantsPage';
import LivesImpactedPage from './components/LivesImpactedPage';
import TreesPlantedPage from './components/TreesPlantedPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'grants':
        return <GrantsPage />;
      case 'lives-impacted':
        return <LivesImpactedPage />;
      case 'trees-planted':
        return <TreesPlantedPage />;
      default:
        return (
          <>
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Monitor your grant impact and organizational performance</p>
            </div>

            {/* KPI Cards */}
            <KPICards />

            {/* World Map */}
            <WorldMap />

            {/* Charts */}
            <Charts />

            {/* Activity Feed */}
            <ActivityFeed />
          </>
        );
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className={`transition-all duration-300 pt-20 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-6 space-y-8">
          {renderContent()}
        </div>
        
        <Footer />
      </main>
    </div>
  );
}

export default App;