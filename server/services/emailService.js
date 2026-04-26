const transporter = require('../config/nodemailer');

// Send OTP verification email
exports.sendOTPEmail = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Verify Your JobSphere Account - OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563EB, #1D4ED8); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">JobSphere</h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0;">Your Career Journey Starts Here</p>
          </div>
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1F2937; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">Thank you for joining JobSphere! To complete your registration, please use the following OTP code:</p>
            <div style="background: #F3F4F6; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
              <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">Your OTP Code</p>
              <h1 style="color: #2563EB; font-size: 48px; margin: 0; letter-spacing: 10px; font-weight: bold;">${otp}</h1>
            </div>
            <p style="color: #4B5563; font-size: 14px;"><strong>This code expires in 10 minutes.</strong></p>
            <p style="color: #4B5563; font-size: 14px; line-height: 1.6;">If you didn't create an account with JobSphere, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 14px;">Best regards,<br/><strong style="color: #2563EB;">JobSphere Team</strong></p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 12px;">
            <p>© ${new Date().getFullYear()} JobSphere. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Send welcome email after verification
exports.sendWelcomeEmail = async (email, name, role) => {
  try {
    const roleText = {
      candidate: 'Job Seeker',
      recruiter: 'Recruiter',
      admin: 'Administrator',
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Welcome to JobSphere - Your Account is Ready!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563EB, #1D4ED8); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Welcome to JobSphere!</h1>
          </div>
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1F2937; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">Congratulations! Your account has been successfully verified. Welcome to the JobSphere community!</p>
            
            <div style="background: #F0F9FF; padding: 20px; border-left: 4px solid #2563EB; margin: 30px 0; border-radius: 4px;">
              <p style="color: #0C4A6E; margin: 0; font-size: 16px;"><strong>Account Type:</strong> ${roleText[role] || role}</p>
            </div>

            <h3 style="color: #1F2937;">What's Next?</h3>
            ${role === 'candidate' ? `
              <ul style="color: #4B5563; line-height: 2;">
                <li>Complete your profile to increase visibility</li>
                <li>Upload your resume for AI-powered skill extraction</li>
                <li>Browse thousands of job opportunities</li>
                <li>Get personalized job recommendations</li>
                <li>Apply to jobs with one click</li>
              </ul>
            ` : role === 'recruiter' ? `
              <ul style="color: #4B5563; line-height: 2;">
                <li>Complete your company profile</li>
                <li>Post your first job opening</li>
                <li>Browse talented candidates</li>
                <li>Manage applications from your dashboard</li>
              </ul>
            ` : `
              <ul style="color: #4B5563; line-height: 2;">
                <li>Access your admin dashboard</li>
                <li>Monitor platform activity</li>
                <li>Manage users and jobs</li>
              </ul>
            `}
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.FRONTEND_URL}/login" style="background: #2563EB; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Get Started</a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 14px;">If you have any questions, feel free to contact our support team.</p>
              <p style="color: #6B7280; font-size: 14px;">Best regards,<br/><strong style="color: #2563EB;">JobSphere Team</strong></p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 12px;">
            <p>© ${new Date().getFullYear()} JobSphere. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send email when candidate applies to job
exports.sendApplicationNotification = async (recruiterEmail, candidateName, jobTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recruiterEmail,
      subject: `New Application Received: ${jobTitle}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>${candidateName}</strong> has applied for the position <strong>${jobTitle}</strong>.</p>
        <p>Login to your dashboard to review the application.</p>
        <br/>
        <p>Best regards,<br/>Job Portal Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Application notification email sent');
  } catch (error) {
    console.error('Error sending application notification:', error);
  }
};

// Send email when application status changes
exports.sendStatusUpdateNotification = async (candidateEmail, candidateName, jobTitle, status) => {
  try {
    const statusMessages = {
      shortlisted: 'Congratulations! You have been shortlisted',
      rejected: 'Thank you for your interest',
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidateEmail,
      subject: `Application Status Update: ${jobTitle}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Dear <strong>${candidateName}</strong>,</p>
        <p>Your application for <strong>${jobTitle}</strong> has been <strong>${status}</strong>.</p>
        <p>${status === 'shortlisted' ? 'The recruiter will contact you soon for the next steps.' : 'We encourage you to apply for other positions that match your skills.'}</p>
        <br/>
        <p>Best regards,<br/>Job Portal Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Status update notification email sent');
  } catch (error) {
    console.error('Error sending status update notification:', error);
  }
};
