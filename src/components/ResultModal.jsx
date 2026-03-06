/**
 * ResultModal.jsx — Session summary with animated score reveal
 */
import React, { useEffect, useState } from 'react'
import { ACTION_LABELS } from '../data/strategy.js'

function gradeInfo(pct) {
  if (pct >= 95) return { label: 'Expert',         emoji: '🏆', color: '#e8c87a' }
  if (pct >= 80) return { label: 'Sharp',           emoji: '🎯', color: '#2ecc71' }
  if (pct >= 65) return { label: 'Improving',       emoji: '📈', color: '#f39c12' }
  return              { label: 'Keep Practising',   emoji: '📚', color: '#e74c3c' }
}

function BreakdownBar({ label, history }) {
  const [width, setWidth] = useState(0)
  const items = history.filter(h => h.scenario.handType === label.toLowerCase())
  const ok = items.filter(h => h.isCorrect).length
  const pct = items.length > 0 ? Math.round((ok / items.length) * 100) : null

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct ?? 0), 300)
    return () => clearTimeout(t)
  }, [pct])

  if (items.length === 0) return null
  const barColor = pct >= 80 ? '#2ecc71' : pct >= 60 ? '#f39c12' : '#e74c3c'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 38px 36px', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.45)', fontFamily: "'Outfit', sans-serif" }}>
        {label}
      </span>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${width}%`, background: barColor, borderRadius: 3, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)', boxShadow: `0 0 6px ${barColor}88` }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, color: barColor, textAlign: 'right', fontFamily: "'Outfit', sans-serif" }}>{pct}%</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'right', fontFamily: "'Outfit', sans-serif" }}>{ok}/{items.length}</span>
    </div>
  )
}

function MistakeItem({ entry, index }) {
  const { scenario, chosenAction, correctAction } = entry
  const { handType, playerCards, dealerUpcard } = scenario
  const prefix = handType === 'soft' ? 'Soft ' : handType === 'pair' ? 'Pair ' : ''

  return (
    <div className="mistake-row" style={{ animationDelay: `${index * 40}ms` }}>
      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
        {prefix}{playerCards.join('+')} vs {dealerUpcard}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: 12, textDecoration: 'line-through', fontFamily: "'Outfit', sans-serif" }}>
          {ACTION_LABELS[chosenAction]}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>→</span>
        <span style={{ color: '#2ecc71', fontWeight: 800, fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
          {ACTION_LABELS[correctAction]}
        </span>
      </div>
    </div>
  )
}

export default function ResultModal({ totalHands, correct, history, onRestart }) {
  const [countUp, setCountUp] = useState(0)
  const accuracy = Math.round((correct / totalHands) * 100)
  const grade = gradeInfo(accuracy)

  // Animated count-up
  useEffect(() => {
    let start = 0
    const step = accuracy / 40
    const timer = setInterval(() => {
      start += step
      if (start >= accuracy) { setCountUp(accuracy); clearInterval(timer) }
      else setCountUp(Math.round(start))
    }, 25)
    return () => clearInterval(timer)
  }, [accuracy])

  const mistakes = history.filter(h => !h.isCorrect)

  return (
    <div className="screen result-screen">
      <div className="intro-glow" />
      <div className="result-card">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{grade.emoji}</div>
          <h2 className="result-title">Session Complete</h2>
          <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: grade.color, fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            {grade.label}
          </p>
        </div>

        {/* Big number */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700, fontSize: 80, lineHeight: 1,
            color: grade.color,
            textShadow: `0 0 40px ${grade.color}55`,
          }}>{countUp}%</span>
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28, fontFamily: "'Outfit', sans-serif" }}>
          {correct} correct out of {totalHands} hands
        </p>

        {/* Per-type breakdown */}
        <div style={{
          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(201,168,76,0.1)',
          borderRadius: 14, padding: 18, marginBottom: 20,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <BreakdownBar label="Hard" history={history} />
          <BreakdownBar label="Soft" history={history} />
          <BreakdownBar label="Pair" history={history} />
        </div>

        {/* Mistakes */}
        {mistakes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#2ecc71', fontSize: 14, marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>
            🎉 Perfect session — no mistakes!
          </p>
        ) : (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
              Review Mistakes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
              {mistakes.map((m, i) => <MistakeItem key={i} entry={m} index={i} />)}
            </div>
          </div>
        )}

        {/* Restart */}
        <button className="start-btn" onClick={onRestart} style={{ width: '100%' }}>
          <span>Play Again</span>
          <span className="start-btn__arrow">↺</span>
        </button>
      </div>
    </div>
  )
}
