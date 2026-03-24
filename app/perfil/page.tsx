'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, DollarSign, TrendingUp, LogOut, ArrowLeft, Star } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bets, setBets] = useState<any[]>([])
  const [balance, setBalance] = useState(0)
  const [tab, setTab] = useState('apostas')

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    setUser(JSON.parse(u))
    fetch(API + '/api/wallet/balance', { headers: { 'Authorization': 'Bearer ' + t } })
      .then(r => r.json())
      .then(data => setBalance(data.balance || 0))
      .catch(() => {})
    fetch(API + '/api/bets/my', { headers: { 'Authorization': 'Bearer ' + t } })
      .then(r => r.json())
      .then(data => setBets(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  function logout() {
    localStorage.clear()
    router.push('/')
  }

  if (!user) return null

  return (
    <>
      <style>{`
        .perfil-container {
          min-height: 100vh;
          background: #0d0d0d;
          font-family: Kanit, sans-serif;
          color: #fff;
        }
        .perfil-header {
          background: rgba(25,25,25,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .perfil-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 16px;
        }
        .perfil-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 16px;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }
        .tab-bar {
          display: flex;
          gap: 4px;
          margin-bottom: 16px;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          padding: 4px;
        }
        .tab-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: Kanit, sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.15s;
        }
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .perfil-content { padding: 16px 12px; }
          .perfil-card { padding: 16px; }
        }
      `}</style>
      <div className="perfil-container">
        <header className="perfil-header">
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'6px',color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'14px'}}>
            <ArrowLeft style={{width:'16px',height:'16px'}}/>
            Voltar
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginLeft:'auto'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'6px',background:'#6ADD00',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'12px'}}>P</span>
            </div>
            <span style={{fontWeight:700,fontSize:'15px'}}>Previmarket</span>
          </div>
        </header>

        <div className="perfil-content">
          {/* CARD DO USUARIO */}
          <div className="perfil-card" style={{display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
            <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'rgba(106,221,0,0.15)',border:'2px solid #6ADD00',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{fontSize:'22px',fontWeight:800,color:'#6ADD00'}}>{user.name?.[0]?.toUpperCase()}</span>
            </div>
            <div style={{flex:1}}>
              <h2 style={{fontSize:'18px',fontWeight:700,marginBottom:'2px'}}>{user.name}</h2>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>{user.email}</p>
              {user.is_admin && <span style={{background:'rgba(106,221,0,0.1)',color:'#6ADD00',fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'4px',display:'inline-block',marginTop:'4px'}}>Admin</span>}
            </div>
            <button onClick={logout} style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'8px',padding:'8px 14px',color:'#f87171',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'Kanit,sans-serif'}}>
              <LogOut style={{width:'14px',height:'14px'}}/>
              Sair
            </button>
          </div>

          {/* STATS */}
          <div className="stat-grid">
            {[
              {label:'Saldo',value:`R$ ${Number(balance).toFixed(2)}`,color:'#6ADD00',icon:DollarSign},
              {label:'Apostas',value:bets.length,color:'#6366f1',icon:TrendingUp},
              {label:'Favoritos',value:'0',color:'#f59e0b',icon:Star},
            ].map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="stat-card">
                  <Icon style={{width:'18px',height:'18px',color:s.color,margin:'0 auto 8px'}}/>
                  <p style={{fontSize:'20px',fontWeight:800,color:s.color,marginBottom:'2px'}}>{s.value}</p>
                  <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{s.label}</p>
                </div>
              )
            })}
          </div>

          {/* TABS */}
          <div className="tab-bar">
            {[{id:'apostas',label:'Minhas Apostas'},{id:'depositos',label:'Depositos'},{id:'saques',label:'Saques'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} className="tab-btn"
                style={{background:tab===t.id?'rgba(106,221,0,0.15)':'transparent',color:tab===t.id?'#6ADD00':'rgba(255,255,255,0.4)'}}>
                {t.label}
              </button>
            ))}
          </div>

          {/* CONTEUDO TABS */}
          {tab==='apostas' && (
            <div className="perfil-card">
              {bets.length===0 ? (
                <div style={{textAlign:'center',padding:'32px 0'}}>
                  <div style={{fontSize:'36px',marginBottom:'12px'}}>🎯</div>
                  <p style={{color:'rgba(255,255,255,0.4)',fontSize:'14px'}}>Voce ainda nao fez nenhuma aposta.</p>
                  <Link href="/" style={{display:'inline-block',marginTop:'16px',background:'#6ADD00',color:'#0a0a0a',borderRadius:'8px',padding:'10px 20px',fontWeight:700,fontSize:'13px',textDecoration:'none'}}>
                    Ver mercados
                  </Link>
                </div>
              ) : (
                <div>
                  {bets.map(b=>(
                    <div key={b.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:'13px',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.question||'Mercado'}</p>
                        <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>
                          <span style={{color:b.choice==='yes'?'#6ADD00':'#ef4444',fontWeight:600}}>{b.choice==='yes'?'SIM':'NAO'}</span>
                          {' · '}R$ {Number(b.amount).toFixed(2)}
                        </p>
                      </div>
                      <span style={{background:b.status==='open'?'rgba(106,221,0,0.1)':'rgba(255,255,255,0.06)',color:b.status==='open'?'#6ADD00':'rgba(255,255,255,0.4)',fontSize:'11px',fontWeight:600,padding:'3px 8px',borderRadius:'4px',flexShrink:0,marginLeft:'8px'}}>
                        {b.status==='open'?'Aberta':'Encerrada'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab==='depositos' && (
            <div className="perfil-card" style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>💰</div>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'14px',marginBottom:'16px'}}>Nenhum deposito ainda.</p>
              <button style={{background:'#6ADD00',color:'#0a0a0a',border:'none',borderRadius:'8px',padding:'10px 20px',fontWeight:700,fontSize:'13px',cursor:'pointer',fontFamily:'Kanit,sans-serif'}}>
                Depositar via PIX
              </button>
            </div>
          )}

          {tab==='saques' && (
            <div className="perfil-card" style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>🏦</div>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'14px'}}>Nenhum saque ainda.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
