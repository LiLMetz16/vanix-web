# 🔐 Admin Account Credentials

## Default Admin Account

After running the seed script (`npm run prisma:seed`), the following admin account is created:

### Credentials:
```
Email: admin@vanix.com
Password: admin123
Role: admin
```

---

## How to Login

1. Go to `/auth` page
2. Click **"Login"** tab
3. Enter:
   - **Email**: `admin@vanix.com`
   - **Password**: `admin123`
4. Click **"Sign In"**

You will be redirected to `/account` with admin privileges.

---

## Admin Features

As an admin, you get access to:

✅ **Dashboard Tab** - View statistics:
- Total Users
- Total Orders
- Total Revenue
- Recent Orders list

✅ **My Account** - Profile management

✅ **Logout** - Sign out securely

---

## ⚠️ IMPORTANT - Change Password!

**For production, you MUST change this password!**

### How to Change:
1. Login as admin
2. Go to "My Account"
3. Scroll to "Change Password" section
4. Enter current password: `admin123`
5. Enter new secure password
6. Confirm new password
7. Click "Change Password"

---

## Creating More Admin Accounts

### Option 1: Via Database (Recommended for first admin)
Already done with seed script.

### Option 2: Via Database Directly
```sql
-- Update existing user to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'newemail@example.com';
```

### Option 3: Create New Admin via Prisma Studio
```bash
npx prisma studio
```
1. Open `users` table
2. Click "Add record"
3. Fill in:
   - email: `youremail@example.com`
   - username: `yourusername`
   - password: [use bcrypt hash]
   - role: `admin`
4. Save

---

## Testing Admin Features

### Test Dashboard:
1. Login as admin
2. Click account dropdown (👤)
3. Click "Dashboard"
4. You should see statistics

### Test Regular User:
1. Create new account via `/auth`
2. Login
3. Account dropdown shows "Order History" instead of "Dashboard"

---

## Forgot Password?

Since there's no email reset (yet), you can:

1. **Reset via Database:**
```bash
npx prisma studio
```
Open users table, find admin, update password with new bcrypt hash.

2. **Or Use SQL:**
```sql
-- Generate new hash first using bcrypt online tool or Node.js
-- Then:
UPDATE users 
SET password = 'new_bcrypt_hash_here' 
WHERE email = 'admin@vanix.com';
```

---

## Security Notes

✅ Password is hashed with bcrypt (10 rounds)
✅ Sessions use JWT with httpOnly cookies
✅ Admin role is checked server-side
✅ Protected API routes verify admin status

⚠️ **Never share admin credentials**
⚠️ **Change default password in production**
⚠️ **Use strong passwords**

---

**Happy administrating!** 🎉
