import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const { sessionId, data } = context.query;
  
  console.log('PDF View - SessionId:', sessionId);
  console.log('PDF View - Data param exists:', !!data);
  
  let pathwayData = null;
  if (data) {
    try {
      // Decode base64 and clean the string
      const decodedString = Buffer.from(data, 'base64').toString('utf-8');
      console.log('PDF View - Decoded string length:', decodedString.length);
      
      // Clean control characters that could break JSON parsing
      const cleanedString = decodedString.replace(/[\x00-\x1F\x7F]/g, '');
      
      pathwayData = JSON.parse(cleanedString);
      console.log('PDF View - Data parsed successfully:', !!pathwayData);
    } catch (error) {
      console.error('Error parsing pathway data:', error.message);
      console.error('Error at position:', error.message.match(/position (\d+)/)?.[1]);
      
      // Try with URL decoding as fallback
      try {
        const decodedData = decodeURIComponent(data);
        const decodedString = Buffer.from(decodedData, 'base64').toString('utf-8');
        const cleanedString = decodedString.replace(/[\x00-\x1F\x7F]/g, '');
        pathwayData = JSON.parse(cleanedString);
        console.log('PDF View - Data parsed successfully with URL decode:', !!pathwayData);
      } catch (error2) {
        console.error('Error parsing pathway data with URL decode:', error2.message);
      }
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
  if (!pathwayData) {
    return (
      <div style={{background: '#000', color: '#fff', minHeight: '100vh', padding: '20px', textAlign: 'center'}}>
        <h1>No PDF data found</h1>
        <p>Session ID: {sessionId}</p>
        <p>Data received: {pathwayData ? 'Yes' : 'No'}</p>
        <p>Check console for details</p>
      </div>
    );
  }

  const data = pathwayData;

  const { pathway, fuzzyScores, pathwayBlend, responses } = data;

  return (
    <div style={{
      background: '#000000',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.6'
    }}>
      {/* Header */}
      <div style={{textAlign: 'center', marginBottom: '60px'}}>
        <img 
          src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png"
          alt="HOME"
          style={{height: '40px', margin: '0 auto 40px'}}
        />
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(29, 209, 161, 0.2), rgba(185, 19, 114, 0.2))',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '25px',
          padding: '12px 24px',
          display: 'inline-block',
          marginBottom: '30px'
        }}>
          <span style={{fontSize: '14px', fontWeight: '600'}}>✨ Your Music Creator Path ✨</span>
        </div>

        <h1 style={{fontSize: '36px', fontWeight: '700', marginBottom: '20px', margin: '0 auto'}}>{pathway.title}</h1>
        <p style={{color: '#d1d5db', maxWidth: '800px', margin: '0 auto', fontSize: '16px'}}>{pathway.description}</p>
      </div>

      {/* Creative Profile */}
      <div style={{marginBottom: '60px'}}>
        <h2 style={{fontSize: '24px', fontWeight: '600', textAlign: 'center', marginBottom: '30px'}}>Your Creative Profile</h2>
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          {Object.entries(fuzzyScores).sort((a, b) => b[1] - a[1]).map(([pathwayKey, percentage]) => {
            const pathwayInfo = {
              'touring-performer': { name: 'Touring Performer', icon: '🎤', color: '#3b82f6' },
              'creative-artist': { name: 'Creative Artist', icon: '🎨', color: '#ec4899' },
              'writer-producer': { name: 'Writer/Producer', icon: '🎹', color: '#10b981' }
            };
            const info = pathwayInfo[pathwayKey];
            
            return (
              <div key={pathwayKey} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '15px 0'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                  <span style={{fontSize: '28px'}}>{info.icon}</span>
                  <span style={{fontSize: '16px', fontWeight: '500'}}>{info.name}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                  <div style={{
                    width: '150px',
                    height: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: info.color,
                      borderRadius: '6px'
                    }} />
                  </div>
                  <span style={{fontSize: '16px', fontWeight: '700', minWidth: '50px', textAlign: 'right'}}>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Roadmap */}
      <div style={{marginBottom: '60px'}}>
        <h2 style={{fontSize: '24px', fontWeight: '600', textAlign: 'center', marginBottom: '30px'}}>Your Strategic Roadmap</h2>
        <div style={{maxWidth: '700px', margin: '0 auto'}}>
          {pathway.nextSteps && pathway.nextSteps.map((step, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              marginBottom: '25px',
              padding: '20px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #1DD1A1, #B91372)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '16px',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <div style={{flex: 1}}>
                <h3 style={{fontWeight: '600', marginBottom: '8px', fontSize: '18px'}}>{step.step}</h3>
                <p style={{color: '#d1d5db', fontSize: '14px', lineHeight: '1.5'}}>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{textAlign: 'center', marginTop: '80px', paddingBottom: '40px'}}>
        <p style={{color: '#9ca3af', fontSize: '14px'}}>Generated on {new Date().toLocaleDateString()}</p>
        <p style={{color: '#6b7280', fontSize: '12px', marginTop: '8px'}}>homeformusic.app</p>
      </div>
    </div>
  );
}