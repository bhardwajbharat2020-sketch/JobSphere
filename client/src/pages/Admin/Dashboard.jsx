import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminService, jobService, applicationService } from '../../services';
import { Users, Briefcase, FileText, UserCheck, Check, X, Ban, ArrowLeft, Eye, TrendingUp, BarChart3 } from 'lucide-react';
import Card from '../../components/UI/Card';
import AdminLayout from '../../components/Layout/AdminLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadPendingRecruiters();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRecruiters = async () => {
    try {
      const response = await adminService.getUsers({ role: 'recruiter' });
      const pending = response.data.filter(u => !u.isApproved);
      setPendingRecruiters(pending);
    } catch (error) {
      console.error('Error loading pending recruiters:', error);
    }
  };

  const handleApproveRecruiter = async (userId, isApproved) => {
    try {
      await adminService.approveRecruiter(userId, isApproved);
      toast.success(`Recruiter ${isApproved ? 'approved' : 'rejected'} successfully`);
      setPendingRecruiters(pendingRecruiters.filter(r => r._id !== userId));
      loadStats();
    } catch (error) {
      toast.error('Failed to update recruiter status');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      const response = await adminService.banUser(userId);
      setModalData(modalData.map(u => u._id === userId ? { ...u, isApproved: response.data.isApproved } : u));
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobService.deleteJob(jobId);
      setModalData(modalData.filter(j => j._id !== jobId));
      toast.success('Job deleted successfully');
      loadStats();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      await jobService.updateJob(job._id, { isActive: !job.isActive });
      setModalData(modalData.map(j => j._id === job._id ? { ...j, isActive: !j.isActive } : j));
      toast.success(`Job ${job.isActive ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const openModal = async (type) => {
    setModalType(type);
    setModalLoading(true);
    setShowModal(true);

    try {
      let response;
      switch (type) {
        case 'users':
          response = await adminService.getUsers();
          setModalData(response.data);
          break;
        case 'candidates':
          response = await adminService.getUsers({ role: 'candidate' });
          setModalData(response.data);
          break;
        case 'recruiters':
          response = await adminService.getUsers({ role: 'recruiter' });
          setModalData(response.data);
          break;
        case 'jobs':
          response = await adminService.getJobs();
          setModalData(response.data);
          break;
        case 'applications':
          response = await applicationService.getApplications();
          setModalData(response.data);
          break;
        case 'pending':
          response = await adminService.getUsers({ role: 'recruiter' });
          setModalData(response.data.filter(u => !u.isApproved));
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4 text-lg">Loading dashboard...</p>
      </div>
    </div>
  );
  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg">
        <p className="text-red-600 text-lg font-semibold">Failed to load stats</p>
        <button onClick={loadStats} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your platform with powerful insights</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Real-time Analytics</span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: stats.users.total, icon: Users, color: 'blue', type: 'users' },
            { label: 'Total Jobs', value: stats.jobs.total, icon: Briefcase, color: 'green', type: 'jobs' },
            { label: 'Applications', value: stats.applications.total, icon: FileText, color: 'purple', type: 'applications' },
            { label: 'Pending Approvals', value: stats.users.pendingApprovals, icon: UserCheck, color: 'yellow', type: 'pending' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600 hover:border-blue-500',
              green: 'from-green-500 to-green-600 hover:border-green-500',
              purple: 'from-purple-500 to-purple-600 hover:border-purple-500',
              yellow: 'from-yellow-500 to-yellow-600 hover:border-yellow-500',
            };
            const iconColors = {
              blue: 'text-blue-600',
              green: 'text-green-600',
              purple: 'text-purple-600',
              yellow: 'text-yellow-600',
            };

            return (
              <motion.div
                key={stat.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openModal(stat.type)}
                className="cursor-pointer group"
              >
                <Card hover className="p-6 border-2 border-transparent transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* User Breakdown & Application Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">User Breakdown</h2>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div
                  onClick={() => openModal('candidates')}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="text-gray-700 font-medium">Candidates</span>
                  </div>
                  <span className="font-bold text-blue-600 text-lg group-hover:scale-110 transition-transform">
                    {stats.users.candidates} →
                  </span>
                </div>
                <div
                  onClick={() => openModal('recruiters')}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg cursor-pointer hover:from-green-100 hover:to-green-200 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <span className="text-gray-700 font-medium">Recruiters</span>
                  </div>
                  <span className="font-bold text-green-600 text-lg group-hover:scale-110 transition-transform">
                    {stats.users.recruiters} →
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Application Status</h2>
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Applied', value: stats.applications.applied, color: 'yellow', bg: 'from-yellow-50 to-yellow-100' },
                  { label: 'Shortlisted', value: stats.applications.shortlisted, color: 'green', bg: 'from-green-50 to-green-100' },
                  { label: 'Rejected', value: stats.applications.rejected, color: 'red', bg: 'from-red-50 to-red-100' },
                ].map((status, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 bg-gradient-to-r ${status.bg} rounded-lg`}>
                    <span className="text-gray-700 font-medium">{status.label}</span>
                    <span className={`font-bold text-${status.color}-600 text-lg`}>{status.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pending Recruiter Approvals</h2>
                <p className="text-gray-600 mt-1">Review and approve new recruiter accounts</p>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full text-sm font-bold shadow-lg">
                {pendingRecruiters.length} pending
              </span>
            </div>
            {pendingRecruiters.length === 0 ? (
              <div className="text-center py-12">
                <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">All caught up! No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRecruiters.map((recruiter) => (
                  <motion.div
                    key={recruiter._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-2 border-gray-200 rounded-xl p-5 flex justify-between items-center hover:border-yellow-400 hover:shadow-lg transition-all bg-gradient-to-r from-white to-yellow-50/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                        {recruiter.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{recruiter.name}</h3>
                        <p className="text-gray-600 text-sm">{recruiter.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApproveRecruiter(recruiter._id, true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleApproveRecruiter(recruiter._id, false)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Comprehensive Modal */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200"
            >
              {/* Modal Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-6 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {modalType === 'users' && 'All Users'}
                      {modalType === 'candidates' && 'All Candidates'}
                      {modalType === 'recruiters' && 'All Recruiters'}
                      {modalType === 'jobs' && 'All Jobs'}
                      {modalType === 'applications' && 'All Applications'}
                      {modalType === 'pending' && 'Pending Approvals'}
                    </h2>
                    <p className="text-blue-100 mt-2 flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{modalData.length} {modalType === 'applications' || modalType === 'jobs' ? 'records' : 'users'} found</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition backdrop-blur-sm"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              {modalLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        {(modalType === 'users' || modalType === 'candidates' || modalType === 'recruiters' || modalType === 'pending') && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </>
                        )}
                        {modalType === 'jobs' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </>
                        )}
                        {modalType === 'applications' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(modalType === 'users' || modalType === 'candidates' || modalType === 'recruiters' || modalType === 'pending') && (
                        modalData.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4 capitalize">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === 'candidate' ? 'bg-blue-100 text-blue-700' :
                                user.role === 'recruiter' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {user.role === 'recruiter' ? (
                                user.isApproved ? (
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Approved</span>
                                ) : (
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>
                                )
                              ) : (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Active</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {user.role !== 'admin' && (
                                <button 
                                  onClick={() => handleBanUser(user._id)} 
                                  className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs"
                                >
                                  {user.isApproved ? 'Ban' : 'Unban'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                      {modalType === 'jobs' && (
                        modalData.map((job) => (
                          <tr key={job._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{job.title}</td>
                            <td className="px-6 py-4">{job.company}</td>
                            <td className="px-6 py-4">{job.location}</td>
                            <td className="px-6 py-4">{job.applicationsCount}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs ${
                                job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {job.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleToggleJobStatus(job)} 
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                >
                                  {job.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button 
                                  onClick={() => handleDeleteJob(job._id)} 
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                      {modalType === 'applications' && (
                        modalData.map((app) => (
                          <tr key={app._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{app.candidateId?.name || 'N/A'}</td>
                            <td className="px-6 py-4">{app.jobId?.title || 'N/A'}</td>
                            <td className="px-6 py-4">{app.jobId?.company || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {modalData.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-gray-600 text-lg">No data available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
