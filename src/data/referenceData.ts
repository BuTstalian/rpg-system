// ============================================================================
// AETHERMOOR — Static Reference Data for Character Creator
// ============================================================================

import type { AttributeName, PathName, SkillName, ResourceType } from '@/types/enums';

// ============================================================================
// PATH DATA
// ============================================================================

export interface PathData {
  id: PathName;
  name: string;
  resource: ResourceType;
  resourceLabel: string;
  hpBase: number;
  description: string;
  playstyle: string;
  autoSkills: SkillName[];
  freeExpertise: SkillName | null;
  freeExpertiseTier: number | null;
  complexity: 1 | 2 | 3 | 4 | 5;
  combatRole: string;
  coreT1: { name: string; description: string };
  branches: {
    id: 'A' | 'B' | 'C';
    name: string;
    description: string;
    abilities: { position: number; name: string; description: string }[];
  }[];
}

export const PATHS_DATA: PathData[] = [
  {
    id: 'vanguard',
    name: 'Vanguard',
    resource: 'momentum',
    resourceLabel: 'Momentum',
    hpBase: 12,
    description: 'Frontline tank and damage dealer. Builds Momentum through aggression.',
    playstyle: 'Charge in, absorb hits, and punish enemies who ignore you. Momentum builds as you fight, fueling devastating abilities.',
    autoSkills: ['athletics', 'endurance', 'intimidation'],
    freeExpertise: null,
    freeExpertiseTier: null,
    complexity: 2,
    combatRole: 'Tank / Damage',
    coreT1: { name: 'Battle Stance', description: 'Start of combat: gain 1 Momentum. Free step doesn\'t provoke.' },
    branches: [
      {
        id: 'A', name: 'Juggernaut', description: 'Immovable wall. Maximum defense and damage absorption.',
        abilities: [
          { position: 1, name: 'Iron Skin', description: '2 Momentum: +3 AV until next turn.' },
          { position: 2, name: 'Rooted', description: 'Stationary: attacks against you have disadvantage.' },
          { position: 3, name: 'Absorb Impact', description: '1 AP, 1 Mom: Redirect adjacent ally damage to self.' },
          { position: 4, name: 'Fortress', description: 'Below half HP: +2 AV for encounter.' },
          { position: 5, name: "Titan's Endurance", description: 'Bleed-out timer doubles.' },
        ],
      },
      {
        id: 'B', name: 'Berserker', description: 'Reckless offense. Trade safety for devastating damage output.',
        abilities: [
          { position: 1, name: 'Reckless Swing', description: '2 AP, 2 Mom: Advantage attack; enemies have advantage on you.' },
          { position: 2, name: 'Bloodlust', description: 'Kill enemy: +2 Momentum, +1 AP this turn.' },
          { position: 3, name: 'Frenzy', description: '3 AP, all Mom (min 3): Attacks = Momentum spent.' },
          { position: 4, name: 'Pain Fuel', description: 'Taking damage: +1 Momentum (1/round).' },
          { position: 5, name: 'Death or Glory', description: 'Dying: fight 1 round at 0 HP.' },
        ],
      },
      {
        id: 'C', name: 'Warlord', description: 'Frontline leader. Buff and heal allies while holding the line.',
        abilities: [
          { position: 1, name: 'Rally', description: '1 AP, 2 Mom: Ally in 3 hex heals Might mod HP.' },
          { position: 2, name: 'Press the Attack', description: 'On hit: next ally vs same target +2.' },
          { position: 3, name: 'Hold the Line', description: 'Adjacent allies immune to forced movement.' },
          { position: 4, name: 'Commanding Strike', description: '2 AP, 3 Mom: Ally in 3 hex reaction Strike.' },
          { position: 5, name: 'Inspiring Presence', description: 'Allies in 2 hex immune to Shaken.' },
        ],
      },
    ],
  },
  {
    id: 'shadow',
    name: 'Shadow',
    resource: 'focus',
    resourceLabel: 'Focus',
    hpBase: 8,
    description: 'Precision damage, stealth, and positioning. Depletes Focus for powerful strikes.',
    playstyle: 'Strike from the shadows, exploit weaknesses, and vanish before retaliation. Focus is spent carefully for maximum impact.',
    autoSkills: ['stealth', 'sleight_of_hand', 'acrobatics'],
    freeExpertise: 'stealth',
    freeExpertiseTier: 3,
    complexity: 3,
    combatRole: 'Burst Damage / Control',
    coreT1: { name: 'Unseen Strike', description: 'Attack from stealth: +1d6 damage.' },
    branches: [
      {
        id: 'A', name: 'Assassin', description: 'Maximum single-target damage. End fights before they begin.',
        abilities: [
          { position: 1, name: 'Ambush', description: 'Round 1 before target: Unseen Strike +2d6.' },
          { position: 2, name: 'Exploit Weakness', description: '1 AP, 2 Focus: Next attack applies Exposed T1.' },
          { position: 3, name: 'Lethal Precision', description: 'Unseen Strike maximized vs below half HP.' },
          { position: 4, name: 'Vanishing Strike', description: '3 AP, 3 Focus: Attack then Stealth.' },
          { position: 5, name: 'Execute', description: 'Target ≤10% HP: auto crit.' },
        ],
      },
      {
        id: 'B', name: 'Phantom', description: 'Evasion and misdirection. Impossible to pin down.',
        abilities: [
          { position: 1, name: 'Flicker', description: 'Damaged: 1 Focus to move 1 hex, no reactions.' },
          { position: 2, name: 'Smoke Screen', description: '2 AP, 2 Focus: 2-hex cloud blocks LOS, 2 rounds.' },
          { position: 3, name: 'Ghost Walk', description: 'Move through enemy hexes.' },
          { position: 4, name: 'Mirage', description: '1 AP, 3 Focus: Duplicate in adjacent hex.' },
          { position: 5, name: 'Phase', description: '1/enc: Intangible 1 round.' },
        ],
      },
      {
        id: 'C', name: 'Saboteur', description: 'Traps, debuffs, and equipment destruction.',
        abilities: [
          { position: 1, name: 'Quick Trap', description: '1 AP, 1 Focus: Place trap on adjacent hex.' },
          { position: 2, name: 'Crippling Strike', description: 'Attacks apply Slowed T1 instead of bonus damage.' },
          { position: 3, name: 'Dismantle', description: '2 AP, 2 Focus: Target -2 AV for encounter.' },
          { position: 4, name: 'Web of Traps', description: '3 traps active. +3 TN to detect.' },
          { position: 5, name: 'Sabotage', description: '2 AP adjacent: destroy/turn deployable.' },
        ],
      },
    ],
  },
  {
    id: 'arcanist',
    name: 'Arcanist',
    resource: 'essence',
    resourceLabel: 'Essence',
    hpBase: 6,
    description: 'Versatile prepared caster. Manages a fixed Essence pool across 8 schools of magic.',
    playstyle: 'Prepare spells for the situation, manage Essence carefully. Incredible versatility but fragile.',
    autoSkills: ['arcane_knowledge', 'lore', 'concentration'],
    freeExpertise: 'arcane_knowledge',
    freeExpertiseTier: 3,
    complexity: 4,
    combatRole: 'Damage / Control / Utility',
    coreT1: { name: 'Cantrips', description: 'Know 3 cantrips (0 Essence): arcane bolt, mage hand, detect magic.' },
    branches: [
      {
        id: 'A', name: 'Elementalist', description: 'Raw elemental devastation. Fire, ice, and lightning.',
        abilities: [
          { position: 1, name: 'Firebolt', description: '2 AP, 1 Ess: 3d8 fire, 5 hex. Burning T1.' },
          { position: 2, name: 'Frost Wave', description: '3 AP, 2 Ess: 2d8 cold, 3-hex cone. Chilled T1.' },
          { position: 3, name: 'Lightning Arc', description: '2 AP, 2 Ess: 2d10 lightning, chains +1.' },
          { position: 4, name: 'Elemental Mastery', description: 'Choose element: +1d8, conditions start T2.' },
          { position: 5, name: 'Cataclysm', description: '3 AP, 5 Ess: 5d10, 4-hex radius, condition T2.' },
        ],
      },
      {
        id: 'B', name: 'Warden of Secrets', description: 'Information, counterspells, and temporal manipulation.',
        abilities: [
          { position: 1, name: 'Detect Thoughts', description: '2 AP, 1 Ess: Surface intent, 3 hex.' },
          { position: 2, name: 'Dispel', description: '2 AP, 2 Ess: Remove one magical effect.' },
          { position: 3, name: 'Arcane Eye', description: '1 AP, 1 Ess: Invisible sensor, 10 hex, 5 rounds.' },
          { position: 4, name: 'Counter', description: 'Reaction, 3 Ess: Intellect contest to negate.' },
          { position: 5, name: 'Time Slip', description: '3 AP, 4 Ess: Ally takes full turn. 1/enc.' },
        ],
      },
      {
        id: 'C', name: 'Shaper', description: 'Battlefield manipulation. Walls, zones, and terrain control.',
        abilities: [
          { position: 1, name: 'Arcane Wall', description: '2 AP, 2 Ess: 3-hex force line, 3 rounds.' },
          { position: 2, name: 'Gravity Well', description: '2 AP, 2 Ess: Pull in 2 hex, Slowed T1.' },
          { position: 3, name: 'Blink Field', description: '2 AP, 3 Ess: 3-hex zone, ally free teleport.' },
          { position: 4, name: 'Reshape Terrain', description: '1 Ess: 1 hex difficult/normal toggle.' },
          { position: 5, name: 'Dimensional Lock', description: '3 AP, 4 Ess: No teleport/phase in 3 hex, 3 rounds.' },
        ],
      },
    ],
  },
  {
    id: 'warden',
    name: 'Warden',
    resource: 'attunement',
    resourceLabel: 'Attunement',
    hpBase: 10,
    description: 'Nature and primal power. Attunement builds passively each round.',
    playstyle: 'Patient and escalating. Attunement grows each turn, enabling increasingly powerful abilities as fights progress.',
    autoSkills: ['survival', 'perception', 'endurance'],
    freeExpertise: null,
    freeExpertiseTier: null,
    complexity: 3,
    combatRole: 'Tank / Summoner / Area Control',
    coreT1: { name: "Nature's Pulse", description: '+1 Attunement/turn. +1 bonus on natural terrain.' },
    branches: [
      {
        id: 'A', name: 'Beastcaller', description: 'Animal companion and summoning.',
        abilities: [
          { position: 1, name: 'Bond Companion', description: 'Permanent companion, acts on your turn.' },
          { position: 2, name: 'Pack Tactics', description: 'Both adjacent to enemy: advantage.' },
          { position: 3, name: 'Wild Summon', description: '2 AP, 3 Att: Temp beast, 3 rounds.' },
          { position: 4, name: 'Shared Senses', description: 'Quick Action: see/hear through companion.' },
          { position: 5, name: 'Alpha Command', description: '1 AP, 4 Att: Companion full 3 AP turn.' },
        ],
      },
      {
        id: 'B', name: 'Earthshaper', description: 'Stone, root, and terrain manipulation.',
        abilities: [
          { position: 1, name: 'Stone Skin', description: '1 AP, 2 Att: +3 AV, 2 rounds.' },
          { position: 2, name: 'Entangle', description: '2 AP, 2 Att: 2-hex Slowed T2.' },
          { position: 3, name: 'Tremor', description: '2 AP, 3 Att: 3 hex, Finesse or prone.' },
          { position: 4, name: 'Earth Wall', description: '2 AP, 2 Att: 2-hex barrier, full cover.' },
          { position: 5, name: 'Quake', description: '3 AP, 6 Att: 4d8, 4-hex, Stunned T1.' },
        ],
      },
      {
        id: 'C', name: 'Stormcaller', description: 'Lightning, wind, and weather control.',
        abilities: [
          { position: 1, name: 'Lightning Strike', description: '2 AP, 2 Att: 3d6 lightning, 5 hex.' },
          { position: 2, name: 'Gale Force', description: '2 AP, 2 Att: Push 2 hex, Exposed T1.' },
          { position: 3, name: 'Storm Aura', description: '1 AP, 3 Att: 1d6 lightning aura, 3 rounds.' },
          { position: 4, name: 'Call Lightning', description: '3 AP, 4 Att: Sustained 4d6 bolt/round.' },
          { position: 5, name: 'Tempest', description: '3 AP, 7 Att: 8-hex storm, 2d6/round, 3 rounds.' },
        ],
      },
    ],
  },
  {
    id: 'devotant',
    name: 'Devotant',
    resource: 'conviction',
    resourceLabel: 'Conviction',
    hpBase: 8,
    description: 'Healing, protection, and tenet-driven power. Earns Conviction through roleplay.',
    playstyle: 'Your beliefs fuel your power. Uphold your tenets to earn Conviction, then spend it on miracles and smites.',
    autoSkills: ['medicine', 'composure', 'persuasion'],
    freeExpertise: null,
    freeExpertiseTier: null,
    complexity: 4,
    combatRole: 'Healer / Tank / Damage',
    coreT1: { name: 'Tenets', description: 'Choose 3 tenets. Upholding earns 1 Conviction (max 2/scene).' },
    branches: [
      {
        id: 'A', name: 'Healer', description: 'Restoration and condition removal.',
        abilities: [
          { position: 1, name: 'Mending Touch', description: '1 AP, 1 Conv: Heal 2d8 + Resolve mod.' },
          { position: 2, name: 'Purify', description: '1 AP, 1 Conv: Remove 1 condition tier.' },
          { position: 3, name: 'Healing Aura', description: '2 AP, 3 Conv: 1d6/turn in 2 hex, 3 rounds.' },
          { position: 4, name: 'Revitalize', description: '2 AP, 4 Conv: Stabilize at 25% HP.' },
          { position: 5, name: 'Miracle', description: '3 AP, 6 Conv: Full HP + clear all. 1/camp.' },
        ],
      },
      {
        id: 'B', name: 'Sentinel', description: 'Protection, interception, and shielding allies.',
        abilities: [
          { position: 1, name: 'Shield of Faith', description: '1 AP, 1 Conv: +2 AV, 3 rounds, 3 hex.' },
          { position: 2, name: 'Intercede', description: 'Reaction, 1 Conv: Redirect attack to self.' },
          { position: 3, name: 'Hallowed Ground', description: '2 AP, 3 Conv: 3-hex, enemies -1d6, allies no Shaken.' },
          { position: 4, name: 'Binding Vow', description: '2 AP, 2 Conv: Enemy only attacks you, 3 rounds.' },
          { position: 5, name: "Martyr's Stand", description: 'Die protecting ally: allies +3 AP, bleedout doubles.' },
        ],
      },
      {
        id: 'C', name: 'Zealot', description: 'Righteous damage and retribution.',
        abilities: [
          { position: 1, name: 'Smite', description: '1 Conv on attack: +2d6 spiritual (bypasses AV).' },
          { position: 2, name: 'Righteous Fury', description: 'Ally drops: +3 Conv, advantage 1 round.' },
          { position: 3, name: 'Judgment', description: '2 AP, 2 Conv: Exposed T1 + Shaken T1.' },
          { position: 4, name: 'Aura of Retribution', description: '2 AP, 3 Conv: Enemies hitting allies take 1d8.' },
          { position: 5, name: 'Divine Wrath', description: '3 AP, 5 Conv: 4d10 spiritual. +2d10 vs ally-harmers.' },
        ],
      },
    ],
  },
  {
    id: 'tactician',
    name: 'Tactician',
    resource: 'focus',
    resourceLabel: 'Focus',
    hpBase: 8,
    description: 'Battlefield control and ally empowerment through strategy.',
    playstyle: 'You don\'t fight — you orchestrate. Allies become stronger, enemies become predictable.',
    autoSkills: ['investigation', 'perception', 'lore'],
    freeExpertise: null,
    freeExpertiseTier: null,
    complexity: 4,
    combatRole: 'Support / Control',
    coreT1: { name: 'Assess', description: 'Free, 1/enc: Learn enemy HP, AV, highest stat.' },
    branches: [
      {
        id: 'A', name: 'Field Marshal', description: 'Move and empower allies across the battlefield.',
        abilities: [
          { position: 1, name: 'Direct', description: '1 AP, 1 Focus: Ally in 5 hex moves 2.' },
          { position: 2, name: 'Exploit Opening', description: '1 AP, 2 Focus: Enemy miss → ally reaction Strike.' },
          { position: 3, name: 'Tactical Withdrawal', description: 'Allies in 3 hex: 1 hex no reactions.' },
          { position: 4, name: 'Overwhelming Assault', description: '2 AP, 3 Focus: Next 2 allies have advantage.' },
          { position: 5, name: 'Grand Strategy', description: '3 AP, 5 Focus: All allies turn simultaneously. 1/enc.' },
        ],
      },
      {
        id: 'B', name: 'Analyst', description: 'Learn enemy patterns and exploit them ruthlessly.',
        abilities: [
          { position: 1, name: 'Find Weakness', description: '1 AP, 1 Focus: Exposed T1, 3 rounds.' },
          { position: 2, name: 'Predict', description: 'Reaction, 1 Focus: Guess target, +3 AV if right.' },
          { position: 3, name: 'Profile', description: 'After 2 rounds: learn all enemy abilities/resists.' },
          { position: 4, name: 'Exploit Pattern', description: '2 AP, 3 Focus: Profiled enemy disadvantage, 2 rounds.' },
          { position: 5, name: 'Trap Architect', description: '3 kill zone hexes: +2d6 from ally attacks.' },
        ],
      },
      {
        id: 'C', name: 'Vanguard Commander', description: 'Lead from the front with tempo control.',
        abilities: [
          { position: 1, name: 'Lead from Front', description: 'Your Strike: adjacent ally free Quick Action.' },
          { position: 2, name: 'Battle Tempo', description: 'Choose: Aggressive (+1 AP, -1 AV) or Defensive (+2 AV, -1 AP).' },
          { position: 3, name: 'War Horn', description: '2 AP, 2 Focus: All allies +1 AP next turn.' },
          { position: 4, name: 'Unbreakable Formation', description: 'Adjacent allies: +1 AV each (max +3).' },
          { position: 5, name: 'Coup de Grâce', description: '3 AP, 4 Focus: Enemy <25%, all allies Strike.' },
        ],
      },
    ],
  },
  {
    id: 'artificer',
    name: 'Artificer',
    resource: 'preparation',
    resourceLabel: 'Preparation',
    hpBase: 8,
    description: 'Crafting, deployables, and gadgets. Pre-loads Preparation slots before encounters.',
    playstyle: 'Plan ahead. Load up consumables and deployables, then control the field with turrets, traps, and enhancements.',
    autoSkills: ['crafting', 'arcane_knowledge', 'investigation'],
    freeExpertise: 'crafting',
    freeExpertiseTier: 3,
    complexity: 5,
    combatRole: 'Utility / Control / Support',
    coreT1: { name: 'Tinkerer', description: 'Craft during Breathers. Prep slots = Int mod + tier.' },
    branches: [
      {
        id: 'A', name: 'Alchemist', description: 'Consumables, potions, and chemical warfare.',
        abilities: [
          { position: 1, name: 'Quick Brew', description: '2 AP, 1 Prep: Create consumable mid-combat.' },
          { position: 2, name: 'Potent Mixtures', description: 'Consumables +1d6 damage or healing.' },
          { position: 3, name: 'Volatile Reaction', description: 'Thrown consumables splash half effect.' },
          { position: 4, name: 'Dual Throw', description: '3 AP: Two consumables at once.' },
          { position: 5, name: "Philosopher's Touch", description: 'Heals cleanse 1 condition. Damage = T2.' },
        ],
      },
      {
        id: 'B', name: 'Engineer', description: 'Turrets, traps, and deployable constructs.',
        abilities: [
          { position: 1, name: 'Improved Turret', description: '+2 hit, +1d6 damage, +50% HP.' },
          { position: 2, name: 'Trap Network', description: 'Linked traps all trigger together.' },
          { position: 3, name: 'Overclock', description: '1 AP, 1 Prep: Deployable acts twice.' },
          { position: 4, name: 'Remote Control', description: 'Control deployables from anywhere.' },
          { position: 5, name: 'Magnum Opus', description: '3 AP, 4 Prep: Siege engine, 4d10, 10 hex.' },
        ],
      },
      {
        id: 'C', name: 'Enchanter', description: 'Weapon imbuing, protective runes, and permanent enchantments.',
        abilities: [
          { position: 1, name: 'Imbue Weapon', description: '1 AP, 1 Prep: +1d6 elemental, 3 rounds.' },
          { position: 2, name: 'Warding Rune', description: '2 AP, 2 Prep: Hex rune, 3d6 + Stunned T1.' },
          { position: 3, name: 'Enchanted Armor', description: '1 AP, 1 Prep: Grant armor property.' },
          { position: 4, name: 'Nullify', description: 'Reaction, 2 Prep: Counter magical effect.' },
          { position: 5, name: 'Arcane Forge', description: 'Full Recovery: permanent enchantment.' },
        ],
      },
    ],
  },
  {
    id: 'wanderer',
    name: 'Wanderer',
    resource: 'momentum',
    resourceLabel: 'Momentum',
    hpBase: 10,
    description: 'Adaptable jack-of-all-trades. Builds Momentum through varied actions.',
    playstyle: 'Do something different each turn. Variety is your strength — the more diverse your actions, the more Momentum you build.',
    autoSkills: ['survival', 'perception', 'performance'],
    freeExpertise: 'survival',
    freeExpertiseTier: 3,
    complexity: 2,
    combatRole: 'Flexible',
    coreT1: { name: 'Resourceful', description: '+1 Momentum per unique action type each turn.' },
    branches: [
      {
        id: 'A', name: 'Survivalist', description: 'Endurance, healing, and wilderness mastery.',
        abilities: [
          { position: 1, name: 'Forage', description: 'Party rests +25% HP. Always find supplies.' },
          { position: 2, name: 'Danger Sense', description: "Can't be surprised. +3 initiative." },
          { position: 3, name: 'Natural Remedy', description: '1 AP, 2 Mom: Remove 1 condition tier.' },
          { position: 4, name: 'Hunker Down', description: "2 AP: +4 AV, advantage saves. Can't move." },
          { position: 5, name: 'Last Stand', description: '≤25% HP: +1 AP, +1d6 damage.' },
        ],
      },
      {
        id: 'B', name: 'Drifter', description: 'Speed, mobility, and opportunistic strikes.',
        abilities: [
          { position: 1, name: 'Swift Feet', description: 'Free step = 2 hexes.' },
          { position: 2, name: 'Opportunist', description: 'Enemy ability nearby: reaction Strike.' },
          { position: 3, name: 'Slippery', description: 'OA disadvantage. Free disengage 1/round.' },
          { position: 4, name: 'Exploit Terrain', description: '1 AP, 1 Mom: Advantage via environment.' },
          { position: 5, name: 'Momentum Burst', description: 'All Mom (min 4): Extra turn. 1/enc.' },
        ],
      },
      {
        id: 'C', name: 'Lorekeeper', description: 'Knowledge, inspiration, and party support.',
        abilities: [
          { position: 1, name: 'Quick Study', description: 'Observe 1 round: learn resists/vulns.' },
          { position: 2, name: 'Bardic Knowledge', description: '1/scene: yes/no question to GM.' },
          { position: 3, name: 'Inspire', description: '1 AP, 2 Mom: Ally +1d6 next check.' },
          { position: 4, name: 'Linguist', description: 'Basic communication with any intelligent creature.' },
          { position: 5, name: 'Chronicler', description: 'Party +10% milestone progress.' },
        ],
      },
    ],
  },
  {
    id: 'channeler',
    name: 'Channeler',
    resource: 'flux',
    resourceLabel: 'Flux',
    hpBase: 6,
    description: 'High-variance instinctive caster. Rolls volatile Flux each round.',
    playstyle: 'Embrace chaos. Roll your Flux each turn and make the best of it — or burn HP to fuel your power.',
    autoSkills: ['concentration', 'composure', 'arcane_knowledge'],
    freeExpertise: null,
    freeExpertiseTier: null,
    complexity: 4,
    combatRole: 'Damage / Support (unpredictable)',
    coreT1: { name: 'Flux Surge', description: 'Start of turn: roll 1d6 = Flux this round.' },
    branches: [
      {
        id: 'A', name: 'Stormborn', description: 'Raw destructive power with random elements.',
        abilities: [
          { position: 1, name: 'Raw Bolt', description: '2 AP, 1 Flux: 2d10, random element, 5 hex.' },
          { position: 2, name: 'Surge', description: '2 AP, 3 Flux: 4d10, 2-hex radius, condition T1.' },
          { position: 3, name: 'Volatile Aura', description: 'Overchanneling: 1d6 to enemies in 1 hex.' },
          { position: 4, name: 'Chain Reaction', description: 'Max die: explodes (reroll and add).' },
          { position: 5, name: 'Cataclysmic Surge', description: '3 AP, 6 Flux: 8d10, 3-hex, T2. Self 2d6.' },
        ],
      },
      {
        id: 'B', name: 'Empath', description: 'Psychic damage, emotional manipulation, and mind control.',
        abilities: [
          { position: 1, name: 'Mind Spike', description: '2 AP, 1 Flux: 2d8 psychic (bypass AV), 4 hex.' },
          { position: 2, name: 'Emotional Cascade', description: '2 AP, 2 Flux: Shaken T1 splash.' },
          { position: 3, name: 'Empathic Link', description: '1 AP, 1 Flux: +2 Res/Ins ally, take 25% damage.' },
          { position: 4, name: 'Psychic Scream', description: '3 AP, 4 Flux: 3 hex Stunned T2.' },
          { position: 5, name: 'Dominate', description: '3 AP, 5 Flux: Control target next turn.' },
        ],
      },
      {
        id: 'C', name: 'Conduit', description: 'Energy transfer, shielding, and party resource support.',
        abilities: [
          { position: 1, name: 'Energy Transfer', description: '1 AP, 2 Flux: Give ally 2 resource.' },
          { position: 2, name: 'Flux Shield', description: 'Reaction, 2 Flux: Absorb 3x Flux damage.' },
          { position: 3, name: 'Amplify', description: '1 AP, 1 Flux: Ally next ability +50%.' },
          { position: 4, name: 'Siphon', description: 'Enemy magic nearby: +1 Flux.' },
          { position: 5, name: 'Convergence', description: '3 AP, 6 Flux: Allies in 4 hex: +1 resource, 2d8 HP.' },
        ],
      },
    ],
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    resource: 'conviction',
    resourceLabel: 'Conviction',
    hpBase: 6,
    description: 'Social mastery and combat debuffs. Earns Conviction through social encounters.',
    playstyle: 'Words are your weapon. Demoralize enemies, empower allies, and control the social battlefield.',
    autoSkills: ['persuasion', 'deception', 'intuition'],
    freeExpertise: 'persuasion',
    freeExpertiseTier: 3,
    complexity: 3,
    combatRole: 'Debuff / Support',
    coreT1: { name: 'Read the Room', description: 'Social: all dispositions. Combat: enemy lowest stat.' },
    branches: [
      {
        id: 'A', name: 'Provocateur', description: 'Taunts, debuffs, and enemy manipulation.',
        abilities: [
          { position: 1, name: 'Taunt', description: '1 AP, 1 Conv: Target must attack you.' },
          { position: 2, name: 'Undermine', description: '1 AP, 1 Conv: Target -2 all checks.' },
          { position: 3, name: 'Sow Discord', description: '2 AP, 3 Conv: 2 enemies attack each other.' },
          { position: 4, name: 'Psychic Pressure', description: 'Conditioned enemies: 1d4/tier.' },
          { position: 5, name: 'Unravel', description: '3 AP, 4 Conv: ALL T1 conditions on target.' },
        ],
      },
      {
        id: 'B', name: 'Negotiator', description: 'Information gathering, contacts, and social leverage.',
        abilities: [
          { position: 1, name: 'Bribe', description: 'Know NPC values. +5 deal checks.' },
          { position: 2, name: 'Network', description: '1 hour in settlement: find useful contact.' },
          { position: 3, name: 'Blackmail', description: '2 AP, 3 Conv: Compel with damaging info.' },
          { position: 4, name: 'Treaty', description: 'Negotiate binding agreements.' },
          { position: 5, name: 'Information Broker', description: '1/rest: specific question, accurate answer.' },
        ],
      },
      {
        id: 'C', name: 'Inspirer', description: 'Ally empowerment, rerolls, and morale.',
        abilities: [
          { position: 1, name: 'Rallying Speech', description: '2 AP, 2 Conv: Allies in 5 hex +1 AP.' },
          { position: 2, name: 'Bolster', description: '1 AP, 1 Conv: Ally rerolls failed check.' },
          { position: 3, name: 'You Can Do This', description: 'Reaction, 1 Conv: Reduce ally condition tier.' },
          { position: 4, name: 'Legend in the Making', description: 'Ally crits: +1 Conv, temp HP.' },
          { position: 5, name: 'Undeniable Presence', description: '3 AP, 5 Conv: +1d6, +2 AV, immune Shaken/Stunned T1.' },
        ],
      },
    ],
  },
];

// ============================================================================
// BACKGROUND DATA
// ============================================================================

export interface BackgroundData {
  name: string;
  skills: SkillName[];
  tool: string | null;
  bonus: string;
  description: string;
}

export const BACKGROUNDS_DATA: BackgroundData[] = [
  { name: 'Soldier', skills: ['athletics', 'intimidation'], tool: "Navigator's Tools", bonus: '+1 to initiative', description: 'You served in an organized fighting force.' },
  { name: 'Scholar', skills: ['lore', 'arcane_knowledge'], tool: "Calligrapher's Supplies", bonus: '2 extra languages', description: 'Years in libraries taught you to learn anything.' },
  { name: 'Criminal', skills: ['stealth', 'deception'], tool: "Thieves' Tools", bonus: 'Find black market in 1 day', description: 'You lived outside the law.' },
  { name: 'Merchant', skills: ['persuasion', 'intuition'], tool: "Cartographer's Tools", bonus: '+10% buy/sell', description: 'Trade routes and negotiation are second nature.' },
  { name: 'Artisan', skills: ['crafting', 'perception'], tool: 'Crafting tool of choice', bonus: '1 Uncommon recipe known', description: 'You apprenticed under a master crafter.' },
  { name: 'Healer', skills: ['medicine', 'survival'], tool: "Healer's Kit", bonus: 'Mundane healing +2 HP', description: 'You tended the sick and wounded.' },
  { name: 'Noble', skills: ['persuasion', 'performance'], tool: "Calligrapher's Supplies", bonus: '3x starting gold', description: 'Born to privilege, trained in courtly ways.' },
  { name: 'Sailor', skills: ['athletics', 'survival'], tool: "Navigator's Tools", bonus: 'Advantage on watercraft', description: 'You spent years at sea.' },
  { name: 'Entertainer', skills: ['performance', 'acrobatics'], tool: 'Musical Instrument', bonus: 'Free lodging by performing', description: 'You captivate crowds.' },
  { name: 'Hermit', skills: ['survival', 'composure'], tool: 'Herbalism Kit', bonus: 'Secret truth (GM collab)', description: 'You lived alone, contemplating deep truths.' },
  { name: 'Spy', skills: ['deception', 'stealth'], tool: 'Disguise Kit', bonus: 'Established cover identity', description: 'You gathered secrets for pay or ideology.' },
  { name: 'Hunter', skills: ['marksmanship', 'survival'], tool: 'Herbalism Kit', bonus: '+2 creature harvesting', description: 'You tracked and killed to survive.' },
  { name: 'Priest', skills: ['medicine', 'persuasion'], tool: "Healer's Kit", bonus: 'Advantage Persuasion w/ faithful', description: 'Faith guided your hand.' },
  { name: 'Urchin', skills: ['sleight_of_hand', 'stealth'], tool: "Thieves' Tools", bonus: 'Free urban shelter', description: 'The streets raised you.' },
  { name: 'Explorer', skills: ['perception', 'survival'], tool: "Cartographer's Tools", bonus: '1 secret per new region', description: 'Every horizon is a promise.' },
  { name: 'Bureaucrat', skills: ['investigation', 'persuasion'], tool: "Calligrapher's Supplies", bonus: 'Advantage legal systems', description: 'You know how the system works.' },
  { name: 'Blacksmith', skills: ['crafting', 'endurance'], tool: "Smith's Tools", bonus: 'Start with self-made gear', description: 'Forge-heat and hammer-song shaped your youth.' },
  { name: 'Alchemist', skills: ['crafting', 'arcane_knowledge'], tool: 'Alchemy Kit', bonus: '3 basic alchemy recipes', description: 'Bubbling flasks were your art.' },
  { name: 'Guard', skills: ['perception', 'athletics'], tool: null, bonus: 'Authority in home city', description: 'You kept watch and stood your ground.' },
  { name: 'Farmer', skills: ['endurance', 'survival'], tool: 'Cooking Utensils', bonus: 'Cooking always decent+', description: 'Hard soil taught you resilience.' },
];

// ============================================================================
// SKILL DISPLAY DATA
// ============================================================================

export interface SkillDisplayData {
  id: SkillName;
  name: string;
  attribute: AttributeName;
  hasPassive: boolean;
}

export const SKILLS_DATA: SkillDisplayData[] = [
  { id: 'athletics', name: 'Athletics', attribute: 'might', hasPassive: false },
  { id: 'endurance', name: 'Endurance', attribute: 'might', hasPassive: false },
  { id: 'intimidation', name: 'Intimidation', attribute: 'might', hasPassive: false },
  { id: 'acrobatics', name: 'Acrobatics', attribute: 'finesse', hasPassive: false },
  { id: 'stealth', name: 'Stealth', attribute: 'finesse', hasPassive: false },
  { id: 'sleight_of_hand', name: 'Sleight of Hand', attribute: 'finesse', hasPassive: false },
  { id: 'marksmanship', name: 'Marksmanship', attribute: 'finesse', hasPassive: false },
  { id: 'composure', name: 'Composure', attribute: 'resolve', hasPassive: true },
  { id: 'concentration', name: 'Concentration', attribute: 'resolve', hasPassive: false },
  { id: 'survival', name: 'Survival', attribute: 'resolve', hasPassive: true },
  { id: 'perception', name: 'Perception', attribute: 'insight', hasPassive: true },
  { id: 'intuition', name: 'Intuition', attribute: 'insight', hasPassive: true },
  { id: 'medicine', name: 'Medicine', attribute: 'insight', hasPassive: false },
  { id: 'lore', name: 'Lore', attribute: 'intellect', hasPassive: false },
  { id: 'investigation', name: 'Investigation', attribute: 'intellect', hasPassive: false },
  { id: 'crafting', name: 'Crafting', attribute: 'intellect', hasPassive: false },
  { id: 'arcane_knowledge', name: 'Arcane Knowledge', attribute: 'intellect', hasPassive: true },
  { id: 'persuasion', name: 'Persuasion', attribute: 'presence', hasPassive: false },
  { id: 'deception', name: 'Deception', attribute: 'presence', hasPassive: false },
  { id: 'performance', name: 'Performance', attribute: 'presence', hasPassive: false },
];

// ============================================================================
// HELPER LOOKUPS
// ============================================================================

export function getPathData(id: PathName): PathData | undefined {
  return PATHS_DATA.find(p => p.id === id);
}

export function getBackgroundData(name: string): BackgroundData | undefined {
  return BACKGROUNDS_DATA.find(b => b.name === name);
}

// Attribute display names
export const ATTRIBUTE_LABELS: Record<AttributeName, string> = {
  might: 'Might',
  finesse: 'Finesse',
  resolve: 'Resolve',
  insight: 'Insight',
  intellect: 'Intellect',
  presence: 'Presence',
};

export const ATTRIBUTE_DESCRIPTIONS: Record<AttributeName, string> = {
  might: 'Physical power, melee, endurance',
  finesse: 'Agility, accuracy, reflexes',
  resolve: 'Willpower, mental fortitude, grit',
  insight: 'Awareness, perception, empathy',
  intellect: 'Knowledge, reasoning, magic theory',
  presence: 'Charisma, force of personality, leadership',
};
