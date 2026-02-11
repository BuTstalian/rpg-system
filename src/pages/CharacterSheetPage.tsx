import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CharacterSheet } from '@/components/character/CharacterSheet';
import { supabase } from '@/lib/supabase';
import { DEMO_CHARACTER, DEMO_SKILLS, DEMO_EQUIPMENT, DEMO_CONDITIONS, DEMO_ABILITIES } from '@/data/mockData';
import type { Character, CharacterSkill, CharacterEquipmentItem, CharacterCondition } from '@/types';

export function CharacterSheetPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [skills, setSkills] = useState<CharacterSkill[]>([]);
  const [equipment, setEquipment] = useState<CharacterEquipmentItem[]>([]);
  const [conditions, setConditions] = useState<CharacterCondition[]>([]);
  const [abilities, setAbilities] = useState<{ name: string; type: 'core' | 'branch'; description: string; branch?: string; tier?: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === 'demo') {
      setCharacter(DEMO_CHARACTER);
      setSkills(DEMO_SKILLS);
      setEquipment(DEMO_EQUIPMENT);
      setConditions(DEMO_CONDITIONS);
      setAbilities(DEMO_ABILITIES);
      setLoading(false);
      return;
    }

    async function load() {
      const { data: char } = await supabase.from('characters').select('*').eq('id', id).single();
      if (!char) { setLoading(false); return; }
      setCharacter(char as Character);

      const { data: sk } = await supabase.from('character_skills').select('*').eq('character_id', id);
      setSkills((sk ?? []) as CharacterSkill[]);

      const { data: eq } = await supabase.from('character_equipment').select('*').eq('character_id', id);
      setEquipment((eq ?? []) as CharacterEquipmentItem[]);

      const { data: cond } = await supabase.from('character_conditions').select('*').eq('character_id', id);
      setConditions((cond ?? []) as CharacterCondition[]);

      const { data: coreAbs } = await supabase
        .from('path_core_abilities')
        .select('*')
        .eq('path_id', char.path)
        .lte('tier', char.tier);

      setAbilities(
        (coreAbs ?? []).map((a: Record<string, unknown>) => ({
          name: a.name as string,
          type: 'core' as const,
          description: a.description as string,
          tier: a.tier as number,
        }))
      );

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-parchment-400">Loading character...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-parchment-400">Character not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <CharacterSheet
        character={character}
        skills={skills}
        equipment={equipment}
        conditions={conditions}
        abilities={abilities}
      />
    </div>
  );
}
