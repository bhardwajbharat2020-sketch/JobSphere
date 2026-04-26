import { Mail, Phone, MapPin, Heart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../UI/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Browse Jobs', path: '/jobs' },
      { label: 'Companies', path: '/companies' },
      { label: 'Dashboard', path: '/candidate/dashboard' },
      { label: 'About Us', path: '/about' },
    ],
    candidates: [
      { label: 'Create Account', path: '/register' },
      { label: 'My Profile', path: '/candidate/profile' },
      { label: 'Job Alerts', path: '/#' },
      { label: 'Career Advice', path: '/#' },
    ],
    recruiters: [
      { label: 'Post a Job', path: '/recruiter/post-job' },
      { label: 'Browse Candidates', path: '/#' },
      { label: 'Pricing Plans', path: '/#' },
      { label: 'Resources', path: '/#' },
    ],
    company: [
      { label: 'About', path: '/#' },
      { label: 'Contact', path: '/#' },
      { label: 'Privacy Policy', path: '/#' },
      { label: 'Terms of Service', path: '/#' },
    ],
  };

  const socialLinks = [
    { icon: Globe, href: '#', label: 'Twitter' },
    { icon: Globe, href: '#', label: 'LinkedIn' },
    { icon: Globe, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3">Stay Updated with Latest Opportunities</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter and never miss your dream job
            </p>
            <form className="flex gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="large" showTagline={true} variant="dark" />
            <p className="text-slate-400 mb-6 max-w-sm mt-4">
              Connecting talented professionals with their dream careers. Find your next opportunity or hire the perfect candidate.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-[#2563EB] transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Candidates</h3>
            <ul className="space-y-3">
              {footerLinks.candidates.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-[#2563EB] transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recruiters */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Recruiters</h3>
            <ul className="space-y-3">
              {footerLinks.recruiters.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-[#2563EB] transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            <p className="text-slate-400 text-sm flex items-center space-x-1">
              <span>&copy; {currentYear} JobSphere. All rights reserved.</span>
              <span className="text-slate-500">Made with</span>
              <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
              <span className="text-slate-500">by Bharat Bhardwaj</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
