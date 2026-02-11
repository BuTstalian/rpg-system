import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Minus, Plus, Shield, Heart, Zap, Swords, Star, Info } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useReferenceData, getLocalBranchAbilities, getLocalCoreAbility } from '@/hooks/useReferenceData';
import type { PathInfo, Background } from '@/types';
import type { AttributeName, PathName, SkillName } from '@/types/enums';
import {
  ATTRIBUTES, SKILLS, SKILL_ATTRIBUTES,
  PATH_AUTO_SKILLS,
} from '@/types/enums';
import {
  attributeModifier, calculateMaxHP, maxAP, initiative, bleedoutTimer,
  pointBuyCost, pointsRemaining, canIncrease, canDecrease,
} from '@/utils/gameCalculations';
import { ATTRIBUTE_LABELS, ATTRIBUTE_DESCRIPTIONS } from '@/data/referenceData';
import type { Attributes } from '@/types';

const STEP_LABELS = ['Concept', 'Attributes', 'Path', 'Background', 'Skills', 'Abilities', 'Equipment', 'Review'];

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function StepConcept({ drive, setDrive }: { drive: string; setDrive: (v: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="card-header">Who Is Your Character?</h2>
        <p className="text-sm text-parchment-400">
          Answer these three framing questions to guide your choices in the steps ahead.
        </p>
      </div>

      <div className="space-y-4">
        <div className="card bg-ink-700/30">
          <p className="text-parchment-300 italic">"Who were you before this?"</p>
          <p className="text-xs text-parchment-500 mt-1">Points toward your Background (Step 4)</p>
        </div>
        <div className="card bg-ink-700/30">
          <p className="text-parchment-300 italic">"How do you solve problems?"</p>
          <p className="text-xs text-parchment-500 mt-1">Points toward your Path (Step 3)</p>
        </div>
        <div>
          <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">
            "What drives you?"
          </label>
          <input
            type="text"
            value={drive}
            onChange={(e) => setDrive(e.target.value)}
            className="input-field"
            placeholder="Revenge, curiosity, duty, protection, redemption, glory..."
          />
          <p className="text-xs text-parchment-500 mt-1">This becomes your character's Drive.</p>
        </div>
      </div>
    </div>
  );
}

function StepAttributes({ attrs, setAttrs }: {
  attrs: Record<AttributeName, number>;
  setAttrs: (a: Record<AttributeName, number>) => void;
}) {
  const remaining = pointsRemaining(attrs as Attributes);

  const inc = (attr: AttributeName) => {
    if (canIncrease(attrs as Attributes, attr)) {
      setAttrs({ ...attrs, [attr]: attrs[attr] + 1 });
    }
  };

  const dec = (attr: AttributeName) => {
    if (canDecrease(attrs[attr])) {
      setAttrs({ ...attrs, [attr]: attrs[attr] - 1 });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="card-header">Assign Attributes</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-parchment-400">27-point buy. All start at 8.</p>
          <span className={`font-mono text-lg font-bold ${remaining === 0 ? 'text-nature-400' : remaining < 0 ? 'text-blood-400' : 'text-parchment-100'}`}>
            {remaining} pts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ATTRIBUTES.map((attr) => {
          const val = attrs[attr];
          const mod = attributeModifier(val);
          const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
          const cost = pointBuyCost(val);

          return (
            <div key={attr} className="card bg-ink-700/30 text-center space-y-2">
              <span className="text-xs text-parchment-400 uppercase tracking-widest font-display block">
                {ATTRIBUTE_LABELS[attr]}
              </span>
              <p className="text-[10px] text-parchment-600 leading-tight">{ATTRIBUTE_DESCRIPTIONS[attr]}</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => dec(attr)}
                  disabled={!canDecrease(val)}
                  className="btn-ghost p-1 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-2xl font-bold font-mono text-parchment-100">{val}</span>
                  <span className="text-sm font-mono text-parchment-400 ml-1">({modStr})</span>
                </div>
                <button
                  onClick={() => inc(attr)}
                  disabled={!canIncrease(attrs as Attributes, attr)}
                  className="btn-ghost p-1 rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-parchment-500">{cost} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepPath({ paths, selected, onSelect }: {
  paths: PathInfo[];
  selected: PathName | null;
  onSelect: (p: PathName) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="card-header">Choose Your Path</h2>
        <p className="text-sm text-parchment-400">Your path determines your resource system, core abilities, and branch specializations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paths.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`card text-left transition-all ${
              selected === p.id
                ? 'border-arcane-500/60 bg-arcane-900/20'
                : 'hover:border-ink-500/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-display text-parchment-100 font-semibold">{p.display_name}</span>
              <span className="text-xs text-parchment-500">
                {'★'.repeat(p.complexity ?? 1)}{'☆'.repeat(5 - (p.complexity ?? 1))}
              </span>
            </div>
            <p className="text-xs text-parchment-400 leading-relaxed">{p.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="badge bg-ink-600/50 text-parchment-300 text-[10px]">HP {p.hp_base}</span>
              <span className="badge bg-ink-600/50 text-parchment-300 text-[10px] capitalize">{p.resource}</span>
              {p.combat_role && <span className="badge bg-ink-600/50 text-parchment-300 text-[10px]">{p.combat_role}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepBackground({ backgrounds, selected, onSelect, pathSkills }: {
  backgrounds: Background[];
  selected: string | null;
  onSelect: (id: string) => void;
  pathSkills: SkillName[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="card-header">Choose Your Background</h2>
        <p className="text-sm text-parchment-400">Your life before adventure. Provides 2 skill proficiencies, 1 tool, and a starting bonus.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {backgrounds.map((bg) => {
          const overlaps = bg.skill_proficiencies.filter((s) => pathSkills.includes(s as SkillName));
          return (
            <button
              key={bg.id}
              onClick={() => onSelect(bg.id)}
              className={`card text-left transition-all text-sm ${
                selected === bg.id
                  ? 'border-arcane-500/60 bg-arcane-900/20'
                  : 'hover:border-ink-500/60'
              }`}
            >
              <span className="font-medium text-parchment-100">{bg.name}</span>
              <div className="text-xs text-parchment-400 mt-1">
                <span className="text-parchment-300">Skills: </span>
                {bg.skill_proficiencies.map((s, i) => (
                  <span key={s}>
                    {i > 0 && ', '}
                    <span className={overlaps.includes(s as SkillName) ? 'text-yellow-400 line-through' : ''}>
                      {(s as string).replace(/_/g, ' ')}
                    </span>
                  </span>
                ))}
              </div>
              {bg.tool_proficiency && (
                <div className="text-xs text-parchment-500 mt-0.5">Tool: {bg.tool_proficiency}</div>
              )}
              {bg.starting_bonus && (
                <div className="text-xs text-arcane-400/70 mt-0.5">{bg.starting_bonus}</div>
              )}
              {overlaps.length > 0 && (
                <div className="text-[10px] text-yellow-500 mt-1">⚠ {overlaps.length} overlap(s) — substitute with free choice</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepSkills({ available, selected, onToggle, maxPicks }: {
  available: SkillName[];
  selected: SkillName[];
  onToggle: (s: SkillName) => void;
  maxPicks: number;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="card-header">Choose Free Skills</h2>
        <p className="text-sm text-parchment-400">
          Pick {maxPicks} additional proficiencies from the remaining skills.
        </p>
        <p className="text-sm text-parchment-300 mt-1">
          Selected: {selected.length} / {maxPicks}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {available.map((skill) => {
          const isSelected = selected.includes(skill);
          const attr = SKILL_ATTRIBUTES[skill];
          return (
            <button
              key={skill}
              onClick={() => onToggle(skill)}
              disabled={!isSelected && selected.length >= maxPicks}
              className={`card text-left text-sm transition-all ${
                isSelected
                  ? 'border-arcane-500/60 bg-arcane-900/20'
                  : 'hover:border-ink-500/60 disabled:opacity-30'
              }`}
            >
              <span className="text-parchment-200 capitalize">{skill.replace(/_/g, ' ')}</span>
              <span className="text-[10px] text-parchment-500 uppercase ml-1">{attr.slice(0, 3)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepAbilities({ path, selectedBranches, onToggleBranch }: {
  path: PathName | null;
  selectedBranches: string[];
  onToggleBranch: (abilityKey: string) => void;
}) {
  if (!path) return <p className="text-parchment-400">Select a path first.</p>;

  const coreAbility = getLocalCoreAbility(path);
  const branches = getLocalBranchAbilities(path);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="card-header">Starting Abilities</h2>
        <p className="text-sm text-parchment-400">
          You get your Tier 1 core ability automatically. Spend your <span className="text-arcane-300 font-semibold">2 Branch Points</span> on
          first-position branch abilities below.
        </p>
      </div>

      {/* Core ability */}
      {coreAbility && (
        <div className="card bg-ink-700/30 border-arcane-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-arcane-400" />
            <span className="font-display text-parchment-100 font-semibold text-sm">{coreAbility.name}</span>
            <span className="badge bg-arcane-900/30 text-arcane-300 text-[10px]">Core T1</span>
          </div>
          <p className="text-xs text-parchment-400">{coreAbility.description}</p>
        </div>
      )}

      {/* Branch abilities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display text-parchment-300">Branch Abilities</h3>
          <span className={`text-sm font-mono ${selectedBranches.length === 2 ? 'text-nature-400' : 'text-parchment-300'}`}>
            {selectedBranches.length} / 2 BP spent
          </span>
        </div>

        {branches.map((branch) => {
          const firstAbility = branch.abilities.find(a => a.position === 1);
          if (!firstAbility) return null;

          const key = `${branch.id}:${firstAbility.name}`;
          const isSelected = selectedBranches.includes(key);

          return (
            <div key={branch.id} className="space-y-2">
              <div className="text-xs text-parchment-500 uppercase tracking-wider">
                Branch {branch.id}: {branch.name}
              </div>
              <p className="text-[11px] text-parchment-600">{branch.description}</p>

              {/* Position 1 ability (available at creation) */}
              <button
                onClick={() => onToggleBranch(key)}
                disabled={!isSelected && selectedBranches.length >= 2}
                className={`card w-full text-left transition-all ${
                  isSelected
                    ? 'border-arcane-500/60 bg-arcane-900/20'
                    : 'hover:border-ink-500/60 disabled:opacity-30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-parchment-100">{firstAbility.name}</span>
                  <span className="badge bg-ink-600/50 text-parchment-400 text-[10px]">1 BP</span>
                </div>
                <p className="text-xs text-parchment-400">{firstAbility.description}</p>
              </button>

              {/* Preview of later abilities (locked) */}
              <div className="flex flex-wrap gap-2 pl-3">
                {branch.abilities.filter(a => a.position > 1).map((a) => (
                  <span key={a.position} className="text-[10px] text-parchment-600" title={a.description}>
                    {a.position}. {a.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepEquipment({ path }: { path: PathName | null }) {
  const kits: Record<PathName, string[]> = {
    vanguard: ['Martial melee weapon', 'Chain mail (AV 7) OR Leather + Shield', '5 Javelins', "Explorer's pack", '10 gp'],
    shadow: ['2 Daggers + Rapier OR Shortbow + 20 arrows', 'Leather armor (AV 3)', "Thieves' tools", "Infiltrator's pack", '15 gp'],
    arcanist: ['Quarterstaff or Dagger', 'Arcane implement', 'Cloth robes', "Scholar's pack", '10 gp'],
    warden: ['Spear or Quarterstaff + Shield', 'Hide armor (AV 4)', 'Herbalism kit', "Warden's pack + Totem", '10 gp'],
    devotant: ['Mace or Warhammer', 'Chain shirt (AV 5) + Shield', "Healer's kit + Holy symbol", "Devotant's pack", '5 gp'],
    tactician: ['Longsword or Shortbow + 20 arrows', 'Chain shirt (AV 5)', "Navigator's tools + Spyglass", "Commander's pack", '10 gp'],
    artificer: ['Hand crossbow + 20 bolts OR Light hammer', 'Leather armor (AV 3)', "Alchemy kit + Smith's + Tinker's tools", '2 basic recipes + 5 common materials', '5 gp'],
    wanderer: ['Any one weapon', 'Leather armor (AV 3)', 'One tool kit', "Explorer's deluxe pack", '15 gp'],
    channeler: ['Dagger or Quarterstaff', 'Focus Crystal', 'Padded armor (AV 2)', "Channeler's pack", '10 gp'],
    diplomat: ['Rapier or Hand crossbow + 20 bolts', 'Leather armor (AV 3) OR Fine clothing', 'Disguise kit', "Diplomat's pack", '5 gp'],
  };

  if (!path) return <p className="text-parchment-400">Select a path first.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="card-header">Starting Equipment</h2>
        <p className="text-sm text-parchment-400">Your path provides a starting kit. Equipment customization will be available after creation.</p>
      </div>

      <div className="card bg-ink-700/30">
        <h3 className="text-sm font-medium text-parchment-200 capitalize mb-2">{path} Starting Kit</h3>
        <ul className="space-y-1">
          {(kits[path] ?? []).map((item, i) => (
            <li key={i} className="text-sm text-parchment-300 flex items-start gap-2">
              <span className="text-parchment-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepReview({
  name, setName, appearance, setAppearance,
  traits, setTrait, flaw, setFlaw, bond, setBond,
  tenets, setTenet, path, attrs, allProficient,
  selectedBranches, bgName, hp, drive,
}: {
  name: string; setName: (v: string) => void;
  appearance: string; setAppearance: (v: string) => void;
  traits: [string, string]; setTrait: (i: 0 | 1, v: string) => void;
  flaw: string; setFlaw: (v: string) => void;
  bond: string; setBond: (v: string) => void;
  tenets: [string, string, string]; setTenet: (i: 0 | 1 | 2, v: string) => void;
  path: PathName | null;
  attrs: Record<AttributeName, number>;
  allProficient: SkillName[];
  selectedBranches: string[];
  bgName: string;
  hp: number;
  drive: string;
}) {
  return (
    <div className="space-y-6">
      <h2 className="card-header">Finalize Your Character</h2>

      {/* Name (required) */}
      <div>
        <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Character name" required />
      </div>

      {/* Summary card */}
      <div className="card bg-ink-700/30 space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-lg font-mono font-bold text-parchment-100">{hp}</div>
            <div className="text-[10px] text-parchment-500 uppercase">Max HP</div>
          </div>
          <div>
            <div className="text-lg font-mono font-bold text-parchment-100">{maxAP(1)}</div>
            <div className="text-[10px] text-parchment-500 uppercase">AP</div>
          </div>
          <div>
            <div className="text-lg font-mono font-bold text-parchment-100">
              {initiative(attrs.finesse, attrs.resolve) >= 0 ? '+' : ''}{initiative(attrs.finesse, attrs.resolve)}
            </div>
            <div className="text-[10px] text-parchment-500 uppercase">Initiative</div>
          </div>
          <div>
            <div className="text-lg font-mono font-bold text-parchment-100">{bleedoutTimer(attrs.resolve)}</div>
            <div className="text-[10px] text-parchment-500 uppercase">Bleed-out</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-ink-600/30">
          <span className="badge bg-ink-600/50 text-parchment-300 text-[10px] capitalize">{path}</span>
          <span className="badge bg-ink-600/50 text-parchment-300 text-[10px]">{bgName}</span>
          <span className="badge bg-ink-600/50 text-parchment-300 text-[10px]">{allProficient.length} skills</span>
          <span className="badge bg-ink-600/50 text-parchment-300 text-[10px]">{selectedBranches.length} branch abilities</span>
          {drive && <span className="badge bg-ink-600/50 text-parchment-300 text-[10px]">Drive: {drive}</span>}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Appearance</label>
          <textarea value={appearance} onChange={(e) => setAppearance(e.target.value)} className="input-field min-h-[60px]" placeholder="Brief physical description..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Personality Trait 1</label>
            <input value={traits[0]} onChange={(e) => setTrait(0, e.target.value)} className="input-field" placeholder="Always maps escape routes..." />
          </div>
          <div>
            <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Personality Trait 2</label>
            <input value={traits[1]} onChange={(e) => setTrait(1, e.target.value)} className="input-field" placeholder="Shares food before eating..." />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Flaw</label>
            <input value={flaw} onChange={(e) => setFlaw(e.target.value)} className="input-field" placeholder="A weakness or vulnerability..." />
          </div>
          <div>
            <label className="block text-xs text-parchment-400 uppercase tracking-wider mb-1">Bond</label>
            <input value={bond} onChange={(e) => setBond(e.target.value)} className="input-field" placeholder="Someone or something worth sacrificing for..." />
          </div>
        </div>

        {path === 'devotant' && (
          <div className="card bg-arcane-900/10 border-arcane-500/20 space-y-3">
            <h3 className="text-sm font-display text-arcane-300">Devotant Tenets (Required)</h3>
            <p className="text-xs text-parchment-500">Write 3 actionable, testable principles your character lives by.</p>
            {([0, 1, 2] as const).map((i) => (
              <input
                key={i}
                value={tenets[i]}
                onChange={(e) => setTenet(i, e.target.value)}
                className="input-field"
                placeholder={['I will never abandon an ally in danger', 'I will speak only truth', 'I will offer mercy to any who surrender'][i]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN WIZARD
// ============================================================================

export function CharacterCreator({ campaignId }: { campaignId?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { paths, backgrounds, loading: refLoading, source } = useReferenceData();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Character state
  const [drive, setDrive] = useState('');
  const [attrs, setAttrs] = useState<Record<AttributeName, number>>({
    might: 10, finesse: 10, resolve: 10, insight: 10, intellect: 10, presence: 10,
  });
  const [selectedPath, setSelectedPath] = useState<PathName | null>(null);
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [freeSkills, setFreeSkills] = useState<SkillName[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [charName, setCharName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [traits, setTraits] = useState<[string, string]>(['', '']);
  const [flaw, setFlaw] = useState('');
  const [bond, setBond] = useState('');
  const [tenets, setTenets] = useState<[string, string, string]>(['', '', '']);

  // Computed values
  const pathSkills = useMemo(() => selectedPath ? PATH_AUTO_SKILLS[selectedPath] : [], [selectedPath]);
  const bgObj = useMemo(() => backgrounds.find((b) => b.id === selectedBg), [backgrounds, selectedBg]);
  const bgSkills = useMemo(() => (bgObj?.skill_proficiencies ?? []) as SkillName[], [bgObj]);
  const allProficient = useMemo(() => [...new Set([...pathSkills, ...bgSkills, ...freeSkills])], [pathSkills, bgSkills, freeSkills]);
  const availableForFree = useMemo(() =>
    SKILLS.filter((s) => !pathSkills.includes(s) && !bgSkills.includes(s)),
    [pathSkills, bgSkills]
  );

  const hp = useMemo(() =>
    selectedPath ? calculateMaxHP(selectedPath, attrs.might, 1) : 0,
    [selectedPath, attrs.might]
  );

  // Reset branch abilities when path changes
  useEffect(() => {
    setSelectedBranches([]);
  }, [selectedPath]);

  const toggleFreeSkill = (skill: SkillName) => {
    if (freeSkills.includes(skill)) {
      setFreeSkills(freeSkills.filter((s) => s !== skill));
    } else if (freeSkills.length < 2) {
      setFreeSkills([...freeSkills, skill]);
    }
  };

  const toggleBranch = (key: string) => {
    if (selectedBranches.includes(key)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== key));
    } else if (selectedBranches.length < 2) {
      setSelectedBranches([...selectedBranches, key]);
    }
  };

  // Validation per step
  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return true;
      case 1: return pointsRemaining(attrs as Attributes) === 0;
      case 2: return selectedPath !== null;
      case 3: return selectedBg !== null;
      case 4: return freeSkills.length === 2;
      case 5: return selectedBranches.length === 2;
      case 6: return true; // Equipment auto-assigned
      case 7: return charName.trim().length > 0;
      default: return false;
    }
  }, [step, attrs, selectedPath, selectedBg, freeSkills, selectedBranches, charName]);

  // Save character
  const handleSave = async () => {
    if (!user || !selectedPath || !selectedBg) return;
    setSaving(true);
    setError(null);

    const charData = {
      user_id: user.id,
      campaign_id: campaignId ?? null,
      name: charName.trim(),
      path: selectedPath,
      background_id: source === 'local' ? null : selectedBg,
      tier: 1,
      might: attrs.might,
      finesse: attrs.finesse,
      resolve: attrs.resolve,
      insight: attrs.insight,
      intellect: attrs.intellect,
      presence: attrs.presence,
      hp_max: hp,
      hp_current: hp,
      armor_value: 0,
      ap_max: maxAP(1),
      resource_current: 0,
      resource_max: 0,
      branch_points_spent: selectedBranches.length,
      branch_points_total: 2,
      appearance: appearance.trim() || null,
      personality_traits: traits.filter((t) => t.trim()),
      flaw: flaw.trim() || null,
      bond: bond.trim() || null,
      drive: drive.trim() || null,
      tenets: selectedPath === 'devotant' ? tenets.filter((t) => t.trim()) : [],
      gold: 50,
    };

    const { data: char, error: charErr } = await supabase
      .from('characters')
      .insert(charData)
      .select()
      .single();

    if (charErr || !char) {
      setError(charErr?.message ?? 'Failed to create character');
      setSaving(false);
      return;
    }

    // Insert skill proficiencies
    const skillRows = [
      ...pathSkills.map((s) => ({ character_id: char.id, skill: s, proficient: true, expertise: false, source: 'path' })),
      ...bgSkills.filter((s) => !pathSkills.includes(s)).map((s) => ({ character_id: char.id, skill: s, proficient: true, expertise: false, source: 'background' })),
      ...freeSkills.map((s) => ({ character_id: char.id, skill: s, proficient: true, expertise: false, source: 'free' })),
    ];

    if (skillRows.length > 0) {
      await supabase.from('character_skills').insert(skillRows);
    }

    setSaving(false);
    navigate(`/character/${char.id}`);
  };

  if (refLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 flex items-center justify-center min-h-[300px]">
        <p className="text-parchment-400">Loading reference data...</p>
      </div>
    );
  }

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 0: return <StepConcept drive={drive} setDrive={setDrive} />;
      case 1: return <StepAttributes attrs={attrs} setAttrs={setAttrs} />;
      case 2: return <StepPath paths={paths} selected={selectedPath} onSelect={setSelectedPath} />;
      case 3: return <StepBackground backgrounds={backgrounds} selected={selectedBg} onSelect={setSelectedBg} pathSkills={pathSkills} />;
      case 4: return <StepSkills available={availableForFree} selected={freeSkills} onToggle={toggleFreeSkill} maxPicks={2} />;
      case 5: return <StepAbilities path={selectedPath} selectedBranches={selectedBranches} onToggleBranch={toggleBranch} />;
      case 6: return <StepEquipment path={selectedPath} />;
      case 7: return (
        <StepReview
          name={charName} setName={setCharName}
          appearance={appearance} setAppearance={setAppearance}
          traits={traits} setTrait={(i, v) => { const t = [...traits] as [string, string]; t[i] = v; setTraits(t); }}
          flaw={flaw} setFlaw={setFlaw}
          bond={bond} setBond={setBond}
          tenets={tenets} setTenet={(i, v) => { const t = [...tenets] as [string, string, string]; t[i] = v; setTenets(t); }}
          path={selectedPath}
          attrs={attrs}
          allProficient={allProficient}
          selectedBranches={selectedBranches}
          bgName={bgObj?.name ?? '—'}
          hp={hp}
          drive={drive}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* Data source indicator */}
      {source === 'local' && (
        <div className="flex items-center gap-2 text-xs text-parchment-600 bg-ink-800/50 rounded-lg px-3 py-2">
          <Info className="w-3.5 h-3.5" />
          Using local reference data — run Supabase migrations for full database integration.
        </div>
      )}

      {/* Progress bar */}
      <div className="card">
        <div className="flex items-center gap-1 mb-2">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full h-1.5 rounded-full transition-colors ${
                  i < step ? 'bg-arcane-500' : i === step ? 'bg-arcane-400' : 'bg-ink-700'
                }`}
              />
              <span className={`text-[9px] mt-1 uppercase tracking-wider ${
                i === step ? 'text-arcane-400' : i < step ? 'text-parchment-400' : 'text-parchment-600'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preview sidebar */}
      {selectedPath && step > 1 && (
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-parchment-300">
            <Heart className="w-3.5 h-3.5 text-blood-400" />
            <span className="font-mono">{hp}</span>
          </div>
          <div className="flex items-center gap-1 text-parchment-300">
            <Zap className="w-3.5 h-3.5 text-arcane-400" />
            <span className="font-mono">{maxAP(1)} AP</span>
          </div>
          <div className="flex items-center gap-1 text-parchment-300">
            <Swords className="w-3.5 h-3.5 text-parchment-400" />
            <span className="font-mono">Init {initiative(attrs.finesse, attrs.resolve) >= 0 ? '+' : ''}{initiative(attrs.finesse, attrs.resolve)}</span>
          </div>
          <div className="flex items-center gap-1 text-parchment-300">
            <Shield className="w-3.5 h-3.5 text-parchment-400" />
            <span className="font-mono">Bleed {bleedoutTimer(attrs.resolve)}r</span>
          </div>
          <span className="text-parchment-500">•</span>
          <span className="text-parchment-400 capitalize">{selectedPath}</span>
          <span className="text-parchment-500">•</span>
          <span className="text-parchment-400">{allProficient.length} skills</span>
        </div>
      )}

      {/* Step content */}
      <div className="card min-h-[300px]">
        {renderStep()}
      </div>

      {/* Error */}
      {error && (
        <div className="text-blood-400 text-sm bg-blood-900/20 border border-blood-800/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="btn-secondary"
        >
          <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
        </button>

        {step < 7 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance}
            className="btn-primary"
          >
            Next <ChevronRight className="w-4 h-4 inline ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!canAdvance || saving}
            className="btn-primary"
          >
            {saving ? 'Creating...' : (<><Check className="w-4 h-4 inline mr-1" /> Create Character</>)}
          </button>
        )}
      </div>
    </div>
  );
}
