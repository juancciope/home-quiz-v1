import React, { useState, useEffect } from 'react';
import { ChevronRight, Home, Mail, ArrowRight, Check, Users, Star, Loader, ChevronLeft, MapPin, UserCheck, ListChecks, PenSquare, Eye, Award, Rocket } from 'lucide-react';

// Main Component
const HOMEQuizMVP = () => {
  const [currentStep, setCurrentStep] = useState('landing');
  const [responses, setResponses] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentResultStep, setCurrentResultStep] = useState(0); 
  const [previousResultStep, setPreviousResultStep] = useState(0);

  useEffect(() => {
    setPreviousResultStep(currentResultStep);
  }, [currentResultStep]);

  const questions = [
    { id: 'motivation', question: "What drives your music career ambitions?", options: [ { value: 'live-performance', label: 'The energy of a live audience and performing music from the stage' }, { value: 'artistic-expression', label: 'Artistic expression through recording music and building a loyal following online' }, { value: 'collaboration', label: 'Making great songs and collaborating with other talented creators' } ] },
    { id: 'ideal-day', question: "Describe your ideal workday as a music professional:", options: [ { value: 'performing-travel', label: 'Traveling to a new city to perform for a live audience' }, { value: 'releasing-music', label: 'Releasing a new song that you are really proud of' }, { value: 'writing-creating', label: 'Writing the best song that you have ever written' } ] },
    { id: 'success-vision', question: "When you imagine success 5 years from now, you see yourself:", options: [ { value: 'touring-headliner', label: 'Headlining major tours and playing sold out shows around the world' }, { value: 'passive-income-artist', label: 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions' }, { value: 'hit-songwriter', label: 'Having multiple major hit songs that you collaborated on and earning \'mailbox money\' through sync placements and other royalty streams' } ] },
    { id: 'current-stage', question: "Which best describes your current stage?", options: [ { value: 'planning', label: 'Planning Stage - Figuring out my path and building foundations' }, { value: 'production', label: 'Production Stage - Actively creating and releasing work' }, { value: 'scale', label: 'Scale Stage - Already making the majority of my income from music and looking to grow my business' } ] },
    { id: 'biggest-challenge', question: "What's the biggest thing holding your music journey back right now?", options: [ { value: 'performance-opportunities', label: 'I need more opportunities to perform and grow my live audience' }, { value: 'brand-audience', label: 'I\'m creating great content, but struggle to build a consistent brand and online audience' }, { value: 'collaboration-income', label: 'I work behind the scenes, but need better access to collaborators, placements, and consistent income' } ] }
  ];

  const questionIDs = questions.map(q => q.id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);

  const handleResponse = (questionId, value) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);
    
    const currentIndex = questionIDs.indexOf(questionId);
    if (currentIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentIndex + 1);
    } else {
      setCurrentStep('email-capture-transition');
      setTimeout(() => setCurrentStep('email-capture'), 2000); // Transition to email capture
    }
  };
  
  const handleNext = () => {
    if (currentStep === 'results') {
      if (currentResultStep < 5) {
        setCurrentResultStep(currentResultStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentQuestionIndex === 0) {
      setCurrentQuestionIndex(-1);
      setCurrentStep('landing');
    } else if (currentStep === 'results') {
        if(currentResultStep > 0) {
            setCurrentResultStep(currentResultStep - 1);
        } else {
            setCurrentStep('email-capture');
        }
    } else if(currentStep === 'email-capture') {
        setCurrentStep('quiz');
        setCurrentQuestionIndex(questions.length - 1);
    }
  };

  // Logic to start the quiz
  const startQuiz = () => {
    setCurrentStep('quiz');
    setCurrentQuestionIndex(0);
  };
  
  // Data fetching and submission logic remains the same...
  const getExpandedStepContent = (pathway, stepIndex) => {
    const pathwayKey = pathway.toLowerCase().includes('touring') ? 'touring-performer' :
                      pathway.toLowerCase().includes('creative') ? 'creative-artist' : 
                      'writer-producer';
    return expandedStepContent[pathwayKey]?.[stepIndex] || null;
  };
  const handleEmailSubmit = async () => { /* ... same as before ... */ };
  const generateAIResult = async (responses) => { /* ... same as before ... */ };
  const determinePathwayFallback = (responses) => { /* ... same as before ... */ };

  // Determine master stage for navigator
  const getMasterStage = () => {
    if (currentStep === 'quiz') return 1;
    if (currentStep === 'email-capture-transition' || currentStep === 'email-capture') return 2;
    if (currentStep === 'results' && currentResultStep > 0 && currentResultStep < 5) return 3;
    if (currentStep === 'results' && currentResultStep === 5) return 4;
    return 0;
  };
  const masterStage = getMasterStage();

  // Render landing page or the main journey layout
  if (currentStep === 'landing') {
    return <LandingPage onStartQuiz={startQuiz} />;
  }

  return (
    <JourneyLayout masterStage={masterStage} onBack={handleBack} onNext={handleNext} currentStep={currentStep} currentResultStep={currentResultStep}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Quiz Questions */}
        {questions.map((q, index) => (
            <StepContent key={q.id} isCurrent={currentStep === 'quiz' && currentQuestionIndex === index} isPrevious={currentStep === 'quiz' && currentQuestionIndex > index}>
                <QuestionPage question={q} onResponse={handleResponse} />
            </StepContent>
        ))}
        {/* Email Capture Transition */}
        <StepContent isCurrent={currentStep === 'email-capture-transition'} isPrevious={currentStep === 'quiz'}>
             <TransitionPage icon={<Loader className="animate-spin" />} title="Fantastic." subtitle="Analyzing your responses to pinpoint your place on the roadmap..." />
        </StepContent>
        {/* Email Capture */}
        <StepContent isCurrent={currentStep === 'email-capture'} isPrevious={currentStep === 'email-capture-transition'}>
             <EmailCapturePage email={email} setEmail={setEmail} onSubmit={handleEmailSubmit} isSubmitting={isSubmitting} />
        </StepContent>
        {/* Results */}
        {aiResult && (
            <>
                <StepContent isCurrent={currentStep === 'results' && currentResultStep === 0} isPrevious={currentStep === 'email-capture'}>
                    <ResultsLandingPage aiResult={aiResult} getExpandedStepContent={getExpandedStepContent} onBegin={() => setCurrentResultStep(1)} />
                </StepContent>
                {[...Array(4)].map((_, i) => (
                    <StepContent key={i} isCurrent={currentStep === 'results' && currentResultStep === i + 1} isPrevious={currentStep === 'results' && currentResultStep > i+1}>
                         <StepPage stepIndex={i} aiResult={aiResult} getExpandedStepContent={getExpandedStepContent} />
                    </StepContent>
                ))}
                 <StepContent isCurrent={currentStep === 'results' && currentResultStep === 5} isPrevious={currentStep === 'results' && currentResultStep > 5}>
                    <FinalPage responses={responses} aiResult={aiResult} getExpandedStepContent={getExpandedStepContent} />
                </StepContent>
            </>
        )}
      </div>
    </JourneyLayout>
  );
};

// --- Sub-Components for Readability ---

const JourneyLayout = ({ children, masterStage, onBack, onNext, currentStep, currentResultStep }) => {
    const stageTitles = ["Discovery", "Analysis", "Your Roadmap", "Next Steps"];
    const showBackButton = masterStage > 0 && !(currentStep === 'results' && currentResultStep === 0);
    const showNextButton = currentStep === 'results' && currentResultStep > 0 && currentResultStep < 5;
    
    return (
        <div className="min-h-[100svh] bg-gray-50 flex flex-col" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <style jsx global>{`
                /* Animation styles */
                .step-content {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    inset: 0;
                    transition: transform 0.5s cubic-bezier(0.45, 0, 0.55, 1), opacity 0.5s cubic-bezier(0.45, 0, 0.55, 1);
                }
                .step-content.is-current {
                    transform: translateX(0%);
                    opacity: 1;
                    z-index: 10;
                }
                .step-content.is-previous {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                .step-content.is-next {
                    transform: translateX(100%);
                    opacity: 0;
                }
            `}</style>
             <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-20 shadow-sm">
                <div className="container max-w-4xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-center">
                        {[...Array(4)].map((_, i) => (
                            <React.Fragment key={i}>
                                <div className={`text-center transition-all duration-300 ${masterStage >= i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                                    <div className="text-sm font-bold">{stageTitles[i]}</div>
                                </div>
                                {i < 3 && (
                                <div className={`h-1 mx-4 flex-1 transition-all duration-300 rounded-full ${masterStage > i + 1 ? 'bg-gradient-to-r from-[#1DD1A1] to-[#B91372]' : 'bg-gray-200'}`}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </header>
            <main className="flex-grow w-full relative">
                {children}
            </main>
            <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm z-20 border-t border-gray-200">
                <div className="container max-w-4xl mx-auto px-6 py-3 flex justify-between items-center">
                    <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium flex items-center transition-opacity" style={{opacity: showBackButton ? 1 : 0}}>
                        <ChevronLeft className="w-5 h-5 mr-1" /> Back
                    </button>
                    <button onClick={onNext} className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center" style={{opacity: showNextButton ? 1 : 0, pointerEvents: showNextButton ? 'auto' : 'none'}}>
                        Next Step <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

const StepContent = ({ isCurrent, isPrevious, children }) => {
    const stateClass = isCurrent ? 'is-current' : isPrevious ? 'is-previous' : 'is-next';
    return <div className={`step-content ${stateClass}`}>{children}</div>;
};

const LandingPage = ({ onStartQuiz }) => ( /* ... same as before, but with onStartQuiz ... */ );
const QuestionPage = ({ question, onResponse }) => ( /* ... render question and options ... */ );
const TransitionPage = ({icon, title, subtitle}) => ( /* ... show loader and text ... */ );
const EmailCapturePage = ({ email, setEmail, onSubmit, isSubmitting }) => ( /* ... render email form ... */ );
const ResultsLandingPage = ({ aiResult, getExpandedStepContent, onBegin }) => {
    const summarySteps = [...Array(4)].map((_,i) => getExpandedStepContent(aiResult.title, i)?.title);
    return (
        <div className="min-h-full flex items-center justify-center p-4">
            <div className="text-center bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl">
                <div className="inline-block bg-gradient-to-br from-[#1DD1A1] to-[#B91372] text-white p-6 rounded-3xl mb-6 shadow-lg">
                    <div className="text-5xl md:text-6xl">{aiResult.icon}</div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{aiResult.title}</h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">Based on your answers, you've unlocked the first steps of your personalized journey.</p>
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Here's What You've Unlocked:</h3>
                    <div className="space-y-3">
                        {summarySteps.map((title, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1DD1A1] to-[#B91372] text-white flex items-center justify-center font-bold mr-4">{index + 1}</div>
                                <span className="font-semibold text-gray-700">{title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={onBegin} className="bg-gradient-to-r from-[#1DD1A1] to-[#B91372] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center">
                    Begin Your Journey <ChevronRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};
const StepPage = ({ stepIndex, aiResult, getExpandedStepContent }) => ( /* ... same as previous version ... */ );
const FinalPage = ({ responses, aiResult, getExpandedStepContent }) => ( /* ... same as previous version ... */ );


// Full component definitions for brevity.
// In a real app, these would be in separate files.
const expandedStepContent = { /* ... same as before ... */ };

export default HOMEQuizMVP;
