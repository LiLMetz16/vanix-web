# Vanix - Software & Design Studio Website

A modern, full-stack Next.js website for Vanix freelance company with **MySQL authentication** and **portfolio management**.

## ✨ Features

### 🔐 Authentication System
- Secure JWT-based authentication with httpOnly cookies
- User registration and login
- Password hashing with bcryptjs
- Protected routes and API endpoints
- Role-based access control (user/admin)

### 🎨 Portfolio Gallery
- Beautiful photo gallery for showcasing work
- Category filtering (Website, App, Design, UI Kit, Other)
- Featured items support
- Tag system
- Responsive grid layout

### 🛍️ E-commerce Features
- Product catalog with detailed pages
- Shopping cart functionality
- Order management
- Product images and descriptions

### 💎 Design
- Glassmorphism UI with backdrop blur
- Animated gradient backgrounds
- Responsive for all devices
- Modern color scheme
- Smooth transitions

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Create database
mysql -u root -p -e "CREATE DATABASE vanix_db;"

# Run migrations
npx prisma generate
npx prisma db push

# Seed database (optional - creates admin user and sample portfolio)
npm run prisma:seed

# Start development
npm run dev
```

Visit `http://localhost:3000` 🎉

**Default admin credentials** (if you ran seed):
- Email: `admin@vanix.com`
- Password: `admin123`

## 📖 Full Documentation

See **[SETUP.md](./SETUP.md)** for:
- Detailed installation instructions
- Database configuration
- API documentation
- Deployment guide
- Troubleshooting

## 🗄️ Tech Stack

- Next.js 14 + React 18 + TypeScript
- MySQL + Prisma ORM
- JWT Authentication
- Tailwind CSS
- bcryptjs for password hashing

## 📁 Key Files

- `app/api/auth/` - Authentication endpoints
- `app/api/portfolio/` - Portfolio management
- `app/portfolio/page.tsx` - Portfolio gallery page
- `prisma/schema.prisma` - Database schema
- `lib/auth.ts` - JWT utilities

## 🎯 What's New

✅ **MySQL instead of Supabase** - Full control over your database  
✅ **Portfolio page** - New gallery added to navigation  
✅ **Original design preserved** - All logos, colors, and images intact  
✅ **Secure authentication** - JWT with httpOnly cookies

## 📞 Support

Check [SETUP.md](./SETUP.md) for troubleshooting or contact:
- Anton Kabakov
- Viktor Kanev

---

**Built with ❤️ by Anton Kabakov & Viktor Kanev**
