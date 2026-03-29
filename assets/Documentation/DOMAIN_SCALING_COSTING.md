# Domain, Scaling, and Costing Strategy

## 1. Domain Strategy with Existing muditaalliance.org Website

You can keep the existing Mudita website live and launch MentorLink in parallel.

### Recommended Setup
- Keep existing public website at: `muditaalliance.org`
- Keep marketing pages also at root if needed
- Launch MentorLink app on subdomain: `mentor.muditaalliance.org`
- Optionally host API on: `api.muditaalliance.org`

### DNS Mapping Example
- `mentor.muditaalliance.org` -> Vercel frontend project
- `api.muditaalliance.org` -> Render backend service

### Why Subdomain is Best
- No disruption to current website
- Clear separation between content site and application
- Easier scaling and operations
- Cleaner SSL and deployment management

## 2. Environment Configuration for Subdomain Setup

### Frontend (Vercel)
- `REACT_APP_API_URL=https://api.muditaalliance.org/api`

### Backend (Render)
- `CLIENT_URL=https://mentor.muditaalliance.org`
- CORS allowlist should include production + preview domains

## 3. Scaling Plan (All Perspectives)

### A) Application Layer
Pilot (0-300 active users/month)
- Vercel hobby + Render free/entry plan
- Expect occasional cold starts

Growth (300-3000 active users/month)
- Move backend to paid Render plan (always-on)
- Add process manager, health checks, and uptime alerts

Scale (3000+ active users/month)
- Horizontal scaling on backend
- Introduce caching and queue for heavy async tasks

### B) Database Layer (MongoDB Atlas)
Pilot
- M0 cluster is acceptable

Growth
- M10 or higher for stable performance and backups
- Add indexes and query monitoring

Scale
- Multi-region, backup policy tuning, alerting, and access policies

### C) File and Email Layer
Files
- Cloudinary free tier for pilot
- Move to paid tier as storage/bandwidth grows

Email
- Gmail SMTP acceptable for very small volume
- Move to Postmark/SendGrid/Amazon SES for reliability and deliverability

### D) Security and Compliance
Pilot minimum
- Strong JWT secret
- Role-based access
- HTTPS everywhere

Before public scale
- Rate limiting and bot protection
- Centralized logs
- Audit trail for admin actions
- Data retention and backup policy

### E) Observability and Reliability
- Uptime monitoring (UptimeRobot/Better Stack)
- Error tracking (Sentry)
- Structured logs and alerting
- Basic runbook with rollback instructions

## 4. Costing Estimate (Indicative)

All values are approximate monthly ranges and depend on usage and vendor region.

### Pilot
- Vercel: 0 to 20 USD
- Render: 0 to 25 USD
- Atlas: 0 to 30 USD
- Cloudinary: 0 to 20 USD
- Email: 0 to 15 USD
- Monitoring: 0 to 10 USD
- Total: 0 to 120 USD

### Growth
- Vercel: 20 to 50 USD
- Render: 25 to 100 USD
- Atlas: 30 to 150 USD
- Cloudinary: 20 to 80 USD
- Email: 15 to 60 USD
- Monitoring/Logging: 10 to 50 USD
- Total: 120 to 490 USD

### Scale
- Vercel: 50 to 200+ USD
- Backend compute: 100 to 500+ USD
- Atlas: 150 to 1000+ USD
- Media + email + observability: 100 to 600+ USD
- Total: 400 to 2300+ USD

## 5. Stakeholder Budget Message

Recommended statement:
- Start with a controlled pilot at low cost.
- Upgrade only when usage metrics justify scale.
- Keep the existing website live and launch MentorLink on subdomain for zero-risk transition.

## 6. Practical Recommendation for Mudita

1. Launch pilot at `mentor.muditaalliance.org`
2. Keep API at `api.muditaalliance.org`
3. Move backend from free to paid always-on plan before public announcement
4. Move from Gmail SMTP to dedicated transactional email provider
5. Add monitoring + rate limiting before opening public scholarship form widely
