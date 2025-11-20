// API Service for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Route {
  id: number;
  origin: string;
  destination: string;
  distance_km: number;
  estimated_time_minutes: number;
  order: number;
  is_completed: boolean;
}

export interface Vehicle {
  id: number;
  vehicle_type: string;
  model: string;
  color: string;
  driver_name: string;
  plate_number: string;
  current_route_index: number;
  status: boolean;
  routes: Route[];
  next_route: Route | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: number;
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  phone_number: string;
  bio: string;
}

class APIService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('access_token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // AUTH ENDPOINTS
  async signup(username: string, email: string, password: string, phone_number: string) {
    const response = await fetch(`${API_BASE_URL}/api/signup/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        username,
        email,
        password,
        phone_number,
        bio: ''
      })
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return response.json();
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.setToken(data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  }

  // PROFILE ENDPOINTS
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/profile/`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async updateProfile(phone_number: string, bio: string) {
    const response = await fetch(`${API_BASE_URL}/api/profile/`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ phone_number, bio })
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  // VEHICLE ENDPOINTS
  async getVehicles(): Promise<Vehicle[]> {
    const response = await fetch(`${API_BASE_URL}/api/backend/vehicles/`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }

    return response.json();
  }

  async createVehicle(vehicleData: Partial<Vehicle>) {
    const response = await fetch(`${API_BASE_URL}/api/backend/vehicles/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(vehicleData)
    });

    if (!response.ok) {
      throw new Error('Failed to create vehicle');
    }

    return response.json();
  }

  async updateVehicle(id: number, vehicleData: Partial<Vehicle>) {
    const response = await fetch(`${API_BASE_URL}/api/backend/vehicles/${id}/`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(vehicleData)
    });

    if (!response.ok) {
      throw new Error('Failed to update vehicle');
    }

    return response.json();
  }

  async deleteVehicle(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/backend/vehicles/${id}/`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete vehicle');
    }
  }

  // ROUTE ENDPOINTS
  async addRoute(vehicleId: number, routeData: Partial<Route>) {
    const response = await fetch(`${API_BASE_URL}/api/backend/vehicles/${vehicleId}/add_route/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(routeData)
    });

    if (!response.ok) {
      throw new Error('Failed to add route');
    }

    return response.json();
  }

  async getRoutes(vehicleId: number): Promise<Route[]> {
    const response = await fetch(`${API_BASE_URL}/api/backend/vehicles/${vehicleId}/routes/`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch routes');
    }

    return response.json();
  }

  async advanceRoute(vehicleId: number) {
    const response = await fetch(`${API_BASE_URL}/api/backend/vehicles/${vehicleId}/advance_route/`, {
      method: 'POST',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to advance route');
    }

    return response.json();
  }
}

export const apiService = new APIService();

