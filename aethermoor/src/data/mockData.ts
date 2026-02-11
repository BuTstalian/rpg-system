// ============================================================================
// AETHERMOOR — Demo / Mock Data
// ============================================================================

import type { Character, CharacterSkill, CharacterEquipmentItem, CharacterCondition } from '@/types';

export const DEMO_CHARACTER: Character = {
  id: 'demo-sera-vane',
  user_id: 'demo-user',
  campaign_id: null,
  name: 'Sera Vane',
  path: 'wanderer',
  background_id: null,
  tier: 3,
  might: 14,
  finesse: 12,
  resolve: 12,
  insight: 15,
  intellect: 8,
  presence: 8,
  hp_max: 41,
  hp_current: 33,
  armor_value: 3,
  ap_max: 3,
  resource_current: 2,
  resource_max: 5,
  branch_points_spent: 4,
  branch_points_total: 4,
  stat_increases_used: 0,
  expertise_choices: ['survival'],
  appearance: 'Weathered face, cropped dark hair, faded military tattoo on left forearm. Moves with a hunter\'s quiet confidence.',
  personality_traits: ['Always maps escape routes in every room', 'Shares food before eating'],
  flaw: 'Blames herself for her squad\'s deaths — takes reckless risks to protect others',
  bond: 'The dog tags of her fallen squad, worn around her neck',
  drive: 'No one else dies because we weren\'t prepared.',
  tenets: [],
  npc_connections: [
    { name: 'Captain Aldric Thorne', relationship: 'Former commanding officer, retired', notes: 'Owes him a debt' },
    { name: 'Mira Ashwood', relationship: 'Herbalist in Willowfen', notes: 'Taught her foraging' },
  ],
  gold: 87,
  is_active: true,
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-02-08T18:30:00Z',
};

export const DEMO_SKILLS: CharacterSkill[] = [
  { character_id: 'demo-sera-vane', skill: 'survival', proficient: true, expertise: true, source: 'path' },
  { character_id: 'demo-sera-vane', skill: 'perception', proficient: true, expertise: false, source: 'path' },
  { character_id: 'demo-sera-vane', skill: 'performance', proficient: true, expertise: false, source: 'path' },
  { character_id: 'demo-sera-vane', skill: 'athletics', proficient: true, expertise: false, source: 'background' },
  { character_id: 'demo-sera-vane', skill: 'intimidation', proficient: true, expertise: false, source: 'background' },
  { character_id: 'demo-sera-vane', skill: 'endurance', proficient: true, expertise: false, source: 'free' },
  { character_id: 'demo-sera-vane', skill: 'medicine', proficient: true, expertise: false, source: 'free' },
];

export const DEMO_EQUIPMENT: CharacterEquipmentItem[] = [
  {
    id: 'eq-1', character_id: 'demo-sera-vane', item_type: 'weapon', template_id: null,
    custom_name: 'Longbow', custom_effects: {}, rarity: 'common',
    enchantments: [], enchantment_slots_total: 1, enchantment_slots_used: 0,
    is_equipped: true, equip_slot: 'main_hand', is_attuned: false, quantity: 1,
    notes: 'Standard issue from the 4th Rangers',
  },
  {
    id: 'eq-2', character_id: 'demo-sera-vane', item_type: 'weapon', template_id: null,
    custom_name: 'Short Sword', custom_effects: {}, rarity: 'common',
    enchantments: [], enchantment_slots_total: 1, enchantment_slots_used: 0,
    is_equipped: true, equip_slot: 'off_hand', is_attuned: false, quantity: 1,
    notes: null,
  },
  {
    id: 'eq-3', character_id: 'demo-sera-vane', item_type: 'armor', template_id: null,
    custom_name: 'Leather Armor', custom_effects: {}, rarity: 'common',
    enchantments: [], enchantment_slots_total: 1, enchantment_slots_used: 0,
    is_equipped: true, equip_slot: 'armor', is_attuned: false, quantity: 1,
    notes: null,
  },
  {
    id: 'eq-4', character_id: 'demo-sera-vane', item_type: 'accessory', template_id: null,
    custom_name: 'Circlet of Insight', custom_effects: { perception_bonus: 1 }, rarity: 'uncommon',
    enchantments: [{ name: 'Keen Senses', slot_cost: 1, effects: { perception: 1 } }],
    enchantment_slots_total: 2, enchantment_slots_used: 1,
    is_equipped: true, equip_slot: 'head', is_attuned: false, quantity: 1,
    notes: 'Found in the ruins of Thornwatch Keep',
  },
  {
    id: 'eq-5', character_id: 'demo-sera-vane', item_type: 'tool', template_id: null,
    custom_name: 'Navigator\'s Tools', custom_effects: {}, rarity: 'common',
    enchantments: [], enchantment_slots_total: 0, enchantment_slots_used: 0,
    is_equipped: false, equip_slot: null, is_attuned: false, quantity: 1,
    notes: null,
  },
  {
    id: 'eq-6', character_id: 'demo-sera-vane', item_type: 'tool', template_id: null,
    custom_name: 'Herbalism Kit', custom_effects: {}, rarity: 'common',
    enchantments: [], enchantment_slots_total: 0, enchantment_slots_used: 0,
    is_equipped: false, equip_slot: null, is_attuned: false, quantity: 1,
    notes: null,
  },
  {
    id: 'eq-7', character_id: 'demo-sera-vane', item_type: 'consumable', template_id: null,
    custom_name: 'Healing Potion', custom_effects: { heal: '2d6' }, rarity: 'common',
    enchantments: [], enchantment_slots_total: 0, enchantment_slots_used: 0,
    is_equipped: false, equip_slot: null, is_attuned: false, quantity: 3,
    notes: null,
  },
];

export const DEMO_CONDITIONS: CharacterCondition[] = [
  {
    id: 'cond-1', character_id: 'demo-sera-vane',
    condition: 'bleeding', tier: 1, source: 'Wyvern claw', applied_at: '2026-02-08T18:00:00Z',
  },
];

export const DEMO_ABILITIES = [
  { name: 'Resourceful', type: 'core' as const, tier: 1, description: 'Gain 1 Momentum per unique action type each turn.' },
  { name: 'Adapt', type: 'core' as const, tier: 5, description: 'Spend 3 Momentum: use any path ability at Tier 1 effect. 1/encounter.' },
  { name: 'Forage', type: 'branch' as const, branch: 'A', description: 'Party rests restore +25% HP. Always find supplies.' },
  { name: 'Danger Sense', type: 'branch' as const, branch: 'A', description: 'Can\'t be surprised. +3 initiative.' },
  { name: 'Natural Remedy', type: 'branch' as const, branch: 'A', description: '1 AP, 2 Momentum: remove one condition tier from self/adjacent ally.' },
  { name: 'Swift Feet', type: 'branch' as const, branch: 'B', description: 'Free step = 2 hexes instead of 1.' },
];
