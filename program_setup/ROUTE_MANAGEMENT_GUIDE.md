# Route Management System - Implementation Guide

## Overview
The shuttle management system has been updated to support multiple routes per vehicle with comprehensive route tracking and display.

## Backend Implementation

### 1. Route Model (`backend_api/models.py`)
```python
class Route(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='routes')
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    distance_km = models.FloatField()
    estimated_time_minutes = models.IntegerField()
    order = models.IntegerField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### 2. Vehicle Model Updates (`backend_api/models.py`)
```python
class Vehicle(models.Model):
    # ... existing fields ...
    current_route_index = models.IntegerField(default=0)
    status = models.BooleanField(default=True)
    
    def get_next_route(self):
        """Get the next uncompleted route in sequence"""
        try:
            return self.routes.filter(is_completed=False).order_by('order').first()
        except:
            return None
```

### 3. API Endpoints (`backend_api/views.py`)

#### Add Route to Vehicle
- **Endpoint**: `POST /api/backend/vehicles/{id}/add_route/`
- **Body**:
  ```json
  {
    "origin": "Main Gate",
    "destination": "Campus Hall",
    "distance_km": 2.5,
    "estimated_time_minutes": 15
  }
  ```
- **Response**: Created Route object

#### Get Routes for Vehicle
- **Endpoint**: `GET /api/backend/vehicles/{id}/routes/`
- **Response**: Array of Route objects ordered by sequence

#### Advance to Next Route
- **Endpoint**: `POST /api/backend/vehicles/{id}/advance_route/`
- **Response**: Updated Vehicle object with new current_route_index

## Frontend Implementation

### 1. API Service Methods (`src/services/apiService.ts`)

#### New Interfaces
```typescript
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
  // ... existing fields ...
  current_route_index: number;
  status: boolean;
  routes: Route[];
  next_route: Route | null;
}
```

#### New Methods
```typescript
// Add a route to a vehicle
async addRoute(vehicleId: number, routeData: Partial<Route>)

// Get all routes for a vehicle
async getRoutes(vehicleId: number): Promise<Route[]>

// Advance to the next route
async advanceRoute(vehicleId: number)
```

### 2. Shuttle Context Updates (`src/ShuttleContext.tsx`)

```typescript
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
```

### 3. Admin Shuttle Management (`src/AdminShuttleManagement.tsx`)

#### Features:
- **Add Shuttle**: Create new vehicles with type and model
- **Add Route**: Add routes to existing vehicles
- **Route Display**: Show number of routes per vehicle
- **Advance Route**: Move shuttle to next route with "Next" button
- **Route Info**: Display origin, destination, distance, and estimated time

#### UI Components:
- **Add Shuttle Modal**: Form for vehicle creation
- **Add Route Modal**: Form for route management
  - Origin input
  - Destination input
  - Distance in km
  - Estimated time in minutes
- **Actions Column**: Buttons for adding routes and advancing

### 4. Live Map Updates (`src/components/LiveMap.tsx`)

#### Displays:
- Shuttle locations
- Status (Active/Inactive)
- **Next Route Information**:
  - Origin → Destination
  - Estimated time
  - Distance
- Landmarks on Babcock campus

## Workflow

### Creating a Shuttle with Routes

1. **Click "Add Shuttle"** in Admin Shuttle Management
2. **Fill in details**:
   - Color
   - Vehicle Type
   - Driver Name
   - Plate Number
   - Model
3. **Click "Save"** to create vehicle
4. **Click "+ Route"** button on the created shuttle
5. **Fill in route details**:
   - Origin (starting point)
   - Destination (ending point)
   - Distance in km
   - Estimated time in minutes
6. **Click "Add Route"** to save
7. **Repeat steps 4-6** for additional routes

### Viewing Route Information

- **Admin Dashboard**: Shuttle Management table shows route count
- **Live Map**: Displays next route info for each active shuttle
- **Route Display Format**: "Origin → Destination, ~X min (X km)"

### Advancing Routes

1. **Locate shuttle** in Live Map or Admin Management
2. **Click "Next" button** when shuttle completes current route
3. **System updates**:
   - Marks current route as completed
   - Increments current_route_index
   - Updates next_route display
   - Map updates automatically

## Testing the System

### API Testing

```bash
# Test route creation
curl -X POST http://localhost:8000/api/backend/vehicles/1/add_route/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Main Gate",
    "destination": "Campus Hall",
    "distance_km": 2.5,
    "estimated_time_minutes": 15
  }'

# Test route retrieval
curl http://localhost:8000/api/backend/vehicles/1/routes/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test route advancement
curl -X POST http://localhost:8000/api/backend/vehicles/1/advance_route/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Testing

1. **Login** to admin dashboard
2. **Navigate** to Shuttle Management
3. **Create** a new shuttle
4. **Add** multiple routes to the shuttle
5. **Verify** routes display in the routes column
6. **View** Live Map to see next route info
7. **Click "Next"** to advance routes
8. **Verify** next_route field updates

## Key Features

✅ Multiple routes per vehicle
✅ Route ordering and sequencing
✅ Completion tracking
✅ Next route calculation
✅ Distance and time estimation
✅ Live map display
✅ Admin management interface
✅ Full API integration

## Integration Points

- **Frontend ↔ Backend**: All via `/api/` prefix
- **JWT Authentication**: Required for all route operations
- **Real-time Updates**: Map displays latest route info
- **Database**: Routes stored with vehicle references and ordering

## Notes

- Routes are ordered by the `order` field automatically
- Each route tracks completion status
- Next route is calculated from incomplete routes
- Distance and time are configurable per route
- System supports unlimited routes per vehicle
