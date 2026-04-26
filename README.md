# Full Stack Job Portal Web Application

A production-level job portal web application similar to LinkedIn/Naukri with modern UI and advanced features including AI-based resume parsing and job recommendations.

## 🚀 Features

### For Candidates
- ✅ Create and update professional profiles
- ✅ Upload and parse resumes (AI-powered skill extraction)
- ✅ Search and filter jobs by location, salary, skills, and keywords
- ✅ Apply to jobs with cover letters
- ✅ Track application status (Applied, Shortlisted, Rejected)
- ✅ Get AI-powered job recommendations based on skills match
- ✅ View dashboard with application statistics

### For Recruiters
- ✅ Post and manage job listings
- ✅ View and manage applicants
- ✅ Shortlist or reject applications
- ✅ View candidate profiles and resumes
- ✅ Dashboard with job and applicant statistics

### For Admins
- ✅ Platform analytics dashboard
- ✅ Manage all users (candidates & recruiters)
- ✅ Approve/reject recruiter accounts
- ✅ Monitor all job listings and applications

### Advanced Features
- 🤖 **AI Resume Parsing**: Automatic skill extraction using NLP
- 🎯 **Job Recommendations**: Skill-based matching algorithm
- 📧 **Email Notifications**: Automated emails for applications and status updates
- 🔐 **JWT Authentication**: Secure role-based access control
- 📱 **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router
- Zustand (State Management)
- React Hook Form
- Lucide React (Icons)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (Password Hashing)
- Natural.js (NLP for Resume Parsing)
- Nodemailer (Email Service)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account (for resume storage)
- Gmail account (for email notifications)

### Backend Setup

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env with your credentials:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

5. **Seed the database with sample data:**
```bash
npm run seed
```

6. **Start the backend server:**
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
echo VITE_API_URL=http://localhost:5000/api > .env
```

4. **Start the development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 👤 Sample Login Credentials

After running the seed script, you can use these credentials:

**Admin:**
- Email: admin@jobportal.com
- Password: admin123

**Recruiter (Approved):**
- Email: recruiter1@techcorp.com
- Password: recruiter123

**Candidate:**
- Email: candidate1@email.com
- Password: candidate123

## 📁 Project Structure

```
Minor/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand store
│   │   ├── App.jsx        # Main app with routing
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── scripts/          # Database seed script
│   └── index.js          # Server entry point
│
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Recruiter only)
- `PUT /api/jobs/:id` - Update job (Recruiter only)
- `DELETE /api/jobs/:id` - Delete job (Recruiter/Admin)
- `GET /api/jobs/recommended` - Get recommended jobs (Candidate only)

### Applications
- `POST /api/applications/apply/:jobId` - Apply to job
- `GET /api/applications` - Get applications
- `PATCH /api/applications/:id/status` - Update status (Recruiter)
- `GET /api/applications/job/:jobId` - Get job applicants (Recruiter)

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/jobs` - Get all jobs

### Users
- `GET /api/users` - Get users (Admin only)
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/resume` - Upload resume
- `PATCH /api/users/:id/approve` - Approve recruiter (Admin)

## 🚀 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add environment variables

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `client`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable: `VITE_API_URL` (your backend URL)

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT authentication with expiration
- Role-based authorization
- CORS protection
- Rate limiting on API routes
- Helmet.js for security headers
- Input validation

## 📝 Notes

- Email notifications require a Gmail app password
- Resume parsing works best with text-based resumes
- Job recommendations require candidates to have skills in their profile
- Recruiter accounts need admin approval before they can post jobs

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Ensure all environment variables are set
- Run `npm install` in server directory

**Frontend won't start:**
- Check VITE_API_URL in .env
- Run `npm install` in client directory
- Ensure backend is running

**Email notifications not working:**
- Use Gmail App Password, not regular password
- Enable "Less secure app access" in Gmail settings

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React, Node.js, and MongoDB
