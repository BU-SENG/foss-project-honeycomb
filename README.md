# CampusGo — Campus Shuttle Management System

A full-stack campus shuttle management system with a React + TypeScript frontend and Django backend. Admins can manage shuttles; students can view shuttle availability and live tracking.

## Features

- **Authentication**: JWT-based login/signup with role-based access (admin/user)
- **Admin Dashboard**: Manage shuttles (add, edit status), view live tracking
- **User Dashboard**: View available shuttles, real-time location tracking
- **Live Map**: Babcock University map with animated shuttle icons
- **Responsive Design**: Fully mobile-responsive (mobile, tablet, desktop)
- **Backend Integration**: Django REST API for all data operations
- **Settings**: User profile management and password changes

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

## Setup & Installation

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Backend Setup

```bash
# Install Python dependencies
pip install -r requirment.txt

# Run migrations
python manage.py migrate

# Create a superuser (admin)
python manage.py createsuperuser

# Start Django dev server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`.

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

## Authentication Flow

1. **Sign Up**: User creates account → API creates `User` + `profile` record
2. **Login**: Credentials validated → JWT tokens returned
3. **Access**: Frontend stores JWT in `localStorage`, sends in `Authorization: Bearer <token>` header
4. **Role Check**: `email.includes('admin')` determines user role

## Frontend Services

### API Service (`src/services/apiService.ts`)

Centralized service for all backend calls:

```typescript
import { apiService } from './services/apiService';

// Auth
await apiService.login(email, password);
await apiService.signup(username, email, password, phone);

// Profile
const profile = await apiService.getProfile();
await apiService.updateProfile(phone, bio);

// Vehicles
const vehicles = await apiService.getVehicles();
await apiService.createVehicle(vehicleData);
await apiService.updateVehicle(id, vehicleData);
await apiService.deleteVehicle(id);
```

### ShuttleContext (`src/ShuttleContext.tsx`)

Global state for shuttle data:

```typescript
import { useShuttles } from './ShuttleContext';

const { shuttles, setShuttles, loading, error } = useShuttles();
```

## Running the Project

### Development Mode

**Terminal 1 — Backend**:
```bash
cd project
python manage.py runserver
```

**Terminal 2 — Frontend**:
```bash
cd project
npm run dev
```

### Test Accounts

- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`

(Create via signup or Django admin)

## Build for Production

### Frontend
```bash
npm run build
npm run preview  # Preview production build
```

### Backend
```bash
python manage.py collectstatic
# Deploy to production server (e.g., Gunicorn + Nginx)
```

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

## Scripts

### Frontend

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript check
```

### Backend

```bash
python manage.py runserver        # Start dev server
python manage.py migrate          # Apply migrations
python manage.py makemigrations   # Create migrations
python manage.py createsuperuser  # Create admin user
python manage.py shell            # Interactive shell
```

## Key Features Breakdown

### Live Map
- Displays Babcock University map background
- Animated shuttle icons moving across the map
- Real-time position updates
- Click shuttle for details

### Admin Features
- **Shuttle Management**: Add, edit, delete shuttles
- **Status Toggle**: Mark shuttles as active/inactive
- **Search**: Filter shuttles by driver or plate number
- **Dashboard**: Overview of all active shuttles

### User Features
- **View Shuttles**: See all available shuttles
- **Estimated Time**: ETA display for each shuttle
- **Route Info**: See shuttle routes/destinations
- **Live Tracking**: Real-time position on map

### Settings
- **Profile**: Edit name, email, phone
- **Password**: Change account password
- **Persistence**: Changes saved to backend

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

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT (see LICENSE file if present)

## Support

For issues, questions, or feature requests, open an issue in the repository.

---

**Last Updated**: November 2025Build for production:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Linting and type-checking

Run ESLint across the codebase:

```powershell
npm run lint
```

Run TypeScript type-check only (no emit):

```powershell
npm run typecheck
```

## Environment variables

If the app requires secrets or API URLs, add a `.env` file at the project root (do NOT commit secrets). Common names:

- `.env` — general env
- `.env.local` — local overrides (ignored in many setups)

Example `.env` entries (do not commit):

```
VITE_API_URL=https://api.example.com
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_KEY=public-anon-key
```

Note: Vite exposes env variables prefixed with `VITE_` to the client.

## Development tips

- Editor: VS Code is recommended. Helpful extensions: ESLint, Prettier, Tailwind CSS IntelliSense, TypeScript Hero.
- If Tailwind utilities don't apply, ensure `index.css` imports the Tailwind base, components, and utilities and that `tailwind.config.js` includes the correct `content` globs.
- If you change TypeScript config or plugins, restart the TypeScript server in your editor.

## Commit & PR guidelines

- Keep changes small and focused.
- Run `npm run lint` and `npm run typecheck` locally before opening a PR.
- Describe the change, include screenshots for UI changes, and link any related issue.

## Quality gates (quick checklist)

Before merging a PR, prefer to verify these locally:

- Build: `npm run build` — should complete without errors.
- Lint: `npm run lint` — fix ESLint issues.
- Types: `npm run typecheck` — no new type errors.

If any of these fail on CI, reproduce locally and fix before merging.

## Troubleshooting

- Node version mismatch: use nvm/Volta to match the recommended Node LTS.
- Port in use: Vite will choose another port, or run `npx kill-port 5173` (or use a different port with `--port`).
- Missing env keys: verify `.env` is present and contains required `VITE_` variables.
- Tailwind not compiling: check `postcss.config.js` and ensure `tailwindcss` is installed and up-to-date.

## Useful commands summary

```powershell
# Install deps
npm install

# Dev
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Typecheck
npm run typecheck
```

## Where to go next

- Explore `src/` and `components/` to understand the app structure.
- Look at `vite.config.ts` for aliases and plugin configurations.
- Check `tailwind.config.js` for design tokens and customizations.

---

If you'd like, I can also add a `.github/` PR template, a small CONTRIBUTING.md, or a `.vscode/extensions.json` with recommended extensions. Tell me which of those you'd like and I can add them.

<!-- End of README -->
