import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabase';

const WORKSPACE_KEY = 'synthetic-demo';
const LOCAL_STORAGE_KEY = 'curiosity.synthetic-workspace.v1';

export type PrototypeSyncStatus = 'loading' | 'local' | 'unseeded' | 'connected' | 'error';

function decodeWorkspaceSnapshot<T extends object>(value: unknown, expectedKeys: string[]): T {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Synthetic workspace data must be a JSON object.');
  }
  const record = value as Record<string, unknown>;
  const missingCollections = expectedKeys.filter((key) => !Array.isArray(record[key]));
  if (missingCollections.length) {
    throw new Error(`Synthetic workspace is missing valid collections: ${missingCollections.join(', ')}.`);
  }
  return value as T;
}

export function usePrototypeWorkspace<T extends object>(
  snapshot: T,
  hydrate: (data: T) => void,
  user: User | null
) {
  const [status, setStatus] = useState<PrototypeSyncStatus>(
    isSupabaseConfigured ? 'loading' : 'local'
  );
  const [error, setError] = useState<string | null>(null);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const readyToPersist = useRef(false);
  const expectedKeys = useRef(Object.keys(snapshot));

  const reportError = useCallback((message: string | null) => setError(message), []);

  useEffect(() => {
    let active = true;
    readyToPersist.current = false;
    setWorkspaceReady(false);

    const initialize = async () => {
      if (!isSupabaseConfigured || !supabase) {
        try {
          const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            hydrate(decodeWorkspaceSnapshot<T>(JSON.parse(saved), expectedKeys.current));
          }
          if (!active) return;
          readyToPersist.current = true;
          setWorkspaceReady(true);
          setStatus('local');
          reportError(null);
        } catch (loadError) {
          if (!active) return;
          const message = loadError instanceof Error ? loadError.message : String(loadError);
          setStatus('error');
          reportError(`Could not load the local synthetic workspace: ${message}`);
        }
        return;
      }

      if (!user) {
        setStatus('loading');
        return;
      }

      const { data, error: loadError } = await supabase
        .from('prototype_workspaces')
        .select('data')
        .eq('workspace_key', WORKSPACE_KEY)
        .maybeSingle();

      if (!active) return;
      if (loadError) {
        setStatus('error');
        reportError(`Could not load the synthetic workspace from Supabase: ${loadError.message}`);
        return;
      }
      if (!data) {
        readyToPersist.current = true;
        setWorkspaceReady(true);
        setStatus('unseeded');
        reportError(null);
        return;
      }
      hydrate(decodeWorkspaceSnapshot<T>(data.data, expectedKeys.current));
      readyToPersist.current = true;
      setWorkspaceReady(true);
      setStatus('connected');
      reportError(null);
    };

    void initialize().catch((loadError: unknown) => {
      if (!active) return;
      const message = loadError instanceof Error ? loadError.message : String(loadError);
      setStatus('error');
      reportError(`Could not initialize the synthetic workspace: ${message}`);
    });

    return () => {
      active = false;
    };
  }, [user?.id, hydrate, reportError]);

  useEffect(() => {
    if (!workspaceReady || !readyToPersist.current) return;
    if (status === 'local') {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
        reportError(null);
      } catch (saveError) {
        const message = saveError instanceof Error ? saveError.message : String(saveError);
        setStatus('error');
        reportError(`Could not save the local synthetic workspace: ${message}`);
      }
      return;
    }

    if (status !== 'connected' || !supabase || !user) return;
    const client = supabase;
    const timeout = window.setTimeout(() => {
      void Promise.resolve(
        client
          .from('prototype_workspaces')
          .update({
            data: snapshot,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('workspace_key', WORKSPACE_KEY)
      ).then(({ error: saveError }) => {
        if (saveError) {
          reportError(`Could not save the synthetic workspace to Supabase: ${saveError.message}`);
          return;
        }
        reportError(null);
      }).catch((saveError: unknown) => {
        const message = saveError instanceof Error ? saveError.message : String(saveError);
        reportError(`Could not save the synthetic workspace to Supabase: ${message}`);
      });
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [snapshot, status, user?.id, workspaceReady, reportError]);

  const seedSyntheticWorkspace = useCallback(async () => {
    if (!supabase || !user) {
      const message = 'Sign in to Supabase before seeding the shared synthetic workspace.';
      setStatus('error');
      reportError(message);
      return false;
    }

    try {
      const { error: seedError } = await supabase.from('prototype_workspaces').upsert({
        workspace_key: WORKSPACE_KEY,
        dataset_kind: 'synthetic',
        data: snapshot,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      });
      if (seedError) {
        const message = `Could not seed the synthetic workspace: ${seedError.message}`;
        setStatus('error');
        reportError(message);
        return false;
      }
      readyToPersist.current = true;
      setStatus('connected');
      reportError(null);
      return true;
    } catch (seedError) {
      const message = seedError instanceof Error ? seedError.message : String(seedError);
      setStatus('error');
      reportError(`Could not seed the synthetic workspace: ${message}`);
      return false;
    }
  }, [snapshot, user, reportError]);

  return { status, error, seedSyntheticWorkspace };
}
