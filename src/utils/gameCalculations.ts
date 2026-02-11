// ============================================================================
// AETHERMOOR — Game Calculation Utilities
// ============================================================================

import {
  POINT_BUY_COSTS, POINT_BUY_TOTAL, STAT_MIN, STAT_MAX_CREATION,
  PROFICIENCY_BY_TIER, AP_BY_TIER, SKILL_ATTRIBUTES, PATH_HP_BASE,
  type AttributeName, type SkillName, type PathName, type ConditionName,
} from '@/types/enums';
import type { Attributes, Character, ComputedSkill, CharacterSkill } from '@/types';

// ============================================================================
// ATTRIBUTE CALCULATIONS
// ============================================================================

export function attributeModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getAttributes(char: Character): Attributes {
  return {
    might: char.might,
    finesse: char.finesse,
    resolve: char.resolve,
    insight: char.insight,
    intellect: char.intellect,
    presence: char.presence,
  };
}

export function getModifiers(attrs: Attributes): Record<AttributeName, number> {
  return {
    might: attributeModifier(attrs.might),
    finesse: attributeModifier(attrs.finesse),
    resolve: attributeModifier(attrs.resolve),
    insight: attributeModifier(attrs.insight),
    intellect: attributeModifier(attrs.intellect),
    presence: attributeModifier(attrs.presence),
  };
}

// ============================================================================
// POINT BUY
// ============================================================================

export function pointBuyCost(score: number): number {
  return POINT_BUY_COSTS[score] ?? 0;
}

export function totalPointsSpent(attrs: Attributes): number {
  return Object.values(attrs).reduce((sum, score) => sum + pointBuyCost(score), 0);
}

export function pointsRemaining(attrs: Attributes): number {
  return POINT_BUY_TOTAL - totalPointsSpent(attrs);
}

export function canIncrease(attrs: Attributes, attr: AttributeName): boolean {
  const current = attrs[attr];
  if (current >= STAT_MAX_CREATION) return false;
  const nextCost = pointBuyCost(current + 1);
  const currentCost = pointBuyCost(current);
  return (nextCost - currentCost) <= pointsRemaining(attrs);
}

export function canDecrease(attr: number): boolean {
  return attr > STAT_MIN;
}

// ============================================================================
// DERIVED STATS
// ============================================================================

export function proficiencyBonus(tier: number): number {
  return PROFICIENCY_BY_TIER[tier] ?? 2;
}

export function maxAP(tier: number): number {
  return AP_BY_TIER[tier] ?? 3;
}

export function calculateMaxHP(path: PathName, might: number, tier: number): number {
  const base = PATH_HP_BASE[path];
  const mightMod = attributeModifier(might);
  // Tier 1: base + might score + 5. Each subsequent tier: +mightMod + 3
  return base + might + 5 + Math.max(0, (tier - 1)) * (mightMod + 3);
}

export function initiative(finesse: number, resolve: number, bonuses = 0): number {
  return attributeModifier(finesse) + attributeModifier(resolve) + bonuses;
}

export function bleedoutTimer(resolve: number): number {
  return Math.max(1, attributeModifier(resolve) + 2);
}

export function spellTN(castingStat: number, tier: number): number {
  return 8 + attributeModifier(castingStat) + proficiencyBonus(tier);
}

// ============================================================================
// ESSENCE POOL (Arcanist)
// ============================================================================

export function maxEssence(intellect: number, tier: number): number {
  const intMod = attributeModifier(intellect);
  if (tier <= 1) return 4 + intMod;
  if (tier <= 5) return 4 + intMod + (tier - 1) * 1.5;
  if (tier <= 10) return 10 + intMod + (tier - 5) * 1.6;
  if (tier <= 15) return 18 + intMod + (tier - 10) * 1.4;
  return 25 + intMod + (tier - 15) * 1.4;
}

export function spellsKnown(intellect: number, tier: number): number {
  return intellect + 2 * tier;
}

export function spellsPrepared(intellect: number, tier: number): number {
  return attributeModifier(intellect) + tier;
}

// ============================================================================
// SKILL CALCULATIONS
// ============================================================================

export function computeSkill(
  skill: SkillName,
  attrs: Attributes,
  tier: number,
  charSkill?: CharacterSkill,
  hasPassive = false,
): ComputedSkill {
  const attribute = SKILL_ATTRIBUTES[skill];
  const attrMod = attributeModifier(attrs[attribute]);
  const proficient = charSkill?.proficient ?? false;
  const expertise = charSkill?.expertise ?? false;

  let modifier = attrMod;
  if (proficient) {
    const prof = proficiencyBonus(tier);
    modifier += expertise ? prof * 2 : prof;
  }

  return {
    name: skill,
    attribute,
    proficient,
    expertise,
    modifier,
    passive: hasPassive ? 10 + modifier : null,
  };
}

// ============================================================================
// DICE
// ============================================================================

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides));
}

export interface DiceResult {
  rolls: number[];
  modifier: number;
  total: number;
  expression: string;
}

export function parseDiceExpression(expr: string): { count: number; sides: number; modifier: number } | null {
  const match = expr.match(/^(\d+)d(\d+)\s*([+-]\s*\d+)?$/);
  if (!match) return null;
  return {
    count: parseInt(match[1]),
    sides: parseInt(match[2]),
    modifier: match[3] ? parseInt(match[3].replace(/\s/g, '')) : 0,
  };
}

export function rollExpression(expr: string): DiceResult | null {
  const parsed = parseDiceExpression(expr);
  if (!parsed) return null;
  const rolls = rollDice(parsed.count, parsed.sides);
  const sum = rolls.reduce((a, b) => a + b, 0);
  return {
    rolls,
    modifier: parsed.modifier,
    total: sum + parsed.modifier,
    expression: expr,
  };
}

// ============================================================================
// DEGREES OF SUCCESS
// ============================================================================

export type DegreeOfSuccess = 'critical_failure' | 'failure' | 'partial' | 'full' | 'critical';

export function degreeOfSuccess(_roll: number, total: number, tn: number, natural: number): DegreeOfSuccess {
  const margin = total - tn;

  let degree: DegreeOfSuccess;
  if (margin >= 10) degree = 'critical';
  else if (margin >= 5) degree = 'full';
  else if (margin >= 0) degree = 'partial';
  else if (margin >= -9) degree = 'failure';
  else degree = 'critical_failure';

  // Nat 20 bumps up, Nat 1 bumps down
  if (natural === 20) {
    const order: DegreeOfSuccess[] = ['critical_failure', 'failure', 'partial', 'full', 'critical'];
    const idx = order.indexOf(degree);
    if (idx < order.length - 1) degree = order[idx + 1];
  } else if (natural === 1) {
    const order: DegreeOfSuccess[] = ['critical_failure', 'failure', 'partial', 'full', 'critical'];
    const idx = order.indexOf(degree);
    if (idx > 0) degree = order[idx - 1];
  }

  return degree;
}

export const DEGREE_LABELS: Record<DegreeOfSuccess, string> = {
  critical_failure: 'Critical Failure',
  failure: 'Failure',
  partial: 'Partial Success',
  full: 'Full Success',
  critical: 'Critical Success',
};

export const DEGREE_COLORS: Record<DegreeOfSuccess, string> = {
  critical_failure: 'text-blood-500',
  failure: 'text-blood-400',
  partial: 'text-yellow-400',
  full: 'text-nature-400',
  critical: 'text-arcane-400',
};

// ============================================================================
// CONDITION HELPERS
// ============================================================================

export function conditionLabel(condition: ConditionName, tier: number): string {
  const labels: Record<ConditionName, string[]> = {
    burning: ['Smoldering', 'Ablaze', 'Inferno'],
    chilled: ['Chilled', 'Frostbitten', 'Frozen'],
    poisoned: ['Nauseous', 'Toxic', 'Virulent'],
    stunned: ['Dazed', 'Staggered', 'Stunned'],
    bleeding: ['Bleeding', 'Hemorrhaging', 'Critical Bleed'],
    shaken: ['Unnerved', 'Shaken', 'Terrified'],
    exposed: ['Weakened', 'Exposed', 'Vulnerable'],
    slowed: ['Hindered', 'Slowed', 'Immobilized'],
  };
  return labels[condition]?.[tier - 1] ?? `${condition} T${tier}`;
}
