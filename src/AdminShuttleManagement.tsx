import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useShuttles } from './ShuttleContext';
import { apiService, Route } from './services/apiService';

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
    vehicleType: string;
    model: string;
    routes: Route[];
    currentRouteIndex: number;
    nextRoute: Route | null;
  }

  const colors = ['White', 'Blue', 'Green', 'Yellow', 'Black', 'Silver', 'Red', 'Orange'];

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedShuttleId, setSelectedShuttleId] = useState<number | null>(null);
  
  const [newShuttle, setNewShuttle] = useState<Partial<Shuttle>>({
    color: '',
    driver: '',
    plate: '',
    vehicleType: 'car',
    model: 'Shuttle',
    routes: [],
    currentRouteIndex: 0,
    nextRoute: null
  });

  const [newRoute, setNewRoute] = useState({
    origin: '',
    destination: '',
    distance_km: 0,
    estimated_time_minutes: 0
  });

  const [loading, setLoading] = useState(false);

  const filteredShuttles = shuttles.filter(shuttle =>
    shuttle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shuttle.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddShuttle = async () => {
    if (!newShuttle.driver || !newShuttle.plate) {
      alert('Please provide at least driver name and plate number');
      return;
    }

    setLoading(true);
    try {
      const vehicleData = {
        vehicle_type: newShuttle.vehicleType || 'car',
        model: newShuttle.model || 'Shuttle',
        color: newShuttle.color || colors[Math.floor(Math.random() * colors.length)],
        driver_name: newShuttle.driver,
        plate_number: newShuttle.plate
      };

      const createdVehicle = await apiService.createVehicle(vehicleData);

      // Add to local state
      const newItem: Shuttle = {
        id: createdVehicle.id,
        status: true,
        color: createdVehicle.color,
        driver: createdVehicle.driver_name,
        plate: createdVehicle.plate_number,
        vehicleType: createdVehicle.vehicle_type,
        model: createdVehicle.model,
        routes: [],
        currentRouteIndex: 0,
        nextRoute: null
      };

      setShuttles((prev) => [...prev, newItem]);
      setNewShuttle({ color: '', driver: '', plate: '', vehicleType: 'car', model: 'Shuttle', routes: [], currentRouteIndex: 0, nextRoute: null });
      setShowAddModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add shuttle');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoute = async () => {
    if (!selectedShuttleId || !newRoute.origin || !newRoute.destination || newRoute.distance_km <= 0 || newRoute.estimated_time_minutes <= 0) {
      alert('Please fill all route fields with valid values');
      return;
    }

    setLoading(true);
    try {
      const createdRoute = await apiService.addRoute(selectedShuttleId, {
        origin: newRoute.origin,
        destination: newRoute.destination,
        distance_km: newRoute.distance_km,
        estimated_time_minutes: newRoute.estimated_time_minutes
      });

      // Update local shuttle with new route
      setShuttles((prev: Shuttle[]) => prev.map((s: Shuttle) => 
        s.id === selectedShuttleId 
          ? { ...s, routes: [...s.routes, createdRoute] }
          : s
      ));

      setNewRoute({ origin: '', destination: '', distance_km: 0, estimated_time_minutes: 0 });
      setShowRouteModal(false);
      setSelectedShuttleId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add route');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceRoute = async (shuttleId: number) => {
    setLoading(true);
    try {
      const updatedVehicle = await apiService.advanceRoute(shuttleId);

      // Update local state
      setShuttles((prev: Shuttle[]) => prev.map((s: Shuttle) =>
        s.id === shuttleId
          ? {
              ...s,
              currentRouteIndex: updatedVehicle.current_route_index,
              nextRoute: updatedVehicle.next_route
            }
          : s
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to advance route');
    } finally {
      setLoading(false);
    }
  };

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
                  <th className="text-left px-3 md:px-4 py-3">Actions</th>
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
                    <td className="px-3 md:px-4 py-3 hidden md:table-cell text-xs md:text-sm">
                      {shuttle.routes.length > 0 ? `${shuttle.routes.length} routes` : 'No routes'}
                    </td>
                    <td className="px-3 md:px-4 py-3 text-xs md:text-sm">
                      <button
                        onClick={() => {
                          setSelectedShuttleId(shuttle.id);
                          setShowRouteModal(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                      >
                        + Route
                      </button>
                      {shuttle.nextRoute && (
                        <button
                          onClick={() => handleAdvanceRoute(shuttle.id)}
                          disabled={loading}
                          className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs disabled:opacity-50"
                        >
                          Next
                        </button>
                      )}
                    </td>
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
                <div>
                  <label className="block mb-2 font-medium">Vehicle Type</label>
                  <input 
                    value={newShuttle.vehicleType || ''} 
                    onChange={(e) => setNewShuttle(prev => ({ ...prev, vehicleType: e.target.value }))} 
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
                  <label className="block mb-2 font-medium">Model</label>
                  <input 
                    value={newShuttle.model || ''} 
                    onChange={(e) => setNewShuttle(prev => ({ ...prev, model: e.target.value }))} 
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
                  onClick={handleAddShuttle}
                  disabled={loading}
                  className="px-4 py-2 rounded-md border-none bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Route Modal */}
        {showRouteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md md:max-w-lg">
              <h3 className="m-0 mb-4 text-lg font-bold">Add Route</h3>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Origin</label>
                  <input 
                    value={newRoute.origin} 
                    onChange={(e) => setNewRoute(prev => ({ ...prev, origin: e.target.value }))} 
                    placeholder="e.g., Main Gate"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Destination</label>
                  <input 
                    value={newRoute.destination} 
                    onChange={(e) => setNewRoute(prev => ({ ...prev, destination: e.target.value }))} 
                    placeholder="e.g., Campus Hall"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Distance (km)</label>
                  <input 
                    type="number"
                    value={newRoute.distance_km} 
                    onChange={(e) => setNewRoute(prev => ({ ...prev, distance_km: parseFloat(e.target.value) }))} 
                    placeholder="e.g., 2.5"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Estimated Time (minutes)</label>
                  <input 
                    type="number"
                    value={newRoute.estimated_time_minutes} 
                    onChange={(e) => setNewRoute(prev => ({ ...prev, estimated_time_minutes: parseInt(e.target.value) }))} 
                    placeholder="e.g., 15"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => {
                    setShowRouteModal(false);
                    setSelectedShuttleId(null);
                    setNewRoute({ origin: '', destination: '', distance_km: 0, estimated_time_minutes: 0 });
                  }} 
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoute}
                  disabled={loading}
                  className="px-4 py-2 rounded-md border-none bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Route'}
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