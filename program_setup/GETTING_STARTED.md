# CampusGo — Campus Shuttle Management System — Getting Started

A full-stack campus shuttle management system with a React + TypeScript frontend and Django backend. Admins can manage shuttles; students can view shuttle availability and live tracking.

## Quick Links

- **Setup Instructions**: See [SETUP.md](./SETUP.md)
- **Project Overview**: See [../README.md](../README.md)
- **Contributing**: See [../CONTRIBUTING.md](../CONTRIBUTING.md)

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1 + PostCSS
- **Icons**: Lucide React 0.344.0
- **Routing**: React Router v7.9.6
- **State Management**: React Context API

### Backend
- **Framework**: Django 5.x
- **API**: Django REST Framework
- **Database**: SQLite (development)
- **Authentication**: JWT (django-rest-framework-simplejwt)

## Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **Python**: 3.10+
- **npm** or **pnpm** or **yarn**

## Project Structure

```
project/
├── src/                          # Frontend React app
│   ├── components/               # Reusable components
│   ├── services/                 # API service layer
│   ├── ShuttleContext.tsx        # Global state management
│   ├── AdminDashboard.tsx        # Admin dashboard
│   ├── UserDashboard.tsx         # User dashboard
│   ├── AdminShuttleManagement.tsx # Shuttle CRUD
│   ├── Login.tsx                 # Authentication
│   └── main.tsx
├── backend_api/                  # Django app for API
│   ├── views.py                  # API endpoints
│   ├── models.py                 # Data models
│   ├── serializer.py             # DRF serializers
│   └── urls.py                   # URL routing
├── manage.py                     # Django CLI
└── vite.config.ts
```

## API Endpoints

All endpoints require JWT authentication (except `/signup/` and `/login/`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup/` | User registration |
| POST | `/login/` | User login (returns JWT) |
| GET | `/profile/` | Get authenticated user profile |
| GET | `/backend/vehicles/` | List all vehicles/shuttles |
| POST | `/backend/vehicles/` | Create a new vehicle |
| PUT | `/backend/vehicles/{id}/` | Update vehicle details |
| DELETE | `/backend/vehicles/{id}/` | Delete vehicle |
| POST | `/backend/vehicles/{id}/add_route/` | Add route to vehicle |
| POST | `/backend/vehicles/{id}/advance_route/` | Move to next route |
| GET | `/backend/vehicles/{id}/routes/` | Get all routes for vehicle |

## Environment Variables

### `.env` (Frontend)
```
VITE_API_URL=http://localhost:8000
```

### `.env` (Backend) — if needed
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Key Scripts

### Frontend

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript check
npm run test:api  # Run API tests
```

### Backend

```bash
python manage.py runserver        # Start dev server
python manage.py migrate          # Apply migrations
python manage.py makemigrations   # Create migrations
python manage.py createsuperuser  # Create admin user
python manage.py shell            # Interactive shell
```

## Common Issues & Solutions

### CORS Errors
**Issue**: Frontend can't reach backend
**Solution**:
1. Ensure backend is running on `http://localhost:8000`
2. Update `.env` `VITE_API_URL` if needed
3. Check `CORS_ALLOWED_ORIGINS` in Django settings

### JWT Token Expired
**Issue**: "Token expired" error
**Solution**: User must log in again. Refresh token support coming soon.

### Shuttle Data Not Loading
**Issue**: Empty dashboard
**Solution**:
1. Create vehicles via Django admin (`/admin/`)
2. Or use "Add Shuttle" button in admin dashboard
3. Check backend console for errors

## Next Steps

1. Read [SETUP.md](./SETUP.md) for detailed installation instructions
2. Start the backend and frontend servers
3. Create test accounts and explore the dashboards
4. Check [../README.md](../README.md) for feature details

---

**Last Updated**: November 2025
