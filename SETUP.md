# Setup Instructions

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ (LTS)
- pip and npm installed

### Step 1: Install Backend Dependencies

```bash
pip install -r requirment.txt
```

### Step 2: Initialize Backend Database

```bash
python manage.py migrate
```

### Step 3: Start Backend Server

```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### Step 4: Install Frontend Dependencies

In a new terminal:

```bash
npm install
```

### Step 5: Start Frontend Dev Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## Authentication Flow

### Creating an Account

1. Go to `http://localhost:5173`
2. Click **"Create an account"**
3. Fill in:
   - **Full Name**: Your username (e.g., `john_doe`, `admin_user`)
   - **Email Address**: Your email
   - **Phone Number**: Your phone
   - **Password**: Your password
4. Click **"Create Account"**
5. Success message will appear

### Logging In

1. Use your **username** (Full Name from signup) in the username field
2. Enter your password
3. Click **"LOGIN"**
4. You'll be directed to your dashboard:
   - Usernames with "admin" → Admin Dashboard
   - Other usernames → User Dashboard

### Test Accounts

You can create your own accounts or use Django admin:

```bash
# Create a superuser for Django admin
python manage.py createsuperuser
# Then go to http://localhost:8000/admin
```

---

## Common Issues & Fixes

### Issue: "Failed to fetch" on login/signup

**Solution:**
1. Ensure backend is running: `python manage.py runserver`
2. Check `.env` has `VITE_API_URL=http://localhost:8000`
3. Restart frontend: `npm run dev`

### Issue: "Invalid credentials" after signup

**Solution:**
- Make sure you use the **username** (Full Name) from signup to login
- Not the email address

### Issue: CORS Error in browser console

**Solution:**
- Backend needs `django-cors-headers` installed
- Run: `pip install -r requirment.txt`
- Restart backend: `python manage.py runserver`

### Issue: Database errors

**Solution:**
```bash
# Reset database
python manage.py migrate --fake backend_api 0001
python manage.py migrate
```

---

## Project Structure

```
project/
├── src/                           # Frontend (React)
│   ├── Login.tsx                  # Auth page
│   ├── AdminDashboard.tsx         # Admin view
│   ├── UserDashboard.tsx          # User view
│   ├── AdminShuttleManagement.tsx # Shuttle CRUD
│   ├── services/
│   │   └── apiService.ts          # Backend API calls
│   └── ShuttleContext.tsx         # State management
├── backend/
│   └── settings.py                # Django config
├── backend_api/
│   ├── views.py                   # API endpoints
│   ├── models.py                  # Data models
│   └── urls.py                    # Routes
├── manage.py                      # Django CLI
├── .env                           # Environment variables
└── vite.config.ts
```

---

## API Endpoints

All endpoints (except signup/login) require `Authorization: Bearer <token>` header.

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/signup/` | `{username, email, password, phone_number}` | `{message, user_id}` |
| POST | `/login/` | `{username, password}` | `{access, refresh, user_id}` |
| GET | `/profile/` | - | User profile |
| GET | `/backend/vehicles/` | - | List vehicles |
| POST | `/backend/vehicles/` | Vehicle data | Created vehicle |

---

## Troubleshooting

### Check Backend is Running
```bash
curl http://localhost:8000/login/
```

### Check Frontend can reach Backend
Open browser console (F12) and check:
1. Network tab - look for `/login/` or `/signup/` requests
2. Check response status and error messages

### View Backend Logs
```bash
# In the terminal running the backend server
# Look for error messages or stack traces
```

### Reset Everything
```bash
# Backend
rm db.sqlite3
python manage.py migrate

# Frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Features

✅ User authentication (signup/login)
✅ Role-based dashboards (admin/user)
✅ Shuttle management (CRUD)
✅ Live tracking map
✅ Responsive design (mobile/tablet/desktop)
✅ JWT token-based auth
✅ Error handling with specific messages

---

**Last Updated**: November 2025
