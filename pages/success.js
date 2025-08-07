import { useState, useEffect } from 'react';
import { Check, Mail, Download } from 'lucide-react';

export default function Success() {
  const [sessionId, setSessionId] = useState(null);
  const [pdfSessionId, setPdfSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Get URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    const pdfSessionParam = urlParams.get('pdf_session');
    const paymentSuccessParam = urlParams.get('payment_success');
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
    
    if (pdfSessionParam) {
      setPdfSessionId(pdfSessionParam);
    }
    
    if (paymentSuccessParam === 'true') {
      setPaymentSuccess(true);
    }
    
    setLoading(false);
  }, []);

  const handlePDFDownload = async () => {
    if (!sessionId || !pdfSessionId) {
      alert('Missing session information for PDF download');
      return;
    }

    try {
      setDownloading(true);
      console.log('📥 Downloading PDF after payment verification...');

      // Check if we have pre-generated PDF in localStorage
      const pdfDataKey = `pdfData_${pdfSessionId}`;
      const storedPdfData = localStorage.getItem(pdfDataKey);
      
      if (storedPdfData) {
        console.log('📄 Using stored PDF data for download...');
        
        // Verify payment first, then download
        const response = await fetch(`/api/download-pdf?session_id=${sessionId}&pdf_session=${pdfSessionId}`);
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `music-creator-roadmap-${pdfSessionId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          console.log('✅ PDF downloaded successfully');
        } else {
          throw new Error('Failed to download PDF');
        }
      } else {
        alert('PDF data not found. Please return to the main page and complete the assessment again.');
      }
    } catch (error) {
      console.error('❌ PDF download error:', error);
      alert('Error downloading PDF. Please try again or contact support.');
    } finally {
      setDownloading(false);
    }
  };

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
          {paymentSuccess 
            ? "Your personalized Music Creator Roadmap PDF is ready for download!" 
            : "Thank you for your purchase!"}
        </p>
        
        {/* PDF Download Section */}
        {paymentSuccess && pdfSessionId && (
          <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Download Your Roadmap</h2>
            
            <div className="text-center">
              <button
                onClick={handlePDFDownload}
                disabled={downloading}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                {downloading ? 'Downloading...' : 'Download Your PDF Roadmap'}
              </button>
              
              <p className="text-sm text-gray-400 mt-4">
                Your personalized music career roadmap with action steps and resources
              </p>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">What's in your roadmap?</h2>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-[#1DD1A1] mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Personalized Action Steps</h3>
                <p className="text-gray-300">Tailored next steps based on your specific music career goals</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-[#1DD1A1] mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Strategic Resources</h3>
                <p className="text-gray-300">Curated tools and resources matched to your pathway</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-[#1DD1A1] mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">HOME Connection</h3>
                <p className="text-gray-300">How HOME's community and facilities can accelerate your growth</p>
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