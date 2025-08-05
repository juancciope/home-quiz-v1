import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Trophy,
  Download,
  Calendar,
  Mail,
  User,
  LogOut,
  Star,
  Music,
  MapPin,
  Eye,
  Clock,
  Award
} from 'lucide-react';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('profiles');
  const [data, setData] = useState({
    quiz: [],
    survey: [],
    contest: [],
    profiles: []
  });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuiz: 0,
    totalSurvey: 0,
    totalContest: 0,
    totalProfiles: 0
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Load all data
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch all data in parallel
      const [quizRes, surveyRes, contestRes, profilesRes] = await Promise.all([
        fetch('/api/admin/quiz-submissions', { headers }),
        fetch('/api/admin/survey-submissions', { headers }),
        fetch('/api/admin/contest-submissions', { headers }),
        fetch('/api/admin/artist-profiles', { headers })
      ]);

      const quizData = quizRes.ok ? await quizRes.json() : [];
      const surveyData = surveyRes.ok ? await surveyRes.json() : [];
      const contestData = contestRes.ok ? await contestRes.json() : [];
      const profilesData = profilesRes.ok ? await profilesRes.json() : [];

      setData({
        quiz: quizData,
        survey: surveyData,
        contest: contestData,
        profiles: profilesData
      });

      setStats({
        totalQuiz: quizData.length,
        totalSurvey: surveyData.length,
        totalContest: contestData.length,
        totalProfiles: profilesData.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const exportToCSV = (data, filename) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMonthlyInvestment = (investment) => {
    if (!investment) return 'N/A';
    if (typeof investment === 'object') {
      if (investment.dontKnow) return 'N/A';
      return `$${investment.amount || 0}`;
    }
    return `$${investment}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading CRM data...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>CRM Dashboard - HOME for Music</title>
      </Head>
      
      <div className="min-h-screen bg-black text-white">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000000;
            color: #ffffff;
            overflow-x: hidden;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .safari-fallback {
            background: rgba(0, 0, 0, 0.8);
          }
          
          @supports (backdrop-filter: blur(10px)) {
            .safari-fallback {
              backdrop-filter: blur(10px);
              background: rgba(0, 0, 0, 0.7);
            }
          }
          
          .table-row-hover:hover {
            background: rgba(255, 255, 255, 0.02);
            transform: translateY(-1px);
            transition: all 0.2s ease;
          }
          
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Header */}
        <div className="border-b border-white/5 bg-black/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1DD1A1] to-[#B91372] bg-clip-text text-transparent">
                    CRM Dashboard
                  </h1>
                  <p className="text-gray-400 mt-1">Manage your music creator community</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/5 transition-all duration-200 text-gray-300 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Artist Profiles</p>
                    <p className="text-3xl font-bold text-white">{stats.totalProfiles}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-teal-700/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-teal-400" />
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Quiz Submissions</p>
                    <p className="text-3xl font-bold text-white">{stats.totalQuiz}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Survey Responses</p>
                    <p className="text-3xl font-bold text-white">{stats.totalSurvey}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Contest Entries</p>
                    <p className="text-3xl font-bold text-white">{stats.totalContest}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            {[
              { id: 'profiles', label: 'Artist Profiles', icon: Users },
              { id: 'quiz', label: 'Quiz Submissions', icon: FileText },
              { id: 'survey', label: 'Survey Responses', icon: MessageSquare },
              { id: 'contest', label: 'Contest Entries', icon: Trophy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#1DD1A1]/20 to-[#B91372]/20 border-[#1DD1A1]/40 text-white shadow-lg shadow-[#1DD1A1]/10'
                    : 'glass-card border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Export Button */}
          <div className="mb-8">
            <button
              onClick={() => exportToCSV(data[activeTab], `${activeTab}-data`)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl hover:shadow-xl hover:shadow-[#B91372]/20 transition-all duration-300 font-medium text-white hover:scale-105 transform"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export {activeTab} data to CSV</span>
            </button>
          </div>

          {/* Content Area */}
          {activeTab === 'profiles' ? (
            /* Artist Profile Cards */
            <div>
              {data.profiles.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600/20 to-gray-800/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg font-medium mb-2">No artist profiles found</p>
                  <p className="text-gray-500 text-sm">Profiles will appear here once users complete the quiz, survey, or contest.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.profiles.map((profile, index) => (
                    <div key={profile.email} className="glass-card p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer" onClick={() => setSelectedProfile(profile)}>
                      {/* Profile Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-teal-500/20 to-teal-700/20 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-teal-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg truncate">
                              {profile.name || profile.stageName || profile.email.split('@')[0]}
                            </h3>
                          </div>
                          {profile.stageName && profile.name && (
                            <p className="text-gray-400 text-sm">{profile.stageName}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">{profile.email}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {profile.quiz && <div className="w-2 h-2 bg-blue-400 rounded-full" title="Quiz completed" />}
                          {profile.survey && <div className="w-2 h-2 bg-green-400 rounded-full" title="Survey completed" />}
                          {profile.contest && <div className="w-2 h-2 bg-purple-400 rounded-full" title="Contest entered" />}
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="space-y-3">
                        {/* Quiz Info */}
                        {profile.quiz && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 text-sm font-medium">Quiz Results</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-white text-sm">
                                <span className="text-gray-400">Pathway:</span> {profile.quiz.pathway || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">Stage:</span> {profile.quiz.stage || 'N/A'}
                              </p>
                              {profile.quiz.focusAreas.length > 0 && (
                                <p className="text-white text-sm">
                                  <span className="text-gray-400">Focus:</span> {profile.quiz.focusAreas.slice(0, 2).join(', ')}
                                  {profile.quiz.focusAreas.length > 2 && '...'}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Survey Info */}
                        {profile.survey && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm font-medium">Survey Response</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-white text-lg font-bold">{profile.survey.nps || 'N/A'}</p>
                                <p className="text-gray-400 text-xs">NPS</p>
                              </div>
                              <div className="text-center">
                                <p className="text-white text-lg font-bold">{profile.survey.ces || 'N/A'}</p>
                                <p className="text-gray-400 text-xs">CES</p>
                              </div>
                              {profile.survey.monthlyInvestment && (
                                <div className="text-center">
                                  <p className="text-white text-sm font-medium">
                                    {formatMonthlyInvestment(profile.survey.monthlyInvestment)}
                                  </p>
                                  <p className="text-gray-400 text-xs">Monthly</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Contest Info */}
                        {profile.contest && (
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Trophy className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-400 text-sm font-medium">Contest Entry</span>
                            </div>
                            <p className="text-white text-sm line-clamp-2">{profile.contest.techIdea}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                {profile.contest.status}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Profile Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500 text-xs">Last activity {formatDate(profile.lastActivity)}</span>
                          </div>
                          <button className="text-teal-400 text-xs font-medium hover:text-teal-300 transition-colors flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Data Table for other tabs */
            <div className="glass-card overflow-hidden">
              {data[activeTab].length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600/20 to-gray-800/20 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg font-medium mb-2">No {activeTab} data found</p>
                  <p className="text-gray-500 text-sm">Data will appear here once users start submitting {activeTab}.</p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full">
                    <thead className="bg-white/3 border-b border-white/5">
                      <tr>
                      {activeTab === 'quiz' && (
                        <>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Pathway</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Stage</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                        </>
                      )}
                      {activeTab === 'survey' && (
                        <>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">NPS</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">CES</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Feedback</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                        </>
                      )}
                      {activeTab === 'contest' && (
                        <>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Tech Idea</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Background</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data[activeTab].map((item, index) => (
                      <tr key={index} className="border-t border-white/5 table-row-hover">
                        {activeTab === 'quiz' && (
                          <>
                            <td className="px-6 py-4 text-sm text-white font-medium">{item.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{item.name || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 bg-gradient-to-r from-[#1DD1A1]/20 to-[#B91372]/20 text-[#1DD1A1] rounded-full text-xs font-medium">
                                {item.pathway || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">{item.stage || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-400">{formatDate(item.createdAt || item.submittedAt)}</td>
                          </>
                        )}
                        {activeTab === 'survey' && (
                          <>
                            <td className="px-6 py-4 text-sm text-white font-medium">{item.email}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                                {item.nps || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                {item.ces || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{item.feedback || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-400">{formatDate(item.createdAt || item.submittedAt)}</td>
                          </>
                        )}
                        {activeTab === 'contest' && (
                          <>
                            <td className="px-6 py-4 text-sm text-white font-medium max-w-xs truncate">{item.techIdea}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{item.techBackground}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">{formatDate(item.submittedAt)}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}