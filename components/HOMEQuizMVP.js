import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Loader,
  MapPin,
  UserCheck,
  ListChecks,
  Check,
  Sparkles,
  Trophy,
  Target,
  Rocket,
  Home,
  Mail,
  ArrowRight,
  Users,
  Star
} from 'lucide-react';

// --- Quiz Questions (Restored from oldcode.js) ---
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

// --- Pathway Templates (from oldcode.js) ---
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

// --- Expanded Step Content ---
const expandedStepContent = {
  'touring-performer': [
    {
      title: "Build Your Signature Live Set",
      description: "Create a powerful performance that captivates audiences and leaves them wanting more",
      actions: [
        "Map out a 45-minute setlist with emotional peaks and valleys",
        "Record live rehearsal videos to analyze your stage presence",
        "Design smooth transitions between songs with stories or audience interaction",
        "Practice your set 3× this week in HOME's rehearsal space",
        "Get feedback from 5 fellow musicians on your performance energy"
      ],
      whyItMatters:
        "A killer live set is your #1 tool for winning over new fans and booking better gigs. This is where you transform from someone who plays songs to an artist who creates experiences.",
      homeResources: [
        "24/7 Rehearsal Facility Access",
        "Performance Coaching Sessions",
        "Monthly Open Mics for Testing"
      ]
    },
    {
      title: "Master Your Stage Presence",
      description: "Develop the confidence and charisma that makes audiences remember you",
      actions: [
        "Film yourself performing and identify 3 movements that feel authentic",
        "Study 5 favorite performers and note their engagement techniques",
        "Practice talking between songs—write out 3 compelling stories",
        "Work with HOME's performance coach for personalized feedback",
        "Perform at 2 local venues this month to build confidence"
      ],
      whyItMatters:
        "Great songs are only half the equation. Your stage presence determines whether people become fans or forget you. This skill directly impacts your booking fees and fan loyalty.",
      homeResources: [
        "Stage Presence Workshops",
        "Video Review Sessions",
        "Performance Psychology Training"
      ]
    },
    {
      title: "Create Your Professional EPK",
      description: "Build a booking package that gets venue owners and agents to say YES",
      actions: [
        "Shoot high-quality live performance videos (3–4 songs)",
        "Write a compelling artist bio that tells your story in 150 words",
        "Gather professional photos from recent shows",
        "Create a one-page PDF with all booking essentials",
        "Build a simple EPK website using HOME's templates"
      ],
      whyItMatters:
        "Your EPK is often your only shot at landing bigger gigs. A professional package can be the difference between $200 bar gigs and $2,000 festival slots.",
      homeResources: [
        "EPK Templates & Examples",
        "Professional Photography Sessions",
        "Copywriting Support"
      ]
    },
    {
      title: "Book Your Next 10 Shows",
      description: "Build momentum with a strategic booking plan that grows your fanbase",
      actions: [
        "Research 20 venues that fit your genre and draw",
        "Send personalized booking emails using HOME's proven templates",
        "Follow up with 5 venues every week until booked",
        "Network at HOME showcases to meet booking agents",
        "Create a touring route that makes financial sense"
      ],
      whyItMatters:
        "Consistent gigging builds your reputation, income, and fanbase faster than anything else. This systematic approach removes the guesswork from booking.",
      homeResources: [
        "Venue Database Access",
        "Booking Email Templates",
        "Agent Networking Events"
      ]
    }
  ],
  'creative-artist': [
    {
      title: "Define Your Unique Artist Brand",
      description: "Discover and articulate what makes you different from every other artist",
      actions: [
        "Complete HOME's Brand Discovery Worksheet to find your core values",
        "Create a mood board with 20 images that represent your vibe",
        "Write your artist mission statement in one powerful sentence",
        "Choose 3 primary colors and 2 fonts for visual consistency",
        "Design your logo or wordmark with HOME's design tools"
      ],
      whyItMatters:
        "A clear brand helps you stand out in a sea of content. When fans can recognize your content instantly, they're more likely to engage, share, and buy.",
      homeResources: [
        "Brand Development Workshop",
        "Design Software Access",
        "1-on-1 Brand Coaching"
      ]
    },
    {
      title: "Build Your Content Strategy",
      description: "Create a sustainable system for producing engaging content that grows your fanbase",
      actions: [
        "Map out 30 days of content ideas aligned with your brand",
        "Set up a weekly content creation schedule you can maintain",
        "Create templates for 5 types of posts (behind-the-scenes, performances, etc.)",
        "Develop a signature video format that fans will recognize",
        "Track which content types get the most engagement"
      ],
      whyItMatters:
        "Consistent, strategic content builds trust and keeps you top-of-mind with fans. A good strategy turns casual viewers into devoted supporters who buy everything you create.",
      homeResources: [
        "Content Calendar Templates",
        "Video Production Equipment",
        "Social Media Analytics Tools"
      ]
    },
    {
      title: "Diversify Your Revenue Streams",
      description: "Build multiple income sources so you're not dependent on any single platform",
      actions: [
        "Set up merchandise with HOME's print-on-demand partners",
        "Launch a fan subscription tier with exclusive content",
        "Create and sell sample packs or presets in your genre",
        "Develop an online course teaching your specialty",
        "Apply for sync licensing opportunities through HOME's network"
      ],
      whyItMatters:
        "Multiple revenue streams provide financial stability and creative freedom. This approach lets you focus on making great music without financial stress.",
      homeResources: [
        "Merch Design & Fulfillment",
        "Fan Platform Setup Guide",
        "Sync Licensing Connections"
      ]
    },
    {
      title: "Cultivate Your Community",
      description: "Transform followers into a loyal community that supports your journey",
      actions: [
        "Host monthly virtual hangouts with your most engaged fans",
        "Create a private community space for your supporters",
        "Share personal stories that deepen fan connections",
        "Recognize and reward your most supportive fans publicly",
        "Collaborate with fans on creative projects"
      ],
      whyItMatters:
        "A strong community provides sustainable support beyond just streams and sales. These are the people who will champion your music and fund your dreams.",
      homeResources: [
        "Community Building Workshop",
        "Fan Engagement Tools",
        "Virtual Event Platform"
      ]
    }
  ],
  'writer-producer': [
    {
      title: "Master Your Production Craft",
      description: "Develop the technical skills that make artists want to work with you",
      actions: [
        "Complete one new production technique tutorial daily",
        "Recreate 5 hit songs in your genre to understand their structure",
        "Build a template library for fast, professional workflows",
        "Master HOME's studio equipment through hands-on practice",
        "Get feedback on mixes from established producers in community"
      ],
      whyItMatters:
        "Technical excellence opens doors. When artists trust your skills, they recommend you to others, creating a snowball effect of opportunities.",
      homeResources: [
        "Pro Studio Access 24/7",
        "Production Masterclasses",
        "Mixing/Mastering Workshops"
      ]
    },
    {
      title: "Build Your Producer Portfolio",
      description: "Create a body of work that showcases your versatility and skill",
      actions: [
        "Produce 10 tracks across 3 different genres",
        "Create before/after demos showing your production impact",
        "Build a professional website with your best work",
        "Get testimonials from 5 artists you've worked with",
        "Submit tracks to HOME's sync licensing catalog"
      ],
      whyItMatters:
        "A strong portfolio is your calling card. It shows potential clients exactly what you can do and gives them confidence to invest in your services.",
      homeResources: [
        "Portfolio Website Templates",
        "Artist Collaboration Network",
        "Sync Submission Portal"
      ]
    },
    {
      title: "Network & Find Clients",
      description: "Build relationships that lead to consistent production work",
      actions: [
        "Attend HOME's weekly producer meetups",
        "Offer 3 free demos to artists in your target genre",
        "Connect with A&Rs and label contacts at HOME events",
        "Join online communities where your ideal clients hang out",
        "Create content showing your production process"
      ],
      whyItMatters:
        "Great producers are booked through relationships, not just skills. Building a strong network ensures steady work and better opportunities.",
      homeResources: [
        "Producer Networking Events",
        "A&R Introduction Program",
        "Client Management Tools"
      ]
    },
    {
      title: "Master the Business Side",
      description: "Understand contracts, royalties, and how to protect your interests",
      actions: [
        "Learn the basics of music publishing and royalty splits",
        "Create standard contracts for different types of projects",
        "Register with a PRO and understand how to collect royalties",
        "Set up systems for tracking sessions and invoicing",
        "Build relationships with music supervisors for sync opportunities"
      ],
      whyItMatters:
        "Understanding the business ensures you get paid fairly for your work. This knowledge protects your interests and maximizes your income potential.",
      homeResources: [
        "Music Business Course",
        "Contract Templates",
        "Publishing Workshop"
      ]
    }
  ]
};

// --- Helpers ---
const getExpandedStepContent = (pathway, idx) => {
  if (!pathway) return null;
  let key;
  if (pathway.toLowerCase().includes('touring') || pathway.toLowerCase().includes('performer')) {
    key = 'touring-performer';
  } else if (pathway.toLowerCase().includes('creative') || pathway.toLowerCase().includes('artist')) {
    key = 'creative-artist';
  } else if (pathway.toLowerCase().includes('writer') || pathway.toLowerCase().includes('producer')) {
    key = 'writer-producer';
  } else {
    key = 'creative-artist'; // default
  }
  return expandedStepContent[key]?.[idx] || null;
};

const interpolateColor = (c1, c2, f) =>
  c1.map((v, i) => Math.round(v + f * (c2[i] - v)));

// Determine pathway based on responses (from oldcode.js logic)
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

// --- Main Component ---
const HOMEQuizMVP = () => {
  const [screen, setScreen]           = useState('landing');
  const [qIndex, setQIndex]           = useState(0);
  const [responses, setResponses]     = useState({});
  const [aiResult, setAiResult]       = useState(null);
  const [email, setEmail]             = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [step, setStep]               = useState(0);
  const [direction, setDirection]     = useState('forward');
  const [confetti, setConfetti]       = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // scroll to top before paint on screen/qIndex/step change
  const mainRef = useRef(null);
  useLayoutEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [screen, qIndex, step]);

  const handleAnswer = (id, val) => {
    setDirection('forward');
    setResponses(r => ({ ...r, [id]: val }));
    if (qIndex < questions.length - 1) {
      setQIndex(i => i + 1);
    } else {
      generateAIResult({ ...responses, [id]: val });
      setScreen('transition');
    }
  };

  const generateAIResult = async (allResponses) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-pathway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: allResponses })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate pathway');
      }
      
      const result = await response.json();
      setAiResult(result);
      
    } catch (error) {
      console.error('Error generating pathway:', error);
      
      const pathwayKey = determinePathwayFallback(allResponses);
      const template = pathwayTemplates[pathwayKey];
      
      const fallbackResult = {
        ...template,
        title: template.title,
        description: `${template.baseDescription} Based on your responses, this path aligns with your goals and current stage.`,
        isPersonalized: false
      };
      
      setAiResult(fallbackResult);
    }
    
    setIsGenerating(false);
    setTimeout(() => setScreen('email'), 3000);
  };

  const handleEmailSubmit = async () => {
    if (!email || isSubmitting) return;
    
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
      
      setScreen('results');
      setStep(0);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setScreen('results');
      setStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    setDirection('backward');
    if (screen === 'quiz' && qIndex > 0) setQIndex(i => i - 1);
    else if (screen === 'quiz') setScreen('landing');
    else if (screen === 'email') setScreen('quiz');
    else if (screen === 'results' && step > 0) setStep(i => i - 1);
    else if (screen === 'results') setScreen('email');
  };

  const goNext = () => {
    setDirection('forward');
    if (screen === 'results' && step < 5) setStep(i => i + 1);
  };

  const startQuiz = () => {
    setDirection('forward');
    setScreen('quiz');
  };

  const resetAll = () => {
    setScreen('landing');
    setQIndex(0);
    setResponses({});
    setAiResult(null);
    setEmail('');
    setStep(0);
  };

  const getStage = () => {
    if (screen === 'quiz') return 1;
    if (['transition','email'].includes(screen)) return 2;
    if (screen === 'results' && step < 5) return 3;
    if (screen === 'results' && step === 5) return 4;
    return 0;
  };

  if (screen === 'landing') {
    return <LandingPage onStart={startQuiz} />;
  }

  const masterStage = getStage();
  const key         = `${screen}-${qIndex}-${step}`;

  return (
    <JourneyLayout
      masterStage={masterStage}
      resultStep={step}
      onBack={goBack}
      onNext={goNext}
      currentScreen={screen}
      questionIndex={qIndex}
      mainRef={mainRef}
    >
      <AnimatedContent key={key} direction={direction}>
        {screen === 'quiz' && (
          <QuestionPage
            question={questions[qIndex]}
            onAnswer={handleAnswer}
            questionIndex={qIndex}
            total={questions.length}
            responses={responses}
          />
        )}
        {screen === 'transition' && (
          <TransitionPage
            icon={<Sparkles className="animate-pulse" />}
            title="Analyzing Your Path..."
            subtitle="Creating your personalized plan"
          />
        )}
        {screen === 'email' && (
          <EmailCapturePage
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            isSubmitting={isSubmitting}
            aiResult={aiResult}
          />
        )}
        {screen === 'results' && aiResult && (
          <>
            {step === 0 && (
              <ResultsLandingPage
                aiResult={aiResult}
                showConfetti={confetti}
                onBegin={() => { setDirection('forward'); setStep(1); }}
              />
            )}
            {step > 0 && step < 5 && (
              <StepPage stepIndex={step - 1} aiResult={aiResult} />
            )}
            {step === 5 && (
              <FinalPage
                responses={responses}
                aiResult={aiResult}
                onReset={resetAll}
              />
            )}
          </>
        )}
      </AnimatedContent>
    </JourneyLayout>
  );
};

// --- Layout & Header/Footer ---
const JourneyLayout = ({
  masterStage,
  resultStep,
  onBack,
  onNext,
  currentScreen,
  questionIndex,
  mainRef,
  children
}) => {
  const stages = [
    { id:1, title:'Identify Your Path',    icon:<Target className="w-3 h-3 sm:w-4 sm:h-4"/> },
    { id:2, title:'Personalized Path',     icon:<MapPin className="w-3 h-3 sm:w-4 sm:h-4"/> },
    { id:3, title:'Personalized Plan',     icon:<ListChecks className="w-3 h-3 sm:w-4 sm:h-4"/> },
    { id:4, title:'Execute Plan',          icon:<Rocket className="w-3 h-3 sm:w-4 sm:h-4"/> }
  ];
  const showBack     = ['quiz','email','results'].includes(currentScreen);
  const showNextStep = currentScreen==='results' && resultStep>0 && resultStep<4;
  const showExecute  = currentScreen==='results' && resultStep===4;
  const color1=[29,209,161], color2=[185,19,114];

  // auto-scroll header so active step is centered
  const headerRef = useRef(null);
  useEffect(() => {
    const c = headerRef.current;
    const active = c?.querySelector(`[data-stage-id="${masterStage}"]`);
    if (c && active) {
      const offset = active.offsetLeft + active.clientWidth/2 - c.clientWidth/2;
      c.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [masterStage]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 shadow-sm">
        <div className="w-full px-3 sm:px-4 py-2 sm:py-3">
          <div
            ref={headerRef}
            className="flex items-center whitespace-nowrap overflow-x-auto relative pb-2 scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {stages.map(s => {
              const isActive    = masterStage===s.id;
              const isCompleted = masterStage> s.id;
              const rgb = interpolateColor(color1,color2,(s.id-1)/3).join(',');
              return (
                <div
                  key={s.id}
                  data-stage-id={s.id}
                  className="inline-block text-center px-2 sm:px-3 flex-shrink-0"
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center transition-transform ${isActive?'scale-110':''}`}
                    style={{
                      border: '2px solid',
                      borderColor: isActive||isCompleted?`rgb(${rgb})`:'#d1d5db',
                      backgroundColor: isCompleted?`rgb(${rgb})`:'white',
                      color: isCompleted?'white':isActive?`rgb(${rgb})`:'#a0aec0'
                    }}
                  >
                    {isCompleted ? <Check className="w-3 h-3 sm:w-4 sm:h-4"/> : <span className="text-xs sm:text-sm">{s.id}</span>}
                  </div>
                  <div className="mt-1 text-[10px] sm:text-xs leading-tight">{s.title}</div>
                </div>
              );
            })}
            <div className="absolute bottom-0 left-3 sm:left-4 right-3 sm:right-4 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-300"
                style={{ width:`calc(${((masterStage-1)/3)*100}% - 2rem)` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main ref={mainRef} className="flex-grow overflow-y-auto">{children}</main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white border-t z-20 shadow-inner">
        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center max-w-screen-xl mx-auto">
          <button
            onClick={onBack}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${
              showBack?'text-gray-600 hover:text-gray-900 hover:bg-gray-100':'invisible'
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Back</span>
          </button>
          <div className="text-xs sm:text-sm text-gray-500">
            {currentScreen==='quiz'   && `Question ${questionIndex+1} of ${questions.length}`}
            {currentScreen==='results'&& resultStep>0 && `Step ${resultStep} of 4`}
          </div>
          {showNextStep && (
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg flex items-center gap-1 text-sm sm:text-base"
            >
              Next <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          {showExecute && (
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg flex items-center gap-1 text-sm sm:text-base"
            >
              Execute <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          {(!showNextStep && !showExecute) && <div className="w-16" />}
        </div>
      </footer>
    </div>
  );
};

// --- Animated Wrapper ---
const AnimatedContent = ({ children, direction }) => (
  <div className={`h-full w-full p-4 md:p-8 flex items-start justify-center animate-on-load ${direction}`}>
    {children}
  </div>
);

// --- Landing Page ---
const LandingPage = ({ onStart }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="w-full max-w-2xl text-center">
      {/* Logo Header */}
      <div className="flex items-center justify-center mb-8">
        <Home className="w-8 h-8 text-blue-600 mr-3" />
        <span className="text-2xl font-bold text-gray-900">HOME</span>
        <span className="text-sm text-gray-500 ml-2">for Music</span>
      </div>
      
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-sm font-semibold text-gray-700 mb-6">
          <Sparkles className="w-4 h-4" style={{ color: '#B91372' }} />
          AI-Powered Music Career Guidance
        </div>
      </div>
      
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Find Your Path on the<br/>
        <span className="text-blue-600">Music Creator Roadmap</span>
      </h1>
      
      <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 px-4">
        Take our AI-powered quiz to discover your personalized pathway and get connected 
        with Nashville's most supportive music community.
      </p>
      
      <div className="flex items-center justify-center mb-8">
        <div className="flex text-yellow-400 mr-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          ))}
        </div>
        <span className="text-sm sm:text-base text-gray-600">Trusted by 1,000+ music creators</span>
      </div>
      
      {/* Features Grid */}
      <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-12 px-4">
        <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl">
          <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🎯</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">AI-Powered Personalization</h3>
          <p className="text-sm sm:text-base text-gray-600">Get a custom pathway based on your unique goals, experience, and creative focus.</p>
        </div>
        <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl">
          <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🏡</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Nashville Community</h3>
          <p className="text-sm sm:text-base text-gray-600">Connect with Music City's top talent and join our supportive creator community.</p>
        </div>
        <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl">
          <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">📈</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Business Growth</h3>
          <p className="text-sm sm:text-base text-gray-600">Learn to turn your passion into a sustainable, profitable music career.</p>
        </div>
      </div>
      
      {/* Testimonial */}
      <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 text-center mx-4">
        <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 italic">
          "HOME is amazing no matter what kind of role you play in the music industry. 
          It's rehearsal space, multiple recording studios, a content making palace, 
          and better than a masterclass subscription rolled into one🤘🏻"
        </p>
        <div className="text-xs sm:text-sm text-gray-600">
          — Nolan Brown, Music City Mayhem Competition Winner
        </div>
      </div>
      
      <button
        onClick={onStart}
        className="btn-primary inline-flex items-center text-base sm:text-lg"
      >
        Start Your Roadmap Quiz
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
      </button>
      <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">Takes 2 minutes • Completely free</p>
    </div>
  </div>
);

// --- Question Page ---
const QuestionPage = ({ question, onAnswer, questionIndex, total, responses }) => (
  <div className="w-full max-w-3xl mx-auto">
    <div className="text-center mb-6 sm:mb-8">
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
        <Target className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#1DD1A1' }} />
        Question {questionIndex + 1} of {total}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">{question.question}</h2>
    </div>
    <div className="space-y-3 sm:space-y-4 px-4">
      {question.options.map(opt => {
        const isSelected = responses[question.id] === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onAnswer(question.id, opt.value)}
            className={`quiz-option ${
              isSelected
                ? 'border-[#1DD1A1] bg-[#1DD1A1]/10'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-sm sm:text-base text-gray-900 pr-2">{opt.label}</span>
            {isSelected && <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#1DD1A1] flex-shrink-0" />}
          </button>
        );
      })}
    </div>
    <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
      💡 Tip: Choose the option that best reflects your goals
    </div>
  </div>
);

// --- Transition Page ---
const TransitionPage = ({ icon, title, subtitle }) => (
  <div className="text-center px-4">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
      <div className="text-white text-2xl sm:text-3xl">{icon}</div>
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h2>
    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">{subtitle}</p>
    <div className="flex justify-center gap-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  </div>
);

// --- Email Capture Page ---
const EmailCapturePage = ({ email, setEmail, onSubmit, isSubmitting, aiResult }) => (
  <div className="w-full max-w-2xl mx-auto text-center px-4">
    <div className="mb-6 sm:mb-8">
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#B91372' }} />
        Final Step
      </div>
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your Personalized Path is Ready!</h1>
    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">Enter your email to unlock your complete action plan</p>
    
    {/* Preview of results */}
    {aiResult && (
      <div className="bg-gradient-to-r from-[#1DD1A1]/5 to-[#B91372]/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#1DD1A1]/20">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="text-3xl sm:text-4xl">{aiResult.icon}</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{aiResult.title}</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600">{aiResult.baseDescription || aiResult.description}</p>
      </div>
    )}
    
    <div className="bg-white border-2 rounded-2xl p-6 sm:p-8 shadow-xl" style={{ borderColor: '#1DD1A1' }}>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Get Your Complete Roadmap</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
        Join our monthly <strong>"Find Your Path on the Music Creator Roadmap"</strong> webinar and receive:
      </p>
      
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Music Creator Course</h4>
          <p className="text-gray-600 text-xs sm:text-sm">9-module course ($299 value)</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Artist Branding Playbook</h4>
          <p className="text-gray-600 text-xs sm:text-sm">FREE 24-hour bonus</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">HOME Community</h4>
          <p className="text-gray-600 text-xs sm:text-sm">Connect with Nashville talent</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] text-base sm:text-lg"
        />
        <button
          onClick={onSubmit}
          disabled={!email || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center text-base sm:text-lg shadow-lg"
        >
          {isSubmitting
            ? <><Loader className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />Processing...</>
            : <>Get My Plan <Mail className="w-4 h-4 sm:w-5 sm:h-5 ml-2" /></>
          }
        </button>
      </div>
      <p className="text-xs sm:text-sm text-gray-500">Next webinar: Third Thursday of every month</p>
      <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
        <div className="flex items-center gap-1"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#1DD1A1]" />Instant access</div>
        <div className="flex items-center gap-1"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#1DD1A1]" />No spam ever</div>
      </div>
    </div>
  </div>
);

// --- Confetti Overlay ---
const Confetti = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {[...Array(60)].map((_, i) => {
        const colors = ['#1DD1A1','#B91372','#FFD93D','#6BCB77','#4D96FF','#FF6B6B'];
        const style = {
          position: 'absolute',
          left: `${Math.random()*100}%`,
          top: '-10%',
          width: `${8+Math.random()*8}px`,
          height: `${8+Math.random()*8}px`,
          backgroundColor: colors[Math.floor(Math.random()*colors.length)],
          borderRadius: Math.random()>0.5?'50%':'0%',
          animation: `confetti-fall ${3+Math.random()*3}s ${Math.random()*2}s linear infinite`,
          transform: `rotate(${Math.random()*360}deg)`
        };
        return <div key={i} style={style} />;
      })}
    </div>
  );
};

// --- Results Landing Page ---
const ResultsLandingPage = ({ aiResult, onBegin, showConfetti }) => (
  <div className="relative w-full max-w-2xl mx-auto text-center px-4">
    <Confetti show={showConfetti} />
    <div className="mb-6 sm:mb-8">
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
        <Trophy className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#B91372' }} />
        Path Discovered!
      </div>
    </div>
    <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
      <div className="relative mb-6 sm:mb-8">
        <div className="inline-block bg-gradient-to-br from-[#1DD1A1] to-[#B91372] p-6 sm:p-8 rounded-3xl shadow-xl animate-bounce">
          <div className="text-4xl sm:text-6xl">{aiResult.icon}</div>
        </div>
        <Sparkles className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
        <Sparkles className="absolute bottom-0 left-0 w-4 h-4 sm:w-5 sm:h-5 text-pink-400 animate-pulse" style={{ animationDelay:'0.5s' }} />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{aiResult.title}</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">Your personalized roadmap is ready!</p>
      <div className="bg-gradient-to-r from-[#1DD1A1]/5 to-[#B91372]/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#1DD1A1]/20 text-left">
        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{ color:'#1DD1A1' }} /> Your Starting Point:
        </h3>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{aiResult.description}</p>
      </div>
      <button
        onClick={onBegin}
        className="group bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full text-base sm:text-lg transition-transform transform hover:scale-105 shadow-xl inline-flex items-center gap-3 overflow-hidden"
      >
        <span className="relative z-10">View My Action Plan</span>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform group-hover:translate-x-1" />
      </button>
      {aiResult.isPersonalized === false && (
        <p className="text-xs sm:text-sm text-blue-600 mt-3">*Personalized with AI recommendations coming soon</p>
      )}
    </div>
  </div>
);

// --- Step Page ---
const StepPage = ({ stepIndex, aiResult }) => {
  const data = getExpandedStepContent(aiResult.title, stepIndex);
  if (!data) {
    return <div className="flex items-center justify-center h-full"><Loader className="animate-spin text-[#B91372]" /></div>;
  }
  const c1=[29,209,161], c2=[185,19,114];
  const rgb = interpolateColor(c1,c2, stepIndex/3).join(',');
  const bg  = `rgba(${rgb},0.1)`;

  return (
    <div className="w-full max-w-[800px] mx-auto px-4">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 text-xs sm:text-sm font-semibold" style={{ backgroundColor: bg, color:`rgb(${rgb})` }}>
          <ListChecks className="w-3 h-3 sm:w-4 sm:h-4" /> Step {stepIndex+1} of 4
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{data.title}</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{data.description}</p>
      </div>
      <div className="rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-br from-white to-gray-50 border shadow-lg" style={{ borderColor:`rgba(${rgb},0.25)` }}>
        <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" style={{ color:`rgb(${rgb})` }} /> Why This Matters
        </h3>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{data.whyItMatters}</p>
      </div>
      <div className="mb-6 sm:mb-8">
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5">
          <Target className="w-4 h-4 sm:w-5 sm:h-5" style={{ color:`rgb(${rgb})` }} /> Your Action Items:
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {data.actions.map((act,i) => (
            <div key={i} className="flex items-start bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white font-bold rounded-full mr-3 sm:mr-4 mt-0.5 flex-shrink-0 text-xs sm:text-sm" style={{ backgroundColor:`rgb(${rgb})` }}>{i+1}</div>
              <p className="text-sm sm:text-base text-gray-700 flex-grow">{act}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 border shadow-lg">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DD1A1]" /> HOME Resources for This Step:
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.homeResources.map((r,i)=>(
            <span key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border" style={{ backgroundColor: bg, color:`rgb(${rgb})`, borderColor:`rgb(${rgb})` }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Final Summary Page ---
const FinalPage = ({ responses, aiResult, onReset }) => {
  const summary = [0,1,2,3]
    .map(i => getExpandedStepContent(aiResult.title, i)?.title)
    .filter(Boolean);

  return (
    <div className="w-full max-w-[900px] mx-auto px-4">
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
          <Rocket className="w-3 h-3 sm:w-4 sm:h-4" style={{ color:'#B91372' }} />
          Ready to Execute
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Your Complete Roadmap</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Everything you need to transform your music career is here.</p>
      </div>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10 border shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Your Personalized Summary</h2>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1DD1A1] to-[#1DD1A1]/70 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1">Get Your Complete Roadmap</h3>
            <p className="text-gray-600 text-sm sm:text-base">Join our monthly webinar</p>
          </div>
          <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-sm sm:text-base">
            <li className="flex items-start"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"/>Music Creator Course ($299 value)</li>
            <li className="flex items-start"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"/>Artist Branding Playbook (FREE)</li>
            <li className="flex items-start"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"/>Monthly community calls</li>
          </ul>
          <button
            onClick={() => window.open('https://homeformusic.org/webinar','_blank')}
            className="w-full bg-blue-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Register for Free Webinar
          </button>
        </div>
        {/* Community Path */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-gray-200 shadow-xl hover:scale-105 transition">
          <div className="text-center mb-4 sm:mb-6 pt-3 sm:pt-4">
            <Home className="w-6 h-6 sm:w-8 sm:h-8 text-[#1DD1A1] mx-auto mb-2"/>
            <h3 className="text-lg sm:text-xl font-bold mb-1">Join HOME Community</h3>
            <p className="text-gray-600 text-sm sm:text-base">Connect with Nashville creators</p>
          </div>
          <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-sm sm:text-base">
            <li className="flex items-start"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0"/>Access to HOME's facilities</li>
            <li className="flex items-start"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0"/>Weekly networking events</li>
            <li className="flex items-start"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0"/>Resource library & templates</li>
          </ul>
          <button
            onClick={() => window.open('https://homeformusic.org/community','_blank')}
            className="w-full bg-[#1DD1A1] text-white font-bold py-3 sm:py-4 rounded-xl hover:opacity-90 transition text-sm sm:text-base"
          >
            Learn More About HOME
          </button>
        </div>
      </div>
      <div className="text-center mb-8">
        <button onClick={onReset} className="text-gray-500 hover:text-gray-700 font-medium text-sm sm:text-base">
          Take Quiz Again →
        </button>
      </div>
    </div>
  );
};

// Add these styles to make the quiz work properly
const styles = `
  .animate-on-load {
    animation: slideIn 0.3s ease-out;
  }
  
  .animate-on-load.forward {
    animation: slideInRight 0.3s ease-out;
  }
  
  .animate-on-load.backward {
    animation: slideInLeft 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg;
  }
  
  .quiz-option {
    @apply w-full p-4 sm:p-5 text-left rounded-xl border-2 flex items-center justify-between transition-all duration-300;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Create a style element to inject the CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}className="font-bold text-gray-800 mb-1 text-sm sm:text-base">Your Path</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{aiResult.title.replace(' Path','')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#B91372]/70 to-[#B91372] rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">Your Stage</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              {responses['stage-level']?.charAt(0).toUpperCase() + responses['stage-level']?.slice(1)} Stage
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
              <ListChecks className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">Your Focus</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{summary[0]}</p>
          </div>
        </div>
      </div>
      
      {/* Action Steps Summary */}
      <div className="bg-blue-600 rounded-xl p-6 sm:p-8 text-white text-center mb-8 sm:mb-12">
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">How HOME Can Help</h3>
        <p className="text-blue-100 text-base sm:text-lg mb-4 sm:mb-6">{aiResult.homeConnection}</p>
        <div className="flex items-center justify-center">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <span className="text-sm sm:text-base">Join 1,000+ creators in our community</span>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {/* Complete Roadmap CTA */}
        <div className="relative bg-white rounded-2xl p-5 sm:p-6 border-2 border-blue-600 shadow-xl hover:scale-105 transition">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold">RECOMMENDED</div>
          <div className="text-center mb-4 sm:mb-6 pt-3 sm:pt-4">
            <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2"/>
            <h3
