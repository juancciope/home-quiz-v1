import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Mail,
  Check,
  Music,
  Star,
  Zap,
  Heart,
  Target,
  MapPin,
  ListChecks,
  Rocket,
  User,
  Users,
  ArrowRight,
  Circle,
  CheckCircle2
} from 'lucide-react';

// --- Quiz Questions (Original Text) ---
const questions = [
  {
    id: 'motivation',
    question: "What drives your music career ambitions?",
    icon: <Heart className="w-6 h-6" />,
    options: [
      { value: 'stage-energy', label: 'The energy of a live audience and performing music from the stage', emoji: '🎤' },
      { value: 'creative-expression', label: 'Artistic expression through recording music and building a loyal following online', emoji: '🎨' },
      { value: 'behind-scenes', label: 'Making great songs and collaborating with other talented creators', emoji: '🎹' }
    ]
  },
  {
    id: 'ideal-day',
    question: "Describe your ideal workday as a music professional:",
    icon: <Zap className="w-6 h-6" />,
    options: [
      { value: 'performing', label: 'Traveling to a new city to perform for a live audience', emoji: '🎸' },
      { value: 'creating-content', label: 'Releasing a new song that you are really proud of', emoji: '📸' },
      { value: 'studio-work', label: 'Writing the best song that you have ever written', emoji: '🎧' }
    ]
  },
  {
    id: 'success-vision',
    question: "When you imagine success 3 years from now, you see yourself:",
    icon: <Star className="w-6 h-6" />,
    options: [
      { value: 'touring-artist', label: 'Headlining major tours and playing sold out shows around the world', emoji: '🏟️' },
      { value: 'creative-brand', label: 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions', emoji: '💎' },
      { value: 'in-demand-producer', label: 'Having multiple major hit songs that you collaborated on and earning "mailbox money" through sync placements and other royalty streams', emoji: '🏆' }
    ]
  },
  {
    id: 'stage-level',
    question: "Which best describes your current stage?",
    icon: <MapPin className="w-6 h-6" />,
    options: [
      { value: 'planning', label: 'Figuring out my path and building foundations', emoji: '🌱' },
      { value: 'production', label: 'Actively creating and releasing work', emoji: '🎵' },
      { value: 'scale', label: 'Ready to grow and expand my existing success', emoji: '📊' }
    ]
  },
  {
    id: 'resources-priority',
    question: "What type of resources would most accelerate your career right now?",
    icon: <Sparkles className="w-6 h-6" />,
    options: [
      { value: 'performance-facilities', label: 'Rehearsal spaces, live sound equipment, and performance opportunities', emoji: '🎪' },
      { value: 'content-creation', label: 'Recording studios, video production, and content creation tools', emoji: '🎬' },
      { value: 'collaboration-network', label: 'Access to other creators, producers, and industry professionals', emoji: '🤝' },
      { value: 'business-mentorship', label: 'Business guidance, marketing strategy, and industry connections', emoji: '🧭' }
    ]
  }
];

// Journey Checkpoints
const checkpoints = [
  { id: 'quiz', label: 'Discover Path', icon: Target },
  { id: 'ai', label: 'AI Analysis', icon: Sparkles },
  { id: 'profile', label: 'Your Profile', icon: Star },
  { id: 'plan', label: 'Action Plan', icon: ListChecks },
  { id: 'execute', label: 'Start Journey', icon: Rocket }
];

// --- Pathway Templates ---
const pathwayTemplates = {
  'touring-performer': {
    title: 'The Touring Performer Path',
    icon: '🎤',
    color: 'from-[#1DD1A1] to-[#B91372]',
    description: 'Your energy comes alive on stage. You\'re built for the big venues, the tours, and creating unforgettable live experiences.',
    baseDescription: 'Your energy comes alive on stage. You\'re built for the big venues, the tours, and creating unforgettable live experiences.',
    homeConnection: 'HOME\'s 250-capacity venue and rehearsal facilities provide the perfect environment to develop your live show.',
    planPreview: [
      'Master Your Stage Presence',
      'Build Your Live Performance Brand',
      'Create Your Booking Strategy',
      'Scale Your Touring Business'
    ],
    steps: [
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
        whyItMatters: "A killer live set is your #1 tool for winning over new fans and booking better gigs. This is where you transform from someone who plays songs to an artist who creates experiences.",
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
        whyItMatters: "Great songs are only half the equation. Your stage presence determines whether people become fans or forget you. This skill directly impacts your booking fees and fan loyalty.",
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
        whyItMatters: "Your EPK is often your only shot at landing bigger gigs. A professional package can be the difference between $200 bar gigs and $2,000 festival slots.",
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
        whyItMatters: "Consistent gigging builds your reputation, income, and fanbase faster than anything else. This systematic approach removes the guesswork from booking.",
        homeResources: [
          "Venue Database Access",
          "Booking Email Templates",
          "Agent Networking Events"
        ]
      }
    ]
  },
  'creative-artist': {
    title: 'The Creative Artist Path', 
    icon: '🎨',
    color: 'from-[#1DD1A1] to-[#B91372]',
    description: 'You\'re driven by authentic self-expression and building multiple creative revenue streams through your artistry.',
    baseDescription: 'You\'re driven by authentic self-expression and building multiple creative revenue streams through your artistry.',
    homeConnection: 'HOME\'s content creation facilities and collaborative artist community provide the tools to build your creative empire.',
    planPreview: [
      'Define Your Artist Brand',
      'Build Your Content Engine',
      'Diversify Revenue Streams',
      'Grow Your Community'
    ],
    steps: [
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
        whyItMatters: "A clear brand helps you stand out in a sea of content. When fans can recognize your content instantly, they're more likely to engage, share, and buy.",
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
        whyItMatters: "Consistent, strategic content builds trust and keeps you top-of-mind with fans. A good strategy turns casual viewers into devoted supporters who buy everything you create.",
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
        whyItMatters: "Multiple revenue streams provide financial stability and creative freedom. This approach lets you focus on making great music without financial stress.",
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
        whyItMatters: "A strong community provides sustainable support beyond just streams and sales. These are the people who will champion your music and fund your dreams.",
        homeResources: [
          "Community Building Workshop",
          "Fan Engagement Tools",
          "Virtual Event Platform"
        ]
      }
    ]
  },
  'writer-producer': {
    title: 'The Writer-Producer Path',
    icon: '🎹',
    color: 'from-[#1DD1A1] to-[#B91372]',
    description: 'You thrive behind the scenes, crafting the perfect sound for other artists and building a reputation for excellence.',
    baseDescription: 'You thrive behind the scenes, crafting the perfect sound for other artists and building a reputation for excellence.',
    homeConnection: 'HOME\'s professional studios and A&R program provide the perfect ecosystem for producers to create and collaborate.',
    planPreview: [
      'Master Production Skills',
      'Build Your Portfolio',
      'Network & Find Clients',
      'Scale Your Business'
    ],
    steps: [
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
        whyItMatters: "Technical excellence opens doors. When artists trust your skills, they recommend you to others, creating a snowball effect of opportunities.",
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
        whyItMatters: "A strong portfolio is your calling card. It shows potential clients exactly what you can do and gives them confidence to invest in your services.",
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
        whyItMatters: "Great producers are booked through relationships, not just skills. Building a strong network ensures steady work and better opportunities.",
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
        whyItMatters: "Understanding the business ensures you get paid fairly for your work. This knowledge protects your interests and maximizes your income potential.",
        homeResources: [
          "Music Business Course",
          "Contract Templates",
          "Publishing Workshop"
        ]
      }
    ]
  }
};

// --- Helpers ---
const determinePathway = (responses) => {
  const scores = {
    'touring-performer': 0,
    'creative-artist': 0,
    'writer-producer': 0
  };
  
  // Motivation scoring
  const motivationMap = {
    'stage-energy': 'touring-performer',
    'creative-expression': 'creative-artist', 
    'behind-scenes': 'writer-producer',
    'business-building': 'creative-artist'
  };
  
  if (motivationMap[responses.motivation]) {
    scores[motivationMap[responses.motivation]] += 3;
  }
  
  // Ideal day scoring
  const idealDayMap = {
    'performing': 'touring-performer',
    'creating-content': 'creative-artist',
    'studio-work': 'writer-producer',
    'strategy-networking': 'creative-artist'
  };
  
  if (idealDayMap[responses['ideal-day']]) {
    scores[idealDayMap[responses['ideal-day']]] += 3;
  }
  
  // Success vision scoring
  const visionMap = {
    'touring-artist': 'touring-performer',
    'creative-brand': 'creative-artist',
    'in-demand-producer': 'writer-producer'
  };
  
  if (visionMap[responses['success-vision']]) {
    scores[visionMap[responses['success-vision']]] += 4;
  }
  
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
};

// Get current checkpoint
const getCurrentCheckpoint = (screen, questionIndex, currentStep) => {
  if (screen === 'landing') return -1;
  if (screen === 'quiz') return 0;
  if (screen === 'transition') return 1;
  if (screen === 'email' || screen === 'celebration') return 2;
  if (screen === 'plan') return 3;
  if (screen === 'execute') return 4;
  return 0;
};

// --- Premium Confetti Animation ---
const PremiumConfetti = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-80vh) translateX(20px) rotate(90deg) scale(1);
          }
          100% {
            transform: translateY(100vh) translateX(50px) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0.7;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .confetti-piece {
          position: absolute;
          animation: confetti-fall var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          animation-delay: var(--delay);
        }
        
        .confetti-inner {
          width: 100%;
          height: 100%;
          background: var(--gradient);
          border-radius: var(--radius);
          animation: sparkle 2s ease-in-out infinite;
          animation-delay: var(--sparkle-delay);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
      {[...Array(80)].map((_, i) => {
        const shapes = ['circle', 'square', 'triangle', 'star'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = 8 + Math.random() * 12;
        const left = Math.random() * 100;
        const duration = 4 + Math.random() * 3;
        const delay = Math.random() * 2;
        const sparkleDelay = Math.random() * 2;
        
        const gradients = [
          'linear-gradient(45deg, #1DD1A1, #40E0D0)',
          'linear-gradient(45deg, #B91372, #FF1493)',
          'linear-gradient(45deg, #FFD93D, #FFA500)',
          'linear-gradient(45deg, #6BCB77, #32CD32)',
          'linear-gradient(45deg, #4D96FF, #1E90FF)',
          'linear-gradient(45deg, #FF6B6B, #FF4500)'
        ];
        
        const gradient = gradients[Math.floor(Math.random() * gradients.length)];
        let radius = '2px';
        
        if (shape === 'circle') radius = '50%';
        if (shape === 'star') radius = '0';
        
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              '--duration': `${duration}s`,
              '--delay': `${delay}s`,
              '--sparkle-delay': `${sparkleDelay}s`
            }}
          >
            <div 
              className="confetti-inner"
              style={{
                '--gradient': gradient,
                '--radius': radius,
                clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                         shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 
                         'none'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// --- Progress Bar Component ---
const ProgressBar = ({ currentCheckpoint }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-2xl z-40 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="relative flex items-center justify-between">
          {/* HOME Logo */}
          <img 
            src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
            alt="HOME"
            className="h-6 w-auto"
          />
          
          {/* Progress Dots - Mobile */}
          <div className="flex gap-2 sm:hidden">
            {checkpoints.map((checkpoint, index) => {
              const isActive = index === currentCheckpoint;
              const isCompleted = index < currentCheckpoint;
              
              return (
                <div
                  key={checkpoint.id}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-r from-[#1DD1A1] to-[#B91372]' : 
                    isActive ? 'bg-white w-6' : 
                    'bg-white/20'
                  }`}
                />
              );
            })}
          </div>
          
          {/* Progress Steps - Desktop */}
          <div className="hidden sm:flex items-center gap-8">
            {checkpoints.map((checkpoint, index) => {
              const isActive = index === currentCheckpoint;
              const isCompleted = index < currentCheckpoint;
              const Icon = checkpoint.icon;
              
              return (
                <div key={checkpoint.id} className="flex items-center gap-2">
                  <div className={`
                    relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                    ${isCompleted ? 'bg-gradient-to-br from-[#1DD1A1] to-[#B91372]' : 
                      isActive ? 'bg-white/10 border border-white/30' : 
                      'bg-black/50 border border-white/10'}
                  `}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/40'}`} />
                    )}
                  </div>
                  <span className={`
                    text-xs font-medium transition-all hidden lg:block
                    ${isActive ? 'text-white' : isCompleted ? 'text-white/60' : 'text-white/30'}
                  `}>
                    {checkpoint.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Spacer for balance */}
          <div className="w-16 hidden sm:block" />
        </div>
      </div>
    </div>
  );
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
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const currentCheckpoint = getCurrentCheckpoint(screen, questionIndex, currentStep);
  const showProgress = screen !== 'landing';

  // Prevent mobile bounce and set viewport height
  useEffect(() => {
    // Set CSS variables for viewport height
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Prevent bounce on iOS
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Force scroll to top on screen/question changes
  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Find the app container and scroll it to top too
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.scrollTop = 0;
    }
    
    // Clear selected option when question changes
    setSelectedOption(null);
  }, [screen, questionIndex, currentStep]);

  // Handle quiz answer
  const handleAnswer = (questionId, value) => {
    setSelectedOption(value);
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        // Calculate pathway
        const finalResponses = { ...responses, [questionId]: value };
        const pathwayKey = determinePathway(finalResponses);
        setPathway(pathwayTemplates[pathwayKey]);
        setScreen('transition');
        
        // Simulate AI generation
        setIsGenerating(true);
        setTimeout(() => {
          setIsGenerating(false);
          setScreen('email');
        }, 3000);
      }
    }, 300);
  };

  // Handle email submission
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
          setScreen('celebration');
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
          }, 8000);
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
      setQuestionIndex(questions.length - 1);
    } else if (screen === 'quiz' && questionIndex === 0) {
      setScreen('landing');
    } else if (screen === 'plan' && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (screen === 'plan' && currentStep === 0) {
      setScreen('celebration');
    } else if (screen === 'execute') {
      setScreen('plan');
      setCurrentStep(3);
    } else if (screen === 'celebration') {
      setScreen('email');
    }
  };

  const goNext = () => {
    if (screen === 'celebration') {
      setScreen('plan');
      setCurrentStep(0);
    } else if (screen === 'plan' && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else if (screen === 'plan' && currentStep === 3) {
      setScreen('execute');
    }
  };

  // Global styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-tap-highlight-color: transparent;
      }
      
      html, body {
        height: 100%;
        overflow: hidden;
        overscroll-behavior: none;
        -webkit-overflow-scrolling: touch;
      }
      
      .app-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        background: #000;
      }
      
      .screen-height {
        min-height: 100vh;
        min-height: calc(var(--vh, 1vh) * 100);
      }
      
      @supports (-webkit-touch-callout: none) {
        .screen-height {
          min-height: -webkit-fill-available;
        }
      }
      
      /* Elegant animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes scaleIn {
        from { 
          opacity: 0;
          transform: scale(0.9);
        }
        to { 
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .animate-slideUp {
        animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .animate-scaleIn {
        animation: scaleIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      /* Delay classes */
      .delay-100 { animation-delay: 100ms; }
      .delay-200 { animation-delay: 200ms; }
      .delay-300 { animation-delay: 300ms; }
      .delay-400 { animation-delay: 400ms; }
      .delay-500 { animation-delay: 500ms; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Render
  return (
    <div className="app-container">
      {showProgress && <ProgressBar currentCheckpoint={currentCheckpoint} />}
      
      {screen === 'landing' && (
  <div className="screen-height bg-black relative overflow-hidden flex flex-col">
    {/* Subtle gradient background */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1DD1A1] rounded-full filter blur-[200px] opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#B91372] rounded-full filter blur-[200px] opacity-10" />
    </div>
    
    <div className="relative z-10 flex-1 flex flex-col p-6 sm:p-8">
      
      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center -mt-20 sm:mt-0">
        <div className="max-w-4xl w-full text-center">
          {/* Title - Smaller on mobile */}
          <div className="mb-8 sm:mb-12 animate-fadeIn">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white">
              Find Your Path on the
              <span className="block bg-gradient-to-r from-[#1DD1A1] to-[#B91372] bg-clip-text text-transparent">
                Music Creator Roadmap
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-xl mx-auto">
             AI-driven insights that rank your top priorities and map your next moves.
            </p>
          </div>
          
          {/* CTA Button - Prominent */}
          <div className="mb-8 sm:mb-12">
            <button
              onClick={() => setScreen('quiz')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-medium rounded-full transition-all duration-500 hover:scale-105 animate-scaleIn text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <span className="relative">Find My Path</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-sm text-gray-600 mt-4 animate-fadeIn">
              2-minute flow • instant results
            </p>
          </div>
          
          {/* Feature Pills - Compact for mobile */}
          <div className="flex flex-wrap justify-center gap-3 animate-slideUp delay-200">
            {[
              { icon: User, label: 'Artist Profile' },
              { icon: Target, label: 'Priority Lens' },
              { icon: ListChecks, label: 'Action Plan' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                <feature.icon className="w-4 h-4 text-white/60" />
                <span className="text-sm font-medium text-white/80">{feature.label}</span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      
      {/* Footer - Logo with glow effect above text */}
<div className="text-center mt-8 animate-fadeIn delay-500">
  <div className="relative inline-block mb-3 group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
    <img 
      src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
      alt="HOME"
      className="h-8 relative z-10"
    />
  </div>
  <p className="text-xs text-gray-600">
    Made by HOME for Music
  </p>
</div>
    </div>
  </div>
)}

      {screen === 'quiz' && (
        <div className="screen-height bg-black pt-20 sm:pt-24">
          <div className="max-w-4xl mx-auto px-6 pb-12">
            {/* Navigation */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            
            {/* Progress */}
            <div className="mb-12">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>Question {questionIndex + 1} of {questions.length}</span>
                <span>{Math.round(((questionIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-700 ease-out"
                  style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Question */}
            <div className="animate-fadeIn">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-white">
                {questions[questionIndex].question}
              </h2>
              
              {/* Options */}
              <div className="space-y-4">
                {questions[questionIndex].options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(questions[questionIndex].id, option.value)}
                    className={`
                      w-full p-6 rounded-2xl border transition-all duration-300 text-left animate-slideUp
                      ${selectedOption === option.value 
                        ? 'border-[#1DD1A1] bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10' 
                        : 'border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/20'
                      }
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.emoji}</span>
                      <span className="flex-1 text-lg text-white">{option.label}</span>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'transition' && (
        <div className="screen-height bg-black flex items-center justify-center px-6">
          <div className="text-center animate-scaleIn">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full blur-xl animate-pulse" />
              <div className="relative bg-black rounded-full w-full h-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white animate-float" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-3 text-white">
              AI is analyzing your responses...
            </h2>
            <p className="text-gray-500">
              Creating your personalized music creator pathway
            </p>
          </div>
        </div>
      )}

      {screen === 'email' && (
        <div className="screen-height bg-black flex items-center justify-center px-6">
          <div className="max-w-md w-full">
            {!isProcessing ? (
              <div className="animate-fadeIn">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>
                
                {/* Pathway Preview */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-3xl mb-6 shadow-2xl shadow-[#B91372]/20">
                    <span className="text-5xl">{pathway?.icon}</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-white">Your Path is Ready</h2>
                  <p className="text-gray-400">{pathway?.title}</p>
                </div>
                
                {/* Email Form */}
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8">
                  <h3 className="text-xl font-semibold mb-6 text-center text-white">
                    Get Your Personalized Roadmap
                  </h3>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl 
                             focus:bg-white/10 focus:border-white/20 focus:outline-none
                             transition-all duration-300 text-white placeholder-gray-600"
                  />
                  
                  <button
                    onClick={handleEmailSubmit}
                    disabled={!email || isProcessing}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] 
                             rounded-2xl font-medium transition-all duration-300
                             hover:shadow-lg hover:shadow-[#B91372]/20 hover:scale-[1.02]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-3 text-white"
                  >
                    <span>Continue</span>
                    <Mail className="w-5 h-5" />
                  </button>
                  
                  <p className="text-center text-gray-600 text-sm mt-6">
                    We'll never spam. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center animate-fadeIn">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-black rounded-full w-full h-full flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white animate-float" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold mb-3 text-white">Creating Your Roadmap</h2>
                <p className="text-gray-500 mb-8">Personalizing your action plan...</p>
                
                <div className="max-w-xs mx-auto">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{Math.round(progress)}% Complete</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

{screen === 'celebration' && pathway && (
  <div className="screen-height bg-black relative overflow-hidden pt-20 sm:pt-24">
    <PremiumConfetti show={showConfetti} />
    
    <div className="h-full flex items-center justify-center px-6">
            <div className="max-w-4xl w-full">
              {/* Path Result */}
              <div className="text-center mb-12 animate-scaleIn">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full mb-8 shadow-2xl shadow-[#B91372]/30 animate-float">
                  <span className="text-6xl">{pathway.icon}</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white">{pathway.title}</h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">{pathway.description}</p>
                
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <MapPin className="w-5 h-5 text-[#B91372]" />
                  <span className="font-medium text-white">
                    You're at the <span className="text-[#B91372]">
                      {responses['stage-level'] === 'planning' ? 'Planning' : 
                       responses['stage-level'] === 'production' ? 'Production' : 'Scale'} Stage
                    </span>
                  </span>
                </div>
              </div>
              
              {/* Action Plan Preview */}
              <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8 animate-slideUp delay-300">
                <h2 className="text-2xl font-bold mb-8 text-center text-white">Your Personalized 4-Step Action Plan</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {pathway.planPreview.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-12 h-12 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl flex items-center justify-center font-bold text-white">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 text-white">{step}</h3>
                        <p className="text-sm text-gray-500">Tailored specifically to your journey</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={goNext}
                  className="w-full py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-medium transition-all duration-500 hover:shadow-xl hover:shadow-[#B91372]/20 hover:scale-[1.02] flex items-center justify-center gap-3 text-white"
                >
                  <span>View Full Plan</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              {/* HOME Logo */}
              <div className="text-center mt-8 animate-fadeIn delay-500">
                <img 
                  src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
                  alt="HOME"
                  className="h-6 mx-auto opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'plan' && pathway && (
        <div className="screen-height bg-black pt-20 sm:pt-24 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 pb-12">
            {/* Navigation */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            
            {/* Step Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>Step {currentStep + 1} of 4</span>
                <span>{Math.round(((currentStep + 1) / 4) * 100)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-700 ease-out"
                  style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Step Content */}
            <div className="animate-fadeIn">
              {/* Step Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-3xl mb-6 shadow-2xl shadow-[#B91372]/20 animate-float">
                  <span className="text-2xl font-bold text-white">{currentStep + 1}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">{pathway.steps[currentStep].title}</h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">{pathway.steps[currentStep].description}</p>
              </div>
              
              {/* Content Cards */}
              <div className="space-y-6">
                {/* Why This Matters */}
                <div className="relative group animate-slideUp delay-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B91372]/10 to-transparent rounded-3xl blur-xl" />
                  <div className="relative bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8">
                    <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-white">
                      <Sparkles className="w-6 h-6 text-[#B91372]" />
                      Why This Matters
                    </h3>
                    <p className="text-lg text-gray-300 leading-relaxed">{pathway.steps[currentStep].whyItMatters}</p>
                  </div>
                </div>
                
                {/* Action Items */}
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8 animate-slideUp delay-200">
                  <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-white">
                    <Target className="w-6 h-6 text-[#1DD1A1]" />
                    Your Action Items
                  </h3>
                  <div className="space-y-4">
                    {pathway.steps[currentStep].actions.map((action, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="relative mt-1">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity" />
                          <div className="relative w-8 h-8 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center text-sm font-medium text-white">
                            {index + 1}
                          </div>
                        </div>
                        <p className="flex-1 text-gray-300 text-lg">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* HOME Resources */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#B91372]/5 to-[#1DD1A1]/5 p-8 animate-slideUp delay-300">
                  <div className="absolute top-4 right-4">
                    <img 
                      src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
                      alt="HOME"
                      className="h-6 w-auto opacity-20"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-white">HOME Resources for This Step</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {pathway.steps[currentStep].homeResources.map((resource, index) => (
                      <div key={index} className="bg-white/5 rounded-2xl p-4 backdrop-blur border border-white/10">
                        <p className="font-medium text-white">{resource}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full font-medium transition-all duration-500 hover:shadow-xl hover:shadow-[#B91372]/20 hover:scale-105 text-white"
                >
                  <span>{currentStep < 3 ? 'Next Step' : 'Execute Plan'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{screen === 'execute' && pathway && (
  <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            {/* Navigation */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            
            {/* Header */}
            <div className="text-center mb-12 animate-fadeIn">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">Ready to Execute Your Plan?</h1>
              <p className="text-xl text-gray-400">Choose how you want to start your journey with HOME</p>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Accelerated Growth */}
              <div className="relative group animate-slideUp">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full text-sm font-bold z-10 text-white">
                  RECOMMENDED
                </div>
                <div className="relative bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8 pt-12 group-hover:border-white/20 transition-all duration-500">
                  <div className="text-center mb-6">
                    <Rocket className="w-16 h-16 text-[#B91372] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-white">Accelerated Growth</h3>
                    <p className="text-gray-500">Start with 1-on-1 consultation</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      'Personal strategy session with experts',
                      'Custom roadmap tailored to your goals',
                      'Priority access to HOME resources',
                      'Fast-track your music career'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#1DD1A1] mt-0.5" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => window.open('https://homeformusic.org/consultation', '_blank')}
                    className="w-full py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#B91372]/20 text-white"
                  >
                    Book Free Consultation
                  </button>
                </div>
              </div>
              
              {/* Community Growth */}
              <div className="relative group animate-slideUp delay-200">
                <div className="relative bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8 group-hover:border-white/20 transition-all duration-500">
                  <div className="text-center mb-6">
                    <Users className="w-16 h-16 text-[#1DD1A1] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-white">Community Growth</h3>
                    <p className="text-gray-500">Start with free account</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      'Access to HOME community platform',
                      'Weekly virtual events & workshops',
                      'Connect with 1,000+ music creators',
                      'Learn at your own pace'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#1DD1A1] mt-0.5" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => window.open('https://homeformusic.org/community', '_blank')}
                    className="w-full py-4 bg-white/10 backdrop-blur rounded-2xl font-medium transition-all duration-300 hover:bg-white/20 text-white"
                  >
                    Join Free Community
                  </button>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <p className="text-center text-gray-600 mt-12 animate-fadeIn delay-400">
              Not sure? Start with the free community and upgrade anytime.
            </p>
            
            {/* HOME Logo */}
            <div className="text-center mt-8">
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
                alt="HOME"
                className="h-6 mx-auto opacity-20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HOMEQuizMVP;
