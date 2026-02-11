-- ============================================================================
-- AETHERMOOR — Seed Data: Paths, Skills, Backgrounds
-- ============================================================================

-- ============================================================================
-- PATHS
-- ============================================================================

insert into paths (id, display_name, resource, hp_base, description, auto_skills, free_expertise_skill, free_expertise_tier, complexity, combat_role) values
  ('vanguard', 'Vanguard', 'momentum', 12, 'Frontline tank and damage dealer. Builds momentum through aggression.', '{athletics,endurance,intimidation}', null, null, 2, 'Tank / Damage'),
  ('shadow', 'Shadow', 'focus', 8, 'Precision damage, stealth, and positioning specialist.', '{stealth,sleight_of_hand,acrobatics}', 'stealth', 3, 3, 'Burst Damage / Control'),
  ('arcanist', 'Arcanist', 'essence', 6, 'Versatile prepared caster with elemental power and control.', '{arcane_knowledge,lore,concentration}', 'arcane_knowledge', 3, 4, 'Damage / Control / Utility'),
  ('warden', 'Warden', 'attunement', 10, 'Nature and primal power. Endurance, summoning, environmental control.', '{survival,perception,endurance}', null, null, 3, 'Tank / Summoner / Area Control'),
  ('devotant', 'Devotant', 'conviction', 8, 'Healing, protection, and tenet-driven spiritual authority.', '{medicine,composure,persuasion}', null, null, 4, 'Healer / Tank / Damage'),
  ('tactician', 'Tactician', 'focus', 8, 'Battlefield control and ally empowerment through strategy.', '{investigation,perception,lore}', null, null, 4, 'Support / Control'),
  ('artificer', 'Artificer', 'preparation', 8, 'Crafting specialist with deployables, gadgets, and augmentation.', '{crafting,arcane_knowledge,investigation}', 'crafting', 3, 5, 'Utility / Control / Support'),
  ('wanderer', 'Wanderer', 'momentum', 10, 'Adaptable jack-of-all-trades. Builds momentum through variety.', '{survival,perception,performance}', 'survival', 3, 2, 'Flexible'),
  ('channeler', 'Channeler', 'flux', 6, 'High-variance volatile caster. Instinctive magic with risk/reward.', '{concentration,composure,arcane_knowledge}', null, null, 4, 'Damage / Support (unpredictable)'),
  ('diplomat', 'Diplomat', 'conviction', 6, 'Social mastery, combat debuffs, manipulation, and information.', '{persuasion,deception,intuition}', 'persuasion', 3, 3, 'Debuff / Support');

-- ============================================================================
-- PATH CORE ABILITIES
-- ============================================================================

-- Vanguard
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('vanguard', 1, 'Battle Stance', 'Start of combat: gain 1 Momentum. Free step into adjacent hex doesn''t provoke reactions.', '{"momentum_gain": 1, "free_step_safe": true}'),
  ('vanguard', 5, 'Unyielding', 'When reduced below 1 HP, once per encounter, stay at 1 HP and gain 3 Momentum.', '{"trigger": "below_1hp", "uses_per_encounter": 1, "momentum_gain": 3}'),
  ('vanguard', 10, 'Warcry', 'Enemies within 2 hexes: Resolve check or Shaken Tier 1. Generates 2 Momentum.', '{"ap_cost": 2, "range_hexes": 2, "condition": "shaken", "condition_tier": 1, "momentum_gain": 2}'),
  ('vanguard', 15, 'Unstoppable', 'Can''t be reduced below 1 AP by conditions. Momentum cap doubles.', '{"min_ap": 1, "momentum_cap_multiplier": 2}'),
  ('vanguard', 20, 'Titan', 'Unyielding triggers twice per encounter. Warcry affects 4 hexes and applies Shaken Tier 2.', '{"unyielding_uses": 2, "warcry_range": 4, "warcry_tier": 2}');

-- Shadow
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('shadow', 1, 'Unseen Strike', 'Attack from stealth or unseen: +1d6 damage.', '{"bonus_damage": "1d6", "trigger": "stealth_or_unseen"}'),
  ('shadow', 5, 'Evasion', 'Spend 1 Focus: half damage from area effects (no damage on successful save).', '{"focus_cost": 1, "area_damage_reduction": "half_or_zero"}'),
  ('shadow', 10, 'Shadow Step', 'Teleport to any hex within 3 hexes in dim light/shadow.', '{"ap_cost": 1, "focus_cost": 2, "range_hexes": 3, "requires": "dim_light"}'),
  ('shadow', 15, 'Death Mark', 'Once/encounter: mark target. All ally attacks gain Unseen Strike bonus for 2 rounds.', '{"uses_per_encounter": 1, "duration_rounds": 2}'),
  ('shadow', 20, 'Phantom Blade', 'Unseen Strike deals +3d6. Shadow Step range becomes 5 hexes.', '{"unseen_strike_damage": "3d6", "shadow_step_range": 5}');

-- Arcanist
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('arcanist', 1, 'Cantrips', 'Know 3 minor spells (0 Essence): arcane bolt (1d8, 4 hex), mage hand, detect magic.', '{"cantrips_known": 3}'),
  ('arcanist', 5, 'Metamagic', 'Once/encounter: extend range 50%, widen area 1 hex, or increase damage one die size.', '{"uses_per_encounter": 1, "options": ["extend_range", "widen_area", "increase_die"]}'),
  ('arcanist', 10, 'Arcane Shield', 'Negate one hit against you or ally within 3 hexes.', '{"ap_cost": 0, "essence_cost": 2, "reaction": true, "range_hexes": 3}'),
  ('arcanist', 15, 'Grand Arcana', 'Learn one spell from any branch. Once/full recovery: cast any known spell at double effect, 0 cost.', '{"bonus_spell": 1, "free_cast_per_recovery": 1}'),
  ('arcanist', 20, 'Archmage', 'Metamagic usable twice/encounter. Arcane Shield costs 1 Essence.', '{"metamagic_uses": 2, "arcane_shield_cost": 1}');

-- Warden
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('warden', 1, 'Nature''s Pulse', 'Gain 1 Attunement/turn. +1 bonus on natural terrain.', '{"attunement_per_turn": 1, "natural_terrain_bonus": 1}'),
  ('warden', 5, 'Primal Resilience', 'Poisoned and Chilled always treated as one tier lower.', '{"condition_reduction": ["poisoned", "chilled"]}'),
  ('warden', 10, 'Wild Empathy', 'Communicate with animals. They start neutral unless provoked.', '{"animal_communication": true}'),
  ('warden', 15, 'Avatar of the Wild', 'Transform 3 rounds: +4 AV, +2 physical stats, +1d10 primal damage.', '{"ap_cost": 3, "attunement_cost": 8, "duration_rounds": 3, "av_bonus": 4, "stat_bonus": 2, "bonus_damage": "1d10"}'),
  ('warden', 20, 'Primal Ascendant', 'Nature''s Pulse generates 2/turn. Avatar lasts 5 rounds.', '{"attunement_per_turn": 2, "avatar_duration": 5}');

-- Devotant
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('devotant', 1, 'Tenets', 'Choose 3 tenets. Upholding earns 1 Conviction (max 2/scene, GM awards).', '{"tenets_count": 3, "conviction_per_scene": 2}'),
  ('devotant', 5, 'Sanctify', '1-hex area: allies gain +1 all checks, 3 rounds.', '{"ap_cost": 1, "conviction_cost": 1, "radius_hexes": 1, "bonus": 1, "duration_rounds": 3}'),
  ('devotant', 10, 'Tenet''s Reward', 'Critical success on tenet-related check: gain 2 Conviction immediately.', '{"trigger": "critical_tenet", "conviction_gain": 2}'),
  ('devotant', 15, 'Divine Mandate', 'Once/full recovery: auto-succeed one check, OR heal all allies within 5 hexes for 50% max HP.', '{"uses_per_recovery": 1, "min_conviction": 5}'),
  ('devotant', 20, 'Living Saint', 'Conviction cap doubles. Tenet''s Reward triggers on Full Success as well.', '{"conviction_cap_multiplier": 2, "reward_on_full": true}');

-- Tactician
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('tactician', 1, 'Assess', 'Learn enemy''s HP total, AV, and highest stat.', '{"ap_cost": 0, "uses_per_encounter": 1}'),
  ('tactician', 5, 'Coordinated Maneuver', '1/round: redirect moving ally by 1 hex at no cost.', '{"uses_per_round": 1, "redirect_hexes": 1}'),
  ('tactician', 10, 'Master Plan', 'Declare condition. If allies follow: +2 all checks, 3 rounds.', '{"ap_cost": 1, "focus_cost": 3, "bonus": 2, "duration_rounds": 3}'),
  ('tactician', 15, 'Supreme Commander', 'Focus regen = 2/round. Allies within 5 hexes can spend your Focus.', '{"focus_regen": 2, "share_range": 5}'),
  ('tactician', 20, 'Grand Marshal', 'Assess works on all enemies. Master Plan bonus becomes +3.', '{"assess_all": true, "master_plan_bonus": 3}');

-- Artificer
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('artificer', 1, 'Tinkerer', 'Craft during Breathers (1 work unit). Prep slots = Intellect mod + tier.', '{"breather_crafting": true}'),
  ('artificer', 5, 'Field Repair', 'Restore 2 AV to adjacent ally''s armor or HP to deployable.', '{"ap_cost": 1, "av_restore": 2}'),
  ('artificer', 10, 'Rapid Deploy', 'Deployables/traps cost 1 less AP (min 1).', '{"ap_reduction": 1}'),
  ('artificer', 15, 'Masterwork', 'Once/full recovery: craft one item instantly at critical success quality.', '{"uses_per_recovery": 1, "auto_critical": true}'),
  ('artificer', 20, 'Grand Artificer', 'Prep slots double. Field Repair restores 4 AV.', '{"prep_multiplier": 2, "field_repair_av": 4}');

-- Wanderer
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('wanderer', 1, 'Resourceful', 'Gain 1 Momentum per unique action type each turn.', '{"momentum_per_unique_action": 1}'),
  ('wanderer', 5, 'Adapt', 'Spend 3 Momentum: use any ability from any path at Tier 1 effect. 1/encounter.', '{"momentum_cost": 3, "uses_per_encounter": 1}'),
  ('wanderer', 10, 'Trailblazer', 'Difficult terrain no extra AP. Can''t be tracked non-magically.', '{"ignore_difficult_terrain": true, "untrackable": true}'),
  ('wanderer', 15, 'Omni-Talent', 'Proficient in all skills. Adapt twice/encounter.', '{"all_proficient": true, "adapt_uses": 2}'),
  ('wanderer', 20, 'Legend', 'Adapt costs 2 Momentum. Three uses per encounter.', '{"adapt_cost": 2, "adapt_uses": 3}');

-- Channeler
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('channeler', 1, 'Flux Surge', 'Start of turn: roll 1d6 = your Flux this round. Unspent doesn''t carry over.', '{"flux_die": "1d6"}'),
  ('channeler', 5, 'Overchannel', 'Spend HP for Flux (3 HP per 1 Flux). No limit.', '{"hp_per_flux": 3}'),
  ('channeler', 10, 'Wild Power', 'Roll 6 on Flux die: generate 8 instead. First ability costs 1 less Flux.', '{"max_roll_bonus": 8, "first_ability_discount": 1}'),
  ('channeler', 15, 'Chaos Ascendant', 'Roll 2d6: choose either die or their sum. Overchannel = 2 HP per 1 Flux.', '{"flux_die": "2d6", "hp_per_flux": 2}'),
  ('channeler', 20, 'Living Storm', 'Roll 2d8. Overchannel = 1 HP per 1 Flux. Wild Power triggers on max of either die.', '{"flux_die": "2d8", "hp_per_flux": 1}');

-- Diplomat
insert into path_core_abilities (path_id, tier, name, description, mechanics) values
  ('diplomat', 1, 'Read the Room', 'Social: learn all NPC dispositions. Combat: learn one enemy''s lowest stat.', '{"social_read": true, "combat_read": "lowest_stat"}'),
  ('diplomat', 5, 'Silver Tongue', 'Advantage on Persuasion, Deception, Performance. +1 Conviction per successful social check.', '{"advantage_skills": ["persuasion","deception","performance"], "conviction_per_success": 1}'),
  ('diplomat', 10, 'Parley', 'Mid-combat: target makes Resolve check vs Presence or stops attacking 1 round.', '{"ap_cost": 2, "conviction_cost": 2, "duration_rounds": 1}'),
  ('diplomat', 15, 'Mastermind', 'Spend Conviction for other path abilities (2x cost). Social abilities work without shared language.', '{"cross_path_multiplier": 2, "universal_language": true}'),
  ('diplomat', 20, 'Grand Diplomat', 'Silver Tongue generates 2 Conviction per success. Parley affects 3 targets.', '{"conviction_per_success": 2, "parley_targets": 3}');

-- ============================================================================
-- SKILLS
-- ============================================================================

insert into skills (id, display_name, attribute, description, has_passive, combat_uses) values
  ('athletics', 'Athletics', 'might', 'Climbing, swimming, jumping, lifting, grappling, breaking objects.', false, 'Grappling, shoving, breaking restraints'),
  ('endurance', 'Endurance', 'might', 'Resisting physical hardship, forced marches, holding breath, poison resistance.', false, 'Substitute for Resolve saves vs physical conditions'),
  ('intimidation', 'Intimidation', 'might', 'Coercing through fear, threatening, breaking morale.', false, 'Apply Shaken (2 AP, contested vs Resolve)'),
  ('acrobatics', 'Acrobatics', 'finesse', 'Balance, tumbling, contortion, aerial maneuvers, dodging hazards.', false, 'Escape grapples, avoid opportunity attacks'),
  ('stealth', 'Stealth', 'finesse', 'Moving unseen/unheard, hiding, shadowing, ambush positioning.', false, 'Enter/maintain stealth (1 AP vs Perception)'),
  ('sleight_of_hand', 'Sleight of Hand', 'finesse', 'Pickpocketing, planting items, lockpicking, trap disarming.', false, 'Disarm traps, steal, apply poison'),
  ('marksmanship', 'Marksmanship', 'finesse', 'Precision ranged/thrown, trick shots, called shots.', false, 'Called shots with bonus effects'),
  ('composure', 'Composure', 'resolve', 'Mental control under pressure, resisting interrogation.', true, 'Saves against Shaken, fear-based Enchantment'),
  ('concentration', 'Concentration', 'resolve', 'Maintaining focus on sustained effects under pressure.', false, 'Concentration checks when damaged while maintaining spell'),
  ('survival', 'Survival', 'resolve', 'Navigating wilderness, tracking, foraging, weather prediction.', true, 'Identify creature weaknesses from behavior'),
  ('perception', 'Perception', 'insight', 'Noticing hidden things, spotting enemies, detecting traps.', true, 'Spot hidden enemies, notice traps, identify illusions'),
  ('intuition', 'Intuition', 'insight', 'Gut feelings, reading true intentions, detecting lies.', true, 'Contested vs Deception for feints'),
  ('medicine', 'Medicine', 'insight', 'Treating wounds, diagnosing illness, harvesting creature organs.', false, 'First Aid (2 AP, TN 12), Treat Poison, Treat Bleeding'),
  ('lore', 'Lore', 'intellect', 'Historical knowledge, culture, mythology, creature identification.', false, 'Identify creatures (free action)'),
  ('investigation', 'Investigation', 'intellect', 'Active searching, logical deduction, puzzle solving, research.', false, 'Find trap mechanisms, analyze enemy patterns'),
  ('crafting', 'Crafting', 'intellect', 'Creating and repairing items across all disciplines.', false, 'Improvised crafting (3 AP, TN 14), field repair'),
  ('arcane_knowledge', 'Arcane Knowledge', 'intellect', 'Magical theory, identifying spells, understanding enchantments.', true, 'Identify spells being cast (reaction)'),
  ('persuasion', 'Persuasion', 'presence', 'Convincing through honesty, charisma, negotiation, diplomacy.', false, 'Parley, convincing surrender'),
  ('deception', 'Deception', 'presence', 'Lying, disguise performance, misdirection, bluffing.', false, 'Feints (1 AP), Misdirection (1 AP)'),
  ('performance', 'Performance', 'presence', 'Entertaining, inspiring, distracting through art.', false, 'Distraction (2 AP vs Passive Perception)');

-- ============================================================================
-- BACKGROUNDS
-- ============================================================================

insert into backgrounds (name, skill_proficiencies, tool_proficiency, starting_bonus, description) values
  ('Soldier', '{athletics,intimidation}', 'Navigator''s Tools', '+1 to initiative', 'Trained in military service, you know discipline, formations, and how to follow—and give—orders.'),
  ('Scholar', '{lore,arcane_knowledge}', 'Calligrapher''s Supplies', 'Read/write 2 additional languages', 'Years of study have given you broad knowledge and a hunger for more.'),
  ('Criminal', '{stealth,deception}', 'Thieves'' Tools', 'Always find black market contacts within 1 day', 'You lived outside the law, learning to move unseen and talk your way out of trouble.'),
  ('Merchant', '{persuasion,intuition}', 'Cartographer''s Tools', '+10% on buying/selling', 'Trade is in your blood. You know value, negotiation, and how to read a deal.'),
  ('Artisan', '{crafting,perception}', 'Crafting tool of choice', 'Start with 1 Uncommon recipe known', 'You learned a trade and take pride in creating things that last.'),
  ('Healer', '{medicine,survival}', 'Healer''s Kit', 'Mundane healing heals +2 HP', 'You''ve mended wounds, set bones, and brewed remedies since you can remember.'),
  ('Noble', '{persuasion,performance}', 'Calligrapher''s Supplies', 'Start with 3x normal gold', 'Born to privilege, you command respect—and have the coin to back it up.'),
  ('Sailor', '{athletics,survival}', 'Navigator''s Tools', 'Advantage on watercraft/navigation', 'Wind, waves, and the open horizon shaped you into someone tough and resourceful.'),
  ('Entertainer', '{performance,acrobatics}', 'Musical Instrument', 'Free lodging/food by performing', 'You''ve earned your keep with a song, a story, or a death-defying stunt.'),
  ('Hermit', '{survival,composure}', 'Herbalism Kit', 'Discovered a secret truth (GM collaboration)', 'Years of isolation gave you time to think—and something important to show for it.'),
  ('Spy', '{deception,stealth}', 'Disguise Kit', 'Established cover identity', 'You lived a double life, gathering secrets and staying one step ahead.'),
  ('Hunter', '{marksmanship,survival}', 'Herbalism Kit', '+2 to creature harvesting checks', 'You tracked and brought down game to survive—or for the thrill of the hunt.'),
  ('Priest', '{medicine,persuasion}', 'Healer''s Kit', 'Advantage on Persuasion with the faithful', 'Faith guided your hand, whether healing the sick or comforting the lost.'),
  ('Urchin', '{sleight_of_hand,stealth}', 'Thieves'' Tools', 'Free shelter in urban areas, halved city travel time', 'The streets raised you. You learned to be quick, quiet, and resourceful.'),
  ('Explorer', '{perception,survival}', 'Cartographer''s Tools', 'GM reveals one secret per new region', 'The unknown calls to you. Every horizon is a promise.'),
  ('Bureaucrat', '{investigation,persuasion}', 'Calligrapher''s Supplies', 'Advantage navigating legal systems', 'Forms, seals, and procedure—you know how the system works, and how to work it.'),
  ('Blacksmith', '{crafting,endurance}', 'Smith''s Tools', 'Start with self-made weapon/armor', 'Hammer and anvil are your instruments. You forge strength from raw metal.'),
  ('Alchemist', '{crafting,arcane_knowledge}', 'Alchemy Kit', 'Start knowing 3 basic alchemy recipes', 'Bubbling flasks and careful measurements are your art.'),
  ('Guard', '{perception,athletics}', null, 'Authority recognition in home city', 'You kept watch, stood your ground, and protected those behind the walls.'),
  ('Farmer', '{endurance,survival}', 'Cooking Utensils', 'Cooking always succeeds at decent meal minimum', 'Hard soil, long days, and honest work taught you resilience.');
