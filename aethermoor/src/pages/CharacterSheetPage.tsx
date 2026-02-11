import { CharacterSheet } from '@/components/character/CharacterSheet';
import { DEMO_CHARACTER, DEMO_SKILLS, DEMO_EQUIPMENT, DEMO_CONDITIONS, DEMO_ABILITIES } from '@/data/mockData';

export function CharacterSheetPage() {
  return (
    <div className="min-h-screen py-8">
      <CharacterSheet
        character={DEMO_CHARACTER}
        skills={DEMO_SKILLS}
        equipment={DEMO_EQUIPMENT}
        conditions={DEMO_CONDITIONS}
        abilities={DEMO_ABILITIES}
      />
    </div>
  );
}
