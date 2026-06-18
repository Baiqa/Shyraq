'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';

interface SaveButtonProps {
  articleId: string;
  redirectTo?: string;
}

export default function SaveButton({ articleId, redirectTo }: SaveButtonProps) {
  const { user, loading } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    async function checkIfSaved() {
      try {
        const { data } = await supabase
          .from('saved_articles')
          .select('id')
          .eq('user_id', user!.id)
          .eq('article_id', articleId)
          .single();

        setIsSaved(!!data);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    }

    checkIfSaved();
  }, [user, articleId]);

  const handleSaveClick = async () => {
    if (!user) {
      // Redirect to login with redirect parameter
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo || window.location.pathname)}`);
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        // Delete saved article
        await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', user!.id)
          .eq('article_id', articleId);
        setIsSaved(false);
      } else {
        // Insert saved article
        await supabase.from('saved_articles').insert({
          user_id: user!.id,
          article_id: articleId,
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error updating saved articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <button disabled className="text-2xl opacity-50 cursor-not-allowed">
        ♡
      </button>
    );
  }

  return (
    <button
      onClick={handleSaveClick}
      disabled={isLoading}
      className="text-2xl hover:opacity-70 transition-opacity disabled:opacity-50"
      title={isSaved ? 'Remove from saved' : 'Save article'}
    >
      {isSaved ? '♥' : '♡'}
    </button>
  );
}
