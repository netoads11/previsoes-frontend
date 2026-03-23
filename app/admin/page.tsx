'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart2, Users, TrendingUp, DollarSign, Plus, LogOut, Settings, ShieldCheck, List } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

export default function Admin() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [markets, setMarkets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('Financeiro')
  const [yesOdds, setYesOdds] = useState('50')
  const [noOdds, setNoOdds] = useState('50')
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'success'|'error'>('success')
  const [token, setToken] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    const user = JSON.parse(u)
    if (!user.is_admin) { router.push('/'); return }
    setToken(t)
    loadMarkets()
    loadUsers(t)
  }, [])

  function loadMarkets() {
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(data => setMarkets(Array.isArray(data) ? data : []))
  }

  function loadUsers(t: string) {
    fetch(API + '/api/admin/users', { headers: { 'Authorization': 'Bearer ' + t } })
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
  }

  async function createMarket(e: any) {
    e.preventDefault()
    try {
      const res = await fetch(API + '/api/admin/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ question, category, yes_odds: Number(yesOdds), no_odds: Number(noOdds) })
      })
      if (res.ok) {
        setMsg('Mercado criado com sucesso!')
        setMsgType('success')
        setQuestion('')
        setYesOdds('50')
        setNoOdds('50')
        loadMarkets()
      } else {
        setMsg('Erro ao criar mercado.')
        setMsgType('error')
      }
    } catch {
      setMsg('Erro ao criar mercado.')
      setMsgType('error')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'markets', label: 'Mercados', icon: List },
    { id: 'criar', label: 'Criar Mercado', icon: Plus },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'configs', label: 'Configuracoes', icon: Settings },
  ]

  const CATS = ['Entretenimento','Criptomoedas','Financeiro','Esportes','Politica','Clima','Celebridades']

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--background)',fontFamily:'Kanit,sans-serif'}}>
      <aside style={{width:'240px',flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border)',padding:'24px 0',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh'}}>
        <div style={{padding:'0 20px 24px',borderBottom:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 12px rgba(106,221,0,0.4)'}}>
              <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'14px'}}>P</span>
            </div>
            <div>
              <div style={{color:'var(--foreground)',fontWeight:700,fontSize:'15px'}}>Previmarket</div>
              <div style={{color:'var(--primary)',fontSize:'11px',fontWeight:600}}>Admin Panel</div>
            </div>
          </div>
        </div>
        <div style={{padding:'16px 12px 0',flex:1}}>
          <p style={{color:'var(--muted-foreground)',fontSize:'10px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0 8px 8px'}}>NAVEGACAO</p>
          <nav style={{display:'flex',flexDirection:'column',gap:'2px'}}>
            {TABS.map(t => {
              const Icon = t.icon
              const isActive = tab === t.id
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'8px',border:'none',cursor:'pointer',background:isActive?'rgba(106,221,0,0.12)':'transparent',color:isActive?'var(--primary)':'var(--muted-foreground)',fontSize:'14px',fontWeight:isActive?600:400,fontFamily:'Kanit,sans-serif',transition:'all 0.15s',textAlign:'left'}}>
                  <Icon style={{width:'16px',height:'16px',flexShrink:0}}/>
                  {t.label}
                </button>
              )
            })}
          </nav>
        </div>
        <div style={{padding:'16px 12px',borderTop:'1px solid var(--border)'}}>
          <button onClick={() => { localStorage.clear(); router.push('/') }} style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 12px',borderRadius:'8px',border:'none',cursor:'pointer',background:'transparent',color:'var(--muted-foreground)',fontSize:'14px',fontFamily:'Kanit,sans-serif',width:'100%'}}>
            <LogOut style={{width:'16px',height:'16px'}}/>
            Sair
          </button>
        </div>
      </aside>

      <main style={{flex:1,padding:'32px',overflowY:'auto'}}>
        {tab === 'dashboard' && (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{fontSize:'24px',fontWeight:800,color:'var(--foreground)',marginBottom:'4px'}}>Dashboard</h1>
              <p style={{color:'var(--muted-foreground)',fontSize:'14px'}}>Visao geral da plataforma</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'}}>
              {[
                { label: 'Mercados ativos', value: markets.length, icon: TrendingUp, color: 'var(--primary)', bg: 'rgba(106,221,0,0.1)' },
                { label: 'Usuarios', value: users.length, icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
                { label: 'Volume total', value: 'R$ 0', icon: DollarSign, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
              ].map(card => {
                const Icon = card.icon
                return (
                  <div key={card.label} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                      <p style={{color:'var(--muted-foreground)',fontSize:'13px',fontWeight:500}}>{card.label}</p>
                      <div style={{width:'36px',height:'36px',borderRadius:'8px',background:card.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Icon style={{width:'18px',height:'18px',color:card.color}}/>
                      </div>
                    </div>
                    <p style={{fontSize:'32px',fontWeight:800,color:'var(--foreground)'}}>{card.value}</p>
                  </div>
                )
              })}
            </div>
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
              <h3 style={{fontSize:'16px',fontWeight:700,marginBottom:'16px'}}>Ultimos mercados criados</h3>
              {markets.slice(0,5).map(m => (
                <div key={m.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
                  <div>
                    <p style={{fontSize:'14px',fontWeight:500,color:'var(--foreground)'}}>{m.question}</p>
                    <p style={{fontSize:'12px',color:'var(--muted-foreground)',marginTop:'2px'}}>{m.category}</p>
                  </div>
                  <span style={{background:'rgba(106,221,0,0.1)',color:'var(--primary)',fontSize:'12px',fontWeight:600,padding:'4px 10px',borderRadius:'4px'}}>Aberto</span>
                </div>
              ))}
              {markets.length === 0 && <p style={{color:'var(--muted-foreground)',fontSize:'14px'}}>Nenhum mercado criado ainda.</p>}
            </div>
          </div>
        )}

        {tab === 'markets' && (
          <div>
            <div style={{marginBottom:'32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <h1 style={{fontSize:'24px',fontWeight:800,color:'var(--foreground)',marginBottom:'4px'}}>Mercados</h1>
                <p style={{color:'var(--muted-foreground)',fontSize:'14px'}}>{markets.length} mercados no total</p>
              </div>
              <button onClick={() => setTab('criar')} style={{display:'flex',alignItems:'center',gap:'8px',background:'var(--primary)',color:'#0a0a0a',border:'none',borderRadius:'8px',padding:'10px 20px',fontWeight:700,fontSize:'14px',cursor:'pointer',fontFamily:'Kanit,sans-serif'}}>
                <Plus style={{width:'16px',height:'16px'}}/>
                Novo mercado
              </button>
            </div>
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid var(--border)'}}>
                    {['Pergunta','Categoria','SIM','NAO','Status'].map(h => (
                      <th key={h} style={{textAlign:'left',padding:'14px 20px',fontSize:'12px',fontWeight:600,color:'var(--muted-foreground)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {markets.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:'center',padding:'48px',color:'var(--muted-foreground)'}}>Nenhum mercado criado ainda.</td></tr>
                  ) : markets.map(m => (
                    <tr key={m.id} style={{borderBottom:'1px solid var(--border)'}}>
                      <td style={{padding:'14px 20px',fontSize:'14px',color:'var(--foreground)',maxWidth:'300px'}}>{m.question}</td>
                      <td style={{padding:'14px 20px',fontSize:'13px',color:'var(--muted-foreground)'}}>{m.category || '-'}</td>
                      <td style={{padding:'14px 20px',fontSize:'13px',fontWeight:600,color:'var(--primary)'}}>{m.yes_odds}%</td>
                      <td style={{padding:'14px 20px',fontSize:'13px',fontWeight:600,color:'#ef4444'}}>{m.no_odds}%</td>
                      <td style={{padding:'14px 20px'}}><span style={{background:'rgba(106,221,0,0.1)',color:'var(--primary)',fontSize:'12px',fontWeight:600,padding:'4px 10px',borderRadius:'4px'}}>Aberto</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'criar' && (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{fontSize:'24px',fontWeight:800,color:'var(--foreground)',marginBottom:'4px'}}>Criar Mercado</h1>
              <p style={{color:'var(--muted-foreground)',fontSize:'14px'}}>Adicione um novo mercado de previsao</p>
            </div>
            {msg && (
              <div style={{background:msgType==='success'?'rgba(106,221,0,0.1)':'rgba(239,68,68,0.1)',border:`1px solid ${msgType==='success'?'rgba(106,221,0,0.3)':'rgba(239,68,68,0.3)'}`,borderRadius:'8px',padding:'12px 16px',marginBottom:'24px',color:msgType==='success'?'var(--primary)':'#f87171',fontSize:'14px'}}>
                {msg}
              </div>
            )}
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'32px',maxWidth:'600px'}}>
              <form onSubmit={createMarket} style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div>
                  <label style={{fontSize:'13px',color:'var(--muted-foreground)',display:'block',marginBottom:'8px',fontWeight:500}}>Pergunta do mercado</label>
                  <input type="text" value={question} onChange={e=>setQuestion(e.target.value)} required placeholder="Ex: Bitcoin vai superar $100k em 2026?" style={{width:'100%',background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px 16px',color:'var(--foreground)',fontSize:'15px',outline:'none',fontFamily:'Kanit,sans-serif'}} onFocus={e=>e.target.style.borderColor='rgba(106,221,0,0.5)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                </div>
                <div>
                  <label style={{fontSize:'13px',color:'var(--muted-foreground)',display:'block',marginBottom:'8px',fontWeight:500}}>Categoria</label>
                  <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%',background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px 16px',color:'var(--foreground)',fontSize:'15px',outline:'none',fontFamily:'Kanit,sans-serif'}}>
                    {CATS.map(c=><option key={c} value={c} style={{background:'#1a1a1a'}}>{c}</option>)}
                  </select>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
                  <div>
                    <label style={{fontSize:'13px',color:'var(--muted-foreground)',display:'block',marginBottom:'8px',fontWeight:500}}>% Chance SIM</label>
                    <input type="number" min="1" max="99" value={yesOdds} onChange={e=>{setYesOdds(e.target.value);setNoOdds(String(100-Number(e.target.value)))}} style={{width:'100%',background:'var(--muted)',border:'1px solid rgba(106,221,0,0.3)',borderRadius:'8px',padding:'12px 16px',color:'var(--primary)',fontSize:'18px',fontWeight:700,outline:'none',fontFamily:'Kanit,sans-serif'}}/>
                  </div>
                  <div>
                    <label style={{fontSize:'13px',color:'var(--muted-foreground)',display:'block',marginBottom:'8px',fontWeight:500}}>% Chance NAO</label>
                    <input type="number" min="1" max="99" value={noOdds} onChange={e=>{setNoOdds(e.target.value);setYesOdds(String(100-Number(e.target.value)))}} style={{width:'100%',background:'var(--muted)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'12px 16px',color:'#ef4444',fontSize:'18px',fontWeight:700,outline:'none',fontFamily:'Kanit,sans-serif'}}/>
                  </div>
                </div>
                <div style={{background:'var(--muted)',borderRadius:'8px',padding:'16px',display:'flex',justifyContent:'space-between'}}>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'12px',color:'var(--muted-foreground)',marginBottom:'4px'}}>Multiplicador SIM</p>
                    <p style={{fontSize:'20px',fontWeight:800,color:'var(--primary)'}}>{(100/Number(yesOdds)).toFixed(2)}x</p>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'12px',color:'var(--muted-foreground)',marginBottom:'4px'}}>Multiplicador NAO</p>
                    <p style={{fontSize:'20px',fontWeight:800,color:'#ef4444'}}>{(100/Number(noOdds)).toFixed(2)}x</p>
                  </div>
                </div>
                <button type="submit" style={{padding:'16px',borderRadius:'10px',border:'none',cursor:'pointer',background:'var(--primary)',color:'#0a0a0a',fontWeight:800,fontSize:'16px',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 20px rgba(106,221,0,0.3)'}}>
                  CRIAR MERCADO
                </button>
              </form>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{fontSize:'24px',fontWeight:800,color:'var(--foreground)',marginBottom:'4px'}}>Usuarios</h1>
              <p style={{color:'var(--muted-foreground)',fontSize:'14px'}}>{users.length} usuarios cadastrados</p>
            </div>
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid var(--border)'}}>
                    {['Nome','Email','Admin','Cadastro'].map(h=>(
                      <th key={h} style={{textAlign:'left',padding:'14px 20px',fontSize:'12px',fontWeight:600,color:'var(--muted-foreground)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length===0?(
                    <tr><td colSpan={4} style={{textAlign:'center',padding:'48px',color:'var(--muted-foreground)'}}>Nenhum usuario ainda.</td></tr>
                  ):users.map(u=>(
                    <tr key={u.id} style={{borderBottom:'1px solid var(--border)'}}>
                      <td style={{padding:'14px 20px',fontSize:'14px',color:'var(--foreground)',fontWeight:500}}>{u.name}</td>
                      <td style={{padding:'14px 20px',fontSize:'13px',color:'var(--muted-foreground)'}}>{u.email}</td>
                      <td style={{padding:'14px 20px'}}>{u.is_admin?<span style={{background:'rgba(106,221,0,0.1)',color:'var(--primary)',fontSize:'12px',fontWeight:600,padding:'4px 10px',borderRadius:'4px'}}>Admin</span>:<span style={{background:'var(--muted)',color:'var(--muted-foreground)',fontSize:'12px',padding:'4px 10px',borderRadius:'4px'}}>Usuario</span>}</td>
                      <td style={{padding:'14px 20px',fontSize:'13px',color:'var(--muted-foreground)'}}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'configs' && (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{fontSize:'24px',fontWeight:800,color:'var(--foreground)',marginBottom:'4px'}}>Configuracoes</h1>
              <p style={{color:'var(--muted-foreground)',fontSize:'14px'}}>Configuracoes gerais da plataforma</p>
            </div>
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'32px',maxWidth:'600px'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                {[{label:'Taxa de Deposito',value:'2%'},{label:'Taxa de Vitoria',value:'0.36%'},{label:'Taxa de Saque',value:'2%'}].map(item=>(
                  <div key={item.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px',background:'var(--muted)',borderRadius:'8px'}}>
                    <span style={{fontSize:'14px',color:'var(--foreground)',fontWeight:500}}>{item.label}</span>
                    <span style={{fontSize:'16px',fontWeight:700,color:'var(--primary)'}}>{item.value}</span>
                  </div>
                ))}
                <p style={{fontSize:'13px',color:'var(--muted-foreground)',textAlign:'center',marginTop:'8px'}}>Configuracao de taxas em breve disponivel.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
