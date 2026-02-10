# 🔐 Google OAuth Setup Guide

## What You Get

Users can now sign in with their Google account! This creates an account automatically using their Google email.

---

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Name it "Vanix Website" or similar

### 2. Enable Google+ API

1. In your project, go to **"APIs & Services" → "Library"**
2. Search for **"Google+ API"**
3. Click **"Enable"**

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services" → "OAuth consent screen"**
2. Choose **"External"** (unless you have Google Workspace)
3. Fill in required info:
   - **App name**: Vanix
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **"Save and Continue"**
5. **Scopes**: Click "Add or Remove Scopes"
   - Add: `userinfo.email`
   - Add: `userinfo.profile`
6. Click **"Save and Continue"**
7. **Test users** (for development):
   - Add your email addresses
   - Click **"Save and Continue"**

### 4. Create OAuth Credentials

1. Go to **"APIs & Services" → "Credentials"**
2. Click **"Create Credentials" → "OAuth client ID"**
3. Choose **"Web application"**
4. Name it "Vanix Website"
5. **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
6. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Click **"Create"**
8. **Copy your credentials:**
   - Client ID
   - Client Secret

### 5. Add to .env File

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 6. Update Database Schema

Run these commands to add OAuth fields to your database:

```bash
npx prisma generate
npx prisma db push
```

This adds the `googleId` and `provider` fields to the users table.

### 7. Install Dependencies

```bash
npm install next-auth
```

### 8. Test It!

1. Start your dev server: `npm run dev`
2. Go to `/auth`
3. Click **"Continue with Google"**
4. Sign in with your Google account
5. You should be redirected to `/account`

---

## How It Works

### First Time Sign In (New User)
1. User clicks "Continue with Google"
2. Google authenticates them
3. System creates a new account with:
   - Email from Google
   - Username from email (before @)
   - Role: "user" (automatically)
   - No password (OAuth only)
   - GoogleId stored

### Returning User
1. User clicks "Continue with Google"
2. System finds their existing account by email
3. Logs them in

### Linking Accounts
If someone registered with email/password first, then later signs in with Google using the same email:
- The Google account is linked to their existing account
- They can use either method to sign in

---

## Production Setup

### For Deployment

1. **Update OAuth credentials** in Google Cloud Console:
   - Add production URL to **Authorized JavaScript origins**
   - Add production callback to **Authorized redirect URIs**:
     - `https://yourdomain.com/api/auth/callback/google`

2. **Update .env** on your hosting platform:
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="your-production-secret"
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

3. **Publish OAuth App**:
   - Go to OAuth consent screen in Google Cloud
   - Submit for verification (if needed for public use)
   - Or keep it in "Testing" mode for limited users

---

## Security Features

✅ **Secure OAuth Flow**: Uses Google's secure authentication
✅ **No Password Storage**: OAuth users don't need passwords
✅ **Automatic Account Creation**: New users created seamlessly
✅ **Account Linking**: Links OAuth to existing email accounts
✅ **Role-Based Access**: OAuth users get "user" role by default

---

## Troubleshooting

### "Redirect URI Mismatch" Error
- Make sure callback URL in Google Cloud matches exactly:
  - Dev: `http://localhost:3000/api/auth/callback/google`
  - Prod: `https://yourdomain.com/api/auth/callback/google`
- Check for trailing slashes
- Check http vs https

### "Access Blocked" Error
- Add your email to test users in OAuth consent screen
- Or publish your app

### "Invalid Client" Error
- Double-check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Make sure there are no extra spaces
- Restart dev server after changing .env

### User Created But Can't Sign In
- Check database: `SELECT * FROM users WHERE provider = 'google';`
- Make sure googleId is saved
- Try signing in again

---

## Testing Checklist

- [ ] Can sign in with Google (new user)
- [ ] New account created in database
- [ ] Redirected to /account after sign in
- [ ] Username shown in navbar
- [ ] Can access account page
- [ ] Can logout
- [ ] Can sign in again with same Google account
- [ ] Existing email users can link Google account

---

## Features

### What Users See:
- **"Continue with Google" button** on auth page
- Clean Google logo
- One-click authentication
- Automatic account creation

### What Admins Get:
- Users with `provider: "google"` in database
- GoogleId stored for account linking
- Email and username from Google
- Automatic "user" role assignment

---

## Optional: Add More OAuth Providers

The system is ready for more providers! You can easily add:
- GitHub
- Facebook  
- Twitter/X
- Apple
- Microsoft

Just follow the NextAuth docs and add more providers to:
`/app/api/auth/[...nextauth]/route.ts`

---

**Need help?** Check [NextAuth.js Documentation](https://next-auth.js.org/)
