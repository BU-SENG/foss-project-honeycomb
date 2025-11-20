import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { apiService, Vehicle, Route } from './services/apiService';

export interface Shuttle {
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

interface ShuttleContextType {
  shuttles: Shuttle[];
  setShuttles: (shuttles: Shuttle[] | ((prev: Shuttle[]) => Shuttle[])) => void;
  loading: boolean;
  error: string | null;
}

export const ShuttleContext = createContext<ShuttleContextType | undefined>(undefined);

export const ShuttleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shuttles, setShuttlesState] = React.useState<Shuttle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch shuttles from backend on mount
  useEffect(() => {
    const fetchShuttles = async () => {
      try {
        setLoading(true);
        const vehicles = await apiService.getVehicles();
        
        // Transform Vehicle objects to Shuttle objects
        const transformedShuttles: Shuttle[] = vehicles.map((vehicle: Vehicle) => ({
          id: vehicle.id,
          status: vehicle.status,
          color: vehicle.color,
          driver: vehicle.driver_name,
          plate: vehicle.plate_number,
          vehicleType: vehicle.vehicle_type,
          model: vehicle.model,
          routes: vehicle.routes || [],
          currentRouteIndex: vehicle.current_route_index || 0,
          nextRoute: vehicle.next_route || null
        }));

        setShuttlesState(transformedShuttles);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch shuttles:', err);
        setError('Failed to load shuttles');
        // Fallback to dummy data if API fails
        const colors = ['White', 'Blue', 'Green', 'Yellow', 'Black', 'Silver', 'Red', 'Orange'];
        setShuttlesState(
          Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            status: i % 2 === 0,
            color: colors[Math.floor(Math.random() * colors.length)],
            driver: `Driver ${i + 1}`,
            plate: `PLATE-${i + 1}`,
            vehicleType: 'Bus',
            model: 'Model X',
            routes: [],
            currentRouteIndex: 0,
            nextRoute: null
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShuttles();
  }, []);

  const setShuttles = (value: Shuttle[] | ((prev: Shuttle[]) => Shuttle[])) => {
    if (typeof value === 'function') {
      setShuttlesState(value);
    } else {
      setShuttlesState(value);
    }
  };

  return (
    <ShuttleContext.Provider value={{ shuttles, setShuttles, loading, error }}>
      {children}
    </ShuttleContext.Provider>
  );
};

export const useShuttles = () => {
  const context = React.useContext(ShuttleContext);
  if (!context) {
    throw new Error('useShuttles must be used within ShuttleProvider');
  }
  return context;
};
