# Demo Playbook for Mudita Founder

## Goal
Demonstrate that MentorLink is ready for pilot use and aligned with Mudita's operational workflow.

## Recommended Demo Duration
20 to 30 minutes

## Demo Narrative
1. Problem and impact context (2 min)
2. Platform walkthrough for each role (12-15 min)
3. Scholarship application flow (4-5 min)
4. Deployment, security, and scale readiness (4-5 min)
5. Feedback and approval discussion (3-5 min)

## Suggested Demo Flow

### 1) Context and Value
- Explain the current coordination pain for mentorship workflows.
- Show how MentorLink reduces manual overhead and improves accountability.

### 2) Public Website
- Home page and programme pages
- Get Involved page
- Scholarship modal application submission

### 3) Mentee Journey
- Login as mentee
- Fill need analysis
- View modules
- Schedule or review sessions
- Show progress tracking

### 4) Mentor Journey
- Login as mentor
- View assigned mentees
- Review need analysis details
- Manage sessions and feedback

### 5) Admin Journey
- Dashboard metrics
- User management
- Auto-match and manual override
- Session overview
- Module management

### 6) Scholarship Operations
- Submit scholarship application from public page
- Show API success and acknowledgement
- Mention applicant + admin email notifications

### 7) Operations and Deployment
- Explain Vercel + Render + Atlas architecture
- Explain backup, monitoring, security controls, and next scale steps

## Founder-Facing Talking Points
- This is a configurable NGO mentorship platform with Mudita branding.
- It is deployable now for pilot and can scale incrementally.
- Cost can remain low in pilot, then expand with usage.
- Existing muditaalliance.org website can remain live while MentorLink is launched at a subdomain.

## Likely Questions and Suggested Answers

1. What is the monthly cost?
- Pilot can run on free/low-cost tiers.
- Production cost depends on traffic, media, and email volume.
- Provide phased budget table from `DOMAIN_SCALING_COSTING.md`.

2. Can we keep current website and add this platform?
- Yes. Keep current site at root domain and host MentorLink on a subdomain such as `mentor.muditaalliance.org`.

3. What about data privacy and security?
- JWT auth, hashed passwords, role-based access, managed cloud DB, and planned audit/log improvements.

4. How do we scale after pilot?
- Upgrade Render and Atlas tiers, add CDN/cache strategy, move transactional email provider, add monitoring and rate limiting.

## Demo Assets to Keep Ready
- Test accounts: admin, mentor, mentee
- One sample scholarship test payload
- Backup screenshots/video snippets
- Live URLs and architecture slide

## End-of-Meeting Ask
- Request approval for pilot launch scope
- Request list of required changes in priority order:
  1. Must-have before pilot
  2. Must-have before public launch
  3. Nice-to-have after launch
