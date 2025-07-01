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
    <div className="min-h-screen-mobile bg-black text-white">{antml:parameter>
<parameter name="old_str">  // Render screens
  return (
    <div className="min-h-screen bg-black text-white">// --- Elegant Streamers Component ---
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
