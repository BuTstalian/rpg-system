import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type AuthMode = 'login' | 'signup' | 'reset';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      if (err) setError(err);
      else navigate('/');
    } else if (mode === 'signup') {
      if (!username.trim()) { setError('Username is required'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
      if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
      const { error: err } = await signUp(email, password, username.trim());
      if (err) setError(err);
      else setMessage('Check your email to confirm your account.');
    } else if (mode === 'reset') {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=update-password`,
      });
      if (err) setError(err.message);
      else setMessage('Password reset link sent to your email.');
    }

    setLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setMessage(null);
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl text-parchment-100 font-bold tracking-wider">
            AETHERMOOR
          </h1>
          <p className="text-parchment-500 text-sm mt-1">
            {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Your display name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="text-blood-400 text-sm bg-blood-900/20 border border-blood-800/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {message && (
            <div className="text-nature-400 text-sm bg-nature-900/20 border border-nature-800/30 rounded-lg px-3 py-2">
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center space-y-2">
          {mode === 'login' && (
            <>
              <button
                onClick={() => switchMode('reset')}
                className="text-sm text-parchment-500 hover:text-arcane-400 transition-colors block w-full"
              >
                Forgot your password?
              </button>
              <button
                onClick={() => switchMode('signup')}
                className="text-sm text-parchment-400 hover:text-arcane-400 transition-colors block w-full"
              >
                Don't have an account? Sign up
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button
              onClick={() => switchMode('login')}
              className="text-sm text-parchment-400 hover:text-arcane-400 transition-colors"
            >
              Already have an account? Sign in
            </button>
          )}
          {mode === 'reset' && (
            <button
              onClick={() => switchMode('login')}
              className="text-sm text-parchment-400 hover:text-arcane-400 transition-colors"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}