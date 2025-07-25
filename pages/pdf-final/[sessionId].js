export async function getServerSideProps(context) {
  const { sessionId } = context.query;
  
  let pathwayData = null;
  
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    console.log('Fetching data for session:', sessionId);
    const response = await fetch(`${baseUrl}/api/pdf-data?sessionId=${sessionId}`, {
      headers: { 'User-Agent': 'PDF-Generator' }
    });
    
    if (response.ok) {
      pathwayData = await response.json();
      console.log('Data retrieved:', !!pathwayData, Object.keys(pathwayData || {}));
    } else {
      console.log('Response not OK:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
  
  return { props: { sessionId, pathwayData } };
}

export default function PDFPage({ sessionId, pathwayData }) {
  console.log('PDF Page rendering with data:', !!pathwayData);
  
  if (!pathwayData) {
    return (
      <html>
        <head><title>No Data</title></head>
        <body style={{background: '#000', color: '#fff', padding: '20px', fontFamily: 'Montserrat, sans-serif'}}>
          <h1>No PDF data found</h1>
          <p>Session: {sessionId}</p>
          <p>Please try regenerating the PDF</p>
        </body>
      </html>
    );
  }

  const { pathway, fuzzyScores, pathwayBlend } = pathwayData;
  
  return (
    <html>
      <head>
        <title>Music Creator Roadmap</title>
        <meta charSet="utf-8" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #000; 
            color: #fff; 
            line-height: 1.4; 
            padding: 25px;
            font-size: 14px;
          }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin: 15px 0; }
          .description { color: #ccc; margin-bottom: 25px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; text-align: center; }
          .profile-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 10px; 
            padding: 8px 0;
          }
          .profile-left { display: flex; align-items: center; gap: 10px; }
          .profile-right { display: flex; align-items: center; gap: 10px; }
          .progress-bar { 
            width: 100px; 
            height: 8px; 
            background: rgba(255,255,255,0.2); 
            border-radius: 4px;
          }
          .progress-fill { height: 100%; border-radius: 4px; }
          .step-item { 
            display: flex; 
            gap: 12px; 
            margin-bottom: 15px; 
            padding: 12px; 
            background: rgba(255,255,255,0.05); 
            border-radius: 8px;
          }
          .step-number { 
            width: 30px; 
            height: 30px; 
            background: linear-gradient(135deg, #1DD1A1, #B91372); 
            border-radius: 6px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: bold; 
            flex-shrink: 0;
          }
          .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
        `}</style>
      </head>
      <body>
        <div className="header">
          <img 
            src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
            alt="HOME" 
            style={{height: '30px', marginBottom: '20px'}}
          />
          <div style={{
            background: 'linear-gradient(135deg, rgba(29,209,161,0.2), rgba(185,19,114,0.2))', 
            border: '1px solid rgba(255,255,255,0.2)', 
            borderRadius: '15px', 
            padding: '8px 16px', 
            display: 'inline-block', 
            marginBottom: '15px',
            fontSize: '12px'
          }}>
            ✨ Your Music Creator Roadmap ✨
          </div>
          <h1 className="title">{pathway?.title || 'Your Music Path'}</h1>
          <p className="description">{pathway?.description || 'Your personalized roadmap to music success'}</p>
        </div>

        {/* Creative Profile */}
        <div className="section">
          <h2 className="section-title">Your Creative Profile</h2>
          {fuzzyScores && Object.entries(fuzzyScores).sort((a, b) => b[1] - a[1]).map(([key, percentage]) => {
            const pathwayInfo = {
              'touring-performer': { name: 'Touring Performer', icon: '🎤', color: '#3b82f6' },
              'creative-artist': { name: 'Creative Artist', icon: '🎨', color: '#ec4899' },
              'writer-producer': { name: 'Writer/Producer', icon: '🎹', color: '#10b981' }
            };
            const info = pathwayInfo[key] || { name: key, icon: '🎵', color: '#1DD1A1' };
            
            return (
              <div key={key} className="profile-item">
                <div className="profile-left">
                  <span style={{fontSize: '18px'}}>{info.icon}</span>
                  <span>{info.name}</span>
                </div>
                <div className="profile-right">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${percentage}%`, background: info.color}}
                    />
                  </div>
                  <span style={{fontWeight: 'bold', minWidth: '35px'}}>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pathway Blend */}
        {pathwayBlend && (
          <div className="section">
            <h2 className="section-title">Your Profile Type</h2>
            <div style={{background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px'}}>
              <p><strong>Primary:</strong> {pathwayBlend.primary?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p><strong>Secondary:</strong> {pathwayBlend.secondary?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p><strong>Type:</strong> {pathwayBlend.description}</p>
            </div>
          </div>
        )}

        {/* Strategic Steps */}
        <div className="section">
          <h2 className="section-title">Your Strategic Roadmap</h2>
          {pathway?.nextSteps && pathway.nextSteps.slice(0, 4).map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{index + 1}</div>
              <div>
                <h3 style={{fontWeight: 'bold', marginBottom: '5px'}}>{step.step || step.title}</h3>
                <p style={{color: '#ccc', fontSize: '13px'}}>{step.detail || step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Action Steps */}
        <div className="section">
          <h2 className="section-title">Complete Action Plan</h2>
          {pathway?.nextSteps && pathway.nextSteps.map((step, index) => (
            <div key={index} style={{
              marginBottom: '20px', 
              padding: '15px', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>
                Step {index + 1}: {step.step || step.title}
              </h3>
              <p style={{color: '#ccc', marginBottom: '12px', fontSize: '13px'}}>
                {step.detail || step.description}
              </p>
              
              <div style={{background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', marginBottom: '8px'}}>
                <h4 style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '5px'}}>
                  ✨ Why This Matters
                </h4>
                <p style={{fontSize: '12px', color: '#ddd'}}>
                  This step builds the foundation for sustainable growth in your music career. 
                  Focus here to create lasting impact and open new opportunities.
                </p>
              </div>

              <div style={{background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px'}}>
                <h4 style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '5px'}}>
                  🎯 Action Items
                </h4>
                <div style={{fontSize: '12px', color: '#ddd'}}>
                  <div style={{marginBottom: '3px'}}>✓ {step.step || 'Complete this strategic action'}</div>
                  <div style={{marginBottom: '3px'}}>✓ Set measurable goals and deadlines</div>
                  <div style={{marginBottom: '3px'}}>✓ Connect with others in your field</div>
                  <div>✓ Track progress and optimize approach</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HOME Connection */}
        {pathway?.homeConnection && (
          <div className="section">
            <h2 className="section-title">Your HOME Connection</h2>
            <div style={{
              background: 'linear-gradient(135deg, rgba(29,209,161,0.1), rgba(185,19,114,0.1))', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid rgba(29,209,161,0.3)'
            }}>
              <p style={{fontSize: '13px', lineHeight: '1.5'}}>{pathway.homeConnection}</p>
            </div>
          </div>
        )}

        <div className="footer">
          <p>Generated on {new Date().toLocaleDateString()}</p>
          <p>homeformusic.app</p>
        </div>
      </body>
    </html>
  );
}