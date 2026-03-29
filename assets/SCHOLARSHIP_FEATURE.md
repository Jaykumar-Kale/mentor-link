# Scholarship Application System

## Overview

MentorLink includes a complete scholarship application system that allows students to apply for financial aid directly through the platform without requiring login. Applications are processed through an intuitive modal form on the **"Get Involved"** public page.

---

## Features

### User-Facing
- **Public Modal Form** — No authentication required; accessible to all visitors
- **Email Confirmation** — Applicants receive professional confirmation emails with application ID
- **Responsive Design** — Mobile-first layout; form adapts from 1 column (mobile) to 2 columns (desktop)
- **Form Validation** — Required field checks and email validation
- **Toast Notifications** — User-friendly success/error messages

### Backend
- **Admin Notifications** — Mudita staff receives detailed application summaries
- **Admin Dashboard API** — Review, filter, and manage applications
- **Status Tracking** — Track application through: submitted → under_review → accepted/rejected
- **Email Integration** — Automated emails using Nodemailer + Gmail SMTP

---

## API Endpoints

### Public Endpoints
**POST** `/api/scholarship-applications/submit`
- No authentication required
- Accepts application form data
- Returns success with application ID
- Triggers confirmation emails (applicant + admin)

```json
{
  "name": "Priya Kumar",
  "email": "priya@email.com",
  "college": "IIT Bombay",
  "phone": "+91 98765 43210",
  "year": "2nd Year",
  "field": "Engineering",
  "cgpa": "3.8",
  "whyDeserving": "I am a first-generation college student...",
  "familyBackground": "Optional - family context",
  "financialNeed": "Optional - financial situation",
  "achievements": "Optional - awards, volunteering, etc."
}
```

### Protected Endpoints (Admin)
**GET** `/api/scholarship-applications`
- Returns all applications (sorted by date DESC)
- Requires JWT authentication

**GET** `/api/scholarship-applications/:id`
- Returns single application details
- Requires JWT authentication

**PUT** `/api/scholarship-applications/:id/status`
- Update application status
- Accepts: `{ "status": "under_review" | "accepted" | "rejected" }`
- Requires JWT authentication

---

## Database Schema

### ScholarshipApplication Model

```javascript
{
  name: String (required),
  email: String (required),
  college: String,
  phone: String,
  year: String,
  field: String (select from: Engineering, Medicine, Science, Technology, Other STEM),
  cgpa: Number,
  whyDeserving: String (required, min 50 chars),
  familyBackground: String,
  financialNeed: String,
  achievements: String,
  documents: [String] (file URLs, future expansion),
  status: String (enum: submitted, under_review, accepted, rejected),
  appliedAt: Date (default: now),
  createdAt: Date (default: now)
}
```

---

## Frontend Implementation

### Location
`client/src/pages/public/GetInvolvedPage.js`

### Component Structure
```
GetInvolvedPage
├── [Donate Section]
├── [Volunteer Section]
├── [Apply for Support Section]
│   └── "Apply for Scholarship" Card → Opens Modal
└── [Scholarship Modal]
    ├── Form (when !scholarshipSubmitted)
    └── Success State (when scholarshipSubmitted)
```

### Key Features
- **Modal State**: `showScholarshipModal` (boolean)
- **Form State**: `scholarshipForm` (object with all fields)
- **Submission States**: `scholarshipSubmitting`, `scholarshipSubmitted`
- **Auto-close**: Modal closes 3 seconds after successful submission
- **Form Reset**: After submission, modal resets for next use

### Styling
- **Design System**: Inherits project color scheme (Indigo #3730a3, Amber #f59e0b)
- **No Emojis**: Clean icon placeholders (⊙, ▮) instead of emoji
- **Responsive**: Tailwind CSS breakpoints (`grid-cols-1 sm:grid-cols-2`)
- **CSS Classes**: Standard project classes (`form-input`, `btn-indigo`, `btn-outline`)

### Form Layout

**Mobile (1 column):**
- Name
- Email
- College
- Phone
- Year
- Field
- CGPA
- Why Deserving (full width)
- Family Background (full width)
- Financial Need (full width)
- Achievements (full width)
- Submit + Cancel buttons

**Desktop (2 columns):**
- Name | Email
- College | Phone
- Year | Field
- CGPA | (empty)
- Why Deserving (full width)
- Family Background (full width)
- Financial Need (full width)
- Achievements (full width)
- Submit + Cancel buttons (side by side)

---

## Backend Implementation

### Files Created

**Model**: `server/models/ScholarshipApplication.js`
- Mongoose schema with all fields
- Status enum validation
- Timestamps

**Controller**: `server/controllers/scholarshipController.js`
- `submitApplication()` - Public submission handler
- `getAllApplications()` - List all (admin)
- `getApplication()` - Get single (admin)
- `updateApplicationStatus()` - Update status (admin)
- Email sending logic for confirmations

**Routes**: `server/routes/scholarshipRoutes.js`
- POST `/submit` (public)
- GET `/` (protected)
- GET `/:id` (protected)
- PUT `/:id/status` (protected)

### Integration
Added to `server/index.js`:
```javascript
app.use("/api/scholarship-applications", require("./routes/scholarshipRoutes"));
```

---

## Email System

### Configuration (.env)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Mudita Alliance <your-gmail@gmail.com>"
```

**Note**: For Gmail, use an **App Password** (not your main Gmail password):
1. Enable 2-Factor Authentication on Gmail
2. Go to myaccount.google.com → Security → App Passwords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Use as `EMAIL_PASS` in `.env`

### Email Templates

#### 1. Applicant Confirmation Email
**To**: Applicant's email  
**Subject**: "Mudita – Scholarship Application Received"

Features:
- Indigo header with Mudita branding
- Application ID (last 8 chars of MongoDB _id, uppercase)
- Expected review timeline (2-3 weeks)
- Support email: scholarships@muditaalliance.org
- Professional HTML formatting

#### 2. Admin Notification Email
**To**: `EMAIL_USER` (admin inbox)  
**Subject**: "New Scholarship Application - [Applicant Name]"

Features:
- All form fields in a structured table
- Applicant contact email for direct outreach
- Timestamp and metadata

### Email Handling
- Confirmation emails are non-blocking (try/catch silently fails)
- If email fails, application is still saved and user gets success response
- Admin notifications are secondary priority
- Errors logged to console for debugging

---

## Deployment Considerations

### Environment Variables
Before deploying, ensure these are set in your deployment platform:

**Render (Backend)**
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Mudita Alliance <your-email@gmail.com>
CLIENT_URL=https://your-frontend-domain.com
```

**Vercel (Frontend)**
```
REACT_APP_API_URL=https://your-backend-api.onrender.com
```

### API Rate Limiting
Consider adding rate limiting to the `/submit` endpoint to prevent spam:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 applications per 15 minutes per IP
});
router.post('/submit', limiter, scholarshipController.submitApplication);
```

### Data Privacy
- Store sensitive data securely in MongoDB
- Don't log personally identifiable information
- Consider implementing data retention policies
- Email addresses are used only for scholar communications

---

## Admin Dashboard (Future)

### Planned Features
- [ ] Admin page to view all applications
- [ ] Search/filter by status, date, field
- [ ] Export applications to CSV/Excel
- [ ] Email status updates to applicants (accepted/rejected templates)
- [ ] Document upload support (additional requirement documents)
- [ ] Bulk actions (accept multiple, send emails)
- [ ] Analytics dashboard (applications by month, approval rate, etc.)

---

## Testing Checklist

- [ ] Modal opens when "Apply Now" clicked
- [ ] Form validation prevents empty required fields
- [ ] Email format validation works
- [ ] Submit button disables during submission
- [ ] Success toast appears
- [ ] Confirmation email arrives at applicant email
- [ ] Admin notification reaches admin email
- [ ] Modal auto-closes after 3 seconds
- [ ] Form clears for next use
- [ ] Mobile layout is responsive (1 column)
- [ ] Desktop layout uses 2 columns
- [ ] Buttons are styled correctly (indigo/amp theme)
- [ ] No visual regressions on Get Involved page

---

## Troubleshooting

### Email not sending
1. Check `.env` variables are correct
2. Enable "Less Secure App Access" OR use App Password (recommended)
3. Check Gmail spam folder for test emails
4. Verify `EMAIL_FROM` field matches Gmail account

### Form not submitting
1. Check browser console for errors
2. Verify API endpoint: `POST /api/scholarship-applications/submit`
3. Check that backend is running and accessible
4. Inspect Network tab to see request/response

### Modal not opening
1. Check React state management for `showScholarshipModal`
2. Verify modal JSX is not conditionally hidden
3. Check browser console for rendering errors

### Applications not appearing in admin dashboard
1. Check MongoDB connection is working
2. Verify `ScholarshipApplication` model is loaded
3. Check that JWT token is valid (auth middleware)
4. Try accessing with a valid admin user token

---

## Future Enhancements

1. **Document Upload** — Allow scholars to upload transcripts, essays as files
2. **Status Emails** — Send acceptance/rejection emails with personalized messages
3. **Admin Messaging** — Direct messaging between admin and applicants
4. **Application Timeline** — Visual timeline for each application
5. **Recommendation Letters** — Upload references from teachers
6. **Interview Scheduling** — Book interview slots for shortlisted candidates
7. **Scholarship Matching** — Auto-assign mentors to accepted scholars
8. **Impact Tracking** — Track accepted scholars' progress over time

---

## Questions?

For implementation support or feature requests, contact the development team or create an issue in the project repository.
