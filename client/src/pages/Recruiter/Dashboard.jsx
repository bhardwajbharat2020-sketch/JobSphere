import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Briefcase, Users, TrendingUp, Check, X, Edit, Trash2, Clock, Plus } from 'lucide-react';
import { jobService, applicationService } from '../../services';
import Card from '../../components/UI/Card';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    skills: '',
    salary: { min: 0, max: 0 },
    jobType: 'full-time',
    experience: 'entry',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobService.getMyJobs(),
        applicationService.getApplications(),
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobService.deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      skills: job.skills.join(', '),
      salary: job.salary,
      jobType: job.jobType,
      experience: job.experience,
    });
    setShowEditModal(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...editForm,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s),
      };
      await jobService.updateJob(editingJob._id, updatedData);
      toast.success('Job updated successfully');
      setShowEditModal(false);
      setEditingJob(null);
      loadData();
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await applicationService.updateStatus(applicationId, status);
      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status } : app
      ));
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const totalApplications = applications.length;
  const activeJobs = jobs.filter(j => j.isActive).length;
  const pendingApplications = applications.filter(a => a.status === 'applied').length;
  const shortlistedApplications = applications.filter(a => a.status === 'shortlisted').length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4 text-lg">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Recruiter Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your jobs and applications</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/recruiter/post-job"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Post New Job</span>
            </Link>
          </motion.div>
        </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
              <p className="text-xs text-gray-500 mt-1">{activeJobs} active</p>
            </div>
            <Briefcase className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold text-green-600">{activeJobs}</p>
              <p className="text-xs text-gray-500 mt-1">{jobs.length - activeJobs} inactive</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applicants</p>
              <p className="text-3xl font-bold text-purple-600">{totalApplications}</p>
              <p className="text-xs text-gray-500 mt-1">
                {applications.filter(a => a.status === 'applied').length} pending
              </p>
            </div>
            <Users className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Application Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Application Summary</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingApplications}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-green-600">{shortlistedApplications}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter(a => a.status === 'rejected').length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Applications</h2>
          <Link to="/recruiter/applicants" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {applications.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No applications yet</p>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 5).map((app) => (
              <div key={app._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{app.candidateId?.name}</h3>
                    <p className="text-gray-600 text-sm">{app.jobId?.title}</p>
                    {app.coverLetter && (
                      <p className="text-gray-700 text-sm mt-2 line-clamp-2">{app.coverLetter}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status}
                    </span>
                    {app.status === 'applied' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleUpdateApplicationStatus(app._id, 'shortlisted')} 
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                          title="Shortlist"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')} 
                          className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Jobs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Posted Jobs</h2>
          <Link to="/recruiter/post-job" className="text-blue-600 hover:text-blue-700 font-medium">
            Post New Job →
          </Link>
        </div>
        {jobs.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No jobs posted yet</p>
        ) : (
          <div className="space-y-4">
            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-600">{job.company} • {job.location}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{job.applicationsCount} applications</span>
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/recruiter/applicants/${job._id}`} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      View Applicants
                    </Link>
                    <button 
                      onClick={() => handleEditJob(job)} 
                      className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                      title="Edit Job"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job._id)} 
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      title="Delete Job"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Job Modal */}
      {showEditModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Edit Job</h2>
              <form onSubmit={handleUpdateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
                    <input
                      type="number"
                      value={editForm.salary.min}
                      onChange={(e) => setEditForm({ ...editForm, salary: { ...editForm.salary, min: parseInt(e.target.value) } })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                    <input
                      type="number"
                      value={editForm.salary.max}
                      onChange={(e) => setEditForm({ ...editForm, salary: { ...editForm.salary, max: parseInt(e.target.value) } })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={editForm.skills}
                    onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="4"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      value={editForm.jobType}
                      onChange={(e) => setEditForm({ ...editForm, jobType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <select
                      value={editForm.experience}
                      onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
