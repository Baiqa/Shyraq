'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      setShowDropdown(false);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  if (loading) {
    return <div className="w-10 h-10 rounded-full bg-light-divider dark:bg-dark-divider animate-pulse"></div>;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="px-4 py-2 text-sm font-semibold text-accent hover:opacity-80 transition-opacity"
      >
        Sign In
      </Link>
    );
  }

  // Extract initials for avatar
  const initials = user.email
    ?.split('@')[0]
    .split('.')
    .map((part) => part[0].toUpperCase())
    .join('')
    .slice(0, 2) || '?';

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-10 h-10 rounded-full bg-accent text-white font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
        title={user.email || 'User'}
      >
        {initials}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-light-bg dark:bg-dark-card border border-light-divider dark:border-dark-divider rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b border-light-divider dark:border-dark-divider">
            <p className="text-sm font-semibold text-light-text dark:text-dark-text truncate">
              {user.email}
            </p>
          </div>

          <Link
            href="/saved"
            className="block px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-divider dark:hover:bg-dark-divider transition-colors"
            onClick={() => setShowDropdown(false)}
          >
            📌 Saved Articles
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-divider dark:hover:bg-dark-divider transition-colors border-t border-light-divider dark:border-dark-divider"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
