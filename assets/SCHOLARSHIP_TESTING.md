# Quick Start: Testing Scholarship Application Locally

## Prerequisites
- Node.js installed
- MongoDB connection string ready
- Gmail account with App Password (for email testing)

## Setup

### 1. Backend Environment (.env)
```bash
cd server
cp .env.example .env
```

Fill in `.env`:
```env
MONGO_URI=mongodb+srv://your-user:your-pass@cluster.mongodb.net/mentorlink
JWT_SECRET=your-super-secret-key-12345
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-test-email@gmail.com
EMAIL_PASS=your-app-password-16chars
EMAIL_FROM=Mudita Test <your-test-email@gmail.com>
CLIENT_URL=http://localhost:3000
PORT=5000
```

### 2. Frontend Environment (.env)
```bash
cd ../client
cp .env.example .env  # or manually create
```

Add to `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start Development Servers
```bash
# From root folder
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Testing the Scholarship Form

### Step 1: Navigate to Get Involved Page
```
http://localhost:3000/get-involved
```

### Step 2: Scroll to "Apply for Support" Section
Look for **"Apply for Scholarship"** card with the button.

Click **"Apply Now"**

### Step 3: Fill Out the Modal Form

**Required fields:**
- Full Name: `Priya Sharma`
- Email: `test@email.com` (use a real email you can check)
- Why Deserving: `I am a first-generation college student from a low-income family...`

**Optional fields:**
- College: `IIT Bombay`
- Phone: `+91 98765 43210`
- Year: `2nd Year`
- Field: `Engineering`
- CGPA: `3.8`
- Family Background: `My father is a farmer...`
- Financial Need: `My family has limited resources...`
- Achievements: `Won state science competition, volunteer at NGO...`

### Step 4: Click Submit

**Expected behavior:**
1. Submit button shows "Submitting..." 
2. Request POSTs to `http://localhost:5000/api/scholarship-applications/submit`
3. Success toast appears: "Application submitted successfully! Check your email for confirmation."
4. Modal shows success state with application ID hint
5. After 3 seconds, modal auto-closes
6. Form is reset for next use

### Step 5: Check Emails

**Applicant Confirmation Email:**
- **To:** test@email.com (the email you entered)
- **From:** Mudita Test <your-email@gmail.com>
- **Subject:** "Mudita – Scholarship Application Received"
- **Content:** Professional HTML with confirmation details

**Admin Notification Email:**
- **To:** EMAIL_USER (your test Gmail account)
- **Subject:** "New Scholarship Application - Priya Sharma"
- **Content:** Table with all form fields

If emails don't arrive:
1. Check Gmail spam folder
2. Check backend console for errors
3. Verify Gmail App Password is correct

## API Testing (Without UI)

Testing with cURL or Postman:

```bash
# POST /api/scholarship-applications/submit
curl -X POST http://localhost:5000/api/scholarship-applications/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@email.com",
    "college": "Test University",
    "phone": "+91 9998765432",
    "year": "1st Year",
    "field": "Engineering",
    "cgpa": "3.5",
    "whyDeserving": "I deserve this scholarship because I am from an underserved background and am committed to academics."
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Application submitted successfully!",
  "applicationId": "507f1f77bcf86cd799439011"
}
```

## Get All Applications (Admin)

You need a JWT token from login first:

```bash
# 1. Login first to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mentorlink.com",
    "password": "TestPass123"
  }'

# Copy the "token" from response

# 2. Get applications with token
curl -X GET http://localhost:5000/api/scholarship-applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

Response:
```json
{
  "success": true,
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Test Student",
      "email": "test@email.com",
      "college": "Test University",
      "status": "submitted",
      "appliedAt": "2025-03-15T10:30:00.000Z",
      ...
    }
  ]
}
```

## Update Application Status

```bash
curl -X PUT http://localhost:5000/api/scholarship-applications/507f1f77bcf86cd799439011/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "under_review"
  }'
```

Allowed statuses: `submitted`, `under_review`, `accepted`, `rejected`

## Debugging Tips

### Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for any error messages when submitting form
- Check Network tab to see API requests

### Check Server Logs
Terminal where you ran `npm run dev`:
```
Jk Server running on port 5000
[API Request Log]
POST /api/scholarship-applications/submit 201
```

### Check MongoDB
Use MongoDB Compass or Atlas UI:
1. Connect to your cluster
2. Navigate to `mentorlink` database
3. Find `scholarshipapplications` collection
4. View inserted documents

### Email Debugging
Add logging to `scholarshipController.js`:
```javascript
console.log('Sending email to:', email);
console.log('Email response:', result);
```

## Common Issues

### Issue: "Application Model not found"
**Fix:** Ensure `server/models/ScholarshipApplication.js` exists and is properly exported

### Issue: "Route not found (404)"
**Fix:** Verify `server/index.js` has the route mounting:
```javascript
app.use("/api/scholarship-applications", require("./routes/scholarshipRoutes"));
```

### Issue: CORS error
**Fix:** Check `CLIENT_URL` in backend `.env` includes `http://localhost:3000`

### Issue: Email not sending
**Fix:** 
1. Use Gmail App Password (not regular password)
2. Check if Gmail 2FA is enabled
3. Temporarily allow "Less Secure Apps" if App Password doesn't work

### Issue: Modal doesn't appear
**Fix:** Try full page refresh (Ctrl+R) or clear browser cache

## Production Testing Checklist

Before deploying, test in fresh browser (no cache):
- [ ] Form validates all required fields
- [ ] Submission works with valid data
- [ ] Success message appears
- [ ] Confirmation email received
- [ ] Admin notification received
- [ ] Modal closes after success
- [ ] Form can be filled again without reload
- [ ] Mobile view is responsive
- [ ] Desktop view has 2-column layout
- [ ] All styling matches project theme (indigo/amber)
- [ ] No console errors

## Next Steps

1. **Deploy Backend**: Push to Render or your hosting
2. **Deploy Frontend**: Push to Vercel and set `REACT_APP_API_URL` to your Render URL
3. **Test in Production**: Fill form with real email, verify emails arrive
4. **Set Up Admin Page**: (Optional) Create admin dashboard to review applications
5. **Configure Notifications**: (Optional) Add email status updates

## Support

If you encounter issues:
1. Check this document's "Common Issues" section
2. Check backend server console for errors
3. Check browser DevTools > Network tab for failed requests
4. Verify MongoDB connection is working
5. Verify Gmail credentials and App Password are correct

---

Happy testing!
