import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService } from '../../services';
import useAuthStore from '../../store/authStore';
import Card from '../../components/UI/Card';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
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
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobService.getMyJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobService.deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleEdit = (job) => {
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
      loadJobs();
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Jobs</h1>
        <Link to="/recruiter/post-job" className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          <span>Post New Job</span>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white p-16 rounded-xl shadow-md text-center">
          <p className="text-gray-600 text-lg mb-4">You haven't posted any jobs yet</p>
          <Link to="/recruiter/post-job" className="text-blue-600 hover:text-blue-700 font-medium">
            Post your first job →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600">{job.location} • ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</p>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{job.applicationsCount} applications</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/recruiter/applicants/${job._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View Applicants
                  </Link>
                  <button 
                    onClick={() => handleEdit(job)} 
                    className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    title="Edit Job"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(job._id)} 
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

      {/* Edit Job Modal */}
      {showEditModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-pink-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
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
  );
};

export default MyJobs;
