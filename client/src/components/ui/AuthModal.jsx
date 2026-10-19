import React, { useState } from 'react';
import { X, ChefHat, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietary, setDietary] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(name, email, password, dietary);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await login('demo@savorcraft.com', 'password123');
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-editorial border border-cream-200 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-cream-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-cream-100/70 px-8 pt-8 pb-6 border-b border-cream-200 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-olive-700 text-cream-50 flex items-center justify-center shadow-soft mb-3">
            <ChefHat className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-charcoal-900">
            {isRegister ? 'Join the Culinary Journal' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-charcoal-600 mt-1">
            {isRegister 
              ? 'Create an account to save recipes, build meal plans, and review dishes.' 
              : 'Sign in to access your saved recipes and custom collections.'}
          </p>

          {/* Quick Demo Login Option */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={submitting}
            className="mt-4 w-full py-2 px-3 bg-olive-100/80 hover:bg-olive-200/80 text-olive-800 text-xs font-semibold rounded-xl border border-olive-300/50 flex items-center justify-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-olive-600" />
            <span>Instant Demo Sign-In (Chef Alexandra)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500"
                />
                <UserIcon className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500"
              />
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500"
              />
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-olive-700 hover:bg-olive-800 text-cream-50 font-semibold text-xs rounded-xl transition-all shadow-soft mt-2 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span className="inline-block animate-spin">◌</span>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-xs text-olive-700 hover:underline font-medium"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
