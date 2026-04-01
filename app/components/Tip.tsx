'use client'
import { useState } from 'react'

export default function Tip({ text, pos = 'top' }: { text: string; pos?: 'top' | 'bottom' }) {
  const [show, setShow] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', marginLeft: '4px' }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={(e) => { e.stopPropagation(); setShow(s => !s) }}
        style={{
          width: '15px', height: '15px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
          color: '#888', fontSize: '9px', fontWeight: 800,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, fontFamily: 'inherit', flexShrink: 0, lineHeight: 1,
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = '#00e676'; e.currentTarget.style.color = '#00e676' }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#888'; setShow(false) }}
      >?</button>
      {show && (
        <span style={{
          position: 'absolute',
          ...(pos === 'top' ? { bottom: '22px' } : { top: '22px' }),
          left: '50%', transform: 'translateX(-50%)',
          background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px', padding: '9px 12px',
          fontSize: '12px', color: '#ccc', lineHeight: 1.55,
          width: '210px', zIndex: 9999, textAlign: 'left',
          boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
          whiteSpace: 'normal', pointerEvents: 'none',
        }}>
          {text}
          <span style={{
            position: 'absolute',
            ...(pos === 'top' ? { bottom: '-5px' } : { top: '-5px' }),
            left: '50%',
            width: '8px', height: '8px',
            background: '#1c1c1c',
            border: '1px solid rgba(255,255,255,0.12)',
            borderTop: pos === 'top' ? 'none' : undefined,
            borderLeft: pos === 'top' ? 'none' : undefined,
            borderBottom: pos === 'bottom' ? 'none' : undefined,
            borderRight: pos === 'bottom' ? 'none' : undefined,
            transform: 'translateX(-50%) rotate(45deg)',
            display: 'block',
          }}/>
        </span>
      )}
    </span>
  )
}
