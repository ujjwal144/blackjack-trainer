/**
 * strategy.js
 * ─────────────────────────────────────────────────────────────
 * Complete Blackjack Basic Strategy — 6-deck, dealer stands on
 * soft 17, double after split allowed.
 *
 * Action codes:  H = Hit  |  S = Stand  |  D = Double  |  P = Split
 *
 * Table index:  [playerKey][dealerUpcardIndex]
 * Dealer order:   2   3   4   5   6   7   8   9  10   A
 *                 0   1   2   3   4   5   6   7   8   9
 *
 * EXPLANATION SYSTEM
 * ─────────────────────────────────────────────────────────────
 * Every distinct strategic situation has a hand-crafted explanation
 * written for beginners. Explanations follow a consistent structure:
 *
 *   1. STATE the rule clearly (what to do)
 *   2. REASON using dealer bust probability or hand strength
 *   3. CONTRAST with the wrong choice (why the alternative loses)
 *
 * Dealer bust probabilities (approximate, 6-deck):
 *   Dealer 2:  35%   Dealer 3:  37%   Dealer 4:  40%
 *   Dealer 5:  42%   Dealer 6:  42%   Dealer 7:  26%
 *   Dealer 8:  24%   Dealer 9:  23%   Dealer 10: 21%
 *   Dealer A:  17%
 */

// ── Constants ─────────────────────────────────────────────────
export const DEALER_UPCARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A']
export const ACTION_LABELS  = { H: 'Hit', S: 'Stand', D: 'Double', P: 'Split' }

// ── Raw strategy tables ───────────────────────────────────────
export const HARD_STRATEGY = {
  //          2    3    4    5    6    7    8    9   10    A
  8:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  9:  ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  10: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
  11: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H'],
  12: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  13: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  14: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  15: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  16: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  17: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
}

export const SOFT_STRATEGY = {
  //          2    3    4    5    6    7    8    9   10    A
  13: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  14: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  15: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  16: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  17: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  18: ['S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'],
  19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
}

export const PAIR_STRATEGY = {
  //          2    3    4    5    6    7    8    9   10    A
  2:  ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  3:  ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  4:  ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
  5:  ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
  6:  ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
  7:  ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  8:  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  9:  ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'],
  10: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  11: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
}

// ═══════════════════════════════════════════════════════════════
// EXPLANATION LOOKUP TABLES
// ─────────────────────────────────────────────────────────────
// These are static, hand-crafted objects — one entry per distinct
// strategic situation. Each entry: { category, rule, explanation }
//
// Keys follow the pattern:  "hard-{total}-{dealerGroup}"
//                           "soft-{total}-{dealerGroup}"
//                           "pair-{rank}-{dealerGroup}"
//
// Dealer groups:
//   weak    = 4, 5, 6   (bust rate 40–42%)
//   low     = 2, 3       (bust rate 35–37%)
//   mid     = 7, 8       (bust rate 23–26%)
//   strong  = 9, 10, A   (bust rate 17–23%)
// ═══════════════════════════════════════════════════════════════

function dealerGroup(upcard) {
  if (['4','5','6'].includes(upcard)) return 'weak'
  if (['2','3'].includes(upcard))     return 'low'
  if (['7','8'].includes(upcard))     return 'mid'
  return 'strong' // 9, 10, A
}

// ── HARD TOTAL EXPLANATIONS ───────────────────────────────────
// One entry per (total, dealerGroup) combination that appears in the table.
// Totals 5–8 always hit; total 17+ always stand — two catch-all entries.

const HARD_EXPLANATIONS = {

  // ── Hard 5–8: always hit ──────────────────────────────────────
  'hard-low-always': {
    category: 'Hard Total',
    rule: 'Hard 5–8 → Always Hit',
    explanation:
      'Your total is so low that drawing any card is safe — even a 10 only brings you to 18. '
      + 'There is no reason to stand; always take another card to build a competitive hand.',
  },

  // ── Hard 9 ───────────────────────────────────────────────────
  'hard-9-weak': {
    category: 'Hard Total',
    rule: 'Hard 9 vs dealer 4–6 → Double Down',
    explanation:
      'The dealer is showing a bust card (4, 5, or 6). With roughly a 40% chance of busting, '
      + 'they are in serious trouble. Double down on your 9 to put twice the money on the table — '
      + 'the dealer will bust often enough to make this highly profitable over time.',
  },
  'hard-9-other': {
    category: 'Hard Total',
    rule: 'Hard 9 vs dealer 2–3 or 7–A → Hit',
    explanation:
      'Hard 9 is not strong enough to double when the dealer has a 2, 3, or a card 7 or higher. '
      + 'Against a dealer 7+ the dealer will make a strong hand most of the time, so doubling risks '
      + 'twice the bet for a poor expected outcome. Simply hit and try to build a stronger total.',
  },

  // ── Hard 10 ──────────────────────────────────────────────────
  'hard-10-weak': {
    category: 'Hard Total',
    rule: 'Hard 10 vs dealer 2–9 → Double Down',
    explanation:
      'Hard 10 is one of the best doubling situations in blackjack. There are 16 ten-value cards '
      + '(10, J, Q, K) in every 52 cards — about 31% of the deck — so there is a very good chance '
      + 'your next card brings you to 20. Double down to maximise your profit on a powerful position.',
  },
  'hard-10-strong': {
    category: 'Hard Total',
    rule: 'Hard 10 vs dealer 10 or Ace → Hit',
    explanation:
      'Against a dealer 10 or Ace, even hitting 20 may not be enough — the dealer could have '
      + 'blackjack or make a strong total. Doubling here puts twice your bet at risk for a weaker '
      + 'expected return. Hit instead, see what card you get, and evaluate from there.',
  },

  // ── Hard 11 ──────────────────────────────────────────────────
  'hard-11-nodlr-ace': {
    category: 'Hard Total',
    rule: 'Hard 11 vs dealer 2–10 → Double Down',
    explanation:
      'Hard 11 is the single best doubling hand in blackjack. Any of the 16 ten-value cards '
      + 'in the deck gives you 21, and even smaller cards usually leave you with a strong total. '
      + 'Double down against every dealer card except an Ace to get maximum value from this position.',
  },
  'hard-11-ace': {
    category: 'Hard Total',
    rule: 'Hard 11 vs dealer Ace → Hit',
    explanation:
      'When the dealer shows an Ace they may already have blackjack (natural 21), which beats '
      + 'even a doubled 21. Doubling here exposes twice your bet to that risk. Hit instead — '
      + 'you still have an excellent hand and can act on whatever card you receive.',
  },

  // ── Hard 12 ──────────────────────────────────────────────────
  'hard-12-weak': {
    category: 'Hard Total',
    rule: 'Hard 12 vs dealer 4–6 → Stand',
    explanation:
      'Hard 12 is a tricky hand, but against a dealer 4, 5, or 6 you should stand. '
      + 'The dealer busts around 40% of the time with these upcards, and any card from 10 down to a '
      + '10-value card busts your 12 immediately. Let the dealer take the risk of busting first.',
  },
  'hard-12-other': {
    category: 'Hard Total',
    rule: 'Hard 12 vs dealer 2, 3, or 7+ → Hit',
    explanation:
      'Against a dealer 2, 3, or 7 or higher, hard 12 is too weak to stand on. '
      + 'The dealer is likely to make a strong hand (17 or better), and your 12 loses to almost '
      + 'everything. You must hit to try to improve, even though there is some bust risk.',
  },

  // ── Hard 13 ──────────────────────────────────────────────────
  'hard-13-low': {
    category: 'Hard Total',
    rule: 'Hard 13 vs dealer 2–6 → Stand',
    explanation:
      'Stand on hard 13 against any dealer 2 through 6. The dealer must draw to at least 17 '
      + 'and with a low upcard they have a meaningful bust chance (35–42%). Any card 9 or higher '
      + 'busts your 13. Let the dealer risk busting rather than risking your own hand.',
  },
  'hard-13-strong': {
    category: 'Hard Total',
    rule: 'Hard 13 vs dealer 7+ → Hit',
    explanation:
      'Against a dealer 7 or higher, standing on 13 is a losing strategy — the dealer will '
      + 'make a hand of 17–21 the majority of the time, and your 13 loses to all of it. '
      + 'Hit and accept some bust risk because you need to improve your total to have any chance.',
  },

  // ── Hard 14 ──────────────────────────────────────────────────
  'hard-14-low': {
    category: 'Hard Total',
    rule: 'Hard 14 vs dealer 2–6 → Stand',
    explanation:
      'Stand on hard 14 whenever the dealer shows a 2 through 6. These upcards give the dealer '
      + 'a bust rate between 35–42%, which is your best friend. Any card 8 or higher busts your 14, '
      + 'so give the dealer a chance to bust instead of risking your own hand.',
  },
  'hard-14-strong': {
    category: 'Hard Total',
    rule: 'Hard 14 vs dealer 7+ → Hit',
    explanation:
      'When the dealer shows 7 or higher, their bust rate drops sharply and they will complete '
      + 'a strong hand most of the time. Your hard 14 is a losing hand against a dealer 17–21, '
      + 'so you must hit to try to build something better, even at the cost of some bust risk.',
  },

  // ── Hard 15 ──────────────────────────────────────────────────
  'hard-15-low': {
    category: 'Hard Total',
    rule: 'Hard 15 vs dealer 2–6 → Stand',
    explanation:
      'Hard 15 against a dealer 2–6 is a "let the dealer bust" situation. The dealer\'s low '
      + 'upcard means they have a 35–42% chance of busting while drawing to 17. Any 7 or higher '
      + 'busts your 15, so patience is the right move — stand and hope the dealer goes over.',
  },
  'hard-15-strong': {
    category: 'Hard Total',
    rule: 'Hard 15 vs dealer 7+ → Hit',
    explanation:
      'Against a dealer 7 through Ace, hard 15 is one of the most difficult hands in blackjack. '
      + 'The dealer will make 17 or better most of the time, and your 15 loses to all of those. '
      + 'You must hit and accept the bust risk — standing is a guaranteed long-term loser here.',
  },

  // ── Hard 16 ──────────────────────────────────────────────────
  'hard-16-low': {
    category: 'Hard Total',
    rule: 'Hard 16 vs dealer 2–6 → Stand',
    explanation:
      'Hard 16 is the worst hand in blackjack, but against a dealer 2–6 standing is still correct. '
      + 'Only five card values (A–5) improve your hand without busting it. The dealer has a 35–42% '
      + 'bust chance with these low upcards, so your best strategy is to stand and let them bust.',
  },
  'hard-16-strong': {
    category: 'Hard Total',
    rule: 'Hard 16 vs dealer 7+ → Hit',
    explanation:
      'Hard 16 against a dealer 7 or higher is a pure damage-limitation situation. You will '
      + 'likely lose either way — but the dealer will make 17 or better most of the time, meaning '
      + 'standing with 16 is a near-certain loss. Hitting gives you a small but real chance to improve.',
  },

  // ── Hard 17+ ─────────────────────────────────────────────────
  'hard-17-always': {
    category: 'Hard Total',
    rule: 'Hard 17+ → Always Stand',
    explanation:
      'Hard 17 or more is a strong enough hand to stand on against any dealer upcard. '
      + 'If you draw another card, only an Ace, 2, or 3 helps you without busting — and those '
      + 'still only bring you to 18 or 19. The bust risk is far too high to justify drawing.',
  },
}

// ── SOFT TOTAL EXPLANATIONS ───────────────────────────────────
// Soft hands: Ace counted as 11. total = 11 + otherCard.

const SOFT_EXPLANATIONS = {

  // ── Soft 13 (A+2) ────────────────────────────────────────────
  'soft-13-weak': {
    category: 'Soft Total',
    rule: 'Soft 13 (A+2) vs dealer 5–6 → Double Down',
    explanation:
      'The Ace in your hand is a safety net — if you draw a 10, the Ace simply becomes 1, '
      + 'giving you 13 (a hard total) instead of busting. Against a dealer 5 or 6 (the two worst '
      + 'bust cards), double down to capitalise on the dealer\'s vulnerability while you can\'t bust.',
  },
  'soft-13-other': {
    category: 'Soft Total',
    rule: 'Soft 13 (A+2) vs dealer 2–4 or 7+ → Hit',
    explanation:
      'Soft 13 is a weak hand — just 13 points unless you draw well. Against dealer cards '
      + 'where doubling isn\'t profitable, simply hit. The Ace protects you: drawing a 10 gives you '
      + 'hard 13, which you can continue to play. Keep drawing until you build a competitive total.',
  },

  // ── Soft 14 (A+3) ────────────────────────────────────────────
  'soft-14-weak': {
    category: 'Soft Total',
    rule: 'Soft 14 (A+3) vs dealer 5–6 → Double Down',
    explanation:
      'Against a dealer 5 or 6, the dealer has the highest bust rate in the game (over 40%). '
      + 'Your Ace ensures you can\'t bust on one card, making this an ideal time to double. '
      + 'Put twice the money down when the dealer is most vulnerable.',
  },
  'soft-14-other': {
    category: 'Soft Total',
    rule: 'Soft 14 (A+3) vs dealer 2–4 or 7+ → Hit',
    explanation:
      'Soft 14 isn\'t strong enough to double against a dealer 2–4 or 7+, since those dealers '
      + 'complete stronger hands more reliably. Just hit — your Ace means you cannot bust in one '
      + 'draw, and you may land a card that transforms this into a powerful total.',
  },

  // ── Soft 15 (A+4) ────────────────────────────────────────────
  'soft-15-weak': {
    category: 'Soft Total',
    rule: 'Soft 15 (A+4) vs dealer 4–6 → Double Down',
    explanation:
      'The dealer is showing one of their three weakest bust cards (4, 5, or 6). Your soft 15 '
      + 'cannot bust in one draw thanks to the Ace — if you pull a 10-value card you simply have '
      + 'hard 15, not 25. This is an excellent spot to double and profit from the dealer\'s weakness.',
  },
  'soft-15-other': {
    category: 'Soft Total',
    rule: 'Soft 15 (A+4) vs dealer 2–3 or 7+ → Hit',
    explanation:
      'Against a dealer 2, 3, or 7 through Ace, the doubling edge disappears. Hit instead '
      + 'and use your Ace\'s flexibility to build a better total. Drawing a 6 gives you 21; '
      + 'even drawing a 10 leaves you with hard 15 to keep playing. Never stand on soft 15.',
  },

  // ── Soft 16 (A+5) ────────────────────────────────────────────
  'soft-16-weak': {
    category: 'Soft Total',
    rule: 'Soft 16 (A+5) vs dealer 4–6 → Double Down',
    explanation:
      'Dealer 4, 5, and 6 are the most dangerous upcards for the dealer — they face a 40–42% '
      + 'bust rate. Your Ace provides a safety cushion against any single card, so double '
      + 'confidently. You are putting more money on the table when the odds most favour you.',
  },
  'soft-16-other': {
    category: 'Soft Total',
    rule: 'Soft 16 (A+5) vs dealer 2–3 or 7+ → Hit',
    explanation:
      'Soft 16 against a non-bust dealer is simply a drawing hand. Hit freely — your Ace '
      + 'absorbs a 10-value card by dropping to 1, turning soft 16 into hard 16. A 5 card '
      + 'gives you 21. Keep hitting until you reach at least 17 or the dealer is more vulnerable.',
  },

  // ── Soft 17 (A+6) ────────────────────────────────────────────
  'soft-17-weak': {
    category: 'Soft Total',
    rule: 'Soft 17 (A+6) vs dealer 3–6 → Double Down',
    explanation:
      'Never stand on soft 17 — it looks like 17, but it is actually a weak hand you should '
      + 'always improve. Against a dealer 3–6, double down. The dealer bust rate is 37–42% '
      + 'with those upcards, and your Ace ensures any card leaves you at hard 17 or better.',
  },
  'soft-17-other': {
    category: 'Soft Total',
    rule: 'Soft 17 (A+6) vs dealer 2 or 7+ → Hit',
    explanation:
      'Soft 17 must always be played as a drawing hand — never stand on it. Against a dealer '
      + '2 or 7+, hit rather than double. A 10-value card turns it into hard 17, which you then '
      + 'stand on. A 4 gives you 21. The Ace prevents you from busting on the first draw.',
  },

  // ── Soft 18 (A+7) ────────────────────────────────────────────
  'soft-18-weak': {
    category: 'Soft Total',
    rule: 'Soft 18 (A+7) vs dealer 3–6 → Double Down',
    explanation:
      'Soft 18 is a good hand, but it is even better as a doubling opportunity against a '
      + 'vulnerable dealer. Against a dealer 3–6, double down. You already have 18; '
      + 'any Ace–3 improves you to 19–21, and a 10-value card still leaves you with a hard 18. '
      + 'The dealer will bust frequently, making doubling highly profitable here.',
  },
  'soft-18-stand': {
    category: 'Soft Total',
    rule: 'Soft 18 (A+7) vs dealer 2, 7, or 8 → Stand',
    explanation:
      'Against a dealer 2, 7, or 8, soft 18 is a strong enough hand to stand on. '
      + 'An 18 beats a dealer 17 and ties an 18. Hitting risks turning your comfortable 18 '
      + 'into a weaker hard total. Stand and let the dealer play out — you are in a good position.',
  },
  'soft-18-strong': {
    category: 'Soft Total',
    rule: 'Soft 18 (A+7) vs dealer 9, 10, or Ace → Hit',
    explanation:
      'Against a dealer 9, 10, or Ace, soft 18 is actually a slight underdog — the dealer '
      + 'will reach 19, 20, or 21 very often. Hit to try to improve to 19, 20, or 21. '
      + 'Drawing a 3 gives you 21; a 2 gives you 20. Your Ace absorbs a 10-value card, keeping '
      + 'you safe from an immediate bust.',
  },

  // ── Soft 19 (A+8) ────────────────────────────────────────────
  'soft-19-always': {
    category: 'Soft Total',
    rule: 'Soft 19 (A+8) → Always Stand',
    explanation:
      'Soft 19 is a very strong hand — stand on it against every dealer upcard. '
      + 'Only a dealer 20 or 21 beats you outright, and the dealer makes those less than half '
      + 'the time. Any card you draw risks reducing this excellent hand; the only correct play is to stand.',
  },

  // ── Soft 20 (A+9) ────────────────────────────────────────────
  'soft-20-always': {
    category: 'Soft Total',
    rule: 'Soft 20 (A+9) → Always Stand',
    explanation:
      'Soft 20 is 20 points — one of the strongest possible hands. Only a dealer blackjack '
      + 'or 21 beats it, and those happen a small fraction of the time. '
      + 'Never split, hit, or deviate in any way. Stand every single time.',
  },
}

// ── PAIR SPLITTING EXPLANATIONS ───────────────────────────────
// One entry per (pairRank, dealer situation) combination.

const PAIR_EXPLANATIONS = {

  // ── Pair of 2s ───────────────────────────────────────────────
  'pair-2-split': {
    category: 'Pair Splitting',
    rule: 'Pair of 2s vs dealer 2–7 → Split',
    explanation:
      'Two 2s make hard 4 — a harmless starting total on its own. Split them when the dealer '
      + 'shows 2 through 7. Each 2 can draw a 9 to make 11, a great total to build from. '
      + 'The dealer\'s moderate bust rate in this range means splitting creates two small but '
      + 'real chances to win instead of one neutral hand.',
  },
  'pair-2-hit': {
    category: 'Pair Splitting',
    rule: 'Pair of 2s vs dealer 8–Ace → Hit',
    explanation:
      'Against a dealer 8, 9, 10, or Ace, the dealer is too strong to split into. '
      + 'Starting two new hands from a 2 each against a powerful dealer is a losing proposition. '
      + 'Instead, play the pair as hard 4 and hit — you cannot bust with this total, '
      + 'so keep drawing until you have something competitive.',
  },

  // ── Pair of 3s ───────────────────────────────────────────────
  'pair-3-split': {
    category: 'Pair Splitting',
    rule: 'Pair of 3s vs dealer 2–7 → Split',
    explanation:
      'Similar to 2s, a pair of 3s is hard 6 — fine to draw on, but splitting is better '
      + 'against dealer 2–7. Each 3 has a chance to grow into a strong hand: draw an 8 and you '
      + 'have 11, a perfect doubling situation. Against these dealer upcards, splitting two '
      + 'independent chances to win beats playing a single hard 6.',
  },
  'pair-3-hit': {
    category: 'Pair Splitting',
    rule: 'Pair of 3s vs dealer 8–Ace → Hit',
    explanation:
      'Do not split 3s against a dealer 8 or higher. The dealer is likely to make a strong '
      + 'hand, and starting two weak hands from 3 each would likely mean losing double the money. '
      + 'Play the pair as hard 6 and hit freely — you cannot bust from 6, '
      + 'so build the best hand you can with one bet at risk.',
  },

  // ── Pair of 4s ───────────────────────────────────────────────
  'pair-4-split': {
    category: 'Pair Splitting',
    rule: 'Pair of 4s vs dealer 5–6 → Split',
    explanation:
      'Normally you play 4s as hard 8, but against the very weakest dealer upcards (5 and 6) '
      + 'splitting is correct. The dealer is most likely to bust with these cards (40–42%), '
      + 'and a 4 starting hand can easily become 11, 14, or 18 with one more draw. '
      + 'Splitting creates two chances to profit from the dealer\'s worst situation.',
  },
  'pair-4-hit': {
    category: 'Pair Splitting',
    rule: 'Pair of 4s vs dealer 2–4 or 7+ → Hit',
    explanation:
      'Against all dealer cards other than 5 or 6, play the pair of 4s as hard 8 and hit. '
      + 'Hard 8 is a decent drawing hand — you cannot bust, and a 3 gives you 11 (great for '
      + 'doubling), a 2 gives you 10 (also strong). Splitting into two hands of 4 each is not '
      + 'profitable enough against dealers who are likely to make strong totals.',
  },

  // ── Pair of 5s ───────────────────────────────────────────────
  'pair-5-double': {
    category: 'Pair Splitting',
    rule: 'Pair of 5s vs dealer 2–9 → Double Down (as Hard 10)',
    explanation:
      'Never split 5s — this is one of the most important rules in basic strategy. '
      + 'Two 5s equal hard 10, one of the best doubling hands in the game. '
      + 'Splitting would create two hands each starting from 5, which is a '
      + 'mediocre position. Instead, double down on hard 10 and take one powerful card.',
  },
  'pair-5-hit': {
    category: 'Pair Splitting',
    rule: 'Pair of 5s vs dealer 10 or Ace → Hit (as Hard 10)',
    explanation:
      'Never split 5s — always play them as hard 10. Against a dealer 10 or Ace, '
      + 'doubling is too risky (they may already have a strong hand), so just hit. '
      + 'Hard 10 is still an excellent starting total — any 10-value card gives you 20. '
      + 'Splitting into two 5s would be a costly mistake here.',
  },

  // ── Pair of 6s ───────────────────────────────────────────────
  'pair-6-split': {
    category: 'Pair Splitting',
    rule: 'Pair of 6s vs dealer 2–6 → Split',
    explanation:
      'Hard 12 (a pair of 6s played together) is a losing hand — any 10-value card busts it. '
      + 'Against a dealer 2–6, split the 6s. Each 6 can grow into a strong hand, and with '
      + 'the dealer showing bust-prone cards, you have a real chance of winning both hands. '
      + 'Trading one bad hand for two improvable ones is the right move.',
  },
  'pair-6-hit': {
    category: 'Pair Splitting',
    rule: 'Pair of 6s vs dealer 7+ → Hit (as Hard 12)',
    explanation:
      'Against a dealer 7 or higher, do not split 6s. The dealer is likely to make a strong '
      + 'hand, and launching two separate hands from 6 each is not profitable. '
      + 'Play the pair as hard 12 and hit — even though hitting 12 is uncomfortable, '
      + 'it is better than splitting into two weak hands against a powerful dealer.',
  },

  // ── Pair of 7s ───────────────────────────────────────────────
  'pair-7-split': {
    category: 'Pair Splitting',
    rule: 'Pair of 7s vs dealer 2–7 → Split',
    explanation:
      'Hard 14 is a poor hand against most dealers. Split 7s when the dealer shows 2 through 7. '
      + 'A 7 is a decent starting card — draw a 3 and you have 10, a 4 gives you 11, '
      + 'or draw an Ace for soft 18. Against these dealer cards the bust rate is meaningful, '
      + 'and two 7-based hands beat one hard 14.',
  },
  'pair-7-hit': {
    category: 'Pair Splitting',
    rule: 'Pair of 7s vs dealer 8–Ace → Hit (as Hard 14)',
    explanation:
      'Do not split 7s against a dealer 8, 9, 10, or Ace. The dealer is likely to make '
      + '18, 19, 20, or 21, which beats a pair of 7-based hands most of the time. '
      + 'Play as hard 14 and hit — you must try to improve your total because standing '
      + 'on 14 against a strong dealer is a near-guaranteed loss.',
  },

  // ── Pair of 8s ───────────────────────────────────────────────
  'pair-8-always': {
    category: 'Pair Splitting',
    rule: 'Pair of 8s → Always Split',
    explanation:
      'Always split 8s — no exceptions, even against a dealer 10 or Ace. '
      + 'Hard 16 is the single worst hand in blackjack: you cannot stand (dealer likely beats you) '
      + 'and you cannot hit without a high bust risk. Each individual 8 is a much better starting '
      + 'point — draw a 3 for 11 (ideal), a 2 for 10, or an Ace for soft 19. '
      + 'Splitting transforms a hopeless hand into two manageable ones.',
  },

  // ── Pair of 9s ───────────────────────────────────────────────
  'pair-9-split': {
    category: 'Pair Splitting',
    rule: 'Pair of 9s vs dealer 2–6, 8, or 9 → Split',
    explanation:
      'Hard 18 seems good, but 18 is only slightly ahead in the long run. '
      + 'Splitting 9s against these dealer upcards is more profitable. Each 9 is an excellent '
      + 'starting point — draw a 10-value card for 19, an Ace for soft 20, or a 2 for 11. '
      + 'Against a 2–6, 8, or 9, two hands starting from 9 each outperform one hard 18.',
  },
  'pair-9-stand': {
    category: 'Pair Splitting',
    rule: 'Pair of 9s vs dealer 7, 10, or Ace → Stand',
    explanation:
      'Keep your hard 18 and stand against a dealer 7, 10, or Ace. '
      + 'Against a dealer 7, you already beat their most likely outcome (17). '
      + 'Against a dealer 10 or Ace, the dealer will often make 20 or 21 — splitting into '
      + 'two 9-based hands puts twice the money at risk against the dealer\'s strongest totals. '
      + 'Hard 18 is the safer choice here.',
  },

  // ── Pair of 10s ──────────────────────────────────────────────
  'pair-10-always': {
    category: 'Pair Splitting',
    rule: 'Pair of 10s → Never Split',
    explanation:
      'Hard 20 wins roughly 96% of hands — never split 10s under any circumstances. '
      + 'Splitting trades a near-guaranteed winner for two uncertain hands, each starting from '
      + 'a single 10-value card. No dealer upcard makes splitting 10s correct. '
      + 'Stand on 20 and collect your win.',
  },

  // ── Pair of Aces ─────────────────────────────────────────────
  'pair-11-always': {
    category: 'Pair Splitting',
    rule: 'Pair of Aces → Always Split',
    explanation:
      'Always split Aces — no exceptions, against every dealer upcard. '
      + 'Two Aces together make soft 12 (or hard 2), which is almost unplayable. '
      + 'Splitting gives each Ace a chance to become 21: any 10-value card (and there are '
      + '16 per deck) makes blackjack or a natural 21. '
      + 'This is the most valuable split in the game.',
  },
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC EXPLANATION LOOKUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Look up the explanation for a hard total scenario.
 * @param {number} total       - player's hard total (5–17+)
 * @param {string} dealerUpcard
 * @param {string} action      - 'H' | 'S' | 'D'
 */
export function getHardExplanation(total, dealerUpcard, action) {
  const d = dealerUpcard
  const group = dealerGroup(d)

  if (total <= 8)  return { ...HARD_EXPLANATIONS['hard-low-always'],  rule: `Hard ${total} → Always Hit` }
  if (total >= 17) return { ...HARD_EXPLANATIONS['hard-17-always'],   rule: `Hard ${total} → Always Stand` }

  if (total === 9) {
    return group === 'weak'
      ? HARD_EXPLANATIONS['hard-9-weak']
      : HARD_EXPLANATIONS['hard-9-other']
  }

  if (total === 10) {
    return (group === 'strong' && ['10','A'].includes(d))
      ? HARD_EXPLANATIONS['hard-10-strong']
      : HARD_EXPLANATIONS['hard-10-weak']
  }

  if (total === 11) {
    return d === 'A'
      ? HARD_EXPLANATIONS['hard-11-ace']
      : HARD_EXPLANATIONS['hard-11-nodlr-ace']
  }

  if (total === 12) {
    return (action === 'S')
      ? HARD_EXPLANATIONS['hard-12-weak']
      : HARD_EXPLANATIONS['hard-12-other']
  }

  const standGroups = { 13: 'hard-13', 14: 'hard-14', 15: 'hard-15', 16: 'hard-16' }
  if (standGroups[total]) {
    const base = standGroups[total]
    return (action === 'S')
      ? HARD_EXPLANATIONS[`${base}-low`]
      : HARD_EXPLANATIONS[`${base}-strong`]
  }

  // Fallback (should not be reached with valid inputs)
  return {
    category: 'Hard Total',
    rule: `Hard ${total} vs dealer ${d}`,
    explanation: `With hard ${total} against a dealer ${d}, follow the strategy table.`,
  }
}

/**
 * Look up the explanation for a soft total scenario.
 * @param {number} total        - soft total (13–20), Ace = 11
 * @param {string} dealerUpcard
 * @param {string} action       - 'H' | 'S' | 'D'
 */
export function getSoftExplanation(total, dealerUpcard, action) {
  const d = dealerUpcard
  const group = dealerGroup(d)

  if (total <= 12 || total >= 21) {
    return {
      category: 'Soft Total',
      rule: `Soft ${total} → Always Hit`,
      explanation: `Soft ${total} is too low to stand on. Hit freely — the Ace protects you from busting on one draw.`,
    }
  }

  if (total === 20) return SOFT_EXPLANATIONS['soft-20-always']
  if (total === 19) return SOFT_EXPLANATIONS['soft-19-always']

  if (total === 18) {
    if (action === 'D') return SOFT_EXPLANATIONS['soft-18-weak']
    if (action === 'S') return SOFT_EXPLANATIONS['soft-18-stand']
    return SOFT_EXPLANATIONS['soft-18-strong']
  }

  if (total === 17) {
    return (action === 'D')
      ? SOFT_EXPLANATIONS['soft-17-weak']
      : SOFT_EXPLANATIONS['soft-17-other']
  }

  if (total === 16) {
    return (action === 'D')
      ? SOFT_EXPLANATIONS['soft-16-weak']
      : SOFT_EXPLANATIONS['soft-16-other']
  }

  if (total === 15) {
    return (action === 'D')
      ? SOFT_EXPLANATIONS['soft-15-weak']
      : SOFT_EXPLANATIONS['soft-15-other']
  }

  if (total === 14) {
    return (action === 'D')
      ? SOFT_EXPLANATIONS['soft-14-weak']
      : SOFT_EXPLANATIONS['soft-14-other']
  }

  if (total === 13) {
    return (action === 'D')
      ? SOFT_EXPLANATIONS['soft-13-weak']
      : SOFT_EXPLANATIONS['soft-13-other']
  }

  // Fallback
  return {
    category: 'Soft Total',
    rule: `Soft ${total} vs dealer ${d}`,
    explanation: `With soft ${total} against a dealer ${d}, follow the strategy table.`,
  }
}

/**
 * Look up the explanation for a pair-splitting scenario.
 * @param {number} pairRank     - numeric rank (2–11, where 11 = Ace, 10 = face cards)
 * @param {string} dealerUpcard
 * @param {string} action       - 'H' | 'S' | 'D' | 'P'
 */
export function getPairExplanation(pairRank, dealerUpcard, action) {
  const d = dealerUpcard

  if (pairRank === 11) return PAIR_EXPLANATIONS['pair-11-always']
  if (pairRank === 10) return PAIR_EXPLANATIONS['pair-10-always']
  if (pairRank === 8)  return PAIR_EXPLANATIONS['pair-8-always']

  if (pairRank === 9) {
    return (action === 'P')
      ? PAIR_EXPLANATIONS['pair-9-split']
      : PAIR_EXPLANATIONS['pair-9-stand']
  }

  if (pairRank === 7) {
    return (action === 'P')
      ? PAIR_EXPLANATIONS['pair-7-split']
      : PAIR_EXPLANATIONS['pair-7-hit']
  }

  if (pairRank === 6) {
    return (action === 'P')
      ? PAIR_EXPLANATIONS['pair-6-split']
      : PAIR_EXPLANATIONS['pair-6-hit']
  }

  if (pairRank === 5) {
    return (action === 'D')
      ? PAIR_EXPLANATIONS['pair-5-double']
      : PAIR_EXPLANATIONS['pair-5-hit']
  }

  if (pairRank === 4) {
    return (action === 'P')
      ? PAIR_EXPLANATIONS['pair-4-split']
      : PAIR_EXPLANATIONS['pair-4-hit']
  }

  if (pairRank === 3) {
    return (action === 'P')
      ? PAIR_EXPLANATIONS['pair-3-split']
      : PAIR_EXPLANATIONS['pair-3-hit']
  }

  if (pairRank === 2) {
    return (action === 'P')
      ? PAIR_EXPLANATIONS['pair-2-split']
      : PAIR_EXPLANATIONS['pair-2-hit']
  }

  // Fallback
  return {
    category: 'Pair Splitting',
    rule: `Pair of ${pairRank}s vs dealer ${d}`,
    explanation: `With a pair of ${pairRank}s against a dealer ${d}, follow the strategy table.`,
  }
}
