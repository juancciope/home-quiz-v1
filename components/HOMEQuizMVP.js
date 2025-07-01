import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Home,
  Mail,
  Check,
  Music,
  Star,
  Play,
  Zap,
  Heart,
  Target,
  MapPin,
  ListChecks,
  Rocket,
  Users,
  UserCheck
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
    icon: <Play className="w-6 h-6" />,
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

// --- Pathway Templates ---
const pathwayTemplates = {
  'touring-performer': {
    title: 'The Touring Performer Path',
    icon: '🎤',
    color: 'from-[#1DD1A1] to-[#B91372]',
    description: 'Your energy comes alive on stage. You\'re built for the big venues, the tours, and creating unforgettable live experiences.',
    baseDescription: 'Your energy comes alive on stage. You\'re built for the big venues, the tours, and creating unforgettable live experiences.',
    homeConnection: 'HOME\'s 250-capacity venue and rehearsal facilities provide the perfect environment to develop your live show.',
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

// --- Confetti Component ---
const Confetti = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <style jsx>{`
        @keyframes confetti-fall {
          0% { 
            transform: translateY(-100vh) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(100vh) rotate(720deg); 
            opacity: 0; 
          }
        }
        
        @keyframes confetti-sway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        
        .confetti-piece {
          animation: confetti-fall 3s linear forwards, confetti-sway 1s ease-in-out infinite;
        }
      `}</style>
      {[...Array(80)].map((_, i) => {
        const colors = ['#1DD1A1','#B91372','#FFD93D','#6BCB77','#4D96FF','#FF6B6B'];
        const size = 10 + Math.random() * 10;
        const style = {
          position: 'absolute',
          left: `${Math.random()*100}%`,
          top: '-10%',
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: colors[Math.floor(Math.random()*colors.length)],
          borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        };
        return <div key={i} className="confetti-piece" style={style} />;
      })}
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
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
            setScreen('plan');
            setCurrentStep(0);
          }, 4000);
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
    }
  };

  const goNext = () => {
    if (screen === 'plan' && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else if (screen === 'plan' && currentStep === 3) {
      setScreen('execute');
    }
  };

  // Render screens
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center md:text-left animate-fade-in">
              {/* Logo */}
              <div className="mb-8">
                <img 
                  src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6848b80e27f5920f6ea9a532.png"
                  alt="HOME"
                  className="h-12 mx-auto md:mx-0"
                />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your Path
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A personalized roadmap to transform your music career in just 2 minutes
              </p>
              
              {/* Start Button */}
              <button
                onClick={() => setScreen('quiz')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">Begin Journey</span>
                <ChevronRight className="relative z-10 w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              
              {/* Trust Indicators */}
              <div className="mt-8 flex items-center gap-6 text-gray-500 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  <span>1,000+ Artists</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
            
            {/* Right: Hero Image */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/685b3b45958e7f525884f62d.png"
                alt="Music Creator"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6848b80e27f5920f6ea9a532.png"
                alt="HOME"
                className="h-8"
              />
            </div>
            
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-500 ease-out"
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1DD1A1]/20 to-[#B91372]/20 rounded-2xl mb-6">
                {question.icon}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {question.question}
              </h2>
            </div>
            
            {/* Options */}
            <div className="grid gap-4 animate-slide-up max-w-3xl mx-auto">
              {question.options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className="group relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-3xl flex-shrink-0">{option.emoji}</span>
                      <span className="text-lg font-medium text-gray-900">{option.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-all group-hover:translate-x-1 flex-shrink-0" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity" />
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

  if (screen === 'transition') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          {/* Processing Animation */}
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-[#B91372] animate-spin-slow" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Analyzing Your Path...
          </h2>
          <p className="text-gray-600 mb-8">
            Creating your personalized roadmap
          </p>
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
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${pathway?.color || 'from-[#1DD1A1] to-[#B91372]'} rounded-3xl mb-6 shadow-xl`}>
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
                  className="w-full px-6 py-4 text-lg bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#1DD1A1] focus:bg-white transition-all outline-none mb-6"
                />
                
                <button
                  onClick={handleEmailSubmit}
                  disabled={!email || isProcessing}
                  className="w-full py-4 text-lg font-medium text-white bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-[#B91372] animate-spin-slow" />
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
    );
  }

  if (screen === 'celebration' && pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <Confetti show={showConfetti} />
        
        <div className="max-w-4xl w-full text-center animate-fade-in">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6848b80e27f5920f6ea9a532.png"
              alt="HOME"
              className="h-10 mx-auto"
            />
          </div>
          
          {/* Path Result */}
          <div className="mb-12">
            <div className={`inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br ${pathway.color} rounded-full mb-8 shadow-2xl animate-bounce`}>
              <span className="text-6xl">{pathway.icon}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {pathway.title}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {pathway.description}
            </p>
            
            {/* Current Position */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg mb-12">
              <MapPin className="w-5 h-5 text-[#B91372]" />
              <span className="font-medium">
                You're at the <span className="text-[#B91372]">
                  {responses['stage-level'] === 'planning' ? 'Planning' : 
                   responses['stage-level'] === 'production' ? 'Production' : 'Scale'} Stage
                </span>
              </span>
            </div>
          </div>
          
          {/* Next Steps Preview */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Personalized 4-Step Plan is Ready
            </h2>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${pathway.color} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}>
                    {num}
                  </div>
                  <p className="text-sm text-gray-600">Step {num}</p>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => { setScreen('plan'); setCurrentStep(0); }}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full hover:shadow-xl hover:scale-105 transition-all"
            >
              View My Plan
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
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
    );
  }

  if (screen === 'plan' && pathway) {
    const stepData = pathway.steps[currentStep];
    const stepProgress = ((currentStep + 1) / 4) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/6848b80e27f5920f6ea9a532.png"
                alt="HOME"
                className="h-8"
              />
            </div>
            
            {/* Progress */}
            <div className="mb-8">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-500"
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
              <p className="text-center text-gray-500 text-sm mt-3">
                Step {currentStep + 1} of 4
              </p>
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in">
              {/* Step Header */}
              <div className="text-center mb-12">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${pathway.color} rounded-3xl mb-6 text-white font-bold text-2xl`}>
                  {currentStep + 1}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {stepData.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {stepData.description}
                </p>
              </div>
              
              {/* Why This Matters */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl mb-8">
                <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-4">
                  <Sparkles className="w-6 h-6 text-[#B91372]" />
                  Why This Matters
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {stepData.whyItMatters}
                </p>
              </div>
              
              {/* Action Items */}
              <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
                <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6">
                  <Target className="w-6 h-6 text-[#1DD1A1]" />
                  Your Action Items
                </h3>
                <div className="space-y-4">
                  {stepData.actions.map((action, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 bg-gradient-to-br ${pathway.color} rounded-full flex items-center justify-center text-white font-medium flex-shrink-0`}>
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-lg">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* HOME Resources */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white mb-12">
                <h3 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <Home className="w-6 h-6" />
                  HOME Resources for This Step
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {stepData.homeResources.map((resource, index) => (
                    <div key={index} className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                      <p className="font-medium">{resource}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-center">
                <button
                  onClick={goNext}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full hover:shadow-xl hover:scale-105 transition-all"
                >
                  {currentStep < 3 ? 'Next Step' : 'Execute Plan'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
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
    );
  }

  if (screen === 'execute' && pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Back Button */}
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Execute Your Plan?
            </h1>
            <p className="text-xl text-gray-600">
              Choose how you want to start your journey with HOME
            </p>
          </div>
          
          {/* Options */}
          <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
            {/* Accelerated Growth */}
            <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:scale-105 transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white rounded-full text-sm font-bold">
                RECOMMENDED
              </div>
              
              <div className="text-center mb-6 pt-4">
                <Rocket className="w-16 h-16 text-[#B91372] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Accelerated Growth
                </h3>
                <p className="text-gray-600">Start with 1-on-1 consultation</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                  <span>Personal strategy session with experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                  <span>Custom roadmap tailored to your goals</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                  <span>Priority access to HOME resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                  <span>Fast-track your music career</span>
                </li>
              </ul>
              
              <button 
                onClick={() => window.open('https://homeformusic.org/consultation', '_blank')}
                className="w-full py-4 text-lg font-medium text-white bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl hover:shadow-lg transition-all"
              >
                Book Free Consultation
              </button>
            </div>
            
            {/* Community Growth */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:scale-105 transition-all">
              <div className="text-center mb-6">
                <Users className="w-16 h-16 text-[#1DD1A1] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Community Growth
                </h3>
                <p className="text-gray-600">Start with free account</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                  <span>Access to HOME community platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                  <span>Weekly virtual events & workshops</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                  <span>Connect with 1,000+ music creators</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#1DD1A1] flex-shrink-0 mt-0.5" />
                  <span>Learn at your own pace</span>
                </li>
              </ul>
              
              <button 
                onClick={() => window.open('https://homeformusic.org/community', '_blank')}
                className="w-full py-4 text-lg font-medium text-gray-900 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
              >
                Join Free Community
              </button>
            </div>
          </div>
          
          {/* Footer Note */}
          <p className="text-center text-gray-500 mt-12">
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
    );
  }

  return null;
};

export default HOMEQuizMVP;
