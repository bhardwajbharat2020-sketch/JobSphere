import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Upload, Plus, Trash2, Save, User, Mail, MapPin, Link,
  Globe, Briefcase, GraduationCap, Award, FileText
} from 'lucide-react';
import { userService } from '../../services';
import useAuthStore from '../../store/authStore';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';

const CandidateProfile = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [completeness, setCompleteness] = useState({ score: 0, suggestions: [], breakdown: {} });
  const [activeTab, setActiveTab] = useState('basic');

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: user?.name || '',
      headline: user?.profile?.headline || '',
      location: user?.profile?.location || '',
      bio: user?.profile?.bio || '',
      skills: user?.profile?.skills?.join(', ') || '',
      linkedin: user?.profile?.linkedin || '',
      github: user?.profile?.github || '',
      portfolio: user?.profile?.portfolio || '',
    },
  });

  useEffect(() => {
    fetchCompleteness();
  }, []);

  const fetchCompleteness = async () => {
    try {
      const response = await userService.getProfileCompleteness(user._id);
      setCompleteness(response.data);
    } catch (error) {
      console.error('Error fetching completeness:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const skillsArray = data.skills.split(',').map(s => s.trim()).filter(s => s);
      const response = await userService.updateProfile(user._id, {
        name: data.name,
        profile: {
          ...user.profile,
          headline: data.headline,
          location: data.location,
          bio: data.bio,
          skills: skillsArray,
          linkedin: data.linkedin,
          github: data.github,
          portfolio: data.portfolio,
        },
      });
      updateUser(response.data);
      toast.success('Profile updated successfully!');
      fetchCompleteness();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      setUploadingResume(true);
      toast.loading('Uploading and parsing resume...');
      
      const response = await userService.uploadResume(user._id, file);
      
      updateUser(response.data);
      toast.dismiss();
      toast.success('Resume uploaded and parsed successfully!');
      fetchCompleteness();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const getCompletenessColor = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'social', label: 'Social Links', icon: Link },
    { id: 'resume', label: 'Resume', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: Main Content (2 columns) */}
        <div className="lg:col-span-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional information</p>
          </div>
        </div>
      </motion.div>

      {/* Profile Completeness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Profile Completeness</h2>
              <p className="text-sm text-gray-600 mt-1">
                {completeness.suggestions.length > 0
                  ? `${completeness.suggestions.length} suggestion${completeness.suggestions.length > 1 ? 's' : ''} to improve your profile`
                  : 'Your profile is complete!'}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-bold ${
                completeness.score >= 80 ? 'text-success' :
                completeness.score >= 60 ? 'text-warning' : 'text-error'
              }`}>
                {completeness.score}%
              </span>
            </div>
          </div>
          <ProgressBar
            value={completeness.score}
            color={completeness.score >= 80 ? 'success' : completeness.score >= 60 ? 'warning' : 'error'}
            size="lg"
            showLabel={false}
          />
          {completeness.suggestions.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Suggestions to improve:</h3>
              <ul className="space-y-1">
                {completeness.suggestions.slice(0, 3).map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-blue-800 flex items-start space-x-2">
                    <span className="mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {activeTab === 'basic' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Headline
                  </label>
                  <input
                    {...register('headline')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Full Stack Developer | React & Node.js Expert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('location')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Me
                  </label>
                  <textarea
                    {...register('bio')}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about yourself, your experience, and career goals..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    {...register('skills')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="React, Node.js, MongoDB, Python, AWS"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add skills you want to be known for. These help with job recommendations.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'social' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('linkedin')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('github')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('portfolio')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'resume' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (PDF)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      disabled={uploadingResume}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer inline-flex flex-col items-center"
                    >
                      {uploadingResume ? (
                        <>
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                          <span className="text-gray-700 font-medium">Parsing your resume...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 mb-4" />
                          <span className="text-gray-700 font-medium mb-2">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-sm text-gray-500">PDF files only (max 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {user?.profile?.resumeUrl && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Resume uploaded</p>
                        <p className="text-sm text-green-700">Your resume has been parsed successfully</p>
                      </div>
                    </div>
                  </div>
                )}

                {user?.profile?.parsedSkills && user.profile.parsedSkills.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills Extracted from Resume
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.parsedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user?.profile?.parsedEducation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Extracted
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{user.profile.parsedEducation}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                type="submit"
                loading={loading}
                icon={Save}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
        </div>

        {/* RIGHT: Profile Overview Sidebar (1 column) */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24"
          >
            <Card className="p-6">
              {/* Profile Image */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <h3 className="text-xl font-bold text-center text-[#0F172A] mb-1">{user?.name || 'User'}</h3>
              <p className="text-center text-slate-600 mb-4 text-sm">
                {user?.profile?.headline || 'Complete your profile'}
              </p>
              
              {/* Location */}
              {user?.profile?.location && (
                <div className="flex items-center justify-center gap-2 mb-4 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>{user.profile.location}</span>
                </div>
              )}

              {/* Skills */}
              {user?.profile?.skills && user.profile.skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-[#0F172A] mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.slice(0, 8).map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.profile.skills.length > 8 && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        +{user.profile.skills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Completion */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Profile Completion</span>
                  <span className="font-bold text-[#2563EB]">{completeness.score}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      completeness.score >= 80 ? 'bg-green-500' :
                      completeness.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${completeness.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Resume Button */}
              {user?.profile?.resumeUrl && (
                <a
                  href={user.profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-all text-center block font-medium shadow-md hover:shadow-lg mb-3"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Download Resume</span>
                  </div>
                </a>
              )}

              {/* Social Links */}
              {(user?.profile?.linkedin || user?.profile?.github || user?.profile?.portfolio) && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-semibold text-sm text-[#0F172A] mb-2">Links</h4>
                  <div className="space-y-2">
                    {user.profile.linkedin && (
                      <a
                        href={user.profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="truncate">LinkedIn</span>
                      </a>
                    )}
                    {user.profile.github && (
                      <a
                        href={user.profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-700"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="truncate">GitHub</span>
                      </a>
                    )}
                    {user.profile.portfolio && (
                      <a
                        href={user.profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-700"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="truncate">Portfolio</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
