import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MapPin, DollarSign, Briefcase, Clock, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { jobService, applicationService } from '../../services';
import useAuthStore from '../../store/authStore';
import Card from '../../components/UI/Card';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplySection, setShowApplySection] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await jobService.getJob(id);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      // Save the job page URL to redirect back after login
      const redirectPath = `/jobs/${id}`;
      localStorage.setItem('redirectAfterLogin', redirectPath);
      console.log('Saving redirect URL:', redirectPath);
      toast('Please login to apply for this job', {
        icon: '🔐',
        duration: 3000,
      });
      navigate('/login');
      return;
    }

    if (user?.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await applicationService.applyToJob(id, coverLetter);
      toast.success('Application submitted successfully!');
      setShowApplySection(false);
      loadJob(); // Reload to check if already applied
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4 text-lg">Loading job details...</p>
      </div>
    </div>
  );
  if (!job) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-xl">Job not found</p>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/jobs" className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white shadow-md transition-all text-gray-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Jobs</span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <p className="text-xl text-blue-600 font-semibold">{job.company}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center space-x-3 text-gray-700">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>{job.experience}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {/* Apply Section - Visible to all users */}
        <div className="border-t pt-8">
          {!isAuthenticated ? (
            // Not logged in - Show login prompt
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                <LogIn className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Interested in this position?</h3>
                <p className="text-gray-600 mb-6">Login to apply for this job and track your applications</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={() => {
                        const redirectPath = `/jobs/${id}`;
                        localStorage.setItem('redirectAfterLogin', redirectPath);
                        console.log('Saving redirect URL:', redirectPath);
                        navigate('/login');
                      }}
                      className="px-8 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <LogIn className="h-5 w-5" />
                      Login to Apply
                    </button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="px-8 py-3 bg-white text-[#2563EB] border-2 border-[#2563EB] rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center gap-2"
                    >
                      <UserPlus className="h-5 w-5" />
                      Create Account
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : user?.role !== 'candidate' ? (
            // Logged in but not a candidate
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="bg-orange-50 rounded-xl p-8 border border-orange-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Only candidates can apply</h3>
                <p className="text-gray-600">You are logged in as a {user?.role}. Please login as a candidate to apply for jobs.</p>
              </div>
            </motion.div>
          ) : showApplySection ? (
            // Candidate - Show application form
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4">Apply for this Position</h2>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a cover letter (optional)..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 bg-[#2563EB] text-white py-3 rounded-lg hover:bg-[#1D4ED8] transition disabled:opacity-50 font-semibold shadow-lg"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => setShowApplySection(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            // Candidate - Show Apply button
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => setShowApplySection(true)}
                  className="px-12 py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Apply Now
                </button>
              </motion.div>
              <p className="text-gray-600 mt-3">Click to submit your application</p>
            </motion.div>
          )}
        </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetails;
