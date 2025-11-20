import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useShuttles } from './ShuttleContext';

interface AdminShuttleManagementProps {
  onLogout: () => void;
}

const AdminShuttleManagement: React.FC<AdminShuttleManagementProps> = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { shuttles, setShuttles } = useShuttles();

  interface Shuttle {
    id: number;
    status: boolean;
    color: string;
    driver: string;
    plate: string;
    routes: string;
  }

  const colors = ['White', 'Blue', 'Green', 'Yellow', 'Black', 'Silver', 'Red', 'Orange'];

  const [showAddModal, setShowAddModal] = useState(false);
  const [newShuttle, setNewShuttle] = useState<Partial<Shuttle>>({
    color: '',
    driver: '',
    plate: '',
    routes: ''
  });

  const filteredShuttles = shuttles.filter(shuttle =>
    shuttle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shuttle.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 md:ml-[220px] pt-[60px] overflow-auto">
        <Header title="Shuttle Management." onLogout={onLogout} />

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mt-4 md:mt-6 m-4 md:m-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-1 sm:w-auto sm:flex-none sm:w-80">
              <span className="px-3 py-2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search for Shuttle"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border-none outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            <button
              className="bg-purple-600 text-white border-none rounded-full px-4 py-2 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              onClick={() => setShowAddModal(true)}
            >
              ➕ <span className="hidden sm:inline">Add Shuttle</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left px-3 md:px-4 py-3">S/N</th>
                  <th className="text-left px-3 md:px-4 py-3">Plate Number</th>
                  <th className="text-left px-3 md:px-4 py-3">Status</th>
                  <th className="text-left px-3 md:px-4 py-3 hidden sm:table-cell">Color</th>
                  <th className="text-left px-3 md:px-4 py-3">Driver Name</th>
                  <th className="text-left px-3 md:px-4 py-3 hidden md:table-cell">Routes</th>
                </tr>
              </thead>
              <tbody>
                {filteredShuttles.map((shuttle) => (
                  <tr key={shuttle.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-3 md:px-4 py-3">{shuttle.id}</td>
                    <td className="px-3 md:px-4 py-3">{shuttle.plate}</td>
                    <td className="px-3 md:px-4 py-3">
                      <button
                        onClick={() => {
                          setShuttles((prev: Shuttle[]) => prev.map((s: Shuttle) => s.id === shuttle.id ? { ...s, status: !s.status } : s));
                        }}
                        className={`px-3 py-1 rounded-full border-none cursor-pointer text-white text-xs md:text-sm whitespace-nowrap ${
                          shuttle.status ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {shuttle.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-3 md:px-4 py-3 hidden sm:table-cell text-xs md:text-sm">{shuttle.color}</td>
                    <td className="px-3 md:px-4 py-3 text-xs md:text-sm">{shuttle.driver}</td>
                    <td className="px-3 md:px-4 py-3 hidden md:table-cell text-xs md:text-sm">{shuttle.routes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Shuttle Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md md:max-w-lg">
              <h3 className="m-0 mb-4 text-lg font-bold">Add Shuttle</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Color</label>
                  <input 
                    value={newShuttle.color || ''} 
                    onChange={(e) => setNewShuttle(prev => ({ ...prev, color: e.target.value }))} 
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium">Driver Name</label>
                  <input 
                    value={newShuttle.driver || ''} 
                    onChange={(e) => setNewShuttle(prev => ({ ...prev, driver: e.target.value }))} 
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Plate Number</label>
                  <input 
                    value={newShuttle.plate || ''} 
                    onChange={(e) => setNewShuttle(prev => ({ ...prev, plate: e.target.value }))} 
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Routes</label>
                  <input 
                    value={newShuttle.routes || ''} 
                    onChange={(e) => setNewShuttle(prev => ({ ...prev, routes: e.target.value }))} 
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newShuttle.driver || !newShuttle.plate) {
                      return alert('Please provide at least driver name and plate number');
                    }

                    setShuttles((prev: Shuttle[]) => {
                      const nextId = prev.length ? Math.max(...prev.map((s: Shuttle) => s.id)) + 1 : 1;
                      const shuttleToAdd: Shuttle = {
                        id: nextId,
                        status: true,
                        color: newShuttle.color || colors[Math.floor(Math.random() * colors.length)],
                        driver: newShuttle.driver || 'Unknown',
                        plate: newShuttle.plate || 'Unknown',
                        routes: newShuttle.routes || ''
                      };

                      return [...prev, shuttleToAdd];
                    });

                    setNewShuttle({ color: '', driver: '', plate: '', routes: '' });
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 rounded-md border-none bg-purple-600 text-white hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShuttleManagement;