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
  Award,
  Trash2,
  MoreHorizontal,
  CheckSquare,
  Square
} from 'lucide-react';

export default function CRMDashboard() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, quiz, survey, contest
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContacts: 0,
    withQuiz: 0,
    withSurvey: 0,
    withContest: 0
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

  // Apply filters when contacts change
  useEffect(() => {
    applyFilters();
  }, [contacts]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch artist profiles data
      const profilesRes = await fetch('/api/admin/artist-profiles', { headers });
      const profilesData = profilesRes.ok ? await profilesRes.json() : [];

      setContacts(profilesData);
      setFilteredContacts(profilesData);

      // Calculate stats
      const withQuiz = profilesData.filter(p => p.quiz).length;
      const withSurvey = profilesData.filter(p => p.survey).length;
      const withContest = profilesData.filter(p => p.contest).length;

      setStats({
        totalContacts: profilesData.length,
        withQuiz,
        withSurvey,
        withContest
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

  const exportToCSV = () => {
    if (!filteredContacts.length) return;
    
    const csvData = filteredContacts.map(contact => ({
      email: contact.email,
      name: contact.name || '',
      stageName: contact.stageName || '',
      pathway: contact.quiz?.pathway || '',
      stage: contact.quiz?.stage || '',
      nps: contact.survey?.nps || '',
      ces: contact.survey?.ces || '',
      monthlyInvestment: formatMonthlyInvestment(contact.survey?.monthlyInvestment),
      contestEntry: contact.contest?.techIdea || '',
      lastActivity: formatDate(contact.lastActivity)
    }));
    
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts-export.csv';
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

  // Filter and search functionality
  const applyFilters = (searchValue = searchTerm, filterValue = filterType) => {
    let filtered = contacts;

    // Apply type filter
    if (filterValue !== 'all') {
      filtered = filtered.filter(contact => {
        switch (filterValue) {
          case 'quiz': return contact.quiz;
          case 'survey': return contact.survey;
          case 'contest': return contact.contest;
          default: return true;
        }
      });
    }

    // Apply search filter
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.email.toLowerCase().includes(search) ||
        (contact.name && contact.name.toLowerCase().includes(search)) ||
        (contact.stageName && contact.stageName.toLowerCase().includes(search)) ||
        (contact.quiz && contact.quiz.pathway && contact.quiz.pathway.toLowerCase().includes(search))
      );
    }

    setFilteredContacts(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterType);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    applyFilters(searchTerm, value);
  };

  const handleSelectContact = (email, isSelected) => {
    const newSelected = new Set(selectedContacts);
    if (isSelected) {
      newSelected.add(email);
    } else {
      newSelected.delete(email);
    }
    setSelectedContacts(newSelected);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedContacts(new Set(filteredContacts.map(c => c.email)));
    } else {
      setSelectedContacts(new Set());
    }
  };

  const handleDeleteContact = async (email) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/delete-contact', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        // Remove from local state
        setContacts(prev => prev.filter(c => c.email !== email));
        setFilteredContacts(prev => prev.filter(c => c.email !== email));
        
        // Clear selection if deleted contact was selected
        if (selectedProfile?.email === email) {
          setSelectedProfile(null);
        }
        
        // Update stats
        const remainingContacts = contacts.filter(c => c.email !== email);
        setStats({
          totalContacts: remainingContacts.length,
          withQuiz: remainingContacts.filter(p => p.quiz).length,
          withSurvey: remainingContacts.filter(p => p.survey).length,
          withContest: remainingContacts.filter(p => p.contest).length
        });
      } else {
        const error = await response.json();
        alert(`Error deleting contact: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedContacts.size} contacts? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    const emailsToDelete = Array.from(selectedContacts);
    const token = localStorage.getItem('adminToken');
    
    try {
      // Delete each contact
      const deletePromises = emailsToDelete.map(email => 
        fetch('/api/admin/delete-contact', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email })
        })
      );

      await Promise.all(deletePromises);
      
      // Update local state
      setContacts(prev => prev.filter(c => !selectedContacts.has(c.email)));
      setFilteredContacts(prev => prev.filter(c => !selectedContacts.has(c.email)));
      setSelectedContacts(new Set());
      
      // Clear selection if deleted
      if (selectedProfile && selectedContacts.has(selectedProfile.email)) {
        setSelectedProfile(null);
      }
      
      // Refresh data to ensure accuracy
      loadData();
      
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Some contacts could not be deleted');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading contacts...</div>
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
                    Contacts
                  </h1>
                  <p className="text-gray-400 mt-1">All your music creator contacts in one place</p>
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

        {/* Main Content */}
        <div className="flex h-screen">
          {/* Left Panel - Contacts List */}
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-white/5">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stats.totalContacts}</p>
                  <p className="text-xs text-gray-400">Total Contacts</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{stats.withQuiz}</p>
                  <p className="text-xs text-gray-400">Quiz Completed</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{stats.withSurvey}</p>
                  <p className="text-xs text-gray-400">Survey Completed</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">{stats.withContest}</p>
                  <p className="text-xs text-gray-400">Contest Entered</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-xl focus:border-[#1DD1A1] focus:outline-none text-white placeholder-gray-400"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-4 py-2 bg-black/30 border border-white/20 rounded-xl focus:border-[#1DD1A1] focus:outline-none text-white"
                >
                  <option value="all">All Contacts</option>
                  <option value="quiz">Quiz Completed</option>
                  <option value="survey">Survey Completed</option>
                  <option value="contest">Contest Entered</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-xl hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  {selectedContacts.size > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete ({selectedContacts.size})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedContacts.size > 0 && (
              <div className="px-6 py-3 bg-gradient-to-r from-red-500/10 to-red-700/10 border-b border-red-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">
                    {selectedContacts.size} contact{selectedContacts.size > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* Contacts Table */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No contacts found</p>
                  </div>
                </div>
              ) : (
                <div className="glass-card m-6 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="text-left p-4 w-8">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const allSelected = filteredContacts.every(c => selectedContacts.has(c.email));
                              handleSelectAll(!allSelected);
                            }}
                            className="p-1 hover:bg-white/10 rounded"
                          >
                            {filteredContacts.every(c => selectedContacts.has(c.email)) && filteredContacts.length > 0 ? (
                              <CheckSquare className="w-4 h-4 text-[#1DD1A1]" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Contact</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Activities</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Pathway</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Last Activity</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-300 uppercase tracking-wider w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact) => (
                        <tr 
                          key={contact.email} 
                          className={`border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                            selectedProfile?.email === contact.email ? 'bg-gradient-to-r from-[#1DD1A1]/5 to-[#B91372]/5' : ''
                          }`}
                          onClick={() => setSelectedProfile(contact)}
                        >
                          <td className="p-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectContact(contact.email, !selectedContacts.has(contact.email));
                              }}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              {selectedContacts.has(contact.email) ? (
                                <CheckSquare className="w-4 h-4 text-[#1DD1A1]" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-teal-500/20 to-teal-700/20 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-teal-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">
                                  {contact.name || contact.stageName || contact.email.split('@')[0]}
                                </p>
                                <p className="text-gray-400 text-xs">{contact.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {contact.quiz && (
                                <div className="w-2 h-2 bg-blue-400 rounded-full" title="Quiz completed" />
                              )}
                              {contact.survey && (
                                <div className="w-2 h-2 bg-green-400 rounded-full" title="Survey completed" />
                              )}
                              {contact.contest && (
                                <div className="w-2 h-2 bg-purple-400 rounded-full" title="Contest entered" />
                              )}
                              <span className="text-gray-500 text-xs ml-1">
                                {[contact.quiz && 'Quiz', contact.survey && 'Survey', contact.contest && 'Contest']
                                  .filter(Boolean).join(', ') || 'None'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-white text-sm">
                              {contact.quiz?.pathway || 'N/A'}
                            </span>
                            {contact.quiz?.stage && (
                              <p className="text-gray-400 text-xs">{contact.quiz.stage}</p>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-gray-400 text-xs">
                              {formatDate(contact.lastActivity)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProfile(contact);
                                }}
                                className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDeleteConfirm(contact.email);
                                }}
                                className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                                title="Delete Contact"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Profile Details */}
          {selectedProfile && (
            <div className="w-96 border-l border-white/10 bg-black/50 flex flex-col">
              {/* Profile Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-teal-700/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-teal-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {selectedProfile.name || selectedProfile.stageName || selectedProfile.email.split('@')[0]}
                        </h2>
                        {selectedProfile.stageName && selectedProfile.name && (
                          <p className="text-gray-400 text-sm">{selectedProfile.stageName}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">{selectedProfile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {selectedProfile.quiz && <div className="w-2 h-2 bg-blue-400 rounded-full" title="Quiz completed" />}
                      {selectedProfile.survey && <div className="w-2 h-2 bg-green-400 rounded-full" title="Survey completed" />}
                      {selectedProfile.contest && <div className="w-2 h-2 bg-purple-400 rounded-full" title="Contest entered" />}
                      <span className="text-gray-500 text-xs ml-2">Last activity: {formatDate(selectedProfile.lastActivity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400 text-xl">×</span>
                  </button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Quiz Results */}
                {selectedProfile.quiz && (
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <h3 className="text-blue-400 font-semibold">Quiz Results</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pathway:</span>
                        <span className="text-white font-medium">{selectedProfile.quiz.pathway || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stage:</span>
                        <span className="text-white font-medium">{selectedProfile.quiz.stage || 'N/A'}</span>
                      </div>
                      {selectedProfile.quiz.pathwayScore && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Score:</span>
                          <span className="text-white font-medium">{selectedProfile.quiz.pathwayScore}/100</span>
                        </div>
                      )}
                      {selectedProfile.quiz.focusAreas && selectedProfile.quiz.focusAreas.length > 0 && (
                        <div>
                          <span className="text-gray-400 block mb-1">Focus Areas:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedProfile.quiz.focusAreas.map((area, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Completed:</span>
                        <span className="text-white text-sm">{formatDate(selectedProfile.quiz.completedAt)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Survey Response */}
                {selectedProfile.survey && (
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                      <h3 className="text-green-400 font-semibold">Survey Response</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">{selectedProfile.survey.nps || 'N/A'}</div>
                          <div className="text-xs text-gray-400">NPS Score</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{selectedProfile.survey.ces || 'N/A'}</div>
                          <div className="text-xs text-gray-400">CES Score</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {formatMonthlyInvestment(selectedProfile.survey.monthlyInvestment)}
                          </div>
                          <div className="text-xs text-gray-400">Monthly</div>
                        </div>
                      </div>
                      
                      {selectedProfile.survey.primaryChallenges && selectedProfile.survey.primaryChallenges.length > 0 && (
                        <div>
                          <span className="text-gray-400 block mb-1">Challenges:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedProfile.survey.primaryChallenges.map((challenge, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                {challenge}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedProfile.survey.genres && selectedProfile.survey.genres.length > 0 && (
                        <div>
                          <span className="text-gray-400 block mb-1">Genres:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedProfile.survey.genres.map((genre, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedProfile.survey.feedback && (
                        <div>
                          <span className="text-gray-400 block mb-1">Feedback:</span>
                          <p className="text-white text-sm bg-white/5 p-3 rounded-lg">
                            {selectedProfile.survey.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contest Entry */}
                {selectedProfile.contest && (
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-5 h-5 text-purple-400" />
                      <h3 className="text-purple-400 font-semibold">Contest Entry</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400 block mb-1">Tech Idea:</span>
                        <p className="text-white text-sm bg-white/5 p-3 rounded-lg">
                          {selectedProfile.contest.techIdea}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Background:</span>
                        <span className="text-white font-medium">{selectedProfile.contest.techBackground}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                          {selectedProfile.contest.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Submitted:</span>
                        <span className="text-white text-sm">{formatDate(selectedProfile.contest.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Engagement Stats */}
                {selectedProfile.engagement && (
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-teal-400" />
                      <h3 className="text-teal-400 font-semibold">Engagement</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Logins:</span>
                        <span className="text-white font-medium">{selectedProfile.engagement.totalLogins || 0}</span>
                      </div>
                      {selectedProfile.engagement.lastLogin && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Login:</span>
                          <span className="text-white text-sm">{formatDate(selectedProfile.engagement.lastLogin)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">PDF Purchased:</span>
                        <span className={`font-medium ${
                          selectedProfile.engagement.pdfPurchased ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {selectedProfile.engagement.pdfPurchased ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {selectedProfile.engagement.pdfPurchasedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">PDF Date:</span>
                          <span className="text-white text-sm">{formatDate(selectedProfile.engagement.pdfPurchasedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-card p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-white mb-4">Delete Contact</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <strong>{showDeleteConfirm}</strong>? 
                This will remove all their data including quiz results, survey responses, and contest entries.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteContact(showDeleteConfirm)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}