import React, { useState } from 'react';
import { ChevronRight, Home, Mail, ArrowRight, Check, Users, Star, Loader } from 'lucide-react';

const HOMEQuizMVP = () => {
  const [currentStep, setCurrentStep] = useState('landing');
  const [responses, setResponses] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: 'motivation',
      question: "What drives your music career ambitions?",
      type: 'single',
      options: [
        { value: 'stage-energy', label: 'The energy of live performance and connecting with audiences' },
        { value: 'creative-expression', label: 'Artistic expression and building something uniquely mine' },
        { value: 'behind-scenes', label: 'Creating music for others and collaborating with artists' },
        { value: 'business-building', label: 'Building a sustainable music business and brand' }
      ]
    },
    {
      id: 'ideal-day',
      question: "Describe your ideal workday as a music professional:",
      type: 'single',
      options: [
        { value: 'performing', label: 'Rehearsing, soundchecking, and performing for live audiences' },
        { value: 'creating-content', label: 'Writing, recording, and creating content for my brand' },
        { value: 'studio-work', label: 'In the studio producing tracks and collaborating with other artists' },
        { value: 'strategy-networking', label: 'Planning releases, networking, and growing my business' }
      ]
    },
    {
      id: 'success-vision',
      question: "When you imagine success 3 years from now, you see yourself:",
      type: 'single',
      options: [
        { value: 'touring-artist', label: 'Headlining tours and playing major venues with a dedicated fanbase' },
        { value: 'creative-brand', label: 'Having multiple revenue streams from my creative work and personal brand' },
        { value: 'in-demand-producer', label: 'Being the go-to producer/writer that artists seek out for collaborations' }
      ]
    },
    {
      id: 'stage-level',
      question: "Which best describes your current stage in HOME's framework?",
      type: 'single',
      options: [
        { value: 'planning', label: 'Planning Stage - Figuring out my path and building foundations' },
        { value: 'production', label: 'Production Stage - Actively creating and releasing work' },
        { value: 'scale', label: 'Scale Stage - Ready to grow and expand my existing success' }
      ]
    },
    {
      id: 'resources-priority',
      question: "What type of resources would most accelerate your career right now?",
      type: 'single',
      options: [
        { value: 'performance-facilities', label: 'Rehearsal spaces, live sound equipment, and performance opportunities' },
        { value: 'content-creation', label: 'Recording studios, video production, and content creation tools' },
        { value: 'collaboration-network', label: 'Access to other creators, producers, and industry professionals' },
        { value: 'business-mentorship', label: 'Business guidance, marketing strategy, and industry connections' }
      ]
    }
  ];

  const pathwayTemplates = {
    'touring-performer': {
      title: 'The Touring Performer Path',
      baseDescription: 'Your energy comes alive on stage. You\'re built for the big venues, the tours, and creating unforgettable live experiences.',
      icon: '🎤',
      nextSteps: [
        'Build a powerful 45-60 minute setlist that showcases your range',
        'Develop your stage presence through regular performance opportunities',
        'Create a professional EPK to pitch to venues and booking agents',
        'Network with booking professionals and venue owners in your scene'
      ],
      resources: [
        'Rehearsal Facility Access (24/7 at HOME)',
        'Live Sound & Performance Equipment',
        'Stage Presence Coaching Sessions',
        'Booking Strategy & Agent Connections'
      ],
      homeConnection: 'HOME\'s 250-capacity venue and rehearsal facilities provide the perfect environment to develop your live show.'
    },
    'creative-artist': {
      title: 'The Creative Artist Path', 
      baseDescription: 'You\'re driven by authentic self-expression and building multiple creative revenue streams through your artistry.',
      icon: '🎨',
      nextSteps: [
        'Define your unique artistic voice and visual brand identity',
        'Create a content strategy that showcases your creative process',
        'Develop multiple revenue streams: streaming, merchandise, content',
        'Build an authentic community around your art through storytelling'
      ],
      resources: [
        'Content Creation Studios & Equipment',
        'Brand Development & Visual Design',
        'Social Media Strategy & Management',
        'Revenue Diversification Coaching'
      ],
      homeConnection: 'HOME\'s content creation facilities and collaborative artist community provide the tools to build your creative empire.'
    },
    'writer-producer': {
      title: 'The Writer-Producer Path',
      baseDescription: 'You thrive behind the scenes, crafting the perfect sound for other artists and building a reputation for excellence.',
      icon: '🎹',
      nextSteps: [
        'Master your DAW and develop a signature production style',
        'Build a diverse portfolio showcasing your range across genres',
        'Network with artists, labels, and music supervisors',
        'Learn the business side: publishing, sync licensing, contracts'
      ],
      resources: [
        'Professional Recording Studios (24/7 access)',
        'Industry-Standard Production Equipment',
        'Collaboration Network & Artist Connections',
        'Music Business & Publishing Education'
      ],
      homeConnection: 'HOME\'s professional studios and A&R program provide the perfect ecosystem for producers to create and collaborate.'
    }
  };

  const generateAIResult = async (responses) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-pathway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate pathway');
      }
      
      const result = await response.json();
      setAiResult(result);
      
    } catch (error) {
      console.error('Error generating pathway:', error);
      
      const pathwayKey = determinePathwayFallback(responses);
      const template = pathwayTemplates[pathwayKey];
      
      const fallbackResult = {
        ...template,
        description: `${template.baseDescription} Based on your responses, this path aligns with your goals and current stage.`,
        isPersonalized: false
      };
      
      setAiResult(fallbackResult);
    }
    
    setIsGenerating(false);
  };

  const determinePathwayFallback = (responses) => {
    const pathwayScores = {
      'touring-performer': 0,
      'creative-artist': 0,
      'writer-producer': 0
    };
    
    const motivationMap = {
      'stage-energy': 'touring-performer',
      'creative-expression': 'creative-artist', 
      'behind-scenes': 'writer-producer',
      'business-building': 'creative-artist'
    };
    
    if (motivationMap[responses.motivation]) {
      pathwayScores[motivationMap[responses.motivation]] += 3;
    }
    
    const idealDayMap = {
      'performing': 'touring-performer',
      'creating-content': 'creative-artist',
      'studio-work': 'writer-producer',
      'strategy-networking': 'creative-artist'
    };
    
    if (idealDayMap[responses['ideal-day']]) {
      pathwayScores[idealDayMap[responses['ideal-day']]] += 3;
    }
    
    const visionMap = {
      'touring-artist': 'touring-performer',
      'creative-brand': 'creative-artist',
      'in-demand-producer': 'writer-producer'
    };
    
    if (visionMap[responses['success-vision']]) {
      pathwayScores[visionMap[responses['success-vision']]] += 4;
    }
    
    return Object.keys(pathwayScores).reduce((a, b) => 
      pathwayScores[a] > pathwayScores[b] ? a : b
    );
  };

  const handleResponse = (questionId, value) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);
    
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex < questions.length - 1) {
      setCurrentStep(questions[currentIndex + 1].id);
    } else {
      generateAIResult(newResponses);
      setCurrentStep('generating');
    }
  };

  const handleEmailSubmit = async () => {
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          pathway: aiResult?.title,
          responses,
          source: 'music-creator-roadmap-quiz'
        })
      });
      
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error submitting lead:', error);
      setCurrentStep('complete');
    }
    
    setIsSubmitting(false);
  };

  if (currentStep === 'landing') {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">HOME</span>
              <span className="text-sm text-gray-500 ml-2">for Music</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Path on the<br />
              <span className="text-blue-600">Music Creator Roadmap</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Take our AI-powered quiz to discover your personalized pathway and get connected 
              with Nashville's most supportive music community.
            </p>
            
            <div className="flex items-center justify-center mb-8">
              <div className="flex text-yellow-400 mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">Trusted by 1,000+ music creators</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Personalization</h3>
              <p className="text-gray-600">Get a custom pathway based on your unique goals, experience, and creative focus.</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-4">🏡</div>
              <h3 className="text-xl font-semibold mb-3">Nashville Community</h3>
              <p className="text-gray-600">Connect with Music City's top talent and join our supportive creator community.</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3">Business Growth</h3>
              <p className="text-gray-600">Learn to turn your passion into a sustainable, profitable music career.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-12 text-center">
            <p className="text-lg text-gray-700 mb-4 italic">
              "HOME is amazing no matter what kind of role you play in the music industry. 
              It's rehearsal space, multiple recording studios, a content making palace, 
              and better than a masterclass subscription rolled into one🤘🏻"
            </p>
            <div className="text-sm text-gray-600">
              — Nolan Brown, Music City Mayhem Competition Winner
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setCurrentStep(questions[0].id)}
              className="btn-primary inline-flex items-center"
            >
              Start Your Roadmap Quiz
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-4">Takes 2 minutes • Completely free</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'generating') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Creating Your Personal Roadmap</h2>
          <p className="text-gray-600 mb-8">
            Our AI is analyzing your responses and crafting a pathway designed specifically for your music career goals...
          </p>
          {aiResult && (
            <button 
              onClick={() => setCurrentStep('result')}
              className="btn-primary"
            >
              View Your Results
            </button>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'result' && aiResult) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">HOME</span>
              <span className="text-sm text-gray-500 ml-2">for Music</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{aiResult.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{aiResult.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{aiResult.description}</p>
            {aiResult.isPersonalized === false && (
              <p className="text-sm text-blue-600 mt-2">*Personalized with AI recommendations coming soon</p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Your Next Steps</h3>
              <div className="space-y-4">
                {aiResult.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Recommended Resources</h3>
              <div className="space-y-3">
                {aiResult.resources.map((resource, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{resource}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-xl p-8 text-white text-center mb-12">
            <h3 className="text-2xl font-semibold mb-4">How HOME Can Help</h3>
            <p className="text-blue-100 text-lg mb-6">{aiResult.homeConnection}</p>
            <div className="flex items-center justify-center">
              <Users className="w-6 h-6 mr-2" />
              <span>Join 1,000+ creators in our community</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your Complete Roadmap</h3>
            <p className="text-gray-600 mb-6">
              Join our monthly <strong>"Find Your Path on the Music Creator Roadmap"</strong> webinar and receive:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Music Creator Roadmap Course</h4>
                <p className="text-gray-600 text-sm">9-module course ($299 value)</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Artist Branding Playbook</h4>
                <p className="text-gray-600 text-sm">FREE bonus for 24-hour enrollees</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">HOME Community Access</h4>
                <p className="text-gray-600 text-sm">Connect with Nashville's top talent</p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for webinar access"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleEmailSubmit}
                  disabled={!email || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 flex items-center"
                >
                  {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-500">Next webinar: Third Thursday of every month</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Check className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the HOME Community! 🏡</h1>
          <p className="text-xl text-gray-600 mb-8">
            Check your email for your webinar invitation and complete roadmap. 
            We're excited to support your journey as a music creator!
          </p>
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens next?</h3>
            <div className="text-left space-y-2 text-gray-700">
              <p>✓ You'll receive pathway-specific emails over the next 5-7 days</p>
              <p>✓ Webinar reminder 3 days before the event</p>
              <p>✓ Early access to HOME community resources</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setCurrentStep('landing');
              setResponses({});
              setAiResult(null);
              setEmail('');
            }}
            className="btn-primary"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  // Question rendering
  const currentQuestion = questions.find(q => q.id === currentStep);
  if (!currentQuestion) return null;

  const currentIndex = questions.findIndex(q => q.id === currentStep);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-2xl font-bold text-gray-900">HOME</span>
            <span className="text-sm text-gray-500 ml-2">for Music</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-500 text-center mt-3 text-sm">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponse(currentQuestion.id, option.value)}
                className="quiz-option"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                    {option.label}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOMEQuizMVP;