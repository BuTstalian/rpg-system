import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type SubscriptionCallback = (payload: { new: Record<string, unknown>; old: Record<string, unknown>; eventType: string }) => void;

export function useRealtime(
  table: string,
  filter: string | undefined,
  callback: SubscriptionCallback,
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-${filter ?? 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, ...(filter ? { filter } : {}) },
        (payload) => {
          callback({
            new: payload.new as Record<string, unknown>,
            old: payload.old as Record<string, unknown>,
            eventType: payload.eventType,
          });
        },
      )
      .subscribe();

    channelRef.current = channel;
    return () => { channel.unsubscribe(); };
  }, [table, filter, callback]);

  return channelRef;
}
