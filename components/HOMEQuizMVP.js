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
      return result; // Return the result so we can use it immediately
      
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
      return fallbackResult; // Return fallback result too
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
      // Generate AI results and get the result directly
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
      
      // Now submit to GHL with the actual results
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
          next_steps: generatedResult?.nextSteps,
          recommended_resources: generatedResult?.resources,
          is_personalized: generatedResult?.isPersonalized
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
      setCurrentStep('results'); // Show results anyway
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
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6849d8525a76ceebaddce1e2.png" 
                alt="HOME for Music" 
                style={{
                  height: '100px',
                  width: 'auto',
                  maxWidth: '400px',
                  maxHeight: '100px',
                  objectFit: 'contain'
                }}
              />
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
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6849d8525a76ceebaddce1e2.png" 
                alt="HOME for Music" 
                className="home-logo"
              />
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
                {(aiResult.customNextSteps || aiResult.nextSteps || []).map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4" style={{ backgroundColor: '#B91372' }}>
                      {typeof step === 'object' ? step.priority : index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {typeof step === 'object' ? step.step : step}
                    </p>
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
      <style jsx>{`
        .quiz-option {
            background-color: #f9fafb !important;
            border-color: #e5e7eb !important;
            transition: all 0.3s ease;
        }

        .quiz-option:hover {
            background: linear-gradient(135deg, rgba(29, 209, 161, 0.1) 0%, rgba(185, 19, 114, 0.1) 100%) !important;
            border-color: #1DD1A1 !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(29, 209, 161, 0.2);
        }

        .quiz-option:active {
            transform: translateY(0);
        }

        /* Mobile responsive */
        @media only screen and (max-width: 600px) {
            .quiz-option:hover {
                transform: none; /* Disable hover transform on mobile */
            }
        }
      `}</style>
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6849d8525a76ceebaddce1e2.png" 
              alt="HOME for Music" 
              style={{
                height: '100px',
                width: 'auto',
                maxWidth: '400px',
                maxHeight: '100px',
                objectFit: 'contain'
              }}
            />
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
                className="quiz-option w-full p-6 text-left rounded-xl border border-gray-200 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 leading-relaxed">
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
