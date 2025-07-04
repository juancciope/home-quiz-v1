import { useState, useEffect } from 'react';
import { Check, Mail, Download } from 'lucide-react';

export default function Success() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1DD1A1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1DD1A1] rounded-full filter blur-[200px] opacity-10" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#B91372] rounded-full filter blur-[200px] opacity-10" />
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-full mb-6 shadow-2xl shadow-[#B91372]/20">
            <Check className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* Success Message */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Your Local Music Industry Map is being prepared and will be delivered to your email within the next few minutes.
        </p>
        
        {/* What's Next */}
        <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">What happens next?</h2>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#1DD1A1] mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Check your email</h3>
                <p className="text-gray-300">Your industry map with 10 curated contacts will arrive shortly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Download className="w-6 h-6 text-[#1DD1A1] mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Download & save</h3>
                <p className="text-gray-300">Keep the contact list handy for future networking opportunities</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-[#1DD1A1] mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Start connecting</h3>
                <p className="text-gray-300">Use the networking tips included to make meaningful connections</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 text-white"
          >
            Take Another Assessment
          </button>
          
          <a
            href="https://homeformusic.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-block px-8 py-4 bg-white/10 backdrop-blur rounded-2xl font-medium transition-all duration-300 hover:bg-white/20 text-white text-center"
          >
            Visit HOME For Music
          </a>
        </div>
        
        {sessionId && (
          <p className="text-xs text-gray-500 mt-8">
            Order ID: {sessionId}
          </p>
        )}
        
        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            Questions about your purchase? Contact us at{' '}
            <a href="mailto:support@homeformusic.app" className="text-[#1DD1A1] hover:underline">
              support@homeformusic.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}