import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Campaign, CampaignMember } from '@/types';

export function useCampaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<(Campaign & { role: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    if (!user) { setCampaigns([]); setLoading(false); return; }

    const { data: memberships } = await supabase
      .from('campaign_members')
      .select('campaign_id, role')
      .eq('user_id', user.id);

    if (!memberships?.length) { setCampaigns([]); setLoading(false); return; }

    const ids = memberships.map((m) => m.campaign_id);
    const roleMap = new Map(memberships.map((m) => [m.campaign_id, m.role]));

    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .in('id', ids)
      .order('updated_at', { ascending: false });

    setCampaigns(
      (data ?? []).map((c) => ({ ...c, role: roleMap.get(c.id) ?? 'player' }))
    );
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const createCampaign = async (name: string, description?: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('campaigns')
      .insert({ name, description: description ?? null, gm_id: user.id })
      .select()
      .single();

    if (error) return { error: error.message };

    // Add creator as GM member
    await supabase.from('campaign_members').insert({
      campaign_id: data.id,
      user_id: user.id,
      role: 'gm',
    });

    await fetchCampaigns();
    return { error: null, campaign: data };
  };

  const joinCampaign = async (campaignId: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('campaign_members').insert({
      campaign_id: campaignId,
      user_id: user.id,
      role: 'player',
    });

    if (error) return { error: error.message };
    await fetchCampaigns();
    return { error: null };
  };

  return { campaigns, loading, createCampaign, joinCampaign, refetch: fetchCampaigns };
}

export function useCampaign(id: string | undefined) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [members, setMembers] = useState<(CampaignMember & { username: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const { data: c } = await supabase.from('campaigns').select('*').eq('id', id).single();
      setCampaign(c);

      const { data: m } = await supabase
        .from('campaign_members')
        .select('*, profiles(username)')
        .eq('campaign_id', id);

      setMembers(
        (m ?? []).map((row: Record<string, unknown>) => ({
          ...(row as unknown as CampaignMember),
          username: (row.profiles as { username: string })?.username ?? 'Unknown',
        }))
      );
      setLoading(false);
    }

    load();
  }, [id]);

  return { campaign, members, loading };
}
