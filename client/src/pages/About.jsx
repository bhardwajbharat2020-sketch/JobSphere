import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  Brain,
  FileCheck,
  Shield,
  TrendingUp,
  Users,
  Briefcase,
  Building2,
  ArrowRight,
  CheckCircle,
  Heart,
  Zap,
} from 'lucide-react';
import Card from '../components/UI/Card';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <div className="space-y-0">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 px-8 lg:px-16 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-6">
              About{' '}
              <span className="text-[#2563EB]">JobSphere</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              We are building a smarter way to connect talent with opportunities.
              Our platform empowers job seekers and recruiters through intelligent
              matching and seamless experiences.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/jobs"
                  className="inline-block px-8 py-3.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Explore Jobs
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-block px-8 py-3.5 bg-white text-[#2563EB] border-2 border-[#2563EB] rounded-lg hover:bg-blue-50 transition-all font-semibold"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-96">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-40 blur-2xl"></div>

              {/* Modern UI Graphic */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <svg viewBox="0 0 500 400" className="w-full max-w-lg">
                  {/* Network Nodes */}
                  <circle cx="250" cy="200" r="60" fill="#2563EB" opacity="0.2" />
                  <circle cx="150" cy="120" r="40" fill="#22C55E" opacity="0.2" />
                  <circle cx="350" cy="120" r="40" fill="#A855F7" opacity="0.2" />
                  <circle cx="150" cy="280" r="40" fill="#F97316" opacity="0.2" />
                  <circle cx="350" cy="280" r="40" fill="#06B6D4" opacity="0.2" />

                  {/* Connection Lines */}
                  <line x1="250" y1="200" x2="150" y2="120" stroke="#2563EB" strokeWidth="2" opacity="0.3" />
                  <line x1="250" y1="200" x2="350" y2="120" stroke="#2563EB" strokeWidth="2" opacity="0.3" />
                  <line x1="250" y1="200" x2="150" y2="280" stroke="#2563EB" strokeWidth="2" opacity="0.3" />
                  <line x1="250" y1="200" x2="350" y2="280" stroke="#2563EB" strokeWidth="2" opacity="0.3" />

                  {/* Icons in Nodes */}
                  <text x="250" y="205" textAnchor="middle" fontSize="40" fill="#2563EB">💼</text>
                  <text x="150" y="125" textAnchor="middle" fontSize="30" fill="#22C55E">👤</text>
                  <text x="350" y="125" textAnchor="middle" fontSize="30" fill="#A855F7">🏢</text>
                  <text x="150" y="285" textAnchor="middle" fontSize="30" fill="#F97316">🎯</text>
                  <text x="350" y="285" textAnchor="middle" fontSize="30" fill="#06B6D4">🚀</text>
                </svg>
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute top-8 right-8 bg-white rounded-xl shadow-xl p-4 rotate-3 hover:rotate-0 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0F172A]">Job Matched!</p>
                    <p className="text-xs text-slate-500">98% fit score</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-12 left-8 bg-white rounded-xl shadow-xl p-4 -rotate-3 hover:rotate-0 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0F172A]">50K+ Users</p>
                    <p className="text-xs text-slate-500">Growing daily</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: OUR MISSION */}
      <section className="py-20">
        <motion.div
          {...fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <Card className="p-10 lg:p-14 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
                >
                  <Target className="h-12 w-12 text-white" />
                </motion.div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">Our Mission</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  To simplify hiring and empower candidates by connecting them with the right
                  opportunities using intelligent technology. We believe everyone deserves access
                  to meaningful work, and companies deserve to find the perfect talent.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* SECTION 3: WHAT WE DO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">What We Do</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Leveraging cutting-edge technology to transform how talent meets opportunity
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Brain,
                title: 'Smart Job Matching',
                desc: 'AI-powered algorithms analyze your skills and preferences to recommend the perfect opportunities.',
                gradient: 'from-blue-500 to-blue-600',
              },
              {
                icon: FileCheck,
                title: 'Resume Parsing',
                desc: 'Intelligent resume analysis that extracts your skills and experience automatically.',
                gradient: 'from-green-500 to-green-600',
              },
              {
                icon: Shield,
                title: 'Verified Companies',
                desc: 'All employers are verified to ensure a safe and trustworthy job search experience.',
                gradient: 'from-purple-500 to-purple-600',
              },
              {
                icon: TrendingUp,
                title: 'Career Growth',
                desc: 'Track your applications, get insights, and advance your career with data-driven guidance.',
                gradient: 'from-orange-500 to-orange-600',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={index} variants={staggerItem}>
                  <Card hover className="p-6 h-full border border-slate-200">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-md`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: STATS */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Our Impact in Numbers</h2>
            <p className="text-lg text-slate-600">
              Join thousands of professionals and companies trusting JobSphere
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: Briefcase,
                number: '10,000+',
                label: 'Active Jobs',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Building2,
                number: '2,000+',
                label: 'Verified Companies',
                color: 'from-green-500 to-green-600',
              },
              {
                icon: Users,
                number: '50,000+',
                label: 'Active Users',
                color: 'from-purple-500 to-purple-600',
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={index} variants={staggerItem}>
                  <Card hover className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-[#0F172A] mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-slate-600 font-medium">{stat.label}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: OUR TEAM */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Meet Our Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The talented people behind JobSphere who make it all possible
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                name: 'Ansh Bhardwaj',
                role: 'Full Stack Developer',
                desc: 'Architecting the platform with modern MERN stack technologies',
                gradient: 'from-blue-500 to-blue-600',
              },
              {
                name: 'Bharat Bhardwaj',
                role: 'Lead Developer & Founder',
                desc: 'Driving innovation and building scalable solutions for job seekers',
                gradient: 'from-purple-500 to-purple-600',
              },
              {
                name: 'Sahil Kumar Choudhary',
                role: 'UI/UX Designer',
                desc: 'Creating intuitive and beautiful user experiences',
                gradient: 'from-green-500 to-green-600',
              },
            ].map((member, index) => (
              <motion.div key={index} variants={staggerItem}>
                <motion.div whileHover={{ y: -10 }}>
                  <Card hover className="p-6 text-center border border-slate-200">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-4xl shadow-lg`}
                    >
                      {member.name.charAt(0)}
                    </motion.div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-1">{member.name}</h3>
                    <p className="text-[#2563EB] font-semibold text-sm mb-3">{member.role}</p>
                    <p className="text-sm text-slate-600">{member.desc}</p>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE JOBSPHERE */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Why Choose JobSphere</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to find your dream job or hire top talent
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Brain,
                title: 'Smart Matching',
                desc: 'AI-powered recommendations that understand your career goals',
                color: 'text-blue-600',
                bgColor: 'bg-blue-100',
              },
              {
                icon: FileCheck,
                title: 'Easy Applications',
                desc: 'Apply to multiple jobs with one click and track your progress',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
              },
              {
                icon: Shield,
                title: 'Trusted Companies',
                desc: 'Verified employers ensuring safe and legitimate opportunities',
                color: 'text-purple-600',
                bgColor: 'bg-purple-100',
              },
              {
                icon: TrendingUp,
                title: 'Career Growth',
                desc: 'Insights and analytics to help you advance your career',
                color: 'text-orange-600',
                bgColor: 'bg-orange-100',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={staggerItem}>
                  <Card hover className="p-6 border border-slate-200">
                    <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: CTA */}
      <section className="py-20">
        <motion.div
          {...fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white px-8 lg:px-16 py-16 lg:py-20 text-center">
            {/* Background Decorations */}
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
                <Heart className="h-16 w-16 mx-auto mb-6 text-blue-200" />
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                  Ready to Take the Next Step?
                </h2>
                <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
                  Join thousands of professionals finding their dream careers through JobSphere
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/jobs"
                      className="inline-block px-10 py-4 bg-white text-[#2563EB] rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
                    >
                      Browse Jobs
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#2563EB] transition-all font-semibold text-lg"
                    >
                      Sign Up Free
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
