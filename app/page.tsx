'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, Clock, TrendingUp, DollarSign, Globe, Trophy, Tv, Zap, Flame, BarChart2, HelpCircle, Search, User } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

const CATS = [
  { name: 'Live', emoji: '🔴', icon: Zap },
  { name: 'Explorar', emoji: '🔥', icon: Flame },
  { name: 'Economia', emoji: '💰', icon: DollarSign },
  { name: 'Entretenimento', emoji: '🎬', icon: Tv },
  { name: 'Esportes', emoji: '⚽', icon: Trophy },
  { name: 'Criptomoedas', emoji: '₿', icon: BarChart2 },
  { name: 'Geopolitica', emoji: '🌍', icon: Globe },
  { name: 'Politica', emoji: '🏛️', icon: TrendingUp },
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

export default function Home() {
  const router = useRouter()
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('Explorar')
  const [busca, setBusca] = useState('')
  const [user, setUser] = useState<any>(null)
  const [favs, setFavs] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('favorites')||'[]') } catch { return [] } })
  const [betPanel, setBetPanel] = useState<any>(null)
  const [betValue, setBetValue] = useState('10')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(d => { setMarkets(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
    return () => window.removeEventListener('resize', check)
  }, [])

  function toggleFav(id: string) {
    setFavs(f => { const n = f.includes(id) ? f.filter(x=>x!==id) : [...f,id]; localStorage.setItem('favorites',JSON.stringify(n)); return n })
  }

  const filtered = markets.filter(m => {
    if (cat === 'Favoritos') return favs.includes(m.id)
    if (cat === 'Live') return m.status === 'live'
    if (cat === 'Explorar') return busca === '' || m.question.toLowerCase().includes(busca.toLowerCase())
    return m.category === cat && (busca === '' || m.question.toLowerCase().includes(busca.toLowerCase()))
  })

  const byCategory = CATS.slice(2).reduce((acc: any[], c) => {
    const mkts = markets.filter(m => m.category === c.name)
    if (mkts.length > 0) acc.push({ cat: c, markets: mkts })
    return acc
  }, [])

  return (
    <div style={{background:'#0f0f0f',minHeight:'100vh',color:'#fff',fontFamily:'Kanit,sans-serif'}}>
      <style>{`
        *{box-sizing:border-box}
        .cat-scroll::-webkit-scrollbar{display:none}
        .btn-sim{background:rgba(0,255,136,0.12);color:#00ff88;border:1px solid rgba(0,255,136,0.25);transition:all 0.15s}
        .btn-sim:hover{background:#00ff88;color:#0a0a0a;box-shadow:0 0 12px rgba(0,255,136,0.4);transform:scale(0.97)}
        .btn-sim:active{transform:scale(0.95)}
        .btn-nao{background:rgba(255,77,77,0.1);color:#ff4d4d;border:1px solid rgba(255,77,77,0.2);transition:all 0.15s}
        .btn-nao:hover{background:#ff4d4d;color:#fff;box-shadow:0 0 12px rgba(255,77,77,0.4);transform:scale(0.97)}
        .btn-nao:active{transform:scale(0.95)}
        .mcard{background:#1a1a1a;border:1px solid rgba(255,255,255,0.07);border-radius:14px;transition:all 0.2s}
        .mcard:hover{border-color:rgba(0,255,136,0.25);transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,0,0,0.4)}
        .sidebar-d{display:flex}
        .sidebar-r{display:flex}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes livePulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .fadein{animation:fadeUp 0.3s ease forwards}
        .live-dot{animation:livePulse 1s infinite}
        @media(max-width:768px){
          .sidebar-d{display:none!important}
          .sidebar-r{display:none!important}
          .feed-pad{padding:10px 10px 76px!important}
          .hero-h1{font-size:18px!important}
          .hide-mob{display:none!important}
        }
        @media(max-width:1024px) and (min-width:769px){
          .sidebar-d{width:160px!important}
          .sidebar-r{display:none!important}
        }
      `}</style>

      {/* HEADER */}
      <header style={{background:'rgba(10,10,10,0.98)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:50,height:'52px',display:'flex',alignItems:'center',padding:'0 16px',gap:'12px'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'7px',textDecoration:'none',flexShrink:0}}>
          <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,#00ff88,#00cc66)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 12px rgba(0,255,136,0.45)'}}>
            <span style={{color:'#0a0a0a',fontWeight:900,fontSize:'13px'}}>P</span>
          </div>
          <span style={{color:'#fff',fontWeight:800,fontSize:'15px',letterSpacing:'0.01em'}}>Previmarket</span>
        </Link>
        <div style={{flex:1,position:'relative',maxWidth:'360px'}}>
          <Search style={{position:'absolute',left:'9px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.25)',width:'13px',height:'13px'}}/>
          <input type="text" placeholder="Buscar mercados..." value={busca} onChange={e=>setBusca(e.target.value)}
            style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'8px',padding:'6px 10px 6px 28px',color:'#fff',fontSize:'12px',outline:'none',fontFamily:'Kanit,sans-serif'}}
            onFocus={e=>e.target.style.borderColor='rgba(0,255,136,0.4)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}/>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'8px'}}>
          {user ? (
            <>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',lineHeight:1,textTransform:'uppercase',letterSpacing:'0.08em'}}>Saldo</div>
                <div style={{fontSize:'13px',fontWeight:800,color:'#00ff88'}}>R$ 0,00</div>
              </div>
              <button style={{background:'linear-gradient(135deg,#00ff88,#00cc66)',color:'#0a0a0a',border:'none',borderRadius:'7px',padding:'7px 14px',fontWeight:800,fontSize:'12px',cursor:'pointer',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 14px rgba(0,255,136,0.3)'}}>+ Depositar</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'12px',fontWeight:600}}>Entrar</Link>
              <Link href="/cadastrar" style={{background:'linear-gradient(135deg,#00ff88,#00cc66)',color:'#0a0a0a',borderRadius:'7px',padding:'7px 14px',fontWeight:800,fontSize:'12px',textDecoration:'none',boxShadow:'0 0 14px rgba(0,255,136,0.3)'}}>Registrar</Link>
            </>
          )}
        </div>
      </header>

      {/* CATEGORIAS */}
      <div className="cat-scroll" style={{display:'flex',gap:'5px',padding:'8px 12px',overflowX:'auto',background:'rgba(255,255,255,0.015)',borderBottom:'1px solid rgba(255,255,255,0.05)',flexShrink:0}}>
        {CATS.map(c => {
          const active = cat === c.name
          const isLive = c.name === 'Live'
          return (
            <button key={c.name} onClick={()=>setCat(c.name)}
              style={{flexShrink:0,display:'flex',alignItems:'center',gap:'4px',padding:'5px 12px',borderRadius:'18px',border:active?'1px solid rgba(0,255,136,0.4)':'1px solid rgba(255,255,255,0.07)',cursor:'pointer',background:active?'rgba(0,255,136,0.12)':'rgba(255,255,255,0.03)',color:active?'#00ff88':'rgba(255,255,255,0.45)',fontSize:'12px',fontWeight:active?700:400,fontFamily:'Kanit,sans-serif',transition:'all 0.15s'}}>
              {isLive && <span className="live-dot" style={{width:'5px',height:'5px',borderRadius:'50%',background:'#ff4d4d',display:'inline-block'}}/>}
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          )
        })}
      </div>

      <div style={{display:'flex',flex:1}}>
        {/* SIDEBAR ESQUERDA */}
        <aside className="sidebar-d" style={{width:'190px',flexShrink:0,background:'rgba(255,255,255,0.015)',borderRight:'1px solid rgba(255,255,255,0.05)',padding:'12px 0',position:'sticky',top:'52px',height:'calc(100vh - 52px)',overflowY:'auto',flexDirection:'column'}}>
          <p style={{color:'rgba(255,255,255,0.25)',fontSize:'9px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',padding:'0 14px 8px'}}>CATEGORIAS</p>
          <nav>
            {CATS.map(c => {
              const Icon = c.icon
              const active = cat === c.name
              const isLive = c.name === 'Live'
              return (
                <button key={c.name} onClick={()=>setCat(c.name)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:'8px',padding:'8px 14px',border:'none',cursor:'pointer',background:active?'rgba(0,255,136,0.07)':'transparent',borderLeft:active?'2px solid #00ff88':'2px solid transparent',color:active?'#00ff88':'rgba(255,255,255,0.4)',fontSize:'12px',fontWeight:active?600:400,fontFamily:'Kanit,sans-serif',transition:'all 0.15s',textAlign:'left'}}>
                  <span style={{fontSize:'13px'}}>{c.emoji}</span>
                  <span>{c.name}</span>
                  {isLive && <span className="live-dot" style={{width:'5px',height:'5px',borderRadius:'50%',background:'#ff4d4d',display:'inline-block',marginLeft:'auto'}}/>}
                </button>
              )
            })}
          </nav>
          <div style={{padding:'12px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:'auto'}}>
            <Link href="/duvidas" style={{color:'rgba(255,255,255,0.25)',textDecoration:'none',fontSize:'12px',display:'flex',alignItems:'center',gap:'5px'}}>
              <HelpCircle style={{width:'12px',height:'12px'}}/>Duvidas
            </Link>
          </div>
        </aside>

        {/* FEED */}
        <main className="feed-pad" style={{flex:1,padding:'14px 12px',overflowY:'auto',minWidth:0}}>

          {/* HERO */}
          <div style={{background:'linear-gradient(135deg,rgba(0,255,136,0.15) 0%,rgba(0,0,0,0) 70%)',border:'1px solid rgba(0,255,136,0.12)',borderRadius:'14px',padding:'20px 22px',marginBottom:'16px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,right:0,width:'180px',height:'100%',background:'linear-gradient(135deg,transparent,rgba(0,255,136,0.05))',transform:'skewX(-10deg)',transformOrigin:'top right'}}/>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'6px'}}>
              <span className="live-dot" style={{width:'7px',height:'7px',borderRadius:'50%',background:'#ff4d4d',display:'inline-block'}}/>
              <span style={{color:'#ff4d4d',fontSize:'10px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>AO VIVO</span>
              <span style={{color:'rgba(255,255,255,0.25)',fontSize:'10px'}}>· {markets.length} mercados</span>
            </div>
            <h1 className="hero-h1" style={{fontSize:'22px',fontWeight:900,color:'#fff',textTransform:'uppercase',marginBottom:'4px',lineHeight:1.15,letterSpacing:'0.01em'}}>
              TUDO QUE BOMBA<br/>
              <span style={{color:'#00ff88',textShadow:'0 0 24px rgba(0,255,136,0.5)'}}>NA INTERNET ESTÁ AQUI!</span>
            </h1>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',marginBottom:'12px'}}>Preveja eventos reais · Ganhe dinheiro via PIX</p>
            <Link href="/cadastrar" style={{display:'inline-flex',alignItems:'center',gap:'5px',background:'linear-gradient(135deg,#00ff88,#00cc66)',color:'#0a0a0a',borderRadius:'7px',padding:'8px 18px',fontWeight:800,fontSize:'12px',textDecoration:'none',boxShadow:'0 0 16px rgba(0,255,136,0.35)'}}>
              Começar grátis →
            </Link>
          </div>

          {/* CONTEUDO */}
          {cat === 'Explorar' && !busca ? (
            <div>
              {loading ? <Skeletons/> : markets.length === 0 ? <Empty/> : (
                <>
                  <SecHeader title="🔥 Em Alta" count={markets.length} onMore={()=>{}}/>
                  <div style={{display:'grid',gap:'8px',marginBottom:'20px'}}>
                    {markets.slice(0,3).map((m,i)=><MCard key={m.id} m={m} i={i} onBet={(m,c)=>{setBetPanel({market:m,choice:c});setBetValue('10')}} fav={favs.includes(m.id)} onFav={toggleFav}/>)}
                  </div>
                  {byCategory.map(({cat:c,markets:mkts}:any)=>(
                    <div key={c.name} style={{marginBottom:'20px'}}>
                      <SecHeader title={`${c.emoji} ${c.name}`} count={mkts.length} onMore={()=>setCat(c.name)}/>
                      <div style={{display:'grid',gap:'8px'}}>
                        {mkts.slice(0,3).map((m:Market,i:number)=><MCard key={m.id} m={m} i={i} onBet={(m,c)=>{setBetPanel({market:m,choice:c});setBetValue('10')}} fav={favs.includes(m.id)} onFav={toggleFav}/>)}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div>
              <SecHeader title={cat==='Favoritos'?'⭐ Favoritos':cat==='Live'?'🔴 Ao Vivo':cat} count={filtered.length} onMore={()=>{}}/>
              {loading ? <Skeletons/> : filtered.length===0 ? <Empty/> : (
                <div style={{display:'grid',gap:'8px'}}>
                  {filtered.map((m,i)=><MCard key={m.id} m={m} i={i} onBet={(m,c)=>{setBetPanel({market:m,choice:c});setBetValue('10')}} fav={favs.includes(m.id)} onFav={toggleFav}/>)}
                </div>
              )}
            </div>
          )}
        </main>

        {/* PAINEL APOSTA DESKTOP */}
        <aside className="sidebar-r" style={{width:'280px',flexShrink:0,background:'rgba(255,255,255,0.015)',borderLeft:'1px solid rgba(255,255,255,0.05)',padding:'16px',position:'sticky',top:'52px',height:'calc(100vh - 52px)',overflowY:'auto',flexDirection:'column'}}>
          {betPanel ? (
            <BetP panel={betPanel} value={betValue} onChange={setBetValue} onClose={()=>setBetPanel(null)} user={user}/>
          ) : (
            <div style={{textAlign:'center',padding:'48px 12px'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>🎯</div>
              <p style={{fontWeight:700,marginBottom:'5px',fontSize:'14px'}}>Faça sua previsão</p>
              <p style={{color:'rgba(255,255,255,0.3)',fontSize:'12px',lineHeight:1.5}}>
                Clique em <span style={{color:'#00ff88',fontWeight:700}}>SIM</span> ou <span style={{color:'#ff4d4d',fontWeight:700}}>NÃO</span> em qualquer mercado
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* BOTTOM NAV MOBILE */}
      {isMobile && (
        <nav style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(10,10,10,0.98)',borderTop:'1px solid rgba(255,255,255,0.07)',zIndex:100,padding:'5px 0 8px',display:'flex',backdropFilter:'blur(20px)'}}>
          {[
            {e:'🏠',l:'Mercados',a:()=>router.push('/'),active:true},
            {e:'📊',l:'Portfolio',a:()=>router.push('/perfil'),active:false},
            {e:'💰',l:'Depositar',a:()=>{},active:false},
            {e:'❓',l:'Duvidas',a:()=>router.push('/duvidas'),active:false},
            {e:'👤',l:'Perfil',a:()=>router.push(user?'/perfil':'/login'),active:false},
          ].map(item=>(
            <button key={item.l} onClick={item.a}
              style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',border:'none',background:'transparent',cursor:'pointer',color:item.active?'#00ff88':'rgba(255,255,255,0.3)',padding:'3px 0',fontFamily:'Kanit,sans-serif',transition:'color 0.15s'}}>
              <span style={{fontSize:'17px'}}>{item.e}</span>
              <span style={{fontSize:'9px',fontWeight:item.active?700:400}}>{item.l}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}

function SecHeader({title,count,onMore}:{title:string,count:number,onMore:()=>void}) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
      <h2 style={{fontSize:'13px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em',color:'#fff'}}>{title}</h2>
      {count>0 && <button onClick={onMore} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',fontSize:'11px',fontFamily:'Kanit,sans-serif'}}>Ver mais {count} →</button>}
    </div>
  )
}

function Skeletons() {
  return (
    <div style={{display:'grid',gap:'8px'}}>
      {[1,2,3].map(i=><div key={i} style={{height:'110px',borderRadius:'12px',background:'rgba(255,255,255,0.04)'}}/>)}
    </div>
  )
}

function Empty() {
  return (
    <div style={{textAlign:'center',padding:'40px 20px',background:'rgba(255,255,255,0.02)',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.05)'}}>
      <div style={{fontSize:'28px',marginBottom:'8px'}}>🔍</div>
      <p style={{color:'rgba(255,255,255,0.3)',fontSize:'12px'}}>Nenhum mercado encontrado</p>
    </div>
  )
}

function MCard({m,i,onBet,fav,onFav}:{m:Market,i:number,onBet:(m:Market,c:'yes'|'no')=>void,fav:boolean,onFav:(id:string)=>void}) {
  const yes = Number(m.yes_odds)||50
  const no = Number(m.no_odds)||50
  const yM = (100/yes).toFixed(2)
  const nM = (100/no).toFixed(2)
  const hot = yes>=60||no>=60

  return (
    <div className="mcard fadein" style={{animationDelay:`${i*0.03}s`,padding:'12px 14px'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'10px',marginBottom:'10px'}}>
        {/* THUMBNAIL */}
        <div style={{width:'38px',height:'38px',borderRadius:'8px',background:'linear-gradient(135deg,rgba(0,255,136,0.15),rgba(0,204,102,0.08))',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'16px'}}>
          {m.category==='Esportes'?'⚽':m.category==='Criptomoedas'?'₿':m.category==='Politica'?'🏛️':m.category==='Entretenimento'?'🎬':m.category==='Economia'?'💰':'🔮'}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'4px',flexWrap:'wrap'}}>
            {m.category && <span style={{background:'rgba(0,255,136,0.08)',color:'#00ff88',fontSize:'9px',fontWeight:700,padding:'1px 6px',borderRadius:'3px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{m.category}</span>}
            {hot && <span style={{background:'rgba(255,77,77,0.1)',color:'#ff4d4d',fontSize:'9px',fontWeight:700,padding:'1px 6px',borderRadius:'3px'}}>🔥 Em Alta</span>}
          </div>
          <p style={{color:'#fff',fontSize:'13px',fontWeight:600,lineHeight:1.35,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{m.question}</p>
        </div>
        <button onClick={()=>onFav(m.id)} style={{background:'none',border:'none',cursor:'pointer',padding:'2px',flexShrink:0,transition:'transform 0.15s'}}
          onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.2)')}
          onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
          <Star style={{width:'14px',height:'14px',color:fav?'#facc15':'rgba(255,255,255,0.2)',fill:fav?'#facc15':'none',transition:'all 0.15s'}}/>
        </button>
      </div>

      {/* BARRA */}
      <div style={{marginBottom:'10px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
          <span style={{fontSize:'10px',color:'#00ff88',fontWeight:700}}>{yes}% SIM</span>
          <span style={{fontSize:'10px',color:'rgba(255,255,255,0.25)'}}>chance</span>
          <span style={{fontSize:'10px',color:'#ff4d4d',fontWeight:700}}>{no}% NÃO</span>
        </div>
        <div style={{height:'3px',borderRadius:'2px',background:'rgba(255,255,255,0.07)',overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:'2px',background:'linear-gradient(90deg,#00ff88,rgba(0,255,136,0.3))',width:`${yes}%`,transition:'width 0.6s ease'}}/>
        </div>
      </div>

      {/* BOTÕES */}
      <div style={{display:'flex',gap:'6px',marginBottom:'8px'}}>
        <button className="btn-sim" onClick={()=>onBet(m,'yes')}
          style={{flex:1,padding:'8px 6px',borderRadius:'20px',cursor:'pointer',fontWeight:800,fontSize:'12px',fontFamily:'Kanit,sans-serif',letterSpacing:'0.01em'}}>
          ✔ SIM {yM}x
        </button>
        <button className="btn-nao" onClick={()=>onBet(m,'no')}
          style={{flex:1,padding:'8px 6px',borderRadius:'20px',cursor:'pointer',fontWeight:800,fontSize:'12px',fontFamily:'Kanit,sans-serif',letterSpacing:'0.01em'}}>
          ✖ NÃO {nM}x
        </button>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
        <Clock style={{width:'10px',height:'10px',color:'rgba(255,255,255,0.2)'}}/>
        <span style={{fontSize:'10px',color:'rgba(255,255,255,0.2)'}}>
          {m.expires_at?`Encerra em ${getTime(m.expires_at)}`:'Aberto'}
        </span>
      </div>
    </div>
  )
}

function BetP({panel,value,onChange,onClose,user}:any) {
  const yes = Number(panel.market.yes_odds)||50
  const no = Number(panel.market.no_odds)||50
  const mult = panel.choice==='yes'?(100/yes).toFixed(2):(100/no).toFixed(2)
  const gain = (Number(value)*Number(mult)).toFixed(2)
  const isYes = panel.choice==='yes'
  const VALS = ['5','10','20','50','100']

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
        <h3 style={{fontSize:'14px',fontWeight:800}}>Sua Previsão</h3>
        <button onClick={onClose} style={{background:'rgba(255,255,255,0.07)',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.5)',width:'26px',height:'26px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>×</button>
      </div>
      <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'10px',padding:'10px',marginBottom:'12px',border:'1px solid rgba(255,255,255,0.06)'}}>
        <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'6px',lineHeight:1.4}}>{panel.market.question}</p>
        <span style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'4px 10px',borderRadius:'5px',fontSize:'12px',fontWeight:800,background:isYes?'rgba(0,255,136,0.12)':'rgba(255,77,77,0.12)',color:isYes?'#00ff88':'#ff4d4d',border:`1px solid ${isYes?'rgba(0,255,136,0.25)':'rgba(255,77,77,0.25)'}`}}>
          {isYes?'✔ SIM':'✖ NÃO'} · {mult}x
        </span>
      </div>
      <div style={{marginBottom:'8px'}}>
        <label style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Valor</label>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:'11px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.35)',fontSize:'13px',fontWeight:600}}>R$</span>
          <input type="number" value={value} onChange={e=>onChange(e.target.value)}
            style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'8px',padding:'10px 10px 10px 32px',color:'#fff',fontSize:'18px',fontWeight:800,outline:'none',fontFamily:'Kanit,sans-serif'}}
            onFocus={e=>e.target.style.borderColor='rgba(0,255,136,0.4)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}/>
        </div>
      </div>
      <div style={{display:'flex',gap:'5px',marginBottom:'12px'}}>
        {VALS.map(v=>(
          <button key={v} onClick={()=>onChange(v)}
            style={{flex:1,padding:'6px 2px',borderRadius:'6px',border:'none',cursor:'pointer',background:value===v?'rgba(0,255,136,0.15)':'rgba(255,255,255,0.05)',color:value===v?'#00ff88':'rgba(255,255,255,0.35)',fontSize:'11px',fontWeight:700,fontFamily:'Kanit,sans-serif',transition:'all 0.15s'}}>
            R${v}
          </button>
        ))}
      </div>
      <div style={{background:'rgba(0,255,136,0.06)',border:'1px solid rgba(0,255,136,0.12)',borderRadius:'10px',padding:'12px',marginBottom:'12px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>Investimento</span>
          <span style={{fontSize:'11px',fontWeight:700}}>R$ {Number(value).toFixed(2)}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>Multiplicador</span>
          <span style={{fontSize:'11px',fontWeight:700}}>{mult}x</span>
        </div>
        <div style={{height:'1px',background:'rgba(0,255,136,0.12)',margin:'6px 0'}}/>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:'12px',fontWeight:700}}>Se acertar</span>
          <span style={{fontSize:'16px',fontWeight:900,color:'#00ff88'}}>R$ {gain}</span>
        </div>
      </div>
      {user ? (
        <button style={{width:'100%',padding:'13px',borderRadius:'9px',border:'none',cursor:'pointer',background:'linear-gradient(135deg,#00ff88,#00cc66)',color:'#0a0a0a',fontWeight:900,fontSize:'14px',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 18px rgba(0,255,136,0.35)',letterSpacing:'0.02em',transition:'transform 0.15s'}}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(0.98)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
          CONFIRMAR R$ {Number(value).toFixed(2)}
        </button>
      ) : (
        <Link href="/login" style={{display:'block',textAlign:'center',padding:'13px',borderRadius:'9px',background:'linear-gradient(135deg,#00ff88,#00cc66)',color:'#0a0a0a',fontWeight:900,fontSize:'13px',textDecoration:'none',fontFamily:'Kanit,sans-serif'}}>
          ENTRAR PARA APOSTAR
        </Link>
      )}
    </div>
  )
}

function getTime(d:string):string {
  const diff=new Date(d).getTime()-Date.now()
  if(diff<=0) return 'Encerrado'
  const dy=Math.floor(diff/86400000)
  const h=Math.floor((diff%86400000)/3600000)
  const m=Math.floor((diff%3600000)/60000)
  if(dy>0) return `${dy}d ${h}h`
  if(h>0) return `${h}h ${m}m`
  return `${m}m`
}
