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
  {
    id: 'motivation',
    question: "What drives your music career ambitions?",
    options: [
      { value: 'live-performance',    label: 'The energy of a live audience and performing music from the stage' },
      { value: 'artistic-expression', label: 'Artistic expression through recording music and building a loyal following online' },
      { value: 'collaboration',       label: 'Making great songs and collaborating with other talented creators' }
    ]
  },
  {
    id: 'ideal-day',
    question: "Describe your ideal workday as a music professional:",
    options: [
      { value: 'performing-travel', label: 'Traveling to a new city to perform for a live audience' },
      { value: 'releasing-music',   label: 'Releasing a new song that you are really proud of' },
      { value: 'writing-creating',  label: 'Writing the best song that you have ever written' }
    ]
  },
  {
    id: 'success-vision',
    question: "When you imagine success 5 years from now, you see yourself:",
    options: [
      { value: 'touring-headliner',     label: 'Headlining major tours and playing sold out shows around the world' },
      { value: 'passive-income-artist', label: 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions' },
      { value: 'hit-songwriter',        label: "Having multiple major hit songs that you collaborated on and earning 'mailbox money' through sync placements and other royalty streams" }
    ]
  },
  {
    id: 'current-stage',
    question: "Which best describes your current stage?",
    options: [
      { value: 'planning',   label: 'Planning Stage - Figuring out my path and building foundations' },
      { value: 'production', label: 'Production Stage - Actively creating and releasing work' },
      { value: 'scale',      label: 'Scale Stage - Already making the majority of my income from music and looking to grow my business' }
    ]
  },
  {
    id: 'biggest-challenge',
    question: "What's the biggest thing holding your music journey back right now?",
    options: [
      { value: 'performance-opportunities', label: 'I need more opportunities to perform and grow my live audience' },
      { value: 'brand-audience',           label: "I'm creating great content, but struggle to build a consistent brand and online audience" },
      { value: 'collaboration-income',     label: 'I work behind the scenes, but need better access to collaborators, placements, and consistent income' }
    ]
  }
];

// --- Expanded Plan Steps ---
const expandedStepContent = {
  'touring-performer': [ /* same data as before */ ],
  'creative-artist':   [ /* same data as before */ ],
  'writer-producer':   [ /* same data as before */ ]
};
const getExpandedStepContent = (pathway, idx) => {
  if (!pathway) return null;
  const key = pathway.toLowerCase().includes('touring')
    ? 'touring-performer'
    : 'creative-artist';
  return expandedStepContent[key]?.[idx] || null;
};

// Linear interpolation helper between two RGB arrays
const interpolateColor = (c1, c2, f) =>
  c1.map((v,i) => Math.round(v + f*(c2[i]-v)));


// --- Main Quiz Component ---
const HOMEQuizMVP = () => {
  const [screen, setScreen]           = useState('landing');     // landing, quiz, transition, email, results
  const [qIndex, setQIndex]           = useState(0);
  const [responses, setResponses]     = useState({});
  const [aiResult, setAiResult]       = useState(null);
  const [email, setEmail]             = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [step, setStep]               = useState(0);            // result sub-step
  const [direction, setDirection]     = useState('forward');     // slide animation
  const [confetti, setConfetti]       = useState(false);

  const mainRef = useRef(null);

  // Always scroll to top when screen, question, or step changes
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
      setTimeout(() => { setScreen('email'); scrollToTop(); }, 1500);
    }
  };

  const handleEmailSubmit = () => {
    if (!email || isSubmitting) return;
    setSubmitting(true);
    setDirection('forward');
    // Dummy AI result
    const dummy = {
      title: 'The Touring Performer Path',
      icon: '🎤',
      description:
        'You thrive on stage energy and live connections. Focus on building a powerful live presence and strategic bookings.'
    };
    setAiResult(dummy);
    setScreen('results');
    setStep(0);
    setConfetti(true);
    scrollToTop();
  };

  const goBack = () => {
    setDirection('backward');
    if (screen === 'quiz' && qIndex > 0)           setQIndex(i => i - 1);
    else if (screen === 'quiz')                    setScreen('landing');
    else if (screen === 'email')                   setScreen('quiz');
    else if (screen === 'results' && step > 0)     setStep(i => i - 1);
    else if (screen === 'results')                 setScreen('email');
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
    if (screen === 'quiz')               return 1;
    if (['transition','email'].includes(screen)) return 2;
    if (screen === 'results' && step < 5) return 3;
    if (screen === 'results' && step === 5) return 4;
    return 0;
  };

  // Render
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
                  setConfetti(false);
                  scrollToTop();
                }}
              />
            )}
            {step > 0 && step < 5 && <StepPage stepIndex={step - 1} aiResult={aiResult} />}
            {step === 5 && <FinalPage responses={responses} aiResult={aiResult} onReset={resetAll} />}
          </>
        )}
      </AnimatedContent>
    </JourneyLayout>
  );
};


// --- Layout + Sticky Header/Footer ---
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
  const showNext     = currentScreen === 'results' && resultStep > 0 && resultStep < 4;
  const showExecute  = currentScreen === 'results' && resultStep === 4;
  const color1 = [29,209,161], color2 = [185,19,114];
  const headerRef = useRef(null);

  // auto-scroll the header so the active step is centered
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
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div ref={headerRef} className="flex items-center whitespace-nowrap overflow-x-auto pb-2 relative">
            {stages.map(s => {
              const active    = masterStage === s.id;
              const completed = masterStage > s.id;
              const rgb       = interpolateColor(color1, color2, (s.id-1)/3).join(',');
              return (
                <div key={s.id} data-stage-id={s.id} className="inline-block text-center px-3 flex-shrink-0">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-transform ${active ? 'scale-110' : ''}`}
                    style={{
                      border: '2px solid',
                      borderColor: active || completed ? `rgb(${rgb})` : '#d1d5db',
                      backgroundColor: completed ? `rgb(${rgb})` : 'white',
                      color: completed ? 'white' : active ? `rgb(${rgb})` : '#a0aec0'
                    }}
                  >
                    {completed ? <Check className="w-4 h-4"/> : s.id}
                  </div>
                  <div className="mt-1 text-xs leading-snug">{s.title}</div>
                </div>
              );
            })}
            <div className="absolute bottom-0 left-4 right-4 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-300"
                style={{ width: `calc(${((masterStage-1)/3)*100}% - 2rem)` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main ref={mainRef} className="flex-grow overflow-y-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white border-t z-20 shadow-inner">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${showBack ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'invisible'}`}
          >
            <ChevronLeft className="w-5 h-5"/> <span className="hidden sm:inline">Back</span>
          </button>
          <div className="text-sm text-gray-500">
            {currentScreen === 'quiz'
              ? `Question ${questionIndex + 1} of ${questions.length}`
              : currentScreen === 'results' && resultStep > 0
                ? `Step ${resultStep} of 4`
                : ''}
          </div>
          {showNext && (
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
          {(!showNext && !showExecute) && <div className="w-16" />}
        </div>
      </footer>
    </div>
  );
};

// --- Animation wrapper ---
const AnimatedContent = ({ children, direction }) => (
  <div className={`h-full w-full p-4 md:p-8 flex items-center justify-center animate-on-load ${direction}`}>
    {children}
  </div>
);

// --- Landing Page ---
const LandingPage = ({ onStart }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="max-w-2xl w-full text-center">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full font-semibold text-gray-700 mb-6 text-sm">
          <Sparkles className="w-4 h-4" style={{ color: '#B91372' }}/>
          AI-Powered Music Career Guidance
        </div>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Find Your Path on the<br/>
        <span style={{
          background: 'linear-gradient(135deg,#1DD1A1 0%,#B91372 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Music Creator Roadmap
        </span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8">
        Answer 5 simple questions and get your personalized action plan to build a sustainable music career
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 text-sm text-gray-600">
        <div className="flex items-center"><Check className="w-5 h-5 mr-2 text-[#1DD1A1]"/>2-Minute Quiz</div>
        <div className="flex items-center"><Check className="w-5 h-5 mr-2 text-[#1DD1A1]"/>Personalized Roadmap</div>
        <div className="flex items-center"><Check className="w-5 h-5 mr-2 text-[#1DD1A1]"/>Actionable Steps</div>
      </div>
      <button
        onClick={onStart}
        className="group relative text-white py-4 px-8 md:px-12 rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-xl inline-flex items-center gap-3 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1DD1A1 0%,#B91372 100%)' }}
      >
        <span className="relative z-10">Start Your Journey</span>
        <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1"/>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"/>
      </button>
      <p className="text-sm text-gray-500 mt-3">No email required • 100% free</p>
    </div>
  </div>
);

// --- Question Page ---
const QuestionPage = ({ question, onAnswer, questionIndex, total, responses }) => (
  <div className="max-w-3xl mx-auto w-full">
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full font-semibold mb-4 text-sm">
        <Target className="w-4 h-4" style={{ color: '#1DD1A1' }}/> Question {questionIndex + 1} of {total}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{question.question}</h2>
    </div>
    <div className="space-y-4">
      {question.options.map(opt => {
        const selected = responses[question.id] === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onAnswer(question.id, opt.value)}
            className={`w-full p-5 text-left rounded-xl border-2 flex items-center justify-between transition ${
              selected ? 'border-[#1DD1A1] bg-[#1DD1A1]/10' : 'border-gray-200 bg-white'
            }`}
          >
            <span className="text-gray-900">{opt.label}</span>
            {selected && <Check className="w-6 h-6 text-[#1DD1A1]"/>}
          </button>
        );
      })}
    </div>
    <div className="text-center mt-6 text-sm text-gray-500">
      💡 Tip: Choose the option that best reflects your goals
    </div>
  </div>
);

// --- Transition Page ---
const TransitionPage = ({ icon, title, subtitle }) => (
  <div className="text-center">
    <div className="w-20 h-20 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
      <div className="text-white text-3xl">{icon}</div>
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
    <p className="text-lg text-gray-600 mb-8">{subtitle}</p>
    <div className="flex justify-center gap-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  </>
);

// --- Email Capture Page ---
const EmailCapturePage = ({ email, setEmail, onSubmit, isSubmitting }) => (
  <div className="max-w-2xl mx-auto w-full text-center">
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full font-semibold mb-4 text-sm">
        <MapPin className="w-4 h-4" style={{ color: '#B91372' }}/> Final Step
      </div>
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Personalized Path is Ready!</h1>
    <p className="text-lg md:text-xl text-gray-600 mb-8">Enter your email to unlock your complete action plan</p>
    <div className="bg-white border-2 rounded-2xl p-8 shadow-xl" style={{ borderColor: '#1DD1A1' }}>
      <div className="mb-6">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-6 py-4 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] text-lg transition"
        />
        <button
          onClick={onSubmit}
          disabled={!email || isSubmitting}
          className="w-full mt-4 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center text-lg shadow-lg"
          style={{ background: 'linear-gradient(135deg,#1DD1A1 0%,#B91372 100%)' }}
        >
          {isSubmitting
            ? <><Loader className="w-5 h-5 mr-2 animate-spin"/>Creating Your Plan…</>
            : <>Get My Plan <ChevronRight className="w-5 h-5 ml-2"/></>
          }
        </button>
      </div>
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-1"><Check className="w-4 h-4 text-[#1DD1A1]"/> Instant access</div>
        <div className="flex items-center gap-1"><Check className="w-4 h-4 text-[#1DD1A1]"/> No spam ever</div>
      </div>
    </div>
  </>
);

// --- Confetti Overlay ---
const Confetti = ({ show }) => {
  if (!show) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity:1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity:0; }
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
        return <div key={i} style={style}/>;
      })}
    </div>
  );
};

// --- Results Landing Page ---
const ResultsLandingPage = ({ aiResult, showConfetti, onBegin }) => (
  <div className="relative max-w-2xl mx-auto w-full text-center">
    <Confetti show={showConfetti}/>
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-full font-semibold mb-4 text-sm">
      <Trophy className="w-4 h-4" style={{ color: '#B91372' }}/> Path Discovered!
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{aiResult.title}</h1>
    <p className="text-lg text-gray-600 mb-8">Your personalized roadmap is ready!</p>
    <div className="bg-gradient-to-r from-[#1DD1A1]/5 to-[#B91372]/5 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto border border-[#1DD1A1]/20">
      <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
        <MapPin className="w-5 h-5" style={{ color: '#1DD1A1' }}/> Your Starting Point:
      </h3>
      <p className="text-gray-700 leading-relaxed">{aiResult.description}</p>
    </div>
    <button
      onClick={onBegin}
      className="group bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-xl inline-flex items-center gap-2"
    >
      View My Action Plan <ChevronRight className="w-5 h-5"/>
    </button>
  </>
);

// --- Step Page ---
const StepPage = ({ stepIndex, aiResult }) => {
  const data = getExpandedStepContent(aiResult.title, stepIndex);
  if (!data) return <div className="flex items-center justify-center h-full"><Loader className="animate-spin text-[#B91372]"/></div>;

  const c1 = [29,209,161], c2 = [185,19,114];
  const rgb = interpolateColor(c1,c2, stepIndex/3).join(',');
  const bg  = `rgba(${rgb},0.1)`;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold" style={{ backgroundColor: bg, color: `rgb(${rgb})` }}>
          <ListChecks className="w-4 h-4"/> Step {stepIndex+1} of 4
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{data.title}</h2>
        <p className="text-gray-600 mb-6">{data.description}</p>
      </div>
      <div className="bg-white rounded-2xl p-6 mb-8 border shadow-lg" style={{ borderColor: `rgba(${rgb},0.25)` }}>
        <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
          <Sparkles className="w-5 h-5" style={{ color: `rgb(${rgb})` }}/> Why This Matters
        </h3>
        <p className="text-gray-700">{data.whyItMatters}</p>
      </div>
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
          <Target className="w-5 h-5" style={{ color: `rgb(${rgb})` }}/> Your Action Items
        </h3>
        <ul className="space-y-3">
          {data.actions.map((a,i) => (
            <li key={i} className="flex items-start">
              <div className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold mr-3" style={{ backgroundColor: `rgb(${rgb})` }}>{i+1}</div>
              <p className="text-gray-700">{a}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-2xl p-6 border shadow-lg">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
          <Home className="w-5 h-5 text-[#1DD1A1]"/> HOME Resources
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.homeResources.map((r,i)=>(<span key={i} className="px-4 py-2 border rounded-lg text-sm" style={{ color: `rgb(${rgb})`, borderColor: `rgb(${rgb})` }}>{r}</span>))}
        </div>
      </div>
    </>
);

// --- Final Summary Page ---
const FinalPage = ({ responses, aiResult, onReset }) => {
  const summary = [0,1,2,3]
    .map(i => getExpandedStepContent(aiResult.title, i)?.title)
    .filter(Boolean);

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Your Complete Roadmap</h2>
      <p className="text-center text-gray-600 mb-10">Everything you need to transform your music career is here.</p>

      <div className="bg-white rounded-2xl p-8 shadow-xl mb-12 max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold text-center mb-6">Your Personalized Summary</h3>
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

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="relative bg-white p-6 border-2 border-[#B91372] rounded-2xl shadow-lg hover:scale-105 transition-transform">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#B91372] text-white px-4 py-1 rounded-full text-xs font-bold">RECOMMENDED</div>
          <div className="text-center mb-6 pt-6">
            <Rocket className="w-8 h-8 text-[#B91372] mx-auto mb-2"/>
            <h4 className="text-xl font-bold mb-1">Accelerated Path</h4>
            <p className="text-gray-600 text-sm">Get 1-on-1 expert guidance</p>
          </div>
          <ul className="space-y-3 mb-6 text-gray-700">
            <li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2"/>Personal strategy session</li>
            <li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2"/>Fully custom roadmap</li>
            <li className="flex items-start"><Check className="w-5 h-5 text-[#B91372] mr-2"/>Priority HOME resources</li>
          </ul>
          <button
            onClick={()=>window.open('https://homeformusic.org/consultation','_blank')}
            className="w-full bg-[#B91372] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
          >
            Book Free Consultation
          </>
      );
};

export default HOMEQuizMVP;
