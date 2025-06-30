import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  Star,
  Loader,
  ChevronLeft,
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

// --- Data ---
const questions = [
  { id: 'motivation', question: "What drives your music career ambitions?", options: [
      { value: 'live-performance',   label: 'The energy of a live audience and performing music from the stage' },
      { value: 'artistic-expression', label: 'Artistic expression through recording music and building a loyal following online' },
      { value: 'collaboration',       label: 'Making great songs and collaborating with other talented creators' }
  ]},
  { id: 'ideal-day', question: "Describe your ideal workday as a music professional:", options: [
      { value: 'performing-travel', label: 'Traveling to a new city to perform for a live audience' },
      { value: 'releasing-music',   label: 'Releasing a new song that you are really proud of' },
      { value: 'writing-creating',  label: 'Writing the best song that you have ever written' }
  ]},
  { id: 'success-vision', question: "When you imagine success 5 years from now, you see yourself:", options: [
      { value: 'touring-headliner',   label: 'Headlining major tours and playing sold out shows around the world' },
      { value: 'passive-income-artist', label: 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions' },
      { value: 'hit-songwriter',      label: 'Having multiple major hit songs that you collaborated on and earning \'mailbox money\' through sync placements and other royalty streams' }
  ]},
  { id: 'current-stage', question: "Which best describes your current stage?", options: [
      { value: 'planning',   label: 'Planning Stage - Figuring out my path and building foundations' },
      { value: 'production', label: 'Production Stage - Actively creating and releasing work' },
      { value: 'scale',      label: 'Scale Stage - Already making the majority of my income from music and looking to grow my business' }
  ]},
  { id: 'biggest-challenge', question: "What's the biggest thing holding your music journey back right now?", options: [
      { value: 'performance-opportunities', label: 'I need more opportunities to perform and grow my live audience' },
      { value: 'brand-audience',           label: 'I\'m creating great content, but struggle to build a consistent brand and online audience' },
      { value: 'collaboration-income',     label: 'I work behind the scenes, but need better access to collaborators, placements, and consistent income' }
  ]}
];

const expandedStepContent = {
  'touring-performer': [ /* …same as before…*/ ],
  'creative-artist':   [ /* …same as before…*/ ],
  'writer-producer':   [ /* …same as before…*/ ]
};

const getExpandedStepContent = (pathway, stepIndex) => {
  if (!pathway) return null;
  const key = pathway.toLowerCase().includes('touring') ? 'touring-performer' : 'creative-artist';
  return expandedStepContent[key]?.[stepIndex] || null;
};

const HOMEQuizMVP = () => {
  const [currentScreen,   setCurrentScreen]   = useState('landing');
  const [questionIndex,   setQuestionIndex]   = useState(0);
  const [responses,       setResponses]       = useState({});
  const [aiResult,        setAiResult]        = useState(null);
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [email,           setEmail]           = useState('');
  const [resultStep,      setResultStep]      = useState(0);
  const [animationDirection, setAnimationDirection] = useState('forward');
  const [showConfetti,    setShowConfetti]    = useState(false);

  // ** NEW: scroll reset **
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentScreen, questionIndex, resultStep]);

  const handleResponse = (questionId, value) => {
    setAnimationDirection('forward');
    setResponses(prev => ({ ...prev, [questionId]: value }));
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      setCurrentScreen('transition');
      setTimeout(() => setCurrentScreen('email'), 1500);
    }
  };

  const handleBack = () => {
    setAnimationDirection('backward');
    if (currentScreen === 'quiz' && questionIndex > 0) {
      setQuestionIndex(i => i - 1);
    } else if (currentScreen === 'quiz' && questionIndex === 0) {
      setCurrentScreen('landing');
    } else if (currentScreen === 'email') {
      setCurrentScreen('quiz');
    } else if (currentScreen === 'results' && resultStep > 0) {
      setResultStep(i => i - 1);
    } else if (currentScreen === 'results' && resultStep === 0) {
      setCurrentScreen('email');
    }
  };

  const handleNext = () => {
    setAnimationDirection('forward');
    if (currentScreen === 'results' && resultStep < 5) {
      setResultStep(i => i + 1);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setAnimationDirection('forward');

    // simulate AI
    const dummy = {
      title: 'The Touring Performer Path',
      icon: '🎤',
      description: 'You thrive on stage energy…'
    };
    setAiResult(dummy);

    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentScreen('results');
      setResultStep(0);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 1500);
  };

  const startQuiz = () => {
    setAnimationDirection('forward');
    setCurrentScreen('quiz');
  };
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
    if (['transition','email'].includes(currentScreen)) return 2;
    if (currentScreen === 'results' && resultStep < 5) return 3;
    if (currentScreen === 'results' && resultStep === 5) return 4;
    return 0;
  };

  if (currentScreen === 'landing') {
    return <LandingPage onStartQuiz={startQuiz} />;
  }

  const masterStage = getMasterStage();
  const screenKey    = `${currentScreen}-${questionIndex}-${resultStep}`;

  return (
    <JourneyLayout
      masterStage={masterStage}
      resultStep={resultStep}
      onBack={handleBack}
      onNext={handleNext}
      currentScreen={currentScreen}
      questionIndex={questionIndex}
      mainRef={mainRef}             {/* <-- pass the ref */}
    >
      <AnimatedContent key={screenKey} direction={animationDirection}>
        {currentScreen === 'quiz' && (
          <QuestionPage
            question={questions[questionIndex]}
            onResponse={handleResponse}
            questionIndex={questionIndex}
            totalQuestions={questions.length}
          />
        )}
        {currentScreen === 'transition' && (
          <TransitionPage
            icon={<Sparkles className="animate-pulse" />}
            title="Analyzing Your Path..."
            subtitle="We're mapping your unique journey"
          />
        )}
        {currentScreen === 'email' && (
          <EmailCapturePage
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        {currentScreen === 'results' && aiResult && (
          <>
            {resultStep === 0 && (
              <ResultsLandingPage
                aiResult={aiResult}
                onBegin={() => { setAnimationDirection('forward'); setResultStep(1); }}
                showConfetti={showConfetti}
              />
            )}
            {resultStep > 0 && resultStep < 5 && (
              <StepPage stepIndex={resultStep-1} aiResult={aiResult} />
            )}
            {resultStep === 5 && (
              <FinalPage responses={responses} aiResult={aiResult} onReset={resetQuiz} />
            )}
          </>
        )}
      </AnimatedContent>
    </JourneyLayout>
  );
};

// --- Layout & Subcomponents ---

const JourneyLayout = ({
  children,
  masterStage,
  resultStep,
  onBack,
  onNext,
  currentScreen,
  questionIndex,
  mainRef                // <-- receive the ref
}) => {
  const stages = [
    { id: 1, title: "Identify Your Path",    icon: <Target className="w-4 h-4"/> },
    { id: 2, title: "Personalized Path",     icon: <MapPin className="w-4 h-4"/> },
    { id: 3, title: "Personalized Plan",     icon: <ListChecks className="w-4 h-4"/> },
    { id: 4, title: "Execute Plan",          icon: <Rocket className="w-4 h-4"/> },
  ];

  const showBackButton      = (currentScreen === 'quiz') || (currentScreen === 'email') || (currentScreen === 'results');
  const showNextButton      = currentScreen === 'results' && resultStep > 0 && resultStep < 4;
  const showFinalPlanButton = currentScreen === 'results' && resultStep === 4;
  const color1 = [29,209,161], color2 = [185,19,114];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 shadow-sm pt-3 pb-2">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-start justify-between relative mb-2 text-center">
            {stages.map(stage => {
              const isActive    = masterStage === stage.id;
              const isCompleted = masterStage > stage.id;
              const stageColor  = `rgb(${interpolateColor(color1,color2,(stage.id-1)/3)})`.replace('rgb(','').replace(')','').split(',').map(Number);
              const borderColor = isActive || isCompleted
                                  ? `rgb(${stageColor.join(',')})`
                                  : '#d1d5db';
              const bgColor     = isCompleted
                                  ? `rgb(${stageColor.join(',')})`
                                  : 'white';
              const textColor   = isCompleted
                                  ? 'white'
                                  : isActive
                                    ? `rgb(${stageColor.join(',')})`
                                    : '#a0aec0';
              return (
                <div key={stage.id} className={`flex-1 transition-all duration-500 z-10 ${masterStage >= stage.id ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                  <div className={`mx-auto mb-1 w-8 h-8 text-sm rounded-full flex items-center justify-center transition-all duration-500 font-bold border-2 ${isActive ? 'scale-110' : ''}`}
                       style={{ borderColor, backgroundColor: bgColor, color: textColor }}>
                    {isCompleted
                      ? <Check className="w-4 h-4"/>
                      : stage.id
                    }
                  </div>
                  <div className="text-[10px] leading-tight sm:text-xs">{stage.title}</div>
                </div>
              );
            })}
            <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10">
              <div
                className="h-1 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] transition-all duration-500"
                style={{ width: `calc(${((masterStage-1)/3)*100}% - 2rem)` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* <-- mainRef applied here --> */}
      <main ref={mainRef} className="flex-grow overflow-y-auto">
        {children}
      </main>

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
              {currentScreen === 'quiz'   && `Question ${questionIndex+1} of ${questions.length}`}
              {currentScreen === 'results'&& resultStep > 0 && resultStep < 5 && `Action Step ${resultStep} of 4`}
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
            {!showNextButton && !showFinalPlanButton && <div className="w-24" />}
          </div>
        </div>
      </footer>
    </div>
  );
};

// (Rest of sub-components: AnimatedContent, LandingPage, QuestionPage, TransitionPage,
//  EmailCapturePage, ResultsLandingPage, StepPage, FinalPage — unchanged from before)

export default HOMEQuizMVP;
