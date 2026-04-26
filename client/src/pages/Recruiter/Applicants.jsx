import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, FileText, Check, X, ArrowLeft } from 'lucide-react';
import { applicationService } from '../../services';
import Card from '../../components/UI/Card';

const Applicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  const loadApplicants = async () => {
    try {
      const response = await applicationService.getJobApplicants(jobId);
      setApplicants(response.data);
    } catch (error) {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await applicationService.updateStatus(applicationId, status);
      setApplicants(applicants.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4 text-lg">Loading applicants...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to="/recruiter/my-jobs" className="p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white shadow-md transition-all">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Link>
          </motion.div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Job Applicants
            </h1>
            <p className="text-gray-600 mt-2">Review and manage applications</p>
          </div>
        </motion.div>
        {applicants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="p-16 text-center">
              <p className="text-gray-600 text-lg">No applicants yet</p>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{app.candidateId?.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-600 mt-2">
                    <Mail className="h-4 w-4" />
                    <span>{app.candidateId?.email}</span>
                  </div>
                  {app.candidateId?.profile?.resumeUrl && (
                    <a href={app.candidateId.profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-2">
                      <FileText className="h-4 w-4" />
                      <span>View Resume</span>
                    </a>
                  )}
                  {app.coverLetter && (
                    <p className="text-gray-700 mt-3 text-sm">{app.coverLetter}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {app.candidateId?.profile?.skills?.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status}
                  </span>
                  {app.status === 'applied' && (
                    <div className="flex space-x-2">
                      <button onClick={() => updateStatus(app._id, 'shortlisted')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        Shortlist
                      </button>
                      <button onClick={() => updateStatus(app._id, 'rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
