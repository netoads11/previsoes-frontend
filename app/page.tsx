'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Star, Clock, TrendingUp, Home, DollarSign, Globe, Trophy, Tv, User, Zap, BarChart2, HelpCircle, Flame } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

const CATEGORIAS = [
  { name: 'Live', icon: Zap, emoji: '🔴' },
  { name: 'Explorar', icon: Flame, emoji: '🔥' },
  { name: 'Economia', icon: DollarSign, emoji: '💰' },
  { name: 'Entretenimento', icon: Tv, emoji: '🎬' },
  { name: 'Esportes', icon: Trophy, emoji: '⚽' },
  { name: 'Criptomoedas', icon: BarChart2, emoji: '₿' },
  { name: 'Geopolitica', icon: Globe, emoji: '🌍' },
  { name: 'Politica', icon: TrendingUp, emoji: '🏛️' },
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
  const [categoria, setCategoria] = useState('Explorar')
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
    if (categoria === 'Favoritos') return favorites.includes(m.id)
    if (categoria === 'Live') return m.status === 'live'
    if (categoria === 'Explorar') return true
    const matchCat = m.category === categoria
    const matchBusca = m.question.toLowerCase().includes(busca.toLowerCase())
    return matchCat && matchBusca
  }).filter(m => busca === '' || m.question.toLowerCase().includes(busca.toLowerCase()))

  function toggleFav(id: string) {
    setFavorites(f => {
      const n = f.includes(id) ? f.filter(x => x !== id) : [...f, id]
      localStorage.setItem('favorites', JSON.stringify(n))
      return n
    })
  }

  const categoriasPorGrupo = CATEGORIAS.slice(2).reduce((acc: any, cat) => {
    const mkt = markets.filter(m => m.category === cat.name)
    if (mkt.length > 0) acc.push({ cat, markets: mkt })
    return acc
  }, [])

  return (
    <div style={{background:'#0d0d0d',minHeight:'100vh',display:'flex',flexDirection:'column',fontFamily:'Kanit,sans-serif',color:'#fff'}}>
      <style>{`
        * { box-sizing: border-box; }
        .sidebar-left { display: flex; flex-direction: column; }
        .sidebar-right { display: flex; flex-direction: column; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .card-hover:hover { border-color: rgba(106,221,0,0.4) !important; transform: translateY(-1px); }
        .btn-sim:hover { background: #6ADD00 !important; color: #0a0a0a !important; }
        .btn-nao:hover { background: #ef4444 !important; color: #fff !important; }
        .btn-dep:hover { opacity: 0.85; }
        @keyframes live-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .animate-live { animation: live-pulse 1s infinite; }
        .animate-fade-up { animation: fade-up 0.3s ease forwards; }
        @media (max-width: 768px) {
          .sidebar-left { display: none !important; }
          .sidebar-right { display: none !important; }
          .main-feed { padding: 12px 12px 80px !important; }
          .header-balance { display: none; }
          .hero-title { font-size: 20px !important; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{background:'rgba(13,13,13,0.97)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:50,height:'58px',display:'flex',alignItems:'center',padding:'0 20px',gap:'14px'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',flexShrink:0}}>
          <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#6ADD00,#4ab800)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 14px rgba(106,221,0,0.5)'}}>
            <span style={{color:'#0a0a0a',fontWeight:900,fontSize:'14px'}}>P</span>
          </div>
          <span style={{color:'#fff',fontWeight:800,fontSize:'16px',letterSpacing:'0.01em'}}>Previmarket</span>
        </Link>

        <div style={{flex:1,position:'relative',maxWidth:'420px'}}>
          <Search style={{position:'absolute',left:'11px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)',width:'15px',height:'15px'}}/>
          <input type="text" placeholder="Pesquisar mercados..." value={busca} onChange={e=>setBusca(e.target.value)}
            style={{width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',padding:'8px 12px 8px 34px',color:'#fff',fontSize:'13px',outline:'none',fontFamily:'Kanit,sans-serif'}}
            onFocus={e=>e.target.style.borderColor='rgba(106,221,0,0.5)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
        </div>

        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
          {user ? (
            <>
              <div className="header-balance" style={{textAlign:'right'}}>
                <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',lineHeight:1}}>Saldo</div>
                <div style={{fontSize:'14px',fontWeight:700,color:'#6ADD00'}}>R$ 0,00</div>
              </div>
              <button className="btn-dep" style={{background:'linear-gradient(135deg,#6ADD00,#4ab800)',color:'#0a0a0a',border:'none',borderRadius:'8px',padding:'8px 18px',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 16px rgba(106,221,0,0.35)',transition:'opacity 0.15s'}}>
                + Depositar
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{color:'rgba(255,255,255,0.6)',textDecoration:'none',fontSize:'13px',fontWeight:500}}>Entrar</Link>
              <Link href="/cadastrar" style={{background:'linear-gradient(135deg,#6ADD00,#4ab800)',color:'#0a0a0a',borderRadius:'8px',padding:'8px 16px',fontWeight:800,fontSize:'13px',textDecoration:'none',boxShadow:'0 0 16px rgba(106,221,0,0.35)'}}>Registrar</Link>
            </>
          )}
        </div>
      </header>

      {/* CATEGORIAS */}
      <div className="cat-scroll" style={{display:'flex',gap:'6px',padding:'10px 16px',overflowX:'auto',background:'rgba(255,255,255,0.02)',borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
        {CATEGORIAS.map(cat => {
          const isActive = categoria === cat.name
          const isLive = cat.name === 'Live'
          return (
            <button key={cat.name} onClick={()=>setCategoria(cat.name)}
              style={{flexShrink:0,display:'flex',alignItems:'center',gap:'5px',padding:'6px 14px',borderRadius:'20px',border:isActive?'1px solid rgba(106,221,0,0.5)':'1px solid rgba(255,255,255,0.08)',cursor:'pointer',background:isActive?'rgba(106,221,0,0.15)':'rgba(255,255,255,0.04)',color:isActive?'#6ADD00':'rgba(255,255,255,0.5)',fontSize:'13px',fontWeight:isActive?700:400,fontFamily:'Kanit,sans-serif',transition:'all 0.15s'}}>
              {isLive && <span className="animate-live" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#ef4444',display:'inline-block'}}/>}
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>

      <div style={{display:'flex',flex:1}}>
        {/* SIDEBAR ESQUERDA */}
        <aside className="sidebar-left" style={{width:'200px',flexShrink:0,background:'rgba(255,255,255,0.02)',borderRight:'1px solid rgba(255,255,255,0.06)',padding:'16px 0',position:'sticky',top:'58px',height:'calc(100vh - 58px)',overflowY:'auto'}}>
          <p style={{color:'rgba(255,255,255,0.3)',fontSize:'10px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',padding:'0 16px 10px'}}>CATEGORIAS</p>
          <nav>
            {CATEGORIAS.map(cat => {
              const Icon = cat.icon
              const isActive = categoria === cat.name
              const isLive = cat.name === 'Live'
              return (
                <button key={cat.name} onClick={()=>setCategoria(cat.name)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'9px 16px',border:'none',cursor:'pointer',background:isActive?'rgba(106,221,0,0.08)':'transparent',borderLeft:isActive?'2px solid #6ADD00':'2px solid transparent',color:isActive?'#6ADD00':'rgba(255,255,255,0.45)',fontSize:'13px',fontWeight:isActive?600:400,fontFamily:'Kanit,sans-serif',transition:'all 0.15s',textAlign:'left'}}>
                  <span style={{fontSize:'15px'}}>{cat.emoji}</span>
                  {cat.name}
                  {isLive && <span className="animate-live" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#ef4444',display:'inline-block',marginLeft:'auto'}}/>}
                </button>
              )
            })}
          </nav>
          <div style={{padding:'16px',borderTop:'1px solid rgba(255,255,255,0.06)',marginTop:'auto'}}>
            <Link href="/duvidas" style={{color:'rgba(255,255,255,0.3)',textDecoration:'none',fontSize:'13px',display:'flex',alignItems:'center',gap:'6px'}}>
              <HelpCircle style={{width:'14px',height:'14px'}}/>
              Duvidas
            </Link>
          </div>
        </aside>

        {/* FEED PRINCIPAL */}
        <main className="main-feed" style={{flex:1,padding:'20px 16px',overflowY:'auto',minWidth:0}}>

          {/* HERO BANNER */}
          <div style={{background:'linear-gradient(135deg,rgba(106,221,0,0.12) 0%,rgba(0,0,0,0) 60%)',border:'1px solid rgba(106,221,0,0.15)',borderRadius:'14px',padding:'28px 32px',marginBottom:'24px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-40px',right:'-40px',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.08) 0%,transparent 70%)'}}/>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
              <span className="animate-live" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ef4444',display:'inline-block'}}/>
              <span style={{color:'#ef4444',fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>AO VIVO</span>
              <span style={{color:'rgba(255,255,255,0.3)',fontSize:'11px'}}>{markets.length} mercados abertos</span>
            </div>
            <h1 className="hero-title" style={{fontSize:'26px',fontWeight:900,color:'#fff',textTransform:'uppercase',marginBottom:'6px',lineHeight:1.2,letterSpacing:'0.01em'}}>
              TUDO QUE BOMBA<br/>
              <span style={{color:'#6ADD00',textShadow:'0 0 30px rgba(106,221,0,0.5)'}}>NA INTERNET ESTÁ AQUI!</span>
            </h1>
            <p style={{color:'rgba(255,255,255,0.45)',fontSize:'14px',marginBottom:'18px'}}>Preveja eventos reais e ganhe dinheiro real via PIX</p>
            <Link href="/cadastrar" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#6ADD00,#4ab800)',color:'#0a0a0a',borderRadius:'8px',padding:'10px 22px',fontWeight:800,fontSize:'13px',textDecoration:'none',boxShadow:'0 0 20px rgba(106,221,0,0.4)'}}>
              Comecar agora →
            </Link>
          </div>

          {/* MODO EXPLORAR — seções por categoria */}
          {categoria === 'Explorar' && !busca ? (
            <div>
              {loading ? (
                <div style={{display:'grid',gap:'10px'}}>
                  {[1,2,3].map(i=><div key={i} style={{height:'140px',borderRadius:'12px',background:'rgba(255,255,255,0.04)'}}/>)}
                </div>
              ) : markets.length === 0 ? (
                <EmptyState/>
              ) : (
                <div>
                  {/* DESTAQUES */}
                  <SectionHeader title="🔥 Em Alta" count={markets.length} onVerMais={()=>setCategoria('Explorar')}/>
                  <div style={{display:'grid',gap:'10px',marginBottom:'28px'}}>
                    {markets.slice(0,3).map((m,i)=>(
                      <MarketCard key={m.id} market={m} index={i} onBet={(market,choice)=>{setBetPanel({market,choice});setBetValue('10')}} isFav={favorites.includes(m.id)} onFav={toggleFav}/>
                    ))}
                  </div>

                  {/* SEÇÕES POR CATEGORIA */}
                  {categoriasPorGrupo.map(({cat,markets:mkts}:any) => (
                    <div key={cat.name} style={{marginBottom:'28px'}}>
                      <SectionHeader title={`${cat.emoji} ${cat.name}`} count={mkts.length} onVerMais={()=>setCategoria(cat.name)}/>
                      <div style={{display:'grid',gap:'10px'}}>
                        {mkts.slice(0,3).map((m:Market,i:number)=>(
                          <MarketCard key={m.id} market={m} index={i} onBet={(market,choice)=>{setBetPanel({market,choice});setBetValue('10')}} isFav={favorites.includes(m.id)} onFav={toggleFav}/>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <SectionHeader title={categoria==='Favoritos'?'⭐ Favoritos':categoria==='Live'?'🔴 Ao Vivo':categoria} count={filtrados.length} onVerMais={()=>{}}/>
              {loading ? (
                <div style={{display:'grid',gap:'10px'}}>
                  {[1,2,3].map(i=><div key={i} style={{height:'140px',borderRadius:'12px',background:'rgba(255,255,255,0.04)'}}/>)}
                </div>
              ) : filtrados.length===0 ? <EmptyState/> : (
                <div style={{display:'grid',gap:'10px'}}>
                  {filtrados.map((m,i)=>(
                    <MarketCard key={m.id} market={m} index={i} onBet={(market,choice)=>{setBetPanel({market,choice});setBetValue('10')}} isFav={favorites.includes(m.id)} onFav={toggleFav}/>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* PAINEL DE APOSTA DESKTOP */}
        <aside className="sidebar-right" style={{width:'300px',flexShrink:0,background:'rgba(255,255,255,0.02)',borderLeft:'1px solid rgba(255,255,255,0.06)',padding:'20px',position:'sticky',top:'58px',height:'calc(100vh - 58px)',overflowY:'auto'}}>
          {betPanel ? (
            <BetPanel panel={betPanel} value={betValue} onChange={setBetValue} onClose={()=>setBetPanel(null)} user={user}/>
          ) : (
            <div style={{textAlign:'center',padding:'48px 16px'}}>
              <div style={{fontSize:'40px',marginBottom:'14px'}}>🎯</div>
              <p style={{fontWeight:700,marginBottom:'6px',fontSize:'15px'}}>Faca sua previsao</p>
              <p style={{color:'rgba(255,255,255,0.35)',fontSize:'13px',lineHeight:1.5}}>
                Clique em <span style={{color:'#6ADD00',fontWeight:700}}>SIM</span> ou <span style={{color:'#ef4444',fontWeight:700}}>NAO</span> em qualquer mercado
              </p>
            </div>
          )}
        </aside>
      </div>

      <BottomNav categoria={categoria} setCategoria={setCategoria} user={user} router={router}/>
    </div>
  )
}

function SectionHeader({title,count,onVerMais}:{title:string,count:number,onVerMais:()=>void}) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
      <h2 style={{fontSize:'14px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',color:'#fff'}}>{title}</h2>
      {count > 0 && (
        <button onClick={onVerMais} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.35)',fontSize:'12px',fontFamily:'Kanit,sans-serif',display:'flex',alignItems:'center',gap:'4px'}}>
          Ver mais {count} →
        </button>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{textAlign:'center',padding:'48px 20px',background:'rgba(255,255,255,0.02)',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.06)'}}>
      <div style={{fontSize:'32px',marginBottom:'10px'}}>🔍</div>
      <p style={{color:'rgba(255,255,255,0.35)',fontSize:'13px'}}>Nenhum mercado encontrado</p>
    </div>
  )
}

function MarketCard({market,index,onBet,isFav,onFav}:{market:Market,index:number,onBet:(m:Market,c:'yes'|'no')=>void,isFav:boolean,onFav:(id:string)=>void}) {
  const yes = Number(market.yes_odds)||50
  const no = Number(market.no_odds)||50
  const yesMult = (100/yes).toFixed(2)
  const noMult = (100/no).toFixed(2)
  const isHot = yes >= 60 || no >= 60

  return (
    <div className="card-hover animate-fade-up" style={{animationDelay:`${index*0.04}s`,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'16px',transition:'all 0.2s',cursor:'default'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'10px',marginBottom:'12px'}}>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'6px',flexWrap:'wrap'}}>
            {market.category && (
              <span style={{background:'rgba(106,221,0,0.1)',color:'#6ADD00',fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'4px',textTransform:'uppercase',letterSpacing:'0.05em'}}>
                {market.category}
              </span>
            )}
            {isHot && (
              <span style={{background:'rgba(239,68,68,0.12)',color:'#ef4444',fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'4px'}}>
                🔥 Em Alta
              </span>
            )}
          </div>
          <p style={{color:'#fff',fontSize:'14px',fontWeight:600,lineHeight:1.4}}>{market.question}</p>
        </div>
        <button onClick={()=>onFav(market.id)} style={{background:'none',border:'none',cursor:'pointer',padding:'2px',flexShrink:0,transition:'transform 0.15s'}}
          onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.2)')}
          onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
          <Star style={{width:'15px',height:'15px',color:isFav?'#facc15':'rgba(255,255,255,0.25)',fill:isFav?'#facc15':'none',transition:'all 0.15s'}}/>
        </button>
      </div>

      {/* BARRA DE CHANCE */}
      <div style={{marginBottom:'12px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
          <span style={{fontSize:'11px',color:'#6ADD00',fontWeight:700}}>{yes}% SIM</span>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.3)'}}>chance</span>
          <span style={{fontSize:'11px',color:'#ef4444',fontWeight:700}}>{no}% NAO</span>
        </div>
        <div style={{height:'4px',borderRadius:'2px',background:'rgba(255,255,255,0.08)',overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:'2px',background:'linear-gradient(90deg,#6ADD00,rgba(106,221,0,0.4))',width:`${yes}%`,transition:'width 0.6s ease'}}/>
        </div>
      </div>

      {/* BOTÕES */}
      <div style={{display:'flex',gap:'8px'}}>
        <button className="btn-sim" onClick={()=>onBet(market,'yes')}
          style={{flex:1,padding:'10px',borderRadius:'8px',border:'1px solid rgba(106,221,0,0.3)',cursor:'pointer',background:'rgba(106,221,0,0.1)',color:'#6ADD00',fontWeight:800,fontSize:'14px',fontFamily:'Kanit,sans-serif',transition:'all 0.15s',letterSpacing:'0.01em'}}>
          ✅ SIM {yesMult}x
        </button>
        <button className="btn-nao" onClick={()=>onBet(market,'no')}
          style={{flex:1,padding:'10px',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.3)',cursor:'pointer',background:'rgba(239,68,68,0.1)',color:'#ef4444',fontWeight:800,fontSize:'14px',fontFamily:'Kanit,sans-serif',transition:'all 0.15s',letterSpacing:'0.01em'}}>
          ❌ NAO {noMult}x
        </button>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'10px'}}>
        <Clock style={{width:'11px',height:'11px',color:'rgba(255,255,255,0.25)'}}/>
        <span style={{fontSize:'11px',color:'rgba(255,255,255,0.25)'}}>
          {market.expires_at?`Encerra em ${getTimeLeft(market.expires_at)}`:'Aberto'}
        </span>
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
  const isYes = panel.choice === 'yes'

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
        <h3 style={{fontSize:'15px',fontWeight:800}}>Sua Previsao</h3>
        <button onClick={onClose} style={{background:'rgba(255,255,255,0.08)',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.6)',width:'28px',height:'28px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>×</button>
      </div>

      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'10px',padding:'12px',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.07)'}}>
        <p style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',marginBottom:'8px',lineHeight:1.4}}>{panel.market.question}</p>
        <div style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'5px 12px',borderRadius:'6px',fontSize:'13px',fontWeight:800,background:isYes?'rgba(106,221,0,0.15)':'rgba(239,68,68,0.15)',color:isYes?'#6ADD00':'#ef4444',border:`1px solid ${isYes?'rgba(106,221,0,0.3)':'rgba(239,68,68,0.3)'}`}}>
          {isYes?'✅ SIM':'❌ NAO'} · {mult}x
        </div>
      </div>

      <div style={{marginBottom:'10px'}}>
        <label style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Valor</label>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.4)',fontSize:'14px',fontWeight:600}}>R$</span>
          <input type="number" value={value} onChange={e=>onChange(e.target.value)}
            style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'12px 12px 12px 36px',color:'#fff',fontSize:'20px',fontWeight:800,outline:'none',fontFamily:'Kanit,sans-serif'}}
            onFocus={e=>e.target.style.borderColor='rgba(106,221,0,0.5)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
        </div>
      </div>

      <div style={{display:'flex',gap:'6px',marginBottom:'14px'}}>
        {VALORES.map(v=>(
          <button key={v} onClick={()=>onChange(v)}
            style={{flex:1,padding:'7px 4px',borderRadius:'7px',border:'none',cursor:'pointer',background:value===v?'rgba(106,221,0,0.2)':'rgba(255,255,255,0.06)',color:value===v?'#6ADD00':'rgba(255,255,255,0.4)',fontSize:'12px',fontWeight:700,fontFamily:'Kanit,sans-serif',transition:'all 0.15s'}}>
            R${v}
          </button>
        ))}
      </div>

      <div style={{background:'rgba(106,221,0,0.07)',border:'1px solid rgba(106,221,0,0.15)',borderRadius:'10px',padding:'14px',marginBottom:'14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
          <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>Investimento</span>
          <span style={{fontSize:'12px',fontWeight:700}}>R$ {Number(value).toFixed(2)}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
          <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>Multiplicador</span>
          <span style={{fontSize:'12px',fontWeight:700}}>{mult}x</span>
        </div>
        <div style={{height:'1px',background:'rgba(106,221,0,0.15)',margin:'8px 0'}}/>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:'14px',fontWeight:700}}>Se acertar</span>
          <span style={{fontSize:'18px',fontWeight:900,color:'#6ADD00'}}>R$ {gain}</span>
        </div>
      </div>

      {user ? (
        <button style={{width:'100%',padding:'14px',borderRadius:'9px',border:'none',cursor:'pointer',background:'linear-gradient(135deg,#6ADD00,#4ab800)',color:'#0a0a0a',fontWeight:900,fontSize:'15px',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 20px rgba(106,221,0,0.4)',letterSpacing:'0.02em'}}>
          CONFIRMAR R$ {Number(value).toFixed(2)}
        </button>
      ) : (
        <Link href="/login" style={{display:'block',textAlign:'center',padding:'14px',borderRadius:'9px',background:'linear-gradient(135deg,#6ADD00,#4ab800)',color:'#0a0a0a',fontWeight:900,fontSize:'14px',textDecoration:'none',fontFamily:'Kanit,sans-serif'}}>
          ENTRAR PARA APOSTAR
        </Link>
      )}
    </div>
  )
}

function BottomNav({categoria,setCategoria,user,router}:any) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  if (!isMobile) return null
  return (
    <nav style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(13,13,13,0.97)',borderTop:'1px solid rgba(255,255,255,0.08)',zIndex:100,padding:'6px 0 8px',display:'flex',backdropFilter:'blur(16px)'}}>
      {[
        {emoji:'🏠',label:'Mercados',action:()=>setCategoria('Explorar'),active:categoria==='Explorar'||categoria==='Live'},
        {emoji:'📊',label:'Portfolio',action:()=>router.push(user?'/perfil':'/login'),active:false},
        {emoji:'💰',label:'Depositar',action:()=>router.push(user?'/perfil':'/login'),active:false},
        {emoji:'❓',label:'Duvidas',action:()=>router.push('/duvidas'),active:false},
        {emoji:'👤',label:'Perfil',action:()=>router.push(user?'/perfil':'/login'),active:false},
      ].map(item=>(
        <button key={item.label} onClick={item.action}
          style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',border:'none',background:'transparent',cursor:'pointer',color:item.active?'#6ADD00':'rgba(255,255,255,0.35)',padding:'4px 0',fontFamily:'Kanit,sans-serif',transition:'color 0.15s'}}>
          <span style={{fontSize:'18px'}}>{item.emoji}</span>
          <span style={{fontSize:'10px',fontWeight:item.active?700:400}}>{item.label}</span>
        </button>
      ))}
    </nav>
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
