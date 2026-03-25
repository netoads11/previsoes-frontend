'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from './components/BottomNav'
import DepositModalComp from './components/DepositModal'

const API = 'http://187.77.248.115:3001'

const CATS = [
  { name: 'Live' },
  { name: 'Explorar' },
  { name: 'Economia' },
  { name: 'Entretenimento' },
  { name: 'Esportes' },
  { name: 'Criptomoedas' },
  { name: 'Geopolitica' },
  { name: 'Politica' },
]

interface MarketOption {
  id: string
  title: string
  yes_odds: number
  no_odds: number
  yes_percent: number
  no_percent: number
  order_index: number
}

interface Market {
  id: string
  question: string
  yes_odds: number
  no_odds: number
  category?: string
  status?: string
  expires_at?: string
  image_url?: string
  type?: string
  options?: MarketOption[]
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
  const [betValue, setBetValue] = useState('')
  const [marketModal, setMarketModal] = useState<Market|null>(null)
  const [modalBetChoice, setModalBetChoice] = useState<'yes'|'no'|null>(null)
  const [modalOption, setModalOption] = useState<any>(null)
  const [cd, setCd] = useState<{d:number,h:number,m:number,s:number}|null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [depositModal, setDepositModal] = useState(false)
  const [minDeposit, setMinDeposit] = useState('10.00')
  const [activeNav, setActiveNav] = useState('mercados')
  const [authModal, setAuthModal] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    const t = localStorage.getItem('token')
    if (t) {
      fetch(API + '/api/wallet/balance', { headers: { 'Authorization': 'Bearer ' + t } })
        .then(r => r.json())
        .then(d => setBalance(Number(d.balance) || 0))
        .catch(() => {})
    }
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    fetch(API + '/api/settings/public').then(r=>r.json()).then(d=>{ if(d.min_deposit) setMinDeposit(d.min_deposit) }).catch(()=>{})
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(d => { setMarkets(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (marketModal) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [marketModal])

  useEffect(() => {
    if (!marketModal) { setCd(null); return }
    // Use expires_at or fallback to 30 days from now for display
    const target = marketModal.expires_at
      ? new Date(marketModal.expires_at).getTime()
      : Date.now() + 30 * 24 * 60 * 60 * 1000
    const calc = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setCd({d:0,h:0,m:0,s:0}); return }
      setCd({
        d: Math.floor(diff/86400000),
        h: Math.floor((diff%86400000)/3600000),
        m: Math.floor((diff%3600000)/60000),
        s: Math.floor((diff%60000)/1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [marketModal])

  function getInitials(name: string) {
    return name.split(' ').filter(Boolean).map((n:string)=>n[0]).slice(0,2).join('').toUpperCase()
  }

  function handleBetClick(m: Market, c: 'yes'|'no') {
    if (!user) { setAuthModal(true); return }
    setBetPanel({market:m, choice:c}); setBetValue('')
  }

  function handleCardClick(m: Market) {
    if (!user) { setAuthModal(true); return }
    setMarketModal(m); setModalBetChoice(null); setModalOption(null); setBetValue('')
  }

  function handleOptionClick(m: Market, opt: any, choice: 'yes'|'no') {
    if (!user) { setAuthModal(true); return }
    setMarketModal(m); setModalOption(opt); setModalBetChoice(choice); setBetValue('')
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUserMenuOpen(false)
    window.location.reload()
  }

  function toggleFav(id: string) {
    setFavs(f => { const n = f.includes(id)?f.filter(x=>x!==id):[...f,id]; localStorage.setItem('favorites',JSON.stringify(n)); return n })
  }

  const filtered = markets.filter(m => {
    if (cat==='Favoritos') return favs.includes(m.id)
    if (cat==='Live') return m.status==='live'
    if (cat==='Explorar') return busca===''||m.question.toLowerCase().includes(busca.toLowerCase())
    return m.category===cat&&(busca===''||m.question.toLowerCase().includes(busca.toLowerCase()))
  })

  const byCategory = CATS.slice(2).reduce((acc:any[],c)=>{
    const mkts=markets.filter(m=>m.category===c.name)
    if(mkts.length>0) acc.push({cat:c,markets:mkts})
    return acc
  },[])

  const [balance, setBalance] = useState(0)

  // BET PANEL VALUES
  const betMarket = betPanel?.market
  const betChoice = betPanel?.choice
  const yes = Number(betMarket?.yes_odds)||50
  const no = Number(betMarket?.no_odds)||50
  const mult = betChoice==='yes'?(100/yes).toFixed(2):(100/no).toFixed(2)
  const betNum = Number(betValue)||0
  const gain = (betNum*Number(mult)).toFixed(2)
  const noBalance = Number(betNum) > Number(balance)
  const VALS = ['10','20','50','100']


  async function handleBet() {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    if (!betNum || betNum <= 0) return
    try {
      const res = await fetch(API + '/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ market_id: betMarket?.id, choice: betChoice, amount: betNum })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao apostar')
      setBalance(b => b - betNum)
      setBetPanel(null)
      setBetValue('')
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div style={{background:'#111',minHeight:'100vh',color:'#fff',fontFamily:'Inter,Kanit,sans-serif'}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        input,button,select{font-family:Inter,Kanit,sans-serif}
        .cat-scroll::-webkit-scrollbar{display:none}
        .btn-sim{background:rgba(0,200,83,0.12);color:#00c853;border:1px solid rgba(0,200,83,0.3);border-radius:8px;padding:9px 0;cursor:pointer;font-weight:700;font-size:13px;flex:1;transition:all 0.15s}
        .btn-sim:hover{background:#00c853;color:#000;box-shadow:0 0 14px rgba(0,200,83,0.4)}
        .btn-sim:active{transform:scale(0.97)}
        .btn-nao{background:rgba(198,40,40,0.12);color:#ef5350;border:1px solid rgba(198,40,40,0.3);border-radius:8px;padding:9px 0;cursor:pointer;font-weight:700;font-size:13px;flex:1;transition:all 0.15s}
        .btn-nao:hover{background:#c62828;color:#fff;box-shadow:0 0 14px rgba(198,40,40,0.4)}
        .btn-nao:active{transform:scale(0.97)}
        .mcard{background:#1a1a1a;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px;transition:all 0.2s;margin-bottom:8px}
        .mcard:hover{border-color:rgba(0,200,83,0.3);box-shadow:0 2px 16px rgba(0,0,0,0.5)}
        .sidebar-d{display:flex}
        .sidebar-r{display:flex}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .live-dot{animation:livePulse 1.2s infinite}
        .fadein{animation:fadeUp 0.25s ease forwards}
        .val-btn{padding:7px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:#fff;cursor:pointer;font-size:13px;font-weight:600;transition:all 0.15s}
        .val-btn.active{background:#00e676;color:#000;border-color:#00e676}
        .val-btn:hover{border-color:#00e676}
        @media(max-width:768px){
          .sidebar-d{display:none!important}
          .sidebar-r{display:none!important}
          .feed-main{padding:10px 10px 76px!important}
          .hero-h1{font-size:17px!important}
          .hide-mob{display:none!important}
          .show-mob{display:flex!important}
          .header-inner{padding:0 12px!important}
        }
      `}</style>

      {/* HEADER */}
      <header style={{background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:50,height:'54px',display:'flex',alignItems:'center'}}>
        {/* DESKTOP header */}
        <div className="header-inner hide-mob" style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'0 20px'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'7px',textDecoration:'none',flexShrink:0}}>
            <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'#00c853',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#000',fontWeight:900,fontSize:'13px'}}>P</span>
            </div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'15px'}}>Previmarket</span>
          </Link>
          <div style={{flex:1,position:'relative',margin:'0 12px'}}>
            <svg style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',width:'14px',height:'14px',color:'#666'}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Buscar mercado..." value={busca} onChange={e=>setBusca(e.target.value)}
              style={{width:'100%',background:'#2a2a2a',border:'1px solid #333',borderRadius:'20px',padding:'0 12px 0 30px',color:'#fff',fontSize:'13px',outline:'none',height:'36px'}}
              onFocus={e=>e.target.style.borderColor='#00c853'}
              onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.08)'}/>
          </div>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'10px'}}>
            {user ? (
              <>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'9px',color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',lineHeight:1}}>SALDO</div>
                  <div style={{fontSize:'14px',fontWeight:700,color:'#00c853'}}>R$ {balance.toFixed(2)}</div>
                </div>
                <button onClick={()=>setDepositModal(true)} style={{background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'8px 16px',fontWeight:700,fontSize:'12px',cursor:'pointer',boxShadow:'0 0 12px rgba(0,230,118,0.3)',transition:'opacity 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
                  onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                  + Depositar
                </button>
                {/* Avatar com dropdown */}
                <div style={{position:'relative'}}>
                  <button onClick={()=>setUserMenuOpen(v=>!v)} style={{
                    width:'34px',height:'34px',borderRadius:'50%',background:'#00c853',border:'none',
                    color:'#000',fontWeight:900,fontSize:'12px',cursor:'pointer',flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',
                  }}>{getInitials(user.name||user.email||'U')}</button>
                  {userMenuOpen && (
                    <div onClick={()=>setUserMenuOpen(false)} style={{
                      position:'fixed',inset:0,zIndex:998,
                    }}/>
                  )}
                  {userMenuOpen && (
                    <div style={{
                      position:'absolute',top:'42px',right:0,zIndex:999,
                      background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',
                      borderRadius:'12px',padding:'12px',minWidth:'200px',
                      boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
                    }}>
                      <div style={{marginBottom:'10px',paddingBottom:'10px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                        <div style={{fontSize:'13px',fontWeight:700,color:'#fff'}}>{user.name||'Usuário'}</div>
                        <div style={{fontSize:'11px',color:'#666',marginTop:'2px'}}>{user.email}</div>
                        <div style={{fontSize:'12px',color:'#00c853',fontWeight:700,marginTop:'4px'}}>R$ {balance.toFixed(2)}</div>
                      </div>
                      <button onClick={()=>{setUserMenuOpen(false);router.push('/perfil')}} style={{
                        width:'100%',padding:'8px 10px',borderRadius:'8px',border:'none',
                        background:'rgba(255,255,255,0.05)',color:'#fff',fontSize:'12px',
                        cursor:'pointer',textAlign:'left',marginBottom:'6px',
                      }}>👤 Meu Perfil</button>
                      <button onClick={handleLogout} style={{
                        width:'100%',padding:'8px 10px',borderRadius:'8px',border:'none',
                        background:'rgba(239,68,68,0.08)',color:'#ef4444',fontSize:'12px',
                        cursor:'pointer',textAlign:'left',
                      }}>Sair</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={()=>router.push('/login')} style={{
                  background:'transparent',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',
                  borderRadius:'8px',padding:'7px 16px',fontWeight:600,fontSize:'12px',cursor:'pointer',
                }}>Entrar</button>
                <button onClick={()=>router.push('/cadastrar')} style={{
                  background:'#00e676',color:'#000',border:'none',borderRadius:'8px',
                  padding:'7px 16px',fontWeight:700,fontSize:'12px',cursor:'pointer',
                  boxShadow:'0 0 12px rgba(0,230,118,0.3)',
                }}>Cadastrar</button>
              </>
            )}
          </div>
        </div>
        {/* MOBILE header */}
        <div className="show-mob" style={{width:'100%',display:'none',alignItems:'center',justifyContent:'space-between',padding:'0 14px'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'6px',textDecoration:'none',flexShrink:0}}>
            <div style={{width:'26px',height:'26px',borderRadius:'6px',background:'#00c853',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#000',fontWeight:900,fontSize:'12px'}}>P</span>
            </div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'14px'}}>Previmarket</span>
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            {user ? (
              <>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'9px',color:'#888',letterSpacing:'0.06em',textTransform:'uppercase',lineHeight:1}}>SALDO</div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#00c853'}}>R$ {balance.toFixed(2)}</div>
                </div>
                <button onClick={()=>setDepositModal(true)} style={{background:'#00e676',color:'#000',border:'none',borderRadius:'7px',padding:'7px 12px',fontWeight:700,fontSize:'11px',cursor:'pointer',boxShadow:'0 0 10px rgba(0,230,118,0.3)',whiteSpace:'nowrap'}}>
                  + Depositar
                </button>
              </>
            ) : (
              <>
                <button onClick={()=>router.push('/login')} style={{
                  background:'transparent',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',
                  borderRadius:'7px',padding:'6px 12px',fontWeight:600,fontSize:'11px',cursor:'pointer',
                }}>Entrar</button>
                <button onClick={()=>router.push('/cadastrar')} style={{
                  background:'#00e676',color:'#000',border:'none',borderRadius:'7px',
                  padding:'6px 12px',fontWeight:700,fontSize:'11px',cursor:'pointer',
                }}>Cadastrar</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* CATEGORIAS */}
      <div className="cat-scroll" style={{display:'flex',gap:'4px',padding:'8px 16px',overflowX:'auto',background:'#111',borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
        {CATS.map(c=>{
          const active=cat===c.name
          const isLive=c.name==='Live'
          return (
            <button key={c.name} onClick={()=>setCat(c.name)}
              style={{flexShrink:0,display:'flex',alignItems:'center',gap:'5px',padding:'5px 14px',borderRadius:'20px',border:'none',cursor:'pointer',background:active?'#00c853':'transparent',color:active?'#000':'rgba(255,255,255,0.6)',fontSize:'12px',fontWeight:active?700:400,transition:'all 0.15s'}}>
              {isLive && <span className="live-dot" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#ff4444',display:'inline-block',flexShrink:0}}/>}
              {c.name==='Explorar' && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:0.7}}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>}
              {c.name==='Economia' && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:0.7}}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              {c.name==='Entretenimento' && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:0.7}}><polygon points="5 3 19 12 5 21 5 3"/></svg>}
              {c.name==='Esportes' && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:0.7}}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>}
              {c.name==='Criptomoedas' && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:0.7}}><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>}
              {c.name==='Geopolitica' && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:0.7}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
              {c.name==='Politica' && <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{opacity:0.7}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              {c.name}
            </button>
          )
        })}
      </div>

      <div style={{display:'flex'}}>
        {/* SIDEBAR ESQUERDA */}
        <aside className="sidebar-d" style={{width:'190px',flexShrink:0,background:'#111',borderRight:'1px solid rgba(255,255,255,0.06)',padding:'12px 0',position:'sticky',top:'54px',height:'calc(100vh - 54px)',overflowY:'auto',flexDirection:'column'}}>
          <p style={{color:'#555',fontSize:'9px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',padding:'0 14px 8px'}}>CATEGORIAS</p>
          <nav>
            {CATS.map(c=>{
              const active=cat===c.name
              const isLive=c.name==='Live'
              return (
                <button key={c.name} onClick={()=>setCat(c.name)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:'8px',padding:'8px 14px',border:'none',cursor:'pointer',background:'transparent',borderLeft:active?'2px solid #00c853':'2px solid transparent',color:active?'#00c853':'#888',fontSize:'12px',fontWeight:active?600:400,transition:'all 0.15s',textAlign:'left'}}>
                  {isLive&&<span className="live-dot" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#ff4444',display:'inline-block'}}/>}
                  {c.name}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* FEED */}
        <main className="feed-main" style={{flex:1,padding:'14px 14px',overflowY:'auto',minWidth:0}}>

          {/* HERO */}
          <div style={{background:'#1b3a2a',border:'1px solid rgba(0,200,83,0.15)',borderRadius:'12px',padding:'18px 20px',marginBottom:'14px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,right:0,width:'40%',height:'100%',background:'linear-gradient(135deg,transparent,rgba(0,200,83,0.06))'}}/>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'6px'}}>
              <span className="live-dot" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#ff4444',display:'inline-block'}}/>
              <span style={{color:'#ff6b6b',fontSize:'10px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}}>AO VIVO · {markets.length} mercados</span>
            </div>
            <h1 className="hero-h1" style={{fontSize:'20px',fontWeight:900,color:'#fff',textTransform:'uppercase',marginBottom:'4px',lineHeight:1.2}}>
              TUDO QUE BOMBA<br/>
              <span style={{color:'#00e676'}}>NA INTERNET ESTÁ AQUI!!</span>
            </h1>
            <p style={{color:'#aaa',fontSize:'12px',marginBottom:'12px'}}>Preveja eventos reais · Ganhe dinheiro via PIX</p>
            <Link href="/cadastrar" style={{display:'inline-flex',alignItems:'center',gap:'5px',background:'transparent',color:'#00c853',border:'1px solid #00c853',borderRadius:'7px',padding:'7px 16px',fontWeight:700,fontSize:'12px',textDecoration:'none',transition:'all 0.15s'}}
              onMouseEnter={(e:any)=>{e.currentTarget.style.background='#00c853';e.currentTarget.style.color='#000'}}
              onMouseLeave={(e:any)=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#00c853'}}>
              Começar grátis →
            </Link>
          </div>

          {/* MERCADOS */}
          {cat==='Explorar'&&!busca ? (
            <div>
              {loading?<Skel/>:markets.length===0?<Empty/>:(
                <>
                  <SHead title="EM ALTA" count={markets.length} onMore={()=>{}}/>
                  {markets.slice(0,4).map((m,i)=><MCard key={m.id} m={m} i={i} onBet={handleBetClick} fav={favs.includes(m.id)} onFav={toggleFav} onCardClick={handleCardClick} onOptionClick={handleOptionClick}/>)}
                  {byCategory.map(({cat:c,markets:mkts}:any)=>(
                    <div key={c.name} style={{marginTop:'16px'}}>
                      <SHead title={c.name.toUpperCase()} count={mkts.length} onMore={()=>setCat(c.name)}/>
                      {mkts.slice(0,3).map((m:Market,i:number)=><MCard key={m.id} m={m} i={i} onBet={handleBetClick} fav={favs.includes(m.id)} onFav={toggleFav} onCardClick={handleCardClick} onOptionClick={handleOptionClick}/>)}
                    </div>
                  ))}
                </>
              )}
            </div>
          ):(
            <div>
              <SHead title={cat==='Favoritos'?'FAVORITOS':cat==='Live'?'AO VIVO':cat.toUpperCase()} count={filtered.length} onMore={()=>{}}/>
              {loading?<Skel/>:filtered.length===0?<Empty/>:filtered.map((m,i)=><MCard key={m.id} m={m} i={i} onBet={handleBetClick} fav={favs.includes(m.id)} onFav={toggleFav} onCardClick={handleCardClick} onOptionClick={handleOptionClick}/>)}
            </div>
          )}
        </main>

        {/* PAINEL APOSTA DESKTOP */}
        <aside className="sidebar-r" style={{width:'290px',flexShrink:0,background:'#111',borderLeft:'1px solid rgba(255,255,255,0.06)',padding:'16px',position:'sticky',top:'54px',height:'calc(100vh - 54px)',overflowY:'auto',flexDirection:'column'}}>
          {betPanel ? (
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                <h3 style={{fontSize:'14px',fontWeight:700}}>Sua Previsão</h3>
                <button onClick={()=>setBetPanel(null)} style={{background:'#1e1e1e',border:'none',cursor:'pointer',color:'#888',width:'26px',height:'26px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>×</button>
              </div>
              <div style={{background:'#1a1a1a',borderRadius:'10px',padding:'10px',marginBottom:'12px',border:'1px solid rgba(255,255,255,0.06)'}}>
                <p style={{fontSize:'11px',color:'#888',marginBottom:'6px',lineHeight:1.4}}>{betMarket?.question}</p>
                <span style={{display:'inline-flex',alignItems:'center',gap:'5px',padding:'4px 10px',borderRadius:'5px',fontSize:'12px',fontWeight:700,background:betChoice==='yes'?'rgba(0,200,83,0.12)':'rgba(198,40,40,0.12)',color:betChoice==='yes'?'#00c853':'#ef5350',border:`1px solid ${betChoice==='yes'?'rgba(0,200,83,0.25)':'rgba(198,40,40,0.25)'}`}}>
                  {betChoice==='yes'?'✓ SIM':'✗ NÃO'} · {mult}x
                </span>
              </div>

              <div style={{textAlign:'center',marginBottom:'10px'}}>
                <div style={{fontSize:'36px',fontWeight:900,color:'#fff',letterSpacing:'-0.02em'}}>
                  R$ {betNum.toFixed(2)}
                </div>
                <div style={{fontSize:'11px',color:'#666'}}>Saldo: R$ {balance.toFixed(2)}</div>
              </div>

              <div style={{display:'flex',gap:'5px',marginBottom:'10px',flexWrap:'wrap'}}>
                {VALS.map(v=>(
                  <button key={v} onClick={()=>setBetValue(v)} className={`val-btn ${betValue===v?'active':''}`}>
                    R${v}
                  </button>
                ))}
                <button onClick={()=>setBetValue(String(balance))} className="val-btn">MAX</button>
              </div>

              <div style={{background:'#1a1a1a',borderRadius:'10px',padding:'12px',marginBottom:'12px',border:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <p style={{fontSize:'12px',fontWeight:600,marginBottom:'3px'}}>Se acertar ganha</p>
                    <p style={{fontSize:'11px',color:'#666'}}>Custo: R$ {betNum.toFixed(2)} · Odd: {mult}x</p>
                  </div>
                  <span style={{fontSize:'20px',fontWeight:900,color:'#00c853'}}>R$ {gain}</span>
                </div>
              </div>

              {noBalance && betNum>0 && (
                <div style={{textAlign:'center',marginBottom:'10px'}}>
                  <p style={{color:'#ef5350',fontSize:'12px',marginBottom:'2px'}}>Você não tem saldo suficiente para esta previsão.</p>
                  <p style={{color:'#ef5350',fontSize:'12px'}}>Deposite R$ {(Number(betNum)-Number(balance)).toFixed(2)} para continuar.</p>
                </div>
              )}

              {noBalance && betNum>0 ? (
                <button onClick={()=>setDepositModal(true)} style={{width:'100%',padding:'13px',borderRadius:'9px',border:'none',cursor:'pointer',background:'#00e676',color:'#000',fontWeight:900,fontSize:'14px',boxShadow:'0 0 16px rgba(0,230,118,0.3)'}}>
                  Depositar R$ {(Number(betNum)-Number(balance)).toFixed(2)}
                </button>
              ) : (
                <button style={{width:'100%',padding:'13px',borderRadius:'9px',border:'none',cursor:'pointer',background: betNum>0?'#00e676':'#333',color: betNum>0?'#000':'#666',fontWeight:900,fontSize:'14px',boxShadow: betNum>0?'0 0 16px rgba(0,230,118,0.3)':'none',transition:'all 0.2s'}} onClick={handleBet} disabled={betNum<=0}>
                  {betChoice==='yes'?'SIM':'NÃO'} R$ {betNum.toFixed(2)}
                </button>
              )}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'48px 12px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#1e1e1e',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
                <svg width="18" height="18" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <p style={{fontWeight:600,marginBottom:'5px',fontSize:'14px'}}>Faça sua previsão</p>
              <p style={{color:'#555',fontSize:'12px',lineHeight:1.5}}>Clique em <span style={{color:'#00c853',fontWeight:700}}>SIM</span> ou <span style={{color:'#ef5350',fontWeight:700}}>NÃO</span> em qualquer mercado</p>
            </div>
          )}
        </aside>
      </div>

      {isMobile && <BottomNav activePage="home" onDeposit={()=>setDepositModal(true)} />}
      {/* BOTTOM SHEET APOSTA - MOBILE ONLY */}
      {isMobile && betPanel && (
        <>
          {/* Overlay escuro - clique para fechar */}
          <div
            onClick={() => { setBetPanel(null); setBetValue('') }}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:1001}}
          />
          {/* Painel */}
          <div style={{
            position:'fixed',bottom:0,left:0,right:0,zIndex:1002,
            background:'#161616',
            borderRadius:'20px 20px 0 0',
            border:'1px solid rgba(255,255,255,0.08)',
            borderBottom:'none',
            padding:'0 16px 32px',
            boxShadow:'0 -8px 40px rgba(0,0,0,0.6)'
          }}>
            {/* Handle bar */}
            <div style={{display:'flex',justifyContent:'center',padding:'12px 0 4px'}}>
              <div style={{width:'36px',height:'4px',borderRadius:'2px',background:'rgba(255,255,255,0.15)'}}/>
            </div>

            {/* Cabeçalho: mercado + fechar */}
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'12px',paddingTop:'4px'}}>
              <div style={{flex:1,paddingRight:'12px'}}>
                <p style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',marginBottom:'4px',lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                  {betMarket?.question}
                </p>
                <span style={{
                  display:'inline-flex',alignItems:'center',gap:'5px',
                  padding:'3px 10px',borderRadius:'5px',fontSize:'12px',fontWeight:700,
                  background:betChoice==='yes'?'rgba(0,200,83,0.12)':'rgba(198,40,40,0.12)',
                  color:betChoice==='yes'?'#00c853':'#ef5350',
                  border:`1px solid ${betChoice==='yes'?'rgba(0,200,83,0.25)':'rgba(198,40,40,0.25)'}`
                }}>
                  {betChoice==='yes'?'✓ SIM':'✗ NÃO'} · {mult}x
                </span>
              </div>
              <button
                onClick={() => { setBetPanel(null); setBetValue('') }}
                style={{background:'#2a2a2a',border:'none',cursor:'pointer',color:'#888',width:'28px',height:'28px',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}
              >×</button>
            </div>

            {/* Valor grande */}
            <div style={{textAlign:'center',marginBottom:'12px'}}>
              <div style={{fontSize:'42px',fontWeight:900,color:'#fff',letterSpacing:'-0.02em',lineHeight:1}}>
                R$ {betNum.toFixed(2)}
              </div>
              <div style={{fontSize:'11px',color:'#666',marginTop:'4px'}}>Saldo: R$ {balance.toFixed(2)}</div>
            </div>

            {/* Botões de valor */}
            <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
              {VALS.map(v => (
                <button
                  key={v}
                  onClick={() => setBetValue(v)}
                  style={{
                    flex:1,padding:'9px 0',borderRadius:'8px',fontSize:'13px',fontWeight:600,cursor:'pointer',
                    border:`1px solid ${betValue===v?'#00e676':'rgba(255,255,255,0.15)'}`,
                    background:betValue===v?'#00e676':'transparent',
                    color:betValue===v?'#000':'#fff',
                    transition:'all 0.15s'
                  }}
                >R${v}</button>
              ))}
              <button
                onClick={() => setBetValue(String(balance))}
                style={{
                  flex:1,padding:'9px 0',borderRadius:'8px',fontSize:'13px',fontWeight:600,cursor:'pointer',
                  border:`1px solid ${betValue===String(balance)&&balance>0?'#00e676':'rgba(255,255,255,0.15)'}`,
                  background:betValue===String(balance)&&balance>0?'#00e676':'transparent',
                  color:betValue===String(balance)&&balance>0?'#000':'#fff',
                  transition:'all 0.15s'
                }}
              >MAX</button>
            </div>

            {/* Se acertar ganha */}
            <div style={{background:'#1e1e1e',borderRadius:'10px',padding:'12px',marginBottom:'12px',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{fontSize:'12px',fontWeight:600,marginBottom:'2px'}}>Se acertar ganha</p>
                  <p style={{fontSize:'11px',color:'#666'}}>Custo: R$ {betNum.toFixed(2)} · Odd: {mult}x</p>
                </div>
                <span style={{fontSize:'22px',fontWeight:900,color:'#00c853'}}>R$ {gain}</span>
              </div>
            </div>

            {/* Aviso saldo insuficiente */}
            {noBalance && betNum > 0 && (
              <div style={{textAlign:'center',marginBottom:'10px'}}>
                <p style={{color:'#ef5350',fontSize:'12px',marginBottom:'2px'}}>Saldo insuficiente para esta previsão.</p>
                <p style={{color:'#ef5350',fontSize:'12px'}}>Deposite R$ {(Number(betNum)-Number(balance)).toFixed(2)} para continuar.</p>
              </div>
            )}

            {/* Botão confirmar */}
            {noBalance && betNum > 0 ? (
              <button onClick={()=>setDepositModal(true)} style={{width:'100%',padding:'15px',borderRadius:'10px',border:'none',cursor:'pointer',background:'#00e676',color:'#000',fontWeight:900,fontSize:'15px',boxShadow:'0 0 20px rgba(0,230,118,0.35)'}}>
                Depositar R$ {(Number(betNum)-Number(balance)).toFixed(2)}
              </button>
            ) : (
              <button
                onClick={handleBet}
                disabled={betNum <= 0}
                style={{
                  width:'100%',padding:'15px',borderRadius:'10px',border:'none',
                  cursor:betNum>0?'pointer':'not-allowed',
                  background:betNum>0?'#00e676':'#2a2a2a',
                  color:betNum>0?'#000':'#555',
                  fontWeight:900,fontSize:'15px',
                  boxShadow:betNum>0?'0 0 20px rgba(0,230,118,0.35)':'none',
                  transition:'all 0.2s'
                }}
              >
                {betChoice==='yes'?'SIM':'NÃO'} · R$ {betNum.toFixed(2)}
              </button>
            )}
          </div>
        </>
      )}

      {/* MODAL MERCADO - MOBILE FULLSCREEN v3 */}
      {isMobile && marketModal && (() => {
        const mYes = Number(marketModal.yes_odds) || 50
        const mNo  = Number(marketModal.no_odds)  || 50
        const mYM  = (100 / mYes).toFixed(2)
        const mNM  = (100 / mNo).toFixed(2)
        const mOdd  = (modalOption && marketModal.type === 'multiple')
          ? (modalBetChoice === 'yes' ? (100 / Number(modalOption.yes_odds || 50)) : (100 / Number(modalOption.no_odds || 50)))
          : (modalBetChoice === 'yes' ? (100 / mYes) : (100 / mNo))
        const mGain = (betNum * mOdd).toFixed(2)
        const mNoBalance = Number(betNum) > Number(balance)

        const catKey = (marketModal.category || '').toLowerCase()
        const categoryGradMap: Record<string,string> = {
          entretenimento: 'linear-gradient(135deg, hsl(220 60% 15%), hsl(220 40% 8%))',
          economia:       'linear-gradient(135deg, hsl(160 60% 15%), hsl(160 40% 8%))',
          esportes:       'linear-gradient(135deg, hsl(142 60% 15%), hsl(142 40% 8%))',
          geopolitica:    'linear-gradient(135deg, hsl(30 60% 15%), hsl(30 40% 8%))',
          politica:       'linear-gradient(135deg, hsl(0 60% 15%), hsl(0 40% 8%))',
          criptomoedas:   'linear-gradient(135deg, hsl(270 60% 15%), hsl(270 40% 8%))',
          financeiro:     'linear-gradient(135deg, hsl(200 60% 15%), hsl(200 40% 8%))',
        }
        const categoryEmojiMap: Record<string,string> = {
          entretenimento: '🎬', economia: '📈', esportes: '⚽',
          geopolitica: '🌍', politica: '🗳️', criptomoedas: '₿', financeiro: '💰',
        }
        const bannerGrad  = categoryGradMap[catKey]  || 'linear-gradient(135deg, hsl(220 20% 12%), hsl(220 20% 6%))'
        const bannerEmoji = categoryEmojiMap[catKey] || '📊'

        const closeModal = () => { setMarketModal(null); setModalBetChoice(null); setModalOption(null); setBetValue('') }

        const QVALS = ['10','20','50','100']

        return (
          <div style={{
            position:'fixed',top:0,left:0,width:'100vw',height:'100vh',
            zIndex:9999,overflowY:'auto',background:'#0f0f0f',
            WebkitOverflowScrolling:'touch' as any
          }}>

            {/* ── BANNER 192px ── */}
            <div style={{position:'relative',height:'192px',flexShrink:0,background:bannerGrad,display:'flex',alignItems:'center',justifyContent:'center'}}>
              {marketModal.image_url && (
                <img src={marketModal.image_url} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.45}}/>
              )}
              <span style={{fontSize:'64px',lineHeight:1,position:'relative',zIndex:1,userSelect:'none'}}>{bannerEmoji}</span>
              <button
                onClick={closeModal}
                style={{
                  position:'absolute',top:'14px',right:'14px',zIndex:2,
                  width:'36px',height:'36px',borderRadius:'50%',
                  background:'rgba(20,20,20,0.8)',backdropFilter:'blur(8px)',
                  border:'1px solid rgba(255,255,255,0.12)',
                  color:'#fff',fontSize:'20px',lineHeight:1,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  cursor:'pointer',
                }}
              >×</button>
            </div>

            {/* ── TITLE ── */}
            <p style={{padding:'16px 20px 0',fontSize:'20px',fontWeight:700,lineHeight:1.3,color:'#fff',letterSpacing:'-0.01em'}}>
              {marketModal.question}
            </p>

            {/* ── PROBABILITY CARD ── */}
            {marketModal.type === 'multiple' && marketModal.options && marketModal.options.length > 0 ? (
              <div style={{margin:'20px 20px 0',background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'16px'}}>
                <div style={{fontSize:'10px',fontWeight:700,color:'#555',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px'}}>ESCOLHA UMA OPCAO</div>
                {marketModal.options.map((opt: any) => {
                  const isSelected = modalOption?.id === opt.id
                  const yp = Number(opt.yes_percent) || 50
                  const yOdd = (100/Number(opt.yes_odds||50)).toFixed(2)
                  const nOdd = (100/Number(opt.no_odds||50)).toFixed(2)
                  return (
                    <div key={opt.id} style={{marginBottom:'10px',padding:'12px',borderRadius:'10px',
                      background: isSelected ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? '#22c55e' : 'rgba(255,255,255,0.08)'}`,
                      transition:'all 0.15s'}}>
                      <div style={{marginBottom:'8px'}}>
                        <span style={{fontSize:'13px',fontWeight:600,color:'#fff'}}>{opt.title}</span>
                        <div style={{height:'3px',borderRadius:'2px',overflow:'hidden',display:'flex',marginTop:'6px'}}>
                          <div style={{width:`${yp}%`,background:'#22c55e'}}/>
                          <div style={{flex:1,background:'#444'}}/>
                        </div>
                        <div style={{fontSize:'10px',color:'#555',marginTop:'3px'}}>{yp}% SIM</div>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                        <button onClick={() => { setModalOption(opt); setModalBetChoice('yes') }}
                          style={{padding:'8px 0',borderRadius:'8px',cursor:'pointer',border:'none',
                            background: isSelected && modalBetChoice==='yes' ? 'rgba(34,197,94,0.18)' : 'rgba(34,197,94,0.06)',
                            outline: isSelected && modalBetChoice==='yes' ? '1.5px solid #22c55e' : '1px solid rgba(34,197,94,0.25)',
                            transition:'all 0.15s'}}>
                          <div style={{fontSize:'10px',fontWeight:700,color:'#22c55e',letterSpacing:'0.04em'}}>SIM</div>
                          <div style={{fontSize:'15px',fontWeight:800,color:'#22c55e',lineHeight:1.2}}>{yOdd}x</div>
                        </button>
                        <button onClick={() => { setModalOption(opt); setModalBetChoice('no') }}
                          style={{padding:'8px 0',borderRadius:'8px',cursor:'pointer',border:'none',
                            background: isSelected && modalBetChoice==='no' ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.06)',
                            outline: isSelected && modalBetChoice==='no' ? '1.5px solid #ef4444' : '1px solid rgba(239,68,68,0.25)',
                            transition:'all 0.15s'}}>
                          <div style={{fontSize:'10px',fontWeight:700,color:'#ef4444',letterSpacing:'0.04em'}}>NÃO</div>
                          <div style={{fontSize:'15px',fontWeight:800,color:'#ef4444',lineHeight:1.2}}>{nOdd}x</div>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
            <div style={{margin:'20px 20px 0',background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'16px'}}>
              {/* Row: SIM% | PROBABILIDADE | NÃO% */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                <span style={{fontSize:'15px',fontWeight:700,color:'#22c55e'}}>{mYes}% SIM</span>
                <span style={{fontSize:'9px',fontWeight:600,color:'#555',letterSpacing:'0.1em',textTransform:'uppercase'}}>PROBABILIDADE</span>
                <span style={{fontSize:'15px',fontWeight:700,color:'#ef4444'}}>{mNo}% NÃO</span>
              </div>
              {/* Bar */}
              <div style={{height:'10px',borderRadius:'5px',overflow:'hidden',display:'flex',marginBottom:'14px'}}>
                <div style={{width:`${mYes}%`,background:'#22c55e',transition:'width 0.5s ease'}}/>
                <div style={{flex:1,background:'#ef4444'}}/>
              </div>
              {/* SIM / NÃO buttons */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <button
                  onClick={() => setModalBetChoice('yes')}
                  style={{
                    padding:'14px 0',borderRadius:'12px',cursor:'pointer',
                    background: modalBetChoice==='yes' ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.06)',
                    border: `2px solid ${modalBetChoice==='yes' ? '#22c55e' : 'rgba(34,197,94,0.25)'}`,
                    boxShadow: modalBetChoice==='yes' ? '0 0 16px rgba(34,197,94,0.25)' : 'none',
                    transition:'all 0.15s',
                  }}
                >
                  <div style={{fontSize:'11px',fontWeight:700,color:'#22c55e',letterSpacing:'0.06em',textTransform:'uppercase'}}>SIM</div>
                  <div style={{fontSize:'20px',fontWeight:900,color:'#22c55e',lineHeight:1.2}}>{mYM}x</div>
                </button>
                <button
                  onClick={() => setModalBetChoice('no')}
                  style={{
                    padding:'14px 0',borderRadius:'12px',cursor:'pointer',
                    background: modalBetChoice==='no' ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.06)',
                    border: `2px solid ${modalBetChoice==='no' ? '#ef4444' : 'rgba(239,68,68,0.25)'}`,
                    boxShadow: modalBetChoice==='no' ? '0 0 16px rgba(239,68,68,0.25)' : 'none',
                    transition:'all 0.15s',
                  }}
                >
                  <div style={{fontSize:'11px',fontWeight:700,color:'#ef4444',letterSpacing:'0.06em',textTransform:'uppercase'}}>NÃO</div>
                  <div style={{fontSize:'20px',fontWeight:900,color:'#ef4444',lineHeight:1.2}}>{mNM}x</div>
                </button>
              </div>
            </div>
            )}

            {/* ── BET CARD ── */}
            <div style={{margin:'16px 20px 0',background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'16px'}}>
              {/* Row: label + value | APOSTAR button */}
              {modalOption && marketModal.type === 'multiple' && (
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                  <span style={{flex:1,padding:'8px 12px',borderRadius:'8px',background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',fontSize:'12px',fontWeight:600,color:'#22c55e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    📌 {modalOption.title} · {modalBetChoice === 'yes' ? 'SIM' : 'NÃO'}
                  </span>
                  <button onClick={() => { setModalOption(null); setModalBetChoice(null) }}
                    style={{padding:'7px 12px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#888',fontSize:'11px',fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>
                    Trocar
                  </button>
                </div>
              )}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                <div>
                  <div style={{fontSize:'10px',fontWeight:700,color:'#555',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'2px'}}>VALOR DA APOSTA</div>
                  <div style={{fontSize:'30px',fontWeight:900,color:'#fff',letterSpacing:'-0.02em',lineHeight:1}}>R$ {betNum.toFixed(2)}</div>
                </div>
                <button
                  disabled={betNum <= 0 || !modalBetChoice}
                  onClick={async () => {
                    const token = localStorage.getItem('token')
                    if (!token) { setAuthModal(true); return }
                    if (betNum <= 0 || !modalBetChoice) return
                    try {
                      const res = await fetch(API + '/api/bets', {
                        method: 'POST',
                        headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
                        body: JSON.stringify({market_id:marketModal.id,choice:modalBetChoice,amount:betNum,...(modalOption?{option_id:modalOption.id}:{})})
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data.error||'Erro ao apostar')
                      setBalance(b => b - betNum)
                      setMarketModal(null); setModalBetChoice(null); setBetValue('')
                    } catch(err:any){ alert(err.message) }
                  }}
                  style={{
                    padding:'12px 20px',borderRadius:'12px',border:'none',
                    background: (betNum > 0 && modalBetChoice) ? '#22c55e' : '#222',
                    color: (betNum > 0 && modalBetChoice) ? '#000' : '#444',
                    fontWeight:900,fontSize:'14px',letterSpacing:'0.04em',
                    cursor:(betNum > 0 && modalBetChoice)?'pointer':'not-allowed',
                    boxShadow:(betNum > 0 && modalBetChoice)?'0 0 20px rgba(34,197,94,0.35)':'none',
                    transition:'all 0.2s',whiteSpace:'nowrap',
                  }}
                >APOSTAR</button>
              </div>
              {/* Input */}
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Digite o valor..."
                value={betValue}
                onChange={e => setBetValue(e.target.value)}
                style={{
                  width:'100%',padding:'12px',
                  background:'#111',border:'1px solid #333',borderRadius:'10px',
                  color:'#fff',fontSize:'20px',fontWeight:700,
                  textAlign:'center',outline:'none',
                  appearance:'none' as any, MozAppearance:'textfield' as any,
                  marginBottom:'10px',boxSizing:'border-box',
                }}
                onFocus={e=>{e.target.style.borderColor='#22c55e'}}
                onBlur={e=>{e.target.style.borderColor='#333'}}
              />
              {/* Quick buttons: 5 cols */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'6px'}}>
                {QVALS.map(v => (
                  <button
                    key={v}
                    onClick={() => setBetValue(v)}
                    style={{
                      padding:'9px 0',borderRadius:'8px',fontSize:'12px',fontWeight:700,cursor:'pointer',
                      border:`1px solid ${betValue===v?'#22c55e':'rgba(255,255,255,0.1)'}`,
                      background:betValue===v?'rgba(34,197,94,0.15)':'#111',
                      color:betValue===v?'#22c55e':'#888',transition:'all 0.12s',
                    }}
                  >R${v}</button>
                ))}
                <button
                  onClick={() => setBetValue(String(Math.floor(balance)))}
                  style={{
                    padding:'9px 0',borderRadius:'8px',fontSize:'12px',fontWeight:700,cursor:'pointer',
                    border:`1px solid ${betValue===String(Math.floor(balance))&&balance>0?'#22c55e':'rgba(255,255,255,0.1)'}`,
                    background:betValue===String(Math.floor(balance))&&balance>0?'rgba(34,197,94,0.15)':'#111',
                    color:betValue===String(Math.floor(balance))&&balance>0?'#22c55e':'#888',transition:'all 0.12s',
                  }}
                >MAX</button>
              </div>
            </div>

            {/* ── RETORNO POTENCIAL ── */}
            {betNum > 0 && modalBetChoice && (
              <div style={{margin:'12px 20px 0',textAlign:'center'}}>
                <span style={{fontSize:'12px',color:'#555'}}>Retorno potencial: </span>
                <span style={{fontSize:'14px',fontWeight:700,color:'#22c55e'}}>R$ {mGain}</span>
                <span style={{fontSize:'11px',color:'#444'}}> (odd {mOdd.toFixed(2)}x)</span>
              </div>
            )}

            {/* ── COUNTDOWN CARD ── */}
            <div style={{margin:'16px 20px 96px',background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'16px'}}>
              <div style={{fontSize:'10px',fontWeight:700,color:'#555',letterSpacing:'0.1em',textTransform:'uppercase',textAlign:'center',marginBottom:'12px'}}>
                {marketModal.expires_at ? 'O MERCADO FECHARÁ EM' : 'MERCADO ABERTO'}
              </div>
              {cd ? (
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'4px'}}>
                  {([{v:cd.d,l:'DIAS'},{v:cd.h,l:'HORAS'},{v:cd.m,l:'MIN'},{v:cd.s,l:'SEG'}] as {v:number,l:string}[]).map(({v,l},i)=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:'4px'}}>
                      <div style={{
                        width:'56px',background:'#111',
                        border:'1px solid rgba(34,197,94,0.3)',
                        borderRadius:'10px',padding:'10px 4px',textAlign:'center',
                      }}>
                        <div style={{fontSize:'22px',fontWeight:900,color:'#fff',letterSpacing:'-0.02em',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>
                          {String(v).padStart(2,'0')}
                        </div>
                        <div style={{fontSize:'9px',fontWeight:600,color:'#22c55e',letterSpacing:'0.08em',marginTop:'3px'}}>{l}</div>
                      </div>
                      {i < 3 && <span style={{color:'#22c55e',fontSize:'20px',fontWeight:900,marginBottom:'14px'}}>:</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign:'center',color:'#22c55e',fontSize:'14px',fontWeight:600}}>—</div>
              )}
            </div>

          </div>
        )
      })()}

      {/* MODAL AUTH - precisa de conta para apostar */}
      {authModal && (
        <div style={{position:'fixed',inset:0,zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}
          onClick={()=>setAuthModal(false)}>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}/>
          <div onClick={e=>e.stopPropagation()} style={{
            position:'relative',zIndex:1,background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:'16px',padding:'28px 24px',maxWidth:'340px',width:'100%',textAlign:'center',
          }}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>🔐</div>
            <h3 style={{fontSize:'17px',fontWeight:800,color:'#fff',marginBottom:'8px'}}>Crie sua conta para apostar</h3>
            <p style={{fontSize:'13px',color:'#666',marginBottom:'24px',lineHeight:1.5}}>Para apostar você precisa ter uma conta. É grátis e leva menos de 1 minuto.</p>
            <button onClick={()=>{setAuthModal(false);router.push('/cadastrar')}} style={{
              width:'100%',padding:'14px',borderRadius:'10px',border:'none',
              background:'#00e676',color:'#000',fontWeight:900,fontSize:'14px',cursor:'pointer',
              boxShadow:'0 0 20px rgba(0,230,118,0.3)',marginBottom:'10px',
            }}>Cadastrar grátis</button>
            <button onClick={()=>{setAuthModal(false);router.push('/login')}} style={{
              width:'100%',padding:'13px',borderRadius:'10px',
              border:'1px solid rgba(255,255,255,0.15)',
              background:'transparent',color:'#fff',fontWeight:600,fontSize:'13px',cursor:'pointer',
            }}>Já tenho conta, entrar</button>
          </div>
        </div>
      )}

      {/* MODAL DEPÓSITO */}
      {depositModal && <DepositModalComp onClose={()=>setDepositModal(false)} balance={balance} setBalance={setBalance} minDeposit={minDeposit} API={API}/>}

    </div>
  )
}

function SHead({title,count,onMore}:{title:string,count:number,onMore:()=>void}) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
        <svg width="13" height="13" fill="#ff6b35" viewBox="0 0 24 24"><path d="M12 2c0 0-5 6-5 11a5 5 0 0 0 10 0c0-5-5-11-5-11z"/></svg>
        <h2 style={{fontSize:'12px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#fff'}}>{title}</h2>
      </div>
      {count>0&&<button onClick={onMore} style={{background:'none',border:'none',cursor:'pointer',color:'#666',fontSize:'11px'}}>Ver mais {count} →</button>}
    </div>
  )
}

function Skel() {
  return <div style={{display:'grid',gap:'8px'}}>{[1,2,3].map(i=><div key={i} style={{height:'110px',borderRadius:'12px',background:'#1a1a1a'}}/>)}</div>
}

function Empty() {
  return (
    <div style={{textAlign:'center',padding:'40px 20px',background:'#1a1a1a',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.05)'}}>
      <svg width="28" height="28" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24" style={{margin:'0 auto 8px',display:'block'}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <p style={{color:'#555',fontSize:'12px'}}>Nenhum mercado encontrado</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE: MODAL DE DEPÓSITO
// ═══════════════════════════════════════════════════════════
function MCard({m,i,onBet,fav,onFav,onCardClick,onOptionClick}:{m:Market,i:number,onBet:(m:Market,c:'yes'|'no')=>void,fav:boolean,onFav:(id:string)=>void,onCardClick?:(m:Market)=>void,onOptionClick?:(m:Market,opt:any,choice:'yes'|'no')=>void}) {
  const yes=Number(m.yes_odds)||50
  const no=Number(m.no_odds)||50
  const yM=(100/yes).toFixed(2)
  const nM=(100/no).toFixed(2)

  return (
    <div className="mcard fadein" style={{animationDelay:`${i*0.03}s`,cursor:'pointer'}} onClick={()=>onCardClick&&onCardClick(m)}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'10px',marginBottom:'10px'}}>
        <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'#222',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <svg width="16" height="16" fill="none" stroke="#00c853" strokeWidth="1.5" viewBox="0 0 24 24">
            {m.category==='Esportes'&&<><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>}
            {m.category==='Criptomoedas'&&<path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/>}
            {m.category==='Politica'&&<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
            {m.category==='Entretenimento'&&<><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>}
            {m.category==='Economia'&&<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>}
            {!['Esportes','Criptomoedas','Politica','Entretenimento','Economia'].includes(m.category||'')&&<><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>}
          </svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          {m.category&&<span style={{background:'rgba(0,200,83,0.1)',color:'#00c853',fontSize:'9px',fontWeight:700,padding:'1px 6px',borderRadius:'3px',textTransform:'uppercase',letterSpacing:'0.05em',display:'inline-block',marginBottom:'4px'}}>{m.category}</span>}
          <p style={{color:'#fff',fontSize:'13px',fontWeight:600,lineHeight:1.35,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{m.question}</p>
          {m.type === 'multiple' && <span style={{background:'rgba(106,221,0,0.1)',color:'#6ADD00',fontSize:'9px',fontWeight:700,padding:'1px 6px',borderRadius:'3px',textTransform:'uppercase',letterSpacing:'0.05em',display:'inline-block',marginTop:'3px'}}>MULTIPLO</span>}
        </div>
        <button onClick={(e)=>{e.stopPropagation();onFav(m.id)}} style={{background:'none',border:'none',cursor:'pointer',padding:'2px',flexShrink:0,transition:'transform 0.15s'}}
          onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.2)')}
          onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
          <svg width="14" height="14" fill={fav?'#facc15':'none'} stroke={fav?'#facc15':'#555'} strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      </div>

      {m.type==='multiple' && m.options && m.options.length > 0 ? (
        <div style={{marginBottom:'8px'}}>
          {m.options.slice(0,3).map((opt:any)=>{
            const initials = opt.title.split(' ').filter(Boolean).map((w:string)=>w[0]).slice(0,2).join('').toUpperCase()
            const yOdd = (100/Number(opt.yes_odds||50)).toFixed(2)
            const nOdd = (100/Number(opt.no_odds||50)).toFixed(2)
            return (
              <div key={opt.id} style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'6px'}}>
                <div style={{width:'26px',height:'26px',borderRadius:'6px',background:'#2a2a2a',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'9px',fontWeight:700,color:'#888'}}>
                  {initials}
                </div>
                <span style={{flex:1,fontSize:'12px',color:'#ccc',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{opt.title}</span>
                <button onClick={(e)=>{e.stopPropagation();onOptionClick&&onOptionClick(m,opt,'yes')}}
                  style={{padding:'4px 7px',borderRadius:'6px',border:'1px solid rgba(34,197,94,0.3)',background:'rgba(34,197,94,0.08)',color:'#22c55e',fontSize:'10px',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>
                  SIM {yOdd}x
                </button>
                <button onClick={(e)=>{e.stopPropagation();onOptionClick&&onOptionClick(m,opt,'no')}}
                  style={{padding:'4px 7px',borderRadius:'6px',border:'1px solid rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.08)',color:'#ef4444',fontSize:'10px',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>
                  NÃO {nOdd}x
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <>
          {/* BARRA */}
          <div style={{marginBottom:'10px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
              <span style={{fontSize:'10px',color:'#00c853',fontWeight:700}}>{yes}% SIM</span>
              <span style={{fontSize:'10px',color:'#666'}}>chance</span>
              <span style={{fontSize:'10px',color:'#ef5350',fontWeight:700}}>{no}% NÃO</span>
            </div>
            <div style={{height:'4px',borderRadius:'2px',overflow:'hidden',display:'flex'}}>
              <div style={{width:`${yes}%`,background:'#00c853',transition:'width 0.5s ease'}}/>
              <div style={{flex:1,background:'#c62828'}}/>
            </div>
          </div>

          {/* BOTÕES */}
          <div style={{display:'flex',gap:'6px',marginBottom:'8px'}}>
            <button className="btn-sim" onClick={(e)=>{e.stopPropagation();onBet(m,'yes')}}>✓ SIM {yM}x</button>
            <button className="btn-nao" onClick={(e)=>{e.stopPropagation();onBet(m,'no')}}>✗ NÃO {nM}x</button>
          </div>
        </>
      )}

      <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill={getTimeColor(m.expires_at)}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
        <span style={{fontSize:'10px',color:getTimeColor(m.expires_at)}}>{getTimeLabel(m.expires_at)}</span>
      </div>
    </div>
  )
}

function getTimeLabel(d?:string):string {
  if(!d) return 'Aberto'
  const diff=new Date(d).getTime()-Date.now()
  if(diff<=0) return 'Encerrado'
  const dy=Math.floor(diff/86400000)
  const h=Math.floor((diff%86400000)/3600000)
  const m=Math.floor((diff%3600000)/60000)
  if(dy>0) return `${dy}d ${h}h`
  if(h>0) return `${h}h ${m}m`
  return `${m}m`
}

function getTimeColor(d?:string):string {
  if(!d) return '#888'
  const diff=new Date(d).getTime()-Date.now()
  if(diff<=0) return '#f44336'
  if(diff<86400000) return '#ff9800'
  return '#888'
}

function isUrgent(d:string):boolean {
  const diff=new Date(d).getTime()-Date.now()
  return diff>0&&diff<86400000
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
