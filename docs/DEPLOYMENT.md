# Deployment Guide

This guide covers deploying TALHub to various platforms and environments.

## Table of Contents

1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Vercel Deployment](#vercel-deployment)
4. [Other Platforms](#other-platforms)
5. [Database Setup](#database-setup)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

## Pre-deployment Checklist

Before deploying, ensure the following:

- [ ] All tests pass (`npm test`)
- [ ] TypeScript compilation succeeds (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables are configured
- [ ] Database migrations are applied
- [ ] RLS policies are tested
- [ ] Storage bucket is configured
- [ ] Authentication is working
- [ ] All features are tested in staging

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `https://talhub.com` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `TALHub` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `0.1.0` |

### Environment-specific Configuration

#### Development
```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### Staging
```env
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key
NEXT_PUBLIC_APP_URL=https://staging.talhub.com
NODE_ENV=production
```

#### Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
NEXT_PUBLIC_APP_URL=https://talhub.com
NODE_ENV=production
```

## Vercel Deployment

### Prerequisites

- Vercel account
- GitHub repository connected to Vercel
- Supabase project set up

### Deployment Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository and branch

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables
   - Set values for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Monitor the deployment logs
   - Test the deployed application

### Vercel Configuration File

Create `vercel.json` for custom configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Custom Domain Setup

1. **Add Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Ensure DNS records are properly configured

## Other Platforms

### Netlify

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `out`
   - Node Version: `18`

3. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables

4. **Deploy**
   - Click "Deploy site"
   - Monitor deployment progress

### Railway

1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project"
   - Connect your GitHub repository

2. **Configure Service**
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Next.js

3. **Environment Variables**
   - Go to Variables tab
   - Add all required environment variables

4. **Deploy**
   - Railway will automatically deploy
   - Monitor logs in the dashboard

### DigitalOcean App Platform

1. **Create App**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure App**
   - Source: GitHub
   - Repository: Select your repository
   - Branch: main
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Environment Variables**
   - Go to Settings → App-Level Environment Variables
   - Add all required variables

4. **Deploy**
   - Click "Create Resources"
   - Monitor deployment progress

## Database Setup

### Supabase Configuration

1. **Create Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose organization and region

2. **Run Migrations**
   - Go to SQL Editor
   - Run the migration scripts from `docs/Supabase_Setup_Engineering_Notes_mvp.md`
   - Verify all tables and policies are created

3. **Configure Authentication**
   - Go to Authentication → Settings
   - Enable email authentication
   - Configure email templates
   - Set up magic link settings

4. **Set Up Storage**
   - Go to Storage
   - Create bucket `talhub-docs`
   - Set bucket to private
   - Configure RLS policies

5. **Environment Variables**
   - Go to Settings → API
   - Copy Project URL and anon key
   - Add to your deployment environment

### Database Migrations

Create migration files for schema changes:

```sql
-- migrations/001_initial_schema.sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role user_role DEFAULT 'tenant',
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Backup Strategy

1. **Enable Backups**
   - Go to Supabase Dashboard → Settings → Database
   - Enable Point-in-Time Recovery (PITR)
   - Configure backup retention

2. **Manual Backups**
   - Use Supabase CLI for manual backups
   - Schedule regular exports
   - Test restore procedures

## Monitoring and Maintenance

### Performance Monitoring

1. **Vercel Analytics**
   - Enable Vercel Analytics
   - Monitor Core Web Vitals
   - Track user engagement

2. **Supabase Monitoring**
   - Monitor database performance
   - Track API usage
   - Set up alerts for errors

3. **Error Tracking**
   - Consider Sentry for error tracking
   - Monitor application logs
   - Set up alerting

### Maintenance Tasks

1. **Regular Updates**
   - Update dependencies monthly
   - Test updates in staging
   - Deploy updates during low-traffic periods

2. **Security Updates**
   - Monitor security advisories
   - Update dependencies promptly
   - Review access controls

3. **Performance Optimization**
   - Monitor bundle size
   - Optimize images and assets
   - Review database queries

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify environment variables
   - Review dependency versions

2. **Runtime Errors**
   - Check browser console
   - Review server logs
   - Verify Supabase connection

3. **Authentication Issues**
   - Check Supabase configuration
   - Verify email settings
   - Test magic link flow

### Debug Tools

1. **Vercel Debug**
   - Use Vercel CLI for local debugging
   - Check deployment logs
   - Monitor function execution

2. **Supabase Debug**
   - Use Supabase CLI
   - Check database logs
   - Monitor API usage

3. **Browser Debug**
   - Use browser dev tools
   - Check network requests
   - Monitor console errors

### Rollback Procedures

1. **Vercel Rollback**
   - Go to Deployments tab
   - Click "Promote to Production"
   - Select previous deployment

2. **Database Rollback**
   - Use Supabase PITR
   - Restore from backup
   - Verify data integrity

3. **Environment Rollback**
   - Revert environment variables
   - Clear caches
   - Restart services

## Security Considerations

### Environment Security

1. **Secrets Management**
   - Use Vercel Environment Variables
   - Never commit secrets to Git
   - Rotate keys regularly

2. **Access Control**
   - Limit deployment access
   - Use 2FA for accounts
   - Monitor access logs

### Application Security

1. **Headers**
   - Set security headers
   - Enable HTTPS only
   - Configure CORS properly

2. **Authentication**
   - Use secure authentication
   - Implement rate limiting
   - Monitor failed attempts

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [TALHub Help Page](/help)

For additional support, contact the development team or check the help page.
