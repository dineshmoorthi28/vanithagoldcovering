import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight } from 'lucide-react';
import api from '../utils/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [step, setStep] = useState<'login' | 'forgot' | 'verify' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('admin_token', response.data.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('verify');
      setMessage('OTP sent! Please check your email.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setStep('reset');
      setMessage('OTP verified! Enter your new password.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { email, otp, newPassword });
      setStep('login');
      setMessage('Password reset successful! You can now log in.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-maroon-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
            <Lock className="text-gold-500" size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            {step === 'login' ? 'Admin Portal' : 'Reset Password'}
          </h1>
          <p className="text-stone-400">
            {step === 'login' ? 'Secure access for Vanitha Covering' : 'Secure OTP verification'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          {message && (
            <p className="text-green-400 text-sm text-center bg-green-400/10 py-3 rounded-2xl mb-6">
              {message}
            </p>
          )}

          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-gold-500 transition-all outline-none"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-stone-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { setStep('forgot'); setError(''); setMessage(''); }}
                    className="text-xs text-gold-500 hover:text-gold-400"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-gold-500 transition-all outline-none"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold-600 hover:bg-gold-500 text-maroon-950 py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-maroon-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Registered Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-gold-500 transition-all outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="w-1/3 bg-white/5 text-white py-4 rounded-2xl font-bold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gold-600 hover:bg-gold-500 text-maroon-950 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Enter 6-Digit OTP</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-gold-500 transition-all outline-none tracking-[1em] font-mono text-center"
                    placeholder="000000"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold-600 hover:bg-gold-500 text-maroon-950 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-gold-500 transition-all outline-none"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold-600 hover:bg-gold-500 text-maroon-950 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-stone-500 hover:text-gold-400 text-sm transition-colors">
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}
