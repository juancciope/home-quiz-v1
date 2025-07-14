import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
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

  // Generate detailed steps if they don't exist
  const generateDetailedSteps = (pathway) => {
    if (pathway.steps) return pathway.steps;
    
    // Generate detailed steps from nextSteps
    return (pathway.nextSteps || []).map((step, index) => ({
      title: step.step || `Step ${index + 1}`,
      description: step.detail || 'Take action to advance your music career.',
      whyItMatters: `This step is crucial for building your ${pathway.title.toLowerCase()} career. Focus on this to create sustainable growth and lasting impact in your music journey.`,
      actions: [
        step.step || 'Complete this action step',
        'Track your progress and results',
        'Connect with others doing similar work',
        'Document your learnings and wins',
        'Plan your next action based on results'
      ],
      homeResources: pathway.resources?.slice(0, 3) || [
        'Access to HOME community',
        'Mentorship and guidance',
        'Professional development resources'
      ]
    }));
  };

  const detailedSteps = generateDetailedSteps(pathway);

  return (
    <>
      <Head>
        <title>Music Creator Roadmap - {pathway.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          html, body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            background: #000000 !important;
            color: #ffffff !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            line-height: 1.5;
          }
          
          .pdf-container {
            min-height: 100vh;
            background: #000000;
            color: #ffffff;
            padding: 32px;
            font-family: 'Inter', sans-serif;
          }
          
          .header {
            text-align: center;
            margin-bottom: 48px;
          }
          
          .logo {
            height: 32px;
            width: auto;
            margin: 0 auto 32px;
          }
          
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: linear-gradient(135deg, rgba(29, 209, 161, 0.3) 0%, rgba(185, 19, 114, 0.3) 100%);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            margin-bottom: 24px;
            font-size: 14px;
            font-weight: 600;
          }
          
          .main-title {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #ffffff;
          }
          
          .main-description {
            color: #d1d5db;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
          }
          
          .section {
            margin-bottom: 48px;
          }
          
          .section-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 24px;
            text-align: center;
          }
          
          .profile-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .profile-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .profile-right {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          
          .progress-bar {
            width: 120px;
            height: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            overflow: hidden;
          }
          
          .progress-fill {
            height: 100%;
            border-radius: 6px;
          }
          
          .step-item {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 24px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .step-number {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #1DD1A1 0%, #B91372 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            flex-shrink: 0;
          }
          
          .detailed-step {
            margin-bottom: 48px;
            page-break-inside: avoid;
          }
          
          .step-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 16px;
          }
          
          .step-description {
            color: #d1d5db;
            margin-bottom: 24px;
            line-height: 1.6;
          }
          
          .info-box {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 16px;
          }
          
          .info-box-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          
          .action-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
          }
          
          .footer {
            text-align: center;
            margin-top: 64px;
            padding-bottom: 32px;
          }
          
          .footer-text {
            font-size: 14px;
            color: #9ca3af;
          }
          
          .footer-small {
            font-size: 12px;
            color: #6b7280;
            margin-top: 8px;
          }
        `}</style>
      </Head>
      <div className="pdf-container">
        {/* Header */}
        <div className="header">
          <img 
            src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
            alt="HOME"
            className="logo"
          />
          
          <div className="badge">
            <span style={{color: '#1DD1A1'}}>✨</span>
            <span>Your Music Creator Path</span>
            <span style={{color: '#B91372'}}>✨</span>
          </div>

          <h1 className="main-title">{pathway.title}</h1>
          <p className="main-description">{pathway.description}</p>
        </div>

      {/* Creative Profile */}
      <div className="section">
        <h2 className="section-title">Your Creative Profile</h2>
        <div>
          {Object.entries(fuzzyScores).sort((a, b) => b[1] - a[1]).map(([pathway, percentage]) => {
            const info = pathwayInfo[pathway];
            const gradientColors = {
              'from-blue-500 to-purple-600': 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
              'from-pink-500 to-orange-500': 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
              'from-green-500 to-teal-500': 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
            };
            return (
              <div key={pathway} className="profile-item">
                <div className="profile-left">
                  <span style={{fontSize: '24px'}}>{info.icon}</span>
                  <span style={{fontSize: '14px', fontWeight: 500}}>{info.name}</span>
                </div>
                <div className="profile-right">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${percentage}%`,
                        background: gradientColors[info.color] || 'linear-gradient(135deg, #1DD1A1 0%, #B91372 100%)'
                      }}
                    />
                  </div>
                  <span style={{fontSize: '14px', fontWeight: 700, width: '48px', textAlign: 'right'}}>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Roadmap */}
      <div className="section">
        <h2 className="section-title">Your Strategic Roadmap</h2>
        <div>
          {pathway.planPreview && pathway.planPreview.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">
                {index + 1}
              </div>
              <div style={{flex: 1}}>
                <h3 style={{fontWeight: 500, marginBottom: '4px'}}>{step}</h3>
              </div>
            </div>
          ))}
          {pathway.nextSteps && pathway.nextSteps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">
                {index + 1}
              </div>
              <div style={{flex: 1}}>
                <h3 style={{fontWeight: 500, marginBottom: '4px'}}>{step.step}</h3>
                <p style={{fontSize: '14px', color: '#9ca3af'}}>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Action Steps */}
      {detailedSteps && detailedSteps.map((step, index) => (
        <div key={index} className="detailed-step">
          <h2 className="step-title">Step {index + 1}: {step.title}</h2>
          <p className="step-description">{step.description}</p>
          
          <div className="info-box">
            <h3 className="info-box-title">
              <span style={{color: '#B91372'}}>✨</span>
              Why This Matters
            </h3>
            <p style={{fontSize: '14px', color: '#d1d5db'}}>{step.whyItMatters}</p>
          </div>

          <div className="info-box">
            <h3 className="info-box-title">
              <span style={{color: '#1DD1A1'}}>🎯</span>
              Your Action Items
            </h3>
            <div>
              {step.actions && step.actions.map((action, i) => (
                <div key={i} className="action-item">
                  <span style={{color: '#1DD1A1', fontSize: '16px', marginTop: '2px', flexShrink: 0}}>✓</span>
                  <p style={{fontSize: '14px', color: '#d1d5db'}}>{action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="info-box">
            <h3 className="info-box-title">
              <img 
                src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
                alt="HOME"
                style={{height: '20px', width: 'auto'}}
              />
              HOME Resources
            </h3>
            <div>
              {step.homeResources && step.homeResources.map((resource, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '8px'
                }}>
                  <p style={{fontSize: '14px'}}>{resource}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="footer">
        <p className="footer-text">Generated on {new Date().toLocaleDateString()}</p>
        <p className="footer-small">homeformusic.app</p>
      </div>
      </div>
    </>
  );
}