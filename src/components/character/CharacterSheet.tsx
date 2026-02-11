import { useMemo } from 'react';
import { Shield, Heart, Zap, Swords, Eye, Flame, Droplets } from 'lucide-react';
import type { Character, CharacterSkill, CharacterEquipmentItem, CharacterCondition } from '@/types';
import type { SkillName, ConditionName } from '@/types/enums';
import { SKILLS, PATH_RESOURCES, RARITY_COLORS, CONDITION_COLORS } from '@/types/enums';
import {
  attributeModifier, proficiencyBonus, initiative, bleedoutTimer,
  computeSkill, conditionLabel,
} from '@/utils/gameCalculations';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatBlock({ label, value, modifier }: { label: string; value: number; modifier: number }) {
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  return (
    <div className="stat-block">
      <span className="stat-value">{value}</span>
      <span className="stat-modifier">{modStr}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function HPBar({ current, max }: { current: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const color = pct > 60 ? 'bg-nature-500' : pct > 30 ? 'bg-yellow-500' : 'bg-blood-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-parchment-300 flex items-center gap-1">
          <Heart className="w-4 h-4 text-blood-400" /> HP
        </span>
        <span className="font-mono text-parchment-100">{current} / {max}</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ResourceBar({ current, max, type }: { current: number; max: number; type: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;

  const colorMap: Record<string, string> = {
    momentum: 'bg-yellow-500',
    focus: 'bg-blue-400',
    essence: 'bg-arcane-500',
    conviction: 'bg-yellow-300',
    preparation: 'bg-orange-400',
    attunement: 'bg-nature-500',
    flux: 'bg-pink-500',
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-parchment-300 flex items-center gap-1">
          <Zap className="w-4 h-4 text-arcane-400" />
          <span className="capitalize">{type}</span>
        </span>
        <span className="font-mono text-parchment-100">{current} / {max}</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill ${colorMap[type] ?? 'bg-arcane-400'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ConditionBadge({ condition, tier }: { condition: ConditionName; tier: number }) {
  const dots = '●'.repeat(tier) + '○'.repeat(3 - tier);
  return (
    <span className={`badge-condition ${CONDITION_COLORS[condition]}`}>
      {conditionLabel(condition, tier)}
      <span className="ml-1 text-[10px] opacity-60">{dots}</span>
    </span>
  );
}

function SkillRow({ name, attribute, modifier, proficient, expertise }: {
  name: string;
  attribute: string;
  modifier: number;
  proficient: boolean;
  expertise: boolean;
}) {
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-ink-700/30 transition-colors">
      <div className="flex items-center gap-2">
        <span className="w-4 text-center text-xs">
          {expertise ? '◆' : proficient ? '●' : '○'}
        </span>
        <span className="text-sm text-parchment-200 capitalize">
          {name.replace(/_/g, ' ')}
        </span>
        <span className="text-xs text-parchment-500 uppercase">{attribute.slice(0, 3)}</span>
      </div>
      <span className={`font-mono text-sm ${proficient ? 'text-parchment-100' : 'text-parchment-400'}`}>
        {modStr}
      </span>
    </div>
  );
}

function EquipmentSlot({ item }: { item: CharacterEquipmentItem }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-ink-700/30 border border-ink-600/20">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${RARITY_COLORS[item.rarity]}`}>
            {item.custom_name}
          </span>
          {item.quantity > 1 && (
            <span className="text-xs text-parchment-400">×{item.quantity}</span>
          )}
        </div>
        {item.enchantments.length > 0 && (
          <div className="text-xs text-arcane-400 mt-0.5">
            {item.enchantments.map((e) => e.name).join(', ')}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-parchment-400">
        {item.is_equipped && (
          <span className="text-nature-400 uppercase text-[10px] tracking-wider">equipped</span>
        )}
        {item.is_attuned && (
          <span className="text-arcane-400 uppercase text-[10px] tracking-wider">attuned</span>
        )}
      </div>
    </div>
  );
}

function AbilityCard({ ability }: { ability: { name: string; type: string; description: string; branch?: string; tier?: number } }) {
  return (
    <div className="p-3 rounded-lg bg-ink-700/30 border border-ink-600/20">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-parchment-100">{ability.name}</span>
        {ability.type === 'core' && (
          <span className="badge bg-arcane-900/50 text-arcane-300 text-[10px]">CORE</span>
        )}
        {ability.branch && (
          <span className="badge bg-ink-600/50 text-parchment-300 text-[10px]">Branch {ability.branch}</span>
        )}
      </div>
      <p className="text-xs text-parchment-400 leading-relaxed">{ability.description}</p>
    </div>
  );
}

// ============================================================================
// MAIN CHARACTER SHEET
// ============================================================================

interface CharacterSheetProps {
  character: Character;
  skills: CharacterSkill[];
  equipment: CharacterEquipmentItem[];
  conditions: CharacterCondition[];
  abilities: { name: string; type: 'core' | 'branch'; description: string; branch?: string; tier?: number }[];
}

export function CharacterSheet({ character, skills, equipment, conditions, abilities }: CharacterSheetProps) {
  const char = character;
  const tier = char.tier;
  const profBonus = proficiencyBonus(tier);
  const resourceType = PATH_RESOURCES[char.path];

  const modifiers = useMemo(() => ({
    might: attributeModifier(char.might),
    finesse: attributeModifier(char.finesse),
    resolve: attributeModifier(char.resolve),
    insight: attributeModifier(char.insight),
    intellect: attributeModifier(char.intellect),
    presence: attributeModifier(char.presence),
  }), [char]);

  const computedSkills = useMemo(() => {
    const skillMap = new Map(skills.map((s) => [s.skill, s]));
    const passiveSkills: SkillName[] = ['perception', 'intuition', 'survival', 'arcane_knowledge', 'composure'];

    return SKILLS.map((skillName) => computeSkill(
      skillName,
      { might: char.might, finesse: char.finesse, resolve: char.resolve, insight: char.insight, intellect: char.intellect, presence: char.presence },
      tier,
      skillMap.get(skillName),
      passiveSkills.includes(skillName),
    ));
  }, [char, skills, tier]);

  const init = initiative(char.finesse, char.resolve);
  const bleedout = bleedoutTimer(char.resolve);

  const equippedItems = equipment.filter((e) => e.is_equipped);
  const inventoryItems = equipment.filter((e) => !e.is_equipped);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      {/* HEADER */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="font-display text-2xl text-parchment-100 font-bold tracking-wide">
              {char.name}
            </h1>
            <p className="text-sm text-parchment-400">
              Tier {tier} <span className="capitalize">{char.path}</span> • Proficiency +{profBonus}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-xs text-parchment-500 uppercase tracking-wider">AP</div>
              <div className="text-xl font-bold font-mono text-parchment-100">{char.ap_max}</div>
            </div>
            <div className="w-px h-8 bg-ink-600" />
            <div className="text-center">
              <div className="text-xs text-parchment-500 uppercase tracking-wider">Init</div>
              <div className="text-xl font-bold font-mono text-parchment-100">
                {init >= 0 ? `+${init}` : init}
              </div>
            </div>
            <div className="w-px h-8 bg-ink-600" />
            <div className="text-center">
              <div className="text-xs text-parchment-500 uppercase tracking-wider">AV</div>
              <div className="text-xl font-bold font-mono text-parchment-100 flex items-center gap-1">
                <Shield className="w-4 h-4 text-parchment-400" />
                {char.armor_value}
              </div>
            </div>
            <div className="w-px h-8 bg-ink-600" />
            <div className="text-center">
              <div className="text-xs text-parchment-500 uppercase tracking-wider">Bleed</div>
              <div className="text-xl font-bold font-mono text-blood-400">{bleedout}r</div>
            </div>
          </div>
        </div>
        {/* HP & Resource */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <HPBar current={char.hp_current} max={char.hp_max} />
          <ResourceBar current={char.resource_current} max={char.resource_max} type={resourceType} />
        </div>
        {/* Conditions */}
        {conditions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {conditions.map((c) => (
              <ConditionBadge key={c.id} condition={c.condition} tier={c.tier} />
            ))}
          </div>
        )}
      </div>

      {/* ATTRIBUTES */}
      <div className="card">
        <div className="card-header">Attributes</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <StatBlock label="Might" value={char.might} modifier={modifiers.might} />
          <StatBlock label="Finesse" value={char.finesse} modifier={modifiers.finesse} />
          <StatBlock label="Resolve" value={char.resolve} modifier={modifiers.resolve} />
          <StatBlock label="Insight" value={char.insight} modifier={modifiers.insight} />
          <StatBlock label="Intellect" value={char.intellect} modifier={modifiers.intellect} />
          <StatBlock label="Presence" value={char.presence} modifier={modifiers.presence} />
        </div>
      </div>

      {/* TWO-COLUMN: Skills + Abilities/Equipment */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* SKILLS (2 cols) */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center gap-2">
            <Eye className="w-4 h-4" /> Skills
          </div>
          <div className="space-y-0.5">
            {computedSkills.map((skill) => (
              <SkillRow
                key={skill.name}
                name={skill.name}
                attribute={skill.attribute}
                modifier={skill.modifier}
                proficient={skill.proficient}
                expertise={skill.expertise}
              />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-ink-600/30 text-xs text-parchment-500">
            ○ Not proficient &nbsp; ● Proficient &nbsp; ◆ Expertise
          </div>
          {/* Passive scores */}
          <div className="mt-3 pt-3 border-t border-ink-600/30">
            <div className="text-xs text-parchment-500 uppercase tracking-wider mb-2">Passive Scores</div>
            <div className="grid grid-cols-2 gap-2">
              {computedSkills.filter((s) => s.passive !== null).map((s) => (
                <div key={s.name} className="flex justify-between text-sm">
                  <span className="text-parchment-400 capitalize">{s.name.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-parchment-200">{s.passive}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* ABILITIES */}
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <Flame className="w-4 h-4 text-arcane-400" /> Abilities
            </div>
            <div className="space-y-2">
              {abilities.map((a) => (
                <AbilityCard key={a.name} ability={a} />
              ))}
            </div>
          </div>

          {/* EQUIPPED */}
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <Swords className="w-4 h-4 text-parchment-300" /> Equipped
            </div>
            <div className="space-y-2">
              {equippedItems.map((item) => (
                <EquipmentSlot key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* INVENTORY */}
          {inventoryItems.length > 0 && (
            <div className="card">
              <div className="card-header flex items-center gap-2">
                <Droplets className="w-4 h-4 text-parchment-400" /> Inventory
              </div>
              <div className="space-y-2">
                {inventoryItems.map((item) => (
                  <EquipmentSlot key={item.id} item={item} />
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-ink-600/30 flex justify-between text-sm">
                <span className="text-parchment-400">Gold</span>
                <span className="font-mono text-yellow-400">{char.gold} gp</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="card">
        <div className="card-header">Character Details</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {char.appearance && (
            <div>
              <span className="text-parchment-500 text-xs uppercase tracking-wider">Appearance</span>
              <p className="text-parchment-300 mt-1">{char.appearance}</p>
            </div>
          )}
          {char.drive && (
            <div>
              <span className="text-parchment-500 text-xs uppercase tracking-wider">Drive</span>
              <p className="text-parchment-200 mt-1 italic">"{char.drive}"</p>
            </div>
          )}
          {char.personality_traits.length > 0 && (
            <div>
              <span className="text-parchment-500 text-xs uppercase tracking-wider">Personality</span>
              <ul className="mt-1 space-y-1">
                {char.personality_traits.map((t, i) => (
                  <li key={i} className="text-parchment-300">• {t}</li>
                ))}
              </ul>
            </div>
          )}
          {char.flaw && (
            <div>
              <span className="text-parchment-500 text-xs uppercase tracking-wider">Flaw</span>
              <p className="text-parchment-300 mt-1">{char.flaw}</p>
            </div>
          )}
          {char.bond && (
            <div>
              <span className="text-parchment-500 text-xs uppercase tracking-wider">Bond</span>
              <p className="text-parchment-300 mt-1">{char.bond}</p>
            </div>
          )}
          {char.npc_connections.length > 0 && (
            <div>
              <span className="text-parchment-500 text-xs uppercase tracking-wider">Connections</span>
              <div className="mt-1 space-y-1">
                {char.npc_connections.map((c, i) => (
                  <div key={i} className="text-parchment-300">
                    <span className="font-medium text-parchment-200">{c.name}</span>
                    <span className="text-parchment-500"> — </span>
                    {c.relationship}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
