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
        { value: 'live-performance', label: 'The energy of a live audience and performing music from the stage' },
        { value: 'artistic-expression', label: 'Artistic expression through recording music and building a loyal following online' },
        { value: 'collaboration', label: 'Making great songs and collaborating with other talented creators' }
      ]
    },
    {
      id: 'ideal-day',
      question: "Describe your ideal workday as a music professional:",
      type: 'single',
      options: [
        { value: 'performing-travel', label: 'Traveling to a new city to perform for a live audience' },
        { value: 'releasing-music', label: 'Releasing a new song that you are really proud of' },
        { value: 'writing-creating', label: 'Writing the best song that you have ever written' }
      ]
    },
    {
      id: 'success-vision',
      question: "When you imagine success 5 years from now, you see yourself:",
      type: 'single',
      options: [
        { value: 'touring-headliner', label: 'Headlining major tours and playing sold out shows around the world' },
        { value: 'passive-income-artist', label: 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions' },
        { value: 'hit-songwriter', label: 'Having multiple major hit songs that you collaborated on and earning \'mailbox money\' through sync placements and other royalty streams' }
      ]
    },
    {
      id: 'current-stage',
      question: "Which best describes your current stage?",
      type: 'single',
      options: [
        { value: 'planning', label: 'Planning Stage - Figuring out my path and building foundations' },
        { value: 'production', label: 'Production Stage - Actively creating and releasing work' },
        { value: 'scale', label: 'Scale Stage - Already making the majority of my income from music and looking to grow my business' }
      ]
    },
    {
      id: 'biggest-challenge',
      question: "What's the biggest thing holding your music journey back right now?",
      type: 'single',
      options: [
        { value: 'performance-opportunities', label: 'I need more opportunities to perform and grow my live audience' },
        { value: 'brand-audience', label: 'I\'m creating great content, but struggle to build a consistent brand and online audience' },
        { value: 'collaboration-income', label: 'I work behind the scenes, but need better access to collaborators, placements, and consistent income' }
      ]
    }
  ];

  const pathwayTemplates = {
    'touring-performer': {
      title: 'The Touring Performer Path',
      baseDescription: 'You thrive on stage energy and live connections. Your priority is building a powerful live presence and growing your touring opportunities.',
      icon: '🎤',
      nextSteps: [
        'Priority 1: Build a compelling 45-60 minute setlist that showcases your range and gets audiences engaged',
        'Priority 2: Book regular local shows to develop your stage presence and build a local fanbase',
        'Priority 3: Create a professional EPK (Electronic Press Kit) to pitch to larger venues and booking agents',
        'Priority 4: Connect with HOME\'s performance community and utilize our 24/7 rehearsal facilities to perfect your live show'
      ],
      resources: [
        'Rehearsal Facility Access (24/7 at HOME)',
        'Live Sound & Performance Equipment',
        'Stage Presence Coaching Sessions',
        'Booking Strategy & Agent Connections',
        'Performance Opportunities at HOME Venue',
        'Artist Community & Mentorship'
      ],
      homeConnection: 'HOME\'s 250-capacity venue and 24/7 rehearsal facilities provide the perfect environment to develop your live show and connect with booking professionals.'
    },
    'creative-artist': {
      title: 'The Creative Artist Path',
      baseDescription: 'You\'re driven by artistic expression and building an authentic online following. Your priority is developing a consistent brand and sustainable revenue streams.',
      icon: '🎨',
      nextSteps: [
        'Priority 1: Define your unique artistic voice and visual brand identity that resonates with your target audience',
        'Priority 2: Develop a consistent content strategy that showcases your music and creative process across platforms',
        'Priority 3: Build multiple revenue streams through streaming, merchandise, fan subscriptions, and brand partnerships',
        'Priority 4: Join HOME\'s artist community to collaborate and learn from other creative entrepreneurs'
      ],
      resources: [
        'Content Creation Studios & Equipment',
        'Brand Development & Visual Design Support',
        'Social Media Strategy & Management Training',
        'Revenue Diversification Workshops',
        'Video Production & Editing Tools',
        'Artist Community & Collaboration Network'
      ],
      homeConnection: 'HOME\'s content creation facilities and collaborative artist community provide the tools and connections to build your creative empire and sustainable income.'
    },
    'writer-producer': {
      title: 'The Writer-Producer Path',
      baseDescription: 'You excel at collaboration and creating music for others. Your priority is building industry connections and developing multiple income streams through your technical skills.',
      icon: '🎹',
      nextSteps: [
        'Priority 1: Master your craft and develop a signature sound that makes you indispensable to artists and labels',
        'Priority 2: Build a diverse portfolio showcasing your range across genres and collaboration styles',
        'Priority 3: Network strategically with artists, labels, and music supervisors to secure consistent placements',
        'Priority 4: Learn the business side including publishing, sync licensing, and contracts to maximize your earnings'
      ],
      resources: [
        'Professional Recording Studios (24/7 access)',
        'Industry-Standard Production Equipment',
        'Collaboration Network & Artist Connections',
        'Music Business & Publishing Education',
        'Sync Licensing & Placement Opportunities',
        'A&R Program & Industry Connections'
      ],
      homeConnection: 'HOME\'s professional studios, A&R program, and producer community provide the perfect ecosystem for behind-the-scenes creators to build sustainable careers.'
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
      setIsGenerating(false);
      return result;
      
    } catch (error) {
      console.error('Error generating pathway:', error);
      
      const pathwayKey = determinePathwayFallback(responses);
      const template = pathwayTemplates[pathwayKey];
      
      const fallbackResult = {
        title: template.title,
        description: `${template.baseDescription} Based on your responses, this path aligns with your goals and current stage.`,
        icon: template.icon,
        nextSteps: template.nextSteps,
        customNextSteps: template.nextSteps.map((step, index) => ({
          priority: index + 1,
          step: step
        })),
        resources: template.resources,
        homeConnection: template.homeConnection,
        isPersonalized: false
      };
      
      setAiResult(fallbackResult);
      setIsGenerating(false);
      return fallbackResult;
    }
  };

  const determinePathwayFallback = (responses) => {
    const pathwayScores = {
      'touring-performer': 0,
      'creative-artist': 0,
      'writer-producer': 0
    };
    
    // Score based on motivation
    if (responses.motivation === 'live-performance') {
      pathwayScores['touring-performer'] += 4;
    }
    if (responses.motivation === 'artistic-expression') {
      pathwayScores['creative-artist'] += 4;
    }
    if (responses.motivation === 'collaboration') {
      pathwayScores['writer-producer'] += 4;
    }
    
    // Score based on ideal day
    if (responses['ideal-day'] === 'performing-travel') {
      pathwayScores['touring-performer'] += 3;
    }
    if (responses['ideal-day'] === 'releasing-music') {
      pathwayScores['creative-artist'] += 3;
    }
    if (responses['ideal-day'] === 'writing-creating') {
      pathwayScores['writer-producer'] += 3;
    }
    
    // Score based on success vision (highest weight)
    if (responses['success-vision'] === 'touring-headliner') {
      pathwayScores['touring-performer'] += 5;
    }
    if (responses['success-vision'] === 'passive-income-artist') {
      pathwayScores['creative-artist'] += 5;
    }
    if (responses['success-vision'] === 'hit-songwriter') {
      pathwayScores['writer-producer'] += 5;
    }
    
    // Score based on biggest challenge
    if (responses['biggest-challenge'] === 'performance-opportunities') {
      pathwayScores['touring-performer'] += 3;
    }
    if (responses['biggest-challenge'] === 'brand-audience') {
      pathwayScores['creative-artist'] += 3;
    }
    if (responses['biggest-challenge'] === 'collaboration-income') {
      pathwayScores['writer-producer'] += 3;
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
      setCurrentStep('email-capture');
    }
  };

  const handleBack = () => {
    const currentIndex = questions.findIndex(q => q.id === currentStep);
    if (currentIndex > 0) {
      const previousQuestion = questions[currentIndex - 1];
      setCurrentStep(previousQuestion.id);
      
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
      console.log('🤖 Generating AI results for responses:', responses);
      const generatedResult = await generateAIResult(responses);
      
      console.log('✅ Generated result:', {
        title: generatedResult?.title,
        description: generatedResult?.description?.substring(0, 100) + '...',
        hasNextSteps: !!generatedResult?.nextSteps?.length,
        nextStepsCount: generatedResult?.nextSteps?.length,
        hasResources: !!generatedResult?.resources?.length,
        resourcesCount: generatedResult?.resources?.length,
        isPersonalized: generatedResult?.isPersonalized,
        fullResult: generatedResult
      });
      
      console.log('📧 Submitting to GHL with results...');
      const submitPayload = {
        email,
        pathway: generatedResult?.title,
        responses,
        source: 'music-creator-roadmap-quiz',
        results: {
          pathway_title: generatedResult?.title,
          pathway_description: generatedResult?.description,
          pathway_icon: generatedResult?.icon,
          home_connection: generatedResult?.homeConnection,
          next_steps: generatedResult?.customNextSteps || generatedResult?.nextSteps,
          recommended_resources: generatedResult?.resources,
          is_personalized: generatedResult?.isPersonalized,
          customNextSteps: generatedResult?.customNextSteps,
          nextSteps: generatedResult?.nextSteps
        }
      };
      
      console.log('📤 Payload being sent to GHL:', {
        email: submitPayload.email,
        pathway: submitPayload.pathway,
        resultsKeys: Object.keys(submitPayload.results),
        nextStepsType: Array.isArray(submitPayload.results.next_steps) ? 'array' : typeof submitPayload.results.next_steps,
        nextStepsLength: Array.isArray(submitPayload.results.next_steps) ? submitPayload.results.next_steps.length : 'not array',
        firstStepStructure: Array.isArray(submitPayload.results.next_steps) ? submitPayload.results.next_steps[0] : 'not array',
        resourcesLength: submitPayload.results.recommended_resources?.length
      });
      
      const submitResponse = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitPayload)
      });
      
      const submitResult = await submitResponse.json();
      console.log('✅ Submit result:', submitResult);
      
      setCurrentStep('results');
      
    } catch (error) {
      console.error('Error in email submit process:', error);
      setCurrentStep('results');
    }
    
    setIsSubmitting(false);
  };

  if (currentStep === 'landing') {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <style jsx>{`
          body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              font-family: 'Montserrat', Arial, sans-serif;
              background-color: #ffffff;
              -webkit-overflow-scrolling: touch;
              overflow-x: hidden;
          }

          html {
              height: 100%;
              overflow-x: hidden;
          }

          @media only screen and (max-width: 768px) {
              .hero-title {
                  font-size: 2.25rem !important;
                  line-height: 1.2 !important;
                  margin-bottom: 1.5rem !important;
              }

              .hero-subtitle {
                  font-size: 1.125rem !important;
                  margin-bottom: 2rem !important;
              }

              .hero-features {
                  flex-direction: column !important;
                  gap: 0.75rem !important;
                  font-size: 0.875rem !important;
                  margin-bottom: 2rem !important;
              }

              .mobile-cta-button {
                  font-size: 1.125rem !important;
                  padding: 1rem 2rem !important;
                  margin-bottom: 1rem !important;
              }

              .bottom-logo {
                  height: 50px !important;
                  max-width: 200px !important;
              }

              .mobile-container {
                  padding: 2rem 1.5rem !important;
              }

              .mobile-text-center {
                  text-align: center;
              }
          }
        `}</style>
        
        {/* Full screen centered container */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-4xl mx-auto px-6 mobile-container">
            <div className="text-center mobile-text-center">
              {/* Main heading group */}
              <div className="mb-12">
                <h1 className="hero-title text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Find Your Path on the<br />
                  <span style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Music Creator Roadmap
                  </span>
                </h1>
                <p className="hero-subtitle text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  2-minute AI quiz to discover your personalized pathway in the music industry
                </p>
                
                {/* Value props */}
                <div className="hero-features flex items-center justify-center gap-8 mb-10 text-sm text-gray-600 flex-wrap">
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
              </div>

              {/* CTA Section */}
              <div className="mb-12">
                <button 
                  onClick={() => setCurrentStep(questions[0].id)}
                  className="mobile-cta-button text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center hover:opacity-90 mb-4"
                  style={{ backgroundColor: '#B91372' }}
                >
                  Find My Path
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
                <p className="text-sm text-gray-500">Takes 2 minutes • Completely free</p>
              </div>

              {/* Footer branding section */}
              <div>
                <div className="mb-6">
                  <img 
                    src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/685b3b45958e7f525884f62d.png" 
                    alt="HOME for Music" 
                    className="bottom-logo mx-auto"
                    style={{
                      height: '70px',
                      width: 'auto',
                      maxWidth: '280px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                
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
      </div>
    );
  }

  // Email capture step
  if (currentStep === 'email-capture') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get Your Personalized Roadmap!</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Enter your email to receive your AI-generated pathway with personalized recommendations.
          </p>

          <div className="bg-white border-2 rounded-2xl p-6 md:p-8 shadow-sm" style={{ borderColor: '#1DD1A1' }}>
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
        <style jsx>{`
          @media only screen and (max-width: 768px) {
            .step:nth-child(odd),
            .step:nth-child(even) {
              justify-content: center;
              padding: 0;
            }
            
            .step-content {
              width: 260px;
            }
          }
        `}</style>
        
        <div className="container max-w-[800px] mx-auto bg-white">
          {/* Header */}
          <div className="header bg-gradient-to-br from-[#1DD1A1] to-[#B91372] text-white p-10 text-center rounded-2xl mx-6 mt-6">
            <h1 className="text-5xl font-bold mb-3 tracking-tight">{aiResult.title.toUpperCase().replace('PATH', '')}</h1>
            <p className="text-xl opacity-95 font-normal">Your Personalized Path to Music Success</p>
          </div>
          
          {/* Journey Container */}
          <div className="journey-container bg-white px-5 py-10 relative min-h-[800px]">
            {/* Journey Start */}
            <div className="journey-start text-center mb-16 relative">
              <h3 className="inline-block bg-[#1DD1A1] text-white text-xl font-semibold px-6 py-4 rounded-2xl mb-4">
                🎯 YOUR CURRENT POSITION
              </h3>
              <p className="bg-gradient-to-br from-[#1DD1A1]/85 to-[#1DD1A1]/95 text-white px-5 py-4 rounded-2xl border border-[#1DD1A1]/30 max-w-md mx-auto">
                {aiResult.description}
              </p>
            </div>
            
            {/* Main Path Container */}
            <div className="path-container relative max-w-[700px] mx-auto">
              {/* Vertical Progress Bar */}
              <div className="progress-bar-container absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 z-[1]">
                <div className="w-full h-full bg-gradient-to-b from-[#1DD1A1] to-[#B91372] rounded-[3px]"></div>
              </div>
              
              {/* Steps Container */}
              <div className="steps-container relative z-[5] py-5">
                {(aiResult.customNextSteps || aiResult.nextSteps || []).map((step, index) => {
                  const stepText = typeof step === 'object' ? step.step : step;
                  const priority = typeof step === 'object' ? step.priority : index + 1;
                  
                  // Color progression
                  const colors = [
                    { main: '#1DD1A1', border: 'rgba(29, 209, 161, 0.3)', bg: 'rgba(29, 209, 161, 0.05)' },
                    { main: '#1BC49C', border: 'rgba(27, 196, 156, 0.3)', bg: 'rgba(27, 196, 156, 0.05)' },
                    { main: '#19AA86', border: 'rgba(25, 170, 134, 0.3)', bg: 'rgba(25, 170, 134, 0.05)' },
                    { main: '#178F70', border: 'rgba(23, 143, 112, 0.3)', bg: 'rgba(23, 143, 112, 0.05)' },
                    { main: '#A85990', border: 'rgba(168, 89, 144, 0.3)', bg: 'rgba(168, 89, 144, 0.05)' },
                    { main: '#B91372', border: 'rgba(185, 19, 114, 0.3)', bg: 'rgba(185, 19, 114, 0.05)' }
                  ];
                  
                  const color = colors[index] || colors[colors.length - 1];
                  
                  return (
                    <div 
                      key={index} 
                      className={`step relative mb-20 flex items-center ${
                        index % 2 === 0 ? 'justify-end pr-[50px]' : 'justify-start pl-[50px]'
                      }`}
                    >
                      <div 
                        className="step-content border rounded-2xl p-6 transition-all duration-300 w-[280px] relative hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          backgroundColor: color.bg,
                          borderColor: color.border
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = color.main;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = color.border;
                        }}
                      >
                        <div className="step-header flex items-center mb-3">
                          <div 
                            className="step-indicator w-[45px] h-[45px] rounded-xl flex items-center justify-center text-xl font-bold text-white mr-3 flex-shrink-0"
                            style={{ backgroundColor: color.main }}
                          >
                            {priority}
                          </div>
                          <h4 className="step-title text-lg font-semibold text-gray-900 leading-tight">
                            Priority {priority}
                          </h4>
                        </div>
                        <p className="step-description text-gray-700 text-sm leading-relaxed">
                          {stepText}
                        </p>
                      </div>
                      
                      {/* Dot on progress bar */}
                      <div 
                        className="absolute w-4 h-4 rounded-full border-4 border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[6]"
                        style={{
                          backgroundColor: color.main,
                          boxShadow: `0 0 0 2px ${color.main}`
                        }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Resources Section */}
            <div className="mt-16 mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Resources Available at HOME
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[600px] mx-auto">
                {aiResult.resources.map((resource, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-gray-50 px-4 py-3 rounded-xl"
                  >
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: '#1DD1A1' }}></div>
                    <p className="text-gray-700 text-sm">{resource}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Journey End - How HOME Supports You */}
            <div className="journey-end text-center mt-16 relative">
              <h3 className="inline-block bg-[#B91372] text-white text-xl font-semibold px-6 py-4 rounded-2xl mb-4">
                🏆 HOW HOME ACCELERATES YOUR SUCCESS
              </h3>
              <p className="bg-gradient-to-br from-[#B91372]/85 to-[#B91372]/95 text-white px-5 py-4 rounded-2xl border border-[#B91372]/30 max-w-lg mx-auto mb-5">
                {aiResult.homeConnection}
              </p>
              
              {/* Actionable CTAs */}
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[600px] mx-auto">
                  <button 
                    className="bg-[#B91372] text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
                    onClick={() => window.open('https://homeformusic.org/tour', '_blank')}
                  >
                    <div className="text-lg mb-1">Schedule a Tour</div>
                    <div className="text-sm opacity-90">Visit our Nashville facility</div>
                  </button>
                  
                  <button 
                    className="bg-[#1DD1A1] text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
                    onClick={() => window.open('https://homeformusic.org/book', '_blank')}
                  >
                    <div className="text-lg mb-1">Book Studio Time</div>
                    <div className="text-sm opacity-90">24/7 access available</div>
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 max-w-[600px] mx-auto">
                  <h4 className="font-bold text-gray-900 mb-3">Connect with Our Community Leaders:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#1DD1A1] rounded-full mr-2"></div>
                      <span className="text-gray-700">Sarah Chen - Artist Development</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#1DD1A1] rounded-full mr-2"></div>
                      <span className="text-gray-700">Marcus Williams - Studio Manager</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#1DD1A1] rounded-full mr-2"></div>
                      <span className="text-gray-700">Jessica Park - Community Lead</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#1DD1A1] rounded-full mr-2"></div>
                      <span className="text-gray-700">David Torres - A&R Director</span>
                    </div>
                  </div>
                  <button 
                    className="mt-4 text-[#B91372] font-semibold hover:underline"
                    onClick={() => window.open('mailto:community@homeformusic.org', '_blank')}
                  >
                    Email: community@homeformusic.org →
                  </button>
                </div>
                
                <div className="success-grid flex flex-wrap gap-2 justify-center max-w-[500px] mx-auto">
                  <span className="bg-[#B91372]/15 text-[#B91372] px-3 py-2 rounded-lg text-xs font-medium border border-[#B91372]/30">
                    24/7 Studio Access
                  </span>
                  <span className="bg-[#B91372]/15 text-[#B91372] px-3 py-2 rounded-lg text-xs font-medium border border-[#B91372]/30">
                    250-Capacity Venue
                  </span>
                  <span className="bg-[#B91372]/15 text-[#B91372] px-3 py-2 rounded-lg text-xs font-medium border border-[#B91372]/30">
                    Monthly Showcases
                  </span>
                  <span className="bg-[#B91372]/15 text-[#B91372] px-3 py-2 rounded-lg text-xs font-medium border border-[#B91372]/30">
                    Industry Connections
                  </span>
                  <span className="bg-[#B91372]/15 text-[#B91372] px-3 py-2 rounded-lg text-xs font-medium border border-[#B91372]/30">
                    Collaboration Network
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="footer bg-gray-50 text-gray-600 text-center p-5 text-sm border-t border-gray-200">
            <p>Your Personalized Music Creator Roadmap | HOME for Music | Nashville, TN</p>
            <button 
              onClick={() => {
                setCurrentStep('landing');
                setResponses({});
                setAiResult(null);
                setEmail('');
              }}
              className="mt-3 text-[#B91372] font-semibold hover:underline"
            >
              Take the Quiz Again →
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
        <div className="text-center px-6">
          <Loader className="w-16 h-16 animate-spin mx-auto mb-4" style={{ color: '#B91372' }} />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Generating Your Personalized Roadmap</h2>
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
      <div className="w-full max-w-3xl mx-auto px-6 py-8 md:py-16">
        {/* Back Button */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 md:mb-12">
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
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center leading-tight">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponse(currentQuestion.id, option.value)}
                className="w-full p-4 md:p-6 text-left rounded-xl border border-gray-200 group cursor-pointer transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: '#f9fafb'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(29, 209, 161, 0.1) 0%, rgba(185, 19, 114, 0.1) 100%)';
                  e.target.style.borderColor = '#1DD1A1';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(29, 209, 161, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 leading-relaxed text-sm md:text-base">
                    {option.label}
                  </span>
                  <ArrowRight className="w-4 md:w-5 h-4 md:h-5 text-gray-400 group-hover:opacity-100 transition-all duration-300" style={{ color: '#1DD1A1' }} />
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
