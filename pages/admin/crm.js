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
        {/* Header */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">CRM Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-blue-400 text-sm font-medium">Quiz Submissions</p>
                  <p className="text-2xl font-bold text-white">{stats.totalQuiz}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <MessageSquare className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-green-400 text-sm font-medium">Survey Responses</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSurvey}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-purple-400 text-sm font-medium">Contest Entries</p>
                  <p className="text-2xl font-bold text-white">{stats.totalContest}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            {[
              { id: 'quiz', label: 'Quiz Submissions', icon: FileText },
              { id: 'survey', label: 'Survey Responses', icon: MessageSquare },
              { id: 'contest', label: 'Contest Entries', icon: Trophy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#1DD1A1]/20 to-[#B91372]/20 border-[#1DD1A1]/30 text-white'
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <div className="mb-6">
            <button
              onClick={() => exportToCSV(data[activeTab], `${activeTab}-data`)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-lg hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-black/50 border border-white/10 rounded-xl overflow-hidden">
            {data[activeTab].length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No {activeTab} data found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      {activeTab === 'quiz' && (
                        <>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Email</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Name</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Pathway</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Stage</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Date</th>
                        </>
                      )}
                      {activeTab === 'survey' && (
                        <>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Email</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">NPS</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">CES</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Feedback</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Date</th>
                        </>
                      )}
                      {activeTab === 'contest' && (
                        <>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Tech Idea</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Background</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-300">Date</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data[activeTab].map((item, index) => (
                      <tr key={index} className="border-t border-white/5 hover:bg-white/5">
                        {activeTab === 'quiz' && (
                          <>
                            <td className="p-4 text-sm">{item.email}</td>
                            <td className="p-4 text-sm">{item.name || 'N/A'}</td>
                            <td className="p-4 text-sm">{item.pathway || 'N/A'}</td>
                            <td className="p-4 text-sm">{item.stage || 'N/A'}</td>
                            <td className="p-4 text-sm">{formatDate(item.createdAt || item.submittedAt)}</td>
                          </>
                        )}
                        {activeTab === 'survey' && (
                          <>
                            <td className="p-4 text-sm">{item.email}</td>
                            <td className="p-4 text-sm">{item.nps || 'N/A'}</td>
                            <td className="p-4 text-sm">{item.ces || 'N/A'}</td>
                            <td className="p-4 text-sm max-w-xs truncate">{item.feedback || 'N/A'}</td>
                            <td className="p-4 text-sm">{formatDate(item.createdAt || item.submittedAt)}</td>
                          </>
                        )}
                        {activeTab === 'contest' && (
                          <>
                            <td className="p-4 text-sm max-w-xs truncate">{item.techIdea}</td>
                            <td className="p-4 text-sm">{item.techBackground}</td>
                            <td className="p-4 text-sm">
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                                {item.status}
                              </span>
                            </td>
                            <td className="p-4 text-sm">{formatDate(item.submittedAt)}</td>
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