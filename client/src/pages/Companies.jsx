import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, FileText, Search, Building2, Users } from 'lucide-react';
import { jobService } from '../services';
import Card from '../components/UI/Card';
import { Link } from 'react-router-dom';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredCompanies(
        companies.filter(company =>
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.location.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredCompanies(companies);
    }
  }, [search, companies]);

  const loadCompanies = async () => {
    try {
      const response = await jobService.getJobs({ limit: 1000 });
      const jobs = response.data;

      // Extract unique companies
      const companyMap = new Map();
      jobs.forEach(job => {
        const key = job.company.toLowerCase();
        if (!companyMap.has(key)) {
          companyMap.set(key, {
            name: job.company,
            location: job.location,
            jobs: [],
            logo: job.company.charAt(0).toUpperCase(),
          });
        }
        companyMap.get(key).jobs.push(job);
        // Update location if we find a job with location
        if (job.location) {
          companyMap.get(key).location = job.location;
        }
      });

      const companyArray = Array.from(companyMap.values()).map(company => ({
        ...company,
        jobCount: company.jobs.length,
        activeJobs: company.jobs.filter(j => j.isActive).length,
      }));

      // Sort by number of jobs
      companyArray.sort((a, b) => b.jobCount - a.jobCount);

      setCompanies(companyArray);
      setFilteredCompanies(companyArray);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2563EB] mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold text-[#0F172A] mb-2">
          Browse Companies
        </h1>
        <p className="text-lg text-slate-600">
          Discover top employers and find your dream company
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-2">
          <div className="flex items-center px-4">
            <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search companies by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 focus:outline-none text-gray-700"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0F172A]">{companies.length}</p>
              <p className="text-sm text-slate-600">Total Companies</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0F172A]">
                {companies.reduce((sum, c) => sum + c.activeJobs, 0)}
              </p>
              <p className="text-sm text-slate-600">Active Jobs</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0F172A]">
                {companies.reduce((sum, c) => sum + c.jobCount, 0)}
              </p>
              <p className="text-sm text-slate-600">Total Postings</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Companies Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredCompanies.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No companies found</h3>
            <p className="text-slate-600">
              {search ? 'Try adjusting your search terms' : 'No companies available at the moment'}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="p-6 h-full border border-slate-200">
                  {/* Company Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                      {company.logo}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#0F172A] mb-1">
                        {company.name}
                      </h3>
                      {company.location && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span>{company.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#2563EB]" />
                      <span className="text-sm font-medium text-slate-700">
                        {company.activeJobs} active job{company.activeJobs !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* View Jobs Button */}
                  <Link
                    to={`/jobs?company=${encodeURIComponent(company.name)}`}
                    className="w-full py-2.5 border-2 border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-[#2563EB] hover:text-white transition-all font-medium text-center block"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>View Jobs</span>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Companies;
