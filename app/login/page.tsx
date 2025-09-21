'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { signIn, getSession } from 'next-auth/react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login response data:', data.data);
        console.log('User data being stored:', data.data.user);
        console.log('Referral code in response:', data.data.user.referral_code);
        
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        
        // Verify what was stored
        const storedUserData = localStorage.getItem('userData');
        console.log('Stored user data:', JSON.parse(storedUserData || '{}'));
        
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      });
      
      if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJjaXJjdWl0R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAuOSIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMC4xIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0iIzAwMDAwMCIvPgo8ZyBmaWxsPSJ1cmwoI2NpcmN1aXRHcmFkaWVudCkiPgo8cGF0aCBkPSJNMCwwIEw1MCwyMCBMMTAwLDAgTDE1MCwyMCBMMjAwLDAgTDI1MCwyMCBMMzAwLDAgTDM1MCwyMCBMMzAwLDAgTDI1MCwyMCBMMjAwLDAgTDE1MCwyMCBMMTAwLDAgTDUwLDIwIFoiLz4KPHBhdGggZD0iTTAsMTA4MCBMNTAsMTA2MCBMMTAwLDEwODAgTDE1MCwxMDYwIEwyMDAsMTA4MCBMMjUwLDEwNjAgTDMwMCwxMDgwIEwzNTAsMTA2MCBMMzAwLDEwODAgTDI1MCwxMDYwIEwyMDAsMTA4MCBMMTUwLDEwNjAgTDEwMCwxMDgwIEw1MCwxMDYwIFoiLz4KPC9nPgo8Y2lyY2xlIGN4PSI5NjAiIGN5PSI1NDAiIHI9IjEwMCIgZmlsbD0iIzAwN0JGRiIgZmlsdGVyPSJibHVyKDIwcHgpIi8+CjxjaXJjbGUgY3g9Ijk2MCIgY3k9IjU0MCIgcj0iNjAiIGZpbGw9IiMwMDdCRkYiLz4KPHN2ZyB4PSI5MDAiIHk9IjQ4MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiPgo8cGF0aCBkPSJNMzAsNjAgTDUwLDQwIEw3MCw2MCBMNTAsODAgWiIgZmlsbD0iIzAwN0JGRiIvPgo8cGF0aCBkPSJNNDAsNTAgTDYwLDMwIEw4MCw1MCBMNjAsNzAgWiIgZmlsbD0iIzAwN0JGRiIvPgo8L3N2Zz4KPHN2ZyB4PSI5MDAiIHk9IjQ4MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiPgo8cGF0aCBkPSJNMzAsNjAgTDUwLDQwIEw3MCw2MCBMNTAsODAgWiIgZmlsbD0iIzAwN0JGRiIvPgo8cGF0aCBkPSJNNDAsNTAgTDYwLDMwIEw4MCw1MCBMNjAsNzAgWiIgZmlsbD0iIzAwN0JGRiIvPgo8L3N2Zz4KPC9zdmc+')`,
          filter: 'brightness(0.3) contrast(1.2)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your BDS PRO account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
