'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://187.77.248.115:3001'

const I: any = {
  grid: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  chart: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  shield: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  cog: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  users: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  down: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>,
  dollar: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  plus: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ext: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  out: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  warn: <svg width="18" height="18" fill="none" stroke="#ffb300" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ok: <svg width="13" height="13" fill="none" stroke="#00e676" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  err: <svg width="13" height="13" fill="none" stroke="#ff1744" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
}

const NAV = [
  {section:'PRINCIPAL',items:[{id:'dashboard',label:'DASHBOARD',icon:'grid'},{id:'audit',label:'AUDITORIA',icon:'shield'},{id:'configs',label:'CONFIG',icon:'cog'}]},
  {section:'GESTAO',items:[{id:'users',label:'USUARIOS',icon:'users'}]},
  {section:'FINANCEIRO',items:[{id:'withdrawals',label:'SAQUES',icon:'down'},{id:'deposits',label:'DEPOSITOS',icon:'dollar'}]},
  {section:'OPERACIONAL',items:[{id:'markets',label:'MERCADOS',icon:'chart'},{id:'criar',label:'NOVO MERCADO',icon:'plus'}]},
]
const CATS = ['Entretenimento','Criptomoedas','Financeiro','Esportes','Politica','Clima','Celebridades']

export default function Admin() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [token, setToken] = useState('')
  const [adminName, setAdminName] = useState('ADMIN')
  const [markets, setMarkets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [deposits, setDeposits] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [audit, setAudit] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<any>(null)
  const [confirm, setConfirm] = useState<any>(null)
  const [editMarket, setEditMarket] = useState<any>(null)
  const [editUser, setEditUser] = useState<any>(null)
  const [balanceModal, setBalanceModal] = useState<any>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [fQ, setFQ] = useState('')
  const [uptime, setUptime] = useState(0)
  const [newMarket, setNewMarket] = useState({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''})

  useEffect(()=>{
    const u = localStorage.getItem('user'), t = localStorage.getItem('token')
    if(!u||!t){router.push('/login');return}
    const p = JSON.parse(u)
    if(!p.is_admin){router.push('/');return}
    setAdminName((p.name||'ADMIN').toUpperCase())
    setToken(t); load(t)
    const k=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();setSearchOpen(s=>!s)}}
    window.addEventListener('keydown',k)
    const timer = setInterval(()=>setUptime(s=>s+1),1000)
    return ()=>{window.removeEventListener('keydown',k);clearInterval(timer)}
  },[])

  async function load(t:string){
    setLoading(true)
    const h={'Authorization':'Bearer '+t}
    const [m,u,d,w,a,s]=await Promise.all([
      fetch(API+'/api/markets').then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/users',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/deposits',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/withdrawals',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/audit',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/settings',{headers:h}).then(r=>r.json()).catch(()=>({})),
    ])
    setMarkets(Array.isArray(m)?m:[]);setUsers(Array.isArray(u)?u:[])
    setDeposits(Array.isArray(d)?d:[]);setWithdrawals(Array.isArray(w)?w:[])
    setAudit(Array.isArray(a)?a:[]);setSettings(s||{});setLoading(false)
  }

  function T(text:string,type='ok'){setToast({text,type});setTimeout(()=>setToast(null),3500)}
  async function api(url:string,method='GET',body?:any){
    const r=await fetch(API+url,{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:body?JSON.stringify(body):undefined})
    return r.json()
  }
  function C(msg:string,action:()=>Promise<void>){setConfirm({msg,action})}

  async function createMarket(e:any){
    e.preventDefault()
    const r=await api('/api/admin/markets','POST',{...newMarket,yes_odds:Number(newMarket.yes_odds),no_odds:Number(newMarket.no_odds),expires_at:newMarket.expires_at||null})
    if(r.id){T('MERCADO_CRIADO');setNewMarket({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''});load(token)}else T(r.error||'ERR','err')
  }
  async function saveMarket(){const r=await api(`/api/admin/markets/${editMarket.id}`,'PUT',editMarket);if(r.id){T('MARKET_UPDATED');setEditMarket(null);load(token)}else T(r.error||'ERR','err')}
  async function saveUser(){const r=await api(`/api/admin/users/${editUser.id}`,'PUT',editUser);if(r.id){T('USER_UPDATED');setEditUser(null);load(token)}else T(r.error||'ERR','err')}
  async function adjBal(){const r=await api(`/api/admin/users/${balanceModal.id}/balance`,'POST',{amount:Number(balanceModal.amount),note:balanceModal.note});if(r.success){T('BALANCE_ADJUSTED');setBalanceModal(null);load(token)}else T(r.error||'ERR','err')}
  async function saveSettings(e:any){e.preventDefault();const r=await api('/api/admin/settings','PUT',settings);if(r.success){T('SETTINGS_SAVED')}else{T(r.error||'ERR','err')}}

  const totalDep=deposits.filter((d:any)=>d.status==='completed').reduce((a:number,d:any)=>a+Number(d.amount),0)
  const totalWith=withdrawals.filter((w:any)=>w.status==='completed'||w.status==='paid').reduce((a:number,w:any)=>a+Number(w.amount),0)
  const lucro=totalDep-totalWith
  const fmt=(n:number)=>n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})
  const uptimeFmt=`${String(Math.floor(uptime/3600)).padStart(2,'0')}:${String(Math.floor((uptime%3600)/60)).padStart(2,'0')}:${String(uptime%60).padStart(2,'0')}`

  const fUsers=users.filter((u:any)=>(!fStatus||(u.status||'active')===fStatus)&&(!fQ||u.name?.toLowerCase().includes(fQ.toLowerCase())||u.email?.toLowerCase().includes(fQ.toLowerCase())))
  const fMarkets=markets.filter((m:any)=>(!fStatus||m.status===fStatus)&&(!fQ||m.question?.toLowerCase().includes(fQ.toLowerCase())))

  return(
    <div style={{display:'flex',minHeight:'100vh',background:'#050505',color:'#fff',fontFamily:"'Inter','Manrope',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea,button{font-family:inherit}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:2px}
        ::-webkit-scrollbar-track{background:transparent}
        .mono{font-family:'JetBrains Mono','Courier New',monospace}
        .label{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.2em;color:#444}
        .trow:hover td{background:#0d0d0d!important}
        .nav-btn:hover{background:rgba(0,230,118,0.04)!important;color:#888!important}
        .card:hover{border-color:#1e1e1e!important}
        @keyframes toastIn{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}
        @keyframes skel{0%,100%{opacity:.2}50%{opacity:.5}}
        @keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}
        @keyframes glow{0%,100%{text-shadow:0 0 8px rgba(0,230,118,0.4)}50%{text-shadow:0 0 16px rgba(0,230,118,0.7)}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        .skel{animation:skel 1.8s ease infinite;background:#0a0a0a;border-radius:4px}
        .glow-green{animation:glow 3s ease infinite}
        .ping{animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite}
      `}</style>

      {/* SCANLINES OVERLAY */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)'}}/>

      {/* ── SIDEBAR ── */}
      <aside style={{width:'200px',flexShrink:0,background:'#080808',borderRight:'1px solid #0f0f0f',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',zIndex:30}}>
        <div style={{padding:'16px 14px 12px',borderBottom:'1px solid #0f0f0f'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
            <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#00e676',position:'relative',flexShrink:0,boxShadow:'0 0 8px #00e676'}}>
              <div className="ping" style={{position:'absolute',inset:'-2px',borderRadius:'50%',background:'#00e676',opacity:0.4}}/>
            </div>
            <span style={{fontSize:'11px',fontWeight:800,color:'#00e676',letterSpacing:'0.16em'}}>SISTEMA_ONLINE</span>
          </div>
          <div style={{fontSize:'10px',color:'#222',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.04em'}}>PREVIMARKET_ADMIN_v2</div>
        </div>

        <nav style={{flex:1,overflowY:'auto',padding:'6px 0'}}>
          {NAV.map(s=>(
            <div key={s.section} style={{marginBottom:'2px'}}>
              <p className="label" style={{padding:'10px 14px 4px'}}>{s.section}</p>
              {s.items.map(item=>(
                <button key={item.id} onClick={()=>{setTab(item.id);setFStatus('');setFQ('')}} className="nav-btn"
                  style={{width:'100%',display:'flex',alignItems:'center',gap:'8px',padding:'7px 14px',border:'none',cursor:'pointer',background:tab===item.id?'rgba(0,230,118,0.06)':'transparent',borderLeft:tab===item.id?'1px solid #00e676':'1px solid transparent',color:tab===item.id?'#00e676':'#333',fontSize:'11px',fontWeight:tab===item.id?700:500,textAlign:'left',letterSpacing:'0.06em',transition:'all 0.1s'}}>
                  <span style={{opacity:tab===item.id?1:0.5,flexShrink:0}}>{I[item.icon]}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{padding:'10px',borderTop:'1px solid #0f0f0f',display:'flex',gap:'5px'}}>
          <a href="/" target="_blank" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'4px',padding:'6px',borderRadius:'6px',background:'transparent',border:'1px solid #111',color:'#333',fontSize:'10px',textDecoration:'none',letterSpacing:'0.08em',fontWeight:600,transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.borderColor='#1a1a1a'} onMouseLeave={(e:any)=>e.currentTarget.style.borderColor='#111'}>
            {I.ext} SITE
          </a>
          <button onClick={()=>{localStorage.clear();router.push('/')}} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'4px',padding:'6px',borderRadius:'6px',background:'rgba(255,23,68,0.06)',border:'1px solid rgba(255,23,68,0.12)',color:'#ff1744',fontSize:'10px',cursor:'pointer',letterSpacing:'0.08em',fontWeight:600,transition:'all 0.1s'}}>
            {I.out} EXIT
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,position:'relative',zIndex:1}}>

        {/* HEADER */}
        <header style={{background:'rgba(5,5,5,0.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid #0f0f0f',height:'44px',display:'flex',alignItems:'center',padding:'0 16px',gap:'10px',position:'sticky',top:0,zIndex:20,flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'16px',flex:1}}>
            <span className="label" style={{color:'#222',letterSpacing:'0.08em',fontSize:'9px'}}>{NAV.flatMap(s=>s.items).find(i=>i.id===tab)?.label||'SYSTEM'}</span>
            <span style={{color:'#111',fontSize:'9px',fontFamily:"'JetBrains Mono',monospace"}}>──</span>
            <span style={{fontSize:'9px',fontFamily:"'JetBrains Mono',monospace",color:'#1a1a1a',letterSpacing:'0.06em'}}>UPTIME: {uptimeFmt}</span>
            <span style={{fontSize:'9px',fontFamily:"'JetBrains Mono',monospace",color:'#1a1a1a',letterSpacing:'0.06em'}}>LATENCY: 12ms</span>
            <span style={{fontSize:'9px',fontFamily:"'JetBrains Mono',monospace",color:'#1a1a1a',letterSpacing:'0.06em'}}>LOAD: 0.42</span>
          </div>
          <button onClick={()=>setSearchOpen(true)} style={{display:'flex',alignItems:'center',gap:'6px',background:'#0a0a0a',border:'1px solid #111',borderRadius:'6px',padding:'5px 10px',color:'#333',cursor:'pointer',transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.borderColor='#1a1a1a'} onMouseLeave={(e:any)=>e.currentTarget.style.borderColor='#111'}>
            {I.search}
            <span style={{fontSize:'10px',color:'#222',letterSpacing:'0.08em',fontWeight:600}}>SEARCH</span>
            <kbd style={{background:'#0f0f0f',border:'1px solid #1a1a1a',borderRadius:'3px',padding:'1px 5px',fontSize:'9px',color:'#222',fontFamily:"'JetBrains Mono',monospace"}}>^K</kbd>
          </button>
          <button onClick={()=>load(token)} style={{width:'28px',height:'28px',borderRadius:'6px',border:'1px solid #111',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#222',transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.borderColor='#1a1a1a'} onMouseLeave={(e:any)=>e.currentTarget.style.borderColor='#111'}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </button>
          <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#0a0a0a',border:'1px solid #111',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{color:'#00e676',fontWeight:800,fontSize:'11px',fontFamily:"'JetBrains Mono',monospace"}}>{adminName[0]}</span>
          </div>
        </header>

        <main style={{flex:1,padding:'16px',overflowY:'auto'}}>

          {/* ─── DASHBOARD ─── */}
          {tab==='dashboard'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {loading?(
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px'}}>
                  {Array(8).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'88px'}}/>)}
                </div>
              ):(
                <>
                  {/* METRICAS PRIMARIAS */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'8px'}}>
                    {[
                      {id:'TOTAL_REVENUE',value:`R$ ${fmt(lucro)}`,sub:lucro>=0?'NET_POSITIVE':'NET_NEGATIVE',color:lucro>=0?'#00e676':'#ff1744',border:lucro>=0?'rgba(0,230,118,0.15)':'rgba(255,23,68,0.15)'},
                      {id:'DEPOSIT_FLOW',value:`R$ ${fmt(totalDep)}`,sub:`${deposits.filter((d:any)=>d.status==='completed').length}_CONFIRMED`,color:'#00b0ff',border:'rgba(0,176,255,0.15)'},
                      {id:'WITHDRAWAL_FLOW',value:`R$ ${fmt(totalWith)}`,sub:`${withdrawals.filter((w:any)=>w.status==='paid'||w.status==='completed').length}_PROCESSED`,color:'#ff1744',border:'rgba(255,23,68,0.15)'},
                      {id:'USER_COUNT',value:users.length,sub:`${users.filter((u:any)=>u.status!=='blocked').length}_ACTIVE_NODES`,color:'#818cf8',border:'rgba(129,140,248,0.15)'},
                    ].map(c=>(
                      <div key={c.id} className="card" style={{background:'#0a0a0a',border:`1px solid ${c.border}`,borderRadius:'8px',padding:'14px',transition:'border-color 0.15s',position:'relative',overflow:'hidden'}}>
                        <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:`linear-gradient(90deg,${c.color},transparent)`}}/>
                        <p className="label" style={{marginBottom:'10px',color:'#333'}}>{c.id}</p>
                        <p className="mono glow-green" style={{fontSize:'26px',fontWeight:700,color:c.color,letterSpacing:'-0.5px',lineHeight:1,marginBottom:'6px',textShadow:`0 0 12px ${c.color}40`}}>{c.value}</p>
                        <p style={{fontSize:'9px',fontFamily:"'JetBrains Mono',monospace",color:'#222',letterSpacing:'0.08em'}}>{c.sub}</p>
                        <svg style={{position:'absolute',bottom:'10px',right:'10px',opacity:0.15}} width="40" height:"20" viewBox="0 0 40 20">
                          <polyline points="0,18 8,12 16,14 24,6 32,10 40,2" fill="none" stroke={c.color} strokeWidth="1.5"/>
                        </svg>
                      </div>
                    ))}
                  </div>

                  {/* METRICAS SECUNDARIAS */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'8px'}}>
                    {[
                      {id:'MARKETS_ACTIVE',value:markets.filter((m:any)=>m.status==='open').length,color:'#00e676'},
                      {id:'PENDING_WITHDRAWALS',value:withdrawals.filter((w:any)=>w.status==='pending').length,color:'#ffb300'},
                      {id:'PENDING_DEPOSITS',value:deposits.filter((d:any)=>d.status==='pending').length,color:'#ffb300'},
                      {id:'AUDIT_RECORDS',value:audit.length,color:'#333'},
                    ].map(c=>(
                      <div key={c.id} className="card" style={{background:'#0a0a0a',border:'1px solid #0f0f0f',borderRadius:'8px',padding:'12px',transition:'border-color 0.15s'}}>
                        <p className="label" style={{marginBottom:'8px',color:'#222'}}>{c.id}</p>
                        <p className="mono" style={{fontSize:'30px',fontWeight:700,color:c.color,letterSpacing:'-1px',lineHeight:1,textShadow:c.color!=='#333'?`0 0 10px ${c.color}30`:undefined}}>{c.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* TABELAS RECENTES */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    <div style={{background:'#0a0a0a',border:'1px solid #0f0f0f',borderRadius:'8px',padding:'14px'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px',paddingBottom:'8px',borderBottom:'1px solid #0f0f0f'}}>
                        <p className="label" style={{color:'#222'}}>MARKET_LOG</p>
                        <button onClick={()=>setTab('markets')} style={{fontSize:'9px',color:'#00e676',background:'none',border:'none',cursor:'pointer',fontWeight:700,letterSpacing:'0.1em'}}>VIEW_ALL →</button>
                      </div>
                      {markets.length===0?<p style={{fontSize:'11px',color:'#111',textAlign:'center',padding:'16px 0',fontFamily:"'JetBrains Mono',monospace"}}>NO_DATA</p>:markets.slice(0,6).map((m:any)=>(
                        <div key={m.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #0d0d0d'}}>
                          <span style={{fontSize:'11px',color:'#555',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1,marginRight:'8px'}}>{m.question}</span>
                          <Tag status={m.status}/>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'#0a0a0a',border:'1px solid #0f0f0f',borderRadius:'8px',padding:'14px'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px',paddingBottom:'8px',borderBottom:'1px solid #0f0f0f'}}>
                        <p className="label" style={{color:'#222'}}>TX_STREAM</p>
                        <button onClick={()=>setTab('deposits')} style={{fontSize:'9px',color:'#00e676',background:'none',border:'none',cursor:'pointer',fontWeight:700,letterSpacing:'0.1em'}}>VIEW_ALL →</button>
                      </div>
                      {[...deposits,...withdrawals].sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).slice(0,6).map((t:any,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #0d0d0d'}}>
                          <div style={{flex:1,overflow:'hidden',marginRight:'8px'}}>
                            <span style={{fontSize:'11px',color:'#555',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.name||'NODE_UNKNOWN'}</span>
                            <span style={{fontSize:'9px',fontFamily:"'JetBrains Mono',monospace",color:'#222',letterSpacing:'0.08em'}}>{t.type?.toUpperCase()}</span>
                          </div>
                          <span className="mono" style={{fontSize:'12px',fontWeight:600,color:t.type==='deposit'?'#00e676':'#ff1744',textShadow:t.type==='deposit'?'0 0 8px rgba(0,230,118,0.3)':'0 0 8px rgba(255,23,68,0.3)'}}>R${Number(t.amount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── MERCADOS ─── */}
          {tab==='markets'&&(
            <div>
              <FB q={fQ} onQ={setFQ} s={fStatus} onS={setFStatus} opts={['open','suspended','resolved','cancelled']} action={<Btn color="green" onClick={()=>setTab('criar')}>{I.plus} NEW_MARKET</Btn>}/>
              <TBL loading={loading} cols={['QUESTION','CATEGORY','SIM%','NAO%','STATUS','EXPIRES','ACTIONS']}
                rows={fMarkets.map((m:any)=>[
                  <span style={{fontSize:'12px',color:'#666',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block',maxWidth:'200px'}}>{m.question}</span>,
                  <span className="label" style={{color:'#333'}}>{m.category||'—'}</span>,
                  <span className="mono" style={{fontSize:'12px',fontWeight:600,color:'#00e676',textShadow:'0 0 8px rgba(0,230,118,0.3)'}}>{m.yes_odds}%</span>,
                  <span className="mono" style={{fontSize:'12px',fontWeight:600,color:'#ff1744',textShadow:'0 0 8px rgba(255,23,68,0.3)'}}>{m.no_odds}%</span>,
                  <Tag status={m.status}/>,
                  <span className="mono" style={{fontSize:'10px',color:'#333'}}>{m.expires_at?new Date(m.expires_at).toLocaleDateString('pt-BR'):'—'}</span>,
                  <Ac>
                    <SBtn onClick={()=>setEditMarket({...m})}>EDIT</SBtn>
                    {m.status==='open'&&<>
                      <SBtn color="green" onClick={()=>C('RESOLVER_COMO_SIM?',async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'yes'});if(r.success){T('RESOLVED_SIM');load(token)}else T(r.error||'ERR','err')})}>SIM</SBtn>
                      <SBtn color="red" onClick={()=>C('RESOLVER_COMO_NAO?',async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'no'});if(r.success){T('RESOLVED_NAO');load(token)}else T(r.error||'ERR','err')})}>NAO</SBtn>
                      <SBtn color="red" onClick={()=>C('CANCELAR_MERCADO?',async()=>{const r=await api(`/api/admin/markets/${m.id}/cancel`,'PUT',{});if(r.success){T('CANCELLED');load(token)}else T(r.error||'ERR','err')})}>KILL</SBtn>
                    </>}
                  </Ac>
                ])}
              />
            </div>
          )}

          {/* ─── CRIAR ─── */}
          {tab==='criar'&&(
            <div style={{maxWidth:'520px'}}>
              <Box>
                <form onSubmit={createMarket} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <Fd l="MARKET_QUESTION"><In value={newMarket.question} onChange={(e:any)=>setNewMarket({...newMarket,question:e.target.value})} placeholder="Ex: Bitcoin vai superar $100k?" required/></Fd>
                  <Fd l="CATEGORY_TAG"><Sl value={newMarket.category} onChange={(e:any)=>setNewMarket({...newMarket,category:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</Sl></Fd>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    <Fd l="ODDS_SIM (%)"><In type="number" min="1" max="99" value={newMarket.yes_odds} style={{color:'#00e676',fontFamily:"'JetBrains Mono',monospace",fontWeight:700}} onChange={(e:any)=>setNewMarket({...newMarket,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))})}/></Fd>
                    <Fd l="ODDS_NAO (%)"><In type="number" min="1" max="99" value={newMarket.no_odds} style={{color:'#ff1744',fontFamily:"'JetBrains Mono',monospace",fontWeight:700}} onChange={(e:any)=>setNewMarket({...newMarket,no_odds:e.target.value,yes_odds:String(100-Number(e.target.value))})}/></Fd>
                  </div>
                  <div style={{background:'#050505',border:'1px solid #0f0f0f',borderRadius:'6px',padding:'12px',display:'flex',justifyContent:'space-around'}}>
                    <div style={{textAlign:'center'}}>
                      <p className="label" style={{marginBottom:'5px',color:'#222'}}>MULT_SIM</p>
                      <p className="mono" style={{fontSize:'24px',fontWeight:700,color:'#00e676',textShadow:'0 0 12px rgba(0,230,118,0.4)'}}>{(100/Number(newMarket.yes_odds||1)).toFixed(2)}x</p>
                    </div>
                    <div style={{width:'1px',background:'#0f0f0f'}}/>
                    <div style={{textAlign:'center'}}>
                      <p className="label" style={{marginBottom:'5px',color:'#222'}}>MULT_NAO</p>
                      <p className="mono" style={{fontSize:'24px',fontWeight:700,color:'#ff1744',textShadow:'0 0 12px rgba(255,23,68,0.4)'}}>{(100/Number(newMarket.no_odds||1)).toFixed(2)}x</p>
                    </div>
                  </div>
                  <div style={{height:'2px',background:'#0a0a0a',borderRadius:'1px',overflow:'hidden'}}>
                    <div style={{height:'100%',background:'linear-gradient(90deg,#00e676,rgba(0,230,118,0.1))',width:`${newMarket.yes_odds}%`,transition:'width 0.3s',boxShadow:'0 0 6px rgba(0,230,118,0.5)'}}/>
                  </div>
                  <Fd l="EXPIRY_TIMESTAMP"><In type="datetime-local" value={newMarket.expires_at} onChange={(e:any)=>setNewMarket({...newMarket,expires_at:e.target.value})}/></Fd>
                  <button type="submit" style={{background:'rgba(0,230,118,0.08)',color:'#00e676',border:'1px solid rgba(0,230,118,0.2)',borderRadius:'6px',padding:'11px',fontWeight:700,fontSize:'11px',cursor:'pointer',letterSpacing:'0.12em',textTransform:'uppercase',transition:'all 0.15s',boxShadow:'0 0 16px rgba(0,230,118,0.08)'}} onMouseEnter={(e:any)=>{e.currentTarget.style.background='rgba(0,230,118,0.12)';e.currentTarget.style.boxShadow='0 0 20px rgba(0,230,118,0.15)'}} onMouseLeave={(e:any)=>{e.currentTarget.style.background='rgba(0,230,118,0.08)';e.currentTarget.style.boxShadow='0 0 16px rgba(0,230,118,0.08)'}}>
                    DEPLOY_MARKET
                  </button>
                </form>
              </Box>
            </div>
          )}

          {/* ─── USUARIOS ─── */}
          {tab==='users'&&(
            <div>
              <FB q={fQ} onQ={setFQ} s={fStatus} onS={setFStatus} opts={['active','blocked','suspended']}/>
              <TBL loading={loading} cols={['NODE_ID','EMAIL','STATUS','TYPE','REG_DATE','ACTIONS']}
                rows={fUsers.map((u:any)=>[
                  <span style={{fontSize:'12px',color:'#666',fontWeight:500}}>{u.name}</span>,
                  <span style={{fontSize:'11px',color:'#333',fontFamily:"'JetBrains Mono',monospace"}}>{u.email}</span>,
                  <Tag status={u.status||'active'}/>,
                  <Tag status={u.is_admin?'admin':'user'}/>,
                  <span className="mono" style={{fontSize:'10px',color:'#333'}}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</span>,
                  <Ac>
                    <SBtn onClick={()=>setEditUser({...u})}>EDIT</SBtn>
                    <SBtn color="green" onClick={()=>setBalanceModal({id:u.id,name:u.name,amount:'',note:''})}>BALANCE</SBtn>
                  </Ac>
                ])}
              />
            </div>
          )}

          {/* ─── SAQUES ─── */}
          {tab==='withdrawals'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'10px'}}>
                {[
                  {id:'PENDING_QUEUE',v:withdrawals.filter((w:any)=>w.status==='pending').length,c:'#ffb300'},
                  {id:'PROCESSED_TX',v:withdrawals.filter((w:any)=>w.status==='paid'||w.status==='completed').length,c:'#00e676'},
                  {id:'TOTAL_OUTFLOW',v:`R$ ${fmt(totalWith)}`,c:'#ff1744'},
                ].map(c=>(
                  <div key={c.id} style={{background:'#0a0a0a',border:'1px solid #0f0f0f',borderRadius:'8px',padding:'12px'}}>
                    <p className="label" style={{marginBottom:'7px',color:'#222'}}>{c.id}</p>
                    <p className="mono" style={{fontSize:'22px',fontWeight:700,color:c.c,textShadow:`0 0 10px ${c.c}30`}}>{c.v}</p>
                  </div>
                ))}
              </div>
              <FB q={fQ} onQ={setFQ} s={fStatus} onS={setFStatus} opts={['pending','approved','paid','rejected']}/>
              <TBL loading={loading} cols={['NODE','AMOUNT','STATUS','DATE','ACTIONS']}
                rows={withdrawals.filter((w:any)=>(!fStatus||w.status===fStatus)&&(!fQ||w.name?.toLowerCase().includes(fQ.toLowerCase()))).map((w:any)=>[
                  <span style={{fontSize:'12px',color:'#666',fontWeight:500}}>{w.name||'—'}</span>,
                  <span className="mono" style={{fontSize:'13px',fontWeight:700,color:'#ff1744',textShadow:'0 0 8px rgba(255,23,68,0.3)'}}>R${Number(w.amount).toFixed(2)}</span>,
                  <Tag status={w.status}/>,
                  <span className="mono" style={{fontSize:'10px',color:'#333'}}>{new Date(w.created_at).toLocaleDateString('pt-BR')}</span>,
                  <Ac>
                    {w.status==='pending'&&<>
                      <SBtn color="green" onClick={()=>C('APROVAR_SAQUE?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/approve`,'PUT',{});if(r.success){T('APPROVED');load(token)}else T(r.error||'ERR','err')})}>APPROVE</SBtn>
                      <SBtn color="red" onClick={()=>C('REJEITAR_SAQUE?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/reject`,'PUT',{reason:'REJECTED'});if(r.success){T('REJECTED');load(token)}else T(r.error||'ERR','err')})}>REJECT</SBtn>
                    </>}
                    {w.status==='approved'&&<SBtn color="green" onClick={()=>C('MARCAR_COMO_PAGO?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/paid`,'PUT',{});if(r.success){T('MARKED_PAID');load(token)}else T(r.error||'ERR','err')})}>MARK_PAID</SBtn>}
                  </Ac>
                ])}
              />
            </div>
          )}

          {/* ─── DEPOSITOS ─── */}
          {tab==='deposits'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'10px'}}>
                {[
                  {id:'PENDING_QUEUE',v:deposits.filter((d:any)=>d.status==='pending').length,c:'#ffb300'},
                  {id:'CONFIRMED_TX',v:deposits.filter((d:any)=>d.status==='completed').length,c:'#00e676'},
                  {id:'TOTAL_INFLOW',v:`R$ ${fmt(totalDep)}`,c:'#00b0ff'},
                ].map(c=>(
                  <div key={c.id} style={{background:'#0a0a0a',border:'1px solid #0f0f0f',borderRadius:'8px',padding:'12px'}}>
                    <p className="label" style={{marginBottom:'7px',color:'#222'}}>{c.id}</p>
                    <p className="mono" style={{fontSize:'22px',fontWeight:700,color:c.c,textShadow:`0 0 10px ${c.c}30`}}>{c.v}</p>
                  </div>
                ))}
              </div>
              <FB q={fQ} onQ={setFQ} s={fStatus} onS={setFStatus} opts={['pending','completed','refunded']}/>
              <TBL loading={loading} cols={['NODE','AMOUNT','STATUS','DATE','ACTIONS']}
                rows={deposits.filter((d:any)=>(!fStatus||d.status===fStatus)&&(!fQ||d.name?.toLowerCase().includes(fQ.toLowerCase()))).map((d:any)=>[
                  <span style={{fontSize:'12px',color:'#666',fontWeight:500}}>{d.name||'—'}</span>,
                  <span className="mono" style={{fontSize:'13px',fontWeight:700,color:'#00e676',textShadow:'0 0 8px rgba(0,230,118,0.3)'}}>R${Number(d.amount).toFixed(2)}</span>,
                  <Tag status={d.status}/>,
                  <span className="mono" style={{fontSize:'10px',color:'#333'}}>{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>,
                  <Ac>
                    {d.status==='pending'&&<SBtn color="green" onClick={()=>C('APROVAR_DEPOSITO?',async()=>{const r=await api(`/api/admin/deposits/${d.id}/approve`,'PUT',{});if(r.success){T('APPROVED');load(token)}else T(r.error||'ERR','err')})}>APPROVE</SBtn>}
                    {d.status==='completed'&&<SBtn color="red" onClick={()=>C('ESTORNAR_DEPOSITO?',async()=>{const r=await api(`/api/admin/deposits/${d.id}/refund`,'PUT',{});if(r.success){T('REFUNDED');load(token)}else T(r.error||'ERR','err')})}>REFUND</SBtn>}
                  </Ac>
                ])}
              />
            </div>
          )}

          {/* ─── AUDITORIA ─── */}
          {tab==='audit'&&(
            <div>
              <div style={{marginBottom:'10px',display:'flex',alignItems:'center',gap:'10px'}}>
                <span className="label" style={{color:'#222'}}>{audit.length} AUDIT_RECORDS</span>
                <span style={{fontSize:'9px',fontFamily:"'JetBrains Mono',monospace",color:'#111',letterSpacing:'0.06em'}}>// READ_ONLY_MODE</span>
              </div>
              <TBL loading={loading} cols={['OPERATOR','ACTION_ID','SOURCE_IP','TIMESTAMP']}
                rows={audit.map((a:any)=>[
                  <span style={{fontSize:'11px',color:'#555',fontWeight:500}}>{a.name||'—'}</span>,
                  <span style={{background:'rgba(129,140,248,0.06)',border:'1px solid rgba(129,140,248,0.12)',color:'#818cf8',fontSize:'9.5px',fontWeight:700,padding:'2px 7px',borderRadius:'3px',letterSpacing:'0.08em',fontFamily:"'JetBrains Mono',monospace"}}>{a.action}</span>,
                  <span className="mono" style={{fontSize:'10px',color:'#222'}}>{a.ip||'—'}</span>,
                  <span className="mono" style={{fontSize:'10px',color:'#222'}}>{new Date(a.created_at).toLocaleString('pt-BR')}</span>,
                ])}
              />
            </div>
          )}

          {/* ─── CONFIGS ─── */}
          {tab==='configs'&&(
            <div style={{maxWidth:'460px'}}>
              <Box>
                <p className="label" style={{marginBottom:'16px',color:'#333'}}>FINANCIAL_PARAMS_v1</p>
                <form onSubmit={saveSettings} style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                  {[
                    {k:'taxa_vitoria',l:'TAXA_VITORIA_%'},
                    {k:'taxa_deposito',l:'TAXA_DEPOSITO_%'},
                    {k:'taxa_saque',l:'TAXA_SAQUE_%'},
                    {k:'saque_minimo',l:'SAQUE_MIN_BRL'},
                    {k:'saque_maximo',l:'SAQUE_MAX_BRL'},
                    {k:'saque_diario',l:'DAILY_LIMIT_BRL'},
                    {k:'rollover',l:'ROLLOVER_MULT'},
                  ].map(f=>(
                    <div key={f.k} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'1px solid #0a0a0a'}}>
                      <label className="label" style={{flex:1,color:'#222'}}>{f.l}</label>
                      <In type="number" step="0.01" value={settings[f.k]||''} style={{width:'100px',color:'#00e676',fontFamily:"'JetBrains Mono',monospace",fontWeight:700,textAlign:'right',textShadow:'0 0 8px rgba(0,230,118,0.3)'}} onChange={(e:any)=>setSettings({...settings,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <button type="submit" style={{marginTop:'14px',background:'rgba(0,230,118,0.06)',color:'#00e676',border:'1px solid rgba(0,230,118,0.15)',borderRadius:'6px',padding:'10px',fontWeight:700,fontSize:'10px',cursor:'pointer',letterSpacing:'0.14em',textTransform:'uppercase',transition:'all 0.15s'}} onMouseEnter={(e:any)=>e.currentTarget.style.background='rgba(0,230,118,0.1)'} onMouseLeave={(e:any)=>e.currentTarget.style.background='rgba(0,230,118,0.06)'}>
                    WRITE_CONFIG
                  </button>
                </form>
              </Box>
            </div>
          )}
        </main>
      </div>

      {/* ─── MODAIS ─── */}
      {editMarket&&(
        <Ov onClose={()=>setEditMarket(null)}>
          <MB title="MARKET_EDIT_MODE" onClose={()=>setEditMarket(null)}>
            <Fd l="QUESTION"><In value={editMarket.question} onChange={(e:any)=>setEditMarket({...editMarket,question:e.target.value})}/></Fd>
            <Fd l="CATEGORY"><Sl value={editMarket.category||''} onChange={(e:any)=>setEditMarket({...editMarket,category:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</Sl></Fd>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <Fd l="ODDS_SIM"><In type="number" min="1" max="99" style={{color:'#00e676',fontFamily:"'JetBrains Mono',monospace",fontWeight:700}} value={editMarket.yes_odds} onChange={(e:any)=>setEditMarket({...editMarket,yes_odds:e.target.value,no_odds:100-Number(e.target.value)})}/></Fd>
              <Fd l="ODDS_NAO"><In type="number" min="1" max="99" style={{color:'#ff1744',fontFamily:"'JetBrains Mono',monospace",fontWeight:700}} value={editMarket.no_odds} onChange={(e:any)=>setEditMarket({...editMarket,no_odds:e.target.value,yes_odds:100-Number(e.target.value)})}/></Fd>
            </div>
            <Fd l="EXPIRY"><In type="datetime-local" value={editMarket.expires_at?String(editMarket.expires_at).slice(0,16):''} onChange={(e:any)=>setEditMarket({...editMarket,expires_at:e.target.value})}/></Fd>
            <Fd l="STATUS"><Sl value={editMarket.status} onChange={(e:any)=>setEditMarket({...editMarket,status:e.target.value})}>{['open','suspended','resolved','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}</Sl></Fd>
            <p style={{fontSize:'9px',color:'#1a1a1a',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.06em',marginTop:'4px'}}>// CHANGES_WILL_BE_LOGGED_TO_AUDIT_WITH_YOUR_IP</p>
            <div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
              <Btn color="green" onClick={saveMarket}>COMMIT_CHANGES</Btn>
              <Btn onClick={()=>setEditMarket(null)}>ABORT</Btn>
            </div>
          </MB>
        </Ov>
      )}

      {editUser&&(
        <Ov onClose={()=>setEditUser(null)}>
          <MB title="USER_EDIT_MODE" onClose={()=>setEditUser(null)}>
            <Fd l="DISPLAY_NAME"><In value={editUser.name} onChange={(e:any)=>setEditUser({...editUser,name:e.target.value})}/></Fd>
            <Fd l="EMAIL_ADDR"><In value={editUser.email} onChange={(e:any)=>setEditUser({...editUser,email:e.target.value})}/></Fd>
            <Fd l="ACCOUNT_STATUS"><Sl value={editUser.status||'active'} onChange={(e:any)=>setEditUser({...editUser,status:e.target.value})}>{['active','blocked','suspended'].map(s=><option key={s} value={s}>{s}</option>)}</Sl></Fd>
            <p style={{fontSize:'9px',color:'#1a1a1a',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.06em',marginTop:'4px'}}>// CHANGES_WILL_BE_LOGGED_TO_AUDIT_WITH_YOUR_IP</p>
            <div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
              <Btn color="green" onClick={saveUser}>COMMIT_CHANGES</Btn>
              <Btn onClick={()=>setEditUser(null)}>ABORT</Btn>
            </div>
          </MB>
        </Ov>
      )}

      {balanceModal&&(
        <Ov onClose={()=>setBalanceModal(null)}>
          <MB title={`BALANCE_ADJUST :: ${balanceModal.name}`} onClose={()=>setBalanceModal(null)}>
            <p style={{fontSize:'9px',color:'#222',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.06em'}}>// USE_NEGATIVE_VALUE_TO_DEDUCT_FUNDS</p>
            <Fd l="DELTA_VALUE_BRL"><In type="number" step="0.01" placeholder="100.00 or -50.00" value={balanceModal.amount} onChange={(e:any)=>setBalanceModal({...balanceModal,amount:e.target.value})}/></Fd>
            <Fd l="REASON_NOTE"><In placeholder="Ex: BONUS_CADASTRO" value={balanceModal.note} onChange={(e:any)=>setBalanceModal({...balanceModal,note:e.target.value})}/></Fd>
            <p style={{fontSize:'9px',color:'#1a1a1a',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.06em',marginTop:'4px'}}>// OPERATION_LOGGED_AUDIT_IP_TIMESTAMP</p>
            <div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
              <Btn color="green" onClick={()=>C(`ADJUST_BALANCE :: ${balanceModal.name} :: R$${balanceModal.amount}?`,adjBal)}>EXECUTE</Btn>
              <Btn onClick={()=>setBalanceModal(null)}>ABORT</Btn>
            </div>
          </MB>
        </Ov>
      )}

      {confirm&&(
        <Ov onClose={()=>setConfirm(null)}>
          <div style={{background:'#0a0a0a',border:'1px solid rgba(255,179,0,0.15)',borderRadius:'8px',padding:'24px',maxWidth:'360px',width:'100%',textAlign:'center'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'rgba(255,179,0,0.06)',border:'1px solid rgba(255,179,0,0.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>{I.warn}</div>
            <p className="mono" style={{fontSize:'12px',color:'#888',lineHeight:1.7,marginBottom:'6px',letterSpacing:'0.04em'}}>{confirm.msg}</p>
            <p style={{fontSize:'9px',fontFamily:"'JetBrains Mono',monospace",color:'#1a1a1a',marginBottom:'18px',letterSpacing:'0.08em'}}>// ACTION_WILL_BE_LOGGED_TO_AUDIT</p>
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={async()=>{await confirm.action();setConfirm(null)}} style={{flex:1,background:'rgba(0,230,118,0.06)',color:'#00e676',border:'1px solid rgba(0,230,118,0.15)',borderRadius:'6px',padding:'10px',fontWeight:700,fontSize:'10px',cursor:'pointer',letterSpacing:'0.12em',textTransform:'uppercase',boxShadow:'0 0 12px rgba(0,230,118,0.06)',transition:'all 0.15s'}}>CONFIRM_EXEC</button>
              <button onClick={()=>setConfirm(null)} style={{flex:1,background:'transparent',color:'#333',border:'1px solid #111',borderRadius:'6px',padding:'10px',fontSize:'10px',cursor:'pointer',letterSpacing:'0.12em',textTransform:'uppercase',transition:'all 0.1s'}}>ABORT</button>
            </div>
          </div>
        </Ov>
      )}

      {searchOpen&&(
        <Ov onClose={()=>setSearchOpen(false)}>
          <div style={{background:'#0a0a0a',border:'1px solid #111',borderRadius:'8px',width:'100%',maxWidth:'460px',overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,0.8)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'12px 14px',borderBottom:'1px solid #0f0f0f'}}>
              <span style={{color:'#222',flexShrink:0}}>{I.search}</span>
              <input autoFocus value={searchQ} onChange={(e:any)=>setSearchQ(e.target.value)} placeholder="SEARCH_COMMAND..." style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#888',fontSize:'13px',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.04em'}} onKeyDown={(e:any)=>{if(e.key==='Escape')setSearchOpen(false)}}/>
              <kbd style={{background:'#050505',border:'1px solid #0f0f0f',borderRadius:'3px',padding:'2px 6px',fontSize:'9px',color:'#222',fontFamily:"'JetBrains Mono',monospace"}}>ESC</kbd>
            </div>
            <div style={{padding:'4px'}}>
              {NAV.flatMap(s=>s.items).filter(i=>!searchQ||i.label.includes(searchQ.toUpperCase())).map(item=>(
                <button key={item.id} onClick={()=>{setTab(item.id);setSearchOpen(false);setSearchQ('')}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'9px 12px',border:'none',background:'transparent',cursor:'pointer',borderRadius:'5px',color:'#333',fontSize:'11px',textAlign:'left',letterSpacing:'0.1em',fontWeight:700,fontFamily:"'JetBrains Mono',monospace",transition:'all 0.08s'}} onMouseEnter={(e:any)=>{e.currentTarget.style.background='#0f0f0f';e.currentTarget.style.color='#00e676'}} onMouseLeave={(e:any)=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#333'}}>
                  <span style={{opacity:0.4,flexShrink:0}}>{I[item.icon]}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </Ov>
      )}

      {toast&&(
        <div style={{position:'fixed',bottom:'16px',right:'16px',zIndex:999,animation:'toastIn 0.2s ease',display:'flex',alignItems:'center',gap:'8px',background:'#0a0a0a',border:`1px solid ${toast.type==='err'?'rgba(255,23,68,0.2)':'rgba(0,230,118,0.2)'}`,borderRadius:'6px',padding:'10px 14px',boxShadow:`0 8px 32px rgba(0,0,0,0.8), 0 0 20px ${toast.type==='err'?'rgba(255,23,68,0.05)':'rgba(0,230,118,0.05)'}`}}>
          {toast.type==='err'?I.err:I.ok}
          <span className="mono" style={{fontSize:'11px',color:toast.type==='err'?'#ff1744':'#00e676',fontWeight:600,letterSpacing:'0.06em'}}>{toast.text}</span>
        </div>
      )}
    </div>
  )
}

function Tag({status}:{status:string}){
  const m:any={
    open:{bg:'rgba(0,230,118,0.06)',c:'#00e676',b:'rgba(0,230,118,0.15)'},
    active:{bg:'rgba(0,230,118,0.06)',c:'#00e676',b:'rgba(0,230,118,0.15)'},
    completed:{bg:'rgba(0,230,118,0.06)',c:'#00e676',b:'rgba(0,230,118,0.15)'},
    paid:{bg:'rgba(0,230,118,0.06)',c:'#00e676',b:'rgba(0,230,118,0.15)'},
    resolved:{bg:'rgba(0,176,255,0.06)',c:'#00b0ff',b:'rgba(0,176,255,0.15)'},
    admin:{bg:'rgba(129,140,248,0.06)',c:'#818cf8',b:'rgba(129,140,248,0.15)'},
    pending:{bg:'rgba(255,179,0,0.06)',c:'#ffb300',b:'rgba(255,179,0,0.15)'},
    processing:{bg:'rgba(255,179,0,0.06)',c:'#ffb300',b:'rgba(255,179,0,0.15)'},
    suspended:{bg:'rgba(255,179,0,0.06)',c:'#ffb300',b:'rgba(255,179,0,0.15)'},
    cancelled:{bg:'rgba(255,23,68,0.06)',c:'#ff1744',b:'rgba(255,23,68,0.15)'},
    blocked:{bg:'rgba(255,23,68,0.06)',c:'#ff1744',b:'rgba(255,23,68,0.15)'},
    rejected:{bg:'rgba(255,23,68,0.06)',c:'#ff1744',b:'rgba(255,23,68,0.15)'},
    refunded:{bg:'rgba(255,23,68,0.06)',c:'#ff1744',b:'rgba(255,23,68,0.15)'},
    user:{bg:'rgba(255,255,255,0.03)',c:'#333',b:'rgba(255,255,255,0.06)'},
  }
  const s=m[status]||{bg:'rgba(255,255,255,0.03)',c:'#333',b:'rgba(255,255,255,0.06)'}
  return <span style={{display:'inline-block',padding:'2px 8px',borderRadius:'3px',fontSize:'9.5px',fontWeight:700,letterSpacing:'0.1em',background:s.bg,color:s.c,border:`1px solid ${s.b}`,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase'}}>{status}</span>
}

function TBL({cols,rows,loading}:{cols:string[],rows:any[][],loading:boolean}){
  if(loading) return <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'38px'}}/>)}</div>
  if(!rows.length) return <div style={{background:'#0a0a0a',border:'1px solid #0d0d0d',borderRadius:'6px',padding:'40px',textAlign:'center'}}><p className="mono" style={{color:'#111',fontSize:'11px',letterSpacing:'0.1em'}}>// NO_DATA_FOUND</p></div>
  return(
    <div style={{overflowX:'auto',borderRadius:'6px',border:'1px solid #0d0d0d'}}>
      <table style={{width:'100%',borderCollapse:'collapse',background:'#0a0a0a'}}>
        <thead>
          <tr style={{background:'#0d0d0d',borderBottom:'1px solid #0f0f0f'}}>
            {cols.map(c=><th key={c} className="label" style={{textAlign:'left',padding:'9px 12px',borderBottom:'none',color:'#222'}}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} className="trow" style={{borderBottom:'1px solid #0d0d0d'}}>
              {row.map((cell,j)=><td key={j} style={{padding:'9px 12px',verticalAlign:'middle'}}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FB({q,onQ,s,onS,opts,action}:any){
  return(
    <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'8px',flexWrap:'wrap'}}>
      <div style={{position:'relative',flex:1,minWidth:'160px',maxWidth:'280px'}}>
        <span style={{position:'absolute',left:'8px',top:'50%',transform:'translateY(-50%)',color:'#111',pointerEvents:'none'}}><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
        <input value={q} onChange={(e:any)=>onQ(e.target.value)} placeholder="FILTER_QUERY..." style={{width:'100%',background:'#0a0a0a',border:'1px solid #0f0f0f',borderRadius:'5px',padding:'6px 8px 6px 26px',color:'#555',fontSize:'10px',outline:'none',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.04em',transition:'border-color 0.12s'}} onFocus={(e:any)=>e.target.style.borderColor='rgba(0,230,118,0.2)'} onBlur={(e:any)=>e.target.style.borderColor='#0f0f0f'}/>
      </div>
      {opts&&<select value={s} onChange={(e:any)=>onS(e.target.value)} style={{background:'#0a0a0a',border:'1px solid #0f0f0f',borderRadius:'5px',padding:'6px 8px',color:s?'#555':'#222',fontSize:'10px',outline:'none',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.04em'}}>
        <option value="">ALL_STATUS</option>
        {opts.map((o:string)=><option key={o} value={o}>{o.toUpperCase()}</option>)}
      </select>}
      {(q||s)&&<button onClick={()=>{onQ('');onS('')}} style={{background:'transparent',border:'1px solid #0f0f0f',borderRadius:'5px',padding:'6px 10px',color:'#222',fontSize:'9px',cursor:'pointer',letterSpacing:'0.1em',fontFamily:"'JetBrains Mono',monospace",fontWeight:700,transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.color='#555'} onMouseLeave={(e:any)=>e.currentTarget.style.color='#222'}>CLEAR</button>}
      {action&&<div style={{marginLeft:'auto'}}>{action}</div>}
    </div>
  )
}

function Ov({children,onClose}:{children:any,onClose:()=>void}){
  return<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',backdropFilter:'blur(8px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>{children}</div>
}

function MB({title,onClose,children}:{title:string,onClose:()=>void,children:any}){
  return(
    <div style={{background:'#0a0a0a',border:'1px solid #111',borderRadius:'8px',padding:'20px',width:'100%',maxWidth:'460px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,0.9)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'18px',paddingBottom:'12px',borderBottom:'1px solid #0f0f0f'}}>
        <h3 className="mono" style={{fontSize:'12px',fontWeight:700,color:'#555',letterSpacing:'0.08em'}}>{title}</h3>
        <button onClick={onClose} style={{background:'transparent',border:'1px solid #111',cursor:'pointer',color:'#222',width:'24px',height:'24px',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.color='#555'} onMouseLeave={(e:any)=>e.currentTarget.style.color='#222'}>×</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{children}</div>
    </div>
  )
}

function Box({children}:{children:any}){return<div style={{background:'#0a0a0a',border:'1px solid #0f0f0f',borderRadius:'8px',padding:'18px'}}>{children}</div>}

function Fd({l,children}:{l:string,children:any}){
  return<div><label className="label" style={{display:'block',marginBottom:'5px',color:'#222'}}>{l}</label>{children}</div>
}

function In({style,...p}:any){
  return<input {...p} style={{width:'100%',background:'#050505',border:'1px solid #0f0f0f',borderRadius:'5px',padding:'8px 10px',color:'#888',fontSize:'12px',outline:'none',transition:'border-color 0.12s',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.02em',...style}} onFocus={(e:any)=>e.target.style.borderColor='rgba(0,230,118,0.25)'} onBlur={(e:any)=>e.target.style.borderColor='#0f0f0f'}/>
}

function Sl({style,...p}:any){
  return<select {...p} style={{width:'100%',background:'#050505',border:'1px solid #0f0f0f',borderRadius:'5px',padding:'8px 10px',color:'#888',fontSize:'12px',outline:'none',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.04em',...style}}/>
}

function Btn({children,onClick,color='gray'}:{children:any,onClick:()=>void,color?:string}){
  const m:any={
    green:{bg:'rgba(0,230,118,0.06)',c:'#00e676',b:'rgba(0,230,118,0.15)',shadow:'0 0 12px rgba(0,230,118,0.06)'},
    red:{bg:'rgba(255,23,68,0.06)',c:'#ff1744',b:'rgba(255,23,68,0.15)',shadow:'none'},
    gray:{bg:'transparent',c:'#333',b:'#111',shadow:'none'},
  }
  const s=m[color]
  return<button onClick={onClick} style={{padding:'9px 16px',borderRadius:'6px',cursor:'pointer',fontSize:'10px',fontWeight:700,background:s.bg,color:s.c,border:`1px solid ${s.b}`,letterSpacing:'0.12em',textTransform:'uppercase' as any,transition:'all 0.12s',boxShadow:s.shadow}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.75'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>{children}</button>
}

function SBtn({children,onClick,color='gray'}:{children:any,onClick:()=>void,color?:string}){
  const m:any={
    green:{bg:'rgba(0,230,118,0.05)',c:'#00e676',b:'rgba(0,230,118,0.1)'},
    red:{bg:'rgba(255,23,68,0.05)',c:'#ff1744',b:'rgba(255,23,68,0.1)'},
    gray:{bg:'rgba(255,255,255,0.02)',c:'#333',b:'#111'},
  }
  const s=m[color]
  return<button onClick={onClick} style={{padding:'3px 9px',borderRadius:'3px',cursor:'pointer',fontSize:'9.5px',fontWeight:700,background:s.bg,color:s.c,border:`1px solid ${s.b}`,letterSpacing:'0.08em',textTransform:'uppercase' as any,fontFamily:"'JetBrains Mono',monospace",transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.7'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>{children}</button>
}

function Ac({children}:{children:any}){return<div style={{display:'flex',gap:'4px',alignItems:'center'}}>{children}</div>}
