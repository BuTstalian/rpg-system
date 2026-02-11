// ============================================================================
// AETHERMOOR — Core Enums & Constants
// ============================================================================

export const ATTRIBUTES = ['might', 'finesse', 'resolve', 'insight', 'intellect', 'presence'] as const;
export type AttributeName = typeof ATTRIBUTES[number];

export const PATHS = [
  'vanguard', 'shadow', 'arcanist', 'warden', 'devotant',
  'tactician', 'artificer', 'wanderer', 'channeler', 'diplomat',
] as const;
export type PathName = typeof PATHS[number];

export const RESOURCE_TYPES = [
  'momentum', 'focus', 'essence', 'conviction', 'preparation', 'attunement', 'flux',
] as const;
export type ResourceType = typeof RESOURCE_TYPES[number];

export const SKILLS = [
  'athletics', 'endurance', 'intimidation',
  'acrobatics', 'stealth', 'sleight_of_hand', 'marksmanship',
  'composure', 'concentration', 'survival',
  'perception', 'intuition', 'medicine',
  'lore', 'investigation', 'crafting', 'arcane_knowledge',
  'persuasion', 'deception', 'performance',
] as const;
export type SkillName = typeof SKILLS[number];

export const DAMAGE_TYPES = [
  'slashing', 'piercing', 'bludgeoning',
  'fire', 'cold', 'lightning', 'acid', 'poison',
  'arcane', 'spiritual', 'necrotic', 'psychic', 'force',
  'true',
] as const;
export type DamageType = typeof DAMAGE_TYPES[number];

export const CONDITIONS = [
  'burning', 'chilled', 'poisoned', 'stunned',
  'bleeding', 'shaken', 'exposed', 'slowed',
] as const;
export type ConditionName = typeof CONDITIONS[number];

export const RARITIES = ['common', 'uncommon', 'rare', 'legendary', 'mythic'] as const;
export type Rarity = typeof RARITIES[number];

export const SPELL_SCHOOLS = [
  'evocation', 'abjuration', 'transmutation', 'divination',
  'conjuration', 'enchantment', 'necromancy', 'restoration',
] as const;
export type SpellSchool = typeof SPELL_SCHOOLS[number];

export const SPELL_LEVELS = ['cantrip', 'lesser', 'standard', 'greater', 'supreme', 'mythic'] as const;
export type SpellLevel = typeof SPELL_LEVELS[number];

export const MATERIAL_CATEGORIES = [
  'metals_ores', 'hides_fibers', 'bones_shells',
  'organs_fluids', 'flora', 'minerals_gems', 'arcane_substances',
] as const;
export type MaterialCategory = typeof MATERIAL_CATEGORIES[number];

export const CRAFTING_DISCIPLINES = ['alchemy', 'smithing', 'engineering', 'enchanting'] as const;
export type CraftingDiscipline = typeof CRAFTING_DISCIPLINES[number];

export const CREATURE_TAGS = [
  'beast', 'humanoid', 'undead', 'construct', 'elemental',
  'fiend', 'celestial', 'aberration', 'fey', 'dragon',
  'plant', 'ooze', 'swarm',
] as const;
export type CreatureTag = typeof CREATURE_TAGS[number];

export const TERRAIN_TYPES = [
  'open', 'difficult', 'hazardous', 'elevated', 'cover_half',
  'cover_full', 'water_shallow', 'water_deep', 'ice',
  'darkness', 'destructible', 'interactable',
] as const;
export type TerrainType = typeof TERRAIN_TYPES[number];

// ============================================================================
// CONSTANTS
// ============================================================================

export const POINT_BUY_TOTAL = 27;
export const STAT_MIN = 8;
export const STAT_MAX_CREATION = 16;
export const STAT_MAX_ABSOLUTE = 20;

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 6, 14: 8, 15: 11, 16: 15,
};

export const PROFICIENCY_BY_TIER: Record<number, number> = {};
for (let t = 1; t <= 5; t++) PROFICIENCY_BY_TIER[t] = 2;
for (let t = 6; t <= 10; t++) PROFICIENCY_BY_TIER[t] = 3;
for (let t = 11; t <= 15; t++) PROFICIENCY_BY_TIER[t] = 4;
for (let t = 16; t <= 20; t++) PROFICIENCY_BY_TIER[t] = 5;

export const AP_BY_TIER: Record<number, number> = {};
for (let t = 1; t <= 5; t++) AP_BY_TIER[t] = 3;
for (let t = 6; t <= 10; t++) AP_BY_TIER[t] = 4;
for (let t = 11; t <= 15; t++) AP_BY_TIER[t] = 5;
for (let t = 16; t <= 18; t++) AP_BY_TIER[t] = 6;
for (let t = 19; t <= 20; t++) AP_BY_TIER[t] = 7;

export const SKILL_ATTRIBUTES: Record<SkillName, AttributeName> = {
  athletics: 'might', endurance: 'might', intimidation: 'might',
  acrobatics: 'finesse', stealth: 'finesse', sleight_of_hand: 'finesse', marksmanship: 'finesse',
  composure: 'resolve', concentration: 'resolve', survival: 'resolve',
  perception: 'insight', intuition: 'insight', medicine: 'insight',
  lore: 'intellect', investigation: 'intellect', crafting: 'intellect', arcane_knowledge: 'intellect',
  persuasion: 'presence', deception: 'presence', performance: 'presence',
};

export const PATH_RESOURCES: Record<PathName, ResourceType> = {
  vanguard: 'momentum', shadow: 'focus', arcanist: 'essence', warden: 'attunement',
  devotant: 'conviction', tactician: 'focus', artificer: 'preparation',
  wanderer: 'momentum', channeler: 'flux', diplomat: 'conviction',
};

export const PATH_HP_BASE: Record<PathName, number> = {
  vanguard: 12, shadow: 8, arcanist: 6, warden: 10, devotant: 8,
  tactician: 8, artificer: 8, wanderer: 10, channeler: 6, diplomat: 6,
};

export const PATH_AUTO_SKILLS: Record<PathName, SkillName[]> = {
  vanguard: ['athletics', 'endurance', 'intimidation'],
  shadow: ['stealth', 'sleight_of_hand', 'acrobatics'],
  arcanist: ['arcane_knowledge', 'lore', 'concentration'],
  warden: ['survival', 'perception', 'endurance'],
  devotant: ['medicine', 'composure', 'persuasion'],
  tactician: ['investigation', 'perception', 'lore'],
  artificer: ['crafting', 'arcane_knowledge', 'investigation'],
  wanderer: ['survival', 'perception', 'performance'],
  channeler: ['concentration', 'composure', 'arcane_knowledge'],
  diplomat: ['persuasion', 'deception', 'intuition'],
};

export const RARITY_COLORS: Record<Rarity, string> = {
  common: 'text-parchment-300',
  uncommon: 'text-nature-400',
  rare: 'text-blue-400',
  legendary: 'text-yellow-400',
  mythic: 'text-arcane-400',
};

export const CONDITION_COLORS: Record<ConditionName, string> = {
  burning: 'text-orange-400',
  chilled: 'text-cyan-400',
  poisoned: 'text-green-400',
  stunned: 'text-yellow-400',
  bleeding: 'text-blood-400',
  shaken: 'text-purple-400',
  exposed: 'text-pink-400',
  slowed: 'text-gray-400',
};
