/**
 * HOME Quiz MVP Component
 * Last Updated: 2025-01-18T11:00:00Z
 * Version: 3.0.0
 */

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
  CheckCircle2,
  Lock
} from 'lucide-react';
import { PATH_LABELS, PATH_ICONS, STAGE_COPY } from '../lib/quiz/ui.js';
import UnifiedResultsV3 from './UnifiedResultsV3.js';

// --- Assessment Questions ---
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
      { value: 'scale', label: 'Doing music full-time and building my business.', emoji: '📊' }
    ]
  },
  {
    id: 'success-definition',
    question: "If you had to choose one of these versions of success, which would it be?",
    subtitle: "Take your time with this one. This question reveals your core values and has the biggest impact on your personalized roadmap.",
    icon: <Target className="w-6 h-6" />,
    options: [
      { value: 'live-performer', label: 'You make a good living playing live to large audiences, but you are not playing your original music', emoji: '🎤' },
      { value: 'online-audience', label: 'You have a large online audience and released a hit song, but you did not write it', emoji: '📱' },
      { value: 'songwriter', label: 'You have a hit song that you wrote, but someone else recorded and released it', emoji: '✍️' }
    ]
  }
];

// Survey Questions for Launch Environment
const surveyQuestions = [
  // Feedback Questions
  {
    id: 'nps',
    section: 'Your Experience',
    question: "How likely are you to recommend this roadmap quiz to a fellow music creator?",
    type: 'nps-slider',
    min: 1,
    max: 10,
    defaultValue: 5,
    labels: {
      min: 'Not at all likely',
      max: 'Extremely likely'
    }
  },
  {
    id: 'ces',
    section: 'Your Experience',
    question: "How easy was it to complete this quiz and get your personalized roadmap?",
    type: 'ces-slider',
    min: 1,
    max: 10,
    defaultValue: 5,
    labels: {
      min: 'Very difficult',
      max: 'Very easy'
    }
  },
  
  // Section 1: Your Music Creator Journey (4 questions)
  {
    id: 'challenges',
    section: 'Your Music Creator Journey',
    question: "What's your current biggest challenge in your music career? (Select top 2)",
    type: 'multiple',
    maxSelections: 2,
    options: [
      { value: 'collaborators', label: 'Finding quality collaborators/band members' },
      { value: 'fanbase', label: 'Building and engaging my fanbase' },
      { value: 'industry-exposure', label: 'Getting my music heard by industry professionals' },
      { value: 'income', label: 'Generating consistent income from music' },
      { value: 'recording-quality', label: 'Creating professional-quality recordings' },
      { value: 'booking-shows', label: 'Booking shows and touring opportunities' },
      { value: 'music-business', label: 'Understanding music business and contracts' },
      { value: 'marketing', label: 'Marketing and social media strategy' },
      { value: 'time-management', label: 'Time management and productivity' },
      { value: 'equipment-access', label: 'Access to professional equipment/studios' },
      { value: 'overwhelmed', label: "I'm overwhelmed and don't know where to start" }
    ]
  },
  {
    id: 'monthly-investment',
    section: 'Your Music Creator Journey',
    question: "What's your average monthly investment in your music career?",
    type: 'investment-slider',
    min: 0,
    max: 3000,
    step: 50,
    defaultValue: 0,
    options: [
      { value: 'dont-know', label: "I don't know" }
    ]
  },

  // Section 2: Tools & Software Usage (8 questions)
  {
    id: 'gear-purchases',
    section: 'Tools & Software Usage',
    question: "What gear are you planning to purchase in the next 12 months? (Select all that apply)",
    type: 'multiple',
    options: [
      { value: 'audio-interface', label: 'Audio interface' },
      { value: 'studio-monitors', label: 'Studio monitors' },
      { value: 'microphones', label: 'Microphones' },
      { value: 'midi-controllers', label: 'MIDI controllers/keyboards' },
      { value: 'guitar-equipment', label: 'Guitar/bass equipment' },
      { value: 'headphones', label: 'Headphones/monitoring gear' },
      { value: 'drum-machines', label: 'Drum machines/samplers' },
      { value: 'software-plugins', label: 'Software/plugins' },
      { value: 'live-equipment', label: 'Live performance equipment' },
      { value: 'acoustic-treatment', label: 'Acoustic treatment for your studio' },
      { value: 'no-purchases', label: 'Not planning any purchases' }
    ]
  },
  {
    id: 'valuable-tools',
    section: 'Tools & Software Usage',
    question: "Which tools and services would be most valuable for your music career? (Select top 5)",
    type: 'multiple',
    maxSelections: 5,
    options: [
      { value: 'content-calendar', label: 'Content calendar & viral ideas generator (AI-trained on trending music creator content)' },
      { value: 'venue-database', label: 'Venue database with contact info for your level/genre' },
      { value: 'automated-outreach', label: 'Automated venue outreach service (we handle booking emails for you)' },
      { value: 'website-generator', label: 'Custom website/EPK generator (build from chat conversation)' },
      { value: 'release-planner', label: 'Music release plan generator (timeline & tasks for any release date)' },
      { value: 'playlist-tools', label: 'Playlist outreach tools & submission support' },
      { value: 'budget-optimizer', label: 'Marketing budget optimizer (tells you how to spend your budget)' },
      { value: 'ad-tools', label: 'Music-specific advertising tools & campaign management' },
      { value: 'full-marketing', label: 'Full-service music marketing (done-for-you campaigns)' },
      { value: 'collaborator-matching', label: 'Collaborator matching tool (find artists/producers for your level)' },
      { value: 'release-management', label: 'Full-service release management and strategy (dedicated guidance and support)' }
    ]
  },

  // Consolidated Pricing Question
  {
    id: 'service-pricing',
    section: 'Tools & Software Usage',
    question: "What would you pay monthly for these services? Use the sliders to set your price for each.",
    type: 'pricing-sliders',
    services: [
      {
        id: 'content-calendar',
        name: 'Content Calendar & Viral Ideas Generator',
        description: 'AI-trained on trending music creator content',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 0
      },
      {
        id: 'venue-database',
        name: 'Venue Database with Contact Info',
        description: 'For your level/genre with booking details',
        min: 0,
        max: 150,
        step: 10,
        defaultValue: 0
      },
      {
        id: 'automated-outreach',
        name: 'Automated Venue Outreach Service',
        description: 'We handle booking emails for you',
        min: 0,
        max: 400,
        step: 25,
        defaultValue: 0
      },
      {
        id: 'website-generator',
        name: 'Custom Website/EPK Generator',
        description: 'Build from chat conversation',
        min: 0,
        max: 200,
        step: 10,
        defaultValue: 0
      },
      {
        id: 'full-marketing',
        name: 'Full-Service Music Marketing',
        description: 'Done-for-you campaigns',
        min: 0,
        max: 3000,
        step: 100,
        defaultValue: 0
      }
    ]
  },

  // Section 3: Collaboration & Community (4 questions)
  {
    id: 'genres',
    section: 'Collaboration & Community',
    question: "What genres do you create in? (Select all that apply)",
    type: 'multiple',
    options: [
      { value: 'pop', label: 'Pop' },
      { value: 'rock', label: 'Rock/Alternative' },
      { value: 'hiphop', label: 'Hip-Hop/Rap' },
      { value: 'rnb', label: 'R&B/Soul' },
      { value: 'country', label: 'Country' },
      { value: 'electronic', label: 'Electronic/EDM' },
      { value: 'folk', label: 'Folk/Acoustic' },
      { value: 'jazz', label: 'Jazz' },
      { value: 'classical', label: 'Classical/Orchestral' },
      { value: 'metal', label: 'Metal/Hardcore' },
      { value: 'reggae', label: 'Reggae/World Music' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'collaboration-skills',
    section: 'Collaboration & Community',
    question: "What skills do you bring to collaborations? (Select all that apply)",
    type: 'multiple',
    options: [
      { value: 'songwriting', label: 'Songwriting/lyrics' },
      { value: 'vocals', label: 'Vocal performance' },
      { value: 'guitar', label: 'Guitar' },
      { value: 'piano', label: 'Piano/keyboards' },
      { value: 'bass', label: 'Bass' },
      { value: 'drums', label: 'Drums/percussion' },
      { value: 'engineering', label: 'Audio engineering/mixing' },
      { value: 'production', label: 'Music production' },
      { value: 'business', label: 'Music business/marketing' },
      { value: 'design', label: 'Visual/graphic design' },
      { value: 'video', label: 'Video production' },
      { value: 'live-tech', label: 'Live sound/performance tech' }
    ]
  },
  {
    id: 'seeking-skills',
    section: 'Collaboration & Community',
    question: "What skills are you actively seeking in collaborators? (Select top 3)",
    type: 'multiple',
    maxSelections: 3,
    options: [
      { value: 'songwriting', label: 'Songwriting/lyrics' },
      { value: 'vocals', label: 'Vocal performance' },
      { value: 'instrumental', label: 'Instrumental performance' },
      { value: 'engineering', label: 'Audio engineering/mixing' },
      { value: 'production', label: 'Music production' },
      { value: 'business', label: 'Music business/marketing' },
      { value: 'design', label: 'Visual/graphic design' },
      { value: 'video', label: 'Video production' },
      { value: 'content-creation', label: 'Social media/content creation' },
      { value: 'live-support', label: 'Live performance/touring support' },
      { value: 'financial', label: 'Financial/business management' }
    ]
  },

  // Section 4: Industry Connections & Goals (3 questions)
  {
    id: 'industry-connections',
    section: 'Industry Connections & Goals',
    question: "Which industry professionals would you most like HOME to connect you with? (Select top 3)",
    type: 'multiple',
    maxSelections: 3,
    options: [
      { value: 'ar-reps', label: 'A&R representatives' },
      { value: 'music-supervisors', label: 'Music supervisors (sync licensing)' },
      { value: 'booking-agents', label: 'Booking agents' },
      { value: 'managers', label: 'Music managers' },
      { value: 'label-execs', label: 'Record label executives' },
      { value: 'publishers', label: 'Music publishers' },
      { value: 'curators', label: 'Radio/playlist curators' },
      { value: 'journalists', label: 'Music journalists/bloggers' },
      { value: 'venue-owners', label: 'Live venue owners/promoters' },
      { value: 'brand-managers', label: 'Brand partnership managers' },
      { value: 'lawyers', label: 'Entertainment lawyers' },
      { value: 'producers', label: 'Verified producers/collaborators' }
    ]
  },
  
  // Feedback
  {
    id: 'feedback',
    section: 'Your Feedback',
    question: "Is there anything else you'd like to share with us?",
    type: 'textarea',
    placeholder: 'Share your thoughts, suggestions, or anything else on your mind...',
    optional: true
  }
];

// Journey Checkpoints
const checkpoints = [
  { id: 'assessment', label: 'Discover Path', icon: Target },
  { id: 'ai', label: 'AI Analysis', icon: Sparkles },
  { id: 'profile', label: 'Your Profile', icon: Star },
  { id: 'plan', label: 'Action Plan', icon: ListChecks },
  { id: 'execute', label: 'Start Journey', icon: Rocket },
  { id: 'survey', label: 'Complete Survey', icon: ListChecks }
];

// Path label mappings (now imported from ui.js)

// --- Pathway Templates ---
const pathwayTemplates = {
  'touring-performer': {
    title: 'The Touring Performer Path',
    icon: '🎤',
    color: 'from-[#1DD1A1] to-[#B91372]',
    description: 'Your priority is live performance and direct audience connection. Focus here to build a sustainable touring career with devoted fans.',
    baseDescription: 'Your priority is live performance and direct audience connection. Focus here to build a sustainable touring career with devoted fans.',
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
          "Study successful live albums in your genre for pacing insights",
          "Record your rehearsals weekly to track improvement",
          "Design smooth transitions using key relationships between songs",
          "Create three different setlist variations for different venue types"
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
          "Film yourself performing and identify areas for improvement",
          "Study 5 favorite performers and document their engagement techniques",
          "Practice storytelling between songs with a timer",
          "Develop 3 signature stage moves that feel authentic to you",
          "Perform at 2 new venues monthly to expand your comfort zone"
        ],
        whyItMatters: "Great songs are only half the equation. Your stage presence determines whether people become fans or forget you. This skill directly impacts your booking fees and fan loyalty.",
        homeResources: [
          "Stage Presence Workshops at HOME",
          "Video Review Sessions with coaches",
          "Performance Psychology Training programs"
        ]
      },
      {
        title: "Create Your Professional EPK",
        description: "Build a booking package that gets venue owners and agents to say YES",
        actions: [
          "Shoot high-quality live performance videos of your 4 best songs",
          "Write a compelling 150-word artist bio that tells your story",
          "Gather 10 professional photos from recent performances",
          "Create a one-page PDF with all essential booking information",
          "Build a simple website showcasing your live performance assets"
        ],
        whyItMatters: "Your EPK is often your only shot at landing bigger gigs. A professional package can be the difference between $200 bar gigs and $2,000 festival slots.",
        homeResources: [
          "EPK Templates & Examples library",
          "Professional Photography Sessions",
          "Copywriting Support from HOME team"
        ]
      },
      {
        title: "Book Your Next 10 Shows",
        description: "Build momentum with a strategic booking plan that grows your fanbase",
        actions: [
          "Research 20 venues that match your genre and current draw",
          "Create a tracking spreadsheet for venue contacts and follow-ups",
          "Send 5 personalized booking emails every week",
          "Follow up persistently with venues every 2 weeks",
          "Plan efficient routing to minimize travel costs between cities"
        ],
        whyItMatters: "Consistent gigging builds your reputation, income, and fanbase faster than anything else. This systematic approach removes the guesswork from booking.",
        homeResources: [
          "HOME's Venue Database (500+ contacts)",
          "Proven Booking Email Templates",
          "Agent Networking Events at HOME"
        ]
      }
    ]
  },
  'creative-artist': {
    title: 'The Creative Artist Path', 
    icon: '🎨',
    color: 'from-[#1DD1A1] to-[#B91372]',
    description: 'Your priority is creative expression and building diverse revenue streams. Focus here to develop sustainable income through your artistry.',
    baseDescription: 'Your priority is creative expression and building diverse revenue streams. Focus here to develop sustainable income through your artistry.',
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
          "List 10 core values that guide your creative decisions",
          "Create a mood board with 20 images representing your aesthetic",
          "Write your artist mission statement in one memorable sentence",
          "Choose 3 primary colors and 2 fonts for visual consistency",
          "Define your target audience with specific demographics and interests"
        ],
        whyItMatters: "A clear brand helps you stand out in a sea of content. When fans can recognize your content instantly, they're more likely to engage, share, and buy.",
        homeResources: [
          "Brand Development Workshop series",
          "Professional Design Software access",
          "1-on-1 Brand Coaching sessions"
        ]
      },
      {
        title: "Build Your Content Strategy",
        description: "Create a sustainable system for producing engaging content that grows your fanbase",
        actions: [
          "Analyze your past content to identify top-performing themes",
          "Map out 30 days of content ideas aligned with your brand",
          "Create 5 repeatable content formats your fans will recognize",
          "Set specific weekly time blocks for creation vs consumption",
          "Track engagement metrics weekly to refine your approach"
        ],
        whyItMatters: "Consistent, strategic content builds trust and keeps you top-of-mind with fans. A good strategy turns casual viewers into devoted supporters who buy everything you create.",
        homeResources: [
          "Content Calendar Templates library",
          "Video Production Equipment access",
          "Social Media Analytics training"
        ]
      },
      {
        title: "Diversify Your Revenue Streams",
        description: "Build multiple income sources so you're not dependent on any single platform",
        actions: [
          "Research 10 ways successful artists in your genre monetize",
          "Choose 3 revenue streams to launch this quarter",
          "Price your offerings based on competitor research",
          "Create one digital product you can sell immediately",
          "Set specific monthly income goals for each revenue stream"
        ],
        whyItMatters: "Multiple revenue streams provide financial stability and creative freedom. This approach lets you focus on making great music without financial stress.",
        homeResources: [
          "Merch Design & Fulfillment partners",
          "Fan Platform Setup Guide & tools",
          "Sync Licensing Network connections"
        ]
      },
      {
        title: "Cultivate Your Community",
        description: "Transform followers into a loyal community that supports your journey",
        actions: [
          "Identify your 50 most engaged fans across all platforms",
          "Create exclusive content for your core supporter group",
          "Host monthly gatherings (virtual or in-person) for fans",
          "Share personal stories that create emotional connections",
          "Develop a system to recognize and reward fan loyalty"
        ],
        whyItMatters: "A strong community provides sustainable support beyond just streams and sales. These are the people who will champion your music and fund your dreams.",
        homeResources: [
          "Community Building Workshop at HOME",
          "Fan Engagement Platform tools",
          "Virtual Event hosting support"
        ]
      }
    ]
  },
  'writer-producer': {
    title: 'The Writer-Producer Path',
    icon: '🎹',
    color: 'from-[#1DD1A1] to-[#B91372]',
    description: 'Your priority is technical mastery and collaborative partnerships. Focus here to build high-value relationships and consistent royalty income.',
    baseDescription: 'Your priority is technical mastery and collaborative partnerships. Focus here to build high-value relationships and consistent royalty income.',
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
          "Complete one production technique tutorial daily for 30 days",
          "Recreate 5 hit songs to understand professional arrangement",
          "Build custom presets and templates for efficient workflow",
          "Study mixing techniques from Grammy-winning engineers",
          "Practice with different genres to expand your versatility"
        ],
        whyItMatters: "Technical excellence opens doors. When artists trust your skills, they recommend you to others, creating a snowball effect of opportunities.",
        homeResources: [
          "Pro Studio Access 24/7 at HOME",
          "Production Masterclasses monthly",
          "Mixing/Mastering Workshop series"
        ]
      },
      {
        title: "Build Your Producer Portfolio",
        description: "Create a body of work that showcases your versatility and skill",
        actions: [
          "Produce 10 tracks across 3 different genres",
          "Create before/after demos showing your production impact",
          "Build a professional website featuring your best work",
          "Collect written testimonials from every artist collaboration",
          "Document your production process for case studies"
        ],
        whyItMatters: "A strong portfolio is your calling card. It shows potential clients exactly what you can do and gives them confidence to invest in your services.",
        homeResources: [
          "Portfolio Website Templates",
          "Artist Collaboration Network",
          "Sync Submission Portal access"
        ]
      },
      {
        title: "Network & Find Clients",
        description: "Build relationships that lead to consistent production work",
        actions: [
          "Reach out to 5 new artists weekly with personalized messages",
          "Offer 3 free demo productions to build initial relationships",
          "Attend 2 industry events monthly and connect with 10 people",
          "Share your production process on social media weekly",
          "Follow up with past clients quarterly to maintain connections"
        ],
        whyItMatters: "Great producers are booked through relationships, not just skills. Building a strong network ensures steady work and better opportunities.",
        homeResources: [
          "Weekly Producer Meetups at HOME",
          "A&R Introduction Program access",
          "Client Management CRM tools"
        ]
      },
      {
        title: "Master the Business Side",
        description: "Understand contracts, royalties, and how to protect your interests",
        actions: [
          "Learn the difference between work-for-hire and royalty deals",
          "Create template contracts for different project types",
          "Register with a PRO and set up royalty collection",
          "Implement professional invoicing and accounting systems",
          "Research sync licensing opportunities in your genres"
        ],
        whyItMatters: "Understanding the business ensures you get paid fairly for your work. This knowledge protects your interests and maximizes your income potential.",
        homeResources: [
          "Music Business Course at HOME",
          "Contract Templates library",
          "Publishing Workshop with experts"
        ]
      }
    ]
  }
};
// --- Helpers ---
// Legacy functions removed - now using scoreResult directly

// Get pathway blend description (updated for v2)
const getPathwayBlend = (scoreResult) => {
  const sorted = Object.entries(scoreResult.displayPct).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0];
  const secondary = sorted[1];
  
  // Use the blendType from v2 scoring
  const blendType = scoreResult.blendType;
  
  if (blendType === 'Hybrid Multi-Creator') {
    return {
      type: 'hybrid',
      description: `You're a true hybrid creator with nearly equal alignment to multiple paths`,
      primary: primary[0],
      secondary: secondary[0],
      balance: true
    };
  } else if (blendType === 'Blend 70/30') {
    return {
      type: 'blend',
      description: `You're ${primary[1]}% aligned with your primary path, but show strong ${secondary[1]}% signals toward another`,
      primary: primary[0],
      secondary: secondary[0],
      balance: false
    };
  } else {
    return {
      type: 'focused',
      description: `You show clear ${primary[1]}% alignment with your primary path`,
      primary: primary[0],
      secondary: null,
      balance: false
    };
  }
};

// Get current checkpoint
const getCurrentCheckpoint = (screen, questionIndex, currentStep) => {
  if (screen === 'landing') return -1;
  if (screen === 'intro') return -1;
  if (screen === 'assessment') return 0;
  if (screen === 'transition') return 1;
  if (screen === 'email' || screen === 'celebration') return 2;
  if (screen === 'plan') return 3;
  if (screen === 'execute') return 4;
  if (screen === 'survey') return 5;
  return 0;
};

// Detect which pathways user selected based on their answers
const detectSelectedPathways = (responses) => {
  const touringAnswers = ['stage-energy', 'performing', 'touring-artist', 'live-performer'];
  const creativeAnswers = ['creative-expression', 'creating-content', 'creative-brand', 'online-audience'];
  const producerAnswers = ['behind-scenes', 'studio-work', 'in-demand-producer', 'songwriter'];
  
  const hasSelectedTouring = Object.values(responses).some(answer => touringAnswers.includes(answer));
  const hasSelectedCreative = Object.values(responses).some(answer => creativeAnswers.includes(answer));
  const hasSelectedProducer = Object.values(responses).some(answer => producerAnswers.includes(answer));
  
  return {
    'touring-performer': hasSelectedTouring,
    'creative-artist': hasSelectedCreative,
    'writer-producer': hasSelectedProducer
  };
};

// Transform AI steps to component format
const transformAIStepsToComponentFormat = (aiPathway) => {
  const steps = aiPathway.nextSteps || [];
  const resources = aiPathway.resources || [];
  
  // Take first 4 steps and create detailed step objects using AI-generated content
  return steps.slice(0, 4).map((step, index) => {
    const stepObj = typeof step === 'object' ? step : { step: step };
    const stepText = stepObj.step;
    const stepDetail = stepObj.detail;
    
    return {
      title: stepText.trim(),
      description: stepDetail ? stepDetail.trim() : 'Take action on this important step in your music career journey',
      actions: generateActionsForStep(stepText, index, aiPathway),
      whyItMatters: stepDetail ? stepDetail.trim() : generateWhyItMatters(stepText, aiPathway),
      homeResources: selectResourcesForStep(resources, index)
    };
  });
};

// Generate authentic action items (no HOME mentions)
const generateActionsForStep = (stepTitle, stepIndex, pathway) => {
  // Create step-specific actions based on the actual step title and index
  const pathwayType = pathway.title ? pathway.title.toLowerCase() : '';
  const lowerTitle = stepTitle.toLowerCase();
  
  // Touring Performer specific actions
  if (pathwayType.includes('touring') || pathwayType.includes('performer')) {
    const touringActions = [
      // Step 1 - Foundation
      [
        "Create a 45-60 minute setlist with strong opening and closing songs",
        "Record yourself performing each song and analyze your stage presence",
        "Book 3 local venue performances within the next 30 days",
        "Study crowd interaction techniques from 5 successful live performers",
        "Develop 2-3 authentic stories to connect songs to your personal journey"
      ],
      // Step 2 - Performance Skills
      [
        "Practice stage movements and microphone technique for 20 minutes daily",
        "Create signature moments in 3 of your strongest songs",
        "Film yourself performing and identify 3 areas for improvement",
        "Research and reach out to 10 venues in your target cities",
        "Develop a pre-show ritual to manage nerves and get in the zone"
      ],
      // Step 3 - Business Building
      [
        "Create a professional EPK with high-quality photos and performance videos",
        "Build relationships with 5 local venue owners or booking agents",
        "Set up a system to collect fan contact info at every show",
        "Develop tiered pricing for different venue sizes and markets",
        "Create a 6-month touring plan targeting realistic markets"
      ],
      // Step 4 - Scaling & Growth
      [
        "Partner with 2-3 artists for joint shows to expand your audience",
        "Research and apply to 3 music festivals in your genre",
        "Hire or partner with a booking agent for larger venues",
        "Create VIP packages and meet-and-greet experiences",
        "Document your touring journey for social media and press"
      ]
    ];
    return touringActions[stepIndex] || touringActions[0];
  }
  
  // Creative Artist specific actions
  else if (pathwayType.includes('creative') || pathwayType.includes('artist')) {
    const creativeActions = [
      // Step 1 - Brand Foundation
      [
        "Define your unique artistic voice in one compelling sentence",
        "Create a visual mood board with 20 images representing your brand",
        "Write your origin story and connect it to your music",
        "Identify 3 artists whose careers you want to model",
        "Choose consistent colors, fonts, and visual style for all content"
      ],
      // Step 2 - Content Strategy
      [
        "Plan 30 days of content that shows your creative process",
        "Create content templates for different types of posts",
        "Establish a posting schedule you can maintain long-term",
        "Develop signature content formats your fans will recognize",
        "Set up analytics tracking to understand what resonates"
      ],
      // Step 3 - Audience Building
      [
        "Launch an email list with exclusive content for subscribers",
        "Create a lead magnet (free song, behind-scenes content, etc.)",
        "Engage meaningfully with 20 potential fans daily on social media",
        "Collaborate with 3 other artists to cross-pollinate audiences",
        "Start a weekly live stream or regular fan interaction format"
      ],
      // Step 4 - Revenue Diversification
      [
        "Launch merchandise that reflects your brand aesthetic",
        "Create a Patreon or fan subscription with exclusive perks",
        "Develop digital products (sample packs, courses, etc.)",
        "Explore sync licensing opportunities for your music",
        "Build partnerships with brands that align with your values"
      ]
    ];
    return creativeActions[stepIndex] || creativeActions[0];
  }
  
  // Writer-Producer specific actions
  else {
    const producerActions = [
      // Step 1 - Technical Foundation
      [
        "Master 3 new production techniques by recreating hit songs",
        "Build custom templates and workflow shortcuts in your DAW",
        "Create a signature sound library with 50+ original samples",
        "Study the arrangement structure of 10 chart-topping songs",
        "Document your production process for consistent results"
      ],
      // Step 2 - Collaboration Network
      [
        "Reach out to 5 artists seeking production collaborations",
        "Join 3 producer/songwriter communities online and locally",
        "Offer free production to 2 promising artists to build relationships",
        "Create a portfolio showcasing your range across different genres",
        "Establish clear pricing and contract templates for your services"
      ],
      // Step 3 - Business Development
      [
        "Research and submit to music libraries for sync opportunities",
        "Build relationships with A&Rs and music supervisors",
        "Create instrumental versions of your best productions",
        "Develop a system for tracking royalties and publishing splits",
        "Position yourself as the go-to producer for a specific sound/genre"
      ],
      // Step 4 - Industry Recognition
      [
        "Submit your best work to relevant music competitions and awards",
        "Create educational content showcasing your production expertise",
        "Mentor emerging artists to build your reputation and network",
        "Explore opportunities to score for film, TV, or games",
        "Build a waitlist of artists wanting to work with you"
      ]
    ];
    return producerActions[stepIndex] || producerActions[0];
  }
};

// Generate why it matters (pathway-specific)
const generateWhyItMatters = (stepTitle, pathway) => {
  const pathwayType = pathway.title ? pathway.title.toLowerCase() : '';
  
  if (pathwayType.includes('touring') || pathwayType.includes('performer')) {
    return "This step builds the foundation for a sustainable touring career. Master this now to command higher fees and create memorable experiences that turn casual listeners into lifelong fans.";
  } else if (pathwayType.includes('creative') || pathwayType.includes('artist')) {
    return "This step is crucial for building a loyal fanbase and multiple revenue streams. Artists who master this create sustainable careers independent of traditional industry gatekeepers.";
  } else {
    return "This step separates professional producers from hobbyists. Master this to attract high-quality clients and build a reputation that generates consistent opportunities.";
  }
};

// Select HOME resources for each step
const selectResourcesForStep = (allResources, stepIndex) => {
  // Ensure we have resources to work with
  if (!allResources || allResources.length === 0) {
    return [
      "24/7 Studio Access",
      "Professional Equipment",
      "Community Network"
    ];
  }
  
  // Rotate through resources for each step
  const resourcesPerStep = 3;
  const startIndex = (stepIndex * resourcesPerStep) % allResources.length;
  const selectedResources = [];
  
  for (let i = 0; i < resourcesPerStep; i++) {
    const index = (startIndex + i) % allResources.length;
    selectedResources.push(allResources[index]);
  }
  
  return selectedResources;
};

// --- AI Process Step Component ---
const AIProcessStep = ({ step, label, duration, icon, progress = 0 }) => {
  const [status, setStatus] = useState('pending'); // pending, processing, complete
  
  useEffect(() => {
    // If progress is provided, use it instead of fixed timers
    if (progress > 0) {
      const stepThreshold = (step - 1) * 25; // 0, 25, 50, 75 for steps 1-4
      const nextThreshold = step * 25; // 25, 50, 75, 100 for steps 1-4
      
      if (progress >= nextThreshold) {
        setStatus('complete');
      } else if (progress >= stepThreshold) {
        setStatus('processing');
      } else {
        setStatus('pending');
      }
    } else {
      // Fallback to original timer-based approach
      const timer1 = setTimeout(() => {
        setStatus('processing');
      }, duration);
      
      const timer2 = setTimeout(() => {
        setStatus('complete');
      }, duration + 2500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [duration, progress, step]);
  
  return (
    <div className={`flex items-center gap-4 transition-all duration-700 ${
      status === 'pending' ? 'opacity-40' : 'opacity-100'
    }`}>
      {/* Status Icon */}
      <div className="relative">
        {status === 'complete' ? (
          <div className="w-10 h-10 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" />
          </div>
        ) : status === 'processing' ? (
          <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center relative">
            <div className="w-8 h-8 rounded-full border-2 border-t-[#1DD1A1] border-r-[#B91372] border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1DD1A1]/20 to-[#B91372]/20 animate-pulse" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
            {React.cloneElement(icon, { className: 'w-5 h-5 text-white/40' })}
          </div>
        )}
      </div>
      
      {/* Label */}
      <div className="flex-1">
        <p className={`text-sm font-medium transition-colors duration-500 ${
          status === 'complete' ? 'text-white' : 
          status === 'processing' ? 'text-white/90' : 
          'text-white/50'
        }`}>
          {label}
        </p>
        
        {/* Progress line */}
        {status === 'processing' && (
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] animate-gradient-x shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Brand Footer Component ---
const BrandFooter = ({ currentScreen }) => {
  // Landing page has its own special footer treatment
  if (currentScreen === 'landing') {
    return null;
  }
  
  // All other pages get consistent dark footer
  return (
    <div className="fixed bottom-0 left-0 right-0 text-center py-4 z-30 bg-black/95 backdrop-blur-sm border-t border-white/5">
      <p className="text-xs text-gray-400">homeformusic.app</p>
    </div>
  );
};

// --- Advanced Fuzzy Score Preview Component ---
const FuzzyScorePreview = ({ scores, blend }) => {
  const pathwayInfo = {
    'touring-performer': { name: 'Touring Performer', icon: '🎤', color: 'from-[#1DD1A1] to-[#40E0D0]' },
    'creative-artist': { name: 'Creative Artist', icon: '🎨', color: 'from-[#B91372] to-[#FF1493]' },
    'writer-producer': { name: 'Writer/Producer', icon: '🎹', color: 'from-[#FFD93D] to-[#FFA500]' }
  };
  
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sortedScores[0];
  const hidden = sortedScores.slice(1);
  
  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8 relative overflow-hidden safari-fallback">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Primary pathway reveal */}
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/20 to-[#B91372]/20 rounded-full border border-white/20 mb-4">
            <Sparkles className="w-4 h-4 text-[#1DD1A1]" />
            <span className="text-sm font-medium text-white">Your Primary Creative Type</span>
            <Sparkles className="w-4 h-4 text-[#B91372]" />
          </div>
          
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center text-4xl shadow-2xl">
              {pathwayInfo[primary[0]].icon}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mt-4 mb-2">
            {pathwayInfo[primary[0]].name}
          </h3>
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-white">
            <span>{primary[1]}%</span>
            <span className="text-[#1DD1A1]">Match</span>
          </div>
        </div>
        
        {/* Primary pathway bar */}
        <div className="mb-6">
          <div className="h-4 bg-white/5 rounded-full overflow-hidden relative">
            <div 
              className={`h-full bg-gradient-to-r ${pathwayInfo[primary[0]].color} transition-all duration-2000 ease-out relative`}
              style={{ width: `${primary[1]}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          <p className="text-center text-gray-300 mt-2 text-sm">
            {primary[1] > 70 ? 'Exceptional alignment' : 
             primary[1] > 50 ? 'Strong alignment' : 'Good alignment'}
          </p>
        </div>
        
        {/* Hidden pathways with advanced effects */}
        <div className="space-y-3">
          {hidden.map(([pathway, percentage], index) => {
            const info = pathwayInfo[pathway];
            return (
              <div key={pathway} className="relative group">
                {/* Glassmorphism overlay with matrix effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 rounded-2xl z-20 flex items-center justify-center backdrop-blur-md border border-white/10">
                  <div className="text-center">
                    <div className="relative">
                      {/* Matrix rain effect */}
                      <div className="absolute inset-0 overflow-hidden rounded-lg">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute text-[#1DD1A1] text-xs opacity-20 animate-pulse"
                            style={{
                              left: `${i * 20}%`,
                              animation: `matrix-rain ${2 + i}s infinite linear`,
                              animationDelay: `${i * 0.5}s`
                            }}
                          >
                            {Math.random().toString(36).substr(2, 3)}
                          </div>
                        ))}
                      </div>
                      
                      <div className="relative bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-xl p-3 border border-white/20">
                        <Mail className="w-5 h-5 text-white mx-auto mb-1" />
                        <p className="text-xs text-white font-semibold">Email Required</p>
                        <p className="text-xs text-gray-300">Unlock {info.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hidden pathway content */}
                <div className="relative p-4 rounded-2xl border border-white/5 bg-black/60 safari-fallback">
                  <div className="flex items-center justify-between mb-2 opacity-30">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl filter grayscale">{info.icon}</span>
                      <span className="text-sm font-medium text-white">
                        {info.name}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white">••%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden opacity-30">
                    <div className="h-full bg-gradient-to-r from-gray-600 to-gray-700 w-1/2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Enhanced CSS for matrix effect */}
      <style jsx>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

// --- Full Fuzzy Score Display Component ---
const FuzzyScoreDisplay = ({ scores, blend, responses, scoreResult = null }) => {
  const selectedPathways = detectSelectedPathways(responses);
  
  // Use scoreResult if available (v2), otherwise fall back to old props
  const displayScores = scoreResult ? scoreResult.displayPct : scores;
  const absScores = scoreResult ? scoreResult.absPct : null;
  const levels = scoreResult ? scoreResult.levels : null;
  
  // REMOVED: All emergency fallback and debugging logic
  
  const pathwayInfo = {
    'touring-performer': { 
      name: 'Touring Performer', 
      icon: '🎤', 
      color: 'from-blue-500 to-purple-600', 
      baseColor: '#3B82F6',
      description: selectedPathways['touring-performer'] 
        ? 'Your strength lies in live performance and audience connection. Focus here to build a sustainable touring career with strong fan loyalty.'
        : 'Touring Performers prioritize live performance and audience connection. Focus here builds sustainable touring careers with strong fan loyalty.',
      focusAreas: 'Stage presence, audience connection, live performance skills, touring strategy',
      growthAreas: 'Balance studio time with live performance, maintain authentic social presence, embrace venue opportunities'
    },
    'creative-artist': { 
      name: 'Creative Artist', 
      icon: '🎨', 
      color: 'from-pink-500 to-orange-500', 
      baseColor: '#EC4899',
      description: selectedPathways['creative-artist']
        ? 'Your strength lies in creative expression and building sustainable revenue streams. Focus here to develop multiple income sources through your artistry.'
        : 'Creative Artists prioritize creative expression and building sustainable revenue streams. Focus here develops multiple income sources through artistry.',
      focusAreas: 'Brand development, content creation, digital marketing, revenue diversification',
      growthAreas: 'Stay authentic to your vision, balance content creation with artistic growth, maintain creative focus'
    },
    'writer-producer': { 
      name: 'Writer/Producer', 
      icon: '🎹', 
      color: 'from-green-500 to-teal-500', 
      baseColor: '#10B981',
      description: selectedPathways['writer-producer']
        ? 'Your strength lies in technical mastery and collaborative creation. Focus here to build high-value partnerships and consistent royalty income.'
        : 'Writer-Producers prioritize technical mastery and collaborative creation. Focus here builds high-value partnerships and consistent royalty income.',
      focusAreas: 'Production skills, collaboration network, business development, royalty optimization',
      growthAreas: 'Balance solo creativity with collaboration, explore comfortable performance opportunities, build strategic partnerships'
    }
  };
  
  // getArchetypeLevel function removed - scoreResult.levels used exclusively
  
  const sortedScores = Object.entries(displayScores).sort((a, b) => b[1] - a[1]);
  
  // Generate headline from recommendation
  const rec = scoreResult?.recommendation;
  const topId = rec?.path || sortedScores[0][0];
  const topName = PATH_LABELS[topId] || topId;
  const headline = rec?.promoted ? `Recommended Focus: ${topName}` : `Core Focus: ${topName}`;
  const subcopy = rec?.promoted
    ? `You're split across lanes. Start with ${topName} to build momentum; keep your next path light.`
    : `You're strongly aligned with ${topName}. Put ~80% of your energy here for fastest progress.`;
  
  return (
    <div className="mb-8">
      {/* Recommendation headline */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">{headline}</h2>
        <p className="text-sm text-gray-300 max-w-md mx-auto">{subcopy}</p>
      </div>
      
      <h3 className="text-lg font-semibold mb-2 text-white text-center">Your Focus Areas</h3>
      <p className="text-xs text-gray-400 text-center mb-6">Ranked by your responses - helping you find clarity in a scattered industry</p>
      
      <div className="space-y-6">
        {sortedScores.map(([pathway, percentage], index) => {
          const info = pathwayInfo[pathway];
          // ALWAYS use levels from scoreResult - no fallbacks to old logic
          // Use levels from scoreResult
          const pathLevel = levels?.[pathway] || 'Strategic Secondary';
          
          const archetypeLevel = { 
            level: pathLevel, 
            icon: (pathLevel === 'Core Focus') ? '🔥' : (pathLevel === 'Strategic Secondary') ? '⚡' : '💫', 
            description: '' 
          };
          const isPrimary = index === 0;
          const isSecondary = index === 1;
          
          return (
            <div key={pathway} className="relative">
              {/* Rank indicator */}
              {isPrimary && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  #1 PRIMARY
                </div>
              )}
              {isSecondary && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  #2 SECONDARY
                </div>
              )}
              
              {/* Archetype Card */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${
                isPrimary ? 'from-white/15 to-white/8 border-2 border-[#1DD1A1]/30' : 
                isSecondary ? 'from-white/10 to-white/5 border border-white/20' :
                'from-white/5 to-white/[0.02] border border-white/10'
              } backdrop-blur-sm relative overflow-hidden`}>
                
                {/* Glow effect for primary */}
                {isPrimary && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-xl" />
                )}
                
                <div className="relative z-10">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center shadow-lg ${isPrimary ? 'ring-2 ring-[#1DD1A1]/50' : ''}`}>
                      <span className="text-xl">{info.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold ${isPrimary ? 'text-[#1DD1A1]' : 'text-white'}`}>{PATH_LABELS[pathway] || info.name}</span>
                        <span className="text-sm">{archetypeLevel.icon}</span>
                      </div>
                      <span className={`text-xs font-medium ${
                        archetypeLevel.level === 'Core Focus' ? 'text-orange-400' :
                        archetypeLevel.level === 'Strategic Secondary' ? 'text-yellow-400' :
                        'text-purple-400'
                      }`}>
                        {archetypeLevel.level}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${isPrimary ? 'text-[#1DD1A1]' : 'text-white'}`}>{percentage}%</div>
                    <div className="text-xs text-gray-400">alignment</div>
                    {absScores && (
                      <div className="text-xs text-gray-500">({Math.round(absScores[pathway])}% abs)</div>
                    )}
                  </div>
                </div>
                </div>
                
                {/* Description */}
                <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                  {info.description}
                </p>
                
                {/* Focus Areas & Distraction Risks */}
                {index === 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-xs font-semibold text-white">Focus Areas: </span>
                      <span className="text-xs text-gray-400">{info.focusAreas}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white">Growth Areas: </span>
                      <span className="text-xs text-gray-400">{info.growthAreas}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Section - Using scoreResult v2 */}
      <div className="mt-8 p-4 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-xl border border-white/10">
        <h4 className="text-sm font-bold text-white mb-3">🎯 Your Core Focus</h4>
        <div className="text-xs text-gray-300 space-y-2">
          {(() => {
            const rec = scoreResult?.recommendation;
            const topPath = rec?.path || sortedScores[0][0];
            const topName = PATH_LABELS[topPath] || pathwayInfo[topPath]?.name || topPath;
            const topAbsPct = absScores ? Math.round(absScores[topPath]) : sortedScores[0][1];
            const topLevel = levels?.[topPath] || 'Strategic Secondary';
            const isSelected = selectedPathways[topPath];
            
            // Generate insights based on scoreResult v2 logic
            const generateInsights = () => {
              if (rec?.promoted) {
                return isSelected 
                  ? `Start with this area to build momentum, then gradually add your secondary interests.`
                  : `Starting with this area builds momentum before adding secondary interests.`;
              } else if (topLevel === 'Core Focus') {
                return isSelected 
                  ? `This should be your primary focus area where you invest ~80% of your time and energy.`
                  : `This represents the primary focus area where one should invest ~80% of time and energy.`;
              } else if (topLevel === 'Strategic Secondary') {
                return isSelected
                  ? `This area shows promise but needs strategic balance with your other interests.`
                  : `This area shows promise but needs strategic balance with other interests.`;
              } else {
                return isSelected
                  ? `These activities are currently creating noise in your career focus.`
                  : `These activities currently create noise in career focus.`;
              }
            };
            
            const getBlendStrategy = () => {
              const blendType = scoreResult?.blendType || 'Focused';
              if (blendType === 'Hybrid Multi-Creator') {
                return 'Your versatility across multiple paths gives you unique opportunities that single-focused creators miss.';
              } else if (blendType.includes('Blend')) {
                const secondaryPath = sortedScores[1]?.[0];
                const secondaryName = PATH_LABELS[secondaryPath] || pathwayInfo[secondaryPath]?.name;
                return `Focus 70% on your ${topName} strengths while developing your ${secondaryName} skills as a strategic advantage.`;
              } else {
                return `Your clear ${topName} direction allows for deep specialization and expertise building.`;
              }
            };
            
            return (
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <span className="text-white font-medium">{topName}</span> is your strongest priority area at {topAbsPct}% alignment. 
                  {' '}{generateInsights()}
                </p>
                
                {sortedScores[1] && levels?.[sortedScores[1][0]] === 'Strategic Secondary' && (
                  <p className="leading-relaxed">
                    Your secondary focus <span className="text-white font-medium">{PATH_LABELS[sortedScores[1][0]] || pathwayInfo[sortedScores[1][0]]?.name}</span> ({Math.round(absScores?.[sortedScores[1][0]] || sortedScores[1][1])}%) complements your primary path, creating strategic opportunities for growth.
                  </p>
                )}
                
                <p className="leading-relaxed text-[#1DD1A1] font-medium">
                  Strategy: {getBlendStrategy()}
                </p>
              </div>
            );
          })()}
          
          <p className="text-[#B91372] font-medium text-center mt-3">
            Clarity creates focus. Focus creates momentum. Momentum creates results.
          </p>
        </div>
      </div>
      
      {/* Share Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            const primaryPath = Object.entries(displayScores).sort((a, b) => b[1] - a[1])[0];
            const pathName = pathwayInfo[primaryPath[0]].name;
            const shareLevel = levels?.[primaryPath[0]] || 'Strategic Secondary';
            const archetypeLevel = { 
              level: shareLevel, 
              icon: (shareLevel === 'Core Focus') ? '🔥' : (shareLevel === 'Strategic Secondary') ? '⚡' : '💫' 
            };
            
            const options = [
              {
                name: 'Instagram',
                action: () => {
                  const text = `Just discovered my creative archetype! I'm ${pathName} (${archetypeLevel.level}) ${archetypeLevel.icon} 🎵✨ What's your music creator archetype? 🚀`;
                  navigator.clipboard.writeText(`${text} https://homeformusic.app`);
                  window.open('https://www.instagram.com/', '_blank');
                }
              },
              {
                name: 'TikTok', 
                action: () => {
                  const text = `Just discovered my creative archetype! I'm ${pathName} (${archetypeLevel.level}) ${archetypeLevel.icon} 🎵✨ What's your music creator archetype? 🚀`;
                  navigator.clipboard.writeText(`${text} https://homeformusic.app`);
                  window.open('https://www.tiktok.com/', '_blank');
                }
              }
            ];
            
            const choice = prompt('Share to:\\n1. Instagram\\n2. TikTok\\n\\nEnter 1 or 2:');
            if (choice === '1' || choice === '2') {
              options[parseInt(choice) - 1].action();
            }
          }}
          className="group relative inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#B91372]/30 hover:scale-105 overflow-hidden transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 3D Liquid layers */}
          <div className="absolute inset-0 rounded-2xl" style={{ transform: 'translateZ(-10px)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl" />
          </div>
          
          {/* Animated liquid blobs */}
          <div className="absolute inset-0 rounded-2xl animate-liquid-rotate" style={{ transform: 'translateZ(-5px)' }}>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-10 h-10 bg-[#1DD1A1] rounded-full filter blur-lg opacity-80 animate-liquid-blob" />
              <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-[#B91372] rounded-full filter blur-lg opacity-80 animate-liquid-blob-reverse" />
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-[#1DD1A1] rounded-full filter blur-md opacity-60 animate-liquid-blob-slow" />
            </div>
          </div>
          
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 rounded-2xl" style={{ transform: 'translateZ(0px)' }} />
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ transform: 'translateZ(1px)' }}>
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
          </div>
          
          {/* Outer glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" style={{ transform: 'translateZ(-15px)' }} />
          
          <svg className="relative z-10 w-5 h-5 text-white" style={{ transform: 'translateZ(10px)' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
          </svg>
        </button>
      </div>
      
      {/* Stage Roadmap */}
      {scoreResult?.stageLevel && (
        <div className="mt-8 stage-roadmap">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#1DD1A1]" />
              {STAGE_COPY[scoreResult.stageLevel]?.title || 'Next Steps'}
            </h3>
            <ul className="space-y-2">
              {(STAGE_COPY[scoreResult.stageLevel]?.lines || []).map((line, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1DD1A1] mt-0.5 flex-shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Liquid Animation Component ---
const LiquidButton = ({ onClick, disabled, className, children, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#B91372]/30 hover:scale-105 text-white text-lg overflow-hidden transform-gpu ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {/* 3D Liquid layers */}
      <div className="absolute inset-0 rounded-2xl" style={{ transform: 'translateZ(-10px)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl" />
      </div>
      
      {/* Animated liquid blobs */}
      <div className="absolute inset-0 rounded-2xl animate-liquid-rotate" style={{ transform: 'translateZ(-5px)' }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#1DD1A1] rounded-full filter blur-xl opacity-80 animate-liquid-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-[#B91372] rounded-full filter blur-xl opacity-80 animate-liquid-blob-reverse" />
          <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-[#1DD1A1] rounded-full filter blur-lg opacity-60 animate-liquid-blob-slow" />
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-[#B91372] rounded-full filter blur-lg opacity-50 animate-liquid-blob" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-[#1DD1A1] rounded-full filter blur-lg opacity-55 animate-liquid-blob-reverse" style={{animationDelay: '2s'}} />
        </div>
      </div>
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 rounded-2xl" style={{ transform: 'translateZ(0px)' }} />
      
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ transform: 'translateZ(1px)' }}>
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
      </div>
      
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" style={{ transform: 'translateZ(-15px)' }} />
      
      {/* Content */}
      <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </button>
  );
};

// --- Premium Confetti Animation ---
const PremiumConfetti = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
      
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
                  className="relative"
                >
                  {/* Liquid animation for completed circles */}
                  {isCompleted && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#1DD1A1] rounded-full filter blur-sm opacity-60 animate-liquid-blob" />
                        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-[#B91372] rounded-full filter blur-sm opacity-40 animate-liquid-blob-reverse" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`relative w-2 h-2 rounded-full transition-all duration-500 z-10 ${
                      isCompleted ? 'bg-gradient-to-r from-[#1DD1A1] to-[#B91372]' : 
                      isActive ? 'bg-white w-6' : 
                      'bg-white/20'
                    }`}
                  />
                </div>
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
                  <div className="relative">
                    {/* Liquid animation for completed circles */}
                    {isCompleted && (
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full">
                          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#1DD1A1] rounded-full filter blur-sm opacity-60 animate-liquid-blob" />
                          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-[#B91372] rounded-full filter blur-sm opacity-40 animate-liquid-blob-reverse" />
                        </div>
                      </div>
                    )}
                    <div className={`
                      relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 z-10
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
const HOMECreatorFlow = () => {
  const [screen, setScreen] = useState('landing');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [pathway, setPathway] = useState(null);
  const [email, setEmail] = useState('');
  const [artistName, setArtistName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [aiGeneratedPathway, setAiGeneratedPathway] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [preGeneratedPDF, setPreGeneratedPDF] = useState(null);
  const [isPDFGenerating, setIsPDFGenerating] = useState(false);
  
  // Survey state
  const [surveyResponses, setSurveyResponses] = useState({});
  const [surveyQuestionIndex, setSurveyQuestionIndex] = useState(0);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  
  // Backwards compatibility getters
  const fuzzyScores = scoreResult ? scoreResult.displayPct : null;
  const pathwayBlend = scoreResult ? getPathwayBlend(scoreResult) : null;
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [processingStartTime, setProcessingStartTime] = useState(null);

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
  }, [screen, questionIndex, currentStep, surveyQuestionIndex]);

  // Handle quiz answer
  const handleAnswer = async (questionId, value) => {
    setSelectedOption(value);
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    setTimeout(async () => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        // Calculate pathway
        const finalResponses = { ...responses, [questionId]: value };
        setScreen('transition');
        
        // Start AI generation with real progress tracking
        setIsGenerating(true);
        setLoadingProgress(0);
        setProcessingStartTime(Date.now());
        
        // Progress simulation during actual processing
        let currentStep = 0;
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 95) return prev; // Don't go to 100% until actually done
            
            // Gradual progress increase with step-based milestones
            const targetProgress = Math.min(currentStep * 25 + Math.random() * 15, 95);
            if (prev < targetProgress) {
              return Math.min(prev + 2 + Math.random() * 3, targetProgress);
            }
            return prev;
          });
        }, 600);
        
        try {
          console.log('🤖 Calling AI endpoint with responses:', finalResponses);
          
          // Calculate scores using v2 logic
          const { scoreUser } = await import('../lib/scoring/index.js');
          const result = scoreUser(finalResponses);
          console.log('🎯 Score Result from v2:', {
            displayPct: result.displayPct,
            absPct: result.absPct,
            levels: result.levels,
            recommendation: result.recommendation
          });
          setScoreResult(result);
          
          // For backwards compatibility in API calls
          const calculatedScores = result.displayPct;
          const calculatedBlend = getPathwayBlend(result);
          
          // Progressive step completion
          setTimeout(() => { currentStep = 1; }, 1200);
          setTimeout(() => { currentStep = 2; }, 2500);
          setTimeout(() => { currentStep = 3; }, 4000);
          setTimeout(() => { currentStep = 4; }, 5500);
          
          // Call AI endpoint for personalized pathway
          const aiResponse = await fetch('/api/generate-pathway', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              responses: finalResponses,
              scoreResult: result,
              // Legacy fallback for API compatibility
              fuzzyScores: result.displayPct,
              pathwayBlend: { type: result.blendType, primary: result.recommendation.path }
            })
          });
          
          // Ensure step 4 has time to process, then complete
          setTimeout(() => {
            clearInterval(progressInterval);
            setLoadingProgress(100);
          }, Math.max(7000, Date.now() - processingStartTime + 2000));
          
          if (aiResponse.ok) {
            const aiPathway = await aiResponse.json();
            console.log('✅ AI pathway received:', aiPathway);
            
            // Store the AI-generated pathway data
            setAiGeneratedPathway(aiPathway);
            
            // Transform AI response to match component structure
            const transformedPathway = {
              ...aiPathway,
              title: aiPathway.title,
              icon: aiPathway.icon,
              color: 'from-[#1DD1A1] to-[#B91372]',
              description: aiPathway.description,
              baseDescription: aiPathway.description,
              homeConnection: aiPathway.homeConnection,
              planPreview: aiPathway.nextSteps?.slice(0, 4).map(step => 
                typeof step === 'object' ? step.step : step
              ),
              steps: transformAIStepsToComponentFormat(aiPathway),
              isPersonalized: aiPathway.isPersonalized,
              assistantUsed: aiPathway.assistantUsed,
              // Include pathway details for UnifiedResultsV3 and PDF generation
              pathwayDetails: aiPathway.pathwayDetails,
              // Store original AI data
              originalNextSteps: aiPathway.nextSteps,
              originalResources: aiPathway.resources
            };
            
            setPathway(transformedPathway);
            console.log('✅ AI pathway transformed:', transformedPathway);
            
            // Pre-generate PDF using the AI pathway directly (no waiting for state)
            setTimeout(() => {
              preGeneratePDF(aiPathway, result);
            }, 500); // Pass the aiPathway and scoreResult directly
          } else {
            // Fallback to template if AI fails
            console.warn('❌ AI generation failed, using fallback');
            const pathwayKey = result.recommendation.path;
            setPathway(pathwayTemplates[pathwayKey]);
            
            // Pre-generate PDF for fallback pathway too
            setTimeout(() => {
              preGeneratePDF(pathwayTemplates[pathwayKey], result);
            }, 500);
          }
        } catch (error) {
          console.error('❌ Error generating AI pathway:', error);
          
          // Complete remaining steps quickly on error
          setTimeout(() => {
            currentStep = 4;
          }, 1000);
          
          setTimeout(() => {
            clearInterval(progressInterval);
            setLoadingProgress(100);
          }, 2500);
          
          // Fallback to template
          const pathwayKey = result.recommendation.path;
          setPathway(pathwayTemplates[pathwayKey]);
          
          // Pre-generate PDF for error fallback too
          setTimeout(() => {
            preGeneratePDF(pathwayTemplates[pathwayKey], result);
          }, 1000);
        }
        
        setIsGenerating(false);
        setScreen('email');
      }
    }, 300);
  };

  // Handle industry map purchase
  const handleIndustryMapPurchase = async () => {
    console.log('🛒 Starting industry map purchase');
    
    if (!email) {
      alert('Please enter your email address first');
      return;
    }
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          pathwayTitle: pathway?.title || 'Your Music Creator Path',
          userResponses: responses
        })
      });
      
      const { url } = await response.json();
      
      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url;
      } else {
        console.error('No checkout URL received');
        alert('Unable to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Unable to start checkout. Please try again.');
    }
  };

  // Pre-generate PDF in background for instant download
  const preGeneratePDF = async (explicitPathway = null, explicitScoreResult = null) => {
    if (isPDFGenerating || preGeneratedPDF) return; // Don't generate if already generating or done
    
    try {
      setIsPDFGenerating(true);
      console.log('🔄 Pre-generating PDF in background...');
      
      const currentScoreResult = explicitScoreResult || scoreResult;
      console.log('🔍 PDF generation context:', {
        hasExplicitPathway: !!explicitPathway,
        hasExplicitScoreResult: !!explicitScoreResult,
        hasScoreResult: !!scoreResult,
        currentScoreResultExists: !!currentScoreResult,
        scoreResultLevels: currentScoreResult?.levels,
        scoreResultRecommendation: currentScoreResult?.recommendation,
        scoreResultDisplayPct: currentScoreResult?.displayPct
      });
      
      const sessionId = Date.now().toString();
      const currentPathway = explicitPathway || aiGeneratedPathway || pathway;
      
      console.log('🔄 Pre-generate PDF using pathway:', {
        hasExplicitPathway: !!explicitPathway,
        hasAiGenerated: !!aiGeneratedPathway,
        hasPathway: !!pathway,
        finalPathway: !!currentPathway,
        pathwayTitle: currentPathway?.title
      });
      
      // Ensure we have valid data for PDF generation
      const pdfData = {
        pathway: currentPathway,
        responses: responses || {},
        scoreResult: currentScoreResult || null,
        pathwayDetails: currentPathway?.pathwayDetails || {},
        fuzzyScores: currentScoreResult?.displayPct || fuzzyScores || {},
        pathwayBlend: currentScoreResult ? { 
          type: currentScoreResult.blendType || 'focused', 
          primary: currentScoreResult.recommendation?.path || 'creative-artist'
        } : (pathwayBlend || { type: 'focused', primary: 'creative-artist' })
      };
      
      console.log('📋 PDF data being sent:', {
        hasPathway: !!pdfData.pathway,
        hasResponses: !!pdfData.responses,
        hasScoreResult: !!pdfData.scoreResult,
        hasFuzzyScores: !!pdfData.fuzzyScores && Object.keys(pdfData.fuzzyScores).length > 0,
        pathwayTitle: pdfData.pathway?.title,
        hasPathwayDetails: !!pdfData.pathwayDetails,
        pathwayDetailsKeys: Object.keys(pdfData.pathwayDetails || {}),
        pathwayDetailsContent: pdfData.pathwayDetails,
        scoreResultLevels: pdfData.scoreResult?.levels,
        scoreResultRecommendation: pdfData.scoreResult?.recommendation,
        scoreResultDisplayPct: pdfData.scoreResult?.displayPct,
        scoreResultAbsPct: pdfData.scoreResult?.absPct,
        actualScoreResultObject: pdfData.scoreResult
      });
      
      if (!pdfData.pathway) {
        console.error('❌ Cannot pre-generate PDF: no pathway data available');
        return;
      }
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, pathwayData: pdfData }),
      });

      if (response.ok) {
        const blob = await response.blob();
        setPreGeneratedPDF(blob);
        console.log('✅ PDF pre-generated successfully');
      } else {
        const errorText = await response.text();
        console.error('❌ PDF pre-generation failed:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ PDF pre-generation error:', error);
    } finally {
      setIsPDFGenerating(false);
    }
  };

  // Handle instant PDF download (uses pre-generated PDF)
  const handlePDFGeneration = async () => {
    try {
      let blob = preGeneratedPDF;
      
      // If no pre-generated PDF, generate it now (fallback)
      if (!blob) {
        console.log('⚠️ No pre-generated PDF, generating now...');
        const sessionId = Date.now().toString();
        const currentPathway = aiGeneratedPathway || pathway;
        
        // Ensure we have pathway data
        if (!currentPathway) {
          console.error('❌ No pathway data available for PDF generation');
          alert('Error: Please complete the assessment first.');
          return;
        }
        
        console.log('📄 Generating PDF with pathway:', currentPathway?.title || 'Untitled');
        
        const pdfData = {
          pathway: currentPathway,
          responses: responses || {},
          scoreResult: scoreResult || null,
          pathwayDetails: currentPathway?.pathwayDetails || {},
          fuzzyScores: scoreResult?.displayPct || fuzzyScores || {},
          pathwayBlend: scoreResult ? { 
            type: scoreResult.blendType || 'focused', 
            primary: scoreResult.recommendation?.path || 'creative-artist'
          } : (pathwayBlend || { type: 'focused', primary: 'creative-artist' })
        };
        
        console.log('📤 Sending PDF data to API...');
        
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, pathwayData: pdfData }),
        });

        if (response.ok) {
          blob = await response.blob();
        } else {
          console.error('❌ PDF generation failed');
          alert('Failed to generate PDF. Please try again.');
          return;
        }
      } else {
        console.log('✅ Using pre-generated PDF for instant download');
      }

      // Create instant download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `music-creator-roadmap-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ PDF downloaded successfully');
    } catch (error) {
      console.error('❌ PDF generation error:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  };

  // Handle survey submission
  const handleSurveySubmission = async () => {
    if (!email || !surveyResponses || Object.keys(surveyResponses).length === 0) {
      console.log('⚠️ No survey data to submit or no email available');
      return;
    }

    try {
      console.log('📋 Submitting survey responses...');
      console.log('📧 Email:', email);
      console.log('📋 Survey data keys:', Object.keys(surveyResponses));

      const response = await fetch('/api/update-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          surveyResponses
        })
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('✅ Survey responses submitted successfully:', responseData);
      } else {
        console.error('❌ Survey submission failed:', responseData);
      }
    } catch (error) {
      console.error('❌ Error submitting survey:', error);
    }
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    console.log('🟢 handleEmailSubmit called');
    console.log('📧 Email:', email);
    console.log('🎯 Pathway data:', pathway);
    console.log('🤖 AI Generated data:', aiGeneratedPathway);
    console.log('📋 Survey Responses available:', surveyResponses);
    console.log('📋 Survey Response keys:', Object.keys(surveyResponses || {}));
    
    if (!email || isProcessing) {
      console.log('❌ Returning early - no email or already processing');
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    // Realistic processing with variable timing
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15; // More realistic progress
      });
    }, 200);
    
    // Simulate actual email processing time (1-2 seconds)
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setIsProcessing(false);
      setShowResults(true);
      setScreen('final-disclaimer');
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
    }, 1000 + Math.random() * 1000); // 1-2 seconds

    // Actually submit
    try {
      console.log('🚀 Preparing to call submit-lead API...');
      
      // Prepare the results object with AI-generated content or fallback data
      const results = {
        pathway: aiGeneratedPathway?.pathway || pathway?.pathway || scoreResult?.recommendation?.path || 'touring-performer',
        title: pathway?.title || 'Your Music Creator Path',
        description: pathway?.description || pathway?.baseDescription || '',
        icon: pathway?.icon || '🎵',
        nextSteps: aiGeneratedPathway?.nextSteps || pathway?.originalNextSteps || pathway?.steps?.slice(0, 4).map((step, index) => ({
          priority: index + 1,
          step: step.title,
          detail: step.description
        })) || [],
        resources: aiGeneratedPathway?.resources || pathway?.originalResources || pathway?.steps?.[0]?.homeResources || [
          "24/7 Studio Access",
          "Professional Equipment", 
          "Community Network",
          "Educational Workshops",
          "Industry Connections",
          "Business Resources"
        ],
        homeConnection: aiGeneratedPathway?.homeConnection || pathway?.homeConnection || '',
        isPersonalized: aiGeneratedPathway?.isPersonalized || pathway?.isPersonalized || false,
        assistantUsed: aiGeneratedPathway?.assistantUsed || pathway?.assistantUsed || false,
        // Include scoring data and pathway details for webhook
        scoreResult: scoreResult,
        pathwayDetails: aiGeneratedPathway?.pathwayDetails || pathway?.pathwayDetails || {}
      };
      
      const submitData = {
        email,
        artistName,
        pathway: pathway?.title,
        responses,
        source: 'music-creator-roadmap-flow',
        results: results,
        surveyResponses: surveyResponses
      };
      
      console.log('📤 Sending to API:', {
        email: submitData.email,
        pathway: submitData.pathway,
        hasResults: true,
        nextStepsCount: results.nextSteps.length,
        resourcesCount: results.resources.length,
        isPersonalized: results.isPersonalized,
        hasSurveyData: !!surveyResponses && Object.keys(surveyResponses).length > 0
      });
      
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      const responseData = await response.json();
      console.log('📨 API Response:', responseData);
      
      if (!response.ok) {
        console.error('❌ Submit failed:', responseData);
      } else {
        console.log('✅ Lead submitted successfully');
        console.log('💾 Data stored in MongoDB successfully');
        console.log('📝 Circle post status:', responseData.data?.circle);
      }
    } catch (error) {
      console.error('❌ Error submitting:', error);
    }
  };

  // Navigation
  const goBack = () => {
    if (screen === 'intro') {
      setScreen('landing');
    } else if (screen === 'assessment' && questionIndex > 0) {
      setQuestionIndex(prev => prev - 1);
    } else if (screen === 'email') {
      setScreen('assessment');
      setQuestionIndex(questions.length - 1);
    } else if (screen === 'assessment' && questionIndex === 0) {
      setScreen('intro');
    } else if (screen === 'plan' && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (screen === 'plan' && currentStep === 0) {
      setScreen('celebration');
    } else if (screen === 'execute') {
      setScreen('plan');
      setCurrentStep(3);
    } else if (screen === 'survey') {
      setScreen('execute');
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
      
      /* 3D Liquid animations */
      @keyframes liquid-rotate {
        0% { transform: translateZ(-5px) rotate(0deg); }
        100% { transform: translateZ(-5px) rotate(360deg); }
      }

      @keyframes liquid-blob {
        0% {
          transform: translate(0, 0) scale(1) rotate(0deg);
          opacity: 0.7;
        }
        20% {
          transform: translate(60px, -40px) scale(1.8) rotate(72deg);
          opacity: 0.9;
        }
        40% {
          transform: translate(-50px, 60px) scale(0.6) rotate(144deg);
          opacity: 0.4;
        }
        60% {
          transform: translate(40px, -20px) scale(1.4) rotate(216deg);
          opacity: 0.8;
        }
        80% {
          transform: translate(-30px, -50px) scale(1.1) rotate(288deg);
          opacity: 0.6;
        }
        100% {
          transform: translate(0, 0) scale(1) rotate(360deg);
          opacity: 0.7;
        }
      }

      @keyframes liquid-blob-reverse {
        0% {
          transform: translate(0, 0) scale(1) rotate(360deg);
          opacity: 0.6;
        }
        25% {
          transform: translate(-40px, 50px) scale(0.7) rotate(270deg);
          opacity: 0.9;
        }
        50% {
          transform: translate(70px, -30px) scale(1.6) rotate(180deg);
          opacity: 0.3;
        }
        75% {
          transform: translate(-20px, -40px) scale(1.2) rotate(90deg);
          opacity: 0.7;
        }
        100% {
          transform: translate(0, 0) scale(1) rotate(0deg);
          opacity: 0.6;
        }
      }

      @keyframes liquid-blob-slow {
        0% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
          opacity: 0.5;
        }
        33% {
          transform: translate(-30%, -70%) scale(1.5) rotate(120deg);
          opacity: 0.8;
        }
        66% {
          transform: translate(-70%, -30%) scale(0.8) rotate(240deg);
          opacity: 0.3;
        }
        100% {
          transform: translate(-50%, -50%) scale(1) rotate(360deg);
          opacity: 0.5;
        }
      }

      .animate-liquid-rotate {
        animation: liquid-rotate 8s linear infinite;
      }

      .animate-liquid-blob {
        animation: liquid-blob 3s ease-in-out infinite;
      }

      .animate-liquid-blob-reverse {
        animation: liquid-blob-reverse 3.5s ease-in-out infinite reverse;
      }

      .animate-liquid-blob-slow {
        animation: liquid-blob-slow 4s ease-in-out infinite;
      }

      /* Enable GPU acceleration */
      .transform-gpu {
        transform: translateZ(0);
        will-change: transform;
      }
      
      /* Add this after the other @keyframes animations */
      @keyframes gradient-x {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .animate-gradient-x {
        animation: gradient-x 3s ease-in-out infinite;
        background-size: 200% 100%;
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
        <div className="screen-height bg-black relative overflow-hidden flex items-center justify-center">
          {/* Subtle gradient background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1DD1A1] rounded-full filter blur-[200px] opacity-10" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#B91372] rounded-full filter blur-[200px] opacity-10" />
          </div>
          
          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8">
            {/* Main Content - Centered */}
            <div className="text-center">
                {/* Title - Smaller on mobile */}
                <div className="mb-8 sm:mb-12 animate-fadeIn">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white">
                    Find Your Path <span className="block sm:inline">on the</span>
                    <span className="block bg-gradient-to-r from-[#1DD1A1] to-[#B91372] bg-clip-text text-transparent">
                      Music Creator Roadmap
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-xl mx-auto">
                   AI-powered insights that reveal your priorities and map your strategic next moves.
                  </p>
                </div>
                
                {/* CTA Button - Prominent */}
                <div className="mb-8 sm:mb-12">
                  <button
                    onClick={() => setScreen('intro')}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-medium rounded-2xl transition-all duration-500 hover:scale-105 animate-scaleIn text-white overflow-hidden transform-gpu"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* 3D Liquid layers */}
                    <div className="absolute inset-0 rounded-2xl" style={{ transform: 'translateZ(-10px)' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl" />
                    </div>
                    
                    {/* Animated liquid blobs */}
                    <div className="absolute inset-0 rounded-2xl animate-liquid-rotate" style={{ transform: 'translateZ(-5px)' }}>
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#1DD1A1] rounded-full filter blur-xl opacity-80 animate-liquid-blob" />
                        <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-[#B91372] rounded-full filter blur-xl opacity-80 animate-liquid-blob-reverse" />
                        <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-[#1DD1A1] rounded-full filter blur-lg opacity-60 animate-liquid-blob-slow" />
                        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-[#B91372] rounded-full filter blur-lg opacity-50 animate-liquid-blob" style={{animationDelay: '1s'}} />
                        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-[#1DD1A1] rounded-full filter blur-lg opacity-55 animate-liquid-blob-reverse" style={{animationDelay: '2s'}} />
                      </div>
                    </div>
                    
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 rounded-2xl" style={{ transform: 'translateZ(0px)' }} />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ transform: 'translateZ(1px)' }}>
                      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                    </div>
                    
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" style={{ transform: 'translateZ(-15px)' }} />
                    
                    {/* Content */}
                    <span className="relative z-10" style={{ transform: 'translateZ(10px)' }}>Start</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ transform: 'translateZ(10px)' }} />
                  </button>
                  
                  <p className="text-sm text-gray-400 mt-4 animate-fadeIn">
                    Designed by Artists for Artists
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
              
            {/* Footer - Logo with glow effect and text */}
            <div className="text-center mt-12 sm:mt-16 animate-fadeIn delay-500">
              <div className="relative inline-block mb-3 group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <img 
                  src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
                  alt="HOME"
                  className="h-8 relative z-10"
                />
              </div>
              <div className="text-sm text-gray-400 mt-2">
                By HOME For Music<br />
                homeformusic.app
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'intro' && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
          <div className="max-w-md w-full">
            <div className="animate-fadeIn">
              {/* Back button */}
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              
              <div className="text-center">
                {/* Header badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
                <Target className="w-4 h-4 text-[#1DD1A1]" />
                <span className="text-sm font-semibold text-white">Your Path Starts Here</span>
              </div>
              

              {/* Main Content */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-white">
                  Focus Changes Everything
                </h1>
                
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  The secret to breakthrough success?<br/>
                  <strong className="text-white">Laser focus</strong> on what matters most.
                </p>
                
                <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-6 mb-8 text-center safari-fallback">
                  <blockquote className="text-xl font-medium text-white mb-3 leading-relaxed">
                    <span className="text-2xl text-[#1DD1A1] opacity-70">&ldquo;</span>
                    Be like a postage stamp - stick to one thing until you get there
                    <span className="text-2xl text-[#1DD1A1] opacity-70">&rdquo;</span>
                  </blockquote>
                  <p className="text-gray-400 text-sm mb-4 text-center italic">Josh Billings, American writer and humorist</p>
                  
                  <p className="text-gray-300 leading-relaxed">
                    While you may identify with multiple paths, <strong className="text-[#1DD1A1]">focus creates breakthroughs</strong>. This assessment reveals your highest-impact priority and the path that will <strong className="text-white">help you move your music career forward</strong>.
                  </p>
                </div>
              </div>
              
              {/* CTA Button */}
              <button
                onClick={() => setScreen('assessment')}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#B91372]/30 hover:scale-105 text-white text-lg overflow-hidden transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D Liquid layers */}
                <div className="absolute inset-0 rounded-2xl" style={{ transform: 'translateZ(-10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl" />
                </div>
                
                {/* Animated liquid blobs */}
                <div className="absolute inset-0 rounded-2xl animate-liquid-rotate" style={{ transform: 'translateZ(-5px)' }}>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#1DD1A1] rounded-full filter blur-xl opacity-80 animate-liquid-blob" />
                    <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-[#B91372] rounded-full filter blur-xl opacity-80 animate-liquid-blob-reverse" />
                    <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-[#1DD1A1] rounded-full filter blur-lg opacity-60 animate-liquid-blob-slow" />
                    <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-[#B91372] rounded-full filter blur-lg opacity-50 animate-liquid-blob" style={{animationDelay: '1s'}} />
                    <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-[#1DD1A1] rounded-full filter blur-lg opacity-55 animate-liquid-blob-reverse" style={{animationDelay: '2s'}} />
                  </div>
                </div>
                
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 rounded-2xl" style={{ transform: 'translateZ(0px)' }} />
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ transform: 'translateZ(1px)' }}>
                  <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                </div>
                
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" style={{ transform: 'translateZ(-15px)' }} />
                
                <span className="relative z-10" style={{ transform: 'translateZ(10px)' }}>Discover My Path</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ transform: 'translateZ(10px)' }} />
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'assessment' && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
          <div className="max-w-md w-full">
            <div className="animate-fadeIn">
              {/* Back button */}
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              
              {/* Main Content Container - matching email capture style */}
              <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden safari-fallback">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#1DD1A1]/20 to-transparent rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#B91372]/20 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
                  
                  {/* Floating particles */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full opacity-20"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Progress indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
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
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
                      {questions[questionIndex].icon}
                      <span className="text-sm font-semibold text-white">Path Discovery</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {questions[questionIndex].question}
                    </h2>
                    {questions[questionIndex].subtitle && (
                      <p className="text-sm text-[#1DD1A1] mb-4 max-w-md mx-auto leading-relaxed">
                        {questions[questionIndex].subtitle}
                      </p>
                    )}
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-3">
                    {questions[questionIndex].options.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(questions[questionIndex].id, option.value)}
                        className={`
                          w-full p-4 rounded-2xl border transition-all duration-300 text-left animate-slideUp
                          ${selectedOption === option.value 
                            ? 'border-[#1DD1A1] bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10' 
                            : 'border-white/10 bg-black/70 backdrop-blur-sm hover:bg-black/60 hover:border-white/20 safari-fallback'
                          }
                        `}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="flex-1 text-sm text-white leading-relaxed">{option.label}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'transition' && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
          <div className="max-w-lg w-full">
            <div className="animate-fadeIn">
              {/* Main Content Container - Enhanced styling */}
              <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-10 overflow-hidden shadow-2xl safari-fallback">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#1DD1A1]/20 to-transparent rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-[#B91372]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
                  
                  {/* Floating particles */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/30 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 3}s`
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Header badge */}
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-8 backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-[#1DD1A1] animate-pulse" />
                    <span className="text-sm font-semibold text-white">AI Analysis</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-3 text-white bg-gradient-to-r from-[#1DD1A1] to-[#B91372] bg-clip-text text-transparent">
                    Crafting Your Strategic Roadmap
                  </h2>
                  
                  <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-md mx-auto">
                    Our AI is analyzing your responses to create a personalized pathway
                  </p>
                  
                  {/* Process Steps */}
                  <div className="space-y-6">
                    <AIProcessStep 
                      step={1}
                      label="Analyzing your creative priorities"
                      duration={1500}
                      progress={loadingProgress}
                      icon={<Target className="w-5 h-5" />}
                    />
                    <AIProcessStep 
                      step={2}
                      label="Mapping your optimal career path"
                      duration={4000}
                      progress={loadingProgress}
                      icon={<MapPin className="w-5 h-5" />}
                    />
                    <AIProcessStep 
                      step={3}
                      label="Identifying strategic next steps"
                      duration={6500}
                      progress={loadingProgress}
                      icon={<ListChecks className="w-5 h-5" />}
                    />
                    <AIProcessStep 
                      step={4}
                      label="Crafting your personalized roadmap"
                      duration={9000}
                      progress={loadingProgress}
                      icon={<Sparkles className="w-5 h-5" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'email' && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
          <div className="max-w-md w-full">
            {!isProcessing ? (
              <div className="animate-fadeIn">
                {/* Unified Email Capture Experience */}
                {scoreResult && (
                  <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden safari-fallback">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#1DD1A1]/20 to-transparent rounded-full blur-2xl animate-pulse" />
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#B91372]/20 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}} />
                      
                      {/* Floating particles */}
                      {[...Array(15)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full opacity-20"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
                          <Sparkles className="w-4 h-4 text-[#1DD1A1]" />
                          <span className="text-sm font-semibold text-white">Your Creative Profile Analysis</span>
                          <Sparkles className="w-4 h-4 text-[#B91372]" />
                        </div>
                      </div>
                      
                      {/* Consolidated Pathway & Email Section */}
                      <div className="text-center">
                        {(() => {
                          // Use scoreResult (guaranteed to be available due to condition)
                          const topId = scoreResult.recommendation.path;
                          const topName = PATH_LABELS[topId] || topId;
                          const topIcon = PATH_ICONS[topId] || '🎵';
                          
                          return (
                            <>
                              <div className="relative inline-block mb-6">
                                <div className="absolute -inset-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full blur-lg opacity-20 animate-pulse" />
                                <div className="relative w-16 h-16 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center text-3xl shadow-xl">
                                  {topIcon}
                                </div>
                              </div>
                              
                              <h2 className="text-2xl font-bold text-white mb-2">Your Roadmap is Ready</h2>
                              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                                Learn about your core focus, get your full Roadmap + 10 companies that need to be on your radar.
                              </p>
                              
                              {/* Locked preview bars */}
                              <div className="space-y-3 mb-8 max-w-xs mx-auto">
                                {/* Top path - unlocked preview */}
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{topIcon}</span>
                                  <div className="flex-1 bg-white/10 rounded-full h-2 relative overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full transition-all duration-1000"
                                      style={{ width: '60%' }}
                                    />
                                  </div>
                                  <span className="text-sm text-white font-medium">{topName}</span>
                                </div>
                                
                                {/* Other paths - locked - sorted by score */}
                                {(() => {
                                  // Sort the other paths by their scores (descending)
                                  const sortedOtherPaths = Object.entries(scoreResult.displayPct)
                                    .filter(([id]) => id !== topId)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([id]) => id);
                                  
                                  return sortedOtherPaths.map(pathId => (
                                  <div key={pathId} className="flex items-center gap-3 opacity-50">
                                    <span className="text-lg">{PATH_ICONS[pathId]}</span>
                                    <div className="flex-1 bg-white/10 rounded-full h-2 relative overflow-hidden">
                                      <div className="h-full bg-gray-500 rounded-full" style={{ width: '30%' }} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Lock className="w-3 h-3 text-gray-400" />
                                      <span className="text-sm text-gray-400">{PATH_LABELS[pathId]}</span>
                                    </div>
                                  </div>
                                  ));
                                })()}
                              </div>
                            </>
                          );
                        })()}
                        
                        {/* Artist name input */}
                        <div className="relative mb-4">
                          <input
                            type="text"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-xl 
                                     focus:bg-black/50 focus:border-[#1DD1A1] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1]/20
                                     transition-all duration-300 text-white placeholder-gray-400 text-lg backdrop-blur-sm"
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Email input */}
                        <div className="relative mb-8">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-xl 
                                     focus:bg-black/50 focus:border-[#1DD1A1] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1]/20
                                     transition-all duration-300 text-white placeholder-gray-400 text-lg backdrop-blur-sm"
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <Mail className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        {/* Clean CTA Button */}
                        <div className="relative">
                          <button
                            onClick={handleEmailSubmit}
                            disabled={!email || !artistName || isProcessing}
                            className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#B91372]/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg overflow-hidden transform-gpu"
                          >
                            {/* Animated liquid blobs with continuous movement */}
                            <div className="absolute inset-0 rounded-xl animate-liquid-rotate">
                              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#1DD1A1] rounded-full filter blur-xl opacity-80 animate-liquid-blob" />
                              <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-[#B91372] rounded-full filter blur-xl opacity-80 animate-liquid-blob-reverse" />
                              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#1DD1A1] rounded-full filter blur-lg opacity-60 animate-liquid-blob-slow" />
                              <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-[#B91372] rounded-full filter blur-lg opacity-50 animate-liquid-blob" style={{animationDelay: '1s'}} />
                              <div className="absolute bottom-1/3 left-1/3 w-18 h-18 bg-[#1DD1A1] rounded-full filter blur-lg opacity-55 animate-liquid-blob-reverse" style={{animationDelay: '2s'}} />
                            </div>
                            
                            {/* Glass effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl" />
                            
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 rounded-xl overflow-hidden">
                              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                            </div>
                            
                            <span className="relative z-10">Unlock My Roadmap</span>
                            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                          
                          {/* Simple trust indicator */}
                          <div className="mt-4 text-center">
                            <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>Instant access • Built for music creators</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Privacy compliance */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <div className="text-center text-xs text-gray-400 leading-relaxed">
                            <p className="mb-3">
                              By providing your email, you consent to receive your personalized music career roadmap and occasional valuable resources from HOME. 
                            </p>
                            <p className="mb-1">
                              We respect your privacy. Read our
                            </p>
                            <p>
                              <a 
                                href="https://homeformusic.app/privacy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#1DD1A1] hover:text-[#B91372] transition-colors underline"
                              >
                                Privacy Policy
                              </a>
                              {' '}and{' '}
                              <a 
                                href="https://homeformusic.app/terms" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#1DD1A1] hover:text-[#B91372] transition-colors underline"
                              >
                                Terms of Service
                              </a>
                              .
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fadeIn">
                {/* Main Content Container - Enhanced styling */}
                <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-10 overflow-hidden shadow-2xl safari-fallback">
                  {/* Animated background elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#1DD1A1]/20 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-[#B91372]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
                    
                    {/* Floating particles */}
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 3}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Header badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-8 backdrop-blur-sm">
                      <Check className="w-5 h-5 text-[#1DD1A1] animate-pulse" />
                      <span className="text-sm font-semibold text-white">Final Processing</span>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-3 text-white bg-gradient-to-r from-[#1DD1A1] to-[#B91372] bg-clip-text text-transparent">
                      Creating Your Strategic Roadmap
                    </h2>
                    
                    <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-md mx-auto">
                      Finalizing your personalized music career pathway
                    </p>
                    
                    {/* Process Steps - fast completion */}
                    <div className="space-y-6">
                      <AIProcessStep 
                        step={1}
                        label="Finalizing your strategic roadmap"
                        duration={1000}
                        progress={progress}
                        icon={<Check className="w-5 h-5" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === 'final-disclaimer' && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
          <PremiumConfetti show={showConfetti} />
          
          <div className="max-w-md w-full">
            <div className="animate-fadeIn">
              <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden safari-fallback">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#1DD1A1]/20 to-transparent rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#B91372]/20 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-4">
                      <Target className="w-4 h-4 text-[#1DD1A1]" />
                      <span className="text-sm font-semibold text-white">Your Path is Ready!</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-4">Before We Show Your Results</h2>
                  </div>
                  
                  {/* Disclaimer Text */}
                  <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6 text-left safari-fallback">
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      <span className="text-white font-medium">Important:</span> This tool is developed by{' '}
                      <span className="text-[#1DD1A1]">homeformusic.app</span> as a creative guidance resource.
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      No tool or person can promise or guarantee results in the music industry. Success depends on talent, dedication, market conditions, and many other factors beyond any assessment.
                    </p>
                  </div>
                  
                  {/* CTA Button */}
                  <button
                    onClick={() => setScreen('celebration')}
                    className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#B91372]/30 hover:scale-105 text-white text-lg overflow-hidden transform-gpu"
                  >
                    {/* Animated liquid blobs with continuous movement */}
                    <div className="absolute inset-0 rounded-xl animate-liquid-rotate">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#1DD1A1] rounded-full filter blur-xl opacity-80 animate-liquid-blob" />
                      <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-[#B91372] rounded-full filter blur-xl opacity-80 animate-liquid-blob-reverse" />
                      <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#1DD1A1] rounded-full filter blur-lg opacity-60 animate-liquid-blob-slow" />
                      <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-[#B91372] rounded-full filter blur-lg opacity-50 animate-liquid-blob" style={{animationDelay: '1s'}} />
                      <div className="absolute bottom-1/3 left-1/3 w-18 h-18 bg-[#1DD1A1] rounded-full filter blur-lg opacity-55 animate-liquid-blob-reverse" style={{animationDelay: '2s'}} />
                    </div>
                    
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                    </div>
                    
                    <span className="relative z-10">Show My Path</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'celebration' && pathway && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
          <PremiumConfetti show={showConfetti} />
          
          <div className="max-w-md w-full">
            <div className="animate-fadeIn">
              {/* Main Content Container - matching email capture style */}
              <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden safari-fallback">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#1DD1A1]/20 to-transparent rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#B91372]/20 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
                  
                  {/* Floating particles */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full opacity-20"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
                      <Sparkles className="w-4 h-4 text-[#1DD1A1]" />
                      <span className="text-sm font-semibold text-white">Your Path</span>
                      <Sparkles className="w-4 h-4 text-[#B91372]" />
                    </div>
                    
                    {/* Path result with icon */}
                    <div className="mb-6">
                      <div className="relative inline-block mb-4 group">
                        {/* Liquid animation for main icon */}
                        <div className="absolute inset-0 rounded-full overflow-hidden" style={{ transform: 'translateZ(-5px)' }}>
                          <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-[#1DD1A1] rounded-full filter blur-xl opacity-80 animate-liquid-blob" />
                            <div className="absolute bottom-1/4 right-1/4 w-18 h-18 bg-[#B91372] rounded-full filter blur-xl opacity-80 animate-liquid-blob-reverse" />
                            <div className="absolute top-1/2 left-1/2 w-14 h-14 bg-[#1DD1A1] rounded-full filter blur-lg opacity-60 animate-liquid-blob-slow" />
                          </div>
                        </div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center text-3xl shadow-xl z-10">
                          {pathway.icon}
                        </div>
                      </div>
                      
                      {(() => {
                        const rec = scoreResult?.recommendation;
                        let resultHeadline = pathway.title;
                        if (rec) {
                          const pathLabel = PATH_LABELS[rec.path] || rec.path;
                          resultHeadline = pathLabel;
                        }
                        return <h1 className="text-2xl font-bold mb-4 text-white">{resultHeadline}</h1>;
                      })()}
                    </div>
                    
                    {/* Stage indicator */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8">
                      <MapPin className="w-4 h-4 text-[#B91372]" />
                      <span className="text-sm font-medium text-white">
                        You're at the <span className="text-[#B91372]">
                          {(() => {
                            console.log('Stage level response:', responses['stage-level']);
                            return responses['stage-level'] === 'planning' ? 'Planning' : 
                                   responses['stage-level'] === 'production' ? 'Production' : 'Scale';
                          })()} Stage
                        </span>
                      </span>
                    </div>
                    
                    {/* Main Description - Use AI description first, fallback to hardcoded */}
                    {(() => {
                      // Use AI-generated description if available
                      const aiDescription = aiGeneratedPathway?.description || pathway?.description;
                      
                      if (aiDescription) {
                        return (
                          <p className="text-sm text-gray-300 leading-relaxed mb-8 text-center max-w-lg mx-auto">
                            {aiDescription}
                          </p>
                        );
                      }
                      
                      // Fallback to hardcoded description logic only if no AI description
                      if (scoreResult) {
                        const { displayPct, absPct, levels } = scoreResult;
                        const sortedPaths = Object.entries(absPct)
                          .sort((a, b) => b[1] - a[1]);
                        const primary = sortedPaths[0];
                        const secondary = sortedPaths[1];
                        const stage = responses['stage-level'];
                        
                        let description;
                        if (levels[primary[0]] === 'Core Focus' && levels[secondary[0]] === 'Strategic Secondary') {
                          description = `Your ${PATH_LABELS[primary[0]]} strength should lead your strategy, with your ${PATH_LABELS[secondary[0]]} skills as strategic support. This balance creates the fastest path to your vision.`;
                        } else if (levels[primary[0]] === 'Core Focus') {
                          description = `Your ${PATH_LABELS[primary[0]]} strength is your clear advantage. This is where you naturally excel and should invest most of your energy for ${stage} stage success.`;
                        } else {
                          description = `Your ${PATH_LABELS[primary[0]]} path shows the strongest potential. Start here to build clarity and momentum in your music career.`;
                        }
                        
                        return (
                          <p className="text-sm text-gray-300 leading-relaxed mb-8 text-center max-w-lg mx-auto">
                            {description}
                          </p>
                        );
                      }
                      
                      return null;
                    })()}
                  </div>
                  
                  {/* Full Fuzzy Score Display */}
                  {scoreResult && (
                    <div className="mb-8">
                      <UnifiedResultsV3 scoreResult={scoreResult} responses={responses} pathway={pathway} aiPathwayDetails={pathway?.pathwayDetails || aiGeneratedPathway?.pathwayDetails} />
                    </div>
                  )}
                  
                  {/* Enhanced CTA Button with Liquid Animation */}
                  <button
                    onClick={goNext}
                    className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#B91372]/30 hover:scale-105 text-white text-lg overflow-hidden transform-gpu"
                  >
                    {/* Animated liquid blobs with continuous movement */}
                    <div className="absolute inset-0 rounded-xl animate-liquid-rotate">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#1DD1A1] rounded-full filter blur-xl opacity-80 animate-liquid-blob" />
                      <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-[#B91372] rounded-full filter blur-xl opacity-80 animate-liquid-blob-reverse" />
                      <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#1DD1A1] rounded-full filter blur-lg opacity-60 animate-liquid-blob-slow" />
                      <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-[#B91372] rounded-full filter blur-lg opacity-50 animate-liquid-blob" style={{animationDelay: '1s'}} />
                      <div className="absolute bottom-1/3 left-1/3 w-18 h-18 bg-[#1DD1A1] rounded-full filter blur-lg opacity-55 animate-liquid-blob-reverse" style={{animationDelay: '2s'}} />
                    </div>
                    
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                    </div>
                    
                    <span className="relative z-10">See Full Roadmap</span>
                    <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}

      {screen === 'plan' && pathway && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20 overflow-y-auto">
          <div className="max-w-md w-full">
            <div className="animate-fadeIn">
              {/* Back button */}
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              
              {/* Main Content Container - matching email capture style */}
              <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden safari-fallback">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#1DD1A1]/20 to-transparent rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#B91372]/20 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
                  
                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full opacity-20"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Step Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
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
                  
                  {/* Step Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {currentStep + 1}
                      </div>
                      <span className="text-sm font-semibold text-white">Strategic Roadmap</span>
                    </div>
                    
                    {/* Artist's Path Badge */}
                    {(() => {
                      const rec = scoreResult?.recommendation;
                      const topPath = rec?.path || Object.entries(fuzzyScores || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
                      const topPathName = PATH_LABELS[topPath] || pathway.title || 'Your Path';
                      const topLabel = rec?.promoted ? 'Recommended Focus' : 'Core Focus';
                      
                      return (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22c55e]/20 rounded-full border border-[#22c55e]/30 mb-4">
                          <span className="text-lg">🏆</span>
                          <span className="text-sm font-semibold text-[#22c55e]">{topLabel}: {topPathName}</span>
                        </div>
                      );
                    })()}
                    
                    <h2 className="text-2xl font-bold mb-4 text-white">{pathway.steps[currentStep].title}</h2>
                  </div>
                  
                  {/* Why This Matters */}
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6 safari-fallback">
                    <h3 className="flex items-center gap-2 text-lg font-bold mb-3 text-white">
                      <Sparkles className="w-5 h-5 text-[#B91372]" />
                      Why This Matters
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{pathway.steps[currentStep].whyItMatters}</p>
                  </div>
                  
                  {/* Other Action Items */}
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6 safari-fallback">
                    <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-white">
                      <Target className="w-5 h-5 text-[#1DD1A1]" />
                      Other Action Items
                    </h3>
                    <div className="space-y-3">
                      {pathway.steps[currentStep].actions.map((action, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center text-xs font-medium text-white mt-0.5">
                            {index + 1}
                          </div>
                          <p className="flex-1 text-gray-300 text-sm leading-relaxed">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* HOME Resources */}
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8 safari-fallback">
                    <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-white">
                      <img 
                        src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
                        alt="HOME"
                        className="h-5 w-auto"
                      />
                      HOME Resources
                    </h3>
                    <div className="space-y-2">
                      {(() => {
                        // ALWAYS show exactly 3 resources per step
                        const allResources = pathway?.resources || [];
                        
                        if (allResources.length === 0) {
                          return [];
                        }
                        
                        // Generate exactly 3 UNIQUE resources for this step
                        const stepResources = [];
                        const usedIndices = new Set();
                        
                        for (let i = 0; i < 3; i++) {
                          let resourceIndex;
                          let attempts = 0;
                          
                          // Find a unique resource index for this position
                          do {
                            resourceIndex = (currentStep + i * 4 + attempts) % allResources.length;
                            attempts++;
                          } while (usedIndices.has(resourceIndex) && attempts < allResources.length);
                          
                          usedIndices.add(resourceIndex);
                          stepResources.push(allResources[resourceIndex]);
                        }
                        
                        return stepResources;
                      })().map((resource, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-3 backdrop-blur border border-white/10">
                          <p className="text-sm font-medium text-white">{resource}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Navigation Button */}
                  <button
                    onClick={goNext}
                    className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#B91372]/30 hover:scale-105 text-white text-lg overflow-hidden transform-gpu"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* 3D Liquid layers */}
                    <div className="absolute inset-0 rounded-2xl" style={{ transform: 'translateZ(-10px)' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl" />
                    </div>
                    
                    {/* Animated liquid blobs */}
                    <div className="absolute inset-0 rounded-2xl animate-liquid-rotate" style={{ transform: 'translateZ(-5px)' }}>
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#1DD1A1] rounded-full filter blur-xl opacity-80 animate-liquid-blob" />
                        <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-[#B91372] rounded-full filter blur-xl opacity-80 animate-liquid-blob-reverse" />
                        <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-[#1DD1A1] rounded-full filter blur-lg opacity-60 animate-liquid-blob-slow" />
                        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-[#B91372] rounded-full filter blur-lg opacity-50 animate-liquid-blob" style={{animationDelay: '1s'}} />
                        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-[#1DD1A1] rounded-full filter blur-lg opacity-55 animate-liquid-blob-reverse" style={{animationDelay: '2s'}} />
                      </div>
                    </div>
                    
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 rounded-2xl" style={{ transform: 'translateZ(0px)' }} />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ transform: 'translateZ(1px)' }}>
                      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                    </div>
                    
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" style={{ transform: 'translateZ(-15px)' }} />
                    
                    <span className="relative z-10" style={{ transform: 'translateZ(10px)' }}>{currentStep < 3 ? 'Next Step' : 'Execute Roadmap'}</span>
                    <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ transform: 'translateZ(10px)' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'execute' && pathway && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
          <div className="max-w-md w-full">
            <div className="animate-fadeIn">
              {/* Back button */}
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              
              {/* Header badge */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
                  <Rocket className="w-4 h-4 text-[#1DD1A1]" />
                  <span className="text-sm font-semibold text-white">Execute Your Roadmap</span>
                </div>
                
                <h1 className="text-2xl font-bold mb-4 text-white">Ready to Accelerate?</h1>
                <p className="text-sm text-gray-300 mb-8">Choose how you want to start your journey with HOME</p>
              </div>
              
              {/* Complete Roadmap Package */}
              <div className="bg-black/80 backdrop-blur-sm rounded-3xl border border-white/10 p-6 mb-6 safari-fallback">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1DD1A1]/20 to-[#B91372]/20 rounded-full flex items-center justify-center">
                      <ListChecks className="w-6 h-6 text-[#1DD1A1]" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 text-white">Get Your Complete Roadmap</h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-lg text-gray-400 line-through">$50</span>
                      <span className="text-2xl font-bold text-[#1DD1A1]">Included</span>
                    </div>
                  </div>
                  
                  <div className="text-left space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">📊 Your Complete Strategic Roadmap</h4>
                      <ul className="space-y-1 text-sm text-gray-300 ml-4">
                        <li>• Full roadmap breakdown with detailed action items</li>
                        <li>• HOME resources perfectly matched to your pathway</li>
                        <li>• Top 10 companies you should have on your radar</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">🎨 Bonus: Artists Branding Playbook</h4>
                      <p className="text-sm text-gray-300 ml-4">8-part comprehensive guide to building your artistic identity</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">🚀 Bonus: Successful Music Release Playbook</h4>
                      <p className="text-sm text-gray-300 ml-4">6-part step-by-step release strategy that works</p>
                    </div>
                  </div>
                  
                  <LiquidButton
                    onClick={() => setScreen('survey')}
                    className="w-full"
                  >
                    Join Music Tech Bootcamp →
                  </LiquidButton>
                  
                  <p className="text-xs text-gray-400 mt-3">
                    Share your music tech idea and join our innovation community
                  </p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="text-center space-y-2">
                <p className="text-gray-400 text-xs">
                  Have feedback or found an issue? 
                  <a 
                    href="https://github.com/anthropics/claude-code/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1DD1A1] hover:text-[#B91372] transition-colors ml-1"
                  >
                    Let us know
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bootcamp Registration Screen */}
      {screen === 'survey' && (
        <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
          <div className="max-w-2xl w-full">
            <div className="animate-fadeIn">
              {/* Back button */}
              <button
                onClick={() => setScreen('execute')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                  Music Tech Innovation
                  <span className="block bg-gradient-to-r from-[#1DD1A1] to-[#B91372] bg-clip-text text-transparent">
                    Bootcamp Registration
                  </span>
                </h1>
                <p className="text-lg text-gray-300 max-w-xl mx-auto">
                  Join our hub of tech innovators building the future of the music industry
                </p>
              </div>

              {/* Registration Form */}
              <div className="bg-black/80 backdrop-blur-sm rounded-3xl border border-white/10 p-8 safari-fallback">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Do you have an idea that will add value to the music industry using technology?
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Share your vision and join a community of builders, creators, and innovators working to revolutionize how music gets made, distributed, and experienced.
                  </p>
                </div>

                {/* Email Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-[#1DD1A1] focus:outline-none"
                    required
                  />
                </div>

                {/* Idea Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Describe your music tech idea *
                  </label>
                  <textarea
                    value={surveyResponses.techIdea || ''}
                    onChange={(e) => {
                      setSurveyResponses(prev => ({
                        ...prev,
                        techIdea: e.target.value
                      }));
                    }}
                    placeholder="What problem are you solving? How will technology help? What's your vision for the future of music?"
                    rows={6}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-[#1DD1A1] focus:outline-none resize-none"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Be as detailed as you'd like - this helps us understand your vision and connect you with the right people
                  </p>
                </div>

                {/* Experience Level */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What's your technical background?
                  </label>
                  <select
                    value={surveyResponses.techBackground || ''}
                    onChange={(e) => {
                      setSurveyResponses(prev => ({
                        ...prev,
                        techBackground: e.target.value
                      }));
                    }}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-[#1DD1A1] focus:outline-none"
                  >
                    <option value="">Select your background...</option>
                    <option value="developer">Software Developer/Engineer</option>
                    <option value="designer">UX/UI Designer</option>
                    <option value="product">Product Manager</option>
                    <option value="entrepreneur">Entrepreneur/Founder</option>
                    <option value="musician-tech">Musician with tech skills</option>
                    <option value="student">Student (CS/Engineering/Design)</option>
                    <option value="business">Business/Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                  <button
                    onClick={async () => {
                      if (!email || !surveyResponses.techIdea) {
                        alert('Please fill in your email and tech idea description');
                        return;
                      }
                      
                      try {
                        // Submit to API
                        const response = await fetch('/api/submit-bootcamp-registration', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email,
                            techIdea: surveyResponses.techIdea,
                            techBackground: surveyResponses.techBackground || 'not specified'
                          })
                        });

                        if (response.ok) {
                          // Show success message
                          setScreen('bootcamp-success');
                        } else {
                          alert('Registration failed. Please try again.');
                        }
                      } catch (error) {
                        console.error('Registration error:', error);
                        alert('Registration failed. Please try again.');
                      }
                    }}
                    disabled={!email || !surveyResponses.techIdea}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1DD1A1]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join the Music Tech Innovation Hub
                  </button>
                  
                  <p className="text-xs text-gray-400 mt-4">
                    We'll review your submission and get back to you with next steps for joining our community of music tech innovators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bootcamp Success Screen */}
      {screen === 'bootcamp-success' && (
        <div className="screen-height bg-black flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="animate-fadeIn">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Registration Submitted!
                </h1>
                <p className="text-gray-300 leading-relaxed">
                  Thank you for sharing your music tech vision with us. We'll review your idea and get back to you soon with information about joining our innovation community.
                </p>
              </div>
              
              <button
                onClick={() => setScreen('landing')}
                className="px-6 py-3 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white rounded-xl hover:shadow-lg hover:shadow-[#1DD1A1]/20 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HOMEQuizMVP;
