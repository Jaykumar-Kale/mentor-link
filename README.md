# MentorLink – NGO Mentorship Platform

<div align="center">

![MentorLink](https://img.shields.io/badge/MentorLink-v1.0-indigo?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A production-ready web-based mentorship platform for NGOs, foundations, and organizations.**  
Deployed for **Mudita – An Alliance for Giving**, Pune.

[Live Demo](https://mentor-link.vercel.app) · [Backend API](https://mentor-link-api.onrender.com) · [Figma Prototype](https://www.figma.com/proto/WIUnXGzcSXq3bu7rcshOAW/Mentor-Link)

</div>

---

## Problem Statement

First-generation college students from underserved backgrounds face a critical gap — they have talent but lack professional guidance, industry exposure, and career mentorship. NGOs providing financial assistance don't have tools to facilitate structured mentoring at scale.

**MentorLink solves this** by providing a white-label mentorship platform that any NGO can deploy with their branding, enabling structured mentor-mentee sessions, automated intelligent matching, and progress tracking.

---

## Features

### Core Features
- **Role-based Authentication** — Admin, Mentor, Mentee, Facilitator, Alumni, Donor
- **Automated Mentor-Mentee Matching** — Weighted multi-criteria scoring algorithm (Language + Domain + Workload + Experience)
- **Session Management** — Schedule, track, and manage one-on-one mentoring sessions with Google Meet/Zoom integration
- **Learning Modules** — Admin uploads PPT/PDF resources; mentees access them anytime
- **Need Analysis Form** — Mentees self-rate on 6 soft-skill areas; data feeds the matching algorithm
- **Progress Tracking** — Visual progress bar tracking 8 sessions across 4 modules = 100%
- **Email Notifications** — Welcome emails, password reset via Nodemailer
- **Admin Panel** — Full user management, matching control, session monitoring

### Technical Highlights
- JWT-based stateless authentication
- File upload to Cloudinary
- Responsive design (Mobile + Desktop)
- RESTful API architecture

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 18, React Router v6, Tailwind CSS |
| Backend   | Node.js, Express.js |
| Database  | MongoDB Atlas |
| Auth      | JWT (JSON Web Tokens), bcryptjs |
| Files     | Cloudinary |
| Email     | Nodemailer (Gmail SMTP) |
| Deploy    | Vercel (Frontend) + Render (Backend) |

---

## Project Structure

```
mentor-link/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── mentee/         # Mentee dashboard, modules, sessions, need analysis
│   │   │   ├── mentor/         # Mentor dashboard, mentees, sessions
│   │   │   └── admin/          # Admin dashboard, users, matching, modules
│   │   ├── components/         # Navbar, Footer, DashboardLayout
│   │   ├── context/            # AuthContext (global state)
│   │   └── utils/              # API utility (axios)
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── models/                 # User, Session, Module, NeedAnalysis
│   ├── controllers/            # Auth, Session, Module, NeedAnalysis, Admin
│   ├── routes/                 # REST API routes
│   ├── middleware/             # JWT auth middleware
│   ├── utils/matching.js       # Matching algorithm
│   └── index.js                # Express server entry
│
└── docs/
    ├── phase1/                 # Project Phase-1 documentation
    └── phase2/                 # Project Phase-2 documentation
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Gmail account (for email)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Jaykumar-Kale/mentor-link.git
cd mentor-link
```

**2. Install all dependencies**
```bash
npm run install-all
```

**3. Configure environment variables**
```bash
cd server
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, Cloudinary keys, Gmail credentials
```

**4. Run development servers**
```bash
# From root folder - starts both frontend and backend
npm run dev
```

Open http://localhost:3000 for the frontend.  
API runs at http://localhost:5000.

---

## API Reference

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Send reset email |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| PUT | `/api/auth/update-profile` | Update profile |

### Session Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create session |
| GET | `/api/sessions` | Get my sessions |
| GET | `/api/sessions/stats` | Session statistics |
| PUT | `/api/sessions/:id/status` | Update status + feedback |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | All users (with filters) |
| POST | `/api/admin/auto-match` | Run matching algorithm |
| GET | `/api/admin/match-suggestions/:id` | Mentor suggestions for mentee |
| POST | `/api/admin/manual-match` | Manually assign pair |

---

## Matching Algorithm

The core innovation of MentorLink is the **Weighted Multi-Criteria Scoring Algorithm** that automatically matches mentees with the most compatible mentor.

```
Score = Language Match (30pts) + Domain Match (40pts) + Workload (20pts) + Experience (10pts)
```

**Criteria:**
1. **Language (30pts)** — Shared languages between mentor and mentee
2. **Domain (40pts)** — Mentor expertise matches mentee's weak areas from Need Analysis
3. **Workload (20pts)** — Mentors with fewer current mentees are preferred
4. **Experience (10pts)** — Years of industry experience (capped at 10pts)

See `server/utils/matching.js` for full implementation.

---

## Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy the build/ folder to Vercel
# Set environment variable: REACT_APP_API_URL = https://your-api.onrender.com
```

### Backend → Render
1. Connect your GitHub repo to Render
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env.example`

---

## Screenshots

| Page | Description |
|------|-------------|
| Home | Mudita Alliance landing page with CTA |
| Login | Role-based login (Mentor, Mentee, Admin, etc.) |
| Mentee Dashboard | Welcome screen with progress tracking |
| Sessions | Schedule meetings, track completion |
| Modules | Learning resources by topic |
| Need Analysis | Self-rating form (1-5 emoji scale) |
| Mentor Dashboard | Assigned mentees overview |
| Admin Matching | Auto-match + manual assignment |

---

## Project Phase Documentation

- [Phase 1 Synopsis](./docs/phase1/Synopsis.md)
- [Phase 2 Report](./docs/phase2/Report.md)

---

## Author

**Jaykumar Kale**  
B.E. Information Technology, 3rd Year  
PICT College, Pune  
GitHub: [@Jaykumar-Kale](https://github.com/Jaykumar-Kale)

**Deployed for:** Mudita – An Alliance for Giving, Pune  
**Contact:** mentoring@muditaalliance.org

---

## License

MIT License – See [LICENSE](./LICENSE) for details.
