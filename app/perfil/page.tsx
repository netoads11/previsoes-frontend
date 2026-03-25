'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BottomNav from '../components/BottomNav'
import DepositModalComp from '../components/DepositModal'
import { RefreshCw, ArrowDownCircle, ArrowUpCircle, Search, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

export default function Portfolio() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bets, setBets] = useState<any[]>([])
  const [balance, setBalance] = useState(0)
  const [tab, setTab] = useState('previsoes')
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [depositModal, setDepositModal] = useState(false)
  const [minDeposit, setMinDeposit] = useState('10.00')
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [modalAmount, setModalAmount] = useState('')
  const [modalPix, setModalPix] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalMsg, setModalMsg] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    setUser(JSON.parse(u))
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    loadData(t)
    fetch('http://187.77.248.115:3001/api/settings/public').then(r=>r.json()).then(d=>{if(d.min_deposit)setMinDeposit(d.min_deposit)}).catch(()=>{})
    return () => window.removeEventListener('resize', check)
  }, [])

  function loadData(t: string) {
    setLoading(true)
    fetch(API + '/api/wallet/balance', { headers: { 'Authorization': 'Bearer ' + t } })
      .then(r => r.json())
      .then(data => setBalance(data.balance || 0))
      .catch(() => {})
    fetch(API + '/api/bets/my', { headers: { 'Authorization': 'Bearer ' + t } })
      .then(r => r.json())
      .then(data => { setBets(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
    fetch(API + '/api/wallet/transactions', { headers: { 'Authorization': 'Bearer ' + t } })
      .then(r => r.json())
      .then(data => setTransactions(Array.isArray(data) ? data : []))
      .catch(() => {})
  }

  function refresh() {
    const t = localStorage.getItem('token')
    if (t) loadData(t)
  }

  const filteredBets = bets.filter(b => b.question?.toLowerCase().includes(busca.toLowerCase()))


  async function handleDeposit(e: any) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token || !modalAmount) return
    setModalLoading(true)
    setModalMsg('')
    try {
      const res = await fetch(API + '/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ amount: Number(modalAmount), pix_key: modalPix })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro')
      setModalMsg('Solicitacao enviada! Aguarde confirmacao do admin.')
      setModalAmount('')
      setModalPix('')
      refresh()
    } catch (err: any) {
      setModalMsg(err.message)
    } finally {
      setModalLoading(false)
    }
  }

  async function handleWithdraw(e: any) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token || !modalAmount || !modalPix) return
    setModalLoading(true)
    setModalMsg('')
    try {
      const res = await fetch(API + '/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ amount: Number(modalAmount), pix_key: modalPix })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro')
      setModalMsg('Saque solicitado com sucesso!')
      setModalAmount('')
      setModalPix('')
      refresh()
    } catch (err: any) {
      setModalMsg(err.message)
    } finally {
      setModalLoading(false)
    }
  }

  function openModal(type: 'deposit' | 'withdraw') {
    setModalAmount('')
    setModalPix('')
    setModalMsg('')
    if (type === 'deposit') { setDepositModal(true); setWithdrawModal(false) }
    else { setWithdrawModal(true); setDepositModal(false) }
  }

  if (!user) return null

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f0f; font-family: Kanit, sans-serif; color: #fff; }
        .port-container { min-height: 100vh; background: #0f0f0f; padding-bottom: 80px; }
        .port-header { background: rgba(15,15,15,0.97); backdropFilter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.07); position: sticky; top: 0; z-index: 50; height: 58px; display: flex; align-items: center; padding: 0 20px; gap: 14px; }
        .port-content { max-width: 600px; margin: 0 auto; padding: 20px 16px; }
        .card { background: #1a1a1a; border-radius: 14px; padding: 20px; margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.07); }
        .btn-green { background: linear-gradient(135deg,#00ff88,#00cc66); color: #0a0a0a; border: none; border-radius: 10px; padding: 12px 0; font-weight: 800; font-size: 14px; cursor: pointer; font-family: Kanit,sans-serif; display: flex; align-items: center; justify-content: center; gap: 6px; transition: opacity 0.15s; width: 100%; }
        .btn-green:hover { opacity: 0.85; }
        .btn-gray { background: #2a2a2a; color: rgba(255,255,255,0.7); border: none; border-radius: 10px; padding: 12px 0; font-weight: 700; font-size: 14px; cursor: pointer; font-family: Kanit,sans-serif; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s; width: 100%; }
        .btn-gray:hover { background: #333; }
        .tab-btn { flex: 1; padding: 9px; border: none; border-radius: 8px; cursor: pointer; font-family: Kanit,sans-serif; font-size: 13px; font-weight: 600; transition: all 0.15s; }
        .skeleton { background: linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .bet-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 12px; }
        .bet-item:last-child { border-bottom: none; }
        @media (max-width: 768px) {
          .port-content { padding: 14px 12px; }
          .card { padding: 16px; }
        }
      `}</style>

      <div className="port-container">
        {/* HEADER */}
        <header className="port-header">
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',flexShrink:0}}>
            <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#00ff88,#00cc66)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 14px rgba(0,255,136,0.4)'}}>
              <span style={{color:'#0a0a0a',fontWeight:900,fontSize:'14px'}}>P</span>
            </div>
            <span style={{color:'#fff',fontWeight:800,fontSize:'16px'}}>Previmarket</span>
          </Link>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.35)'}}>Saldo</div>
              <div style={{fontSize:'14px',fontWeight:800,color:'#00ff88'}}>R$ {Number(balance).toFixed(2)}</div>
            </div>
            <button onClick={()=>openModal('deposit')} style={{background:'linear-gradient(135deg,#00ff88,#00cc66)',color:'#0a0a0a',border:'none',borderRadius:'8px',padding:'8px 16px',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 14px rgba(0,255,136,0.35)'}}>
              + Depositar
            </button>
          </div>
        </header>

        <div className="port-content">
          {/* CARD PORTFOLIO */}
          <div className="card" style={{background:'linear-gradient(135deg,#1a1a1a 0%,#0d1a0d 100%)',border:'1px solid rgba(0,255,136,0.12)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
              <div>
                <h2 style={{fontSize:'16px',fontWeight:800,marginBottom:'2px'}}>Portfólio</h2>
                <p style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>Desempenho geral</p>
              </div>
              <button onClick={refresh} style={{background:'rgba(255,255,255,0.07)',border:'none',borderRadius:'8px',padding:'8px',cursor:'pointer',color:'rgba(255,255,255,0.5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <RefreshCw style={{width:'15px',height:'15px'}}/>
              </button>
            </div>
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'6px'}}>VALOR DO PORTFÓLIO</p>
            <p style={{fontSize:'36px',fontWeight:900,color:'#00ff88',letterSpacing:'-0.02em',lineHeight:1}}>
              R$ {Number(balance).toFixed(2)}
            </p>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'10px'}}>
              <TrendingUp style={{width:'13px',height:'13px',color:'rgba(255,255,255,0.3)'}}/>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.3)'}}>
                {bets.length} aposta{bets.length !== 1 ? 's' : ''} ativa{bets.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* CARD SALDO */}
          <div className="card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
              <h3 style={{fontSize:'15px',fontWeight:700}}>Saldo Disponível</h3>
              <span style={{fontSize:'20px',fontWeight:900,color:'#00ff88'}}>R$ {Number(balance).toFixed(2)}</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <button className="btn-green" onClick={()=>openModal('deposit')}>
                <ArrowDownCircle style={{width:'16px',height:'16px'}}/>
                Depositar
              </button>
              <button className="btn-gray" onClick={()=>openModal('withdraw')}>
                <ArrowUpCircle style={{width:'16px',height:'16px'}}/>
                Retirar
              </button>
            </div>
          </div>

          {/* CARD HISTÓRICO */}
          <div className="card">
            {/* BUSCA */}
            <div style={{position:'relative',marginBottom:'14px'}}>
              <Search style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',width:'14px',height:'14px',color:'rgba(255,255,255,0.3)'}}/>
              <input type="text" placeholder="Buscar previsao..." value={busca} onChange={e=>setBusca(e.target.value)}
                style={{width:'100%',background:'#2a2a2a',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'9px',padding:'10px 12px 10px 34px',color:'#fff',fontSize:'13px',outline:'none',fontFamily:'Kanit,sans-serif'}}
                onFocus={e=>e.target.style.borderColor='rgba(0,255,136,0.4)'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.08)'}/>
            </div>

            {/* TABS */}
            <div style={{display:'flex',gap:'4px',background:'#0f0f0f',borderRadius:'10px',padding:'4px',marginBottom:'16px'}}>
              {['previsoes','depositos','retiradas'].map(t=>(
                <button key={t} onClick={()=>setTab(t)} className="tab-btn"
                  style={{background:tab===t?'#1a1a1a':'transparent',color:tab===t?'#00ff88':'rgba(255,255,255,0.35)',boxShadow:tab===t?'0 1px 4px rgba(0,0,0,0.4)':'none'}}>
                  {t==='previsoes'?'Previsões':t==='depositos'?'Depósitos':'Retiradas'}
                </button>
              ))}
            </div>

            {/* CONTEUDO */}
            {tab === 'previsoes' && (
              <div>
                {loading ? (
                  <div style={{display:'grid',gap:'10px'}}>
                    {[1,2,3].map(i=><div key={i} className="skeleton" style={{height:'60px'}}/>)}
                  </div>
                ) : filteredBets.length === 0 ? (
                  <div style={{textAlign:'center',padding:'40px 0'}}>
                    <div style={{fontSize:'32px',marginBottom:'12px'}}>🎯</div>
                    <p style={{color:'rgba(255,255,255,0.35)',fontSize:'14px',marginBottom:'16px'}}>Nenhuma previsão encontrada</p>
                    <Link href="/" style={{display:'inline-block',background:'linear-gradient(135deg,#00ff88,#00cc66)',color:'#0a0a0a',borderRadius:'8px',padding:'10px 20px',fontWeight:800,fontSize:'13px',textDecoration:'none'}}>
                      Ver mercados
                    </Link>
                  </div>
                ) : (
                  filteredBets.map(b=>(
                    <div key={b.id} className="bet-item">
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:'13px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:'3px'}}>{b.question||'Mercado'}</p>
                        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                          <span style={{fontSize:'11px',fontWeight:700,color:b.choice==='yes'?'#00ff88':'#ff4d4d',background:b.choice==='yes'?'rgba(0,255,136,0.1)':'rgba(255,77,77,0.1)',padding:'2px 7px',borderRadius:'4px'}}>
                            {b.choice==='yes'?'✅ SIM':'❌ NAO'}
                          </span>
                          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>R$ {Number(b.amount).toFixed(2)}</span>
                        </div>
                      </div>
                      <div style={{textAlign:'right',flexShrink:0}}>
                        {b.status==='open' ? (
                          <span style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.5)',background:'rgba(255,255,255,0.07)',padding:'3px 8px',borderRadius:'5px'}}>
                            <Clock style={{width:'10px',height:'10px'}}/>
                            Em aberto
                          </span>
                        ) : (
                          <span style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.35)',background:'rgba(255,255,255,0.05)',padding:'3px 8px',borderRadius:'5px'}}>
                            <CheckCircle style={{width:'10px',height:'10px'}}/>
                            Finalizado
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'depositos' && (
              <div>
                {transactions.filter(t => t.type === 'deposit').length === 0 ? (
                  <div style={{textAlign:'center',padding:'40px 0'}}>
                    <div style={{fontSize:'32px',marginBottom:'12px'}}>💰</div>
                    <p style={{color:'rgba(255,255,255,0.35)',fontSize:'14px',marginBottom:'16px'}}>Nenhum depósito ainda</p>
                    <button className="btn-green" onClick={()=>openModal('deposit')} style={{maxWidth:'200px',margin:'0 auto'}}>
                      <ArrowDownCircle style={{width:'15px',height:'15px'}}/>
                      Depositar via PIX
                    </button>
                  </div>
                ) : (
                  transactions.filter(t => t.type === 'deposit').map((t: any) => (
                    <div key={t.id} className="bet-item">
                      <div style={{flex:1}}>
                        <p style={{fontSize:'13px',fontWeight:600,marginBottom:'3px'}}>Depósito via PIX</p>
                        <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{new Date(t.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{fontSize:'14px',fontWeight:800,color:'#00ff88',marginBottom:'3px'}}>+R$ {Number(t.amount).toFixed(2)}</p>
                        <span style={{fontSize:'10px',padding:'2px 8px',borderRadius:'4px',
                          background: t.status==='completed'?'rgba(0,255,136,0.1)':'rgba(255,200,0,0.1)',
                          color: t.status==='completed'?'#00ff88':'#ffc800',fontWeight:600}}>
                          {t.status==='completed'?'Confirmado':t.status==='pending'?'Pendente':'Estornado'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'retiradas' && (
              <div>
                {transactions.filter(t => t.type === 'withdrawal').length === 0 ? (
                  <div style={{textAlign:'center',padding:'40px 0'}}>
                    <div style={{fontSize:'32px',marginBottom:'12px'}}>🏦</div>
                    <p style={{color:'rgba(255,255,255,0.35)',fontSize:'14px'}}>Nenhuma retirada ainda</p>
                  </div>
                ) : (
                  transactions.filter(t => t.type === 'withdrawal').map((t: any) => (
                    <div key={t.id} className="bet-item">
                      <div style={{flex:1}}>
                        <p style={{fontSize:'13px',fontWeight:600,marginBottom:'3px'}}>Saque · {t.pix_key || 'PIX'}</p>
                        <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{new Date(t.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{fontSize:'14px',fontWeight:800,color:'#ff4d4d',marginBottom:'3px'}}>-R$ {Number(t.amount).toFixed(2)}</p>
                        <span style={{fontSize:'10px',padding:'2px 8px',borderRadius:'4px',
                          background: t.status==='paid'?'rgba(0,255,136,0.1)':t.status==='rejected'?'rgba(255,77,77,0.1)':'rgba(255,200,0,0.1)',
                          color: t.status==='paid'?'#00ff88':t.status==='rejected'?'#ff4d4d':'#ffc800',fontWeight:600}}>
                          {t.status==='paid'?'Pago':t.status==='rejected'?'Recusado':t.status==='completed'?'Aprovado':'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

      {depositModal && <DepositModalComp onClose={()=>setDepositModal(false)} balance={balance} setBalance={b=>setBalance(typeof b==='function'?b(balance):b)} minDeposit={minDeposit} API={'http://187.77.248.115:3001'}/>}

      {withdrawModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={()=>{setWithdrawModal(false);setModalMsg('')}}>
          <div style={{background:'#1a1a1a',borderRadius:'16px',padding:'28px',width:'100%',maxWidth:'400px',border:'1px solid rgba(255,255,255,0.1)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h3 style={{fontSize:'18px',fontWeight:800,color:'#fff'}}>Sacar via PIX</h3>
              <button onClick={()=>{setWithdrawModal(false);setModalMsg('')}} style={{background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:'22px',lineHeight:1,padding:'0'}}>×</button>
            </div>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',marginBottom:'16px'}}>Saldo disponível: <strong style={{color:'#00ff88'}}>R$ {Number(balance).toFixed(2)}</strong></p>
            {modalMsg && (
              <div style={{background:modalMsg.includes('Erro')||modalMsg.includes('erro')||modalMsg.includes('insuficiente')?'rgba(239,68,68,0.1)':'rgba(0,255,136,0.1)',border:'1px solid '+(modalMsg.includes('Erro')||modalMsg.includes('erro')||modalMsg.includes('insuficiente')?'rgba(239,68,68,0.3)':'rgba(0,255,136,0.3)'),borderRadius:'8px',padding:'12px 14px',marginBottom:'16px',color:modalMsg.includes('Erro')||modalMsg.includes('erro')||modalMsg.includes('insuficiente')?'#f87171':'#00ff88',fontSize:'13px'}}>
                {modalMsg}
              </div>
            )}
            <form onSubmit={handleWithdraw} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div>
                <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Valor (R$)</label>
                <input type="number" min="1" max={balance} step="0.01" value={modalAmount} onChange={e=>setModalAmount(e.target.value)} required placeholder="Ex: 50.00"
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'13px',color:'#fff',fontSize:'14px',outline:'none',fontFamily:'Kanit,sans-serif'}}/>
              </div>
              <div>
                <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Chave PIX de destino</label>
                <input type="text" value={modalPix} onChange={e=>setModalPix(e.target.value)} required placeholder="CPF, email ou telefone"
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'13px',color:'#fff',fontSize:'14px',outline:'none',fontFamily:'Kanit,sans-serif'}}/>
              </div>
              <button type="submit" disabled={modalLoading} className="btn-gray" style={{marginTop:'4px',opacity:modalLoading?0.7:1}}>
                <ArrowUpCircle style={{width:'16px',height:'16px'}}/>
                {modalLoading?'Enviando...':'Solicitar Saque'}
              </button>
            </form>
          </div>
        </div>
      )}

        {isMobile && <BottomNav activePage="perfil" onDeposit={()=>setDepositModal(true)} />}
      </div>
    </>
  )
}
