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
      // After last question, go to email capture instead of generating
      setCurrentStep('email-capture');
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
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // First, generate the AI results
      console.log('🤖 Generating AI results...');
      await generateAIResult(responses);
      
      // Wait a moment to ensure aiResult is set
      setTimeout(async () => {
        try {
          // Then submit to GHL with results
          console.log('📧 Submitting to GHL with results...');
          await fetch('/api/submit-lead', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              pathway: aiResult?.title,
              responses,
              source: 'music-creator-roadmap-quiz',
              results: {
                pathway_title: aiResult?.title,
                pathway_description: aiResult?.description,
                pathway_icon: aiResult?.icon,
                home_connection: aiResult?.homeConnection,
                next_steps: aiResult?.nextSteps,
                recommended_resources: aiResult?.resources,
                is_personalized: aiResult?.isPersonalized
              }
            })
          });
          
          console.log('✅ Successfully submitted to GHL');
          setCurrentStep('results');
        } catch (error) {
          console.error('Error submitting to GHL:', error);
          setCurrentStep('results'); // Still show results even if GHL fails
        }
        
        setIsSubmitting(false);
      }, 1500); // Give time for AI result to be set
      
    } catch (error) {
      console.error('Error in email submit process:', error);
      setIsSubmitting(false);
      setCurrentStep('results'); // Show results anyway
    }
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
      <div className="min-h-screen bg-white flex items-center justify-center p-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Get Your Personalized Roadmap!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Enter your email to receive your AI-generated pathway with personalized recommendations.
          </p>

          <div className="bg-white border-2 rounded-2xl p-8 shadow-sm" style={{ borderColor: '#1DD1A1' }}>
            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent text-lg mb-4"
              />
              <button
                onClick={handleEmailSubmit}
                disabled={!email || isSubmitting}
                className="w-full text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 hover:opacity-90 text-lg flex items-center justify-center"
                style={{ backgroundColor: '#B91372' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Results...
                  </>
                ) : (
                  'Get My Results'
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500">We'll send your results instantly. No spam, ever.</p>
          </div>
        </div>
      </div>
    );
  }

  // Results page
  if (currentStep === 'results' && aiResult) {
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

        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Results Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{aiResult.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{aiResult.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {aiResult.description}
            </p>
            {aiResult.isPersonalized && (
              <div className="inline-flex items-center mt-4 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'linear-gradient(135deg, rgba(29, 209, 161, 0.1) 0%, rgba(185, 19, 114, 0.1) 100%)', color: '#B91372' }}>
                <Star className="w-4 h-4 mr-2" />
                AI-Personalized for You
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Next Steps */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ArrowRight className="w-6 h-6 mr-3" style={{ color: '#1DD1A1' }} />
                Your Next Steps
              </h3>
              <div className="space-y-4">
                {aiResult.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4" style={{ backgroundColor: '#B91372' }}>
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3" style={{ color: '#1DD1A1' }} />
                Recommended Resources
              </h3>
              <div className="space-y-3">
                {aiResult.resources.map((resource, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#1DD1A1' }}></div>
                    <p className="text-gray-700">{resource}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HOME Connection */}
          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(29, 209, 161, 0.05) 0%, rgba(185, 19, 114, 0.05) 100%)' }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How HOME Supports Your Journey</h3>
            <p className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
              {aiResult.homeConnection}
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Ready to accelerate your music career?</p>
            <button 
              className="text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:opacity-90 mr-4"
              style={{ backgroundColor: '#B91372' }}
            >
              Join HOME Community
            </button>
            <button 
              onClick={() => {
                setCurrentStep('landing');
                setResponses({});
                setAiResult(null);
                setEmail('');
              }}
              className="text-gray-600 hover:text-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 border border-gray-300 hover:border-gray-400"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while generating results
  if (currentStep === 'results' && isSubmitting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin mx-auto mb-4" style={{ color: '#B91372' }} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Personalized Roadmap</h2>
          <p className="text-gray-600">Our AI is analyzing your responses...</p>
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
