/**
 * ActionButtons.jsx — Animated action buttons with shimmer + press effects
 */
import React, { useState } from 'react'

const ACTIONS = [
  { code: 'H', label: 'Hit',    sub: 'Take a card',    icon: '👆', gradient: ['#e74c3c', '#c0392b'], shadow: 'rgba(231,76,60,0.45)', border: 'rgba(231,76,60,0.6)'  },
  { code: 'S', label: 'Stand',  sub: 'Keep your hand', icon: '✋', gradient: ['#2ecc71', '#27ae60'], shadow: 'rgba(46,204,113,0.45)', border: 'rgba(46,204,113,0.6)' },
  { code: 'D', label: 'Double', sub: 'Double down',    icon: '×2', gradient: ['#f39c12', '#d68910'], shadow: 'rgba(243,156,18,0.45)',  border: 'rgba(243,156,18,0.6)'  },
  { code: 'P', label: 'Split',  sub: 'Split pair',     icon: '⟷',  gradient: ['#3498db', '#2980b9'], shadow: 'rgba(52,152,219,0.45)', border: 'rgba(52,152,219,0.6)'  },
]

function ActionBtn({ action, onAction, disabled }) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    if (disabled) return
    setPressed(true)
    setTimeout(() => setPressed(false), 200)
    onAction(action.code)
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 5, padding: '14px 8px',
        background: disabled
          ? `linear-gradient(160deg, ${action.gradient[0]}55, ${action.gradient[1]}44)`
          : `linear-gradient(160deg, ${action.gradient[0]}, ${action.gradient[1]})`,
        border: `1.5px solid ${disabled ? action.border + '44' : action.border}`,
        borderRadius: 14,
        boxShadow: disabled ? 'none'
          : pressed ? `0 2px 8px ${action.shadow}`
          : hovered ? `0 10px 28px ${action.shadow}, 0 2px 0 rgba(0,0,0,0.3)`
          : `0 5px 18px ${action.shadow}, 0 2px 0 rgba(0,0,0,0.3)`,
        transform: pressed ? 'translateY(2px) scale(0.97)'
          : hovered && !disabled ? 'translateY(-3px) scale(1.02)'
          : 'translateY(0) scale(1)',
        transition: 'transform 0.12s ease, box-shadow 0.15s ease, opacity 0.2s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        outline: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Shimmer layer */}
      {!disabled && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
          transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.5s ease',
          pointerEvents: 'none',
        }} />
      )}
      {/* Top highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)',
        borderRadius: '14px 14px 0 0', pointerEvents: 'none',
      }} />

      <span style={{ fontSize: 20, lineHeight: 1 }}>{action.icon}</span>
      <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
        {action.label}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}>
        {action.sub}
      </span>
    </button>
  )
}

export default function ActionButtons({ handType, onAction, disabled }) {
  const visible = ACTIONS.filter(a => a.code !== 'P' || handType === 'pair')
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${visible.length}, 1fr)`,
      gap: 10, width: '100%',
    }}>
      {visible.map(a => (
        <ActionBtn key={a.code} action={a} onAction={onAction} disabled={disabled} />
      ))}
    </div>
  )
}
