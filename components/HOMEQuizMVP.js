import React, { useState, useEffect } from 'react';
import { ChevronRight, Home, Mail, ArrowRight, Check, Users, Star, Loader, ChevronLeft, MapPin, UserCheck, ListChecks } from 'lucide-react';

// --- Data (Should be outside component to prevent re-creation on re-renders) ---

const questions = [
    { id: 'motivation', question: "What drives your music career ambitions?", options: [ { value: 'live-performance', label: 'The energy of a live audience and performing music from the stage' }, { value: 'artistic-expression', label: 'Artistic expression through recording music and building a loyal following online' }, { value: 'collaboration', label: 'Making great songs and collaborating with other talented creators' } ] },
    { id: 'ideal-day', question: "Describe your ideal workday as a music professional:", options: [ { value: 'performing-travel', label: 'Traveling to a new city to perform for a live audience' }, { value: 'releasing-music', label: 'Releasing a new song that you are really proud of' }, { value: 'writing-creating', label: 'Writing the best song that you have ever written' } ] },
    { id: 'success-vision', question: "When you imagine success 5 years from now, you see yourself:", options: [ { value: 'touring-headliner', label: 'Headlining major tours and playing sold out shows around the world' }, { value: 'passive-income-artist', label: 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions' }, { value: 'hit-songwriter', label: 'Having multiple major hit songs that you collaborated on and earning \'mailbox money\' through sync placements and other royalty streams' } ] },
    { id: 'current-stage', question: "Which best describes your current stage?", options: [ { value: 'planning', label: 'Planning Stage - Figuring out my path and building foundations' }, { value: 'production', label: 'Production Stage - Actively creating and releasing work' }, { value: 'scale', label: 'Scale Stage - Already making the majority of my income from music and looking to grow my business' } ] },
    { id: 'biggest-challenge', question: "What's the biggest thing holding your music journey back right now?", options: [ { value: 'performance-opportunities', label: 'I need more opportunities to perform and grow my live audience' }, { value: 'brand-audience', label: 'I\'m creating great content, but struggle to build a consistent brand and online audience' }, { value: 'collaboration-income', label: 'I work behind the scenes, but need better access to collaborators, placements, and consistent income' } ] }
];

const expandedStepContent = {
    'touring-performer': [
        { title: "Build Your Signature Live Set", description: "Create a powerful performance that captivates audiences and leaves them wanting more", actions: ["Map out a 45-minute setlist with emotional peaks and valleys", "Record live rehearsal videos to analyze your stage presence", "Design smooth transitions between songs with stories or audience interaction", "Practice your set 3x this week in HOME's rehearsal space", "Get feedback from 5 fellow musicians on your performance energy"], whyItMatters: "A killer live set is your #1 tool for winning over new fans and booking better gigs. This is where you transform from someone who plays songs to an artist who creates experiences.", homeResources: ["24/7 Rehearsal Facility Access", "Performance Coaching Sessions", "Monthly Open Mics for Testing"] },
        { title: "Master Your Stage Presence", description: "Develop the confidence and charisma that makes audiences remember you", actions: ["Film yourself performing and identify 3 movements that feel authentic", "Study 5 favorite performers and note their engagement techniques", "Practice talking between songs - write out 3 compelling stories", "Work with HOME's performance coach for personalized feedback", "Perform at 2 local venues this month to build confidence"], whyItMatters: "Great songs are only half the equation. Your stage presence determines whether people become fans or forget you. This skill directly impacts your booking fees and fan loyalty.", homeResources: ["Stage Presence Workshops", "Video Review Sessions", "Performance Psychology Training"] },
        { title: "Create Your Professional EPK", description: "Build a booking package that gets venue owners and agents to say YES", actions: ["Shoot high-quality live performance videos (3-4 songs)", "Write a compelling artist bio that tells your story in 150 words", "Gather professional photos from recent shows", "Create a one-page PDF with all booking essentials", "Build a simple EPK website using HOME's templates"], whyItMatters: "Your EPK is often your only shot at landing bigger gigs. A professional package can be the difference between $200 bar gigs and $2,000 festival slots.", homeResources: ["EPK Templates & Examples", "Professional Photography Sessions", "Copywriting Support"] },
        { title: "Book Your Next 10 Shows", description: "Build momentum with a strategic booking plan that grows your fanbase", actions: ["Research 20 venues that fit your genre and draw", "Send personalized booking emails using HOME's proven templates", "Follow up with 5 venues every week until booked", "Network at HOME showcases to meet booking agents", "Create a touring route that makes financial sense"], whyItMatters: "Consistent gigging builds your reputation, income, and fanbase faster than anything else. This systematic approach removes the guesswork from booking.", homeResources: ["Venue Database Access", "Booking Email Templates", "Agent Networking Events"] }
    ],
    'creative-artist': [
        { title: "Define Your Unique Artist Brand", description: "Discover and articulate what makes you different from every other artist", actions: ["Complete HOME's Brand Discovery Worksheet to find your core values", "Create a mood board with 20 images that represent your vibe", "Write your artist mission statement in one powerful sentence", "Choose 3 primary colors and 2 fonts for visual consistency", "Design your logo or wordmark with HOME's design tools"], whyItMatters: "A clear brand helps you stand out in a sea of content. When fans can recognize your content instantly, they're more likely to engage, share, and buy.", homeResources: ["Brand Development Workshop", "Design Software Access", "1-on-1 Brand Coaching"] },
        { title: "Launch Your Content Strategy", description: "Build a sustainable system for creating content that grows your audience", actions: ["Choose 3 content pillars (music, behind-scenes, lifestyle)", "Batch create 30 pieces of content in HOME's studios", "Set up scheduling tools to post consistently", "Start a weekly series that fans anticipate", "Track metrics to see what resonates with your audience"], whyItMatters: "Consistency beats perfection. A strategic content plan keeps you visible and helps the algorithm work in your favor, leading to exponential growth.", homeResources: ["Content Creation Studios", "Social Media Templates", "Analytics Training"] },
        { title: "Build Revenue Streams", description: "Create multiple income sources beyond just streaming royalties", actions: ["Design 3 merchandise items that reflect your brand", "Set up fan subscription tiers with exclusive content", "Launch print-on-demand store with zero upfront costs", "Create sample packs or presets for producers", "Partner with brands aligned with your values"], whyItMatters: "Diversified income = creative freedom. When you're not dependent on one revenue source, you can take bigger artistic risks and weather industry changes.", homeResources: ["Merch Design Tools", "E-commerce Setup Support", "Revenue Strategy Sessions"] },
        { title: "Grow Your Engaged Community", description: "Transform casual listeners into a loyal fanbase that supports your journey", actions: ["Start email list with lead magnet (free song, samples)", "Host monthly livestreams for your core fans", "Create fan-generated content campaigns", "Launch a Discord or community space", "Personally respond to DMs for 30 minutes daily"], whyItMatters: "1,000 true fans who spend $100/year = $100,000. Building genuine connections creates sustainable success that algorithms can't take away.", homeResources: ["Community Building Playbook", "Email Marketing Tools", "Fan Engagement Workshop"] }
    ],
    'writer-producer': [
        { title: "Master Your Production Craft", description: "Develop the technical skills that make artists want to work with you", actions: ["Complete one new production technique tutorial daily", "Recreate 5 hit songs in your genre to understand their structure", "Build a template library for fast, professional workflows", "Master HOME's studio equipment through hands-on practice", "Get feedback on mixes from established producers in community"], whyItMatters: "Technical excellence opens doors. When artists trust your skills, they recommend you to others, creating a snowball effect of opportunities.", homeResources: ["Pro Studio Access 24/7", "Production Masterclasses", "Mixing/Mastering Workshops"] },
        { title: "Build Your Producer Portfolio", description: "Showcase your versatility and unique sound across multiple genres", actions: ["Produce 10 diverse tracks showcasing your range", "Collaborate with 5 HOME artists on different projects", "Create before/after demos showing your production value", "Build a professional website with easy listening experience", "Share one production tip weekly to establish expertise"], whyItMatters: "Your portfolio is your calling card. A strong showcase leads to better clients, higher rates, and the ability to choose projects you're passionate about.", homeResources: ["Artist Collaboration Board", "Portfolio Website Templates", "Production Showcase Events"] },
        { title: "Network with Industry Players", description: "Build relationships that lead to consistent work and bigger opportunities", actions: ["Attend HOME's monthly producer meetups", "Reach out to 3 artists weekly with collaboration ideas", "Connect with music supervisors through HOME's network", "Join sync licensing platforms with your best work", "Offer one free production monthly to build relationships"], whyItMatters: "The music industry runs on relationships. Your network determines your net worth - one connection can change your entire career trajectory.", homeResources: ["Industry Networking Events", "A&R Connections", "Sync Licensing Workshop"] },
        { title: "Setup Your Business Systems", description: "Create the infrastructure for sustainable income and growth", actions: ["Register your publishing company and PRO membership", "Create contract templates for different project types", "Set up invoicing and payment systems", "Build packages and rate cards for your services", "Learn split sheets and copyright essentials at HOME"], whyItMatters: "Talent without business knowledge leads to exploitation. These systems ensure you get paid fairly and build long-term wealth from your creativity.", homeResources: ["Music Business Course", "Legal Templates", "Publishing Administration Support"] }
    ]
};

const getExpandedStepContent = (pathway, stepIndex) => {
    if (!pathway) return null;
    const pathwayKey = pathway.toLowerCase().includes('touring') ? 'touring-performer' :
                      pathway.toLowerCase().includes('creative') ? 'creative-artist' : 
                      'writer-producer';
    return expandedStepContent[pathwayKey]?.[stepIndex] || null;
};

// --- Main App Component ---

const HOMEQuizMVP = () => {
  const [currentScreen, setCurrentScreen] = useState('landing'); // landing, quiz, transition, email, results
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [resultStep, setResultStep] = useState(0);
  const [animationDirection, setAnimationDirection] = useState('forward');

  const questionIDs = questions.map(q => q.id);

  const handleResponse = (questionId, value) => {
    setAnimationDirection('forward');
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);
    
    const currentIndex = questionIDs.indexOf(questionId);
    if (currentIndex < questions.length - 1) {
      setQuestionIndex(currentIndex + 1);
    } else {
      setCurrentScreen('transition');
      setTimeout(() => setCurrentScreen('email'), 1500);
    }
  };

  const handleBack = () => {
    setAnimationDirection('backward');
    if (currentScreen === 'quiz' && questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else if (currentScreen === 'quiz' && questionIndex === 0) {
      setCurrentScreen('landing');
    } else if (currentScreen === 'email') {
      setCurrentScreen('quiz');
    } else if (currentScreen === 'results' && resultStep > 0) {
      setResultStep(resultStep - 1);
    } else if (currentScreen === 'results' && resultStep === 0) {
      setCurrentScreen('email');
    }
  };
  
  const handleNext = () => {
      setAnimationDirection('forward');
      if (currentScreen === 'results' && resultStep < 5) {
          setResultStep(resultStep + 1);
      }
  }

  const handleEmailSubmit = async () => {
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setAnimationDirection('forward');

    // Simulate API calls for now
    const dummyResult = {
        title: 'The Touring Performer Path',
        icon: '🎤',
        description: 'You thrive on stage energy and live connections. Your priority is building a powerful live presence and growing your touring opportunities. This means focusing on your craft as a live act, creating an unforgettable show, and strategically booking gigs that expand your audience and income.',
    };
    setAiResult(dummyResult);
    
    setTimeout(() => {
        setIsSubmitting(false);
        setCurrentScreen('results');
        setResultStep(0);
    }, 1500);
  };

  const startQuiz = () => {
    setAnimationDirection('forward');
    setCurrentScreen('quiz');
    setQuestionIndex(0);
  };
  
  const resetQuiz = () => {
      setCurrentScreen('landing');
      setQuestionIndex(0);
      setResponses({});
      setAiResult(null);
      setEmail('');
      setResultStep(0);
  }

  const getMasterStage = () => {
    if (currentScreen === 'quiz') return 1;
    if (currentScreen === 'transition' || currentScreen === 'email') return 2;
    if (currentScreen === 'results' && resultStep >= 0 && resultStep < 5) return 3;
    if (currentScreen === 'results' && resultStep === 5) return 4;
    return 0;
  };
  const masterStage = getMasterStage();

  if (currentScreen === 'landing') {
    return <LandingPage onStartQuiz={startQuiz} />;
  }

  return (
    <JourneyLayout masterStage={masterStage} resultStep={resultStep} onBack={handleBack} onNext={handleNext} currentScreen={currentScreen}>
      <AnimatedContent key={currentScreen + questionIndex + resultStep} direction={animationDirection}>
        {currentScreen === 'quiz' && <QuestionPage question={questions[questionIndex]} onResponse={handleResponse} questionIndex={questionIndex} totalQuestions={questions.length} />}
        {currentScreen === 'transition' && <TransitionPage icon={<Loader className="animate-spin" />} title="Fantastic." subtitle="Analyzing your responses to pinpoint your place on the roadmap..." />}
        {currentScreen === 'email' && <EmailCapturePage email={email} setEmail={setEmail} onSubmit={handleEmailSubmit} isSubmitting={isSubmitting} />}
        {currentScreen === 'results' && aiResult && (
            <>
              {resultStep === 0 && <ResultsLandingPage aiResult={aiResult} onBegin={() => { setAnimationDirection('forward'); setResultStep(1); }} />}
              {resultStep > 0 && resultStep < 5 && <StepPage stepIndex={resultStep - 1} aiResult={aiResult} />}
              {resultStep === 5 && <FinalPage responses={responses} aiResult={aiResult} onReset={resetQuiz} />}
            </>
        )}
      </AnimatedContent>
    </JourneyLayout>
  );
};

// --- Sub-Components ---

const Confetti = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
            {[...Array(50)].map((_, i) => {
                const style = {
                    left: `${Math.random() * 100}%`,
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    animation: `confetti-fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear infinite`,
                    transform: `rotate(${Math.random() * 360}deg)`
                };
                return <div key={i} className="confetti-piece" style={style}></div>
            })}
        </div>
    );
};

const JourneyLayout = ({ children, masterStage, resultStep, onBack, onNext, currentScreen }) => {
    const stageTitles = ["Identify Your Path", "Personalized Path", "Personalized Plan", "Execute Plan"];
    const showBackButton = (currentScreen === 'quiz' && true) || (currentScreen === 'email') || (currentScreen === 'results');
    const showNextButton = currentScreen === 'results' && resultStep > 0 && resultStep < 4;
    const showFinalPlanButton = currentScreen === 'results' && resultStep === 4;

    const progressPercentage = masterStage > 1 ? ((masterStage - 2) / (stageTitles.length - 2)) * 100 + ((masterStage - 1) > 0 ? (1/(stageTitles.length-1)/2)*100 : 0) : 0;

    return (
        <div className="min-h-[100svh] bg-gray-50 flex flex-col" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <style jsx global>{`
                .animate-on-load.forward { animation: slideInForward 0.5s cubic-bezier(0.45, 0, 0.55, 1); }
                .animate-on-load.backward { animation: slideInBackward 0.5s cubic-bezier(0.45, 0, 0.55, 1); }
                @keyframes slideInForward { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideInBackward { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                .confetti-piece { position: absolute; width: 8px; height: 16px; opacity: 0; }
                @keyframes confetti-fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
            `}</style>
            <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-20 shadow-sm pt-3 pb-2">
                <div className="container max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-between relative mb-2">
                        {stageTitles.map((title, i) => (
                            <div key={i} className={`text-center transition-all duration-500 z-10 ${masterStage >= i + 1 ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                                <div className={`mx-auto mb-1 w-8 h-8 text-sm rounded-full flex items-center justify-center transition-all duration-500 font-bold border-2 ${masterStage >= i + 1 ? 'bg-white border-gray-900' : 'bg-gray-200 border-gray-300'}`}>{i + 1}</div>
                                <div className="text-xs hidden sm:block">{title}</div>
                            </div>
                        ))}
                        <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10"><div className="h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div>
                    </div>
                    {masterStage === 3 && (
                        <div className="mt-2 flex justify-around items-center border-t pt-2">
                            {[...Array(4)].map((_, i) => (<div key={i} className={`text-xs font-semibold p-1 rounded transition-all duration-300 ${resultStep === i + 1 ? 'text-white bg-[#147f73]' : 'text-gray-500'}`}>Step {i + 1}</div>))}
                        </div>
                    )}
                </div>
            </header>
            <main className="flex-grow w-full relative overflow-hidden">{children}</main>
            <footer className="sticky bottom-0 bg-white/90 backdrop-blur-sm z-20 border-t border-gray-200">
                <div className="container max-w-4xl mx-auto px-6 py-3 flex justify-between items-center h-16">
                    <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium flex items-center transition-opacity duration-300 disabled:opacity-0" disabled={!showBackButton}><ChevronLeft className="w-5 h-5 mr-1" /> Back</button>
                    <button onClick={onNext} className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center" style={{ opacity: showNextButton ? 1 : 0, pointerEvents: showNextButton ? 'auto' : 'none' }}>Next Step <ChevronRight className="w-5 h-5 ml-2" /></button>
                    {showFinalPlanButton && (<button onClick={onNext} className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center">Execute My Personalized Plan <ChevronRight className="w-5 h-5 ml-2" /></button>)}
                </div>
            </footer>
        </div>
    );
};

const AnimatedContent = ({ children, direction }) => {
    return (<div className={`absolute inset-0 p-4 ${direction}`}>{children}</div>);
};

const LandingPage = ({ onStartQuiz }) => ( /* ... same as before ... */ );

const QuestionPage = ({ question, onResponse, questionIndex, totalQuestions }) => (
    <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xl">
                 <p className="text-center text-sm font-semibold text-[#1DD1A1] mb-4">Question {questionIndex + 1} of {totalQuestions}</p>
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center leading-tight">{question.question}</h2>
                <div className="space-y-4">
                    {question.options.map((option) => (
                        <button key={option.value} onClick={() => onResponse(question.id, option.value)} className="w-full p-4 md:p-6 text-left rounded-xl border-2 border-gray-200 group cursor-pointer transition-all duration-300 hover:border-[#1DD1A1] hover:shadow-md hover:-translate-y-1 bg-gray-50">
                            <div className="flex items-center justify-between"><span className="text-gray-900 leading-relaxed text-sm md:text-base">{option.label}</span><div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-[#1DD1A1] flex items-center justify-center transition-all duration-300"><Check className="w-4 h-4 text-white" /></div></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const TransitionPage = ({icon, title, subtitle}) => ( /* ... same as before ... */ );

const EmailCapturePage = ({ email, setEmail, onSubmit, isSubmitting }) => (
    <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Your Path is Ready!</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">Enter your email to instantly unlock your personalized plan.</p>
            <div className="bg-white border-2 rounded-2xl p-6 md:p-8 shadow-xl" style={{ borderColor: '#1DD1A1' }}>
                <div className="mb-6">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full px-4 py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] text-lg mb-4"/>
                    <button onClick={onSubmit} disabled={!email || isSubmitting} className="w-full text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 hover:opacity-90 text-lg flex items-center justify-center" style={{ backgroundColor: '#B91372' }}>
                        {isSubmitting ? (<><Loader className="w-5 h-5 mr-2 animate-spin" />Unlocking...</>) : (<>Get My Personalized Plan</>)}
                    </button>
                </div>
                <p className="text-sm text-gray-500">We'll email your results as well. No spam, ever.</p>
            </div>
        </div>
    </div>
);

const ResultsLandingPage = ({ aiResult, onBegin }) => {
    return (
        <div className="h-full flex items-center justify-center relative">
            <Confetti />
            <div className="text-center bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl">
                <div className="inline-block bg-gradient-to-br from-[#1DD1A1] to-[#B91372] text-white p-6 rounded-3xl mb-6 shadow-lg">
                    <div className="text-5xl md:text-6xl">{aiResult.icon}</div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{aiResult.title}</h1>
                <p className="text-lg text-gray-600 mb-6">This is your personalized path forward.</p>
                <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left border">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Your Starting Point on the Path:</h3>
                    <p className="text-gray-600 leading-relaxed">{aiResult.description}</p>
                </div>
                <button onClick={onBegin} className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center">
                    Continue Your Journey <ChevronRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

const StepPage = ({ stepIndex, aiResult }) => { /* ... same as before, with interpolateColor logic ... */ };
const FinalPage = ({ responses, aiResult, onReset }) => { /* ... same as before, with updated titles ... */ };

// Dummy components for brevity - replace with full versions from previous answer
// For the final code, these definitions need to be complete.
LandingPage.defaultProps = { onStartQuiz: () => {} };
TransitionPage.defaultProps = { icon: <Loader/>, title: "", subtitle: ""};
StepPage.defaultProps = { stepIndex: 0, aiResult: {title: ''}, getExpandedStepContent: () => {} };
FinalPage.defaultProps = { responses: {}, aiResult: {title: ''}, onReset: () => {} };


export default HOMEQuizMVP;
