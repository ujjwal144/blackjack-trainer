/**
 * HandDisplay.jsx
 * Rich playing card visuals with staggered deal animation
 */
import React from 'react'

// ── Suit SVG paths (crisp at any size) ───────────────────────
const SUIT_DATA = {
  '♠': { d: 'M12 2C9 6 2 10 2 15c0 3 2.5 5 5.5 4.5C6 22 4 24 2 25h20c-2-1-4-3-5.5-5.5C19.5 20 22 18 22 15c0-5-7-9-10-13z', fill: '#1c1c2e' },
  '♥': { d: 'M12 21C12 21 2 14 2 8c0-3.3 2.7-6 6-6 1.9 0 3.5 1 4 2.2C12.5 3 14.1 2 16 2c3.3 0 6 2.7 6 6 0 6-10 13-10 13z', fill: '#c0392b' },
  '♦': { d: 'M12 2L22 12 12 22 2 12z', fill: '#c0392b' },
  '♣': { d: 'M12 19c0 0-2.5 2-4 5h8c-1.5-3-4-5-4-5zM5 9c-2.2 0-4 1.8-4 4s1.8 4 4 4c1.2 0 2.2-.5 3-1.3-.3.8-.5 1.8-.5 2.8h8.9c0-1 -.2-2-.5-2.8.8.8 1.8 1.3 3 1.3 2.2 0 4-1.8 4-4s-1.8-4-4-4c-1.2 0-2.3.5-3.1 1.4C16.7 9.5 17 8.3 17 7c0-2.8-2.2-5-5-5S7 4.2 7 7c0 1.3.3 2.5.9 3.4C7.1 9.5 6.1 9 5 9z', fill: '#1c1c2e' },
}

function SuitSVG({ suit, size }) {
  const s = SUIT_DATA[suit]
  if (!s) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <path d={s.d} fill={s.fill} />
    </svg>
  )
}

// ── Card Back ─────────────────────────────────────────────────
function CardBack({ w, h }) {
  const br = Math.round(w * 0.1)
  return (
    <div style={{
      width: w, height: h, borderRadius: br, flexShrink: 0,
      background: 'linear-gradient(145deg, #0d1f3c 0%, #091528 100%)',
      border: '2.5px solid #c9a84c',
      boxShadow: '0 10px 30px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.4)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg,
          rgba(201,168,76,0.06) 0, rgba(201,168,76,0.06) 1.5px,
          transparent 1.5px, transparent 10px)`,
      }} />
      <div style={{ position: 'absolute', inset: 6, border: '1px solid rgba(201,168,76,0.3)', borderRadius: br - 3 }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) rotate(45deg)',
        width: w * 0.28, height: w * 0.28,
        background: 'rgba(201,168,76,0.1)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 2,
      }} />
    </div>
  )
}

// ── Card Face ─────────────────────────────────────────────────
function CardFace({ rank, suit, w, h }) {
  const br = Math.round(w * 0.1)
  const isRed = suit === '♥' || suit === '♦'
  const color = isRed ? '#c0392b' : '#1c1c2e'
  const rankSize = w * 0.27
  const smallSuit = w * 0.2
  const bigSuit = w * 0.55

  return (
    <div style={{
      width: w, height: h, borderRadius: br, flexShrink: 0,
      background: 'linear-gradient(155deg, #fffef6 0%, #f7edda 100%)',
      border: '2.5px solid #d9c99a',
      boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.95)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: `${w * 0.08}px ${w * 0.09}px`,
      color,
    }}>
      {/* Subtle inner vignette */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: br - 2,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,220,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top-left */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, position: 'relative' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: rankSize, lineHeight: 0.9, color }}>
          {rank}
        </span>
        <SuitSVG suit={suit} size={smallSuit} />
      </div>

      {/* Center watermark */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.07 }}>
        <SuitSVG suit={suit} size={bigSuit} />
      </div>

      {/* Bottom-right (rotated) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, transform: 'rotate(180deg)', position: 'relative' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: rankSize, lineHeight: 0.9, color }}>
          {rank}
        </span>
        <SuitSVG suit={suit} size={smallSuit} />
      </div>
    </div>
  )
}

// ── Public PlayingCard ────────────────────────────────────────
export function PlayingCard({ rank, suit, faceDown = false, size = 'md' }) {
  const sizes = { sm: [64, 90], md: [84, 118], lg: [100, 140] }
  const [w, h] = sizes[size] || sizes.md
  if (faceDown) return <CardBack w={w} h={h} />
  return <CardFace rank={rank} suit={suit} w={w} h={h} />
}

// ── Section divider label ─────────────────────────────────────
function Label({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
    }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.25))' }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', whiteSpace: 'nowrap' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.25), transparent)' }} />
    </div>
  )
}

// ── Hand type badge ───────────────────────────────────────────
function Badge({ handType }) {
  if (handType === 'hard') return null
  const cfg = {
    soft: { label: 'Soft', bg: 'rgba(56,152,236,0.18)', border: 'rgba(56,152,236,0.38)', color: '#6ab8f5' },
    pair: { label: 'Pair', bg: 'rgba(201,168,76,0.14)', border: 'rgba(201,168,76,0.38)', color: '#e8c87a' },
  }[handType]
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
      padding: '3px 9px', borderRadius: 20, marginLeft: 8,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
    }}>{cfg.label}</span>
  )
}

// ── Main export ───────────────────────────────────────────────
export default function HandDisplay({ scenario, feedbackState }) {
  if (!scenario) return null
  const { handType, dealerCardDisplay, playerCardsDisplay } = scenario

  const tableShadow = feedbackState === 'correct'
    ? 'inset 0 0 80px rgba(45,179,110,0.1), 0 12px 40px rgba(0,0,0,0.5)'
    : feedbackState === 'wrong'
    ? 'inset 0 0 80px rgba(217,59,59,0.1), 0 12px 40px rgba(0,0,0,0.5)'
    : '0 12px 40px rgba(0,0,0,0.5)'

  return (
    <div style={{
      width: '100%', borderRadius: 20, padding: '28px 20px',
      background: 'rgba(0,0,0,0.32)',
      border: '1px solid rgba(201,168,76,0.16)',
      boxShadow: tableShadow,
      transition: 'box-shadow 0.5s ease',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Felt dot texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 20,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.013) 1px, transparent 1px)`,
        backgroundSize: '8px 8px',
      }} />

      {/* Dealer row */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Label>Dealer Shows</Label>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <div className="card-deal" style={{ '--delay': '0ms' }}>
            <PlayingCard rank={dealerCardDisplay.rank} suit={dealerCardDisplay.suit} />
          </div>
          <div className="card-deal" style={{ '--delay': '90ms' }}>
            <PlayingCard faceDown />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, margin: '0 0 24px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

      {/* Player row */}
      <div style={{ position: 'relative' }}>
        <Label>
          Your Hand <Badge handType={handType} />
        </Label>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {playerCardsDisplay.map((card, i) => (
            <div key={i} className="card-deal" style={{ '--delay': `${170 + i * 90}ms` }}>
              <PlayingCard rank={card.rank} suit={card.suit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
