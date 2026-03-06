/**
 * evaluator.js
 * ─────────────────────────────────────────────────────────────
 * Evaluates a scenario against the strategy tables and returns:
 *   - correctAction  : 'H' | 'S' | 'D' | 'P'
 *   - isCorrect      : boolean
 *   - category       : 'Hard Total' | 'Soft Total' | 'Pair Splitting'
 *   - rule           : short strategy rule string
 *   - explanation    : beginner-friendly explanation paragraph
 */

import {
  DEALER_UPCARDS,
  HARD_STRATEGY,
  SOFT_STRATEGY,
  PAIR_STRATEGY,
  getHardExplanation,
  getSoftExplanation,
  getPairExplanation,
} from '../data/strategy.js'
import { cardValue } from './scenarioGenerator.js'

// Map dealer upcard string → column index 0–9
function dealerIndex(upcard) {
  return DEALER_UPCARDS.indexOf(upcard)
}

// Normalise a pair card rank to the numeric key in PAIR_STRATEGY
function normalisePairKey(rank) {
  if (rank === 'A')                    return 11
  if (['J', 'Q', 'K'].includes(rank)) return 10
  return parseInt(rank, 10)
}

/**
 * Core look-up: returns correctAction + rich explanation for any scenario.
 * @param {object} scenario - { handType, playerCards, dealerUpcard }
 * @returns {{ correctAction, category, rule, explanation }}
 */
export function getCorrectAction(scenario) {
  const { handType, playerCards, dealerUpcard } = scenario
  const dIdx = dealerIndex(dealerUpcard)

  // ── PAIR ──────────────────────────────────────────────────────
  if (handType === 'pair') {
    const pairKey = normalisePairKey(playerCards[0])
    const correctAction = PAIR_STRATEGY[pairKey]?.[dIdx] ?? 'H'
    const explanation = getPairExplanation(pairKey, dealerUpcard, correctAction)
    return { correctAction, ...explanation }
  }

  // ── SOFT ──────────────────────────────────────────────────────
  if (handType === 'soft') {
    const otherCard = playerCards.find(c => c !== 'A') ?? playerCards[1]
    const total = 11 + parseInt(otherCard, 10)   // e.g. A+7 = soft 18
    const correctAction = SOFT_STRATEGY[total]?.[dIdx] ?? 'H'
    const explanation = getSoftExplanation(total, dealerUpcard, correctAction)
    return { correctAction, ...explanation }
  }

  // ── HARD ──────────────────────────────────────────────────────
  const total = playerCards.reduce((sum, rank) => {
    const val = cardValue(rank)
    return sum + (val === 11 ? 1 : val)   // Ace = 1 in hard hand
  }, 0)
  const clamped = Math.max(8, Math.min(total, 17))
  const correctAction = HARD_STRATEGY[clamped]?.[dIdx] ?? 'S'
  const explanation = getHardExplanation(total, dealerUpcard, correctAction)
  return { correctAction, ...explanation }
}

/**
 * Public entry point: evaluate the user's choice against strategy.
 * @param {object} scenario
 * @param {string} userAction - 'H' | 'S' | 'D' | 'P'
 * @returns {{
 *   isCorrect    : boolean,
 *   correctAction: string,
 *   category     : string,
 *   rule         : string,
 *   explanation  : string,
 * }}
 */
export function evaluate(scenario, userAction) {
  const result = getCorrectAction(scenario)
  return {
    isCorrect: userAction === result.correctAction,
    correctAction: result.correctAction,
    category:      result.category,
    rule:          result.rule,
    explanation:   result.explanation,
  }
}
