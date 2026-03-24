'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  const [betValue, setBetValue] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [activeNav, setActiveNav] = useState('mercados')

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
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(d => { setMarkets(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
    return () => window.removeEventListener('resize', check)
  }, [])

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
  const noBalance = betNum > balance
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
          .header-inner{padding:0 12px!important}
        }
      `}</style>

      {/* HEADER */}
      <header style={{background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:50,height:'54px',display:'flex',alignItems:'center'}}>
        <div className="header-inner" style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'0 20px'}}>
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
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'9px',color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',lineHeight:1}}>SALDO</div>
              <div style={{fontSize:'14px',fontWeight:700,color:'#00c853'}}>R$ {balance.toFixed(2)}</div>
            </div>
            <button style={{background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'8px 16px',fontWeight:700,fontSize:'12px',cursor:'pointer',boxShadow:'0 0 12px rgba(0,230,118,0.3)',transition:'opacity 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
              onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              + Depositar
            </button>
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
                  {markets.slice(0,4).map((m,i)=><MCard key={m.id} m={m} i={i} onBet={(m,c)=>{setBetPanel({market:m,choice:c});setBetValue('')}} fav={favs.includes(m.id)} onFav={toggleFav}/>)}
                  {byCategory.map(({cat:c,markets:mkts}:any)=>(
                    <div key={c.name} style={{marginTop:'16px'}}>
                      <SHead title={c.name.toUpperCase()} count={mkts.length} onMore={()=>setCat(c.name)}/>
                      {mkts.slice(0,3).map((m:Market,i:number)=><MCard key={m.id} m={m} i={i} onBet={(m,c)=>{setBetPanel({market:m,choice:c});setBetValue('')}} fav={favs.includes(m.id)} onFav={toggleFav}/>)}
                    </div>
                  ))}
                </>
              )}
            </div>
          ):(
            <div>
              <SHead title={cat==='Favoritos'?'FAVORITOS':cat==='Live'?'AO VIVO':cat.toUpperCase()} count={filtered.length} onMore={()=>{}}/>
              {loading?<Skel/>:filtered.length===0?<Empty/>:filtered.map((m,i)=><MCard key={m.id} m={m} i={i} onBet={(m,c)=>{setBetPanel({market:m,choice:c});setBetValue('')}} fav={favs.includes(m.id)} onFav={toggleFav}/>)}
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
                  <p style={{color:'#ef5350',fontSize:'12px'}}>Deposite R$ {(betNum-balance).toFixed(2)} para continuar.</p>
                </div>
              )}

              {noBalance && betNum>0 ? (
                <button style={{width:'100%',padding:'13px',borderRadius:'9px',border:'none',cursor:'pointer',background:'#00e676',color:'#000',fontWeight:900,fontSize:'14px',boxShadow:'0 0 16px rgba(0,230,118,0.3)'}}>
                  Depositar R$ {(betNum-balance).toFixed(2)}
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

      {/* BOTTOM NAV */}
      {isMobile && (
        <nav style={{position:'fixed',bottom:0,left:0,right:0,background:'#111111',borderTop:'1px solid #222222',display:'flex',justifyContent:'space-around',alignItems:'center',height:'60px',zIndex:1000,paddingBottom:'env(safe-area-inset-bottom)'}}>
          {[
            {label:'Mercados',id:'mercados',path:'/'},
            {label:'Portfolio',id:'portfolio',path:'/perfil'},
            {label:'Depositar',id:'depositar',path:'/perfil'},
            {label:'Duvidas',id:'duvidas',path:'/duvidas'},
          ].map(item=>{
            const active=activeNav===item.id
            return (
              <button key={item.id} onClick={()=>{setActiveNav(item.id);router.push(item.path)}}
                style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',border:'none',background:'transparent',cursor:'pointer',color:active?'#00e676':'#666666',fontSize:'11px',transition:'color 0.15s',flex:1,height:'100%',justifyContent:'center'}}>
                {item.label==='Mercados'&&<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>}
                {item.label==='Portfolio'&&<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12h2v7H5v-7zm4-5h2v12H9V7zm4 2h2v10h-2V9zm4-4h2v14h-2V5z"/></svg>}
                {item.label==='Depositar'&&<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59V8h2v8.59l2.3-2.3 1.41 1.41L12 20l-4.71-4.71 1.41-1.41L11 16.59z"/></svg>}
                {item.label==='Duvidas'&&<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>}
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      )}
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

function MCard({m,i,onBet,fav,onFav}:{m:Market,i:number,onBet:(m:Market,c:'yes'|'no')=>void,fav:boolean,onFav:(id:string)=>void}) {
  const yes=Number(m.yes_odds)||50
  const no=Number(m.no_odds)||50
  const yM=(100/yes).toFixed(2)
  const nM=(100/no).toFixed(2)

  return (
    <div className="mcard fadein" style={{animationDelay:`${i*0.03}s`}}>
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
        </div>
        <button onClick={()=>onFav(m.id)} style={{background:'none',border:'none',cursor:'pointer',padding:'2px',flexShrink:0,transition:'transform 0.15s'}}
          onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.2)')}
          onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
          <svg width="14" height="14" fill={fav?'#facc15':'none'} stroke={fav?'#facc15':'#555'} strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      </div>

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
        <button className="btn-sim" onClick={()=>onBet(m,'yes')}>✓ SIM {yM}x</button>
        <button className="btn-nao" onClick={()=>onBet(m,'no')}>✗ NÃO {nM}x</button>
      </div>

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
