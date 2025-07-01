import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
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
  Home
} from 'lucide-react';

// --- Quiz Questions ---
const questions = [
  { id: 'motivation', question: "What drives your music career ambitions?", options: [
      { value: 'live-performance',   label: 'The energy of a live audience and performing music from the stage' },
      { value: 'artistic-expression',label: 'Artistic expression through recording music and building a loyal following online' },
      { value: 'collaboration',      label: 'Making great songs and collaborating with other talented creators' }
  ]},
  { id: 'ideal-day', question: "Describe your ideal workday as a music professional:", options: [
      { value: 'performing-travel', label: 'Traveling to a new city to perform for a live audience' },
      { value: 'releasing-music',   label: 'Releasing a new song that you are really proud of' },
      { value: 'writing-creating',  label: 'Writing the best song that you have ever written' }
  ]},
  { id: 'success-vision', question: "When you imagine success 5 years from now, you see yourself:", options: [
      { value: 'touring-headliner',    label: 'Headlining major tours and playing sold out shows around the world' },
      { value: 'passive-income-artist',label: 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions' },
      { value: 'hit-songwriter',       label: "Having multiple major hit songs that you collaborated on and earning 'mailbox money' through sync placements and other royalty streams" }
  ]},
  { id: 'current-stage', question: "Which best describes your current stage?", options: [
      { value: 'planning',   label: 'Planning Stage - Figuring out my path and building foundations' },
      { value: 'production', label: 'Production Stage - Actively creating and releasing work' },
      { value: 'scale',      label: 'Scale Stage - Already making the majority of my income from music and looking to grow my business' }
  ]},
  { id: 'biggest-challenge', question: "What's the biggest thing holding your music journey back right now?", options: [
      { value: 'performance-opportunities', label: 'I need more opportunities to perform and grow my live audience' },
      { value: 'brand-audience',           label: "I'm creating great content, but struggle to build a consistent brand and online audience" },
      { value: 'collaboration-income',     label: 'I work behind the scenes, but need better access to collaborators, placements, and consistent income' }
  ]}
];

// --- Expanded Steps (same as before) ---
const expandedStepContent = {
  'touring-performer': [ /* … */ ],
  'creative-artist':   [ /* … */ ],
  'writer-producer':   [ /* … */ ]
};
const getExpandedStepContent = (pathway, idx) => {
  if (!pathway) return null;
  const key = pathway.toLowerCase().includes('touring')
    ? 'touring-performer'
    : 'creative-artist';
  return expandedStepContent[key]?.[idx] || null;
};

// --- Color interpolation helper ---
const interpolateColor = (c1, c2, f) => c1.map((v,i) => Math.round(v + f*(c2[i]-v)));

// --- Main App ---
const HOMEQuizMVP = () => {
  const [screen, setScreen]           = useState('landing'); // landing|quiz|transition|email|results
  const [qIndex, setQIndex]           = useState(0);
  const [responses, setResponses]     = useState({});
  const [aiResult, setAiResult]       = useState(null);
  const [email, setEmail]             = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [step, setStep]               = useState(0); // for results pages
  const [direction, setDirection]     = useState('forward');
  const [confetti, setConfetti]       = useState(false);

  const mainRef = useRef(null);

  // snap back to top on screen/qIndex/step change
  useLayoutEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [screen, qIndex, step]);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleAnswer = (id, val) => {
    setDirection('forward');
    setResponses(r => ({ ...r, [id]: val }));
    if (qIndex < questions.length - 1) {
      setQIndex(i => i + 1);
      scrollToTop();
    } else {
      setScreen('transition');
      setTimeout(() => {
        setScreen('email');
        scrollToTop();
      }, 1500);
    }
  };

  const handleEmailSubmit = () => {
    if (!email || isSubmitting) return;
    setSubmitting(true);
    setDirection('forward');
    // dummy AI payload
    const dummy = {
      title: 'The Touring Performer Path',
      icon: '🎤',
      description: 'You thrive on stage energy and live connections. Focus on building a powerful live presence and strategic bookings.'
    };
    setAiResult(dummy);
    setSubmitting(false);
    setScreen('results');
    setStep(0);
    setConfetti(true);       // show confetti until user clicks “View My Action Plan”
    scrollToTop();
  };

  const goBack = () => {
    setDirection('backward');
    if (screen === 'quiz' && qIndex > 0) setQIndex(i => i - 1);
    else if (screen === 'quiz') setScreen('landing');
    else if (screen === 'email') setScreen('quiz');
    else if (screen === 'results' && step > 0) setStep(i => i - 1);
    else if (screen === 'results') setScreen('email');
    scrollToTop();
  };

  const goNext = () => {
    setDirection('forward');
    if (screen === 'results' && step < 5) {
      setStep(i => i + 1);
      scrollToTop();
    }
  };

  const startQuiz = () => {
    setDirection('forward');
    setScreen('quiz');
    scrollToTop();
  };

  const resetAll = () => {
    setScreen('landing');
    setQIndex(0);
    setResponses({});
    setAiResult(null);
    setEmail('');
    setStep(0);
    scrollToTop();
  };

  const getStage = () => {
    if (screen === 'quiz') return 1;
    if (['transition','email'].includes(screen)) return 2;
    if (screen === 'results' && step < 5) return 3;
    if (screen === 'results' && step === 5) return 4;
    return 0;
  };

  // landing screen
  if (screen === 'landing') {
    return <LandingPage onStart={startQuiz} />;
  }

  const masterStage = getStage();
  const screenKey   = `${screen}-${qIndex}-${step}`;

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
      <AnimatedContent key={screenKey} direction={direction}>
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
          />
        )}
        {screen === 'results' && aiResult && (
          <>
            {step === 0 && (
              <ResultsLandingPage
                aiResult={aiResult}
                showConfetti={confetti}
                onBegin={() => {
                  setDirection('forward');
                  setStep(1);
                  setConfetti(false);  // now hide confetti when they click “View My Action Plan”
                  scrollToTop();
                }}
              />
            )}
            {step > 0 && step < 5 && (
              <StepPage stepIndex={step - 1} aiResult={aiResult} />
            )}
            {step === 5 && (
              <FinalPage responses={responses} aiResult={aiResult} onReset={resetAll} />
            )}
          </>
        )}
      </AnimatedContent>
    </JourneyLayout>
  );
};

// --- Layout & Header Auto-Scroll ---
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
    { id:1, title:'Identify Your Path',    icon:<Target className="w-4 h-4"/> },
    { id:2, title:'Personalized Path',     icon:<MapPin className="w-4 h-4"/> },
    { id:3, title:'Personalized Plan',     icon:<ListChecks className="w-4 h-4"/> },
    { id:4, title:'Execute Plan',          icon:<Rocket className="w-4 h-4"/> }
  ];
  const showBack     = ['quiz','email','results'].includes(currentScreen);
  const showNextStep = currentScreen==='results' && resultStep>0 && resultStep<4;
  const showExecute  = currentScreen==='results' && resultStep===4;
  const color1=[29,209,161], color2=[185,19,114];
  const headerRef = useRef(null);

  // auto-scroll that single-line header so the active step is always in view
  useEffect(() => {
    const container = headerRef.current;
    const active = container?.querySelector(`[data-stage-id="${masterStage}"]`);
    if (container && active) {
      const offset = active.offsetLeft + active.clientWidth/2 - container.clientWidth/2;
      container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [masterStage]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky single-line header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div
            ref={headerRef}
            className="flex items-center whitespace-nowrap overflow-x-auto relative pb-2"
          >
            {stages.map(s => {
              const isActive    = masterStage===s.id;
              const isCompleted = masterStage> s.id;
              const rgb          = interpolateColor(color1,color2,(s.id-1)/3).join(',');
              return (
                <div
                  key={s.id}
                  data-stage-id={s.id}
                  className="inline-block text-center px-3 flex-shrink-0"
                >
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-transform ${isActive?'scale-110':''}`}
                    style={{
                      border: '2px solid',
                      borderColor: isActive||isCompleted?`rgb(${rgb})`:'#d1d5db',
                      backgroundColor: isCompleted?`rgb(${rgb})`:'white',
                      color: isCompleted?'white':isActive?`rgb(${rgb})`:'#a0aec0'
                    }}
                  >
                    {isCompleted ? <Check className="w-4 h-4"/> : s.id}
                  </div>
                  <div className="mt-1 text-xs leading-snug">{s.title}</div>
                </div>
              );
            })}
            <div className="absolute bottom-0 left-4 right-4 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-300"
                style={{ width:`calc(${((masterStage-1)/3)*100}% - 2rem)` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <main ref={mainRef} className="flex-grow overflow-y-auto">{children}</main>

      {/* Sticky footer */}
      <footer className="sticky bottom-0 bg-white border-t z-20 shadow-inner">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
              showBack?'text-gray-600 hover:text-gray-900 hover:bg-gray-100':'invisible'
            }`}
          >
            <ChevronLeft className="w-5 h-5"/> <span className="hidden sm:inline">Back</span>
          </button>
          <div className="text-sm text-gray-500">
            {currentScreen==='quiz'   && `Question ${questionIndex+1} of ${questions.length}`}
            {currentScreen==='results'&& resultStep>0 && `Step ${resultStep} of 4`}
          </div>
          {showNextStep && (
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-1"
            >
              Next <ChevronRight className="w-5 h-5"/>
            </button>
          )}
          {showExecute && (
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-1"
            >
              Execute <Rocket className="w-5 h-5"/>
            </button>
          )}
          {(!showNextStep && !showExecute) && <div className="w-16"/>}
        </div>
      </footer>
    </div>
  );
};

// --- Animated wrapper, pages etc. remain the same except QuestionPage & FinalPage tweaks:

const AnimatedContent = ({ children, direction }) => (
  <div className={`h-full w-full p-4 md:p-8 flex items-center justify-center animate-on-load ${direction}`}>
    {children}
  </div>
);

const LandingPage = ({ onStart }) => (
  /* … unchanged … */
);

const QuestionPage = ({ question, onAnswer, questionIndex, total, responses }) => (
  <div className="w-full max-w-3xl mx-auto">
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-sm font-semibold mb-4">
        <Target className="w-4 h-4" style={{ color: '#1DD1A1' }} />
        Question {questionIndex + 1} of {total}
      </div>
    </div>
    <div className="space-y-4">
      {question.options.map(opt => {
        const isSelected = responses[question.id] === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onAnswer(question.id, opt.value)}
            className={`w-full p-5 text-left rounded-xl border-2 flex items-center justify-between transition ${
              isSelected
                ? 'border-[#1DD1A1] bg-[#1DD1A1]/10'
                : 'border-gray-200 bg-white'
            }`}
          >
            <span className="text-gray-900">{opt.label}</span>
            {isSelected && <Check className="w-6 h-6 text-[#1DD1A1]" />}
          </button>
        );
      })}
    </div>
    <div className="text-center mt-6 text-sm text-gray-500">💡 Tip: Choose the option that best reflects your goals</div>
  </div>
);

const TransitionPage = ({ icon, title, subtitle }) => ( /* … unchanged … */ );
const EmailCapturePage = ({ email, setEmail, onSubmit, isSubmitting }) => ( /* … unchanged … */ );

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

const ResultsLandingPage = ({ aiResult, showConfetti, onBegin }) => (
  <div className="relative w-full max-w-2xl mx-auto text-center">
    <Confetti show={showConfetti} />
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full text-sm font-semibold mb-4">
      <Trophy className="w-4 h-4" style={{ color: '#B91372' }} /> Path Discovered!
    </div>
    {/* … content … */}
    <button onClick={onBegin} className="…">View My Action Plan</button>
  </div>
);

const StepPage = ({ stepIndex, aiResult }) => ( /* … unchanged … */ );

// --- Final Page: center the summary panel ---
const FinalPage = ({ responses, aiResult, onReset }) => {
  const summary = [0,1,2,3]
    .map(i => getExpandedStepContent(aiResult.title, i)?.title)
    .filter(Boolean);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Your Complete Roadmap</h1>
      <p className="text-center text-gray-600 mb-8">Everything you need to transform your music career is here.</p>

      <div className="flex justify-center mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-3xl">
          <h2 className="text-xl font-semibold text-center mb-6">Your Personalized Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-[#1DD1A1] to-[#1DD1A1]/70 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white"/>
              </div>
              <p className="font-medium">Your Path</p>
              <p className="text-gray-600 text-sm">{aiResult.title.replace(' Path','')}</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-[#B91372] to-[#B91372]/70 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white"/>
              </div>
              <p className="font-medium">Your Stage</p>
              <p className="text-gray-600 text-sm">
                {responses['current-stage']?.charAt(0).toUpperCase() + responses['current-stage']?.slice(1)} Stage
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-lg flex items-center justify-center">
                <ListChecks className="w-6 h-6 text-white"/>
              </div>
              <p className="font-medium">Your Focus</p>
              <p className="text-gray-600 text-sm">{summary[0]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* … then your support-system cards … */}

      <div className="text-center mt-8">
        <button onClick={onReset} className="text-gray-500 hover:text-gray-700">
          Take Quiz Again →
        </button>
      </div>
    </div>
  );
};

export default HOMEQuizMVP;
