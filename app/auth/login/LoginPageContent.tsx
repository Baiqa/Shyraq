'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to sign in with Google',
      });
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Check your email for a sign-in link!',
      });
      setEmail('');
    } catch (error) {
      console.error('Magic link sign-in error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to send sign-in link',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-light-text dark:text-dark-text mb-2">
          Sign In
        </h1>
        <p className="text-light-secondary dark:text-dark-secondary">
          Access your saved articles
        </p>
      </div>

      <div className="bg-light-bg dark:bg-dark-card border border-light-divider dark:border-dark-divider rounded-lg p-6">
        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full mb-4 px-4 py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-light-divider dark:border-dark-divider"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-light-bg dark:bg-dark-card text-light-secondary dark:text-dark-secondary">
              Or
            </span>
          </div>
        </div>

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLinkSignIn}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-light-divider dark:bg-dark-divider border border-light-divider dark:border-dark-divider rounded text-light-text dark:text-dark-text placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full px-4 py-3 bg-light-divider dark:bg-dark-divider text-light-text dark:text-dark-text font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div
            className={`mt-4 p-3 rounded text-sm ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Back Link */}
      <div className="text-center mt-6">
        <Link href={redirectTo} className="text-accent hover:underline text-sm">
          ← Back to {redirectTo === '/' ? 'news feed' : 'page'}
        </Link>
      </div>
    </div>
  );
}
