'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Star, Clock, TrendingUp, Home, DollarSign, Globe, Trophy, Tv, User } from 'lucide-react'

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
  const router = useRouter()
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState('Inicio')
  const [busca, setBusca] = useState('')
  const [betPanel, setBetPanel] = useState<BetPanelType | null>(null)
  const [betValue, setBetValue] = useState('10')
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]') } catch { return [] }
  })

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

  function toggleFav(id: string) {
    setFavorites(f => {
      const n = f.includes(id) ? f.filter(x => x !== id) : [...f, id]
      localStorage.setItem('favorites', JSON.stringify(n))
      return n
    })
  }

  return (
    <div style={{background:'var(--background)',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <style>{`
        .sidebar-left { display: flex; flex-direction: column; }
        .sidebar-right { display: flex; }
        .main-feed { padding: 20px 16px; }
        @media (max-width: 768px) {
          .sidebar-left { display: none !important; }
          .sidebar-right { display: none !important; }
          .main-feed { padding: 12px; padding-bottom: 70px; }
        }
      `}</style>

      <header style={{background:'rgba(25,25,25,0.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--border)',position:'sticky',top:0,zIndex:50,height:'56px',display:'flex',alignItems:'center',padding:'0 16px',gap:'12px'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',flexShrink:0}}>
          <div style={{width:'30px',height:'30px',borderRadius:'7px',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 10px rgba(106,221,0,0.4)'}}>
            <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'13px'}}>P</span>
          </div>
          <span style={{color:'var(--foreground)',fontWeight:700,fontSize:'15px'}}>Previmarket</span>
        </Link>
        <div style={{flex:1,position:'relative',maxWidth:'400px'}}>
          <Search style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'var(--muted-foreground)',width:'14px',height:'14px'}}/>
          <input type="text" placeholder="Pesquisar mercados..." value={busca} onChange={e=>setBusca(e.target.value)}
            style={{width:'100%',background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'8px',padding:'7px 10px 7px 32px',color:'var(--foreground)',fontSize:'13px',outline:'none',fontFamily:'Kanit,sans-serif'}}/>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'8px'}}>
          {user ? (
            <>
              <span style={{color:'var(--primary)',fontWeight:600,fontSize:'13px'}}>R$ 0,00</span>
              <button style={{background:'var(--primary)',color:'#0a0a0a',border:'none',borderRadius:'7px',padding:'7px 14px',fontWeight:700,fontSize:'13px',cursor:'pointer',fontFamily:'Kanit,sans-serif'}}>Depositar</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{color:'var(--muted-foreground)',textDecoration:'none',fontSize:'13px',fontWeight:500}}>Entrar</Link>
              <Link href="/cadastrar" style={{background:'var(--primary)',color:'#0a0a0a',borderRadius:'7px',padding:'7px 14px',fontWeight:700,fontSize:'13px',textDecoration:'none'}}>Registrar</Link>
            </>
          )}
        </div>
      </header>

      <div style={{display:'flex',overflowX:'auto',gap:'8px',padding:'10px 16px',borderBottom:'1px solid var(--border)',background:'var(--surface)'}}>
        {CATEGORIAS.map(cat => (
          <button key={cat.name} onClick={()=>setCategoria(cat.name)}
            style={{flexShrink:0,padding:'5px 14px',borderRadius:'20px',border:'none',cursor:'pointer',background:categoria===cat.name?'var(--primary)':'var(--muted)',color:categoria===cat.name?'#0a0a0a':'var(--muted-foreground)',fontSize:'13px',fontWeight:categoria===cat.name?700:400,fontFamily:'Kanit,sans-serif',transition:'all 0.15s'}}>
            {cat.name}
          </button>
        ))}
      </div>

      <div style={{display:'flex',flex:1}}>
        <aside className="sidebar-left" style={{width:'200px',flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border)',padding:'16px 0',position:'sticky',top:'56px',height:'calc(100vh - 56px)',overflowY:'auto'}}>
          <p style={{color:'var(--muted-foreground)',fontSize:'10px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0 16px 8px'}}>TEMAS</p>
          <nav>
            {CATEGORIAS.map(cat => {
              const Icon = cat.icon
              const isActive = categoria === cat.name
              return (
                <button key={cat.name} onClick={()=>setCategoria(cat.name)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 16px',border:'none',cursor:'pointer',background:isActive?'rgba(106,221,0,0.1)':'transparent',borderLeft:isActive?'3px solid var(--primary)':'3px solid transparent',color:isActive?'var(--foreground)':'var(--muted-foreground)',fontSize:'14px',fontWeight:isActive?600:400,fontFamily:'Kanit,sans-serif',transition:'all 0.15s'}}>
                  <Icon style={{width:'15px',height:'15px',color:isActive?'var(--primary)':'inherit',flexShrink:0}}/>
                  {cat.name}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="main-feed" style={{flex:1,overflowY:'auto',minWidth:0}}>
          <div style={{background:'linear-gradient(135deg,rgba(106,221,0,0.15) 0%,rgba(20,20,20,0) 70%)',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'12px',padding:'24px',marginBottom:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'8px'}}>
              <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--primary)'}} className="animate-live"/>
              <span style={{color:'var(--primary)',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}}>AO VIVO</span>
            </div>
            <h1 style={{fontSize:'22px',fontWeight:800,color:'var(--foreground)',textTransform:'uppercase',marginBottom:'6px',lineHeight:1.2}}>VOTACOES E PREVISOES</h1>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'14px'}}>Sua opiniao pode virar dinheiro</p>
            <Link href="/cadastrar" style={{display:'inline-block',background:'var(--primary)',color:'#0a0a0a',borderRadius:'8px',padding:'8px 18px',fontWeight:700,fontSize:'13px',textDecoration:'none'}}>Comecar agora</Link>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px'}}>
            <TrendingUp style={{width:'15px',height:'15px',color:'var(--primary)'}}/>
            <h2 style={{fontSize:'13px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>{categoria==='Inicio'?'Em Alta':categoria}</h2>
            {!loading && <span style={{color:'var(--muted-foreground)',fontSize:'12px'}}>({filtrados.length})</span>}
          </div>

          {loading ? (
            <div style={{display:'grid',gap:'10px'}}>
              {[1,2,3].map(i=><div key={i} className="shimmer" style={{height:'130px',borderRadius:'10px'}}/>)}
            </div>
          ) : filtrados.length===0 ? (
            <div style={{textAlign:'center',padding:'48px 20px',background:'var(--surface)',borderRadius:'10px',border:'1px solid var(--border)'}}>
              <div style={{fontSize:'32px',marginBottom:'10px'}}>🔍</div>
              <p style={{color:'var(--muted-foreground)',fontSize:'13px'}}>Nenhum mercado encontrado</p>
            </div>
          ) : (
            <div style={{display:'grid',gap:'10px'}}>
              {filtrados.map((m,i)=>(
                <MarketCard key={m.id} market={m} index={i}
                  onBet={(market,choice)=>{setBetPanel({market,choice});setBetValue('10')}}
                  isFav={favorites.includes(m.id)} onFav={toggleFav}/>
              ))}
            </div>
          )}
        </main>

        <aside className="sidebar-right" style={{width:'290px',flexShrink:0,background:'var(--surface)',borderLeft:'1px solid var(--border)',padding:'20px',position:'sticky',top:'56px',height:'calc(100vh - 56px)',overflowY:'auto'}}>
          {betPanel ? (
            <BetPanel panel={betPanel} value={betValue} onChange={setBetValue} onClose={()=>setBetPanel(null)} user={user}/>
          ) : (
            <div style={{textAlign:'center',padding:'40px 12px'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>🎯</div>
              <p style={{color:'var(--foreground)',fontWeight:600,marginBottom:'6px',fontSize:'15px'}}>Faca sua previsao</p>
              <p style={{color:'var(--muted-foreground)',fontSize:'13px',lineHeight:1.5}}>Clique em SIM ou NAO em qualquer mercado</p>
            </div>
          )}
        </aside>
      </div>

      <BottomNav categoria={categoria} setCategoria={setCategoria} user={user} router={router} busca={busca} setBusca={setBusca}/>
    </div>
  )
}

function BottomNav({categoria,setCategoria,user,router,busca,setBusca}:any) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  if (!isMobile) return null
  return (
    <nav style={{position:'fixed',bottom:0,left:0,right:0,background:'var(--surface)',borderTop:'1px solid var(--border)',zIndex:100,padding:'6px 0',display:'flex'}}>
      {[
        {emoji:'🏠',label:'Inicio',action:()=>setCategoria('Inicio'),active:categoria==='Inicio'},
        {emoji:'🔍',label:'Buscar',action:()=>{const el=document.querySelector('input');if(el)(el as HTMLInputElement).focus()},active:false},
        {emoji:'⭐',label:'Favoritos',action:()=>setCategoria('Favoritos'),active:categoria==='Favoritos'},
        {emoji:'👤',label:'Perfil',action:()=>router.push(user?'/perfil':'/login'),active:false},
      ].map(item=>(
        <button key={item.label} onClick={item.action} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',border:'none',background:'transparent',cursor:'pointer',color:item.active?'#6ADD00':'rgba(255,255,255,0.4)',padding:'4px 0',fontFamily:'Kanit,sans-serif'}}>
          <span style={{fontSize:'18px'}}>{item.emoji}</span>
          <span style={{fontSize:'10px',fontWeight:500}}>{item.label}</span>
        </button>
      ))}
    </nav>
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
      <div style={{display:'flex',gap:'8px'}}>
        <button onMouseEnter={()=>setHoverYes(true)} onMouseLeave={()=>setHoverYes(false)} onClick={()=>onBet(market,'yes')}
          style={{flex:1,padding:'9px',borderRadius:'7px',border:'none',cursor:'pointer',background:hoverYes?'var(--primary)':'rgba(106,221,0,0.12)',color:hoverYes?'#0a0a0a':'var(--primary)',fontWeight:700,fontSize:'13px',fontFamily:'Kanit,sans-serif',transition:'all 0.15s'}}>
          SIM {yesMult}x
        </button>
        <button onMouseEnter={()=>setHoverNo(true)} onMouseLeave={()=>setHoverNo(false)} onClick={()=>onBet(market,'no')}
          style={{flex:1,padding:'9px',borderRadius:'7px',border:'none',cursor:'pointer',background:hoverNo?'#ef4444':'rgba(239,68,68,0.12)',color:hoverNo?'#fff':'#ef4444',fontWeight:700,fontSize:'13px',fontFamily:'Kanit,sans-serif',transition:'all 0.15s'}}>
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
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted-foreground)',fontSize:'20px',lineHeight:1}}>x</button>
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
          <input type="number" value={value} onChange={e=>onChange(e.target.value)} style={{width:'100%',background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'8px',padding:'11px 11px 11px 34px',color:'var(--foreground)',fontSize:'17px',fontWeight:700,outline:'none',fontFamily:'Kanit,sans-serif'}}/>
        </div>
      </div>
      <div style={{display:'flex',gap:'6px',marginBottom:'14px',flexWrap:'wrap'}}>
        {VALORES.map(v=>(
          <button key={v} onClick={()=>onChange(v)} style={{flex:1,minWidth:'36px',padding:'6px',borderRadius:'6px',border:'none',cursor:'pointer',background:value===v?'rgba(106,221,0,0.2)':'var(--muted)',color:value===v?'var(--primary)':'var(--muted-foreground)',fontSize:'12px',fontWeight:600,fontFamily:'Kanit,sans-serif'}}>
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
        <button style={{width:'100%',padding:'13px',borderRadius:'8px',border:'none',cursor:'pointer',background:'var(--primary)',color:'#0a0a0a',fontWeight:800,fontSize:'15px',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 16px rgba(106,221,0,0.35)'}}>
          Confirmar R$ {Number(value).toFixed(2)}
        </button>
      ) : (
        <Link href="/login" style={{display:'block',textAlign:'center',padding:'13px',borderRadius:'8px',background:'var(--primary)',color:'#0a0a0a',fontWeight:800,fontSize:'14px',textDecoration:'none',fontFamily:'Kanit,sans-serif'}}>
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
