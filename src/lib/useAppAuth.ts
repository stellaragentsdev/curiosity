import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { UserRole } from '../types/rcm';
import {
  isSupabaseConfigured,
  supabase,
  supabaseConfigurationError,
} from './supabase';

interface AppProfile {
  displayName: string;
  email: string;
  roles: UserRole[];
}

export function useAppAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    let active = true;
    let profileRequest = 0;
    const loadProfile = async (authUser: User | null) => {
      const request = ++profileRequest;
      if (!authUser) {
        if (active) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error: profileError } = await client
          .from('profiles')
          .select('display_name, profile_roles(role)')
          .eq('id', authUser.id)
          .single();

        if (!active || request !== profileRequest) return;
        if (profileError) {
          setError(`Could not load your profile: ${profileError.message}`);
          setProfile(null);
          setLoading(false);
          return;
        }

        const roles = (data.profile_roles ?? [])
          .map((item) => item.role)
          .filter((role): role is UserRole =>
            ['admin', 'learning_development', 'quality_assurance', 'operations', 'associate'].includes(
              role
            )
          );
        setProfile({
          displayName: data.display_name || authUser.email || 'User',
          email: authUser.email ?? '',
          roles,
        });
        setError(null);
        setLoading(false);
      } catch (profileRequestError) {
        if (!active || request !== profileRequest) return;
        const message = profileRequestError instanceof Error ? profileRequestError.message : String(profileRequestError);
        setError(`Could not load your profile: ${message}`);
        setProfile(null);
        setLoading(false);
      }
    };

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(true);
      setError(null);
      void Promise.resolve().then(() => loadProfile(session?.user ?? null));
    });

    void client.auth
      .getSession()
      .then(({ data: sessionData, error: sessionError }) => {
        if (!active) return;
        if (sessionError) {
          setError(`Could not restore your sign-in session: ${sessionError.message}`);
          setLoading(false);
          return;
        }
        setUser(sessionData.session?.user ?? null);
        void loadProfile(sessionData.session?.user ?? null);
      })
      .catch((sessionRequestError: unknown) => {
        if (!active) return;
        const message = sessionRequestError instanceof Error ? sessionRequestError.message : String(sessionRequestError);
        setError(`Could not restore your sign-in session: ${message}`);
        setLoading(false);
      });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const sendSignInLink = async (email: string) => {
    if (!supabase) return;
    setError(null);
    setEmailSent(false);
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin, shouldCreateUser: false },
      });
      if (signInError) {
        setError(`Could not send sign-in link: ${signInError.message}`);
        return;
      }
      setEmailSent(true);
    } catch (signInRequestError) {
      const message = signInRequestError instanceof Error ? signInRequestError.message : String(signInRequestError);
      setError(`Could not send sign-in link: ${message}`);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) setError(`Could not sign out: ${signOutError.message}`);
    } catch (signOutRequestError) {
      const message = signOutRequestError instanceof Error ? signOutRequestError.message : String(signOutRequestError);
      setError(`Could not sign out: ${message}`);
    }
  };

  return {
    configured: isSupabaseConfigured,
    configurationError: supabaseConfigurationError,
    user,
    profile,
    loading,
    error,
    emailSent,
    sendSignInLink,
    signOut,
  };
}
