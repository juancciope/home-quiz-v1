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
  LogOut
} from 'lucide-react';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('quiz');
  const [data, setData] = useState({
    quiz: [],
    survey: [],
    contest: []
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuiz: 0,
    totalSurvey: 0,
    totalContest: 0
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
      const [quizRes, surveyRes, contestRes] = await Promise.all([
        fetch('/api/admin/quiz-submissions', { headers }),
        fetch('/api/admin/survey-submissions', { headers }),
        fetch('/api/admin/contest-submissions', { headers })
      ]);

      const quizData = quizRes.ok ? await quizRes.json() : [];
      const surveyData = surveyRes.ok ? await surveyRes.json() : [];
      const contestData = contestRes.ok ? await contestRes.json() : [];

      setData({
        quiz: quizData,
        survey: surveyData,
        contest: contestData
      });

      setStats({
        totalQuiz: quizData.length,
        totalSurvey: surveyData.length,
        totalContest: contestData.length
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          {/* Data Table */}
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
        </div>
      </div>
    </>
  );
}