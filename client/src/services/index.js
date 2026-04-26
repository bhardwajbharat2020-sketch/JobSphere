import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    // Don't store token on registration - user needs to verify OTP first
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resendOTP: async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const jobService = {
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getJob: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getRecommendedJobs: async () => {
    const response = await api.get('/jobs/recommended');
    return response.data;
  },

  getMyJobs: async () => {
    const response = await api.get('/jobs/recruiter/my-jobs');
    return response.data;
  },
};

export const applicationService = {
  applyToJob: async (jobId, coverLetter) => {
    const response = await api.post(`/applications/apply/${jobId}`, { coverLetter });
    return response.data;
  },

  getApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  updateStatus: async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  },

  getJobApplicants: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  withdrawApplication: async (applicationId) => {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },
};

export const userService = {
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  uploadResume: async (userId, file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post(`/users/${userId}/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadResumeByUrl: async (userId, resumeUrl, resumeText) => {
    const response = await api.post(`/users/${userId}/resume`, { resumeUrl, resumeText });
    return response.data;
  },

  getProfileCompleteness: async (userId) => {
    const response = await api.get(`/users/${userId}/completeness`);
    return response.data;
  },
};

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getJobs: async (params = {}) => {
    const response = await api.get('/admin/jobs', { params });
    return response.data;
  },

  approveRecruiter: async (userId, isApproved) => {
    const response = await api.patch(`/users/${userId}/approve`, { isApproved });
    return response.data;
  },

  banUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/ban`);
    return response.data;
  },
};
