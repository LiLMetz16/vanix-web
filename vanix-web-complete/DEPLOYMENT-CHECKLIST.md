# 📋 Deployment Checklist

Use this checklist when deploying Vanix to production.

## Pre-Deployment

### Environment Setup
- [ ] Create production MySQL database
- [ ] Set strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Configure `DATABASE_URL` with production credentials
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Enable SSL for MySQL connection (add `?sslaccept=strict` to URL)

### Security
- [ ] Change default admin password
- [ ] Remove or secure seed script
- [ ] Review all API routes for authentication
- [ ] Enable HTTPS on hosting platform
- [ ] Configure CORS if needed
- [ ] Set secure cookie settings (`secure: true` in production)

### Code Review
- [ ] Remove console.logs from production code
- [ ] Check for hardcoded secrets
- [ ] Verify error handling in all API routes
- [ ] Test all authentication flows
- [ ] Test portfolio upload/display

### Database
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` in production
- [ ] Seed initial data (if needed)
- [ ] Set up database backups
- [ ] Configure connection pooling

## Deployment

### Build
- [ ] Run `npm run build` locally to test
- [ ] Fix any build errors
- [ ] Check bundle size

### Deploy
- [ ] Push code to Git repository
- [ ] Connect hosting platform (Vercel/Railway/etc)
- [ ] Set environment variables
- [ ] Deploy application
- [ ] Run database migrations

### Post-Deployment
- [ ] Test homepage loading
- [ ] Test authentication (login/logout)
- [ ] Test shop pages
- [ ] Test portfolio page
- [ ] Test contact form
- [ ] Check mobile responsiveness
- [ ] Verify images loading correctly

## Monitoring

### Setup
- [ ] Configure error tracking (Sentry, LogRocket, etc)
- [ ] Set up uptime monitoring
- [ ] Configure database monitoring
- [ ] Set up log aggregation

### Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Optimize images if needed
- [ ] Enable caching headers

## Post-Launch

### Content
- [ ] Add real portfolio items
- [ ] Update product information
- [ ] Add contact information
- [ ] Update about/bio section

### SEO
- [ ] Add meta descriptions
- [ ] Configure sitemap
- [ ] Set up Google Analytics
- [ ] Submit to search engines

### Marketing
- [ ] Share on social media
- [ ] Update business cards
- [ ] Update email signature

## Maintenance

### Regular Tasks
- [ ] Weekly database backups
- [ ] Monthly dependency updates
- [ ] Quarterly security audit
- [ ] Monitor error logs

### Updates
- [ ] Keep Next.js updated
- [ ] Update Prisma regularly
- [ ] Update security packages

## Emergency Contacts

- Hosting Provider: _______________
- Database Provider: _______________
- Domain Registrar: _______________

## Rollback Plan

If something goes wrong:
1. Revert to previous Git commit
2. Redeploy from known-good commit
3. Restore database backup if needed
4. Check error logs for issues

---

**Use this checklist every deployment to ensure nothing is missed!**
