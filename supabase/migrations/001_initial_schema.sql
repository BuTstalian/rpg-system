-- ============================================================================
-- AETHERMOOR TTRPG — Complete Database Schema
-- Supabase (PostgreSQL) Migration
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

create type attribute_name as enum (
  'might', 'finesse', 'resolve', 'insight', 'intellect', 'presence'
);

create type path_name as enum (
  'vanguard', 'shadow', 'arcanist', 'warden', 'devotant',
  'tactician', 'artificer', 'wanderer', 'channeler', 'diplomat'
);

create type resource_type as enum (
  'momentum', 'focus', 'essence', 'conviction', 'preparation', 'attunement', 'flux'
);

create type skill_name as enum (
  'athletics', 'endurance', 'intimidation',
  'acrobatics', 'stealth', 'sleight_of_hand', 'marksmanship',
  'composure', 'concentration', 'survival',
  'perception', 'intuition', 'medicine',
  'lore', 'investigation', 'crafting', 'arcane_knowledge',
  'persuasion', 'deception', 'performance'
);

create type damage_type as enum (
  'slashing', 'piercing', 'bludgeoning',
  'fire', 'cold', 'lightning', 'acid', 'poison',
  'arcane', 'spiritual', 'necrotic', 'psychic', 'force',
  'true'
);

create type condition_name as enum (
  'burning', 'chilled', 'poisoned', 'stunned',
  'bleeding', 'shaken', 'exposed', 'slowed'
);

create type rarity as enum (
  'common', 'uncommon', 'rare', 'legendary', 'mythic'
);

create type armor_category as enum ('light', 'medium', 'heavy');

create type spell_school as enum (
  'evocation', 'abjuration', 'transmutation', 'divination',
  'conjuration', 'enchantment', 'necromancy', 'restoration'
);

create type spell_level as enum (
  'cantrip', 'lesser', 'standard', 'greater', 'supreme', 'mythic'
);

create type material_category as enum (
  'metals_ores', 'hides_fibers', 'bones_shells',
  'organs_fluids', 'flora', 'minerals_gems', 'arcane_substances'
);

create type crafting_discipline as enum (
  'alchemy', 'smithing', 'engineering', 'enchanting'
);

create type creature_tag as enum (
  'beast', 'humanoid', 'undead', 'construct', 'elemental',
  'fiend', 'celestial', 'aberration', 'fey', 'dragon',
  'plant', 'ooze', 'swarm'
);

create type terrain_type as enum (
  'open', 'difficult', 'hazardous', 'elevated', 'cover_half',
  'cover_full', 'water_shallow', 'water_deep', 'ice',
  'darkness', 'destructible', 'interactable'
);

create type campaign_role as enum ('gm', 'player', 'spectator');

create type encounter_type as enum ('combat', 'social', 'exploration', 'puzzle');

create type encounter_status as enum ('planning', 'active', 'paused', 'completed');

-- ============================================================================
-- 1. USER PROFILES
-- ============================================================================

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================================================
-- 2. CAMPAIGNS
-- ============================================================================

create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  gm_id uuid not null references profiles(id) on delete cascade,
  current_tier int default 1 check (current_tier between 1 and 20),
  session_count int default 0,
  settings jsonb default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table campaign_members (
  campaign_id uuid not null references campaigns(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role campaign_role not null default 'player',
  joined_at timestamptz default now() not null,
  primary key (campaign_id, user_id)
);

-- ============================================================================
-- 3. REFERENCE DATA — PATHS
-- ============================================================================

create table paths (
  id path_name primary key,
  display_name text not null,
  resource resource_type not null,
  hp_base int not null,
  description text,
  auto_skills skill_name[] not null default '{}',
  free_expertise_skill skill_name,
  free_expertise_tier int default 3,
  complexity int check (complexity between 1 and 5),
  combat_role text
);

create table path_core_abilities (
  id uuid primary key default uuid_generate_v4(),
  path_id path_name not null references paths(id),
  tier int not null check (tier in (1, 5, 10, 15, 20)),
  name text not null,
  description text not null,
  mechanics jsonb not null default '{}',
  unique (path_id, tier)
);

create table path_branch_abilities (
  id uuid primary key default uuid_generate_v4(),
  path_id path_name not null references paths(id),
  branch char(1) not null check (branch in ('A', 'B', 'C')),
  branch_name text not null,
  position int not null check (position between 1 and 5),
  name text not null,
  description text not null,
  ap_cost int,
  resource_cost int,
  mechanics jsonb not null default '{}',
  unique (path_id, branch, position)
);

-- ============================================================================
-- 4. REFERENCE DATA — SKILLS
-- ============================================================================

create table skills (
  id skill_name primary key,
  display_name text not null,
  attribute attribute_name not null,
  description text,
  has_passive boolean default false,
  combat_uses text
);

-- ============================================================================
-- 5. REFERENCE DATA — BACKGROUNDS
-- ============================================================================

create table backgrounds (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  skill_proficiencies skill_name[] not null,
  tool_proficiency text,
  starting_bonus text,
  description text
);

-- ============================================================================
-- 6. REFERENCE DATA — SPELLS
-- ============================================================================

create table spells (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  school spell_school not null,
  level spell_level not null,
  essence_cost int not null default 0,
  ap_cost int not null default 2,
  range_hexes int,
  area_hexes int,
  duration text,
  concentration boolean default false,
  ritual boolean default false,
  damage_dice text,
  damage_type damage_type,
  condition_applied condition_name,
  condition_tier int,
  description text not null,
  min_tier int default 1,
  unique (name, school)
);

-- ============================================================================
-- 7. REFERENCE DATA — EQUIPMENT TEMPLATES
-- ============================================================================

create table weapon_templates (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  category text not null, -- melee, ranged, implement
  damage_dice text not null,
  damage_type damage_type not null,
  range_hexes int,
  properties text[] default '{}',
  rarity rarity default 'common',
  cost_gp int default 0,
  description text
);

create table armor_templates (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  armor_value int not null,
  category armor_category not null,
  stealth_disadvantage boolean default false,
  free_step_penalty boolean default false,
  movement_penalty boolean default false,
  enchantment_slots int default 1,
  rarity rarity default 'common',
  cost_gp int default 0,
  description text
);

create table accessory_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slot text not null, -- head, cloak, neck, ring, belt, boots, bracers
  rarity rarity default 'common',
  requires_attunement boolean default false,
  attunement_slots int default 0,
  effects jsonb default '{}',
  cost_gp int default 0,
  description text
);

-- ============================================================================
-- 8. REFERENCE DATA — MATERIALS
-- ============================================================================

create table materials (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  category material_category not null,
  rarity rarity not null,
  description text,
  processing_action text,
  processed_form text,
  processing_tn int,
  key_uses text[],
  source_biomes text[],
  source_creatures text[]
);

-- ============================================================================
-- 9. REFERENCE DATA — RECIPES
-- ============================================================================

create table recipes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  discipline crafting_discipline not null,
  tier text not null check (tier in ('basic', 'journeyman', 'advanced', 'master')),
  tn int not null,
  work_units int not null default 1,
  materials_required jsonb not null, -- [{material_id, quantity}]
  output_description text not null,
  output_effects jsonb default '{}',
  unique (name, discipline)
);

-- ============================================================================
-- 10. REFERENCE DATA — CREATURES (BESTIARY)
-- ============================================================================

create table creatures (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  threat_rating int not null,
  tags creature_tag[] not null default '{}',
  hp int not null,
  armor_value int default 0,
  attack_bonus int default 0,
  damage_dice text,
  damage_type damage_type default 'bludgeoning',
  ap int default 3,
  attributes jsonb default '{}', -- {might: 14, finesse: 12, ...}
  abilities jsonb default '[]', -- [{name, description, ap_cost, recharge?}]
  resistances damage_type[] default '{}',
  immunities damage_type[] default '{}',
  vulnerabilities damage_type[] default '{}',
  condition_immunities condition_name[] default '{}',
  speed_hexes int default 1,
  -- Boss fields
  legendary_actions int default 0,
  legendary_resistances int default 0,
  lair_actions jsonb default '[]',
  phase_thresholds jsonb default '[]', -- [{hp_pct: 75, changes: {...}}]
  -- Drops
  primary_drop uuid references materials(id),
  secondary_drop uuid references materials(id),
  rare_drop uuid references materials(id),
  harvest_tn int,
  description text,
  is_template boolean default false,
  campaign_id uuid references campaigns(id) on delete cascade -- null = global
);

-- ============================================================================
-- 11. CHARACTERS
-- ============================================================================

create table characters (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  name text not null,
  path path_name not null,
  background_id uuid references backgrounds(id),
  tier int default 1 check (tier between 1 and 20),

  -- Attributes (scores, not modifiers)
  might int not null default 10 check (might between 1 and 20),
  finesse int not null default 10 check (finesse between 1 and 20),
  resolve int not null default 10 check (resolve between 1 and 20),
  insight int not null default 10 check (insight between 1 and 20),
  intellect int not null default 10 check (intellect between 1 and 20),
  presence int not null default 10 check (presence between 1 and 20),

  -- Derived (denormalized for perf, recalculated on change)
  hp_max int not null default 0,
  hp_current int not null default 0,
  armor_value int default 0,
  ap_max int default 3,

  -- Resource
  resource_current int default 0,
  resource_max int default 0,

  -- Progression
  branch_points_spent int default 2,
  branch_points_total int default 2,
  stat_increases_used int default 0,
  expertise_choices text[] default '{}',

  -- Details
  appearance text,
  personality_traits text[] default '{}',
  flaw text,
  bond text,
  drive text,
  tenets text[] default '{}', -- Devotant specific
  npc_connections jsonb default '[]',

  -- Gold
  gold int default 50,

  -- Status
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_characters_user on characters(user_id);
create index idx_characters_campaign on characters(campaign_id);

-- ============================================================================
-- 12. CHARACTER SUB-TABLES
-- ============================================================================

create table character_skills (
  character_id uuid not null references characters(id) on delete cascade,
  skill skill_name not null,
  proficient boolean default false,
  expertise boolean default false,
  source text, -- 'path', 'background', 'free', 'milestone'
  primary key (character_id, skill)
);

create table character_abilities (
  id uuid primary key default uuid_generate_v4(),
  character_id uuid not null references characters(id) on delete cascade,
  ability_id uuid not null, -- references path_core_abilities or path_branch_abilities
  ability_type text not null check (ability_type in ('core', 'branch')),
  acquired_at_tier int not null default 1
);

create index idx_char_abilities on character_abilities(character_id);

create table character_spells (
  id uuid primary key default uuid_generate_v4(),
  character_id uuid not null references characters(id) on delete cascade,
  spell_id uuid not null references spells(id),
  is_known boolean default true,
  is_prepared boolean default false
);

create index idx_char_spells on character_spells(character_id);

create table character_equipment (
  id uuid primary key default uuid_generate_v4(),
  character_id uuid not null references characters(id) on delete cascade,
  item_type text not null check (item_type in ('weapon', 'armor', 'shield', 'accessory', 'tool', 'consumable', 'misc')),
  template_id uuid, -- references weapon/armor/accessory templates
  custom_name text,
  custom_effects jsonb default '{}',
  rarity rarity default 'common',
  enchantments jsonb default '[]',
  enchantment_slots_total int default 1,
  enchantment_slots_used int default 0,
  is_equipped boolean default false,
  equip_slot text, -- 'main_hand', 'off_hand', 'armor', 'head', 'cloak', etc.
  is_attuned boolean default false,
  quantity int default 1,
  notes text
);

create index idx_char_equipment on character_equipment(character_id);

create table character_materials (
  character_id uuid not null references characters(id) on delete cascade,
  material_id uuid not null references materials(id),
  quantity int not null default 1 check (quantity >= 0),
  is_processed boolean default false,
  primary key (character_id, material_id, is_processed)
);

create table character_conditions (
  id uuid primary key default uuid_generate_v4(),
  character_id uuid not null references characters(id) on delete cascade,
  condition condition_name not null,
  tier int not null default 1 check (tier between 1 and 3),
  source text,
  applied_at timestamptz default now()
);

-- ============================================================================
-- 13. GAME SESSIONS
-- ============================================================================

create table sessions (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  session_number int not null,
  title text,
  status text default 'planned' check (status in ('planned', 'active', 'completed')),
  notes text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz default now() not null
);

-- ============================================================================
-- 14. ENCOUNTERS
-- ============================================================================

create table encounters (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  name text not null,
  type encounter_type not null,
  status encounter_status default 'planning',
  difficulty text, -- trivial, easy, moderate, hard, deadly, legendary
  threat_budget int,
  notes text,
  -- Combat state
  current_round int default 0,
  active_turn_index int default 0,
  -- Map reference
  map_id uuid,
  created_at timestamptz default now() not null
);

create table encounter_creatures (
  id uuid primary key default uuid_generate_v4(),
  encounter_id uuid not null references encounters(id) on delete cascade,
  creature_id uuid not null references creatures(id),
  instance_name text, -- "Goblin A", "Goblin B"
  hp_current int not null,
  hp_max int not null,
  position_q int, -- hex coordinate (axial)
  position_r int, -- hex coordinate (axial)
  conditions jsonb default '[]', -- [{condition, tier}]
  is_alive boolean default true,
  initiative_roll int,
  legendary_actions_remaining int default 0,
  legendary_resistances_remaining int default 0,
  notes text
);

-- ============================================================================
-- 15. INITIATIVE TRACKER
-- ============================================================================

create table initiative_entries (
  id uuid primary key default uuid_generate_v4(),
  encounter_id uuid not null references encounters(id) on delete cascade,
  -- Either a character or a creature instance
  character_id uuid references characters(id) on delete cascade,
  creature_instance_id uuid references encounter_creatures(id) on delete cascade,
  display_name text not null,
  initiative_roll int not null,
  initiative_modifier int default 0,
  turn_order int not null, -- computed position
  has_acted boolean default false,
  is_delayed boolean default false,
  is_surprised boolean default false,
  check (
    (character_id is not null and creature_instance_id is null) or
    (character_id is null and creature_instance_id is not null)
  )
);

create index idx_init_encounter on initiative_entries(encounter_id, turn_order);

-- ============================================================================
-- 16. HEX MAPS
-- ============================================================================

create table hex_maps (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns(id) on delete cascade,
  name text not null,
  width int not null default 20,
  height int not null default 15,
  default_terrain terrain_type default 'open',
  fog_of_war boolean default true,
  created_at timestamptz default now() not null
);

create table hex_tiles (
  id uuid primary key default uuid_generate_v4(),
  map_id uuid not null references hex_maps(id) on delete cascade,
  q int not null, -- axial coordinate
  r int not null, -- axial coordinate
  terrain terrain_type default 'open',
  elevation int default 0,
  is_revealed boolean default false, -- fog of war
  hazard_damage text, -- e.g. '2d6 fire'
  hazard_condition condition_name,
  notes text,
  unique (map_id, q, r)
);

create index idx_hex_tiles_map on hex_tiles(map_id);

-- ============================================================================
-- 17. COMBAT TOKENS (positions on map)
-- ============================================================================

create table map_tokens (
  id uuid primary key default uuid_generate_v4(),
  map_id uuid not null references hex_maps(id) on delete cascade,
  encounter_id uuid references encounters(id) on delete cascade,
  -- Token can be a character, creature, or object
  character_id uuid references characters(id) on delete cascade,
  creature_instance_id uuid references encounter_creatures(id) on delete cascade,
  label text, -- for deployables, objects, etc.
  q int not null,
  r int not null,
  size int default 1, -- hexes occupied
  is_visible boolean default true,
  token_color text,
  token_icon text
);

-- ============================================================================
-- 18. DICE ROLL LOG
-- ============================================================================

create table dice_rolls (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  session_id uuid references sessions(id),
  encounter_id uuid references encounters(id),
  user_id uuid not null references profiles(id),
  character_id uuid references characters(id),
  roll_type text not null, -- 'attack', 'skill', 'save', 'damage', 'initiative', 'custom'
  dice_expression text not null, -- '1d20+5', '2d8+3'
  individual_rolls int[] not null, -- [14], [3, 7]
  modifier int default 0,
  total int not null,
  target_number int,
  degree_of_success text, -- 'critical_failure', 'failure', 'partial', 'full', 'critical'
  description text,
  is_private boolean default false, -- GM-only rolls
  rolled_at timestamptz default now() not null
);

create index idx_rolls_session on dice_rolls(session_id, rolled_at);

-- ============================================================================
-- 19. CHAT / GAME LOG
-- ============================================================================

create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  session_id uuid references sessions(id),
  user_id uuid not null references profiles(id),
  character_id uuid references characters(id),
  channel text default 'general', -- 'general', 'gm', 'whisper', 'system'
  content text not null,
  is_in_character boolean default false,
  whisper_to uuid references profiles(id), -- for private messages
  sent_at timestamptz default now() not null
);

create index idx_chat_session on chat_messages(session_id, sent_at);

-- ============================================================================
-- 20. CRAFTING PROJECTS
-- ============================================================================

create table crafting_projects (
  id uuid primary key default uuid_generate_v4(),
  character_id uuid not null references characters(id) on delete cascade,
  recipe_id uuid references recipes(id),
  custom_name text,
  discipline crafting_discipline not null,
  work_units_required int not null,
  work_units_completed int default 0,
  materials_consumed jsonb default '[]',
  status text default 'in_progress' check (status in ('in_progress', 'completed', 'failed', 'abandoned')),
  result_quality text, -- 'critical_failure', 'failure', 'partial', 'full', 'critical'
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

-- ============================================================================
-- 21. ROW LEVEL SECURITY
-- ============================================================================

alter table profiles enable row level security;
alter table campaigns enable row level security;
alter table campaign_members enable row level security;
alter table characters enable row level security;
alter table character_skills enable row level security;
alter table character_abilities enable row level security;
alter table character_spells enable row level security;
alter table character_equipment enable row level security;
alter table character_materials enable row level security;
alter table character_conditions enable row level security;
alter table sessions enable row level security;
alter table encounters enable row level security;
alter table encounter_creatures enable row level security;
alter table initiative_entries enable row level security;
alter table hex_maps enable row level security;
alter table hex_tiles enable row level security;
alter table map_tokens enable row level security;
alter table dice_rolls enable row level security;
alter table chat_messages enable row level security;
alter table crafting_projects enable row level security;

-- Profiles: users can read all, update own
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Campaigns: members can read, GM can update
create policy "Campaign members can view" on campaigns for select
  using (id in (select campaign_id from campaign_members where user_id = auth.uid()));
create policy "GM can update campaign" on campaigns for update
  using (gm_id = auth.uid());
create policy "Anyone can create campaign" on campaigns for insert
  with check (gm_id = auth.uid());

-- Characters: owner can CRUD, campaign members can read
create policy "Owner manages character" on characters for all
  using (user_id = auth.uid());
create policy "Campaign members can view characters" on characters for select
  using (campaign_id in (select campaign_id from campaign_members where user_id = auth.uid()));

-- Character sub-tables: follow character ownership
create policy "Owner manages skills" on character_skills for all
  using (character_id in (select id from characters where user_id = auth.uid()));
create policy "Owner manages abilities" on character_abilities for all
  using (character_id in (select id from characters where user_id = auth.uid()));
create policy "Owner manages spells" on character_spells for all
  using (character_id in (select id from characters where user_id = auth.uid()));
create policy "Owner manages equipment" on character_equipment for all
  using (character_id in (select id from characters where user_id = auth.uid()));
create policy "Owner manages materials" on character_materials for all
  using (character_id in (select id from characters where user_id = auth.uid()));
create policy "Owner manages conditions" on character_conditions for all
  using (character_id in (select id from characters where user_id = auth.uid()));

-- Sessions: campaign members can view, GM manages
create policy "Campaign members view sessions" on sessions for select
  using (campaign_id in (select campaign_id from campaign_members where user_id = auth.uid()));

-- Encounters: campaign members
create policy "Campaign members view encounters" on encounters for select
  using (campaign_id in (select campaign_id from campaign_members where user_id = auth.uid()));

-- Dice rolls: campaign members can view non-private, own private
create policy "View dice rolls" on dice_rolls for select
  using (
    campaign_id in (select campaign_id from campaign_members where user_id = auth.uid())
    and (is_private = false or user_id = auth.uid())
  );
create policy "Users can roll" on dice_rolls for insert
  with check (user_id = auth.uid());

-- Chat: campaign members, respect whispers
create policy "View chat" on chat_messages for select
  using (
    campaign_id in (select campaign_id from campaign_members where user_id = auth.uid())
    and (channel != 'whisper' or user_id = auth.uid() or whisper_to = auth.uid())
    and (channel != 'gm' or user_id in (
      select user_id from campaign_members where campaign_id = chat_messages.campaign_id and role = 'gm'
    ))
  );

-- Maps: campaign members
create policy "Campaign members view maps" on hex_maps for select
  using (campaign_id in (select campaign_id from campaign_members where user_id = auth.uid()));
create policy "Campaign members view tiles" on hex_tiles for select
  using (map_id in (select id from hex_maps where campaign_id in (
    select campaign_id from campaign_members where user_id = auth.uid()
  )));

-- Crafting: character owner
create policy "Owner manages crafting" on crafting_projects for all
  using (character_id in (select id from characters where user_id = auth.uid()));

-- Reference tables: readable by all authenticated
create policy "Read paths" on paths for select using (true);
create policy "Read skills" on skills for select using (true);
create policy "Read backgrounds" on backgrounds for select using (true);
create policy "Read spells" on spells for select using (true);
create policy "Read weapons" on weapon_templates for select using (true);
create policy "Read armor" on armor_templates for select using (true);
create policy "Read accessories" on accessory_templates for select using (true);
create policy "Read materials" on materials for select using (true);
create policy "Read recipes" on recipes for select using (true);
create policy "Read creatures" on creatures for select using (true);

-- Enable RLS on reference tables
alter table paths enable row level security;
alter table skills enable row level security;
alter table backgrounds enable row level security;
alter table spells enable row level security;
alter table weapon_templates enable row level security;
alter table armor_templates enable row level security;
alter table accessory_templates enable row level security;
alter table materials enable row level security;
alter table recipes enable row level security;
alter table creatures enable row level security;
alter table path_core_abilities enable row level security;
alter table path_branch_abilities enable row level security;

create policy "Read core abilities" on path_core_abilities for select using (true);
create policy "Read branch abilities" on path_branch_abilities for select using (true);

-- ============================================================================
-- 22. REAL-TIME SUBSCRIPTIONS (Supabase Realtime)
-- ============================================================================

-- Enable realtime for live game tables
alter publication supabase_realtime add table initiative_entries;
alter publication supabase_realtime add table map_tokens;
alter publication supabase_realtime add table encounter_creatures;
alter publication supabase_realtime add table dice_rolls;
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table character_conditions;
alter publication supabase_realtime add table encounters;

-- ============================================================================
-- 23. HELPER FUNCTIONS
-- ============================================================================

-- Calculate attribute modifier
create or replace function attribute_modifier(score int)
returns int as $$
begin
  return floor((score - 10) / 2.0)::int;
end;
$$ language plpgsql immutable;

-- Calculate proficiency bonus from tier
create or replace function proficiency_bonus(tier int)
returns int as $$
begin
  return case
    when tier <= 5 then 2
    when tier <= 10 then 3
    when tier <= 15 then 4
    else 5
  end;
end;
$$ language plpgsql immutable;

-- Calculate AP from tier
create or replace function ap_for_tier(tier int)
returns int as $$
begin
  return case
    when tier <= 5 then 3
    when tier <= 10 then 4
    when tier <= 15 then 5
    when tier <= 18 then 6
    else 7
  end;
end;
$$ language plpgsql immutable;

-- Calculate max HP
create or replace function calculate_max_hp(
  p_path path_name,
  p_might int,
  p_tier int
) returns int as $$
declare
  base_hp int;
  might_mod int;
begin
  select hp_base into base_hp from paths where id = p_path;
  might_mod := attribute_modifier(p_might);
  -- Starting HP: base + might score + 5. Each tier after: +base_scaling + might_mod
  return base_hp + p_might + 5 + greatest(0, (p_tier - 1)) * (might_mod + 3);
end;
$$ language plpgsql stable;

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles for each row execute function update_updated_at();
create trigger set_updated_at before update on campaigns for each row execute function update_updated_at();
create trigger set_updated_at before update on characters for each row execute function update_updated_at();
