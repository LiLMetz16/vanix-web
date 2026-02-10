# 🗄️ MySQL Setup Guide for Windows

You're getting the error: `Can't reach database server at localhost:3306`

This means MySQL isn't running on your computer. Here's how to fix it:

---

## Option 1: Install MySQL (Recommended)

### Step 1: Download MySQL
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download **MySQL Installer for Windows**
3. Choose "mysql-installer-community" (the free one)

### Step 2: Install MySQL
1. Run the installer
2. Choose **"Developer Default"** setup type
3. Click **Next** through the configuration
4. **Important**: When it asks for a root password, remember it! You'll need it.
5. Complete the installation

### Step 3: Start MySQL Service
MySQL should auto-start, but if not:

**Method A - Services:**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "MySQL80" (or similar)
4. Right-click → Start
5. Right-click → Properties → Set Startup type to "Automatic"

**Method B - Command Line (Run as Administrator):**
```cmd
net start MySQL80
```

### Step 4: Test Connection
Open Command Prompt and run:
```cmd
mysql -u root -p
```
Enter your password. If you see `mysql>`, it's working!

### Step 5: Create Database
In the MySQL prompt:
```sql
CREATE DATABASE vanix_db;
SHOW DATABASES;
EXIT;
```

### Step 6: Update .env File
Edit your `.env` file:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/vanix_db"
```
Replace `YOUR_PASSWORD` with your MySQL root password.

### Step 7: Run Migrations
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### Step 8: Start Your App
```bash
npm run dev
```

---

## Option 2: Use XAMPP (Easier)

XAMPP includes MySQL and is easier for beginners:

### Step 1: Download XAMPP
1. Go to: https://www.apachefriends.org/
2. Download for Windows
3. Install it

### Step 2: Start MySQL
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. The status should turn green

### Step 3: Access MySQL
Click "Shell" in XAMPP Control Panel, then:
```bash
mysql -u root
```

### Step 4: Create Database
```sql
CREATE DATABASE vanix_db;
EXIT;
```

### Step 5: Update .env
```env
DATABASE_URL="mysql://root@localhost:3306/vanix_db"
```
(No password by default in XAMPP)

### Step 6: Continue
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

---

## Option 3: Use Docker (For Advanced Users)

```bash
docker run --name mysql-vanix -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=vanix_db -p 3306:3306 -d mysql:8
```

Then use:
```env
DATABASE_URL="mysql://root:password@localhost:3306/vanix_db"
```

---

## Troubleshooting

### "MySQL service won't start"
- Check if port 3306 is already in use
- Try restarting your computer
- Reinstall MySQL

### "Access denied for user 'root'"
- Double-check your password in .env
- Try resetting MySQL root password

### "Port 3306 is already in use"
Another program is using port 3306. Either:
- Stop the other program, OR
- Change MySQL port in `my.ini` file

### "Can't connect after starting MySQL"
1. Check MySQL is running: `services.msc` (Windows)
2. Test connection: `mysql -u root -p`
3. Verify .env DATABASE_URL is correct

---

## Quick Test Commands

**Check if MySQL is running:**
```cmd
# Windows
sc query MySQL80

# Or try connecting
mysql -u root -p
```

**Check if database exists:**
```sql
SHOW DATABASES;
```

**Check tables:**
```sql
USE vanix_db;
SHOW TABLES;
```

---

## What's Next?

Once MySQL is running:
1. ✅ Run `npx prisma db push`
2. ✅ Run `npm run prisma:seed`
3. ✅ Run `npm run dev`
4. ✅ Visit http://localhost:3000

You should be good to go! 🚀

---

**Still having issues?** Make sure:
- MySQL service is actually running
- Port 3306 is not blocked by firewall
- Your password in .env matches MySQL password
