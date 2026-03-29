# MentorLink - NGO Mentorship and Scholarship Platform

MentorLink is a production-oriented MERN platform designed for NGOs to manage mentorship operations, scholarship workflows, and beneficiary engagement with structured, measurable processes.

Deployed context: Mudita - An Alliance for Giving, Pune.

## Executive Summary

MentorLink solves a practical NGO operations problem: manual mentor-mentee coordination does not scale. The platform digitizes onboarding, matching, sessions, modules, progress tracking, and scholarship intake in one system.

Key outcomes:
- Role-based portal for admin, mentor, and mentee workflows
- Automated mentor-mentee matching using weighted criteria
- Session planning and completion tracking
- Learning module distribution and access
- Need-analysis driven guidance model
- Scholarship application flow with acknowledgement email and admin notification

## Core Features

### 1. Role-based Access
- JWT-based authentication
- Role-aware routing and permissions
- Protected APIs for administrative operations

### 2. Automated Matching Engine
- Weighted multi-criteria scoring
- Criteria: language, domain alignment, mentor workload, mentor experience
- Supports automatic assignment and manual override

### 3. Session Management
- Session scheduling between mentors and mentees
- Status lifecycle tracking
- Feedback and progress capture

### 4. Need Analysis
- Structured mentee self-assessment
- Captures skill-gap signals used by matching logic

### 5. Learning Modules
- Admin-managed module library
- Resource distribution to mentees

### 6. Scholarship Application Workflow
- Public scholarship application modal on Get Involved page
- Backend persistence in MongoDB
- Email acknowledgement to applicant
- Email notification to admin inbox
- Admin APIs to list, review, and update application status

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT, bcryptjs |
| File Handling | Cloudinary |
| Email | Nodemailer (SMTP) |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```text
mentor-link/
  client/
  server/
  docs/
  assets/
```

## API Summary

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/auth/forgot-password`
- PUT `/api/auth/reset-password/:token`
- PUT `/api/auth/update-profile`

### Sessions
- POST `/api/sessions`
- GET `/api/sessions`
- GET `/api/sessions/stats`
- PUT `/api/sessions/:id/status`

### Admin
- GET `/api/admin/stats`
- GET `/api/admin/users`
- POST `/api/admin/auto-match`
- GET `/api/admin/match-suggestions/:id`
- POST `/api/admin/manual-match`

### Scholarship Applications
- POST `/api/scholarship-applications/submit` (public)
- GET `/api/scholarship-applications` (protected)
- GET `/api/scholarship-applications/:id` (protected)
- PUT `/api/scholarship-applications/:id/status` (protected)

## Matching Logic

Score model:

```text
Score = Language(30) + Domain(40) + Workload(20) + Experience(10)
```

Purpose:
- Improve assignment quality
- Reduce admin coordination effort
- Prioritize compatibility and operational fairness

## Deployment Architecture

### Recommended Hosting
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### Environment Variables

#### Frontend (`client/.env`)
- `REACT_APP_API_URL=https://your-api-domain/api`

#### Backend (`server/.env`)
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `CLIENT_URL`

## Existing Domain Strategy (muditaalliance.org)

You can keep the current Mudita website fully live and launch MentorLink in parallel.

Recommended DNS strategy:
- Existing website remains at: `muditaalliance.org`
- MentorLink frontend: `mentor.muditaalliance.org`
- MentorLink backend API: `api.muditaalliance.org`

Benefits:
- Zero disruption to existing website
- Clear separation between public website and application
- Easier operations, scaling, and rollback

## Scalability Roadmap

### Phase A - Pilot
- Small user base
- Low-cost infrastructure
- Focus on workflow validation and feedback cycle

### Phase B - Growth
- Upgrade backend to always-on paid plan
- Upgrade Atlas tier for performance and backups
- Add monitoring and alerting
- Add endpoint rate limiting and anti-abuse controls

### Phase C - Scale
- Horizontal backend scaling
- Improved observability and incident response
- Dedicated transactional email provider
- Stronger compliance and audit trails

## Indicative Costing (Monthly)

These are approximate and depend on usage.

### Pilot
- Total range: USD 0 to 120

### Growth
- Total range: USD 120 to 490

### Scale
- Total range: USD 400 to 2300+

Detailed assumptions are documented in:
- `assets/Documentation/DOMAIN_SCALING_COSTING.md`

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection
- SMTP credentials

### Install
```bash
npm run install-all
```

### Run development
```bash
npm run dev
```

Default local URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### Production build check
```bash
cd client
npm run build
```

## Readiness Status

Current validation snapshot:
- Frontend production build: passing
- Backend route loading: passing
- Scholarship workflow modules: present
- CORS hardened for multi-origin and preview domains

## Documentation Index

### Stakeholder and Ops Documentation
- `assets/Documentation/README.md`
- `assets/Documentation/DEPLOYMENT_READINESS_REPORT.md`
- `assets/Documentation/DEMO_PLAYBOOK_MUDITA.md`
- `assets/Documentation/DOMAIN_SCALING_COSTING.md`
- `assets/Documentation/RUNBOOK_PRODUCTION.md`

### Academic Documentation
- `docs/phase1/Synopsis.md`
- `docs/phase2/Report.md`

## Author

Jaykumar Kale  
B.E. Information Technology, PICT Pune  
GitHub: https://github.com/Jaykumar-Kale

## License

MIT
