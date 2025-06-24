import React, { useState } from 'react';
import { ChevronRight, Home, Mail, ArrowRight, Check, Users, Star, Loader, ChevronLeft } from 'lucide-react';

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

  const handleBack = () => {
    const currentIndex = questions.findIndex(q => q.id === currentStep);
    if (currentIndex > 0) {
      const previousQuestion = questions[currentIndex - 1];
      setCurrentStep(previousQuestion.id);
      
      // Remove the current question's response
      const newResponses = { ...responses };
      delete newResponses[currentStep];
      setResponses(newResponses);
    } else {
      setCurrentStep('landing');
      setResponses({});
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
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #1DD1A1 100%)' }}>
                <Home className="w-6 h-6 text-white font-bold" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">HOME</span>
                <span className="text-sm text-gray-500 ml-2">for Music</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Path on the<br />
              <span style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Music Creator Roadmap
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              2-minute AI quiz to discover your personalized pathway in the music industry
            </p>
            
            {/* Simple value props */}
            <div className="flex items-center justify-center gap-8 mb-12 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#1DD1A1' }}></div>
                AI-Powered Results
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#1DD1A1' }}></div>
                Nashville Community
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#1DD1A1' }}></div>
                Personalized Roadmap
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={() => setCurrentStep(questions[0].id)}
              className="text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center hover:opacity-90"
              style={{ backgroundColor: '#B91372' }}
            >
              Start Your Quiz
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-4">Takes 2 minutes • Completely free</p>

            {/* Social proof */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                Trusted by 1,000+ music creators
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email capture step
  if (currentStep === 'email-capture') {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #1DD1A1 100%)' }}>
                <Home className="w-6 h-6 text-white font-bold" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">HOME</span>
                <span className="text-sm text-gray-500 ml-2">for Music</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Your Personalized Roadmap is Ready!</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get your AI-generated pathway with personalized next steps, recommended resources, and exclusive access to HOME's community.
            </p>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">You'll receive:</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: '#1DD1A1' }} />
                  <span className="text-gray-700">Your personalized music creator pathway</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: '#1DD1A1' }} />
                  <span className="text-gray-700">Specific next steps tailored to your goals</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: '#1DD1A1' }} />
                  <span className="text-gray-700">Curated resources and tools for your journey</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: '#1DD1A1' }} />
                  <span className="text-gray-700">Invitation to monthly HOME webinar ($299 course access)</span>
                </div>
              </div>
            </div>

            {/* Email Form */}
            <div className="bg-white border-2 rounded-2xl p-8 shadow-sm" style={{ borderColor: '#1DD1A1' }}>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Enter your email to get your results:</h3>
              <div className="flex gap-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent text-lg"
                  style={{ focusRingColor: '#1DD1A1' }}
                />
                <button
                  onClick={handleEmailSubmit}
                  disabled={!email || isSubmitting}
                  className="text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center disabled:opacity-50 hover:opacity-90 text-lg"
                  style={{ backgroundColor: '#B91372' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Get My Results
                      <Mail className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500">We'll send your results instantly. No spam, ever.</p>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                Join 1,000+ music creators who found their path with HOME
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Remove the old results page - we're sending results via email now

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)' }}>
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Your Email! 📧</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your personalized Music Creator Roadmap has been sent to <strong>{email}</strong>
          </p>
          
          <div className="rounded-2xl p-6 mb-8 border shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(29, 209, 161, 0.05) 0%, rgba(185, 19, 114, 0.05) 100%)', borderColor: 'rgba(29, 209, 161, 0.2)' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What's in your email:</h3>
            <div className="text-left space-y-2 text-gray-700">
              <p>✓ Your personalized pathway with AI-generated insights</p>
              <p>✓ Specific next steps tailored to your responses</p>
              <p>✓ Recommended resources for your journey</p>
              <p>✓ Exclusive webinar invitation ($299 course access)</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">Don't see the email? Check your spam folder or try another email address.</p>
            <button 
              onClick={() => {
                setCurrentStep('email-capture');
                setEmail('');
              }}
              className="text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:opacity-90 mr-4"
              style={{ backgroundColor: '#B91372' }}
            >
              Try Different Email
            </button>
            <button 
              onClick={() => {
                setCurrentStep('landing');
                setResponses({});
                setAiResult(null);
                setEmail('');
              }}
              className="text-gray-600 hover:text-gray-900 font-semibold py-3 px-6 rounded-full transition-all duration-300 border border-gray-300 hover:border-gray-400"
            >
              Take Quiz Again
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Welcome to the HOME Community! 🏡</h4>
            <p className="text-gray-600">You're now part of Nashville's most supportive music creator community. We're excited to support your journey!</p>
          </div>
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
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #1DD1A1 100%)' }}>
              <Home className="w-6 h-6 text-white font-bold" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">HOME</span>
              <span className="text-sm text-gray-500 ml-2">for Music</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)'
              }}
            ></div>
          </div>
          <p className="text-gray-500 text-center mt-3 text-sm">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center leading-tight">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponse(currentQuestion.id, option.value)}
                className="w-full p-6 text-left bg-gray-50 rounded-xl transition-all duration-300 border border-gray-200 group cursor-pointer hover:shadow-md"
                style={{
                  ':hover': {
                    background: 'linear-gradient(135deg, rgba(29, 209, 161, 0.1) 0%, rgba(185, 19, 114, 0.1) 100%)',
                    borderColor: '#1DD1A1'
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(29, 209, 161, 0.1) 0%, rgba(185, 19, 114, 0.1) 100%)';
                  e.target.style.borderColor = '#1DD1A1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 transition-colors duration-300 leading-relaxed">
                    {option.label}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:opacity-100 transition-all duration-300" style={{ color: '#1DD1A1' }} />
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
