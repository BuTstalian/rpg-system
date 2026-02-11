-- ============================================================================
-- AETHERMOOR — Seed: Branch Abilities (150 total)
-- Core abilities are in 002_seed_reference_data.sql
-- ============================================================================

-- ============================================================================
-- BRANCH ABILITIES — All 10 paths × 3 branches × 5 abilities = 150
-- ============================================================================

-- Vanguard A: Juggernaut
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('vanguard','A','Juggernaut',1,'Iron Skin','2 Momentum: +3 AV until next turn.',null,2,'{"av":3}'),
('vanguard','A','Juggernaut',2,'Rooted','Stationary: attacks against you have disadvantage.',null,null,'{}'),
('vanguard','A','Juggernaut',3,'Absorb Impact','1 AP, 1 Mom: Redirect adjacent ally damage to self.',1,1,'{}'),
('vanguard','A','Juggernaut',4,'Fortress','Below half HP: +2 AV for encounter.',null,null,'{}'),
('vanguard','A','Juggernaut',5,'Titan''s Endurance','Bleed-out timer doubles.',null,null,'{}');
-- Vanguard B: Berserker
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('vanguard','B','Berserker',1,'Reckless Swing','2 AP, 2 Mom: Advantage attack; enemies have advantage on you.',2,2,'{}'),
('vanguard','B','Berserker',2,'Bloodlust','Kill enemy: +2 Momentum, +1 AP this turn.',null,null,'{}'),
('vanguard','B','Berserker',3,'Frenzy','3 AP, all Mom (min 3): Attacks = Momentum spent.',3,null,'{}'),
('vanguard','B','Berserker',4,'Pain Fuel','Taking damage: +1 Momentum (1/round).',null,null,'{}'),
('vanguard','B','Berserker',5,'Death or Glory','Dying: fight 1 round at 0 HP.',null,null,'{}');
-- Vanguard C: Warlord
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('vanguard','C','Warlord',1,'Rally','1 AP, 2 Mom: Ally in 3 hex heals Might mod HP.',1,2,'{}'),
('vanguard','C','Warlord',2,'Press the Attack','On hit: next ally vs same target +2.',null,null,'{}'),
('vanguard','C','Warlord',3,'Hold the Line','Adjacent allies immune to forced movement.',null,null,'{}'),
('vanguard','C','Warlord',4,'Commanding Strike','2 AP, 3 Mom: Ally in 3 hex reaction Strike.',2,3,'{}'),
('vanguard','C','Warlord',5,'Inspiring Presence','Allies in 2 hex immune to Shaken.',null,null,'{}');

-- Shadow A: Assassin
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('shadow','A','Assassin',1,'Ambush','Round 1 before target: Unseen Strike +2d6.',null,null,'{}'),
('shadow','A','Assassin',2,'Exploit Weakness','1 AP, 2 Focus: Next attack applies Exposed T1.',1,2,'{}'),
('shadow','A','Assassin',3,'Lethal Precision','Unseen Strike maximized vs below half HP.',null,null,'{}'),
('shadow','A','Assassin',4,'Vanishing Strike','3 AP, 3 Focus: Attack then Stealth.',3,3,'{}'),
('shadow','A','Assassin',5,'Execute','Target ≤10% HP: auto crit.',null,null,'{}');
-- Shadow B: Phantom
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('shadow','B','Phantom',1,'Flicker','Damaged: 1 Focus to move 1 hex, no reactions.',null,1,'{}'),
('shadow','B','Phantom',2,'Smoke Screen','2 AP, 2 Focus: 2-hex cloud blocks LOS, 2 rounds.',2,2,'{}'),
('shadow','B','Phantom',3,'Ghost Walk','Move through enemy hexes.',null,null,'{}'),
('shadow','B','Phantom',4,'Mirage','1 AP, 3 Focus: Duplicate in adjacent hex.',1,3,'{}'),
('shadow','B','Phantom',5,'Phase','1/enc: Intangible 1 round.',null,null,'{}');
-- Shadow C: Saboteur
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('shadow','C','Saboteur',1,'Quick Trap','1 AP, 1 Focus: Place trap on adjacent hex.',1,1,'{}'),
('shadow','C','Saboteur',2,'Crippling Strike','Attacks apply Slowed T1 instead of bonus damage.',null,null,'{}'),
('shadow','C','Saboteur',3,'Dismantle','2 AP, 2 Focus: Target -2 AV for encounter.',2,2,'{}'),
('shadow','C','Saboteur',4,'Web of Traps','3 traps active. +3 TN to detect.',null,null,'{}'),
('shadow','C','Saboteur',5,'Sabotage','2 AP adjacent: destroy/turn deployable.',2,null,'{}');

-- Arcanist A: Elementalist
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('arcanist','A','Elementalist',1,'Firebolt','2 AP, 1 Ess: 3d8 fire, 5 hex. Burning T1.',2,1,'{"damage":"3d8"}'),
('arcanist','A','Elementalist',2,'Frost Wave','3 AP, 2 Ess: 2d8 cold, 3-hex cone. Chilled T1.',3,2,'{"damage":"2d8"}'),
('arcanist','A','Elementalist',3,'Lightning Arc','2 AP, 2 Ess: 2d10 lightning, chains +1.',2,2,'{"damage":"2d10"}'),
('arcanist','A','Elementalist',4,'Elemental Mastery','Choose element: +1d8, conditions start T2.',null,null,'{}'),
('arcanist','A','Elementalist',5,'Cataclysm','3 AP, 5 Ess: 5d10, 4-hex radius, condition T2.',3,5,'{"damage":"5d10"}');
-- Arcanist B: Warden of Secrets
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('arcanist','B','Warden of Secrets',1,'Detect Thoughts','2 AP, 1 Ess: Surface intent, 3 hex.',2,1,'{}'),
('arcanist','B','Warden of Secrets',2,'Dispel','2 AP, 2 Ess: Remove one magical effect.',2,2,'{}'),
('arcanist','B','Warden of Secrets',3,'Arcane Eye','1 AP, 1 Ess: Invisible sensor, 10 hex, 5 rounds.',1,1,'{}'),
('arcanist','B','Warden of Secrets',4,'Counter','Reaction, 3 Ess: Intellect contest to negate.',null,3,'{}'),
('arcanist','B','Warden of Secrets',5,'Time Slip','3 AP, 4 Ess: Ally takes full turn. 1/enc.',3,4,'{}');
-- Arcanist C: Shaper
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('arcanist','C','Shaper',1,'Arcane Wall','2 AP, 2 Ess: 3-hex force line, 3 rounds.',2,2,'{}'),
('arcanist','C','Shaper',2,'Gravity Well','2 AP, 2 Ess: Pull in 2 hex, Slowed T1.',2,2,'{}'),
('arcanist','C','Shaper',3,'Blink Field','2 AP, 3 Ess: 3-hex zone, ally free teleport.',2,3,'{}'),
('arcanist','C','Shaper',4,'Reshape Terrain','1 Ess: 1 hex difficult/normal toggle.',null,1,'{}'),
('arcanist','C','Shaper',5,'Dimensional Lock','3 AP, 4 Ess: No teleport/phase in 3 hex, 3 rounds.',3,4,'{}');

-- Warden A: Beastcaller
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('warden','A','Beastcaller',1,'Bond Companion','Permanent companion, acts on your turn.',null,null,'{}'),
('warden','A','Beastcaller',2,'Pack Tactics','Both adjacent to enemy: advantage.',null,null,'{}'),
('warden','A','Beastcaller',3,'Wild Summon','2 AP, 3 Att: Temp beast, 3 rounds.',2,3,'{}'),
('warden','A','Beastcaller',4,'Shared Senses','Quick Action: see/hear through companion.',1,null,'{}'),
('warden','A','Beastcaller',5,'Alpha Command','1 AP, 4 Att: Companion full 3 AP turn.',1,4,'{}');
-- Warden B: Earthshaper
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('warden','B','Earthshaper',1,'Stone Skin','1 AP, 2 Att: +3 AV, 2 rounds.',1,2,'{}'),
('warden','B','Earthshaper',2,'Entangle','2 AP, 2 Att: 2-hex Slowed T2.',2,2,'{}'),
('warden','B','Earthshaper',3,'Tremor','2 AP, 3 Att: 3 hex, Finesse or prone.',2,3,'{}'),
('warden','B','Earthshaper',4,'Earth Wall','2 AP, 2 Att: 2-hex barrier, full cover.',2,2,'{}'),
('warden','B','Earthshaper',5,'Quake','3 AP, 6 Att: 4d8, 4-hex, Stunned T1.',3,6,'{}');
-- Warden C: Stormcaller
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('warden','C','Stormcaller',1,'Lightning Strike','2 AP, 2 Att: 3d6 lightning, 5 hex.',2,2,'{}'),
('warden','C','Stormcaller',2,'Gale Force','2 AP, 2 Att: Push 2 hex, Exposed T1.',2,2,'{}'),
('warden','C','Stormcaller',3,'Storm Aura','1 AP, 3 Att: 1d6 lightning aura, 3 rounds.',1,3,'{}'),
('warden','C','Stormcaller',4,'Call Lightning','3 AP, 4 Att: Sustained 4d6 bolt/round.',3,4,'{}'),
('warden','C','Stormcaller',5,'Tempest','3 AP, 7 Att: 8-hex storm, 2d6/round, 3 rounds.',3,7,'{}');

-- Devotant A: Healer
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('devotant','A','Healer',1,'Mending Touch','1 AP, 1 Conv: Heal 2d8 + Resolve mod.',1,1,'{}'),
('devotant','A','Healer',2,'Purify','1 AP, 1 Conv: Remove 1 condition tier.',1,1,'{}'),
('devotant','A','Healer',3,'Healing Aura','2 AP, 3 Conv: 1d6/turn in 2 hex, 3 rounds.',2,3,'{}'),
('devotant','A','Healer',4,'Revitalize','2 AP, 4 Conv: Stabilize at 25% HP.',2,4,'{}'),
('devotant','A','Healer',5,'Miracle','3 AP, 6 Conv: Full HP + clear all. 1/camp.',3,6,'{}');
-- Devotant B: Sentinel
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('devotant','B','Sentinel',1,'Shield of Faith','1 AP, 1 Conv: +2 AV, 3 rounds, 3 hex.',1,1,'{}'),
('devotant','B','Sentinel',2,'Intercede','Reaction, 1 Conv: Redirect attack to self.',null,1,'{}'),
('devotant','B','Sentinel',3,'Hallowed Ground','2 AP, 3 Conv: 3-hex, enemies -1d6, allies no Shaken.',2,3,'{}'),
('devotant','B','Sentinel',4,'Binding Vow','2 AP, 2 Conv: Enemy only attacks you, 3 rounds.',2,2,'{}'),
('devotant','B','Sentinel',5,'Martyr''s Stand','Die protecting ally: allies +3 AP, bleedout doubles.',null,null,'{}');
-- Devotant C: Zealot
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('devotant','C','Zealot',1,'Smite','1 Conv on attack: +2d6 spiritual (bypasses AV).',null,1,'{}'),
('devotant','C','Zealot',2,'Righteous Fury','Ally drops: +3 Conv, advantage 1 round.',null,null,'{}'),
('devotant','C','Zealot',3,'Judgment','2 AP, 2 Conv: Exposed T1 + Shaken T1.',2,2,'{}'),
('devotant','C','Zealot',4,'Aura of Retribution','2 AP, 3 Conv: Enemies hitting allies take 1d8.',2,3,'{}'),
('devotant','C','Zealot',5,'Divine Wrath','3 AP, 5 Conv: 4d10 spiritual. +2d10 vs ally-harmers.',3,5,'{}');

-- Tactician A: Field Marshal
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('tactician','A','Field Marshal',1,'Direct','1 AP, 1 Focus: Ally in 5 hex moves 2.',1,1,'{}'),
('tactician','A','Field Marshal',2,'Exploit Opening','1 AP, 2 Focus: Enemy miss → ally reaction Strike.',1,2,'{}'),
('tactician','A','Field Marshal',3,'Tactical Withdrawal','Allies in 3 hex: 1 hex no reactions.',null,null,'{}'),
('tactician','A','Field Marshal',4,'Overwhelming Assault','2 AP, 3 Focus: Next 2 allies have advantage.',2,3,'{}'),
('tactician','A','Field Marshal',5,'Grand Strategy','3 AP, 5 Focus: All allies turn simultaneously. 1/enc.',3,5,'{}');
-- Tactician B: Analyst
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('tactician','B','Analyst',1,'Find Weakness','1 AP, 1 Focus: Exposed T1, 3 rounds.',1,1,'{}'),
('tactician','B','Analyst',2,'Predict','Reaction, 1 Focus: Guess target, +3 AV if right.',null,1,'{}'),
('tactician','B','Analyst',3,'Profile','After 2 rounds: learn all enemy abilities/resists.',null,null,'{}'),
('tactician','B','Analyst',4,'Exploit Pattern','2 AP, 3 Focus: Profiled enemy disadvantage, 2 rounds.',2,3,'{}'),
('tactician','B','Analyst',5,'Trap Architect','3 kill zone hexes: +2d6 from ally attacks.',null,null,'{}');
-- Tactician C: Vanguard Commander
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('tactician','C','Vanguard Commander',1,'Lead from Front','Your Strike: adjacent ally free Quick Action.',null,null,'{}'),
('tactician','C','Vanguard Commander',2,'Battle Tempo','Choose: Aggressive (+1 AP, -1 AV) or Defensive (+2 AV, -1 AP).',null,null,'{}'),
('tactician','C','Vanguard Commander',3,'War Horn','2 AP, 2 Focus: All allies +1 AP next turn.',2,2,'{}'),
('tactician','C','Vanguard Commander',4,'Unbreakable Formation','Adjacent allies: +1 AV each (max +3).',null,null,'{}'),
('tactician','C','Vanguard Commander',5,'Coup de Grâce','3 AP, 4 Focus: Enemy <25%, all allies Strike.',3,4,'{}');

-- Artificer A: Alchemist
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('artificer','A','Alchemist',1,'Quick Brew','2 AP, 1 Prep: Create consumable mid-combat.',2,1,'{}'),
('artificer','A','Alchemist',2,'Potent Mixtures','Consumables +1d6 damage or healing.',null,null,'{}'),
('artificer','A','Alchemist',3,'Volatile Reaction','Thrown consumables splash half effect.',null,null,'{}'),
('artificer','A','Alchemist',4,'Dual Throw','3 AP: Two consumables at once.',3,null,'{}'),
('artificer','A','Alchemist',5,'Philosopher''s Touch','Heals cleanse 1 condition. Damage = T2.',null,null,'{}');
-- Artificer B: Engineer
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('artificer','B','Engineer',1,'Improved Turret','+2 hit, +1d6 damage, +50% HP.',null,null,'{}'),
('artificer','B','Engineer',2,'Trap Network','Linked traps all trigger together.',null,null,'{}'),
('artificer','B','Engineer',3,'Overclock','1 AP, 1 Prep: Deployable acts twice.',1,1,'{}'),
('artificer','B','Engineer',4,'Remote Control','Control deployables from anywhere.',null,null,'{}'),
('artificer','B','Engineer',5,'Magnum Opus','3 AP, 4 Prep: Siege engine, 4d10, 10 hex.',3,4,'{}');
-- Artificer C: Enchanter
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('artificer','C','Enchanter',1,'Imbue Weapon','1 AP, 1 Prep: +1d6 elemental, 3 rounds.',1,1,'{}'),
('artificer','C','Enchanter',2,'Warding Rune','2 AP, 2 Prep: Hex rune, 3d6 + Stunned T1.',2,2,'{}'),
('artificer','C','Enchanter',3,'Enchanted Armor','1 AP, 1 Prep: Grant armor property.',1,1,'{}'),
('artificer','C','Enchanter',4,'Nullify','Reaction, 2 Prep: Counter magical effect.',null,2,'{}'),
('artificer','C','Enchanter',5,'Arcane Forge','Full Recovery: permanent enchantment.',null,null,'{}');

-- Wanderer A: Survivalist
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('wanderer','A','Survivalist',1,'Forage','Party rests +25% HP. Always find supplies.',null,null,'{}'),
('wanderer','A','Survivalist',2,'Danger Sense','Can''t be surprised. +3 initiative.',null,null,'{}'),
('wanderer','A','Survivalist',3,'Natural Remedy','1 AP, 2 Mom: Remove 1 condition tier.',1,2,'{}'),
('wanderer','A','Survivalist',4,'Hunker Down','2 AP: +4 AV, advantage saves. Can''t move.',2,null,'{}'),
('wanderer','A','Survivalist',5,'Last Stand','≤25% HP: +1 AP, +1d6 damage.',null,null,'{}');
-- Wanderer B: Drifter
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('wanderer','B','Drifter',1,'Swift Feet','Free step = 2 hexes.',null,null,'{}'),
('wanderer','B','Drifter',2,'Opportunist','Enemy ability nearby: reaction Strike.',null,null,'{}'),
('wanderer','B','Drifter',3,'Slippery','OA disadvantage. Free disengage 1/round.',null,null,'{}'),
('wanderer','B','Drifter',4,'Exploit Terrain','1 AP, 1 Mom: Advantage via environment.',1,1,'{}'),
('wanderer','B','Drifter',5,'Momentum Burst','All Mom (min 4): Extra turn. 1/enc.',null,null,'{}');
-- Wanderer C: Lorekeeper
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('wanderer','C','Lorekeeper',1,'Quick Study','Observe 1 round: learn resists/vulns.',null,null,'{}'),
('wanderer','C','Lorekeeper',2,'Bardic Knowledge','1/scene: yes/no question to GM.',null,null,'{}'),
('wanderer','C','Lorekeeper',3,'Inspire','1 AP, 2 Mom: Ally +1d6 next check.',1,2,'{}'),
('wanderer','C','Lorekeeper',4,'Linguist','Basic communication with any intelligent creature.',null,null,'{}'),
('wanderer','C','Lorekeeper',5,'Chronicler','Party +10% milestone progress.',null,null,'{}');

-- Channeler A: Stormborn
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('channeler','A','Stormborn',1,'Raw Bolt','2 AP, 1 Flux: 2d10, random element, 5 hex.',2,1,'{}'),
('channeler','A','Stormborn',2,'Surge','2 AP, 3 Flux: 4d10, 2-hex radius, condition T1.',2,3,'{}'),
('channeler','A','Stormborn',3,'Volatile Aura','Overchanneling: 1d6 to enemies in 1 hex.',null,null,'{}'),
('channeler','A','Stormborn',4,'Chain Reaction','Max die: explodes (reroll and add).',null,null,'{}'),
('channeler','A','Stormborn',5,'Cataclysmic Surge','3 AP, 6 Flux: 8d10, 3-hex, T2. Self 2d6.',3,6,'{}');
-- Channeler B: Empath
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('channeler','B','Empath',1,'Mind Spike','2 AP, 1 Flux: 2d8 psychic (bypass AV), 4 hex.',2,1,'{}'),
('channeler','B','Empath',2,'Emotional Cascade','2 AP, 2 Flux: Shaken T1 splash.',2,2,'{}'),
('channeler','B','Empath',3,'Empathic Link','1 AP, 1 Flux: +2 Res/Ins ally, take 25% damage.',1,1,'{}'),
('channeler','B','Empath',4,'Psychic Scream','3 AP, 4 Flux: 3 hex Stunned T2.',3,4,'{}'),
('channeler','B','Empath',5,'Dominate','3 AP, 5 Flux: Control target next turn.',3,5,'{}');
-- Channeler C: Conduit
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('channeler','C','Conduit',1,'Energy Transfer','1 AP, 2 Flux: Give ally 2 resource.',1,2,'{}'),
('channeler','C','Conduit',2,'Flux Shield','Reaction, 2 Flux: Absorb 3× Flux damage.',null,2,'{}'),
('channeler','C','Conduit',3,'Amplify','1 AP, 1 Flux: Ally next ability +50%.',1,1,'{}'),
('channeler','C','Conduit',4,'Siphon','Enemy magic nearby: +1 Flux.',null,null,'{}'),
('channeler','C','Conduit',5,'Convergence','3 AP, 6 Flux: Allies in 4 hex: +1 resource, 2d8 HP.',3,6,'{}');

-- Diplomat A: Provocateur
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('diplomat','A','Provocateur',1,'Taunt','1 AP, 1 Conv: Target must attack you.',1,1,'{}'),
('diplomat','A','Provocateur',2,'Undermine','1 AP, 1 Conv: Target -2 all checks.',1,1,'{}'),
('diplomat','A','Provocateur',3,'Sow Discord','2 AP, 3 Conv: 2 enemies attack each other.',2,3,'{}'),
('diplomat','A','Provocateur',4,'Psychic Pressure','Conditioned enemies: 1d4/tier.',null,null,'{}'),
('diplomat','A','Provocateur',5,'Unravel','3 AP, 4 Conv: ALL T1 conditions on target.',3,4,'{}');
-- Diplomat B: Negotiator
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('diplomat','B','Negotiator',1,'Bribe','Know NPC values. +5 deal checks.',null,null,'{}'),
('diplomat','B','Negotiator',2,'Network','1 hour in settlement: find useful contact.',null,null,'{}'),
('diplomat','B','Negotiator',3,'Blackmail','2 AP, 3 Conv: Compel with damaging info.',2,3,'{}'),
('diplomat','B','Negotiator',4,'Treaty','Negotiate binding agreements.',null,null,'{}'),
('diplomat','B','Negotiator',5,'Information Broker','1/rest: specific question, accurate answer.',null,null,'{}');
-- Diplomat C: Inspirer
insert into path_branch_abilities (path_id,branch,branch_name,position,name,description,ap_cost,resource_cost,mechanics) values
('diplomat','C','Inspirer',1,'Rallying Speech','2 AP, 2 Conv: Allies in 5 hex +1 AP.',2,2,'{}'),
('diplomat','C','Inspirer',2,'Bolster','1 AP, 1 Conv: Ally rerolls failed check.',1,1,'{}'),
('diplomat','C','Inspirer',3,'You Can Do This','Reaction, 1 Conv: Reduce ally condition tier.',null,1,'{}'),
('diplomat','C','Inspirer',4,'Legend in the Making','Ally crits: +1 Conv, temp HP.',null,null,'{}'),
('diplomat','C','Inspirer',5,'Undeniable Presence','3 AP, 5 Conv: +1d6, +2 AV, immune Shaken/Stunned T1.',3,5,'{}');
