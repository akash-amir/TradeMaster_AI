import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the current user from Supabase auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Authentication error: ' + userError.message);
      }
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Get full_name from user_metadata, fallback to email
      const full_name = user?.user_metadata?.full_name || null;
      
      // Get avatar_url from user_metadata or profiles table
      let avatarUrl = user?.user_metadata?.avatar_url || null;
      
      // If no avatar in user_metadata, try to get from profiles table
      if (!avatarUrl) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('user_id', user.id)
          .single();

        // Only use profile data if no error (profile exists)
        if (!profileError && profileData?.avatar_url) {
          avatarUrl = profileData.avatar_url;
        }
      }

      setProfile({
        id: user.id,
        full_name: full_name,
        email: user.email || '',
        avatar_url: avatarUrl,
      });
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setProfile(null);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: { full_name?: string; avatar_url?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');
      
      // Update user metadata with new full_name and avatar_url
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.full_name,
          avatar_url: updates.avatar_url,
        }
      });
        
      if (updateError) throw updateError;
      
      // Also update profiles table for backward compatibility
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: updates.full_name,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
        
      if (profileError) {
        console.warn('Profile table update failed:', profileError);
      }
      
      await fetchProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refreshProfile: fetchProfile, updateProfile };
} 