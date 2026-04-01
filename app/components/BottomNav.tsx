'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BottomNav({ activePage, onDeposit }: { activePage: 'home'|'perfil', onDeposit: ()=>void }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [duvidaModal, setDuvidaModal] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) { try { setUser(JSON.parse(u)) } catch {} }
  }, [])

  function getInitials(name: string) {
    return name.split(' ').filter(Boolean).map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
  }

  const items = [
    { label: 'Mercados', id: 'home' },
    { label: 'Portfolio', id: 'perfil' },
    { label: 'Depositar', id: 'depositar' },
    { label: 'Duvidas', id: 'duvidas' },
  ]

  return (
    <>
      <nav style={{position:'fixed',bottom:0,left:0,right:0,background:'#111111',borderTop:'1px solid #222222',display:'flex',justifyContent:'space-around',alignItems:'center',height:'60px',zIndex:1000,paddingBottom:'env(safe-area-inset-bottom)'}}>
        {items.map(item => {
          const active = activePage === item.id
          return (
            <button key={item.id}
              onClick={() => {
                if (item.id === 'depositar') { onDeposit(); return }
                if (item.id === 'duvidas') { router.push('/como-funciona'); return }
                if (item.id === 'home') { router.push('/'); return }
                if (item.id === 'perfil') { router.push('/perfil'); return }
              }}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',border:'none',background:'transparent',cursor:'pointer',color:active?'#00e676':'#666666',fontSize:'11px',transition:'color 0.15s',flex:1,height:'100%',justifyContent:'center'}}
            >
              {item.id === 'home' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              )}
              {item.id === 'perfil' && (
                user ? (
                  <div style={{width:'22px',height:'22px',borderRadius:'50%',background:'#00c853',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:900,color:'#000'}}>
                    {getInitials(user.name || user.email || 'U')}
                  </div>
                ) : (
                  <div style={{position:'relative'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                    <div style={{position:'absolute',top:'-3px',right:'-4px',width:'10px',height:'10px',borderRadius:'50%',background:'#ef4444',border:'1.5px solid #111',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'7px',fontWeight:900,color:'#fff'}}>!</div>
                  </div>
                )
              )}
              {item.id === 'depositar' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59V8h2v8.59l2.3-2.3 1.41 1.41L12 20l-4.71-4.71 1.41-1.41L11 16.59z"/></svg>
              )}
              {item.id === 'duvidas' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
              )}
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Modal Dúvidas */}
      {duvidaModal && (
        <div style={{position:'fixed',inset:0,zIndex:10001,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}
          onClick={()=>setDuvidaModal(false)}>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:'relative',zIndex:1,background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'28px 24px',maxWidth:'320px',width:'100%',textAlign:'center'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>💬</div>
            <h3 style={{fontSize:'17px',fontWeight:800,color:'#fff',marginBottom:'8px'}}>Dúvidas?</h3>
            <p style={{fontSize:'13px',color:'#666',marginBottom:'24px',lineHeight:1.5}}>Entre em contato pelo WhatsApp — respondemos em minutos!</p>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer"
              style={{display:'block',width:'100%',padding:'14px',borderRadius:'10px',border:'none',background:'#25d366',color:'#fff',fontWeight:900,fontSize:'14px',cursor:'pointer',marginBottom:'10px',textDecoration:'none',boxSizing:'border-box' as any}}>
              💬 Abrir WhatsApp
            </a>
            <button onClick={()=>setDuvidaModal(false)} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#888',fontWeight:600,fontSize:'13px',cursor:'pointer'}}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
