import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { PathInfo, Background } from '@/types';
import type { PathName } from '@/types/enums';
import { PATHS_DATA, BACKGROUNDS_DATA, type PathData } from '@/data/referenceData';

/**
 * Convert static PathData to the PathInfo shape the UI expects.
 */
function pathDataToPathInfo(p: PathData): PathInfo {
  return {
    id: p.id,
    display_name: p.name,
    resource: p.resource,
    hp_base: p.hpBase,
    description: p.description,
    auto_skills: p.autoSkills,
    free_expertise_skill: p.freeExpertise,
    free_expertise_tier: p.freeExpertiseTier ?? 0,
    complexity: p.complexity,
    combat_role: p.combatRole,
  };
}

/**
 * Convert static BackgroundData to the Background shape the UI expects.
 */
function bgDataToBackground(bg: typeof BACKGROUNDS_DATA[number], idx: number): Background {
  return {
    id: `local-bg-${idx}`,
    name: bg.name,
    skill_proficiencies: bg.skills,
    tool_proficiency: bg.tool,
    starting_bonus: bg.bonus,
    description: bg.description,
  };
}

/**
 * Hook that provides paths and backgrounds.
 * Tries Supabase first, falls back to static local data if empty or error.
 */
export function useReferenceData() {
  const [paths, setPaths] = useState<PathInfo[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'supabase' | 'local'>('local');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Try Supabase first
        const [pathsRes, bgRes] = await Promise.all([
          supabase.from('paths').select('*').order('id'),
          supabase.from('backgrounds').select('*').order('name'),
        ]);

        if (!cancelled && pathsRes.data?.length && bgRes.data?.length) {
          setPaths(pathsRes.data as PathInfo[]);
          setBackgrounds(bgRes.data as Background[]);
          setSource('supabase');
          setLoading(false);
          return;
        }
      } catch {
        // Supabase failed, use local data
      }

      if (!cancelled) {
        // Fallback to local data
        setPaths(PATHS_DATA.map(pathDataToPathInfo));
        setBackgrounds(BACKGROUNDS_DATA.map(bgDataToBackground));
        setSource('local');
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { paths, backgrounds, loading, source };
}

/**
 * Get branch abilities for a path from local data.
 */
export function getLocalBranchAbilities(pathId: PathName) {
  const pathData = PATHS_DATA.find(p => p.id === pathId);
  if (!pathData) return [];
  return pathData.branches;
}

/**
 * Get the core T1 ability for a path from local data.
 */
export function getLocalCoreAbility(pathId: PathName) {
  const pathData = PATHS_DATA.find(p => p.id === pathId);
  return pathData?.coreT1 ?? null;
}
