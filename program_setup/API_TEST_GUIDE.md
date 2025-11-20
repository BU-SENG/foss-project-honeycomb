# Admin Frontend API Test Guide

## Test Case 1: User Registration (Signup)
**Endpoint:** `POST http://localhost:8000/api/signup/`

### Test Steps:
1. Open the frontend app at `http://localhost:5173`
2. Click "CREATE ACCOUNT" button
3. Fill in the form with:
   - Username: `testadmin`
   - Email: `testadmin@babcock.edu.ng`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - Phone: `+234-8012345678`
4. Click "SIGN UP"

### Expected Result:
✅ Account created successfully
✅ Modal closes automatically
✅ Success message shown
✅ User data saved in Django database

---

## Test Case 2: User Login
**Endpoint:** `POST http://localhost:8000/api/login/`

### Test Steps:
1. On login screen, enter:
   - Username: `testadmin`
   - Password: `TestPass123!`
2. Click "LOGIN" button

### Expected Result:
✅ JWT token received and stored in localStorage
✅ Redirected to Admin Dashboard
✅ User session maintained
✅ Access token used for subsequent API calls

---

## Test Case 3: View Live Map with Shuttles
**Endpoint:** `GET http://localhost:8000/api/backend/vehicles/`

### Test Steps:
1. After login, navigate to "Live Map" tab
2. Observe the map loading
3. Check the legend showing active shuttles

### Expected Result:
✅ Map loads with Babcock University image background
✅ Landmarks displayed on map (halls, facilities)
✅ Shuttles displayed as animated markers
✅ Shuttles move intelligently between landmarks
✅ Legend shows all shuttles with their status

---

## Test Case 4: Admin Shuttle Management
**Endpoint:** `POST http://localhost:8000/api/backend/vehicles/` (Create)

### Test Steps:
1. Click on "Admin Dashboard" tab
2. Click "Add New Shuttle" button
3. Fill in the form:
   - Vehicle Type: `Bus`
   - Model: `Hibisco AC 35`
   - Color: `Blue`
   - Driver Name: `John Driver`
   - Plate Number: `BABTEC-001`
4. Click "Add Shuttle"

### Expected Result:
✅ Shuttle created in database
✅ Shuttle appears in the vehicles list immediately
✅ Shuttle appears on live map with correct color
✅ Success notification displayed

---

## Test Case 5: View User Profile
**Endpoint:** `GET http://localhost:8000/api/profile/`

### Test Steps:
1. Click on "Settings & Configurations" tab
2. View profile section

### Expected Result:
✅ User profile loaded
✅ Username, email, phone displayed
✅ Profile information matches signup data

---

## Setup Instructions to Run Tests

### 1. Start Django Backend
```bash
cd c:\Users\hp\Downloads\project\backend
python manage.py runserver
```
Backend runs on: `http://localhost:8000`

### 2. Start React Frontend (in a new terminal)
```bash
cd c:\Users\hp\Downloads\project
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 3. Open Browser
Navigate to: `http://localhost:5173`

---

## API Endpoints Summary

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| POST | `/api/signup/` | Create new account | ❌ No |
| POST | `/api/login/` | User login, get JWT | ❌ No |
| GET | `/api/profile/` | Get user profile | ✅ Yes |
| PUT | `/api/profile/` | Update user profile | ✅ Yes |
| GET | `/api/backend/vehicles/` | List all shuttles | ✅ Yes |
| POST | `/api/backend/vehicles/` | Create shuttle | ✅ Yes |
| PUT | `/api/backend/vehicles/{id}/` | Update shuttle | ✅ Yes |
| DELETE | `/api/backend/vehicles/{id}/` | Delete shuttle | ✅ Yes |

---

## Testing Checklist

- [ ] Test Case 1: Signup - Create account successfully
- [ ] Test Case 2: Login - Login with correct credentials
- [ ] Test Case 3: Live Map - View map and shuttles
- [ ] Test Case 4: Admin Management - Create new shuttle
- [ ] Test Case 5: Profile - View user profile
- [ ] Verify JWT token storage in localStorage
- [ ] Verify CORS headers are correct
- [ ] Verify database persistence (data saved after refresh)
- [ ] Verify error handling for invalid credentials
- [ ] Verify loading states during API calls

---

## Troubleshooting

### Issue: "Failed to fetch" error
**Solution:**
1. Ensure Django backend is running on port 8000
2. Check CORS settings in `backend/settings.py`
3. Verify API_BASE_URL in `.env` is `http://localhost:8000`

### Issue: Login fails with valid credentials
**Solution:**
1. Confirm user exists in Django admin: `http://localhost:8000/admin`
2. Check database connection
3. Verify JWT secret key in settings

### Issue: Shuttles not showing on map
**Solution:**
1. Verify vehicles exist in database
2. Check browser console for fetch errors
3. Ensure authentication token is valid

### Issue: Map image not loading
**Solution:**
1. Check internet connection (image is from external URL)
2. Try refreshing the page
3. Check browser console for CORS errors

---

## Success Criteria

All tests pass when:
1. ✅ User can create an account
2. ✅ User can login with correct credentials
3. ✅ Live map displays with shuttles moving
4. ✅ Admin can create/update/delete shuttles
5. ✅ All data persists in database
6. ✅ JWT authentication works for protected endpoints
7. ✅ Error messages display for invalid inputs
8. ✅ No CORS errors in console

