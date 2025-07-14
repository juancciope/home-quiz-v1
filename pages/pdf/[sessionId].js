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

export default function PDFView() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (sessionId) {
      // Retrieve data from sessionStorage or fetch from API
      const storedData = sessionStorage.getItem(`pdf-data-${sessionId}`);
      if (storedData) {
        setData(JSON.parse(storedData));
        setLoading(false);
      }
    }
  }, [sessionId]);

  if (loading) return <div className="min-h-screen bg-black" />;
  if (!data) return <div className="min-h-screen bg-black text-white p-8">No data found</div>;

  const { pathway, fuzzyScores, pathwayBlend, responses } = data;

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
          {pathway.planPreview.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{step}</h3>
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
              {step.actions.map((action, i) => (
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
              {step.homeResources.map((resource, i) => (
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