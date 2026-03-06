/**
 * FeedbackBanner.jsx
 * ─────────────────────────────────────────────────────────────
 * Two distinct layouts:
 *
 *  CORRECT  → compact green toast with burst particles + auto-advance message
 *  INCORRECT → expanded "teaching card" showing:
 *               • correct action (large, gold)
 *               • strategy category badge
 *               • rule line
 *               • explanation paragraph
 *               • Next Hand button
 */
import React, { useEffect, useState } from 'react'
import { ACTION_LABELS } from '../data/strategy.js'

// ── Action colour map ─────────────────────────────────────────
const ACTION_COLORS = {
  H: { bg: 'rgba(231,76,60,0.15)',  border: 'rgba(231,76,60,0.5)',  text: '#e74c3c' },
  S: { bg: 'rgba(46,204,113,0.15)', border: 'rgba(46,204,113,0.5)', text: '#2ecc71' },
  D: { bg: 'rgba(243,156,18,0.15)', border: 'rgba(243,156,18,0.5)', text: '#f39c12' },
  P: { bg: 'rgba(52,152,219,0.15)', border: 'rgba(52,152,219,0.5)', text: '#3498db' },
}

// ── Category badge ────────────────────────────────────────────
const CATEGORY_STYLES = {
  'Hard Total':      { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' },
  'Soft Total':      { bg: 'rgba(52,152,219,0.15)',  color: '#71b8f0' },
  'Pair Splitting':  { bg: 'rgba(201,168,76,0.15)',  color: '#e8c87a' },
}

function CategoryBadge({ category }) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES['Hard Total']
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
      textTransform: 'uppercase', padding: '3px 10px',
      borderRadius: 20,
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.color}44`,
      fontFamily: "'Outfit', sans-serif",
    }}>{category}</span>
  )
}

// ── Burst particles (correct answer only) ────────────────────
function CorrectBurst() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit' }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className={`burst-particle burst-particle--${i}`} />
      ))}
    </div>
  )
}

// ── Correct toast ─────────────────────────────────────────────
function CorrectToast({ chosenAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', width: '100%' }}>
      <div className="feedback-icon feedback-icon--correct">✓</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 17, color: '#2ecc71', lineHeight: 1, marginBottom: 3, fontFamily: "'Outfit', sans-serif" }}>
          Correct!
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'Outfit', sans-serif" }}>
          {ACTION_LABELS[chosenAction]} — next hand loading…
        </div>
      </div>
    </div>
  )
}

// ── Incorrect teaching card ───────────────────────────────────
function IncorrectCard({ correctAction, chosenAction, category, rule, explanation, onNext }) {
  const actionColors = ACTION_COLORS[correctAction] ?? ACTION_COLORS.H

  return (
    <div style={{ width: '100%' }}>

      {/* ── Top row: icon + headline + chosen action ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div className="feedback-icon feedback-icon--wrong" style={{ flexShrink: 0 }}>✗</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 17, color: '#e74c3c', lineHeight: 1, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>
            Incorrect
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Outfit', sans-serif" }}>
            You chose <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{ACTION_LABELS[chosenAction]}</span>
          </div>
        </div>

        {/* Correct action pill — large and prominent */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: actionColors.bg,
          border: `1px solid ${actionColors.border}`,
          borderRadius: 12, padding: '8px 14px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'Outfit', sans-serif", marginBottom: 2 }}>
            Correct
          </span>
          <span style={{ fontSize: 20, fontWeight: 900, color: actionColors.text, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>
            {ACTION_LABELS[correctAction]}
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 14 }} />

      {/* ── Strategy detail block ── */}
      <div style={{ marginBottom: 16 }}>

        {/* Category + Rule line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <CategoryBadge category={category} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
            {rule}
          </span>
        </div>

        {/* Explanation */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10,
          padding: '11px 14px',
          fontSize: 13,
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.65,
          fontFamily: "'Outfit', sans-serif",
        }}>
          {explanation}
        </div>
      </div>

      {/* ── Next button ── */}
      <button className="next-btn" onClick={onNext} style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
        Got it — Next Hand →
      </button>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────
export default function FeedbackBanner({ feedback, onNext }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (feedback) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
    }
  }, [feedback])

  if (!feedback) return null

  const { isCorrect, correctAction, chosenAction, category, rule, explanation } = feedback

  return (
    <div className={`feedback-banner feedback-banner--${isCorrect ? 'correct' : 'wrong'} ${visible ? 'feedback-banner--visible' : ''}`}
      style={{
        // Incorrect card needs more padding for all the content
        padding: isCorrect ? '14px 16px' : '16px 18px',
        // Allow the incorrect card to grow taller
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      {isCorrect && <CorrectBurst />}

      {isCorrect
        ? <CorrectToast chosenAction={chosenAction} />
        : <IncorrectCard
            correctAction={correctAction}
            chosenAction={chosenAction}
            category={category}
            rule={rule}
            explanation={explanation}
            onNext={onNext}
          />
      }
    </div>
  )
}
