/**
 * ProgressBar.jsx — Session progress + score stats
 */
import React from 'react'

export default function ProgressBar({ handNumber, totalHands, correct }) {
  const progress = ((handNumber - 1) / totalHands) * 100
  const wrong = (handNumber - 1) - correct
  const accuracy = handNumber > 1 ? Math.round((correct / (handNumber - 1)) * 100) : null

  return (
    <div style={{ width: '100%' }}>
      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          fontSize: 13, fontWeight: 600, color: 'rgba(201,168,76,0.7)',
          fontFamily: "'Outfit', sans-serif", letterSpacing: 0.5,
        }}>
          Hand <strong style={{ color: '#e8c87a', fontSize: 15 }}>{handNumber}</strong>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}> / {totalHands}</span>
        </span>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {accuracy !== null && (
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif" }}>
              {accuracy}% accuracy
            </span>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color: '#2ecc71', fontFamily: "'Outfit', sans-serif" }}>
            ✓ {correct}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e74c3c', fontFamily: "'Outfit', sans-serif" }}>
            ✗ {wrong}
          </span>
        </div>
      </div>

      {/* Track */}
      <div style={{
        width: '100%', height: 6, borderRadius: 3,
        background: 'rgba(255,255,255,0.07)',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Correct segments */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: `${progress}%`,
          background: `linear-gradient(90deg, #c9a84c, #e8c87a)`,
          borderRadius: 3,
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 8px rgba(201,168,76,0.4)',
        }} />
      </div>
    </div>
  )
}
