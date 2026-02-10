# 🚀 Quick Start Guide

Get Vanix running in 5 minutes!

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Create .env File
```bash
cp .env.example .env
```

Edit `.env` and add your MySQL credentials:
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/vanix_db"
JWT_SECRET="change-this-to-a-random-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 3: Create Database
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE vanix_db;
EXIT;
```

## Step 4: Set Up Database Schema
```bash
npx prisma generate
npx prisma db push
```

## Step 5: Seed Database (Optional)
This creates an admin account and sample portfolio items:
```bash
npm run prisma:seed
```

**Admin credentials created:**
- Email: `admin@vanix.com`
- Password: `admin123`

## Step 6: Start Development Server
```bash
npm run dev
```

## 🎉 Done!

Visit: **http://localhost:3000**

### What to Try:
1. ✅ Browse the homepage
2. ✅ Check out the Shop page
3. ✅ Visit the new Portfolio page
4. ✅ Login at `/auth` (use admin credentials if you seeded)
5. ✅ View your account at `/account`

### Next Steps:
- Add your own portfolio items via `/api/portfolio`
- Customize products in `/lib/types/products.ts`
- Change the logo in `/public/logo.png`
- Deploy (see SETUP.md for deployment guides)

---

**Need help?** Check [SETUP.md](./SETUP.md) for detailed documentation!
