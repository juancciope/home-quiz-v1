import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  console.log('🔐 LOGIN API CALLED');
  console.log('📋 Method:', req.method);
  console.log('📋 Body:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Simple authentication using environment variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-123';

  console.log('🔍 Environment check:');
  console.log('📋 ADMIN_USERNAME exists:', !!adminUsername);
  console.log('📋 ADMIN_PASSWORD exists:', !!adminPassword);
  console.log('📋 JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('📋 Provided username:', username);
  console.log('📋 Expected username:', adminUsername);
  console.log('📋 Username match:', username === adminUsername);
  console.log('📋 Password match:', password === adminPassword);

  if (!adminUsername || !adminPassword) {
    console.error('❌ Admin credentials not configured');
    return res.status(500).json({ 
      message: 'Admin credentials not configured',
      debug: {
        hasUsername: !!adminUsername,
        hasPassword: !!adminPassword
      }
    });
  }

  if (username === adminUsername && password === adminPassword) {
    console.log('✅ Login successful');
    // Create JWT token
    const token = jwt.sign(
      { username, isAdmin: true },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      success: true, 
      token,
      message: 'Login successful' 
    });
  } else {
    console.log('❌ Invalid credentials');
    res.status(401).json({ 
      message: 'Invalid credentials',
      debug: {
        providedUsername: username,
        expectedUsername: adminUsername,
        usernameMatch: username === adminUsername,
        passwordMatch: password === adminPassword
      }
    });
  }
}