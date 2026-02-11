// ============================================================================
// AETHERMOOR — Core Type Definitions
// ============================================================================

import type {
  AttributeName, PathName, ResourceType, SkillName,
  DamageType, ConditionName, Rarity, SpellSchool, SpellLevel,
  MaterialCategory, CraftingDiscipline, CreatureTag, TerrainType,
} from './enums';

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type UUID = string;
export type Timestamp = string;

// ============================================================================
// USER & CAMPAIGN
// ============================================================================

export interface Profile {
  id: UUID;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: Timestamp;
}

export interface Campaign {
  id: UUID;
  name: string;
  description: string | null;
  gm_id: UUID;
  current_tier: number;
  session_count: number;
  settings: Record<string, unknown>;
  created_at: Timestamp;
}

export interface CampaignMember {
  campaign_id: UUID;
  user_id: UUID;
  role: 'gm' | 'player' | 'spectator';
  joined_at: Timestamp;
}

// ============================================================================
// CHARACTER
// ============================================================================

export interface Attributes {
  might: number;
  finesse: number;
  resolve: number;
  insight: number;
  intellect: number;
  presence: number;
}

export interface Character {
  id: UUID;
  user_id: UUID;
  campaign_id: UUID | null;
  name: string;
  path: PathName;
  background_id: UUID | null;
  tier: number;

  // Attributes
  might: number;
  finesse: number;
  resolve: number;
  insight: number;
  intellect: number;
  presence: number;

  // Derived
  hp_max: number;
  hp_current: number;
  armor_value: number;
  ap_max: number;

  // Resource
  resource_current: number;
  resource_max: number;

  // Progression
  branch_points_spent: number;
  branch_points_total: number;
  stat_increases_used: number;
  expertise_choices: string[];

  // Details
  appearance: string | null;
  personality_traits: string[];
  flaw: string | null;
  bond: string | null;
  drive: string | null;
  tenets: string[];
  npc_connections: NpcConnection[];

  gold: number;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface NpcConnection {
  name: string;
  relationship: string;
  notes?: string;
}

export interface CharacterSkill {
  character_id: UUID;
  skill: SkillName;
  proficient: boolean;
  expertise: boolean;
  source: 'path' | 'background' | 'free' | 'milestone';
}

export interface CharacterAbility {
  id: UUID;
  character_id: UUID;
  ability_id: UUID;
  ability_type: 'core' | 'branch';
  acquired_at_tier: number;
}

export interface CharacterSpell {
  id: UUID;
  character_id: UUID;
  spell_id: UUID;
  is_known: boolean;
  is_prepared: boolean;
}

export interface CharacterEquipmentItem {
  id: UUID;
  character_id: UUID;
  item_type: 'weapon' | 'armor' | 'shield' | 'accessory' | 'tool' | 'consumable' | 'misc';
  template_id: UUID | null;
  custom_name: string | null;
  custom_effects: Record<string, unknown>;
  rarity: Rarity;
  enchantments: Enchantment[];
  enchantment_slots_total: number;
  enchantment_slots_used: number;
  is_equipped: boolean;
  equip_slot: string | null;
  is_attuned: boolean;
  quantity: number;
  notes: string | null;
}

export interface CharacterMaterial {
  character_id: UUID;
  material_id: UUID;
  quantity: number;
  is_processed: boolean;
}

export interface CharacterCondition {
  id: UUID;
  character_id: UUID;
  condition: ConditionName;
  tier: 1 | 2 | 3;
  source: string | null;
  applied_at: Timestamp;
}

// ============================================================================
// CHARACTER — COMPUTED (for UI)
// ============================================================================

export interface ComputedSkill {
  name: SkillName;
  attribute: AttributeName;
  proficient: boolean;
  expertise: boolean;
  modifier: number;      // attr mod + prof + expertise
  passive: number | null; // 10 + modifier (if has_passive)
}

export interface CharacterSheet extends Character {
  // Computed
  attributes: Attributes;
  modifiers: Record<AttributeName, number>;
  proficiency_bonus: number;
  initiative: number;
  bleedout_timer: number;
  resource_type: ResourceType;
  skills: ComputedSkill[];
  abilities: (PathCoreAbility | PathBranchAbility)[];
  equipment: CharacterEquipmentItem[];
  conditions: CharacterCondition[];
  spells: (CharacterSpell & { spell: Spell })[];
  materials: (CharacterMaterial & { material: Material })[];
  background: Background | null;
}

// ============================================================================
// REFERENCE DATA — PATHS
// ============================================================================

export interface PathInfo {
  id: PathName;
  display_name: string;
  resource: ResourceType;
  hp_base: number;
  description: string | null;
  auto_skills: SkillName[];
  free_expertise_skill: SkillName | null;
  free_expertise_tier: number;
  complexity: number;
  combat_role: string | null;
}

export interface PathCoreAbility {
  id: UUID;
  path_id: PathName;
  tier: 1 | 5 | 10 | 15 | 20;
  name: string;
  description: string;
  mechanics: Record<string, unknown>;
}

export interface PathBranchAbility {
  id: UUID;
  path_id: PathName;
  branch: 'A' | 'B' | 'C';
  branch_name: string;
  position: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  ap_cost: number | null;
  resource_cost: number | null;
  mechanics: Record<string, unknown>;
}

// ============================================================================
// REFERENCE DATA — SKILLS, BACKGROUNDS
// ============================================================================

export interface SkillInfo {
  id: SkillName;
  display_name: string;
  attribute: AttributeName;
  description: string | null;
  has_passive: boolean;
  combat_uses: string | null;
}

export interface Background {
  id: UUID;
  name: string;
  skill_proficiencies: SkillName[];
  tool_proficiency: string | null;
  starting_bonus: string | null;
  description: string | null;
}

// ============================================================================
// REFERENCE DATA — SPELLS
// ============================================================================

export interface Spell {
  id: UUID;
  name: string;
  school: SpellSchool;
  level: SpellLevel;
  essence_cost: number;
  ap_cost: number;
  range_hexes: number | null;
  area_hexes: number | null;
  duration: string | null;
  concentration: boolean;
  ritual: boolean;
  damage_dice: string | null;
  damage_type: DamageType | null;
  condition_applied: ConditionName | null;
  condition_tier: number | null;
  description: string;
  min_tier: number;
}

// ============================================================================
// REFERENCE DATA — EQUIPMENT
// ============================================================================

export interface WeaponTemplate {
  id: UUID;
  name: string;
  category: 'melee' | 'ranged' | 'implement';
  damage_dice: string;
  damage_type: DamageType;
  range_hexes: number | null;
  properties: string[];
  rarity: Rarity;
  cost_gp: number;
  description: string | null;
}

export interface ArmorTemplate {
  id: UUID;
  name: string;
  armor_value: number;
  category: 'light' | 'medium' | 'heavy';
  stealth_disadvantage: boolean;
  free_step_penalty: boolean;
  movement_penalty: boolean;
  enchantment_slots: number;
  rarity: Rarity;
  cost_gp: number;
  description: string | null;
}

export interface AccessoryTemplate {
  id: UUID;
  name: string;
  slot: string;
  rarity: Rarity;
  requires_attunement: boolean;
  attunement_slots: number;
  effects: Record<string, unknown>;
  cost_gp: number;
  description: string | null;
}

export interface Enchantment {
  name: string;
  slot_cost: number;
  effects: Record<string, unknown>;
  materials_used?: string[];
}

// ============================================================================
// REFERENCE DATA — MATERIALS & CRAFTING
// ============================================================================

export interface Material {
  id: UUID;
  name: string;
  category: MaterialCategory;
  rarity: Rarity;
  description: string | null;
  processing_action: string | null;
  processed_form: string | null;
  processing_tn: number | null;
  key_uses: string[];
  source_biomes: string[];
  source_creatures: string[];
}

export interface Recipe {
  id: UUID;
  name: string;
  discipline: CraftingDiscipline;
  tier: 'basic' | 'journeyman' | 'advanced' | 'master';
  tn: number;
  work_units: number;
  materials_required: { material_id: UUID; quantity: number }[];
  output_description: string;
  output_effects: Record<string, unknown>;
}

export interface CraftingProject {
  id: UUID;
  character_id: UUID;
  recipe_id: UUID | null;
  custom_name: string | null;
  discipline: CraftingDiscipline;
  work_units_required: number;
  work_units_completed: number;
  materials_consumed: { material_id: UUID; quantity: number }[];
  status: 'in_progress' | 'completed' | 'failed' | 'abandoned';
  result_quality: string | null;
  created_at: Timestamp;
  completed_at: Timestamp | null;
}

// ============================================================================
// CREATURES
// ============================================================================

export interface Creature {
  id: UUID;
  name: string;
  threat_rating: number;
  tags: CreatureTag[];
  hp: number;
  armor_value: number;
  attack_bonus: number;
  damage_dice: string | null;
  damage_type: DamageType;
  ap: number;
  attributes: Partial<Attributes>;
  abilities: CreatureAbilityEntry[];
  resistances: DamageType[];
  immunities: DamageType[];
  vulnerabilities: DamageType[];
  condition_immunities: ConditionName[];
  speed_hexes: number;
  legendary_actions: number;
  legendary_resistances: number;
  lair_actions: LairAction[];
  phase_thresholds: PhaseThreshold[];
  primary_drop: UUID | null;
  secondary_drop: UUID | null;
  rare_drop: UUID | null;
  harvest_tn: number | null;
  description: string | null;
  is_template: boolean;
  campaign_id: UUID | null;
}

export interface CreatureAbilityEntry {
  name: string;
  description: string;
  ap_cost?: number;
  recharge?: string;
  damage?: string;
  condition?: { name: ConditionName; tier: number };
}

export interface LairAction {
  name: string;
  description: string;
  effect: Record<string, unknown>;
}

export interface PhaseThreshold {
  hp_pct: number;
  changes: Record<string, unknown>;
}

// ============================================================================
// ENCOUNTERS & COMBAT
// ============================================================================

export interface Session {
  id: UUID;
  campaign_id: UUID;
  session_number: number;
  title: string | null;
  status: 'planned' | 'active' | 'completed';
  notes: string | null;
  started_at: Timestamp | null;
  ended_at: Timestamp | null;
}

export interface Encounter {
  id: UUID;
  session_id: UUID | null;
  campaign_id: UUID;
  name: string;
  type: 'combat' | 'social' | 'exploration' | 'puzzle';
  status: 'planning' | 'active' | 'paused' | 'completed';
  difficulty: string | null;
  threat_budget: number | null;
  notes: string | null;
  current_round: number;
  active_turn_index: number;
  map_id: UUID | null;
}

export interface EncounterCreature {
  id: UUID;
  encounter_id: UUID;
  creature_id: UUID;
  instance_name: string | null;
  hp_current: number;
  hp_max: number;
  position_q: number | null;
  position_r: number | null;
  conditions: { condition: ConditionName; tier: number }[];
  is_alive: boolean;
  initiative_roll: number | null;
  legendary_actions_remaining: number;
  legendary_resistances_remaining: number;
}

export interface InitiativeEntry {
  id: UUID;
  encounter_id: UUID;
  character_id: UUID | null;
  creature_instance_id: UUID | null;
  display_name: string;
  initiative_roll: number;
  initiative_modifier: number;
  turn_order: number;
  has_acted: boolean;
  is_delayed: boolean;
  is_surprised: boolean;
}

// ============================================================================
// HEX MAP
// ============================================================================

export interface HexMap {
  id: UUID;
  campaign_id: UUID | null;
  name: string;
  width: number;
  height: number;
  default_terrain: TerrainType;
  fog_of_war: boolean;
}

export interface HexTile {
  id: UUID;
  map_id: UUID;
  q: number;
  r: number;
  terrain: TerrainType;
  elevation: number;
  is_revealed: boolean;
  hazard_damage: string | null;
  hazard_condition: ConditionName | null;
  notes: string | null;
}

export interface MapToken {
  id: UUID;
  map_id: UUID;
  encounter_id: UUID | null;
  character_id: UUID | null;
  creature_instance_id: UUID | null;
  label: string | null;
  q: number;
  r: number;
  size: number;
  is_visible: boolean;
  token_color: string | null;
  token_icon: string | null;
}

// ============================================================================
// CHAT & DICE
// ============================================================================

export interface DiceRoll {
  id: UUID;
  campaign_id: UUID;
  session_id: UUID | null;
  encounter_id: UUID | null;
  user_id: UUID;
  character_id: UUID | null;
  roll_type: 'attack' | 'skill' | 'save' | 'damage' | 'initiative' | 'custom';
  dice_expression: string;
  individual_rolls: number[];
  modifier: number;
  total: number;
  target_number: number | null;
  degree_of_success: 'critical_failure' | 'failure' | 'partial' | 'full' | 'critical' | null;
  description: string | null;
  is_private: boolean;
  rolled_at: Timestamp;
}

export interface ChatMessage {
  id: UUID;
  campaign_id: UUID;
  session_id: UUID | null;
  user_id: UUID;
  character_id: UUID | null;
  channel: 'general' | 'gm' | 'whisper' | 'system';
  content: string;
  is_in_character: boolean;
  whisper_to: UUID | null;
  sent_at: Timestamp;
}
