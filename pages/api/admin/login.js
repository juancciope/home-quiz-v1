import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Simple authentication using environment variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  if (!adminUsername || !adminPassword) {
    return res.status(500).json({ message: 'Admin credentials not configured' });
  }

  if (username === adminUsername && password === adminPassword) {
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
    res.status(401).json({ message: 'Invalid credentials' });
  }
}