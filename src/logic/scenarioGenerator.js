/**
 * scenarioGenerator.js
 * ─────────────────────────────────────────────────────────────
 * Generates random, valid blackjack training scenarios.
 *
 * Each scenario has:
 *   - handType: 'hard' | 'soft' | 'pair'
 *   - playerCards: string[]  e.g. ['A', '7'] or ['8', '8']
 *   - dealerUpcard: string   e.g. '6' or 'A'
 *
 * Suits are purely cosmetic and assigned randomly for display.
 */

import { DEALER_UPCARDS } from '../data/strategy.js'

// All card ranks in a standard deck
const ALL_RANKS     = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const FACE_RANKS    = ['J', 'Q', 'K']
const NUMBER_RANKS  = ['2', '3', '4', '5', '6', '7', '8', '9', '10']
const PAIR_RANKS    = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A']  // exclude faces (same value as 10)
const SUITS         = ['♠', '♥', '♦', '♣']

// Numeric value of a card rank (Ace = 11 for initial calculation)
export function cardValue(rank) {
  if (FACE_RANKS.includes(rank)) return 10
  if (rank === 'A') return 11
  return parseInt(rank, 10)
}

// Pick a random element from an array
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Assign a random suit to each card in the player and dealer hands
function assignSuits(playerCards, dealerUpcard) {
  return {
    playerCards: playerCards.map(rank => ({ rank, suit: pick(SUITS) })),
    dealerCard:  { rank: dealerUpcard, suit: pick(SUITS) },
  }
}

// ── SCENARIO GENERATORS ───────────────────────────────────────

/**
 * Generate a hard-total scenario.
 * Two cards, no Ace, not a pair, total between 8 and 16
 * (totals below 8 are trivially "always hit", 17+ "always stand")
 */
function generateHardScenario(dealerUpcard) {
  let cards
  let attempts = 0

  do {
    const c1 = pick(NUMBER_RANKS)
    const c2 = pick(NUMBER_RANKS)
    const total = parseInt(c1, 10) + parseInt(c2, 10)
    const isPair = c1 === c2

    // We want interesting hard totals (8-16) and no pairs (handled separately)
    if (!isPair && total >= 8 && total <= 16) {
      cards = [c1, c2]
    }
    attempts++
    // Safety valve — shouldn't loop more than ~20 times
    if (attempts > 100) {
      cards = ['9', '7'] // fallback: hard 16
      break
    }
  } while (!cards)

  return { handType: 'hard', playerCards: cards, dealerUpcard }
}

/**
 * Generate a soft-total scenario.
 * Ace + one non-Ace card (2-9) → soft 13 through soft 20
 */
function generateSoftScenario(dealerUpcard) {
  // Soft 13 (A+2) through Soft 20 (A+9)
  const otherCard = pick(['2', '3', '4', '5', '6', '7', '8', '9'])
  return { handType: 'soft', playerCards: ['A', otherCard], dealerUpcard }
}

/**
 * Generate a pair scenario.
 * Two cards of the same rank.
 * Face cards (J/Q/K) are normalised to '10' to keep strategy lookup simple.
 */
function generatePairScenario(dealerUpcard) {
  const rank = pick(PAIR_RANKS)
  return { handType: 'pair', playerCards: [rank, rank], dealerUpcard }
}

// ── PUBLIC API ─────────────────────────────────────────────────

/**
 * Generate a single random training scenario.
 * Distribution: 50% hard, 25% soft, 25% pair
 */
export function generateScenario() {
  const dealerUpcard = pick(DEALER_UPCARDS)
  const roll = Math.random()

  let scenario
  if (roll < 0.50) {
    scenario = generateHardScenario(dealerUpcard)
  } else if (roll < 0.75) {
    scenario = generateSoftScenario(dealerUpcard)
  } else {
    scenario = generatePairScenario(dealerUpcard)
  }

  // Attach cosmetic suit information for display
  const { playerCards, dealerCard } = assignSuits(scenario.playerCards, dealerUpcard)
  return { ...scenario, playerCardsDisplay: playerCards, dealerCardDisplay: dealerCard }
}
