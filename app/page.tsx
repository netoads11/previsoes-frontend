'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Star, Clock, TrendingUp, Home, DollarSign, Globe, Trophy, Tv, User, BarChart2, Menu, X } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

const CATEGORIAS = [
  { name: 'Inicio', icon: Home },
  { name: 'Economia', icon: DollarSign },
  { name: 'Entretenimento', icon: Tv },
  { name: 'Esportes', icon: Trophy },
  { name: 'Geopolitica', icon: Globe },
  { name: 'Politica', icon: TrendingUp },
]

interface Market {
  id: string
  question: string
  yes_odds: number
  no_odds: number
  category?: string
  status?: string
  expires_at?: string
}

interface BetPanelType {
  market: Market
  choice: 'yes' | 'no'
}

export default function Previmarket() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState('Inicio')
  const [busca, setBusca] = useState('')
  const [betPanel, setBetPanel] = useState<BetPanelType | null>(null)
  const [betValue, setBetValue] = useState('10')
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('favorites') || '[]') } catch { return [] } })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(data => { setMarkets(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtrados = markets.filter(m => {
    const matchCat = categoria === 'Inicio' || m.category === categoria
    const matchBusca = m.question.toLowerCase().includes(busca.toLowerCase())
    return matchCat && matchBusca
  })

  return (
    <div style={{background:'var(--background)',minHeight:'100vh',display:'flex',flexDirection:'column'}}>

      {/* HEADER */}
      <header style={{background:'rgba(25,25,25,0.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--border)',position:'sticky',top:0,zIndex:50,height:'56px',display:'flex',alignItems:'center',padding:'0 16px',gap:'12px'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',flexShrink:0}}>
          <div style={{width:'30px',height:'30px',borderRadius:'7px',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 10px rgba(106,221,0,0.4)'}}>
            <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'13px'}}>P</span>
          </div>
          <span style={{color:'var(--foreground)',fontWeight:700,fontSize:'15px'}}>Previmarket</span>
        </Link>

        <div className="header-search" style={{flex:1,position:'relative',maxWidth:'400px'}}>
          <Search style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'var(--muted-foreground)',width:'14px',height:'14px'}}/>
          <input type="text" placeholder="Pesquisar mercados..." value={busca} onChange={e=>setBusca(e.target.value)}
            style={{width:'100%',background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'8px',padding:'7px 10px 7px 32px',color:'var(--foreground)',fontSize:'13px',outline:'none'}}/>
        </div>

        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'8px'}}>
          <span className="header-balance" style={{color:'var(--primary)',fontWeight:600,fontSize:'13px'}}>
            {user ? 'R$ 0,00' : ''}
          </span>
          {user ? (
            <button style={{background:'var(--primary)',color:'#0a0a0a',border:'none',borderRadius:'7px',padding:'7px 14px',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>
              Depositar
            </button>
          ) : (
            <>
              <Link href="/login" style={{color:'var(--muted-foreground)',textDecoration:'none',fontSize:'13px',fontWeight:500}}>Entrar</Link>
              <Link href="/cadastrar" style={{background:'var(--primary)',color:'#0a0a0a',borderRadius:'7px',padding:'7px 14px',fontWeight:700,fontSize:'13px',textDecoration:'none'}}>Registrar</Link>
            </>
          )}
        </div>
      </header>

      {/* CATEGORIAS MOBILE — scroll horizontal */}
      <div style={{display:'flex',gap:'8px',padding:'12px 16px',overflowX:'auto',borderBottom:'1px solid var(--border)',background:'var(--surface)'}}>
        {CATEGORIAS.map(cat => {
          const isActive = categoria === cat.name
          return (
            <button key={cat.name} onClick={()=>setCategoria(cat.name)}
              style={{flexShrink:0,padding:'6px 14px',borderRadius:'20px',border:'none',cursor:'pointer',background:isActive?'var(--primary)':'var(--muted)',color:isActive?'#0a0a0a':'var(--muted-foreground)',fontSize:'13px',fontWeight:isActive?700:400,transition:'all 0.15s'}}>
              {cat.name}
            </button>
          )
        })}
      </div>

      <div style={{display:'flex',flex:1}}>

        {/* SIDEBAR ESQUERDA — desktop */}
        <aside className="sidebar-left" style={{width:'200px',flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border)',padding:'16px 0',position:'sticky',top:'56px',height:'calc(100vh - 56px)',overflowY:'auto',display:'flex',flexDirection:'column'}}>
          <p style={{color:'var(--muted-foreground)',fontSize:'10px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0 16px 8px'}}>TEMAS</p>
          <nav style={{flex:1}}>
            {CATEGORIAS.map(cat => {
              const Icon = cat.icon
              const isActive = categoria === cat.name
              return (
                <button key={cat.name} onClick={()=>setCategoria(cat.name)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 16px',border:'none',cursor:'pointer',background:isActive?'rgba(106,221,0,0.1)':'transparent',borderLeft:isActive?'3px solid var(--primary)':'3px solid transparent',color:isActive?'var(--foreground)':'var(--muted-foreground)',fontSize:'14px',fontWeight:isActive?600:400,transition:'all 0.15s'}}>
                  <Icon style={{width:'15px',height:'15px',color:isActive?'var(--primary)':'inherit',flexShrink:0}}/>
                  {cat.name}
                </button>
              )
            })}
          </nav>
          <div style={{padding:'16px',borderTop:'1px solid var(--border)'}}>
            <Link href="/duvidas" style={{color:'var(--muted-foreground)',textDecoration:'none',fontSize:'13px'}}>📖 Duvidas</Link>
          </div>
        </aside>

        {/* FEED PRINCIPAL */}
        <main className="main-content" style={{flex:1,padding:'20px 16px',overflowY:'auto',minWidth:0}}>

          {/* BANNER */}
          <div style={{background:'linear-gradient(135deg,rgba(106,221,0,0.15) 0%,rgba(20,20,20,0) 70%)',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'12px',padding:'24px',marginBottom:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'8px'}}>
              <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--primary)'}} className="animate-live"/>
              <span style={{color:'var(--primary)',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}}>AO VIVO</span>
            </div>
            <h1 className="banner-title" style={{fontSize:'26px',fontWeight:800,color:'var(--foreground)',textTransform:'uppercase',marginBottom:'6px',lineHeight:1.2}}>
              VOTACOES E PREVISOES
            </h1>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'16px'}}>Sua opiniao pode virar dinheiro</p>
            <Link href="/cadastrar" style={{display:'inline-block',background:'var(--primary)',color:'#0a0a0a',borderRadius:'8px',padding:'9px 20px',fontWeight:700,fontSize:'13px',textDecoration:'none'}}>
              Comecar agora →
            </Link>
          </div>

          {/* TITULO SECAO */}
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px'}}>
            <TrendingUp style={{width:'16px',height:'16px',color:'var(--primary)'}}/>
            <h2 style={{fontSize:'14px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>
              {categoria==='Inicio'?'Em Alta':categoria}
            </h2>
            {!loading && <span style={{color:'var(--muted-foreground)',fontSize:'12px'}}>({filtrados.length})</span>}
          </div>

          {/* LISTA DE MERCADOS */}
          {loading ? (
            <div style={{display:'grid',gap:'10px'}}>
              {[1,2,3].map(i=><div key={i} className="shimmer" style={{height:'140px',borderRadius:'10px'}}/>)}
            </div>
          ) : filtrados.length===0 ? (
            <div style={{textAlign:'center',padding:'48px 20px',background:'var(--surface)',borderRadius:'10px',border:'1px solid var(--border)'}}>
              <div style={{fontSize:'36px',marginBottom:'10px'}}>🔍</div>
              <p style={{color:'var(--muted-foreground)',fontSize:'14px'}}>Nenhum mercado encontrado</p>
            </div>
          ) : (
            <div style={{display:'grid',gap:'10px'}}>
              {filtrados.map((m,i)=>(
                <MarketCard key={m.id} market={m} index={i}
                  onBet={(market,choice)=>{setBetPanel({market,choice});setBetValue('10')}}
                  isFav={favorites.includes(m.id)}
                  onFav={id=>setFavorites(f=>{ const n = f.includes(id)?f.filter(x=>x!==id):[...f,id]; localStorage.setItem('favorites',JSON.stringify(n)); return n })}/>
              ))}
            </div>
          )}
        </main>

        {/* PAINEL DE APOSTA — desktop */}
        <aside className="sidebar-right" style={{width:'290px',flexShrink:0,background:'var(--surface)',borderLeft:'1px solid var(--border)',padding:'20px',position:'sticky',top:'56px',height:'calc(100vh - 56px)',overflowY:'auto'}}>
          {betPanel ? (
            <BetPanel panel={betPanel} value={betValue} onChange={setBetValue} onClose={()=>setBetPanel(null)} user={user}/>
          ) : (
            <div style={{textAlign:'center',padding:'40px 12px'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>🎯</div>
              <p style={{color:'var(--foreground)',fontWeight:600,marginBottom:'6px',fontSize:'15px'}}>Faca sua previsao</p>
              <p style={{color:'var(--muted-foreground)',fontSize:'13px',lineHeight:1.5}}>Clique em SIM ou NAO em qualquer mercado para comecar</p>
            </div>
          )}
        </aside>
      </div>

      {/* PAINEL DE APOSTA MOBILE — bottom sheet */}
      {betPanel && (
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200,background:'var(--surface)',borderTop:'1px solid var(--border)',borderRadius:'16px 16px 0 0',padding:'20px',maxHeight:'85vh',overflowY:'auto',display:'none'}} className="mobile-bet-panel">
          <BetPanel panel={betPanel} value={betValue} onChange={setBetValue} onClose={()=>setBetPanel(null)} user={user}/>
        </div>
      )}

      {/* BOTTOM NAV MOBILE */}
      <nav className="mobile-nav" style={{display:'none'}}>
        {[
          {icon:Home,label:'Inicio',action:()=>setCategoria('Inicio'),active:categoria==='Inicio'},
          {icon:Search,label:'Buscar',action:()=>document.querySelector('input')?.focus(),active:false},
          {icon:Star,label:'Favoritos',action:()=>setBusca(''),active:false},
          {icon:User,label:'Perfil',action:()=>router.push(user?'/perfil':'/login'),active:false},
        ].map(item => {
          const Icon = item.icon
          return (
            <button key={item.label} onClick={item.action} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',border:'none',background:'transparent',cursor:'pointer',color:item.active?'var(--primary)':'var(--muted-foreground)',padding:'4px 0'}}>
              <Icon style={{width:'20px',height:'20px'}}/>
              <span style={{fontSize:'10px',fontWeight:500,fontFamily:'Kanit,sans-serif'}}>{item.label}</span>
            </button>
          )
        })}
      </nav>
        })}
      </nav>
    </div>
  )
}

function MarketCard({market,index,onBet,isFav,onFav}:{market:Market,index:number,onBet:(m:Market,c:'yes'|'no')=>void,isFav:boolean,onFav:(id:string)=>void}) {
  const yes = Number(market.yes_odds)||50
  const no = Number(market.no_odds)||50
  const yesMult = (100/yes).toFixed(2)
  const noMult = (100/no).toFixed(2)
  const [hoverYes,setHoverYes] = useState(false)
  const [hoverNo,setHoverNo] = useState(false)

  return (
    <div className="animate-fade-up" style={{animationDelay:`${index*0.04}s`,background:'var(--card)',border:'1px solid var(--border)',borderRadius:'10px',padding:'14px',transition:'border-color 0.2s'}}
      onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(106,221,0,0.3)')}
      onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--border)')}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'10px',marginBottom:'10px'}}>
        <div style={{flex:1}}>
          {market.category && <span style={{background:'rgba(106,221,0,0.1)',color:'var(--primary)',fontSize:'10px',fontWeight:600,padding:'2px 7px',borderRadius:'4px',textTransform:'uppercase',display:'inline-block',marginBottom:'5px'}}>{market.category}</span>}
          <p style={{color:'var(--foreground)',fontSize:'13px',fontWeight:500,lineHeight:1.4}}>{market.question}</p>
        </div>
        <button onClick={()=>onFav(market.id)} style={{background:'none',border:'none',cursor:'pointer',padding:'2px',flexShrink:0}}>
          <Star style={{width:'14px',height:'14px',color:isFav?'#facc15':'var(--muted-foreground)',fill:isFav?'#facc15':'none'}}/>
        </button>
      </div>

      <div style={{marginBottom:'10px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
          <span style={{fontSize:'11px',color:'var(--primary)',fontWeight:600}}>{yes}% SIM</span>
          <span style={{fontSize:'11px',color:'#ef4444',fontWeight:600}}>{no}% NAO</span>
        </div>
        <div style={{height:'5px',borderRadius:'3px',background:'var(--muted)',overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:'3px',background:'linear-gradient(90deg,var(--primary),rgba(106,221,0,0.5))',width:`${yes}%`,transition:'width 0.5s'}}/>
        </div>
      </div>

      <div className="bet-buttons" style={{display:'flex',gap:'8px'}}>
        <button onMouseEnter={()=>setHoverYes(true)} onMouseLeave={()=>setHoverYes(false)} onClick={()=>onBet(market,'yes')}
          style={{flex:1,padding:'9px',borderRadius:'7px',border:'none',cursor:'pointer',background:hoverYes?'var(--primary)':'rgba(106,221,0,0.12)',color:hoverYes?'#0a0a0a':'var(--primary)',fontWeight:700,fontSize:'13px',transition:'all 0.15s'}}>
          SIM {yesMult}x
        </button>
        <button onMouseEnter={()=>setHoverNo(true)} onMouseLeave={()=>setHoverNo(false)} onClick={()=>onBet(market,'no')}
          style={{flex:1,padding:'9px',borderRadius:'7px',border:'none',cursor:'pointer',background:hoverNo?'#ef4444':'rgba(239,68,68,0.12)',color:hoverNo?'#fff':'#ef4444',fontWeight:700,fontSize:'13px',transition:'all 0.15s'}}>
          NAO {noMult}x
        </button>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'8px'}}>
        <Clock style={{width:'11px',height:'11px',color:'var(--muted-foreground)'}}/>
        <span style={{fontSize:'11px',color:'var(--muted-foreground)'}}>{market.expires_at?`Encerra em ${getTimeLeft(market.expires_at)}`:'Aberto'}</span>
      </div>
    </div>
  )
}

function BetPanel({panel,value,onChange,onClose,user}:any) {
  const yes = Number(panel.market.yes_odds)||50
  const no = Number(panel.market.no_odds)||50
  const mult = panel.choice==='yes'?(100/yes).toFixed(2):(100/no).toFixed(2)
  const gain = (Number(value)*Number(mult)).toFixed(2)
  const VALORES = ['5','10','20','50','100']

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
        <h3 style={{fontSize:'15px',fontWeight:700}}>Sua Previsao</h3>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted-foreground)',fontSize:'20px',lineHeight:1}}>×</button>
      </div>
      <div style={{background:'var(--muted)',borderRadius:'8px',padding:'12px',marginBottom:'14px'}}>
        <p style={{fontSize:'12px',color:'var(--muted-foreground)',marginBottom:'6px',lineHeight:1.4}}>{panel.market.question}</p>
        <span style={{display:'inline-block',padding:'3px 10px',borderRadius:'4px',fontSize:'12px',fontWeight:700,background:panel.choice==='yes'?'rgba(106,221,0,0.2)':'rgba(239,68,68,0.2)',color:panel.choice==='yes'?'var(--primary)':'#ef4444'}}>
          {panel.choice==='yes'?'SIM':'NAO'} {mult}x
        </span>
      </div>
      <div style={{marginBottom:'12px'}}>
        <label style={{fontSize:'12px',color:'var(--muted-foreground)',display:'block',marginBottom:'6px'}}>Valor:</label>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'var(--muted-foreground)',fontSize:'13px'}}>R$</span>
          <input type="number" value={value} onChange={e=>onChange(e.target.value)} style={{width:'100%',background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'8px',padding:'11px 11px 11px 34px',color:'var(--foreground)',fontSize:'17px',fontWeight:700,outline:'none'}}/>
        </div>
      </div>
      <div style={{display:'flex',gap:'6px',marginBottom:'14px',flexWrap:'wrap'}}>
        {VALORES.map(v=>(
          <button key={v} onClick={()=>onChange(v)} style={{flex:1,minWidth:'36px',padding:'6px',borderRadius:'6px',border:'none',cursor:'pointer',background:value===v?'rgba(106,221,0,0.2)':'var(--muted)',color:value===v?'var(--primary)':'var(--muted-foreground)',fontSize:'12px',fontWeight:600}}>
            R${v}
          </button>
        ))}
      </div>
      <div style={{background:'rgba(106,221,0,0.08)',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'8px',padding:'12px',marginBottom:'14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
          <span style={{fontSize:'12px',color:'var(--muted-foreground)'}}>Custo:</span>
          <span style={{fontSize:'12px',fontWeight:600}}>R$ {Number(value).toFixed(2)}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
          <span style={{fontSize:'12px',color:'var(--muted-foreground)'}}>Odd:</span>
          <span style={{fontSize:'12px',fontWeight:600}}>{mult}x</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid rgba(106,221,0,0.2)',paddingTop:'8px'}}>
          <span style={{fontSize:'13px',fontWeight:600}}>Se acertar:</span>
          <span style={{fontSize:'15px',fontWeight:800,color:'var(--primary)'}}>R$ {gain}</span>
        </div>
      </div>
      {user ? (
        <button style={{width:'100%',padding:'13px',borderRadius:'8px',border:'none',cursor:'pointer',background:'var(--primary)',color:'#0a0a0a',fontWeight:800,fontSize:'15px',boxShadow:'0 0 16px rgba(106,221,0,0.35)'}}>
          Confirmar R$ {Number(value).toFixed(2)}
        </button>
      ) : (
        <Link href="/login" style={{display:'block',textAlign:'center',padding:'13px',borderRadius:'8px',background:'var(--primary)',color:'#0a0a0a',fontWeight:800,fontSize:'14px',textDecoration:'none'}}>
          Entrar para apostar
        </Link>
      )}
    </div>
  )
}

function getTimeLeft(dateStr:string):string {
  const diff = new Date(dateStr).getTime()-Date.now()
  if(diff<=0) return 'Encerrado'
  const d=Math.floor(diff/86400000)
  const h=Math.floor((diff%86400000)/3600000)
  const m=Math.floor((diff%3600000)/60000)
  if(d>0) return `${d}d ${h}h`
  if(h>0) return `${h}h ${m}m`
  return `${m}m`
}
