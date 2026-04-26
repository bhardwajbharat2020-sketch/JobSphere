import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Briefcase, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { applicationService, jobService } from '../../services';
import useAuthStore from '../../store/authStore';
import Card from '../../components/UI/Card';

const CandidateDashboard = () => {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appsRes, recommendedRes] = await Promise.all([
        applicationService.getApplications(),
        jobService.getRecommendedJobs().catch(() => ({ data: [] })),
      ]);
      setApplications(appsRes.data);
      setRecommendedJobs(recommendedRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await applicationService.withdrawApplication(applicationId);
      setApplications(applications.filter(app => app._id !== applicationId));
      toast.success('Application withdrawn successfully');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/candidate/profile" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Update Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applied</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <Briefcase className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.applied}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Shortlisted</p>
              <p className="text-3xl font-bold text-green-600">{stats.shortlisted}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? Math.round((stats.shortlisted / stats.total) * 100) : 0}% success rate
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-xs text-gray-500 mt-1">Keep trying!</p>
            </div>
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Applications</h2>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse Jobs →
          </Link>
        </div>
        {applications.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No applications yet. Start applying to jobs!</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{app.jobId?.title || 'Unknown Job'}</h3>
                    <p className="text-gray-600">{app.jobId?.company || 'Unknown Company'}</p>
                    <p className="text-gray-500 text-sm mt-1">{app.jobId?.location}</p>
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
                      <button 
                        onClick={() => handleWithdraw(app._id)} 
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        title="Withdraw Application"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Withdraw</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      {recommendedJobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recommended Jobs for You</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Jobs →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendedJobs.slice(0, 6).map((job) => {
              const matchScore = job.matchScore || 0;
              const badgeColor = matchScore >= 80 ? 'bg-green-100 text-green-700' :
                                matchScore >= 60 ? 'bg-blue-100 text-blue-700' :
                                matchScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-100 text-slate-700';
              
              return (
                <div key={job._id} className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[#0F172A]">{job.title}</h3>
                      <p className="text-[#2563EB] font-medium">{job.company}</p>
                      <p className="text-slate-600 text-sm">{job.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}>
                      {matchScore}% Match
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Link 
                      to={`/jobs/${job._id}`} 
                      className="flex-1 px-4 py-2.5 border-2 border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-[#2563EB] hover:text-white text-center text-sm font-medium transition-all"
                    >
                      View Details
                    </Link>
                    <Link 
                      to={`/jobs/${job._id}#apply`} 
                      className="flex-1 px-4 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] text-center text-sm font-medium transition-all"
                    >
                      Quick Apply
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
