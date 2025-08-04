import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        // Redirect to CRM dashboard
        router.push('/admin/crm');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - HOME for Music</title>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000000;
            color: #ffffff;
            overflow-x: hidden;
          }
          
          .screen-height {
            min-height: 100vh;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .safari-fallback {
            background: rgba(0, 0, 0, 0.8);
          }
          
          @supports (backdrop-filter: blur(10px)) {
            .safari-fallback {
              backdrop-filter: blur(10px);
              background: rgba(0, 0, 0, 0.7);
            }
          }
          
          .animate-liquid-rotate {
            animation: liquidRotate 8s ease-in-out infinite;
          }
          
          .animate-liquid-float {
            animation: liquidFloat 3s ease-in-out infinite;
          }
          
          .animate-liquid-float-delayed {
            animation: liquidFloat 3s ease-in-out infinite 1.5s;
          }
          
          .animate-liquid-pulse {
            animation: liquidPulse 2s ease-in-out infinite;
          }
          
          @keyframes liquidRotate {
            0%, 100% { transform: rotate(0deg) translateZ(-5px); }
            50% { transform: rotate(180deg) translateZ(-5px); }
          }
          
          @keyframes liquidFloat {
            0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
            50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
          }
          
          @keyframes liquidPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 1; }
          }
        `}</style>
      </Head>
      
      <div className="screen-height bg-black pt-20 sm:pt-24 flex items-center justify-center px-6 pb-20">
        <div className="max-w-md w-full">
          <div className="animate-fadeIn">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DD1A1]/30 to-[#B91372]/30 rounded-full border border-white/30 mb-6">
                <span className="text-sm font-semibold text-white">🔐 Admin Access</span>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">
                Admin
                <span className="block bg-gradient-to-r from-[#1DD1A1] to-[#B91372] bg-clip-text text-transparent">
                  Login
                </span>
              </h1>
              <p className="text-gray-300">Access the CRM dashboard</p>
            </div>

            {/* Login Form */}
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl border border-white/10 p-8 safari-fallback">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-xl 
                             focus:bg-black/50 focus:border-[#1DD1A1] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1]/20
                             transition-all duration-300 text-white placeholder-gray-400 text-lg backdrop-blur-sm"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-xl 
                             focus:bg-black/50 focus:border-[#1DD1A1] focus:outline-none focus:ring-2 focus:ring-[#1DD1A1]/20
                             transition-all duration-300 text-white placeholder-gray-400 text-lg backdrop-blur-sm"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !username || !password}
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 w-full bg-gradient-to-r from-[#1DD1A1] to-[#B91372] rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#B91372]/30 hover:scale-105 text-white text-lg overflow-hidden transform-gpu disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* 3D Liquid layers */}
                  <div className="absolute inset-0 rounded-2xl" style={{ transform: 'translateZ(-10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1DD1A1] to-[#B91372] rounded-2xl" />
                  </div>
                  
                  {/* Animated liquid blobs */}
                  <div className="absolute inset-0 rounded-2xl animate-liquid-rotate" style={{ transform: 'translateZ(-5px)' }}>
                    <div className="absolute top-2 left-4 w-8 h-8 bg-white/20 rounded-full animate-liquid-float" />
                    <div className="absolute bottom-3 right-6 w-6 h-6 bg-white/15 rounded-full animate-liquid-float-delayed" />
                    <div className="absolute top-1/2 right-8 w-4 h-4 bg-white/25 rounded-full animate-liquid-pulse" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <span>{loading ? 'Logging in...' : 'Access CRM Dashboard'}</span>
                    {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}