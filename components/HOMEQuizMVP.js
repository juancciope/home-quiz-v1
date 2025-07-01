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
      { value: 'stage-energy', label: 'The energy of live performance and connecting with audiences', emoji: '🎤' },
      { value: 'creative-expression', label: 'Artistic expression and building something uniquely mine', emoji: '🎨' },
      { value: 'behind-scenes', label: 'Creating music for others and collaborating with artists', emoji: '🎹' },
      { value: 'business-building', label: 'Building a sustainable music business and brand', emoji: '📈' }
    ]
  },
  {
    id: 'ideal-day',
    question: "Describe your ideal workday as a music professional:",
    icon: <Zap className="w-6 h-6" />,
    options: [
      { value: 'performing', label: 'Rehearsing, soundchecking, and performing for live audiences', emoji: '🎸' },
      { value: 'creating-content', label: 'Writing, recording, and creating content for my brand', emoji: '📸' },
      { value: 'studio-work', label: 'In the studio producing tracks and collaborating with other artists', emoji: '🎧' },
      { value: 'strategy-networking', label: 'Planning releases, networking, and growing my business', emoji: '🚀' }
    ]
  },
  {
    id: 'success-vision',
    question: "When you imagine success 3 years from now, you see yourself:",
    icon: <Star className="w-6 h-6" />,
    options: [
      { value: 'touring-artist', label: 'Headlining tours and playing major venues with a dedicated fanbase', emoji: '🏟️' },
      { value: 'creative-brand', label: 'Having multiple revenue streams from my creative work and personal brand', emoji: '💎' },
      { value: 'in-demand-producer', label: 'Being the go-to producer/writer that artists seek out for collaborations', emoji: '🏆' }
    ]
  },
  {
    id: 'stage-level',
    question: "Which best describes your current stage in HOME's framework?",
    icon: <MapPin className="w-6 h-6" />,
    options: [
      { value: 'planning', label: 'Planning Stage - Figuring out my path and building foundations', emoji: '🌱' },
      { value: 'production', label: 'Production Stage - Actively creating and releasing work', emoji: '🎵' },
      { value: 'scale', label: 'Scale Stage - Ready to grow and expand my existing success', emoji: '📊' }
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

// --- Elegant Streamers Component ---
const ElegantStreamers = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style jsx>{`
        @keyframes float-down {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            transform: translateY(-80vh) translateX(10px) rotate(45deg) scale(1);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(30px) rotate(180deg) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        .elegant-streamer {
          position: absolute;
          background: linear-gradient(180deg, var(--color1), var(--color2));
          animation: float-down var(--duration) ease-in-out forwards;
          animation-delay: var(--delay);
          filter: blur(0.5px);
          border-radius: 50px;
        }
        
        .elegant-streamer::before {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          filter: blur(10px);
          opacity: 0.6;
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
      {[...Array(50)].map((_, i) => {
        const colors = [
          ['#1DD1A1', '#40E0D0'],
          ['#B91372', '#FF1493'],
          ['#FFD93D', '#FFA500'],
          ['#6BCB77', '#32CD32'],
          ['#4D96FF', '#1E90FF'],
          ['#FF6B6B', '#FF4500']
        ];
        const [color1, color2] = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const width = 2 + Math.random() * 4;
        const height = 50 + Math.random() * 100;
        const duration = 5 + Math.random() * 3;
        const delay = Math.random() * 4;
        
        return (
          <div
            key={i}
            className="elegant-streamer"
            style={{
              '--color1': color1,
              '--color2': color2,
              '--duration': `${duration}s`,
              '--delay': `${delay}s`,
              left: `${left}%`,
              width: `${width}px`,
              height: `${height}px`,
            }}
          />
        );
      })}
    </div>
  );
};

// --- Progress Bar Component ---
const ProgressBar = ({ currentCheckpoint }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl z-40 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 hidden sm:block">
            <div 
              className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-700 ease-out"
              style={{ width: `${(currentCheckpoint + 1) / checkpoints.length * 100}%` }}
            />
          </div>
          
          {/* Checkpoints - Mobile */}
          <div className="flex justify-center gap-2 sm:hidden">
            {checkpoints.map((checkpoint, index) => {
              const isActive = index === currentCheckpoint;
              const isCompleted = index < currentCheckpoint;
              
              return (
                <div
                  key={checkpoint.id}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-r from-[#1DD1A1] to-[#B91372]' : 
                    isActive ? 'bg-white w-8' : 
                    'bg-white/20'
                  }`}
                />
              );
            })}
          </div>
          
          {/* Checkpoints - Desktop */}
          <div className="hidden sm:flex justify-between relative">
            {checkpoints.map((checkpoint, index) => {
              const isActive = index === currentCheckpoint;
              const isCompleted = index < currentCheckpoint;
              const Icon = checkpoint.icon;
              
              return (
                <div key={checkpoint.id} className="flex flex-col items-center">
                  {/* Circle */}
                  <div className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                    ${isCompleted ? 'bg-gradient-to-br from-[#1DD1A1] to-[#B91372]' : 
                      isActive ? 'bg-black border-2 border-transparent bg-clip-padding' : 
                      'bg-black/50 border border-white/20'}
                  `}>
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1DD1A1] to-[#B91372] animate-pulse" />
                    )}
                    <div className="relative z-10">
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/40'}`} />
                      )}
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className={`
                    mt-2 text-xs font-medium transition-all
                    ${isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/40'}
                  `}>
                    {checkpoint.label}
                  </span>
                </div>
              );
            })}
          </div>
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
  const [showStreamers, setShowStreamers] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentCheckpoint = getCurrentCheckpoint(screen, questionIndex, currentStep);
  const showProgress = screen !== 'landing';

  // Prevent mobile Chrome jumping
  useEffect(() => {
    // Set viewport height CSS variable
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    
    return () => window.removeEventListener('resize', setVH);
  }, []);

  // Smooth animations
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen, questionIndex, currentStep]);

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
          setScreen('celebration');
          setShowStreamers(true);
          setTimeout(() => {
            setShowStreamers(false);
          }, 6000);
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

  // Global styles for mobile viewport
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .min-h-screen-mobile {
        min-height: 100vh;
        min-height: calc(var(--vh, 1vh) * 100);
      }
      body {
        background: #000;
        overscroll-behavior: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Render screens
  return (
    <div className="min-h-screen-mobile bg-black text-white">
      {showProgress && <ProgressBar currentCheckpoint={currentCheckpoint} />}
      
      {screen === 'landing' && (
        <div className="min-h-screen-mobile bg-black relative overflow-hidden flex flex-col">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1DD1A1] rounded-full filter blur-[150px] opacity-20" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B91372] rounded-full filter blur-[150px] opacity-20" />
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 sm:p-8 text-center">
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6848b80e27f5920f6ea9a532.png"
                alt="HOME"
                className="h-10 mx-auto"
              />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 pb-8">
              <div className="max-w-4xl w-full text-center">
                <div className="mb-8 sm:mb-12 animate-fade-in">
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                    Find Your Path<br className="sm:hidden" /> on the<br/>
                    <span className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] bg-clip-text text-transparent">
                      Music Creator<br className="sm:hidden" /> Roadmap
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-400 mb-2">
                    5-minute AI quiz to discover your<br className="sm:hidden" /> personalized pathway in the music<br className="sm:hidden" /> industry
                  </p>
                </div>
                
                {/* Features - Mobile Scroll */}
                <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex-shrink-0 w-72 sm:w-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#1DD1A1]/50 transition-all hover:transform hover:scale-105 h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1DD1A1] to-[#40E0D0] rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">AI-Powered Results</h3>
                      <p className="text-sm text-gray-400">Personalized recommendations based on your unique goals</p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-72 sm:w-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#B91372]/50 transition-all hover:transform hover:scale-105 h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B91372] to-[#FF1493] rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Nashville Community</h3>
                      <p className="text-sm text-gray-400">Join 1,000+ music creators on their journey</p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-72 sm:w-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FFD93D]/50 transition-all hover:transform hover:scale-105 h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FFD93D] to-[#FFA500] rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <ListChecks className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Personalized Roadmap</h3>
                      <p className="text-sm text-gray-400">Clear action steps tailored to your current stage</p>
                    </div>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <button
                    onClick={() => setScreen('quiz')}
                    className="group relative inline-flex items-center justify-center px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold overflow-hidden rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                    <span className="relative z-10 flex items-center gap-3">
                      Find My Path
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Takes 5 minutes • Completely free
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer - Made with Love */}
            <div className="p-6 sm:p-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-sm text-gray-500 mb-4">
                Made with ❤️ by
              </p>
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/685b3b45958e7f525884f62d.png"
                alt="HOME for Music"
                className="h-20 sm:h-24 mx-auto opacity-80 hover:opacity-100 transition-opacity"
              />
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
                transform: translateY(30px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-fade-in {
              animation: fade-in 1s ease-out forwards;
            }
            
            .animate-slide-up {
              opacity: 0;
              animation: slide-up 1s ease-out forwards;
            }
          `}</style>
        </div>
      )}

      {screen === 'quiz' && (
        <div className="min-h-screen-mobile bg-black pt-20 sm:pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-6">
            {/* Back Button */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            {/* Question Progress */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Question {questionIndex + 1} of {questions.length}</span>
                <span className="text-sm text-gray-400">{Math.round(((questionIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-500"
                  style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Question */}
            <div className="animate-fade-in">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center">
                {questions[questionIndex].question}
              </h2>
              
              {/* Options */}
              <div className="grid gap-3 sm:gap-4">
                {questions[questionIndex].options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(questions[questionIndex].id, option.value)}
                    className="group relative p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#1DD1A1]/50 transition-all duration-300 hover:scale-[1.02] text-left animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <span className="text-2xl sm:text-3xl flex-shrink-0">{option.emoji}</span>
                        <span className="text-base sm:text-lg">{option.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-all group-hover:translate-x-1 flex-shrink-0" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
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
      )}

      {screen === 'transition' && (
        <div className="min-h-screen-mobile bg-black flex items-center justify-center px-6 pt-20 sm:pt-24">
          <div className="text-center animate-fade-in">
            {/* Animation */}
            <div className="mb-8">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full animate-ping" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white animate-spin-slow" />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">
              AI is analyzing your responses...
            </h2>
            <p className="text-gray-400">
              Creating your personalized music creator pathway
            </p>
          </div>
          
          <style jsx>{`
            @keyframes fade-in {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
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
      )}

      {screen === 'email' && (
        <div className="min-h-screen-mobile bg-black flex items-center justify-center px-6 pt-20 sm:pt-24">
          <div className="max-w-lg w-full">
            {!isProcessing ? (
              <div className="animate-fade-in">
                {/* Back Button */}
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                
                {/* Pathway Preview */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-3xl mb-4 sm:mb-6 shadow-2xl">
                    <span className="text-4xl">{pathway?.icon}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                    Your Path is Ready
                  </h2>
                  <p className="text-gray-400">
                    {pathway?.title}
                  </p>
                </div>
                
                {/* Email Form */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">
                    Get Your Personalized Roadmap
                  </h3>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-5 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white/5 border border-white/10 rounded-2xl focus:border-[#1DD1A1] focus:bg-white/10 transition-all outline-none mb-4 sm:mb-6 text-white placeholder-gray-500"
                  />
                  
                  <button
                    onClick={handleEmailSubmit}
                    disabled={!email || isProcessing}
                    className="w-full py-3 sm:py-4 text-base sm:text-lg font-medium bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full animate-pulse" />
                    <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-white animate-spin-slow" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-3">
                  Creating Your Roadmap
                </h2>
                <p className="text-gray-400 mb-8">
                  Personalizing your action plan...
                </p>
                
                {/* Progress Bar */}
                <div className="max-w-xs mx-auto">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-300"
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
      )}

      {screen === 'celebration' && pathway && (
        <div className="min-h-screen-mobile bg-black flex items-center justify-center px-6 pt-20 sm:pt-24">
          <ElegantStreamers show={showStreamers} />
          
          <div className="max-w-4xl w-full text-center animate-fade-in">
            {/* Path Result */}
            <div className="mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full mb-6 sm:mb-8 shadow-2xl animate-bounce">
                <span className="text-5xl sm:text-6xl">{pathway.icon}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
                {pathway.title}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-6 sm:mb-8">
                {pathway.description}
              </p>
              
              {/* Current Position */}
              <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8 sm:mb-12">
                <MapPin className="w-5 h-5 text-[#B91372]" />
                <span className="font-medium text-sm sm:text-base">
                  You're at the <span className="text-[#B91372]">
                    {responses['stage-level'] === 'planning' ? 'Planning' : 
                     responses['stage-level'] === 'production' ? 'Production' : 'Scale'} Stage
                  </span>
                </span>
              </div>
            </div>
            
            {/* Next Steps Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">
                Your Personalized 4-Step Action Plan
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {pathway.planPreview.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm sm:text-base">{step}</p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={goNext}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full hover:shadow-xl hover:scale-105 transition-all"
              >
                View My Plan
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            
            {/* HOME Logo */}
            <div className="mt-8 sm:mt-12">
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6848b80e27f5920f6ea9a532.png"
                alt="HOME"
                className="h-8 mx-auto opacity-50"
              />
            </div>
          </div>
          
          <style jsx>{`
            @keyframes fade-in {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            
            .animate-fade-in {
              animation: fade-in 0.8s ease-out;
            }
          `}</style>
        </div>
      )}

      {screen === 'plan' && pathway && (
        <div className="min-h-screen-mobile bg-black pt-20 sm:pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-6">
            {/* Back Button */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            {/* Step Progress */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Step {currentStep + 1} of 4</span>
                <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / 4) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Step Content */}
            <div className="animate-fade-in">
              {/* Step Header */}
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-3xl mb-4 sm:mb-6 font-bold text-xl sm:text-2xl">
                  {currentStep + 1}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  {pathway.steps[currentStep].title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                  {pathway.steps[currentStep].description}
                </p>
              </div>
              
              {/* Why This Matters */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 mb-6 sm:mb-8">
                <h3 className="flex items-center gap-3 text-xl sm:text-2xl font-bold mb-4">
                  <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-[#B91372]" />
                  Why This Matters
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  {pathway.steps[currentStep].whyItMatters}
                </p>
              </div>
              
              {/* Action Items */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 mb-6 sm:mb-8">
                <h3 className="flex items-center gap-3 text-xl sm:text-2xl font-bold mb-6">
                  <Target className="w-5 sm:w-6 h-5 sm:h-6 text-[#1DD1A1]" />
                  Your Action Items
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {pathway.steps[currentStep].actions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 sm:gap-4">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center font-medium flex-shrink-0 text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-base sm:text-lg">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* HOME Resources */}
              <div className="bg-gradient-to-br from-[#B91372]/20 to-[#1DD1A1]/20 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 sm:mb-12">
                <h3 className="flex items-center gap-3 text-xl sm:text-2xl font-bold mb-6">
                  <img 
                    src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6848b80e27f5920f6ea9a532.png"
                    alt="HOME"
                    className="h-5 sm:h-6 w-auto brightness-0 invert"
                  />
                  HOME Resources for This Step
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {pathway.steps[currentStep].homeResources.map((resource, index) => (
                    <div key={index} className="bg-white/10 rounded-2xl p-4 backdrop-blur border border-white/10">
                      <p className="font-medium text-sm sm:text-base">{resource}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-center">
                <button
                  onClick={goNext}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full hover:shadow-xl hover:scale-105 transition-all"
                >
                  {currentStep < 3 ? 'Next Step' : 'Execute Plan'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes fade-in {
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
              animation: fade-in 0.6s ease-out;
            }
          `}</style>
        </div>
      )}

      {screen === 'execute' && pathway && (
        <div className="min-h-screen-mobile bg-black flex items-center justify-center px-6 pt-20 sm:pt-24">
          <div className="max-w-4xl w-full">
            {/* Back Button */}
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                Ready to Execute Your Plan?
              </h1>
              <p className="text-lg sm:text-xl text-gray-400">
                Choose how you want to start your journey with HOME
              </p>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 animate-slide-up">
              {/* Accelerated Growth */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-[#B91372]/50 hover:scale-105 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-1 sm:py-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full text-xs sm:text-sm font-bold">
                  RECOMMENDED
                </div>
                
                <div className="text-center mb-4 sm:mb-6 pt-2 sm:pt-4">
                  <Rocket className="w-12 sm:w-16 h-12 sm:h-16 text-[#B91372] mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    Accelerated Growth
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base">Start with 1-on-1 consultation</p>
                </div>
                
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">Personal strategy session with experts</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">Custom roadmap tailored to your goals</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">Priority access to HOME resources</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">Fast-track your music career</span>
                  </li>
                </ul>
                
                <button 
                  onClick={() => window.open('https://homeformusic.org/consultation', '_blank')}
                  className="w-full py-3 sm:py-4 text-base sm:text-lg font-medium bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl hover:shadow-lg transition-all"
                >
                  Book Free Consultation
                </button>
              </div>
              
              {/* Community Growth */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-[#1DD1A1]/50 hover:scale-105 transition-all">
                <div className="text-center mb-4 sm:mb-6">
                  <Users className="w-12 sm:w-16 h-12 sm:h-16 text-[#1DD1A1] mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    Community Growth
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base">Start with free account</p>
                </div>
                
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">Access to HOME community platform</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">Weekly virtual events & workshops</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">Connect with 1,000+ music creators</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">Learn at your own pace</span>
                  </li>
                </ul>
                
                <button 
                  onClick={() => window.open('https://homeformusic.org/community', '_blank')}
                  className="w-full py-3 sm:py-4 text-base sm:text-lg font-medium bg-white/10 backdrop-blur rounded-2xl hover:bg-white/20 transition-all"
                >
                  Join Free Community
                </button>
              </div>
            </div>
            
            {/* Footer Note */}
            <p className="text-center text-gray-500 mt-8 sm:mt-12 text-sm">
              Not sure? Start with the free community and upgrade anytime.
            </p>
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
              animation: fade-in 0.6s ease-out;
            }
            
            .animate-slide-up {
              animation: slide-up 0.6s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default HOMEQuizMVP;
