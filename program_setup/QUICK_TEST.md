# Quick Start Guide - API Testing

## 🚀 Quick Test Execution (2 minutes)

### Terminal 1: Start Backend
```powershell
cd c:\Users\hp\Downloads\project\backend
python manage.py runserver
```
Wait for: `Starting development server at http://127.0.0.1:8000/`

### Terminal 2: Start Frontend
```powershell
cd c:\Users\hp\Downloads\project
npm run dev
```
Wait for: `Local: http://localhost:5173`

### Terminal 3: Run API Tests
```powershell
cd c:\Users\hp\Downloads\project
npm run test:api
```

---

## 📋 Test Checklist

After running the tests, verify:

### Signup Test ✅
- [ ] New account created
- [ ] User appears in database

### Login Test ✅
- [ ] JWT token received
- [ ] Token stored in localStorage
- [ ] Redirected to dashboard

### Profile Test ✅
- [ ] User profile loads
- [ ] Email and phone displayed

### Vehicles Test ✅
- [ ] Get all vehicles works
- [ ] Create new shuttle works
- [ ] Update shuttle works
- [ ] Delete shuttle works

### Live Map Test ✅
- [ ] Map displays
- [ ] Shuttles visible
- [ ] Shuttles animate

### Error Handling ✅
- [ ] Invalid credentials rejected
- [ ] Duplicate email rejected
- [ ] Unauthorized access blocked

---

## 🔍 Manual Testing in Browser

1. Open: `http://localhost:5173`
2. Click "CREATE ACCOUNT"
3. Enter:
   - Username: `testuser`
   - Email: `test@babcock.edu.ng`
   - Password: `Test@123`
4. Click "SIGN UP"
5. Enter same credentials to login
6. View "Live Map" tab
7. Go to "Admin Dashboard" to manage shuttles

---

## 📊 Expected Results

All tests should show:
```
✅ PASS: Signup API Call
✅ PASS: Login API Call
✅ PASS: JWT Token Received
✅ PASS: Get Vehicles API Call
✅ PASS: Create Vehicle API Call
✅ PASS: Update Vehicle API Call
✅ PASS: Delete Vehicle API Call
...
Pass Rate: 100.00%
```

---

## 🛠️ Troubleshooting

### "Failed to fetch" error
- Check backend is running on http://localhost:8000
- Check CORS in `backend/settings.py`
- Check `.env` has `VITE_API_URL=http://localhost:8000`

### Port already in use
```powershell
# Kill process using port 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
# Or use different port
python manage.py runserver 8001
```

### Database issues
```bash
python manage.py migrate
python manage.py migrate backend_api
```

---

## 📁 Test Files

- `test-api.js` - Automated API test suite
- `API_TEST_GUIDE.md` - Detailed test cases
- `TEST_REPORT.md` - Full test report
- `.env` - Configuration file

---

**Status:** Ready for Testing ✅
