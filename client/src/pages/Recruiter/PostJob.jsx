import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { jobService } from '../../services';
import useAuthStore from '../../store/authStore';
import Card from '../../components/UI/Card';

const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const skillsArray = data.skills.split(',').map(s => s.trim()).filter(s => s);
      await jobService.createJob({
        ...data,
        skills: skillsArray,
        salary: {
          min: parseInt(data.salaryMin),
          max: parseInt(data.salaryMax),
        },
      });
      toast.success('Job posted successfully!');
      navigate('/recruiter/my-jobs');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <motion.button 
            onClick={() => navigate('/recruiter/my-jobs')} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white shadow-md transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </motion.button>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Post a New Job
            </h1>
            <p className="text-gray-600 mt-2">Fill in the details to create a new job posting</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
          <input {...register('title', { required: 'Required' })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
          <input {...register('company', { required: 'Required' })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input {...register('location', { required: 'Required' })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
            <input {...register('salaryMin', { required: 'Required' })} type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
            <input {...register('salaryMax', { required: 'Required' })} type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (comma-separated)</label>
          <input {...register('skills', { required: 'Required' })} placeholder="React, Node.js, MongoDB" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
          <select {...register('jobType')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required</label>
          <input {...register('experience', { required: 'Required' })} placeholder="e.g., 2-4 years" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
          <textarea {...register('description', { required: 'Required' })} rows="8" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:shadow-lg disabled:opacity-50 font-medium transition-all">
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </span>
              ) : (
                'Post Job'
              )}
            </button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PostJob;
