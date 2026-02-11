import { create } from 'zustand';
import type { Character, CharacterSkill, CharacterEquipmentItem, CharacterCondition } from '@/types';
import type { AttributeName, PathName } from '@/types/enums';
import {
  POINT_BUY_TOTAL, PATH_AUTO_SKILLS, PATH_HP_BASE,
  type SkillName,
} from '@/types/enums';
import {
  pointBuyCost, calculateMaxHP, maxAP, attributeModifier,
  canIncrease, canDecrease,
} from '@/utils/gameCalculations';

// ============================================================================
// CHARACTER CREATOR STATE
// ============================================================================

interface CharacterCreatorState {
  // Step tracking
  step: number;
  setStep: (step: number) => void;

  // Attributes
  attributes: Record<AttributeName, number>;
  setAttribute: (attr: AttributeName, value: number) => void;
  incrementAttribute: (attr: AttributeName) => void;
  decrementAttribute: (attr: AttributeName) => void;
  pointsRemaining: () => number;

  // Path
  selectedPath: PathName | null;
  setPath: (path: PathName) => void;

  // Background
  backgroundId: string | null;
  setBackground: (id: string) => void;

  // Skills
  freeSkills: SkillName[];
  toggleFreeSkill: (skill: SkillName) => void;

  // Details
  name: string;
  setName: (name: string) => void;
  appearance: string;
  setAppearance: (appearance: string) => void;
  drive: string;
  setDrive: (drive: string) => void;
  personalityTraits: [string, string];
  setPersonalityTrait: (index: 0 | 1, value: string) => void;
  flaw: string;
  setFlaw: (flaw: string) => void;
  bond: string;
  setBond: (bond: string) => void;
  tenets: [string, string, string];
  setTenet: (index: 0 | 1 | 2, value: string) => void;

  // Computed
  computeHP: () => number;
  computeAP: () => number;
  computeInitiative: () => number;

  // Reset
  reset: () => void;
}

const DEFAULT_ATTRIBUTES: Record<AttributeName, number> = {
  might: 10, finesse: 10, resolve: 10, insight: 10, intellect: 10, presence: 10,
};

export const useCharacterCreator = create<CharacterCreatorState>((set, get) => ({
  step: 1,
  setStep: (step) => set({ step }),

  attributes: { ...DEFAULT_ATTRIBUTES },
  setAttribute: (attr, value) =>
    set((s) => ({ attributes: { ...s.attributes, [attr]: value } })),
  incrementAttribute: (attr) => {
    const s = get();
    if (canIncrease(s.attributes, attr)) {
      set({ attributes: { ...s.attributes, [attr]: s.attributes[attr] + 1 } });
    }
  },
  decrementAttribute: (attr) => {
    const s = get();
    if (canDecrease(s.attributes[attr])) {
      set({ attributes: { ...s.attributes, [attr]: s.attributes[attr] - 1 } });
    }
  },
  pointsRemaining: () => {
    const attrs = get().attributes;
    const spent = Object.values(attrs).reduce((sum, v) => sum + pointBuyCost(v), 0);
    return POINT_BUY_TOTAL - spent;
  },

  selectedPath: null,
  setPath: (path) => set({ selectedPath: path }),

  backgroundId: null,
  setBackground: (id) => set({ backgroundId: id }),

  freeSkills: [],
  toggleFreeSkill: (skill) =>
    set((s) => {
      const has = s.freeSkills.includes(skill);
      if (has) return { freeSkills: s.freeSkills.filter((sk) => sk !== skill) };
      if (s.freeSkills.length >= 2) return s;
      return { freeSkills: [...s.freeSkills, skill] };
    }),

  name: '',
  setName: (name) => set({ name }),
  appearance: '',
  setAppearance: (appearance) => set({ appearance }),
  drive: '',
  setDrive: (drive) => set({ drive }),
  personalityTraits: ['', ''],
  setPersonalityTrait: (index, value) =>
    set((s) => {
      const traits = [...s.personalityTraits] as [string, string];
      traits[index] = value;
      return { personalityTraits: traits };
    }),
  flaw: '',
  setFlaw: (flaw) => set({ flaw }),
  bond: '',
  setBond: (bond) => set({ bond }),
  tenets: ['', '', ''],
  setTenet: (index, value) =>
    set((s) => {
      const tenets = [...s.tenets] as [string, string, string];
      tenets[index] = value;
      return { tenets: tenets };
    }),

  computeHP: () => {
    const { selectedPath, attributes } = get();
    if (!selectedPath) return 0;
    return calculateMaxHP(selectedPath, attributes.might, 1);
  },
  computeAP: () => maxAP(1),
  computeInitiative: () => {
    const { attributes } = get();
    return attributeModifier(attributes.finesse) + attributeModifier(attributes.resolve);
  },

  reset: () =>
    set({
      step: 1,
      attributes: { ...DEFAULT_ATTRIBUTES },
      selectedPath: null,
      backgroundId: null,
      freeSkills: [],
      name: '',
      appearance: '',
      drive: '',
      personalityTraits: ['', ''],
      flaw: '',
      bond: '',
      tenets: ['', '', ''],
    }),
}));
