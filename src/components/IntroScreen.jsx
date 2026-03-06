/**
 * IntroScreen.jsx — Polished landing screen with animated card fan
 */
import React, { useEffect, useState } from 'react'
import { PlayingCard } from './HandDisplay.jsx'

const LEGEND = [
  { code: 'H', label: 'Hit',    desc: 'Take another card',        color: '#e74c3c' },
  { code: 'S', label: 'Stand',  desc: 'Keep your current hand',   color: '#2ecc71' },
  { code: 'D', label: 'Double', desc: 'Double bet, take one card', color: '#f39c12' },
  { code: 'P', label: 'Split',  desc: 'Split a pair into 2 hands', color: '#3498db' },
]

// Fan of 5 decorative cards
const FAN_CARDS = [
  { rank: 'A', suit: '♠', rotate: -24, tx: -60, ty: 8 },
  { rank: 'K', suit: '♥', rotate: -12, tx: -28, ty: 2 },
  { rank: 'Q', suit: '♦', rotate: 0,   tx: 0,   ty: 0 },
  { rank: 'J', suit: '♣', rotate: 12,  tx: 28,  ty: 2 },
  { rank: '10',suit: '♥', rotate: 24,  tx: 60,  ty: 8 },
]

export default function IntroScreen({ onStart }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  return (
    <div className="screen intro-screen">
      {/* Ambient glow */}
      <div className="intro-glow" />

      <div className={`intro-card ${ready ? 'intro-card--visible' : ''}`}>

        {/* Card fan */}
        <div className="card-fan" aria-hidden>
          {FAN_CARDS.map((c, i) => (
            <div key={i} className="fan-card" style={{
              '--rotate': `${c.rotate}deg`,
              '--tx': `${c.tx}px`,
              '--ty': `${c.ty}px`,
              '--fan-delay': `${i * 80}ms`,
            }}>
              <PlayingCard rank={c.rank} suit={c.suit} size="sm" />
            </div>
          ))}
        </div>

        {/* Title block */}
        <div className="intro-title-block">
          <h1 className="intro-title">Basic Strategy</h1>
          <p className="intro-subtitle">Blackjack Trainer</p>
        </div>

        {/* Description */}
        <p className="intro-desc">
          Sharpen your decisions with <strong>20 random hands</strong>. 
          Each scenario covers pairs, soft totals, and hard totals — 
          the full spectrum of casino basic strategy.
        </p>

        {/* Legend */}
        <div className="intro-legend">
          {LEGEND.map((item) => (
            <div key={item.code} className="legend-row">
              <div className="legend-dot" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}88` }} />
              <span className="legend-label">{item.label}</span>
              <span className="legend-desc">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="start-btn" onClick={onStart}>
          <span>Deal Me In</span>
          <span className="start-btn__arrow">→</span>
        </button>

        <p className="intro-note">Keyboard shortcuts: H · S · D · P</p>
      </div>
    </div>
  )
}
