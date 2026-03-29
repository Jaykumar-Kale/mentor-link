# Production Runbook

## 1. Deploy Sequence

1. Deploy backend on Render
2. Verify backend health endpoint and API routes
3. Set frontend `REACT_APP_API_URL`
4. Deploy frontend on Vercel
5. Update backend `CLIENT_URL`
6. Re-verify login, need analysis, sessions, scholarship flow

## 2. Health Checks

Manual checks after deploy:
- `GET /` returns API running message
- Auth login works
- Admin stats loads
- Scholarship submit endpoint returns 201

## 3. Incident Response

### API down
- Check Render service status/logs
- Restart service
- Confirm MongoDB connectivity
- Rollback to last known good commit if needed

### Email failures
- Check SMTP credentials and provider status
- Verify app passwords/tokens
- Queue retries if implemented

### Slow responses
- Check Render cold start status
- Inspect Atlas metrics and slow query logs
- Review recent deploys and traffic spikes

## 4. Rollback Strategy

- Keep release tags per deployment
- Roll back frontend by redeploying previous Vercel build
- Roll back backend by redeploying previous Render commit
- Validate critical flows after rollback

## 5. Security Maintenance

- Rotate JWT secret and SMTP credentials periodically
- Enforce least privilege in Atlas users
- Restrict CORS allowlist to approved domains
- Add rate limiting on public endpoints

## 6. Routine Operations

Daily
- Check uptime and error dashboard

Weekly
- Review failed requests and suspicious traffic
- Verify backup and restore readiness

Monthly
- Review usage and upgrade/downgrade infrastructure tiers
- Review cost by service vendor
