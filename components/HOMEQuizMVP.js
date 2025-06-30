import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Loader, ChevronLeft, MapPin, UserCheck, ListChecks, Check } from 'lucide-react';

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
        title: 'The Touring Performer Path', icon: '�',
        description: 'You thrive on stage energy and live connections. Your priority is building a powerful live presence and growing your touring opportunities. This means focusing on your craft as a live act, creating an unforgettable show, and strategically booking gigs that expand your audience and income.',
    };
    setAiResult(dummyResult);
    setTimeout(() => { setIsSubmitting(false); setCurrentScreen('results'); setResultStep(0); }, 1500);
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
    <JourneyLayout masterStage={stage} resultStep={resultStep} onBack={handleBack} onNext={handleNext} currentScreen={currentScreen}>
        <AnimatedContent key={screenKey} direction={animationDirection}>
            {currentScreen === 'quiz' && <QuestionPage question={questions[questionIndex]} onResponse={handleResponse} questionIndex={questionIndex} totalQuestions={questions.length} />}
            {currentScreen === 'transition' && <TransitionPage icon={<Loader className="animate-spin" />} title="Fantastic." subtitle="Analyzing your responses..." />}
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

const Confetti = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
        {[...Array(50)].map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animation: `confetti-fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear infinite`,
            };
            return <div key={i} className="absolute w-2 h-4 opacity-0" style={style}></div>
        })}
    </div>
);

const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
    }
    return `rgb(${result.join(',')})`;
};

const JourneyLayout = ({ children, masterStage, resultStep, onBack, onNext, currentScreen }) => {
    const stageTitles = ["Identify Your Path", "Personalized Path", "Personalized Plan", "Execute Plan"];
    const showBackButton = (currentScreen === 'quiz' && true) || (currentScreen === 'email') || (currentScreen === 'results');
    const showNextButton = currentScreen === 'results' && resultStep > 0 && resultStep < 4;
    const showFinalPlanButton = currentScreen === 'results' && resultStep === 4;

    const progressPercentage = masterStage > 1 ? (((masterStage - 1) / (stageTitles.length -1)) * 100) - (100 / (stageTitles.length-1) / 2) : 0;
    
    const color1 = [29, 209, 161]; // #1DD1A1
    const color2 = [185, 19, 114]; // #B91372
    const activeStageColor = interpolateColor(color1, color2, (masterStage - 1) / (stageTitles.length - 1));

    return (
        <div className="h-[100svh] bg-gray-50 flex flex-col" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <style jsx global>{`
                .animate-on-load.forward { animation: slideInForward 0.5s cubic-bezier(0.45, 0, 0.55, 1); }
                .animate-on-load.backward { animation: slideInBackward 0.5s cubic-bezier(0.45, 0, 0.55, 1); }
                @keyframes slideInForward { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideInBackward { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes confetti-fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
            `}</style>
            <header className="flex-shrink-0 bg-white/95 backdrop-blur-sm z-20 shadow-sm pt-3 pb-2">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="flex items-start justify-between relative mb-2 text-center">
                        {stageTitles.map((title, i) => (
                            <div key={i} className={`flex-1 transition-all duration-500 z-10 ${masterStage >= i + 1 ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                                <div className={`mx-auto mb-1 w-8 h-8 text-sm rounded-full flex items-center justify-center transition-all duration-500 font-bold border-2 ${masterStage === i + 1 ? 'scale-110' : masterStage > i+1 ? 'text-white' : 'bg-gray-200 border-gray-300'}`}
                                style={{
                                    borderColor: masterStage === i + 1 ? activeStageColor : masterStage > i+1 ? 'transparent' : '#d1d5db',
                                    backgroundColor: masterStage > i+1 ? activeStageColor : (masterStage === i + 1 ? 'white' : '#e5e7eb'),
                                    color: masterStage === i + 1 ? activeStageColor : (masterStage > i + 1 ? 'white' : 'inherit')
                                }}
                                >{i + 1}</div>
                                <div className="text-[10px] leading-tight sm:text-xs">{title}</div>
                            </div>
                        ))}
                        <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10"><div className="h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-500" style={{ width: `calc(${progressPercentage}% - 1rem)` }}></div></div>
                    </div>
                    {masterStage === 3 && (
                        <div className="mt-2 flex justify-around items-center border-t pt-2">
                            {[...Array(4)].map((_, i) => (<div key={i} className={`text-xs font-semibold p-1 rounded transition-all duration-300 ${resultStep === i + 1 ? 'text-white' : 'text-gray-500'}`}
                            style={{backgroundColor: resultStep === i+1 ? interpolateColor(color1, color2, i/3) : 'transparent'}}
                            >Step {i + 1}</div>))}
                        </div>
                    )}
                </div>
            </header>
            <main className="flex-grow overflow-y-auto relative">{children}</main>
            <footer className="flex-shrink-0 bg-white/95 backdrop-blur-sm z-20 border-t">
                <div className="container max-w-4xl mx-auto px-4 flex justify-between items-center h-16">
                    <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium flex items-center transition-opacity duration-300 disabled:opacity-0" disabled={!showBackButton}><ChevronLeft className="w-5 h-5 mr-1" /> Back</button>
                    {showNextButton && <button onClick={onNext} className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center">Next Step <ChevronRight className="w-5 h-5 ml-2" /></button>}
                    {showFinalPlanButton && (<button onClick={onNext} className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center">Execute My Personalized Plan <ChevronRight className="w-5 h-5 ml-2" /></button>)}
                </div>
            </footer>
        </div>
    );
};

const AnimatedContent = ({ children, direction }) => (
    <div className={`h-full w-full p-4 flex items-center justify-center animate-on-load ${direction}`}>{children}</div>
);

const LandingPage = ({ onStartQuiz }) => (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Find Your Path on the<br /><span style={{ background: 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Music Creator Roadmap</span></h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">2-minute AI quiz to discover your personalized pathway in the music industry</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 text-sm text-gray-600">
                        <div className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#1DD1A1' }}></div>AI-Powered Results</div>
                        <div className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#1DD1A1' }}></div>Nashville Community</div>
                        <div className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#1DD1A1' }}></div>Personalized Roadmap</div>
                    </div>
                    <div className="mb-12">
                        <button onClick={onStartQuiz} className="text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center hover:opacity-90 mb-4" style={{ backgroundColor: '#B91372' }}>Find My Path <ChevronRight className="w-5 h-5 ml-2" /></button>
                        <p className="text-sm text-gray-500">Takes 2 minutes • Completely free</p>
                    </div>
                    <img src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/685b3b45958e7f525884f62d.png" alt="HOME for Music" className="mx-auto mb-6" style={{ height: '70px', width: 'auto', maxWidth: '280px', objectFit: 'contain' }}/>
                    <div className="flex items-center justify-center text-sm text-gray-500"><div className="flex text-yellow-400 mr-2">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-current" />))}</div>Trusted by 1,000+ music creators</div>
                </div>
            </div>
        </div>
    </div>
);

const QuestionPage = ({ question, onResponse, questionIndex, totalQuestions }) => (
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
);

const TransitionPage = ({icon, title, subtitle}) => (
    <div className="text-center">
        <div className="w-16 h-16 text-[#B91372] mx-auto mb-4 flex items-center justify-center text-4xl">{icon}</div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
    </div>
);

const EmailCapturePage = ({ email, setEmail, onSubmit, isSubmitting }) => (
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
);

const ResultsLandingPage = ({ aiResult, onBegin }) => (
    <div className="relative w-full max-w-2xl text-center">
        <Confetti />
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl">
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

const StepPage = ({ stepIndex, aiResult }) => {
    const stepData = getExpandedStepContent(aiResult.title, stepIndex);
    if (!stepData) return <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-[#B91372]"/></div>;

    const color1 = [29, 209, 161]; // #1DD1A1
    const color2 = [185, 19, 114]; // #B91372
    const factor = stepIndex / 3;
    const uniqueColor = interpolateColor(color1, color2, factor);
    const lightColor = uniqueColor.replace('rgb', 'rgba').replace(')', ', 0.1)');

    return (
        <div className="w-full max-w-[800px] mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stepData.title}</h1>
                <p className="text-lg text-gray-600">{stepData.description}</p>
            </div>
            <div className="rounded-2xl p-6 mb-8 bg-white shadow">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center text-lg"><span className="text-2xl mr-2">💡</span>Why This Matters</h3>
                <p className="text-gray-700 leading-relaxed">{stepData.whyItMatters}</p>
            </div>
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Action Items:</h3>
                <div className="space-y-3">
                    {stepData.actions.map((action, index) => (
                        <div key={index} className="flex items-start bg-white rounded-xl p-4 shadow-sm">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: uniqueColor }}>{index + 1}</div>
                            <p className="text-gray-700 leading-relaxed">{action}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 mb-8 shadow">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">🏡 HOME Resources for This Step:</h3>
                <div className="flex flex-wrap gap-2">
                    {stepData.homeResources.map((resource, index) => (
                        <span key={index} className="px-3 py-1 rounded-lg text-sm font-medium border" style={{ backgroundColor: lightColor, color: uniqueColor, borderColor: uniqueColor }}>{resource}</span>
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Execute Your Plan.</h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mt-2">You have your personalized plan. Now, choose the support system that will help you bring it to life.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 mb-10 border shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Roadmap Summary</h2>
                <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4"><UserCheck className="w-10 h-10 text-[#1DD1A1]" /><div><h3 className="font-bold text-gray-800">Your Path</h3><p className="text-gray-600">{aiResult.title.replace(' Path', '')}</p></div></div>
                    <div className="flex flex-col md:flex-row items-center gap-4"><MapPin className="w-10 h-10 text-[#1DD1A1]" /><div><h3 className="font-bold text-gray-800">Your Stage</h3><p className="text-gray-600">{(responses['current-stage'] || '').charAt(0).toUpperCase() + (responses['current-stage'] || '').slice(1)} Stage</p></div></div>
                    <div className="flex flex-col md:flex-row items-center gap-4"><ListChecks className="w-10 h-10 text-[#1DD1A1]" /><div><h3 className="font-bold text-gray-800">Your Priorities</h3><p className="text-gray-600">{summarySteps.slice(0, 2).join(', ')}</p></div></div>
                </div>
            </div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Choose Your Support System</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border-2 border-[#B91372] flex flex-col relative shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-[#B91372] text-white px-4 py-1 rounded-full text-sm font-bold">RECOMMENDED</div>
                    <div className="text-center mb-4 pt-4"><div className="text-4xl mb-2">🚀</div><h3 className="text-2xl font-bold text-gray-900">Accelerated Path</h3><p className="text-gray-600 mt-2">Get 1-on-1 expert guidance</p></div>
                    <ul className="space-y-3 mb-6 flex-grow"><li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">A dedicated strategy session with our team</span></li><li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">A fully custom roadmap for your goals</span></li><li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">Priority access to HOME resources & pros</span></li></ul>
                    <button onClick={() => window.open('https://homeformusic.org/consultation', '_blank')} className="w-full bg-[#B91372] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg mt-auto">Book Free Consultation</button>
                </div>
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 flex flex-col transform hover:scale-105 transition-transform duration-300">
                    <div className="text-center mb-4 pt-4"><div className="text-4xl mb-2">🏡</div><h3 className="text-2xl font-bold text-gray-900">Community Path</h3><p className="text-gray-600 mt-2">Start your journey with our resources</p></div>
                    <ul className="space-y-3 mb-6 flex-grow"><li className="flex items-start"><Check className="w-5 h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">Access to HOME's online community</span></li><li className="flex items-start"><Check className="w-5 h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">Weekly virtual workshops & events</span></li><li className="flex items-start"><Check className="w-5 h-5 text-[#1DD1A1] mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">A full library of templates & resources</span></li></ul>
                    <button onClick={() => window.open('https://homeformusic.org/community', '_blank')} className="w-full bg-[#1DD1A1] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg mt-auto">Start for Free</button>
                </div>
            </div>
            <div className="mt-12 text-center">
                <button onClick={onReset} className="text-gray-500 hover:text-gray-700 font-medium">Start Over →</button>
            </div>
        </div>
    );
};

export default HOMEQuizMVP;
�
