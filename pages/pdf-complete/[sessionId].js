export async function getServerSideProps(context) {
  const { sessionId } = context.query;
  
  let pathwayData = null;
  
  try {
    // Fetch data from our API endpoint
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/pdf-data?sessionId=${sessionId}`);
    
    if (response.ok) {
      pathwayData = await response.json();
      console.log('📦 Data retrieved successfully for session:', sessionId);
    } else {
      console.error('Failed to retrieve data, status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching PDF data:', error);
  }
  
  return {
    props: { sessionId: sessionId || null, pathwayData },
  };
}

export default function CompletePDFView({ sessionId, pathwayData }) {
  if (!pathwayData) {
    return (
      <html>
        <head>
          <title>Music Creator Roadmap</title>
          <style dangerouslySetInnerHTML={{__html: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
              background: #000; 
              color: #fff; 
              line-height: 1.4; 
              font-size: 14px;
            }
          `}} />
        </head>
        <body>
          <div style={{padding: '20px', textAlign: 'center'}}>
            <h1>No PDF data found</h1>
            <p>Session: {sessionId}</p>
          </div>
        </body>
      </html>
    );
  }

  const { pathway, fuzzyScores, pathwayBlend, responses } = pathwayData;
  
  // Generate detailed steps with ALL information
  const generateCompleteSteps = (pathwayData) => {
    const pathway = pathwayData.pathway;
    if (!pathway) return [];
    
    // Use AI-generated steps if available, otherwise create comprehensive steps
    const baseSteps = pathway.nextSteps || pathway.steps || [];
    
    return baseSteps.map((step, index) => {
      // Enhanced step data with all details
      const stepData = typeof step === 'string' ? { step, detail: '' } : step;
      
      return {
        number: index + 1,
        title: stepData.step || stepData.title || `Action Step ${index + 1}`,
        description: stepData.detail || stepData.description || `Take targeted action to advance your ${pathway.title?.toLowerCase() || 'music'} career.`,
        whyItMatters: stepData.whyItMatters || `This step is crucial for building your ${pathway.title?.toLowerCase() || 'music'} career. Mastering this creates sustainable growth, opens new opportunities, and builds the foundation for long-term success in the music industry.`,
        actionItems: stepData.actions || [
          stepData.step || `Complete this strategic action`,
          'Set specific, measurable goals for this step',
          'Connect with others who have succeeded in this area',
          'Document your progress and learnings',
          'Create accountability systems to stay consistent',
          'Track results and optimize your approach'
        ],
        homeResources: pathway.resources?.slice(0, 3) || [
          'HOME Community Access',
          'Expert Mentorship Program', 
          'Professional Development Resources'
        ]
      };
    });
  };

  const completeSteps = generateCompleteSteps(pathwayData);
  
  const pathwayColors = {
    'touring-performer': '#3b82f6',
    'creative-artist': '#ec4899', 
    'writer-producer': '#10b981'
  };

  return (
    <html>
      <head>
        <title>Music Creator Roadmap - {pathway?.title || 'Your Path'}</title>
        <meta charSet="utf-8" />
        <style dangerouslySetInnerHTML={{__html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: #000000; 
            color: #ffffff; 
            line-height: 1.5; 
            font-size: 14px;
            padding: 30px;
          }
          .container { max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { height: 35px; margin-bottom: 25px; }
          .badge { 
            background: linear-gradient(135deg, rgba(29,209,161,0.2), rgba(185,19,114,0.2)); 
            border: 1px solid rgba(255,255,255,0.2); 
            border-radius: 20px; 
            padding: 10px 20px; 
            display: inline-block; 
            margin-bottom: 20px; 
            font-size: 13px; 
            font-weight: 600;
          }
          .main-title { font-size: 28px; font-weight: 700; margin-bottom: 15px; }
          .main-desc { color: #d1d5db; max-width: 600px; margin: 0 auto 40px; }
          .section { margin-bottom: 35px; }
          .section-title { font-size: 20px; font-weight: 600; margin-bottom: 20px; text-align: center; }
          .profile-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 12px; 
            padding: 10px 0;
          }
          .profile-left { display: flex; align-items: center; gap: 10px; }
          .profile-right { display: flex; align-items: center; gap: 12px; }
          .progress-bar { 
            width: 120px; 
            height: 10px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 5px; 
            overflow: hidden;
          }
          .roadmap-item { 
            display: flex; 
            gap: 15px; 
            margin-bottom: 20px; 
            padding: 15px; 
            background: rgba(255,255,255,0.03); 
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .step-number { 
            width: 35px; 
            height: 35px; 
            background: linear-gradient(135deg, #1DD1A1, #B91372); 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: 700; 
            flex-shrink: 0;
          }
          .detailed-step { 
            margin-bottom: 35px; 
            page-break-inside: avoid;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 25px;
            background: rgba(255,255,255,0.02);
          }
          .step-title { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
          .step-desc { color: #d1d5db; margin-bottom: 20px; }
          .info-box { 
            background: rgba(255,255,255,0.05); 
            border-radius: 8px; 
            padding: 18px; 
            margin-bottom: 15px;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .info-title { 
            font-size: 16px; 
            font-weight: 700; 
            margin-bottom: 10px; 
            display: flex; 
            align-items: center; 
            gap: 8px;
          }
          .action-item { 
            display: flex; 
            gap: 10px; 
            margin-bottom: 8px; 
            align-items: flex-start;
          }
          .check { color: #1DD1A1; font-weight: 700; flex-shrink: 0; }
          .footer { text-align: center; margin-top: 40px; }
          .footer-text { color: #9ca3af; font-size: 12px; }
        `}} />
      </head>
      <body>
        <div className="container">
          {/* Header */}
          <div className="header">
            <img 
              src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
              alt="HOME"
              className="logo"
            />
            <div className="badge">
              ✨ Your Complete Music Creator Roadmap ✨
            </div>
            <h1 className="main-title">{pathway?.title || 'Your Music Creator Path'}</h1>
            <p className="main-desc">{pathway?.description || 'Your personalized roadmap to music success.'}</p>
          </div>

          {/* Creative Profile */}
          <div className="section">
            <h2 className="section-title">Your Creative Profile</h2>
            {fuzzyScores && Object.entries(fuzzyScores).sort((a, b) => b[1] - a[1]).map(([pathwayKey, percentage]) => {
              const pathwayInfo = {
                'touring-performer': { name: 'Touring Performer', icon: '🎤' },
                'creative-artist': { name: 'Creative Artist', icon: '🎨' },
                'writer-producer': { name: 'Writer/Producer', icon: '🎹' }
              };
              const info = pathwayInfo[pathwayKey] || { name: pathwayKey, icon: '🎵' };
              const color = pathwayColors[pathwayKey] || '#1DD1A1';
              
              return (
                <div key={pathwayKey} className="profile-item">
                  <div className="profile-left">
                    <span style={{fontSize: '20px'}}>{info.icon}</span>
                    <span style={{fontWeight: '500'}}>{info.name}</span>
                  </div>
                  <div className="profile-right">
                    <div className="progress-bar">
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '5px'
                      }} />
                    </div>
                    <span style={{fontWeight: '700', minWidth: '40px', textAlign: 'right'}}>{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Multi-Pathway Analysis */}
          {pathwayBlend && (
            <div className="section">
              <h2 className="section-title">Your Multi-Pathway Profile</h2>
              <div style={{background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)'}}>
                <p style={{marginBottom: '10px'}}><strong>Primary Path:</strong> {pathwayBlend.primary?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p style={{marginBottom: '10px'}}><strong>Secondary Interest:</strong> {pathwayBlend.secondary?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p><strong>Profile Type:</strong> {pathwayBlend.description}</p>
              </div>
            </div>
          )}

          {/* Strategic Roadmap Overview */}
          <div className="section">
            <h2 className="section-title">Your Strategic Roadmap</h2>
            {completeSteps.slice(0, 4).map((step, index) => (
              <div key={index} className="roadmap-item">
                <div className="step-number">{step.number}</div>
                <div>
                  <h3 style={{fontWeight: '600', marginBottom: '5px'}}>{step.title}</h3>
                  <p style={{color: '#d1d5db', fontSize: '13px'}}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Action Steps */}
          <div className="section">
            <h2 className="section-title">Complete Action Plan</h2>
            {completeSteps.map((step, index) => (
              <div key={index} className="detailed-step">
                <h3 className="step-title">Step {step.number}: {step.title}</h3>
                <p className="step-desc">{step.description}</p>
                
                <div className="info-box">
                  <div className="info-title">
                    <span style={{color: '#B91372'}}>✨</span>
                    Why This Matters
                  </div>
                  <p style={{fontSize: '13px', color: '#d1d5db'}}>{step.whyItMatters}</p>
                </div>

                <div className="info-box">
                  <div className="info-title">
                    <span style={{color: '#1DD1A1'}}>🎯</span>
                    Your Action Items
                  </div>
                  {step.actionItems.map((action, i) => (
                    <div key={i} className="action-item">
                      <span className="check">✓</span>
                      <span style={{fontSize: '13px', color: '#d1d5db'}}>{action}</span>
                    </div>
                  ))}
                </div>

                <div className="info-box">
                  <div className="info-title">
                    <span style={{color: '#1DD1A1'}}>🏠</span>
                    HOME Resources
                  </div>
                  {step.homeResources.map((resource, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      marginBottom: '5px',
                      fontSize: '13px'
                    }}>
                      {resource}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* HOME Connection */}
          {pathway?.homeConnection && (
            <div className="section">
              <h2 className="section-title">Your HOME Connection</h2>
              <div style={{background: 'rgba(29,209,161,0.1)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(29,209,161,0.3)'}}>
                <p style={{lineHeight: '1.6'}}>{pathway.homeConnection}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="footer">
            <p className="footer-text">Generated on {new Date().toLocaleDateString()}</p>
            <p className="footer-text" style={{marginTop: '5px'}}>homeformusic.app</p>
          </div>
        </div>
      </body>
    </html>
  );
}