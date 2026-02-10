# Vanix Website - Complete Setup Guide

## 🎉 What's New

✅ **MySQL Database** - Replaced Supabase with MySQL using Prisma ORM
✅ **JWT Authentication** - Secure authentication system with httpOnly cookies
✅ **Portfolio Page** - New portfolio gallery page added to navigation
✅ **All Original Design Preserved** - Logos, colors, and product images intact

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **MySQL** database server running (local or remote)
- **npm** or **yarn** package manager

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd vanix-web-complete
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure your database:

```env
# MySQL Database URL
# Format: mysql://username:password@host:port/database_name
DATABASE_URL="mysql://root:yourpassword@localhost:3306/vanix_db"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

### 3. Create MySQL Database

```sql
CREATE DATABASE vanix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 🗄️ Database Schema

The application uses three main tables:

### Users Table
- `id` - UUID primary key
- `email` - Unique user email
- `username` - Unique username
- `password` - Bcrypt hashed password
- `role` - User role (user/admin)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Orders Table
- `id` - UUID primary key
- `userId` - Foreign key to users
- `items` - JSON array of cart items
- `totalEUR` - Order total in EUR
- `status` - Order status (pending/completed/cancelled)
- `createdAt` - Order creation timestamp
- `updatedAt` - Last update timestamp

### Portfolio Items Table
- `id` - UUID primary key
- `userId` - Foreign key to users
- `title` - Portfolio item title
- `description` - Item description
- `imageUrl` - Image URL/path
- `category` - Category (Website/App/Design/UI Kit/Other)
- `tags` - JSON array of tags
- `featured` - Boolean for featured items
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

---

## 🔐 Authentication System

### Features
- ✅ Secure password hashing with bcryptjs
- ✅ JWT-based authentication with httpOnly cookies
- ✅ Protected API routes
- ✅ Session management
- ✅ Role-based access (user/admin)

### API Endpoints

**Register New User**
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

**Login**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Get Current User**
```bash
GET /api/auth/me
```

**Logout**
```bash
POST /api/auth/logout
```

---

## 📸 Portfolio System

### Features
- ✅ Image gallery display
- ✅ Category filtering
- ✅ Featured items
- ✅ Tags support
- ✅ Responsive grid layout

### API Endpoints

**Get Portfolio Items**
```bash
GET /api/portfolio
# Optional query params:
# ?featured=true
# ?category=Website
```

**Create Portfolio Item** (Requires Authentication)
```bash
POST /api/portfolio
{
  "title": "E-commerce Website",
  "description": "Modern online store",
  "imageUrl": "/portfolio/ecommerce.jpg",
  "category": "Website",
  "tags": ["Next.js", "Tailwind", "Stripe"],
  "featured": true
}
```

---

## 🎨 Design Preservation

All original design elements have been preserved:

- ✅ Vanix logo (`/public/logo.png`)
- ✅ Product images in `/public/shop/`
- ✅ Color scheme (indigo-pink-emerald gradient)
- ✅ Glassmorphism navbar
- ✅ Animated background gradient
- ✅ All typography and spacing

---

## 📁 Project Structure

```
vanix-web-complete/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── portfolio/     # Portfolio endpoints
│   ├── account/           # User account page
│   ├── contact/           # Contact page
│   ├── portfolio/         # NEW Portfolio gallery page
│   ├── shop/              # Shop and product pages
│   └── page.tsx           # Homepage
├── lib/
│   ├── auth.ts            # JWT authentication utilities
│   ├── prisma.ts          # Prisma client singleton
│   └── types/
│       └── products.ts    # Product type definitions
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   ├── logo.png           # Vanix logo
│   └── shop/              # Product images
└── .env.example           # Environment variables template
```

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma Client
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## 🚀 Deployment

### Environment Setup

1. Set up MySQL database on your hosting provider
2. Configure environment variables on your platform
3. Run database migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Recommended Platforms

- **Vercel** - Best for Next.js (with PlanetScale or Railway for MySQL)
- **Railway** - Includes MySQL database
- **DigitalOcean** - Full control with App Platform
- **Render** - Free tier with managed databases

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS for production
- [ ] Set up proper CORS if needed
- [ ] Configure database backups
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

---

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db push --skip-generate
```

If you see errors:
1. Check MySQL is running: `mysql --version`
2. Verify DATABASE_URL in `.env`
3. Ensure database exists
4. Check user permissions

### Prisma Issues

```bash
# Reset and regenerate
rm -rf node_modules
rm -rf .next
npm install
npx prisma generate
```

### Authentication Issues

Check browser cookies:
1. Open DevTools → Application → Cookies
2. Look for `vanix_auth_token`
3. If missing, try logging in again

---

## 📝 Adding Portfolio Items

To add portfolio items to the database, you can:

1. **Use Prisma Studio** (recommended for development):
   ```bash
   npx prisma studio
   ```
   Then add items through the GUI

2. **Use the API endpoint** (requires authentication):
   ```bash
   curl -X POST http://localhost:3000/api/portfolio \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Modern E-commerce",
       "description": "A beautiful online store",
       "imageUrl": "/portfolio/store.jpg",
       "category": "Website",
       "tags": ["Next.js", "Stripe"],
       "featured": true
     }'
   ```

---

## 🎯 Next Steps

Now that your Vanix website is set up:

1. **Customize branding** - Update logos and colors in `/public/` and `globals.css`
2. **Add products** - Edit `/lib/types/products.ts`
3. **Configure email** - Set up contact form email delivery
4. **Add portfolio items** - Showcase your work
5. **Set up payments** - Integrate Stripe or PayPal for checkout
6. **Deploy** - Choose a hosting platform and go live!

---

## 📞 Support

If you encounter any issues:
- Check the troubleshooting section above
- Review the Prisma docs: https://prisma.io/docs
- Check Next.js docs: https://nextjs.org/docs

---

**Built with ❤️ by Anton Kabakov & Viktor Kanev**
