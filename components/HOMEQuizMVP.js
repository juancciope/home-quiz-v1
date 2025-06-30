import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Loader, ChevronLeft, MapPin, UserCheck, ListChecks, Check, Sparkles, Trophy, Target, Rocket, Home } from 'lucide-react';

// --- Data ---
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
    ],
    'writer-producer': [
        { title: "Master Your Production Craft", description: "Develop the technical skills that make artists want to work with you", actions: ["Complete one new production technique tutorial daily", "Recreate 5 hit songs in your genre to understand their structure", "Build a template library for fast, professional workflows", "Master HOME's studio equipment through hands-on practice", "Get feedback on mixes from established producers in community"], whyItMatters: "Technical excellence opens doors. When artists trust your skills, they recommend you to others, creating a snowball effect of opportunities.", homeResources: ["Pro Studio Access 24/7", "Production Masterclasses", "Mixing/Mastering Workshops"] },
    ]
};

const getExpandedStepContent = (pathway, stepIndex) => {
    if (!pathway) return null;
    const pathwayKey = pathway.toLowerCase().includes('touring') ? 'touring-performer' : 'creative-artist';
    return expandedStepContent[pathwayKey]?.[stepIndex] || null;
};

// --- Main App Component ---

const HOMEQuizMVP = () => {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [resultStep, setResultStep] = useState(0);
  const [animationDirection, setAnimationDirection] = useState('forward');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleResponse = (questionId, value) => {
    setAnimationDirection('forward');
    setResponses(prev => ({ ...prev, [questionId]: value }));
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setCurrentScreen('transition');
      setTimeout(() => setCurrentScreen('email'), 1500);
    }
  };

  const handleBack = () => {
    setAnimationDirection('backward');
    if (currentScreen === 'quiz' && questionIndex > 0) setQuestionIndex(prev => prev - 1);
    else if (currentScreen === 'quiz' && questionIndex === 0) setCurrentScreen('landing');
    else if (currentScreen === 'email') setCurrentScreen('quiz');
    else if (currentScreen === 'results' && resultStep > 0) setResultStep(prev => prev - 1);
    else if (currentScreen === 'results' && resultStep === 0) setCurrentScreen('email');
  };
  
  const handleNext = () => {
    setAnimationDirection('forward');
    if (currentScreen === 'results' && resultStep < 5) setResultStep(prev => prev + 1);
  }

  const handleEmailSubmit = async () => {
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setAnimationDirection('forward');
    const dummyResult = {
        title: 'The Touring Performer Path', icon: '🎤',
        description: 'You thrive on stage energy and live connections. Your priority is building a powerful live presence and growing your touring opportunities. This means focusing on your craft as a live act, creating an unforgettable show, and strategically booking gigs that expand your audience and income.',
    };
    setAiResult(dummyResult);
    setTimeout(() => { 
      setIsSubmitting(false); 
      setCurrentScreen('results'); 
      setResultStep(0); 
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 1500);
  };

  const startQuiz = () => { setAnimationDirection('forward'); setCurrentScreen('quiz'); };
  
  const resetQuiz = () => {
      setCurrentScreen('landing');
      setQuestionIndex(0);
      setResponses({});
      setAiResult(null);
      setEmail('');
      setResultStep(0);
  };

  const getMasterStage = () => {
    if (currentScreen === 'quiz') return 1;
    if (currentScreen === 'transition' || currentScreen === 'email') return 2;
    if (currentScreen === 'results' && resultStep < 5) return 3;
    if (currentScreen === 'results' && resultStep === 5) return 4;
    return 0;
  };

  if (currentScreen === 'landing') return <LandingPage onStartQuiz={startQuiz} />;

  const stage = getMasterStage();
  const screenKey = `${currentScreen}-${questionIndex}-${resultStep}`;

  return (
    <JourneyLayout masterStage={stage} resultStep={resultStep} onBack={handleBack} onNext={handleNext} currentScreen={currentScreen} questionIndex={questionIndex}>
        <AnimatedContent key={screenKey} direction={animationDirection}>
            {currentScreen === 'quiz' && <QuestionPage question={questions[questionIndex]} onResponse={handleResponse} questionIndex={questionIndex} totalQuestions={questions.length} />}
            {currentScreen === 'transition' && <TransitionPage icon={<Sparkles className="animate-pulse" />} title="Analyzing Your Path..." subtitle="We're mapping your unique journey" />}
            {currentScreen === 'email' && <EmailCapturePage email={email} setEmail={setEmail} onSubmit={handleEmailSubmit} isSubmitting={isSubmitting} />}
            {currentScreen === 'results' && aiResult && (
                <>
                  {resultStep === 0 && <ResultsLandingPage aiResult={aiResult} onBegin={() => { setAnimationDirection('forward'); setResultStep(1); }} showConfetti={showConfetti} />}
                  {resultStep > 0 && resultStep < 5 && <StepPage stepIndex={resultStep - 1} aiResult={aiResult} />}
                  {resultStep === 5 && <FinalPage responses={responses} aiResult={aiResult} onReset={resetQuiz} />}
                </>
            )}
        </AnimatedContent>
    </JourneyLayout>
  );
};

// --- Sub-Components ---
const Confetti = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {[...Array(60)].map((_, i) => {
        const colors = ['#1DD1A1', '#B91372', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B'];
        const style = {
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `-10%`,
          width: `${8 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 8}px`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          animation: `confetti-fall ${3 + Math.random() * 3}s ${Math.random() * 2}s linear infinite`,
          transform: `rotate(${Math.random() * 360}deg)`,
        };
        return <div key={i} style={style}></div>;
      })}
    </div>
  );
};

const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
    }
    return `rgb(${result.join(',')})`;
};

const JourneyLayout = ({ children, masterStage, resultStep, onBack, onNext, currentScreen, questionIndex }) => {
    const stages = [
        { id: 1, title: "Identify Your Path", icon: <Target className="w-4 h-4" /> },
        { id: 2, title: "Personalized Path", icon: <MapPin className="w-4 h-4" /> },
        { id: 3, title: "Personalized Plan", icon: <ListChecks className="w-4 h-4" /> },
        { id: 4, title: "Execute Plan", icon: <Rocket className="w-4 h-4" /> }
    ];
    
    const showBackButton = (currentScreen === 'quiz' && true) || (currentScreen === 'email') || (currentScreen === 'results');
    const showNextButton = currentScreen === 'results' && resultStep > 0 && resultStep < 4;
    const showFinalPlanButton = currentScreen === 'results' && resultStep === 4;
    
    const color1 = [29, 209, 161]; // #1DD1A1
    const color2 = [185, 19, 114]; // #B91372
    
    return (
        <div className="h-[100svh] bg-gray-50 flex flex-col" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <style jsx global>{`
                .animate-on-load.forward { animation: slideInForward 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-on-load.backward { animation: slideInBackward 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes slideInForward { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideInBackward { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            
            <header className="flex-shrink-0 bg-white/95 backdrop-blur-sm z-20 shadow-sm pt-3 pb-2">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="flex items-start justify-between relative mb-2 text-center">
                        {stages.map((stage, i) => {
                            const isActive = masterStage === stage.id;
                            const isCompleted = masterStage > stage.id;
                            const stageColor = interpolateColor(color1, color2, (stage.id - 1) / 3);
                            return (
                                <div key={stage.id} className={`flex-1 transition-all duration-500 z-10 ${masterStage >= stage.id ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                                    <div className={`mx-auto mb-1 w-8 h-8 text-sm rounded-full flex items-center justify-center transition-all duration-500 font-bold border-2 ${isActive ? 'scale-110' : ''}`}
                                    style={{
                                        borderColor: isActive ? stageColor : isCompleted ? stageColor : '#d1d5db',
                                        backgroundColor: isCompleted ? stageColor : 'white',
                                        color: isCompleted ? 'white' : isActive ? stageColor : '#a0aec0'
                                    }}
                                    >{isCompleted ? <Check className="w-4 h-4"/> : stage.id}</div>
                                    <div className="text-[10px] leading-tight sm:text-xs">{stage.title}</div>
                                </div>
                            )
                        })}
                         <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10">
                            <div className="h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-500" style={{ width: `calc(${((masterStage - 1) / 3) * 100}% - 2rem)` }}></div>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow overflow-y-auto">{children}</main>
            
            <footer className="flex-shrink-0 bg-white border-t mt-auto">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={onBack} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${showBackButton ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'invisible'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        
                        <div className="text-center text-sm text-gray-500">
                            {currentScreen === 'quiz' && `Question ${questionIndex + 1} of ${questions.length}`}
                            {currentScreen === 'results' && resultStep > 0 && resultStep < 5 && `Action Step ${resultStep} of 4`}
                        </div>
                        
                        {showNextButton && (
                            <button 
                                onClick={onNext} 
                                className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Next Step <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                        {showFinalPlanButton && (
                            <button 
                                onClick={onNext} 
                                className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Execute Plan <Rocket className="w-5 h-5" />
                            </button>
                        )}
                        {!showNextButton && !showFinalPlanButton && (
                            <div className="w-24" /> 
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};

const AnimatedContent = ({ children, direction }) => (
    <div className={`h-full w-full p-4 md:p-8 flex items-center justify-center animate-on-load ${direction}`}>{children}</div>
);

const LandingPage = ({ onStartQuiz }) => (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto text-center">
                 <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-sm font-semibold text-gray-700 mb-6">
                        <Sparkles className="w-4 h-4" style={{ color: '#B91372' }} />
                        AI-Powered Music Career Guidance
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Find Your Path on the<br /><span style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Music Creator Roadmap</span></h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">Answer 5 simple questions and get your personalized action plan to build a sustainable music career</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 text-sm text-gray-600">
                    <div className="flex items-center"><Check className="w-5 h-5 mr-2 text-[#1DD1A1]" /><span>2-Minute Quiz</span></div>
                    <div className="flex items-center"><Check className="w-5 h-5 mr-2 text-[#1DD1A1]" /><span>Personalized Roadmap</span></div>
                    <div className="flex items-center"><Check className="w-5 h-5 mr-2 text-[#1DD1A1]" /><span>Actionable Steps</span></div>
                </div>
                <div className="mb-12">
                    <button onClick={onStartQuiz} className="group relative text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center gap-3 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)' }}>
                        <span className="relative z-10">Start Your Journey</span>
                        <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </button>
                    <p className="text-sm text-gray-500 mt-3">No email required to start • 100% free</p>
                </div>
                <img src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/685b3b45958e7f525884f62d.png" alt="HOME for Music" className="mx-auto mb-6" style={{ height: '70px', width: 'auto', maxWidth: '280px', objectFit: 'contain' }}/>
                <div className="flex items-center justify-center text-sm text-gray-500"><div className="flex text-yellow-400 mr-2">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-current" />))}</div>Trusted by 1,000+ music creators</div>
            </div>
        </div>
    </div>
);

const QuestionPage = ({ question, onResponse, questionIndex, totalQuestions }) => (
    <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-sm font-semibold mb-4">
                <Target className="w-4 h-4" style={{ color: '#1DD1A1' }} />
                Question {questionIndex + 1} of {totalQuestions}
            </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center leading-tight">{question.question}</h2>
            <div className="space-y-4">
                {question.options.map((option) => (
                    <button key={option.value} onClick={() => onResponse(question.id, option.value)} className="w-full p-5 text-left rounded-xl border-2 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-r from-gray-50 to-gray-50 hover:from-[#1DD1A1]/5 hover:to-[#B91372]/5 border-gray-200 hover:border-[#1DD1A1] relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10">
                            <span className="text-gray-900 leading-relaxed pr-4">{option.label}</span>
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-gray-300 group-hover:border-[#1DD1A1] group-hover:bg-[#1DD1A1] flex-shrink-0"><Check className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
        <div className="text-center mt-6 text-sm text-gray-500">💡 Tip: Choose the option that best reflects your current goals</div>
    </div>
);

const TransitionPage = ({icon, title, subtitle}) => (
    <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <div className="text-white text-3xl">{icon}</div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-lg text-gray-600">{subtitle}</p>
        <div className="mt-8 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (<div key={i} className="w-2 h-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />))}
        </div>
    </div>
);

const EmailCapturePage = ({ email, setEmail, onSubmit, isSubmitting }) => (
    <div className="w-full max-w-2xl mx-auto text-center">
        <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-sm font-semibold mb-4">
                <MapPin className="w-4 h-4" style={{ color: '#B91372' }} />
                Final Step
            </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Personalized Path is Ready!</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">Enter your email to instantly unlock your complete roadmap and action plan</p>
        <div className="bg-white border-2 rounded-2xl p-8 shadow-xl" style={{ borderColor: '#1DD1A1' }}>
            <div className="mb-6">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-6 py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent text-lg transition-all duration-300"/>
                <button onClick={onSubmit} disabled={!email || isSubmitting} className="w-full mt-4 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 hover:opacity-90 text-lg flex items-center justify-center transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)' }}>
                    {isSubmitting ? (<><Loader className="w-5 h-5 mr-2 animate-spin" />Creating Your Roadmap...</>) : (<>Get My Personalized Plan <ChevronRight className="w-5 h-5 ml-2" /></>)}
                </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1"><Check className="w-4 h-4 text-[#1DD1A1]" /><span>Instant access</span></div>
                <div className="flex items-center gap-1"><Check className="w-4 h-4 text-[#1DD1A1]" /><span>No spam ever</span></div>
            </div>
        </div>
    </div>
);

const ResultsLandingPage = ({ aiResult, onBegin, showConfetti }) => (
    <div className="relative w-full max-w-2xl text-center">
        <Confetti show={showConfetti} />
        <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-sm font-semibold mb-4">
                <Trophy className="w-4 h-4" style={{ color: '#B91372' }} />
                Path Discovered!
            </div>
        </div>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
            <div className="relative mb-8">
                <div className="inline-block bg-gradient-to-br from-[#1DD1A1] to-[#B91372] p-8 rounded-3xl shadow-xl transform transition-all duration-700 animate-bounce"><div className="text-6xl md:text-7xl">{aiResult.icon}</div></div>
                <Sparkles className="absolute top-0 right-0 w-6 h-6 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute bottom-0 left-0 w-5 h-5 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">{aiResult.title}</h1>
            <p className="text-lg text-gray-600 mb-8">Your personalized roadmap is ready!</p>
            <div className="bg-gradient-to-r from-[#1DD1A1]/5 to-[#B91372]/5 rounded-2xl p-6 mb-8 text-left border border-[#1DD1A1]/20">
                <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2"><MapPin className="w-5 h-5" style={{ color: '#1DD1A1' }} />Your Starting Point:</h3>
                <p className="text-gray-700 leading-relaxed">{aiResult.description}</p>
            </div>
            <button onClick={onBegin} className="group bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center gap-3 relative overflow-hidden">
                <span className="relative z-10">View My Action Plan</span>
                <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
        </div>
    </div>
);

const StepPage = ({ stepIndex, aiResult }) => {
    const stepData = getExpandedStepContent(aiResult.title, stepIndex);
    if (!stepData) return <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-[#B91372]"/></div>;

    const color1 = [29, 209, 161];
    const color2 = [185, 19, 114];
    const uniqueColor = interpolateColor(color1, color2, stepIndex / 3);
    const lightColor = uniqueColor.replace('rgb', 'rgba').replace(')', ', 0.1)');

    return (
        <div className="w-full max-w-[800px] mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: lightColor, color: uniqueColor }}>
                    <ListChecks className="w-4 h-4" />
                    Step {stepIndex + 1} of 4
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{stepData.title}</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{stepData.description}</p>
            </div>
            <div className="rounded-2xl p-6 mb-8 bg-gradient-to-br from-white to-gray-50 border shadow-lg" style={{ borderColor: uniqueColor + '40' }}>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center text-lg"><div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: lightColor }}><Sparkles className="w-5 h-5" style={{ color: uniqueColor }} /></div>Why This Matters</h3>
                <p className="text-gray-700 leading-relaxed pl-13">{stepData.whyItMatters}</p>
            </div>
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2"><Target className="w-5 h-5" style={{ color: uniqueColor }} />Your Action Items:</h3>
                <div className="space-y-3">
                    {stepData.actions.map((action, index) => (
                        <div key={index} className="flex items-start bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: uniqueColor }}>{index + 1}</div>
                            <p className="text-gray-700 leading-relaxed flex-grow">{action}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1DD1A1] to-[#B91372] flex items-center justify-center"><Home className="w-4 h-4 text-white" /></div>HOME Resources for This Step:</h3>
                <div className="flex flex-wrap gap-2">
                    {stepData.homeResources.map((resource, index) => (
                        <span key={index} className="px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: lightColor, color: uniqueColor, borderColor: uniqueColor }}>{resource}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FinalPage = ({ responses, aiResult, onReset }) => {
    const summarySteps = [...Array(4)].map((_,i) => getExpandedStepContent(aiResult.title, i)?.title).filter(Boolean);
    
    return (
        <div className="w-full max-w-[900px] mx-auto">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-sm font-semibold mb-4">
                    <Rocket className="w-4 h-4" style={{ color: '#B91372' }} />
                    Ready to Execute
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Your Complete Roadmap</h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to transform your music career is here. Choose how you want to proceed.</p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 mb-10 border shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Personalized Summary</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center"><div className="w-16 h-16 bg-gradient-to-br from-[#1DD1A1] to-[#1DD1A1]/70 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"><UserCheck className="w-8 h-8 text-white" /></div><h3 className="font-bold text-gray-800 mb-1">Your Path</h3><p className="text-gray-600">{aiResult.title.replace(' Path', '')}</p></div>
                    <div className="text-center"><div className="w-16 h-16 bg-gradient-to-br from-[#B91372]/70 to-[#B91372] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"><MapPin className="w-8 h-8 text-white" /></div><h3 className="font-bold text-gray-800 mb-1">Your Stage</h3><p className="text-gray-600">{(responses['current-stage'] || '').charAt(0).toUpperCase() + (responses['current-stage'] || '').slice(1)} Stage</p></div>
                    <div className="text-center"><div className="w-16 h-16 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"><ListChecks className="w-8 h-8 text-white" /></div><h3 className="font-bold text-gray-800 mb-1">Your Focus</h3><p className="text-gray-600 text-sm">{summarySteps[0]}</p></div>
                </div>
            </div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Support System</h2>
                <p className="text-gray-600">How would you like to implement your roadmap?</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="relative bg-white rounded-2xl p-6 border-2 border-[#B91372] shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B91372] text-white px-4 py-1 rounded-full text-sm font-bold">RECOMMENDED</div>
                    <div className="text-center mb-6 pt-4"><div className="w-16 h-16 bg-gradient-to-br from-[#B91372] to-[#B91372]/70 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"><Rocket className="w-8 h-8 text-white" /></div><h3 className="text-2xl font-bold text-gray-900">Accelerated Path</h3><p className="text-gray-600 mt-2">Get 1-on-1 expert guidance</p></div>
                    <ul className="space-y-3 mb-6"><li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">Personal strategy session with our team</span></li><li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">A fully custom roadmap for your goals</span></li><li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">Priority access to HOME resources</span></li></ul>
                    <button onClick={() => window.open('https://homeformusic.org/consultation', '_blank')} className="w-full bg-[#B91372] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105">Book Free Consultation</button>
                </div>
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="text-center mb-6 pt-4"><div className="w-16 h-16 bg-gradient-to-br from-[#1DD1A1] to-[#1DD1A1]/70 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"><Home className="w-8 h-8 text-white" /></div><h3 className="text-2xl font-bold text-gray-900">Community Path</h3><p className="text-gray-600 mt-2">Join our supportive network</p></div>
                    <ul className="space-y-3 mb-6"><li className="flex items-start"><Check className="w-5 h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">Access to HOME's online community</span></li><li className="flex items-start"><Check className="w-5 h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">Weekly virtual workshops & events</span></li><li className="flex items-start"><Check className="w-5 h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">Resource library & templates</span></li></ul>
                    <button onClick={() => window.open('https://homeformusic.org/community', '_blank')} className="w-full bg-[#1DD1A1] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105">Join Community Free</button>
                </div>
            </div>
            <div className="text-center"><button onClick={onReset} className="text-gray-500 hover:text-gray-700 font-medium transition-colors">Take Quiz Again →</button></div>
        </div>
    );
};

export default HOMEQuizMVP;
