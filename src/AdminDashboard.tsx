import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LiveMap from './components/LiveMap';
import { useShuttles } from './ShuttleContext';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { shuttles } = useShuttles();
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 md:ml-[220px] pt-[60px] overflow-auto">
        <Header title="Hello, Admin." onLogout={onLogout} />

        <div className="p-4 md:p-6 mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Live Map */}
          <div className="lg:col-span-3 border border-gray-300 rounded-lg p-4 md:p-6 bg-white h-[300px] md:h-[500px] relative">
            <LiveMap />
          </div>

          {/* Active Shuttles */}
          <div className="lg:col-span-1 w-full bg-white rounded-lg p-4 md:p-6 shadow-sm h-[300px] md:h-[500px] overflow-y-auto">
            <h3 className="font-bold mb-4">Active Shuttles</h3>
            {shuttles.filter(s => s.status).length > 0 ? (
              shuttles.filter(s => s.status).map((shuttle) => (
                <div key={shuttle.id} className="border border-gray-300 rounded-lg p-3 mb-3 bg-blue-50">
                  <div className="text-sm">
                    <strong className="block text-blue-900">Shuttle {String(shuttle.id).padStart(3, '0')}</strong>
                    <span className="text-xs text-gray-600">Plate: {shuttle.plate}</span><br />
                    {shuttle.nextRoute && (
                      <>
                        <span className="text-xs text-blue-700 font-semibold block mt-2">Next Route:</span>
                        <span className="text-xs text-gray-700">{shuttle.nextRoute.origin} → {shuttle.nextRoute.destination}</span><br />
                        <span className="text-xs text-green-600">ETA: ~{shuttle.nextRoute.estimated_time_minutes} min</span>
                      </>
                    )}
                    {!shuttle.nextRoute && (
                      <span className="text-xs text-gray-500 italic">No active route</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No active shuttles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;