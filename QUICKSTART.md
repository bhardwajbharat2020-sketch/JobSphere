# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup MongoDB
1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Whitelist IP: 0.0.0.0/0 (for development)

### Step 2: Configure Backend

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env with your credentials:
# - MONGODB_URI (from MongoDB Atlas)
# - JWT_SECRET (any random string)
# - Optional: Cloudinary & Email credentials
```

### Step 3: Seed Database

```bash
npm run seed
```

This creates:
- 1 Admin user
- 3 Recruiters (2 approved, 1 pending)
- 3 Candidates
- 5 Sample jobs
- 5 Sample applications

### Step 4: Start Backend

```bash
npm run dev
```

Backend runs on: http://localhost:5000

### Step 5: Start Frontend

Open a NEW terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### Step 6: Login & Explore!

**As Admin:**
- Email: admin@jobportal.com
- Password: admin123
- Dashboard: http://localhost:5173/admin/dashboard

**As Recruiter:**
- Email: recruiter1@techcorp.com
- Password: recruiter123
- Dashboard: http://localhost:5173/recruiter/dashboard

**As Candidate:**
- Email: candidate1@email.com
- Password: candidate123
- Dashboard: http://localhost:5173/candidate/dashboard

## 🎯 Quick Test Workflow

### 1. Login as Candidate
- View dashboard with applications
- Browse jobs at /jobs
- Apply to a new job
- Check recommended jobs

### 2. Login as Recruiter
- View dashboard
- Post a new job
- View applicants
- Shortlist/reject applications

### 3. Login as Admin
- View platform statistics
- Approve pending recruiter (recruiter3@startup.com)
- Manage users and jobs

## 🔧 Troubleshooting

**Can't connect to database?**
- Check MONGODB_URI in server/.env
- Ensure MongoDB Atlas IP whitelist includes your IP

**Frontend can't connect to backend?**
- Ensure backend is running on port 5000
- Check VITE_API_URL in client/.env

**Email not sending?**
- Email is optional for development
- Use Gmail App Password, not regular password

## 📚 Full Documentation

See README.md for complete documentation including:
- All API endpoints
- Deployment guide
- Feature list
- Project structure

---

Enjoy exploring the Job Portal! 🎉
