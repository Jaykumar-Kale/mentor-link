# Project Phase-I Synopsis
## MentorLink – Automated NGO Mentorship Platform

---

**Course:** BE (Information Technology) – Semester VII  
**Subject:** Project Phase-I (414448)  
**Guide:** [Your Guide's Name]  
**Students:** Jaykumar Kale (Roll No: ___)  
**Institution:** PICT College, Pune  
**University:** Savitribai Phule Pune University  
**Academic Year:** 2024-25  

---

## 1. Project Title
**MentorLink: An Automated Web-Based Mentorship Platform for NGOs Using Weighted Multi-Criteria Matching**

---

## 2. Problem Statement

First-generation college students from rural and underserved backgrounds face a critical dual challenge: lack of financial resources and lack of professional guidance. While NGOs like Mudita Alliance address the financial gap through scholarships, there is no structured, scalable digital platform for coordinating mentorship programs between students and volunteer professionals.

Current challenges:
- Manual, time-consuming mentor-mentee assignment by administrators
- No centralized platform for scheduling and tracking mentoring sessions
- No tools for measuring student progress across skill development areas
- Partner companies want to contribute through employee volunteering but lack a coordination tool
- Students don't know what to expect from mentoring or how to self-assess

---

## 3. Motivation

**Personal:** The project lead (Jaykumar Kale) is himself a first-generation engineering student from a village background and a beneficiary of the Mudita Alliance scholarship program. This project is born from lived experience of the exact problem being solved.

**Social:** Over 350 students currently receive scholarships from Mudita Alliance. As they graduate, they need career guidance. Scaling manual mentorship coordination is impossible without a digital platform.

**Technical:** This project demonstrates practical application of MERN stack development, REST API design, JWT authentication, automated matching algorithms, and cloud deployment — all core skills in modern software engineering.

---

## 4. Objectives

1. Build a secure, role-based web application supporting Admin, Mentor, Mentee, Facilitator, Alumni, and Donor roles
2. Implement an automated mentor-mentee matching algorithm using weighted multi-criteria scoring
3. Develop a session management system integrated with Google Meet / Zoom links
4. Create a learning modules platform where admins upload PPT/PDF materials for mentees
5. Implement a Need Analysis Form that collects self-assessment data from mentees
6. Deploy the platform for real-world use by Mudita Alliance, Pune

---

## 5. Scope

**In Scope (Phase I):**
- User authentication and role-based access control
- Need Analysis Form
- Mentor-Mentee matching algorithm design and implementation
- Session scheduling and tracking
- Learning modules upload and access
- Admin panel for user and matching management
- Frontend UI/UX design
- API design and implementation
- Database schema design

**Out of Scope (Phase I / Future Scope):**
- Real-time notifications (push/SMS)
- Video calling integration (replace Meet/Zoom links)
- Mobile application (React Native)
- Multi-language support (Marathi/Hindi UI)
- Analytics dashboard
- Document/assignment upload by mentees

---

## 6. Proposed System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        CLIENT TIER                        │
│              React.js + Tailwind CSS                      │
│     (Vercel CDN – global edge deployment)                 │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS / REST API
┌────────────────────────▼─────────────────────────────────┐
│                     APPLICATION TIER                      │
│         Node.js + Express.js REST API                     │
│     (Render.com – containerized Node server)              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Auth Module │  │ Session Mgmt │  │ Matching Engine │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │ Mongoose ODM
┌────────────────────────▼─────────────────────────────────┐
│                       DATA TIER                           │
│              MongoDB Atlas (Cloud)                        │
│   Collections: Users, Sessions, Modules, NeedAnalysis    │
└──────────────────────────────────────────────────────────┘
         │ File Storage              │ Email Service
┌────────▼────────┐         ┌────────▼────────┐
│   Cloudinary    │         │   Nodemailer    │
│ (PPT/PDF files) │         │  (Gmail SMTP)   │
└─────────────────┘         └─────────────────┘
```

---

## 7. Database Schema

### Users Collection
```
{
  name, email, password (hashed), role,
  phone, gender, profilePhoto,
  // Mentor: organization, yearsOfExperience, languagesKnown, expertise, branch, linkedIn
  // Mentee: college, year, stream, scholarshipId
  // Matching: assignedMentor, assignedMentees, isMatched
  isActive, needAnalysisCompleted, createdAt
}
```

### Sessions Collection
```
{
  mentor (ref: User), mentee (ref: User),
  topic (enum: 6 module topics + Introduction Call),
  date, startTime, endTime, duration,
  meetingLink, agenda, status (upcoming/completed/cancelled),
  summary, mentorFeedback, menteeFeedback, menteeRating
}
```

### NeedAnalysis Collection
```
{
  mentee (ref: User, unique),
  expectations, specificNeeds,
  ratings: { careerDevelopment, interpersonalSkills, communicationSkills,
             etiquette, problemSolving, timeManagement } (each 1-5),
  willMentorshipHelp, willingToContact, preferredLanguage[]
}
```

### Modules Collection
```
{
  title, description, order,
  coverImage, isActive,
  resources: [{ fileName, fileUrl, fileType }]
}
```

---

## 8. Matching Algorithm Design

**Title:** Automated Mentor-Mentee Matching Using Weighted Multi-Criteria Scoring

**Formula:**
```
MatchScore(M_mentor, M_mentee) = 
  W₁ × LanguageScore +
  W₂ × DomainScore   +
  W₃ × WorkloadScore +
  W₄ × ExperienceScore

Where: W₁=0.30, W₂=0.40, W₃=0.20, W₄=0.10
Max Score = 100
```

**Criterion Details:**
| Criterion | Weight | Calculation |
|-----------|--------|-------------|
| Language Match | 30pts | Shared languages between mentor & mentee |
| Domain Match | 40pts | Mentor expertise vs mentee's weak areas (score ≤3) |
| Workload | 20pts | 0 mentees=20, 1=15, 2=8, ≥3=0 |
| Experience | 10pts | min(yearsOfExp × 2, 10) |

**Algorithm:**
1. For each unmatched mentee with completed Need Analysis
2. Calculate MatchScore against all available mentors (load < 3)
3. Assign mentee to mentor with highest score
4. Update both users' assignment fields in DB

---

## 9. Technology Stack Justification

| Technology | Justification |
|-----------|--------------|
| React.js | Component-based UI, SPA routing, large ecosystem |
| Node.js + Express | JavaScript full-stack consistency, fast API development |
| MongoDB | Flexible schema for evolving data, free Atlas tier |
| JWT Auth | Stateless, scalable authentication |
| Tailwind CSS | Rapid UI development, consistent design system |
| Cloudinary | Free file hosting with CDN, supports non-image files |
| Vercel | Free frontend hosting with automatic GitHub deploy |
| Render | Free Node.js hosting with GitHub integration |

---

## 10. Review 1 Deliverables (Completed)

- [x] Problem Statement finalized
- [x] Literature Survey completed
- [x] Feasibility Analysis (Technical + Economic + Operational)
- [x] Architecture Diagram (3-tier)
- [x] Database Schema designed (ERD)
- [x] Technology stack selected and justified
- [x] GitHub repository created
- [x] Development environment setup

---

## 11. Review 2 Deliverables (In Progress)

- [x] User and System Requirements Document
- [x] API design and routes
- [x] Database models implementation
- [x] Authentication system
- [x] Basic UI design completed
- [ ] Matching algorithm testing
- [ ] Integration testing
- [ ] Research paper draft (Literature Survey + Design)

---

## 12. Literature Survey Summary

**Existing Solutions Reviewed:**
1. **Mentorloop (mentorloop.com)** — Commercial platform, expensive ($500+/month), no NGO focus, no regional language support
2. **Ten Thousand Coffees** — Good scheduling, corporate-only, no student-NGO use case
3. **MentorCity** — Closest to our use case, but no Indian context, no automated matching based on need analysis

**Gap Identified:** No existing free/affordable platform that:
- Caters specifically to NGO-student mentorship
- Automates matching based on student self-assessment
- Supports Indian languages and local NGO workflows
- Can be white-labeled per organization

**Our Innovation:** MentorLink fills this gap with a white-label, open-source platform featuring automated matching that reads from the mentee's own Need Analysis responses.

---

## 13. Expected Outcomes

- A deployed, production-ready web application used by Mudita Alliance
- Structured mentorship for 50+ student-mentor pairs in the first cohort
- Research paper published on the matching algorithm
- Reduced admin workload by 80% (from manual assignment to automated)
- Measurable student progress through session completion tracking

---

## References

1. Node.js Official Documentation – https://nodejs.org/docs
2. React Documentation – https://react.dev
3. MongoDB Atlas Documentation – https://www.mongodb.com/docs/atlas
4. JWT Introduction – https://jwt.io/introduction
5. Tailwind CSS – https://tailwindcss.com/docs
6. Vercel Deployment Guide – https://vercel.com/docs
7. Mudita Alliance – https://muditaalliance.org
8. "Mentoring in Engineering Education" – Journal of Engineering Education, 2022
9. "Multi-Criteria Decision Making in Resource Allocation" – IEEE, 2021
