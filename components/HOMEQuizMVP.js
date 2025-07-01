import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Home,
  Mail,
  Check,
  Music,
  Mic2,
  Palette,
  Headphones,
  Star,
  Play,
  Zap,
  Heart
} from 'lucide-react';

// --- Quiz Questions ---
const questions = [
  {
    id: 'motivation',
    question: "What drives your music career?",
    icon: <Heart className="w-6 h-6" />,
    options: [
      { value: 'stage-energy', label: 'Live Performance', emoji: '🎤' },
      { value: 'creative-expression', label: 'Artistic Expression', emoji: '🎨' },
      { value: 'behind-scenes', label: 'Production & Collaboration', emoji: '🎹' },
      { value: 'business-building', label: 'Business & Brand', emoji: '📈' }
    ]
  },
  {
    id: 'ideal-day',
    question: "Your ideal workday involves...",
    icon: <Zap className="w-6 h-6" />,
    options: [
      { value: 'performing', label: 'Performing Live', emoji: '🎸' },
      { value: 'creating-content', label: 'Creating Content', emoji: '📸' },
      { value: 'studio-work', label: 'Studio Production', emoji: '🎧' },
      { value: 'strategy-networking', label: 'Strategy & Growth', emoji: '🚀' }
    ]
  },
  {
    id: 'success-vision',
    question: "Success in 3 years looks like...",
    icon: <Star className="w-6 h-6" />,
    options: [
      { value: 'touring-artist', label: 'Touring Major Venues', emoji: '🏟️' },
      { value: 'creative-brand', label: 'Multiple Revenue Streams', emoji: '💎' },
      { value: 'in-demand-producer', label: 'Top Producer/Writer', emoji: '🏆' }
    ]
  },
  {
    id: 'stage-level',
    question: "Where are you now?",
    icon: <Play className="w-6 h-6" />,
    options: [
      { value: 'planning', label: 'Just Starting', emoji: '🌱' },
      { value: 'production', label: 'Creating & Releasing', emoji: '🎵' },
      { value: 'scale', label: 'Ready to Scale', emoji: '📊' }
    ]
  },
  {
    id: 'resources-priority',
    question: "What do you need most?",
    icon: <Sparkles className="w-6 h-6" />,
    options: [
      { value: 'performance-facilities', label: 'Performance Space', emoji: '🎪' },
      { value: 'content-creation', label: 'Creative Tools', emoji: '🎬' },
      { value: 'collaboration-network', label: 'Connections', emoji: '🤝' },
      { value: 'business-mentorship', label: 'Mentorship', emoji: '🧭' }
    ]
  }
];

// --- Pathway Templates ---
const pathwayTemplates = {
  'touring-performer': {
    title: 'The Touring Performer Path',
    icon: '🎤',
    color: 'from-purple-500 to-pink-500',
    description: 'Your energy comes alive on stage. Build the performance skills and connections to headline major venues.',
    homeConnection: 'HOME\'s 250-capacity venue and 24/7 rehearsal facilities are your launchpad to stardom.'
  },
  'creative-artist': {
    title: 'The Creative Artist Path', 
    icon: '🎨',
    color: 'from-blue-500 to-purple-500',
    description: 'You\'re a multi-faceted creator building an artistic empire through authentic self-expression.',
    homeConnection: 'HOME\'s content studios and creative community will accelerate your artistic vision.'
  },
  'writer-producer': {
    title: 'The Writer-Producer Path',
    icon: '🎹',
    color: 'from-green-500 to-blue-500',
    description: 'You craft the perfect sound behind the scenes, building your reputation through excellence.',
    homeConnection: 'HOME\'s professional studios and industry connections open doors to top-tier collaborations.'
  }
};

// --- Helpers ---
const determinePathway = (responses) => {
  const scores = {
    'touring-performer': 0,
    'creative-artist': 0,
    'writer-producer': 0
  };
  
  // Scoring logic
  if (responses.motivation === 'stage-energy') scores['touring-performer'] += 3;
  if (responses.motivation === 'creative-expression') scores['creative-artist'] += 3;
  if (responses.motivation === 'behind-scenes') scores['writer-producer'] += 3;
  if (responses.motivation === 'business-building') scores['creative-artist'] += 3;
  
  if (responses['ideal-day'] === 'performing') scores['touring-performer'] += 3;
  if (responses['ideal-day'] === 'creating-content') scores['creative-artist'] += 3;
  if (responses['ideal-day'] === 'studio-work') scores['writer-producer'] += 3;
  if (responses['ideal-day'] === 'strategy-networking') scores['creative-artist'] += 3;
  
  if (responses['success-vision'] === 'touring-artist') scores['touring-performer'] += 4;
  if (responses['success-vision'] === 'creative-brand') scores['creative-artist'] += 4;
  if (responses['success-vision'] === 'in-demand-producer') scores['writer-producer'] += 4;
  
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
};

// --- Main Component ---
const HOMEQuizMVP = () => {
  const [screen, setScreen] = useState('landing');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [pathway, setPathway] = useState(null);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Smooth animations
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen, questionIndex]);

  // Handle quiz answer
  const handleAnswer = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        // Calculate pathway
        const finalResponses = { ...responses, [questionId]: value };
        const pathwayKey = determinePathway(finalResponses);
        setPathway(pathwayTemplates[pathwayKey]);
        setScreen('email');
      }
    }, 300);
  };

  // Handle email submission with beautiful loading
  const handleEmailSubmit = async () => {
    if (!email || isProcessing) return;
    
    setIsProcessing(true);
    
    // Simulate processing with progress
    const duration = 3000;
    const steps = 30;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        setProgress((i / steps) * 100);
        if (i === steps) {
          setIsProcessing(false);
          setShowResults(true);
          setScreen('results');
        }
      }, i * stepDuration);
    }

    // Actually submit
    try {
      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          pathway: pathway?.title,
          responses,
          source: 'music-creator-roadmap-quiz'
        })
      });
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  // Navigation
  const goBack = () => {
    if (screen === 'quiz' && questionIndex > 0) {
      setQuestionIndex(prev => prev - 1);
    } else if (screen === 'email') {
      setScreen('quiz');
    } else if (screen === 'quiz' && questionIndex === 0) {
      setScreen('landing');
    }
  };

  // Render screens
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          {/* Animated Logo */}
          <div className="mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-lg mb-6">
              <Home className="w-10 h-10 text-gray-900 mr-3" />
              <span className="text-3xl font-bold text-gray-900">HOME</span>
            </div>
            <p className="text-gray-500 text-lg">for Music Creators</p>
          </div>
          
          {/* Hero Content */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Path
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
              A personalized roadmap to transform your music career in just 2 minutes
            </p>
            
            {/* Start Button */}
            <button
              onClick={() => setScreen('quiz')}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-900 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Begin Journey</span>
              <ChevronRight className="relative z-10 w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                <span>1,000+ Artists</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>Free Forever</span>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slide-up {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
          
          .animate-slide-up {
            opacity: 0;
            animation: slide-up 0.8s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  if (screen === 'quiz') {
    const question = questions[questionIndex];
    const progress = ((questionIndex + 1) / questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-gray-500 text-sm mt-3">
                Question {questionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
        </div>
        
        {/* Question */}
        <div className="px-6 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
                {question.icon}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {question.question}
              </h2>
            </div>
            
            {/* Options */}
            <div className="grid gap-4 animate-slide-up">
              {question.options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className="group relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.emoji}</span>
                      <span className="text-lg font-medium text-gray-900">{option.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-all group-hover:translate-x-1" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slide-up {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          .animate-slide-up {
            opacity: 0;
            animation: slide-up 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  if (screen === 'email') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          {!isProcessing ? (
            <div className="animate-fade-in">
              {/* Back Button */}
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              {/* Pathway Preview */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${pathway?.color || 'from-purple-500 to-pink-500'} rounded-3xl mb-6 shadow-xl`}>
                  <span className="text-4xl">{pathway?.icon}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Your Path is Ready
                </h2>
                <p className="text-gray-600">
                  {pathway?.title}
                </p>
              </div>
              
              {/* Email Form */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  Get Your Personalized Roadmap
                </h3>
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-6 py-4 text-lg bg-gray-50 rounded-2xl border-2 border-transparent focus:border-purple-500 focus:bg-white transition-all outline-none mb-6"
                />
                
                <button
                  onClick={handleEmailSubmit}
                  disabled={!email || isProcessing}
                  className="w-full py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <span>Continue</span>
                  <Mail className="w-5 h-5" />
                </button>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  We'll never spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              {/* Processing Animation */}
              <div className="mb-8">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-purple-500 animate-spin-slow" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Creating Your Roadmap
              </h2>
              <p className="text-gray-600 mb-8">
                Analyzing your unique path to success...
              </p>
              
              {/* Progress Bar */}
              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            </div>
          )}
        </div>
        
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (screen === 'results' && pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm">
            <Home className="w-8 h-8 text-gray-900 mr-2" />
            <span className="text-2xl font-bold text-gray-900">HOME</span>
          </div>
        </div>
        
        {/* Results Content */}
        <div className="px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Pathway Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${pathway.color} rounded-3xl mb-6 shadow-2xl`}>
                <span className="text-5xl">{pathway.icon}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {pathway.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {pathway.description}
              </p>
            </div>
            
            {/* Action Steps */}
            <div className="grid md:grid-cols-2 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Next Steps</h3>
                <div className="space-y-4">
                  {['Define your unique voice', 'Build your audience', 'Create consistently', 'Connect with HOME'].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${pathway.color} rounded-full flex items-center justify-center text-white font-medium flex-shrink-0`}>
                        {i + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">HOME Resources</h3>
                <p className="mb-6 text-gray-300">
                  {pathway.homeConnection}
                </p>
                <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-medium hover:shadow-lg transition-all">
                  Explore HOME
                </button>
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button 
                onClick={() => window.location.href = 'https://homeformusic.org'}
                className={`inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r ${pathway.color} rounded-full hover:shadow-xl hover:scale-105 transition-all`}
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slide-up {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-slide-up {
            opacity: 0;
            animation: slide-up 0.8s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default HOMEQuizMVP;
