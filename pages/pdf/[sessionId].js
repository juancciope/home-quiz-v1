import React from 'react';
import { useRouter } from 'next/router';
import { 
  Sparkles, 
  Target, 
  MapPin, 
  ListChecks,
  Check,
  Music
} from 'lucide-react';

export async function getServerSideProps(context) {
  const { sessionId, data } = context.query;
  
  let pathwayData = null;
  
  // Try to get data from query parameter (base64 encoded)
  if (data) {
    try {
      pathwayData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    } catch (error) {
      console.error('Error parsing pathway data:', error);
    }
  }
  
  return {
    props: {
      sessionId: sessionId || null,
      pathwayData,
    },
  };
}

export default function PDFView({ sessionId, pathwayData }) {
  const router = useRouter();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (pathwayData) {
      // Use server-side data
      console.log('PDF Data received:', pathwayData);
      setData(pathwayData);
      setLoading(false);
    } else if (sessionId) {
      // Fallback: try sessionStorage for client-side navigation
      const storedData = sessionStorage.getItem(`pdf-data-${sessionId}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('PDF Data from storage:', parsedData);
        setData(parsedData);
        setLoading(false);
      } else {
        // No data found
        console.log('No PDF data found for session:', sessionId);
        setLoading(false);
      }
    }
  }, [sessionId, pathwayData]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!data) return <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">PDF Data Not Found</h1>
      <p className="text-gray-400">Session ID: {sessionId}</p>
      <p className="text-gray-400 mt-2">Please regenerate your PDF from the quiz results.</p>
    </div>
  </div>;

  const { pathway, fuzzyScores, pathwayBlend, responses } = data;

  // Validate required data
  if (!pathway || !fuzzyScores) {
    return <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid PDF Data</h1>
        <p className="text-gray-400">Missing pathway or scores data</p>
        <p className="text-gray-400 mt-2">Please regenerate your PDF from the quiz results.</p>
      </div>
    </div>;
  }

  const pathwayInfo = {
    'touring-performer': { name: 'Touring Performer', icon: '🎤', color: 'from-blue-500 to-purple-600' },
    'creative-artist': { name: 'Creative Artist', icon: '🎨', color: 'from-pink-500 to-orange-500' },
    'writer-producer': { name: 'Writer/Producer', icon: '🎹', color: 'from-green-500 to-teal-500' }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <img 
          src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
          alt="HOME"
          className="h-8 w-auto mx-auto mb-8"
        />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
          <Sparkles className="w-4 h-4 text-[#1DD1A1]" />
          <span className="text-sm font-semibold">Your Music Creator Path</span>
          <Sparkles className="w-4 h-4 text-[#B91372]" />
        </div>

        <h1 className="text-3xl font-bold mb-4">{pathway.title}</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">{pathway.description}</p>
      </div>

      {/* Creative Profile */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-center">Your Creative Profile</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {Object.entries(fuzzyScores).sort((a, b) => b[1] - a[1]).map(([pathway, percentage]) => {
            const info = pathwayInfo[pathway];
            return (
              <div key={pathway} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{info.icon}</span>
                  <span className="text-sm font-medium">{info.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${info.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Roadmap */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-center">Your Strategic Roadmap</h2>
        <div className="space-y-6 max-w-2xl mx-auto">
          {pathway.planPreview && pathway.planPreview.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{step}</h3>
              </div>
            </div>
          ))}
          {pathway.nextSteps && pathway.nextSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{step.step}</h3>
                <p className="text-sm text-gray-400">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Action Steps */}
      {pathway.steps && pathway.steps.map((step, index) => (
        <div key={index} className="mb-12 break-inside-avoid">
          <h2 className="text-xl font-bold mb-4">Step {index + 1}: {step.title}</h2>
          <p className="text-gray-300 mb-6">{step.description}</p>
          
          <div className="bg-white/5 rounded-lg p-6 mb-4">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-3">
              <Sparkles className="w-5 h-5 text-[#B91372]" />
              Why This Matters
            </h3>
            <p className="text-sm text-gray-300">{step.whyItMatters}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 mb-4">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
              <Target className="w-5 h-5 text-[#1DD1A1]" />
              Your Action Items
            </h3>
            <div className="space-y-3">
              {step.actions && step.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#1DD1A1] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
                alt="HOME"
                className="h-5 w-auto"
              />
              HOME Resources
            </h3>
            <div className="space-y-2">
              {step.homeResources && step.homeResources.map((resource, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm">{resource}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="text-center mt-16 pb-8">
        <p className="text-sm text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
        <p className="text-xs text-gray-500 mt-2">homeformusic.app</p>
      </div>
    </div>
  );
}