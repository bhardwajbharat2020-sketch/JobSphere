import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, DollarSign, Users, TrendingUp, ArrowRight, CheckCircle, UserCheck, FileText } from 'lucide-react';
import { jobService } from '../services';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      const response = await jobService.getJobs({ limit: 6 });
      setFeaturedJobs(response.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      window.location.href = `/jobs?keyword=${encodeURIComponent(searchKeyword)}`;
    }
  };

  return (
    <div className="space-y-20">
      {/* Hero Section - JobSphere Design */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT COLUMN: Text + Search */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight mb-4">
                Find Your Next Opportunity with{' '}
                <span className="text-[#2563EB]">JobSphere</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Connect with top employers and explore thousands of opportunities tailored to your skills
              </p>
            </motion.div>

            {/* Two-Input Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-2 mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-4">
                  <Briefcase className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Job title or keyword"
                    className="flex-1 px-3 py-3 focus:outline-none text-sm lg:text-base"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 border-t sm:border-t-0 sm:border-l border-slate-200">
                  <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="flex-1 px-3 py-3 focus:outline-none text-sm lg:text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="m-0 sm:m-0 px-8">
                  Search
                </Button>
              </div>
            </motion.form>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 lg:gap-8"
            >
              <div>
                <span className="text-2xl font-bold text-[#0F172A]">10,000+</span>
                <p className="text-sm text-slate-600">Jobs</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#0F172A]">2,000+</span>
                <p className="text-sm text-slate-600">Companies</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#0F172A]">50,000+</span>
                <p className="text-sm text-slate-600">Users</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Illustration + Floating Cards */}
          <div className="relative hidden lg:block">
            {/* CSS Developer Illustration Placeholder */}
            <div className="relative w-96 h-96 mx-auto">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-40 blur-2xl"></div>
              
              {/* Developer SVG Illustration */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 400 400" className="w-80 h-80">
                  {/* Person sitting */}
                  <circle cx="200" cy="120" r="40" fill="#2563EB" opacity="0.8" />
                  <rect x="160" y="170" width="80" height="100" fill="#1D4ED8" rx="10" />
                  {/* Laptop */}
                  <rect x="140" y="240" width="120" height="80" fill="#0F172A" rx="5" />
                  <rect x="145" y="245" width="110" height="65" fill="#3B82F6" rx="3" />
                  {/* Desk */}
                  <rect x="100" y="320" width="200" height="10" fill="#64748B" rx="2" />
                  {/* Chair */}
                  <rect x="170" y="270" width="60" height="50" fill="#475569" rx="5" />
                </svg>
              </div>

              {/* Floating Job Card 1 - UI Designer */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute top-16 -left-8 bg-white rounded-xl shadow-xl p-4 rotate-[-6deg] hover:rotate-0 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">G</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0F172A]">UI Designer</p>
                    <p className="text-xs text-slate-500">Google • Remote</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Job Card 2 - Frontend Dev */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-32 -right-4 bg-white rounded-xl shadow-xl p-4 rotate-[3deg] hover:rotate-0 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0F172A]">Frontend Dev</p>
                    <p className="text-xs text-slate-500">Meta • New York</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Job Card 3 - Product Manager */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute bottom-10 left-10 bg-white rounded-xl shadow-xl p-4 rotate-[6deg] hover:rotate-0 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0F172A]">Product Manager</p>
                    <p className="text-xs text-slate-500">Amazon • Seattle</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 10,000+ Jobs Card */}
          <motion.div whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-[#2563EB]" />
              </div>
              <h3 className="text-3xl font-bold text-[#0F172A] mb-2">10,000+</h3>
              <p className="text-slate-600">Active Jobs</p>
            </Card>
          </motion.div>

          {/* 2,000+ Companies Card */}
          <motion.div whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-8 w-8 text-[#22C55E]" />
              </div>
              <h3 className="text-3xl font-bold text-[#0F172A] mb-2">2,000+</h3>
              <p className="text-slate-600">Companies</p>
            </Card>
          </motion.div>

          {/* 50,000+ Users Card */}
          <motion.div whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-[#0F172A] mb-2">50,000+</h3>
              <p className="text-slate-600">Active Users</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-[#0F172A]">Featured Jobs</h2>
            <p className="text-slate-600 mt-2">Discover opportunities matching your skills</p>
          </div>
          <Link to="/jobs" className="text-[#2563EB] hover:text-[#1D4ED8] font-medium flex items-center space-x-1">
            <span>View All Jobs</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/jobs/${job._id}`}>
                  <Card hover className="p-6 h-full flex flex-col border border-slate-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#0F172A]">{job.title}</h3>
                        <p className="text-[#2563EB] font-medium">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>${job.salary.min?.toLocaleString() || '0'} - ${job.salary.max?.toLocaleString() || '0'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 3).map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <button className="mt-auto w-full py-2.5 border-2 border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-[#2563EB] hover:text-white transition-all font-medium">
                      Apply Now
                    </button>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose JobSphere */}
      <section className="py-16">
        <h2 className="text-4xl font-bold text-center text-[#0F172A] mb-4">Why Choose JobSphere</h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          The smartest way to find your dream job or hire top talent
        </p>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Search, title: 'Smart Matching', desc: 'AI-powered job recommendations based on your skills', color: 'blue' },
            { icon: UserCheck, title: 'Verified Companies', desc: 'All employers are verified for your safety', color: 'green' },
            { icon: FileText, title: 'Easy Applications', desc: 'Apply to multiple jobs with one click', color: 'purple' },
            { icon: TrendingUp, title: 'Career Growth', desc: 'Track your progress and get career insights', color: 'orange' },
          ].map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
            };
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${colorClasses[feature.color]} flex items-center justify-center`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Get started in three simple steps and land your dream job
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Create Your Profile',
              description: 'Sign up and build your professional profile with skills and experience',
              icon: Users,
            },
            {
              step: '2',
              title: 'Search & Apply',
              description: 'Browse jobs, filter by your preferences, and apply with one click',
              icon: Briefcase,
            },
            {
              step: '3',
              title: 'Get Hired',
              description: 'Track your applications and connect with top employers',
              icon: TrendingUp,
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card hover className="p-8 text-center">
                  <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                    <Icon className="h-10 w-10" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero text-white px-8 py-20 text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Join thousands of professionals finding their dream careers
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
                >
                  Sign Up Now - It's Free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/jobs"
                  className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all font-semibold text-lg"
                >
                  Browse Jobs
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
