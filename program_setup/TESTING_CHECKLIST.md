# ✅ TESTING CHECKLIST & QUICK REFERENCE
## Babcock University Shuttle Tracker - Admin Frontend

---

## 🚀 PRE-TESTING CHECKLIST

### Environment Setup
- [ ] Node.js installed
- [ ] Python 3.8+ installed
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Database migrations done (`python manage.py migrate`)
- [ ] `.env` file configured with `VITE_API_URL=http://localhost:8000`

### System Readiness
- [ ] Port 8000 available (Backend)
- [ ] Port 5173 available (Frontend)
- [ ] Internet connection working (for map image)
- [ ] Terminal/PowerShell access available
- [ ] Text editor or IDE available for documentation

---

## 🧪 TESTING EXECUTION CHECKLIST

### Phase 1: Startup (5 minutes)
- [ ] Start Backend: `cd backend && python manage.py runserver`
- [ ] Confirm: "Starting development server at http://127.0.0.1:8000/"
- [ ] Start Frontend: `npm run dev` (new terminal)
- [ ] Confirm: "Local: http://localhost:5173"
- [ ] Test Backend: Open `http://localhost:8000/admin` - Should show Django admin
- [ ] Test Frontend: Open `http://localhost:5173` - Should show login page

### Phase 2: Automated Testing (1 minute)
- [ ] Run: `npm run test:api`
- [ ] Wait for completion
- [ ] Verify: "Pass Rate: 100.00%"
- [ ] Check: 0 failures
- [ ] Document: Save output

### Phase 3: Manual Testing - Signup (5 minutes)
- [ ] Open: `http://localhost:5173`
- [ ] Click: "CREATE ACCOUNT" button
- [ ] Fill form:
  - [ ] Username: `testadmin`
  - [ ] Email: `testadmin@babcock.edu.ng`
  - [ ] Password: `Test@123`
  - [ ] Confirm Password: `Test@123`
  - [ ] Phone: `08012345678`
- [ ] Click: "SIGN UP" button
- [ ] Verify: Modal closes
- [ ] Verify: No error message
- [ ] Check: User in database

### Phase 4: Manual Testing - Login (3 minutes)
- [ ] Refresh page if needed
- [ ] Enter Username: `testadmin`
- [ ] Enter Password: `Test@123`
- [ ] Click: "LOGIN" button
- [ ] Verify: Redirected to Admin Dashboard
- [ ] Verify: Welcome message shows
- [ ] Verify: Token in localStorage (F12 > Storage > LocalStorage)

### Phase 5: Manual Testing - Live Map (3 minutes)
- [ ] Click: "Live Map" tab
- [ ] Wait: Map loads (1-2 seconds)
- [ ] Verify: Map image displays
- [ ] Verify: Landmarks visible (halls, facilities)
- [ ] Verify: Shuttles visible (colored circles)
- [ ] Verify: Shuttles animate
- [ ] Verify: Legend shows shuttles
- [ ] Verify: No console errors (F12 > Console)

### Phase 6: Manual Testing - Admin Dashboard (5 minutes)
- [ ] Click: "Admin Dashboard" tab
- [ ] Verify: Vehicles table displays
- [ ] Count: At least 6 shuttles shown
- [ ] Verify: Columns present (ID, Type, Model, Color, Driver, Plate)
- [ ] Click: "Add New Shuttle" button
- [ ] Fill form:
  - [ ] Vehicle Type: `Bus`
  - [ ] Model: `Hibisco AC 35`
  - [ ] Color: `Blue`
  - [ ] Driver Name: `John Driver`
  - [ ] Plate Number: `TEST-001`
- [ ] Click: "Add Shuttle" button
- [ ] Verify: Success message
- [ ] Verify: Shuttle appears in table
- [ ] Verify: Shuttle appears on live map

### Phase 7: Manual Testing - Update/Delete (3 minutes)
- [ ] Click: "Edit" on recently created shuttle
- [ ] Change: Driver name to "Jane Smith"
- [ ] Click: "Save" button
- [ ] Verify: Change reflected immediately
- [ ] Click: "Delete" button on same shuttle
- [ ] Confirm: Deletion
- [ ] Verify: Shuttle removed from table
- [ ] Verify: Shuttle removed from map

### Phase 8: Manual Testing - Error Scenarios (3 minutes)
- [ ] Try: Login with wrong password
- [ ] Verify: Error message shows
- [ ] Try: Signup with duplicate email
- [ ] Verify: Error message shows
- [ ] Try: Access without login
- [ ] Verify: Redirected to login page

---

## 📊 RESULTS VERIFICATION CHECKLIST

### API Responses
- [ ] Signup returns 201 status
- [ ] Login returns 200 status with tokens
- [ ] Get vehicles returns 200 status
- [ ] Create vehicle returns 201 status
- [ ] Update vehicle returns 200 status
- [ ] Delete vehicle returns 204 status
- [ ] Invalid login returns 401 status

### Frontend Functionality
- [ ] Registration form works
- [ ] Login form works
- [ ] Dashboard displays
- [ ] Live map shows
- [ ] Shuttles animate
- [ ] Forms validate input
- [ ] Error messages appear

### Database
- [ ] User created in database
- [ ] Profile created for user
- [ ] Vehicles saved to database
- [ ] Data persists after refresh
- [ ] Relationships intact

### Browser
- [ ] No console errors
- [ ] No 404 errors
- [ ] No network errors
- [ ] CORS headers present
- [ ] Responsive design works

---

## 🔍 DEBUGGING CHECKLIST (If Issues Found)

### Backend Issues
- [ ] Check: `python manage.py runserver` still running
- [ ] Check: Port 8000 not blocked
- [ ] Check: Database connected
- [ ] Check: Migrations completed
- [ ] Check: settings.py CORS configured
- [ ] Check: Backend logs for errors

### Frontend Issues
- [ ] Check: `npm run dev` still running
- [ ] Check: Port 5173 not blocked
- [ ] Check: Browser console (F12)
- [ ] Check: Network tab in DevTools
- [ ] Check: .env has correct API URL
- [ ] Check: No TypeScript errors

### API Connection Issues
- [ ] Check: Backend running on 8000
- [ ] Check: Frontend can reach http://localhost:8000
- [ ] Check: .env VITE_API_URL correct
- [ ] Check: CORS settings in settings.py
- [ ] Check: No firewall blocking connections
- [ ] Try: Clear browser cache

### Test Failures
- [ ] Run tests again: `npm run test:api`
- [ ] Check: Backend still running
- [ ] Check: Frontend still running
- [ ] Check: Network connectivity
- [ ] Check: Database accessible
- [ ] Review: Test output for specific errors

---

## 📋 DOCUMENTATION REFERENCE CHECKLIST

### Finding Information
- [ ] Quick start? → `QUICK_TEST.md`
- [ ] Manual steps? → `API_TEST_GUIDE.md`
- [ ] All details? → `COMPLETE_TESTING_FLOW.md`
- [ ] Just overview? → `TEST_EXECUTION_SUMMARY.md`
- [ ] Confused? → `TEST_INDEX.md`
- [ ] Need help? → `TEST_INDEX.md` Troubleshooting

### What Gets Tested
- [ ] All APIs? → See `API_TEST_GUIDE.md` table
- [ ] All features? → See `TEST_SUITE_SUMMARY.md`
- [ ] All security? → See `TEST_REPORT.md`
- [ ] Performance? → See `TEST_REPORT.md` metrics

---

## ✅ SIGN-OFF CHECKLIST

### Success Criteria Met
- [ ] All 20+ tests passed ✅
- [ ] No console errors
- [ ] No CORS errors
- [ ] All APIs responding
- [ ] Database working
- [ ] Frontend working
- [ ] Performance acceptable
- [ ] Security verified

### Documentation Complete
- [ ] Tests executed
- [ ] Results documented
- [ ] Issues resolved (if any)
- [ ] Performance verified
- [ ] Sign-off ready

### Ready for Next Phase
- [ ] Staging deployment? ✅
- [ ] Production deployment? ✅
- [ ] CI/CD setup? ✅
- [ ] User training? ✅

---

## 🎯 QUICK COMMAND REFERENCE

```bash
# Start Backend
cd backend && python manage.py runserver

# Start Frontend (new terminal)
npm run dev

# Run Automated Tests (new terminal)
npm run test:api

# Check Database (Django shell)
python manage.py shell

# View Logs
# Frontend: Browser DevTools (F12)
# Backend: Terminal where runserver is running

# Clear Cache (if needed)
# Frontend: Ctrl+Shift+Delete in browser
# Backend: python manage.py flush
```

---

## 📱 FEATURE CHECKLIST

### Authentication
- [ ] Signup works
- [ ] Login works
- [ ] JWT token issued
- [ ] Token stored in localStorage
- [ ] Protected endpoints require auth
- [ ] Invalid credentials rejected

### Shuttle Management
- [ ] View all shuttles
- [ ] Create new shuttle
- [ ] Update shuttle
- [ ] Delete shuttle
- [ ] Changes reflect instantly
- [ ] Data persists

### Live Map
- [ ] Map loads correctly
- [ ] Landmarks visible
- [ ] Shuttles display
- [ ] Shuttles animate
- [ ] Legend accurate
- [ ] Real-time updates

### User Experience
- [ ] Forms work
- [ ] Errors shown
- [ ] Success messages
- [ ] Loading states
- [ ] Responsive design
- [ ] Smooth animations

---

## 🎓 ROLE-BASED CHECKLIST

### For QA Testers
- [ ] Read: API_TEST_GUIDE.md
- [ ] Execute: Each test step
- [ ] Document: Results
- [ ] Report: Issues found
- [ ] Re-test: After fixes
- [ ] Sign-off: All tests pass

### For Developers
- [ ] Review: test-api.js code
- [ ] Run: npm run test:api
- [ ] Check: API responses
- [ ] Fix: Any failures
- [ ] Verify: Database updates
- [ ] Deploy: Changes

### For Managers
- [ ] Review: TEST_EXECUTION_SUMMARY.md
- [ ] Check: Success criteria
- [ ] Approve: Test results
- [ ] Sign-off: Project status
- [ ] Plan: Next phase
- [ ] Communicate: Stakeholders

---

## 🚀 FINAL SIGN-OFF

**When all checkboxes are complete:**

- ✅ Testing phase complete
- ✅ All requirements met
- ✅ Documentation prepared
- ✅ Ready for deployment
- ✅ Project approved for next phase

**Status:** ✅ **READY TO PROCEED**

---

## 📞 QUICK HELP

**Something not working?**
1. Check relevant section above
2. Review `TEST_INDEX.md` for guidance
3. Consult specific test guide
4. Check browser console/backend logs
5. Re-run tests: `npm run test:api`

**Need to understand?**
1. Read `QUICK_TEST.md` (fast)
2. Read `API_TEST_GUIDE.md` (detailed)
3. Read `COMPLETE_TESTING_FLOW.md` (complete)

**Ready to test?**
1. Check all PRE-TESTING items
2. Follow TESTING EXECUTION
3. Complete RESULTS VERIFICATION
4. Mark SIGN-OFF items

---

**Good luck with testing! 🧪**

Generated: November 20, 2025
