'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://187.77.248.115:3001'

// ─── ICONS ───────────────────────────────────────────────────────────────────
const I = {
  grid: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  chart: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  shield: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  cog: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  users: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  arrowDown: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>,
  dollar: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  plus: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  external: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  logout: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  refresh: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  warning: <svg width="20" height="20" fill="none" stroke="#ffb300" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check: <svg width="14" height="14" fill="none" stroke="#00e676" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg width="14" height="14" fill="none" stroke="#f44336" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
}

const NAV = [
  { section:'Principal', items:[
    {id:'dashboard',label:'Dashboard',icon:'grid'},
    {id:'audit',label:'Auditoria',icon:'shield'},
    {id:'configs',label:'Configuracoes',icon:'cog'},
  ]},
  { section:'Gerenciamento', items:[
    {id:'users',label:'Usuarios',icon:'users'},
  ]},
  { section:'Financeiro', items:[
    {id:'withdrawals',label:'Saques',icon:'arrowDown'},
    {id:'deposits',label:'Depositos',icon:'dollar'},
  ]},
  { section:'Operacional', items:[
    {id:'markets',label:'Mercados',icon:'chart'},
    {id:'criar',label:'Criar Mercado',icon:'plus'},
  ]},
]

const CATS = ['Entretenimento','Criptomoedas','Financeiro','Esportes','Politica','Clima','Celebridades']

export default function Admin() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [token, setToken] = useState('')
  const [adminName, setAdminName] = useState('Admin')
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
  const [newMarket, setNewMarket] = useState({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''})
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSearch, setFilterSearch] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u||!t) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    if (!parsed.is_admin) { router.push('/'); return }
    setAdminName(parsed.name||'Admin')
    setToken(t)
    load(t)
    const h = (e: KeyboardEvent) => { if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();setSearchOpen(s=>!s)} }
    window.addEventListener('keydown',h)
    return ()=>window.removeEventListener('keydown',h)
  },[])

  async function load(t: string) {
    setLoading(true)
    const h = {'Authorization':'Bearer '+t}
    const [m,u,d,w,a,s] = await Promise.all([
      fetch(API+'/api/markets').then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/users',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/deposits',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/withdrawals',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/audit',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/settings',{headers:h}).then(r=>r.json()).catch(()=>({})),
    ])
    setMarkets(Array.isArray(m)?m:[])
    setUsers(Array.isArray(u)?u:[])
    setDeposits(Array.isArray(d)?d:[])
    setWithdrawals(Array.isArray(w)?w:[])
    setAudit(Array.isArray(a)?a:[])
    setSettings(s||{})
    setLoading(false)
  }

  function toast_(text: string, type='success') {
    setToast({text,type})
    setTimeout(()=>setToast(null),3500)
  }

  async function api(url: string, method='GET', body?: any) {
    const r = await fetch(API+url,{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:body?JSON.stringify(body):undefined})
    return r.json()
  }

  function confirm_(msg: string, action: ()=>Promise<void>) { setConfirm({msg,action}) }

  async function createMarket(e: any) {
    e.preventDefault()
    const r = await api('/api/admin/markets','POST',{...newMarket,yes_odds:Number(newMarket.yes_odds),no_odds:Number(newMarket.no_odds),expires_at:newMarket.expires_at||null})
    if(r.id){toast_('Mercado criado!');setNewMarket({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''});load(token)}
    else toast_(r.error||'Erro','error')
  }

  async function saveMarket() {
    const r = await api(`/api/admin/markets/${editMarket.id}`,'PUT',editMarket)
    if(r.id){toast_('Mercado salvo!');setEditMarket(null);load(token)} else toast_(r.error||'Erro','error')
  }

  async function saveUser() {
    const r = await api(`/api/admin/users/${editUser.id}`,'PUT',editUser)
    if(r.id){toast_('Usuario salvo!');setEditUser(null);load(token)} else toast_(r.error||'Erro','error')
  }

  async function adjustBalance() {
    const r = await api(`/api/admin/users/${balanceModal.id}/balance`,'POST',{amount:Number(balanceModal.amount),note:balanceModal.note})
    if(r.success){toast_('Saldo ajustado!');setBalanceModal(null);load(token)} else toast_(r.error||'Erro','error')
  }

  async function saveSettings(e: any) {
    e.preventDefault()
    const r = await api('/api/admin/settings','PUT',settings)
    if(r.success){toast_('Configuracoes salvas'use client')}else{toast_(r.error||'Erro','error')}
  }

  const totalDep = deposits.filter((d:any)=>d.status==='completed').reduce((a:number,d:any)=>a+Number(d.amount),0)
  const totalWith = withdrawals.filter((w:any)=>w.status==='completed'||w.status==='paid').reduce((a:number,w:any)=>a+Number(w.amount),0)
  const lucro = totalDep - totalWith

  const currentLabel = NAV.flatMap(s=>s.items).find(i=>i.id===tab)?.label||'Admin'

  const filteredUsers = users.filter((u:any)=>{
    const matchS = !filterStatus || (u.status||'active')===filterStatus
    const matchQ = !filterSearch || u.name?.toLowerCase().includes(filterSearch.toLowerCase()) || u.email?.toLowerCase().includes(filterSearch.toLowerCase())
    return matchS && matchQ
  })

  const filteredMarkets = markets.filter((m:any)=>{
    const matchS = !filterStatus || m.status===filterStatus
    const matchQ = !filterSearch || m.question?.toLowerCase().includes(filterSearch.toLowerCase())
    return matchS && matchQ
  })

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0f0f0f',color:'#fff',fontFamily:"'Inter','Manrope',system-ui,sans-serif",fontSize:'14px'}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea,button{font-family:inherit;font-size:13px}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:99px}
        ::-webkit-scrollbar-track{background:transparent}
        @keyframes toastSlide{from{transform:translateY(12px) scale(0.96);opacity:0}to{transform:none;opacity:1}}
        @keyframes skel{0%,100%{opacity:.35}60%{opacity:.65}}
        .skel{animation:skel 1.6s ease infinite;background:#1e1e1e;border-radius:8px}
        .nav-item:hover{background:#1a1a1a!important;color:#ccc!important}
        .trow:hover td{background:rgba(255,255,255,0.018)!important}
        .card-hover:hover{border-color:#2a2a2a!important}
        .icon-btn:hover{background:#1e1e1e!important}
      `}</style>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside style={{width:'216px',flexShrink:0,background:'#111',borderRight:'1px solid #181818',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',zIndex:30}}>
        <div style={{padding:'18px 16px 14px',borderBottom:'1px solid #181818'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'9px',background:'linear-gradient(145deg,#00e676,#00b248)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(0,230,118,0.25)',flexShrink:0}}>
              <span style={{color:'#000',fontWeight:800,fontSize:'14px',letterSpacing:'-0.5px'}}>P</span>
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:'13px',color:'#fff',lineHeight:1.3}}>Previmarket</p>
              <p style={{fontSize:'10px',color:'#00e676',fontWeight:500,letterSpacing:'0.04em'}}>Admin Console</p>
            </div>
          </div>
        </div>

        <nav style={{flex:1,overflowY:'auto',padding:'6px 0 8px'}}>
          {NAV.map(section=>(
            <div key={section.section} style={{marginBottom:'2px'}}>
              <p style={{fontSize:'9.5px',fontWeight:700,letterSpacing:'0.16em',color:'#333',textTransform:'uppercase',padding:'12px 16px 5px'}}>{section.section}</p>
              {section.items.map(item=>(
                <button key={item.id} onClick={()=>{setTab(item.id);setFilterStatus('');setFilterSearch('')}} className="nav-item"
                  style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'8px 16px',border:'none',cursor:'pointer',background:tab===item.id?'rgba(0,230,118,0.06)':'transparent',borderLeft:tab===item.id?'2px solid #00e676':'2px solid transparent',color:tab===item.id?'#00e676':'#555',fontSize:'13px',fontWeight:tab===item.id?600:400,textAlign:'left',transition:'all 0.1s',letterSpacing:'0.01em'}}>
                  <span style={{opacity:tab===item.id?1:0.55,flexShrink:0}}>{(I as any)[item.icon]}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{padding:'10px 12px',borderTop:'1px solid #181818',display:'flex',gap:'6px'}}>
          <a href="/" target="_blank" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',padding:'7px 8px',borderRadius:'8px',background:'transparent',border:'1px solid #1e1e1e',color:'#555',fontSize:'11px',textDecoration:'none',transition:'all 0.1s',cursor:'pointer'}} onMouseEnter={(e:any)=>e.currentTarget.style.borderColor='#2a2a2a'} onMouseLeave={(e:any)=>e.currentTarget.style.borderColor='#1e1e1e'}>
            {I.external} Ver Site
          </a>
          <button onClick={()=>{localStorage.clear();router.push('/')}} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',padding:'7px 8px',borderRadius:'8px',background:'rgba(244,67,54,0.06)',border:'1px solid rgba(244,67,54,0.12)',color:'#f44336',fontSize:'11px',cursor:'pointer',transition:'all 0.1s'}}>
            {I.logout} Sair
          </button>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>

        {/* HEADER */}
        <header style={{background:'rgba(15,15,15,0.92)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',borderBottom:'1px solid #181818',height:'52px',display:'flex',alignItems:'center',padding:'0 20px',gap:'12px',position:'sticky',top:0,zIndex:20,flexShrink:0}}>
          <h2 style={{fontSize:'14px',fontWeight:600,color:'#ccc',letterSpacing:'0.01em',flex:1}}>{currentLabel}</h2>
          <button onClick={()=>setSearchOpen(true)} style={{display:'flex',alignItems:'center',gap:'8px',background:'#141414',border:'1px solid #1e1e1e',borderRadius:'9px',padding:'6px 12px',color:'#555',cursor:'pointer',transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.borderColor='#2a2a2a'} onMouseLeave={(e:any)=>e.currentTarget.style.borderColor='#1e1e1e'}>
            {I.search}
            <span style={{fontSize:'12px'}}>Buscar</span>
            <kbd style={{background:'#1a1a1a',border:'1px solid #252525',borderRadius:'4px',padding:'1px 5px',fontSize:'10px',color:'#444',fontFamily:'inherit'}}>⌘K</kbd>
          </button>
          <button onClick={()=>load(token)} className="icon-btn" style={{width:'32px',height:'32px',borderRadius:'8px',border:'1px solid #1e1e1e',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#555',transition:'all 0.1s'}}>
            {I.refresh}
          </button>
          <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(145deg,#00e676,#00b248)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,boxShadow:'0 0 10px rgba(0,230,118,0.2)'}}>
            <span style={{color:'#000',fontWeight:700,fontSize:'12px'}}>{adminName[0]?.toUpperCase()}</span>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main style={{flex:1,padding:'20px',overflowY:'auto'}}>

          {/* ═══ DASHBOARD ═══════════════════════════════════════════════ */}
          {tab==='dashboard'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {loading?(
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
                  {Array(8).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'90px'}}/>)}
                </div>
              ):(
                <>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'10px'}}>
                    {[
                      {label:'Usuarios',value:users.length,sub:`${users.filter((u:any)=>u.status!=='blocked').length} ativos`,color:'#818cf8',bg:'rgba(129,140,248,0.06)',icon:I.users},
                      {label:'Mercados Ativos',value:markets.filter((m:any)=>m.status==='open').length,sub:`${markets.length} total cadastrado`,color:'#00e676',bg:'rgba(0,230,118,0.06)',icon:I.chart},
                      {label:'Depositos',value:`R$${totalDep.toFixed(0)}`,sub:`${deposits.filter((d:any)=>d.status==='completed').length} confirmados`,color:'#00e676',bg:'rgba(0,230,118,0.06)',icon:I.dollar},
                      {label:'Saques',value:`R$${totalWith.toFixed(0)}`,sub:`${withdrawals.filter((w:any)=>w.status==='paid'||w.status==='completed').length} pagos`,color:'#f44336',bg:'rgba(244,67,54,0.06)',icon:I.arrowDown},
                      {label:'Pendente Saque',value:withdrawals.filter((w:any)=>w.status==='pending').length,sub:'Aguardando aprovacao',color:'#ffb300',bg:'rgba(255,179,0,0.06)',icon:I.arrowDown},
                      {label:'Pendente Deposito',value:deposits.filter((d:any)=>d.status==='pending').length,sub:'Aguardando confirmacao',color:'#ffb300',bg:'rgba(255,179,0,0.06)',icon:I.dollar},
                      {label:'Log Auditoria',value:audit.length,sub:'Registros totais',color:'#64748b',bg:'rgba(100,116,139,0.06)',icon:I.shield},
                      {label:'Lucro Total',value:`R$${lucro.toFixed(0)}`,sub:'Depositos menos Saques',color:lucro>=0?'#00e676':'#f44336',bg:lucro>=0?'rgba(0,230,118,0.06)':'rgba(244,67,54,0.06)',icon:I.chart},
                    ].map(c=>(
                      <div key={c.label} className="card-hover" style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px',transition:'border-color 0.15s',cursor:'default'}}>
                        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'12px'}}>
                          <p style={{fontSize:'10.5px',color:'#555',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',lineHeight:1.4}}>{c.label}</p>
                          <div style={{width:'28px',height:'28px',borderRadius:'7px',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',color:c.color,flexShrink:0}}>{c.icon}</div>
                        </div>
                        <p style={{fontSize:'26px',fontWeight:700,color:c.color,letterSpacing:'-0.75px',marginBottom:'4px',lineHeight:1}}>{c.value}</p>
                        <p style={{fontSize:'11px',color:'#3a3a3a',lineHeight:1.4}}>{c.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'18px'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
                        <p style={{fontSize:'12px',fontWeight:600,color:'#ccc',letterSpacing:'0.02em'}}>Mercados Recentes</p>
                        <button onClick={()=>setTab('markets')} style={{fontSize:'11px',color:'#00e676',background:'none',border:'none',cursor:'pointer',letterSpacing:'0.02em'}}>Ver todos →</button>
                      </div>
                      {markets.length===0?<p style={{fontSize:'12px',color:'#333',textAlign:'center',padding:'20px 0'}}>Nenhum mercado.</p>:markets.slice(0,6).map((m:any)=>(
                        <div key={m.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #1e1e1e'}}>
                          <span style={{fontSize:'12px',color:'#888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'220px',flex:1}}>{m.question}</span>
                          <Pill status={m.status}/>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'18px'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
                        <p style={{fontSize:'12px',fontWeight:600,color:'#ccc',letterSpacing:'0.02em'}}>Transacoes Recentes</p>
                        <button onClick={()=>setTab('deposits')} style={{fontSize:'11px',color:'#00e676',background:'none',border:'none',cursor:'pointer',letterSpacing:'0.02em'}}>Ver todas →</button>
                      </div>
                      {[...deposits,...withdrawals].sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).slice(0,6).map((t:any,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #1e1e1e'}}>
                          <div style={{flex:1,overflow:'hidden'}}>
                            <span style={{fontSize:'12px',color:'#888',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.name||'Usuario'}</span>
                            <span style={{fontSize:'10px',color:'#333',textTransform:'uppercase',letterSpacing:'0.08em'}}>{t.type}</span>
                          </div>
                          <span style={{fontSize:'12px',fontWeight:600,color:t.type==='deposit'?'#00e676':'#f44336',flexShrink:0,marginLeft:'8px'}}>R${Number(t.amount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══ MERCADOS ════════════════════════════════════════════════ */}
          {tab==='markets'&&(
            <div>
              <FilterBar search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOptions={['open','suspended','resolved','cancelled']} action={<Btn color="green" onClick={()=>setTab('criar')}>{I.plus} Novo Mercado</Btn>}/>
              <Table loading={loading} cols={['Pergunta','Categoria','SIM%','NAO%','Status','Encerra','Acoes']}
                rows={filteredMarkets.map((m:any)=>[
                  <Cell>{m.question}</Cell>,
                  <span style={{fontSize:'11px',color:'#666',textTransform:'uppercase',letterSpacing:'0.06em'}}>{m.category||'—'}</span>,
                  <span style={{fontSize:'12px',fontWeight:600,color:'#00e676'}}>{m.yes_odds}%</span>,
                  <span style={{fontSize:'12px',fontWeight:600,color:'#f44336'}}>{m.no_odds}%</span>,
                  <Pill status={m.status}/>,
                  <span style={{fontSize:'11px',color:'#444',fontVariantNumeric:'tabular-nums'}}>{m.expires_at?new Date(m.expires_at).toLocaleDateString('pt-BR'):'—'}</span>,
                  <Actions>
                    <Btn onClick={()=>setEditMarket({...m})}>Editar</Btn>
                    {m.status==='open'&&<>
                      <Btn color="green" onClick={()=>confirm_('Resolver mercado como SIM?',async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'yes'});if(r.success){toast_('Resolvido!');load(token)}else toast_(r.error||'Erro','error')})}>SIM</Btn>
                      <Btn color="red" onClick={()=>confirm_('Resolver mercado como NAO?',async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'no'});if(r.success){toast_('Resolvido!');load(token)}else toast_(r.error||'Erro','error')})}>NAO</Btn>
                      <Btn color="red" onClick={()=>confirm_('Cancelar mercado e devolver apostas?',async()=>{const r=await api(`/api/admin/markets/${m.id}/cancel`,'PUT',{});if(r.success){toast_('Cancelado!');load(token)}else toast_(r.error||'Erro','error')})}>Cancelar</Btn>
                    </>}
                  </Actions>
                ])}
              />
            </div>
          )}

          {/* ═══ CRIAR MERCADO ═══════════════════════════════════════════ */}
          {tab==='criar'&&(
            <div style={{maxWidth:'520px'}}>
              <Panel>
                <form onSubmit={createMarket} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                  <F label="Pergunta *"><In value={newMarket.question} onChange={(e:any)=>setNewMarket({...newMarket,question:e.target.value})} placeholder="Ex: Bitcoin vai superar $100k em 2026?" required/></F>
                  <F label="Categoria"><Sel value={newMarket.category} onChange={(e:any)=>setNewMarket({...newMarket,category:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</Sel></F>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    <F label="Chance SIM (%)"><In type="number" min="1" max="99" value={newMarket.yes_odds} style={{color:'#00e676',fontWeight:700}} onChange={(e:any)=>setNewMarket({...newMarket,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))})}/></F>
                    <F label="Chance NAO (%)"><In type="number" min="1" max="99" value={newMarket.no_odds} style={{color:'#f44336',fontWeight:700}} onChange={(e:any)=>setNewMarket({...newMarket,no_odds:e.target.value,yes_odds:String(100-Number(e.target.value))})}/></F>
                  </div>
                  <div style={{background:'#141414',border:'1px solid #1e1e1e',borderRadius:'10px',padding:'14px',display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'10px',color:'#444',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.12em'}}>Mult. SIM</p>
                      <p style={{fontSize:'24px',fontWeight:700,color:'#00e676',letterSpacing:'-0.75px'}}>{(100/Number(newMarket.yes_odds||1)).toFixed(2)}x</p>
                    </div>
                    <div style={{width:'1px',height:'36px',background:'#1e1e1e'}}/>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'10px',color:'#444',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.12em'}}>Mult. NAO</p>
                      <p style={{fontSize:'24px',fontWeight:700,color:'#f44336',letterSpacing:'-0.75px'}}>{(100/Number(newMarket.no_odds||1)).toFixed(2)}x</p>
                    </div>
                  </div>
                  <div style={{height:'3px',borderRadius:'99px',background:'#1e1e1e',overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:'99px',background:'linear-gradient(90deg,#00e676,rgba(0,230,118,0.2))',width:`${newMarket.yes_odds}%`,transition:'width 0.25s ease'}}/>
                  </div>
                  <F label="Data de encerramento"><In type="datetime-local" value={newMarket.expires_at} onChange={(e:any)=>setNewMarket({...newMarket,expires_at:e.target.value})}/></F>
                  <button type="submit" style={{background:'#00e676',color:'#000',border:'none',borderRadius:'10px',padding:'13px',fontWeight:700,fontSize:'14px',cursor:'pointer',letterSpacing:'0.04em',transition:'opacity 0.15s',marginTop:'4px'}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.85'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>
                    CRIAR MERCADO
                  </button>
                </form>
              </Panel>
            </div>
          )}

          {/* ═══ USUARIOS ════════════════════════════════════════════════ */}
          {tab==='users'&&(
            <div>
              <FilterBar search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOptions={['active','blocked','suspended']}/>
              <Table loading={loading} cols={['Nome','E-mail','Status','Tipo','Cadastro','Acoes']}
                rows={filteredUsers.map((u:any)=>[
                  <span style={{fontSize:'13px',color:'#ccc',fontWeight:500}}>{u.name}</span>,
                  <span style={{fontSize:'12px',color:'#555',fontVariantNumeric:'tabular-nums'}}>{u.email}</span>,
                  <Pill status={u.status||'active'}/>,
                  <Pill status={u.is_admin?'admin':'user'}/>,
                  <span style={{fontSize:'11px',color:'#444',fontVariantNumeric:'tabular-nums'}}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</span>,
                  <Actions>
                    <Btn onClick={()=>setEditUser({...u})}>Editar</Btn>
                    <Btn color="green" onClick={()=>setBalanceModal({id:u.id,name:u.name,amount:'',note:''})}>Saldo</Btn>
                  </Actions>
                ])}
              />
            </div>
          )}

          {/* ═══ SAQUES ══════════════════════════════════════════════════ */}
          {tab==='withdrawals'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'14px'}}>
                {[
                  {l:'Pendentes',v:withdrawals.filter((w:any)=>w.status==='pending').length,c:'#ffb300'},
                  {l:'Pagos',v:withdrawals.filter((w:any)=>w.status==='paid'||w.status==='completed').length,c:'#00e676'},
                  {l:'Total Saques',v:`R$${totalWith.toFixed(2)}`,c:'#f44336'},
                ].map(c=>(
                  <div key={c.l} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px'}}>
                    <p style={{fontSize:'10px',color:'#444',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.12em',fontWeight:600}}>{c.l}</p>
                    <p style={{fontSize:'24px',fontWeight:700,color:c.c,letterSpacing:'-0.75px'}}>{c.v}</p>
                  </div>
                ))}
              </div>
              <FilterBar search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOptions={['pending','approved','paid','rejected']}/>
              <Table loading={loading} cols={['Usuario','Valor','Status','Data','Acoes']}
                rows={withdrawals.filter((w:any)=>(!filterStatus||w.status===filterStatus)&&(!filterSearch||w.name?.toLowerCase().includes(filterSearch.toLowerCase()))).map((w:any)=>[
                  <span style={{fontSize:'13px',color:'#ccc',fontWeight:500}}>{w.name||'—'}</span>,
                  <span style={{fontSize:'13px',fontWeight:600,color:'#f44336'}}>R${Number(w.amount).toFixed(2)}</span>,
                  <Pill status={w.status}/>,
                  <span style={{fontSize:'11px',color:'#444',fontVariantNumeric:'tabular-nums'}}>{new Date(w.created_at).toLocaleDateString('pt-BR')}</span>,
                  <Actions>
                    {w.status==='pending'&&<>
                      <Btn color="green" onClick={()=>confirm_('Aprovar este saque?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/approve`,'PUT',{});if(r.success){toast_('Aprovado!');load(token)}else toast_(r.error||'Erro','error')})}>Aprovar</Btn>
                      <Btn color="red" onClick={()=>confirm_('Recusar e devolver saldo?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/reject`,'PUT',{reason:'Recusado'});if(r.success){toast_('Recusado!');load(token)}else toast_(r.error||'Erro','error')})}>Recusar</Btn>
                    </>}
                    {w.status==='approved'&&<Btn color="green" onClick={()=>confirm_('Marcar como pago?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/paid`,'PUT',{});if(r.success){toast_('Marcado pago!');load(token)}else toast_(r.error||'Erro','error')})}>Pago</Btn>}
                  </Actions>
                ])}
              />
            </div>
          )}

          {/* ═══ DEPOSITOS ═══════════════════════════════════════════════ */}
          {tab==='deposits'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'14px'}}>
                {[
                  {l:'Pendentes',v:deposits.filter((d:any)=>d.status==='pending').length,c:'#ffb300'},
                  {l:'Confirmados',v:deposits.filter((d:any)=>d.status==='completed').length,c:'#00e676'},
                  {l:'Total Depositos',v:`R$${totalDep.toFixed(2)}`,c:'#00e676'},
                ].map(c=>(
                  <div key={c.l} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px'}}>
                    <p style={{fontSize:'10px',color:'#444',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.12em',fontWeight:600}}>{c.l}</p>
                    <p style={{fontSize:'24px',fontWeight:700,color:c.c,letterSpacing:'-0.75px'}}>{c.v}</p>
                  </div>
                ))}
              </div>
              <FilterBar search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOptions={['pending','completed','refunded']}/>
              <Table loading={loading} cols={['Usuario','Valor','Status','Data','Acoes']}
                rows={deposits.filter((d:any)=>(!filterStatus||d.status===filterStatus)&&(!filterSearch||d.name?.toLowerCase().includes(filterSearch.toLowerCase()))).map((d:any)=>[
                  <span style={{fontSize:'13px',color:'#ccc',fontWeight:500}}>{d.name||'—'}</span>,
                  <span style={{fontSize:'13px',fontWeight:600,color:'#00e676'}}>R${Number(d.amount).toFixed(2)}</span>,
                  <Pill status={d.status}/>,
                  <span style={{fontSize:'11px',color:'#444',fontVariantNumeric:'tabular-nums'}}>{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>,
                  <Actions>
                    {d.status==='pending'&&<Btn color="green" onClick={()=>confirm_('Aprovar este deposito?',async()=>{const r=await api(`/api/admin/deposits/${d.id}/approve`,'PUT',{});if(r.success){toast_('Aprovado!');load(token)}else toast_(r.error||'Erro','error')})}>Aprovar</Btn>}
                    {d.status==='completed'&&<Btn color="red" onClick={()=>confirm_('Estornar este deposito?',async()=>{const r=await api(`/api/admin/deposits/${d.id}/refund`,'PUT',{});if(r.success){toast_('Estornado!');load(token)}else toast_(r.error||'Erro','error')})}>Estornar</Btn>}
                  </Actions>
                ])}
              />
            </div>
          )}

          {/* ═══ AUDITORIA ═══════════════════════════════════════════════ */}
          {tab==='audit'&&(
            <div>
              <div style={{marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontSize:'12px',color:'#444'}}>{audit.length} registros · somente leitura</span>
              </div>
              <Table loading={loading} cols={['Admin','Acao','IP','Data/Hora']}
                rows={audit.map((a:any)=>[
                  <span style={{fontSize:'12px',color:'#888',fontWeight:500}}>{a.name||'—'}</span>,
                  <span style={{background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.15)',color:'#818cf8',fontSize:'10.5px',fontWeight:600,padding:'2px 8px',borderRadius:'99px',letterSpacing:'0.04em',textTransform:'uppercase'}}>{a.action}</span>,
                  <span style={{fontSize:'11px',color:'#3a3a3a',fontFamily:'monospace'}}>{a.ip||'—'}</span>,
                  <span style={{fontSize:'11px',color:'#444',fontVariantNumeric:'tabular-nums'}}>{new Date(a.created_at).toLocaleString('pt-BR')}</span>,
                ])}
              />
            </div>
          )}

          {/* ═══ CONFIGURACOES ═══════════════════════════════════════════ */}
          {tab==='configs'&&(
            <div style={{maxWidth:'480px'}}>
              <Panel>
                <p style={{fontSize:'10.5px',fontWeight:700,color:'#444',textTransform:'uppercase',letterSpacing:'0.14em',marginBottom:'18px'}}>Parametros Financeiros</p>
                <form onSubmit={saveSettings} style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                  {[
                    {k:'taxa_vitoria',l:'Taxa de vitoria (%)'},
                    {k:'taxa_deposito',l:'Taxa de deposito (%)'},
                    {k:'taxa_saque',l:'Taxa de saque (%)'},
                    {k:'saque_minimo',l:'Saque minimo (R$)'},
                    {k:'saque_maximo',l:'Saque maximo (R$)'},
                    {k:'saque_diario',l:'Limite saque diario (R$)'},
                    {k:'rollover',l:'Rollover base (multiplicador)'},
                  ].map(f=>(
                    <div key={f.k} style={{display:'flex',alignItems:'center',gap:'12px',padding:'11px 0',borderBottom:'1px solid #1a1a1a'}}>
                      <label style={{fontSize:'12px',color:'#666',flex:1,letterSpacing:'0.01em'}}>{f.l}</label>
                      <In type="number" step="0.01" value={settings[f.k]||''} style={{width:'110px',color:'#00e676',fontWeight:700,textAlign:'right',fontVariantNumeric:'tabular-nums'}} onChange={(e:any)=>setSettings({...settings,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <button type="submit" style={{background:'#00e676',color:'#000',border:'none',borderRadius:'10px',padding:'12px',fontWeight:700,fontSize:'13px',cursor:'pointer',marginTop:'16px',letterSpacing:'0.04em',transition:'opacity 0.15s'}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.85'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>
                    SALVAR CONFIGURACOES
                  </button>
                </form>
              </Panel>
            </div>
          )}
        </main>
      </div>

      {/* ══ MODAIS ═══════════════════════════════════════════════════════════ */}

      {editMarket&&(
        <Over onClose={()=>setEditMarket(null)}>
          <MBox title="Editar Mercado" onClose={()=>setEditMarket(null)}>
            <F label="Pergunta"><In value={editMarket.question} onChange={(e:any)=>setEditMarket({...editMarket,question:e.target.value})}/></F>
            <F label="Categoria"><Sel value={editMarket.category||''} onChange={(e:any)=>setEditMarket({...editMarket,category:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</Sel></F>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <F label="SIM (%)"><In type="number" min="1" max="99" style={{color:'#00e676',fontWeight:700}} value={editMarket.yes_odds} onChange={(e:any)=>setEditMarket({...editMarket,yes_odds:e.target.value,no_odds:100-Number(e.target.value)})}/></F>
              <F label="NAO (%)"><In type="number" min="1" max="99" style={{color:'#f44336',fontWeight:700}} value={editMarket.no_odds} onChange={(e:any)=>setEditMarket({...editMarket,no_odds:e.target.value,yes_odds:100-Number(e.target.value)})}/></F>
            </div>
            <F label="Data encerramento"><In type="datetime-local" value={editMarket.expires_at?String(editMarket.expires_at).slice(0,16):''} onChange={(e:any)=>setEditMarket({...editMarket,expires_at:e.target.value})}/></F>
            <F label="Status"><Sel value={editMarket.status} onChange={(e:any)=>setEditMarket({...editMarket,status:e.target.value})}>{['open','suspended','resolved','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}</Sel></F>
            <ModalActions>
              <Btn color="green" onClick={saveMarket}>SALVAR</Btn>
              <Btn onClick={()=>setEditMarket(null)}>Cancelar</Btn>
            </ModalActions>
          </MBox>
        </Over>
      )}

      {editUser&&(
        <Over onClose={()=>setEditUser(null)}>
          <MBox title="Editar Usuario" onClose={()=>setEditUser(null)}>
            <F label="Nome"><In value={editUser.name} onChange={(e:any)=>setEditUser({...editUser,name:e.target.value})}/></F>
            <F label="E-mail"><In value={editUser.email} onChange={(e:any)=>setEditUser({...editUser,email:e.target.value})}/></F>
            <F label="Status"><Sel value={editUser.status||'active'} onChange={(e:any)=>setEditUser({...editUser,status:e.target.value})}>{['active','blocked','suspended'].map(s=><option key={s} value={s}>{s}</option>)}</Sel></F>
            <ModalActions>
              <Btn color="green" onClick={saveUser}>SALVAR</Btn>
              <Btn onClick={()=>setEditUser(null)}>Cancelar</Btn>
            </ModalActions>
          </MBox>
        </Over>
      )}

      {balanceModal&&(
        <Over onClose={()=>setBalanceModal(null)}>
          <MBox title={`Ajustar Saldo · ${balanceModal.name}`} onClose={()=>setBalanceModal(null)}>
            <p style={{fontSize:'12px',color:'#444',marginBottom:'4px'}}>Use valor negativo para remover saldo. A acao sera registrada na auditoria.</p>
            <F label="Valor (R$)"><In type="number" step="0.01" placeholder="Ex: 100.00 ou -50.00" value={balanceModal.amount} onChange={(e:any)=>setBalanceModal({...balanceModal,amount:e.target.value})}/></F>
            <F label="Motivo"><In placeholder="Ex: Bonus de cadastro" value={balanceModal.note} onChange={(e:any)=>setBalanceModal({...balanceModal,note:e.target.value})}/></F>
            <ModalActions>
              <Btn color="green" onClick={()=>confirm_(`Ajustar saldo de ${balanceModal.name} em R$ ${balanceModal.amount}?`,adjustBalance)}>AJUSTAR</Btn>
              <Btn onClick={()=>setBalanceModal(null)}>Cancelar</Btn>
            </ModalActions>
          </MBox>
        </Over>
      )}

      {confirm&&(
        <Over onClose={()=>setConfirm(null)}>
          <div style={{background:'#1a1a1a',border:'1px solid #252525',borderRadius:'14px',padding:'28px 24px',maxWidth:'380px',width:'100%',textAlign:'center'}}>
            <div style={{width:'46px',height:'46px',borderRadius:'50%',background:'rgba(255,179,0,0.08)',border:'1px solid rgba(255,179,0,0.15)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>{I.warning}</div>
            <p style={{fontSize:'14px',color:'#ccc',lineHeight:1.65,marginBottom:'8px'}}>{confirm.msg}</p>
            <p style={{fontSize:'11px',color:'#333',marginBottom:'22px',lineHeight:1.5}}>Esta acao sera automaticamente registrada no log de auditoria com seu IP e horario.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={async()=>{await confirm.action();setConfirm(null)}} style={{flex:1,background:'#00e676',color:'#000',border:'none',borderRadius:'9px',padding:'11px',fontWeight:700,fontSize:'13px',cursor:'pointer',letterSpacing:'0.04em',transition:'opacity 0.15s'}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.85'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>CONFIRMAR</button>
              <button onClick={()=>setConfirm(null)} style={{flex:1,background:'transparent',color:'#555',border:'1px solid #252525',borderRadius:'9px',padding:'11px',fontSize:'13px',cursor:'pointer',transition:'all 0.1s'}} onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor='#2a2a2a';e.currentTarget.style.color='#888'}} onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor='#252525';e.currentTarget.style.color='#555'}}>Cancelar</button>
            </div>
          </div>
        </Over>
      )}

      {searchOpen&&(
        <Over onClose={()=>setSearchOpen(false)}>
          <div style={{background:'#1a1a1a',border:'1px solid #252525',borderRadius:'14px',width:'100%',maxWidth:'500px',overflow:'hidden',boxShadow:'0 24px 64px rgba(0,0,0,0.6)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'14px 16px',borderBottom:'1px solid #1e1e1e'}}>
              <span style={{color:'#444',flexShrink:0}}>{I.search}</span>
              <input autoFocus value={searchQ} onChange={(e:any)=>setSearchQ(e.target.value)} placeholder="Navegar para..." style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#ccc',fontSize:'14px',letterSpacing:'0.01em'}} onKeyDown={(e:any)=>{if(e.key==='Escape')setSearchOpen(false)}}/>
              <kbd style={{background:'#141414',border:'1px solid #222',borderRadius:'5px',padding:'2px 6px',fontSize:'10px',color:'#3a3a3a',fontFamily:'inherit'}}>ESC</kbd>
            </div>
            <div style={{padding:'6px'}}>
              {NAV.flatMap(s=>s.items).filter(item=>!searchQ||item.label.toLowerCase().includes(searchQ.toLowerCase())).map(item=>(
                <button key={item.id} onClick={()=>{setTab(item.id);setSearchOpen(false);setSearchQ('')}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',border:'none',background:'transparent',cursor:'pointer',borderRadius:'8px',color:'#666',fontSize:'13px',textAlign:'left',letterSpacing:'0.01em',transition:'all 0.08s'}} onMouseEnter={(e:any)=>{e.currentTarget.style.background='#222';e.currentTarget.style.color='#ccc'}} onMouseLeave={(e:any)=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#666'}}>
                  <span style={{opacity:0.5,flexShrink:0}}>{(I as any)[item.icon]}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </Over>
      )}

      {/* ══ TOAST ════════════════════════════════════════════════════════════ */}
      {toast&&(
        <div style={{position:'fixed',bottom:'20px',right:'20px',zIndex:999,animation:'toastSlide 0.2s ease',display:'flex',alignItems:'center',gap:'10px',background:'#1a1a1a',border:`1px solid ${toast.type==='error'?'rgba(244,67,54,0.2)':'rgba(0,230,118,0.2)'}`,borderRadius:'10px',padding:'12px 16px',maxWidth:'300px',boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}>
          {toast.type==='error'?I.x:I.check}
          <span style={{fontSize:'13px',color:toast.type==='error'?'#f44336':'#00e676',fontWeight:500,letterSpacing:'0.01em'}}>{toast.text}</span>
        </div>
      )}
    </div>
  )
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Pill({status}:{status:string}) {
  const m:any={
    open:{bg:'rgba(0,230,118,0.07)',c:'#00e676',b:'rgba(0,230,118,0.15)'},
    active:{bg:'rgba(0,230,118,0.07)',c:'#00e676',b:'rgba(0,230,118,0.15)'},
    completed:{bg:'rgba(0,230,118,0.07)',c:'#00e676',b:'rgba(0,230,118,0.15)'},
    paid:{bg:'rgba(0,230,118,0.07)',c:'#00e676',b:'rgba(0,230,118,0.15)'},
    resolved:{bg:'rgba(99,102,241,0.07)',c:'#818cf8',b:'rgba(99,102,241,0.15)'},
    admin:{bg:'rgba(99,102,241,0.07)',c:'#818cf8',b:'rgba(99,102,241,0.15)'},
    pending:{bg:'rgba(255,179,0,0.07)',c:'#ffb300',b:'rgba(255,179,0,0.15)'},
    processing:{bg:'rgba(255,179,0,0.07)',c:'#ffb300',b:'rgba(255,179,0,0.15)'},
    suspended:{bg:'rgba(255,179,0,0.07)',c:'#ffb300',b:'rgba(255,179,0,0.15)'},
    cancelled:{bg:'rgba(244,67,54,0.07)',c:'#f44336',b:'rgba(244,67,54,0.15)'},
    blocked:{bg:'rgba(244,67,54,0.07)',c:'#f44336',b:'rgba(244,67,54,0.15)'},
    rejected:{bg:'rgba(244,67,54,0.07)',c:'#f44336',b:'rgba(244,67,54,0.15)'},
    refunded:{bg:'rgba(244,67,54,0.07)',c:'#f44336',b:'rgba(244,67,54,0.15)'},
    user:{bg:'rgba(255,255,255,0.04)',c:'#444',b:'rgba(255,255,255,0.07)'},
  }
  const s=m[status]||{bg:'rgba(255,255,255,0.04)',c:'#444',b:'rgba(255,255,255,0.07)'}
  return <span style={{display:'inline-block',padding:'2px 9px',borderRadius:'99px',fontSize:'10.5px',fontWeight:600,letterSpacing:'0.05em',background:s.bg,color:s.c,border:`1px solid ${s.b}`,textTransform:'uppercase'}}>{status}</span>
}

function Table({cols,rows,loading}:{cols:string[],rows:any[][],loading:boolean}) {
  if(loading) return <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'44px'}}/>)}</div>
  if(!rows.length) return <div style={{background:'#1a1a1a',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'52px',textAlign:'center'}}><p style={{color:'#333',fontSize:'13px',letterSpacing:'0.02em'}}>Nenhum registro encontrado.</p></div>
  return (
    <div style={{overflowX:'auto',borderRadius:'12px',border:'1px solid #1e1e1e'}}>
      <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
        <thead>
          <tr style={{background:'#141414',borderBottom:'1px solid #1e1e1e'}}>
            {cols.map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'9.5px',fontWeight:700,color:'#3a3a3a',textTransform:'uppercase',letterSpacing:'0.16em',whiteSpace:'nowrap'}}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
              {row.map((cell,j)=><td key={j} style={{padding:'10px 14px',verticalAlign:'middle'}}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FilterBar({search,onSearch,status,onStatus,statusOptions,action}:any) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}>
      <div style={{position:'relative',flex:1,minWidth:'180px',maxWidth:'320px'}}>
        <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#333',pointerEvents:'none'}}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input value={search} onChange={(e:any)=>onSearch(e.target.value)} placeholder="Filtrar..." style={{width:'100%',background:'#141414',border:'1px solid #1e1e1e',borderRadius:'9px',padding:'7px 10px 7px 30px',color:'#888',fontSize:'12px',outline:'none',transition:'border-color 0.15s'}} onFocus={(e:any)=>e.target.style.borderColor='#2a2a2a'} onBlur={(e:any)=>e.target.style.borderColor='#1e1e1e'}/>
      </div>
      {statusOptions&&(
        <select value={status} onChange={(e:any)=>onStatus(e.target.value)} style={{background:'#141414',border:'1px solid #1e1e1e',borderRadius:'9px',padding:'7px 10px',color:status?'#ccc':'#444',fontSize:'12px',outline:'none',cursor:'pointer'}}>
          <option value="">Todos os status</option>
          {statusOptions.map((s:string)=><option key={s} value={s}>{s}</option>)}
        </select>
      )}
      {(search||status)&&<button onClick={()=>{onSearch('');onStatus('')}} style={{background:'transparent',border:'1px solid #1e1e1e',borderRadius:'9px',padding:'7px 12px',color:'#444',fontSize:'11px',cursor:'pointer',letterSpacing:'0.04em',transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.color='#888'} onMouseLeave={(e:any)=>e.currentTarget.style.color='#444'}>Limpar</button>}
      {action&&<div style={{marginLeft:'auto'}}>{action}</div>}
    </div>
  )
}

function Over({children,onClose}:{children:any,onClose:()=>void}) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(6px)',WebkitBackdropFilter:'blur(6px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      {children}
    </div>
  )
}

function MBox({title,onClose,children}:{title:string,onClose:()=>void,children:any}) {
  return (
    <div style={{background:'#1a1a1a',border:'1px solid #252525',borderRadius:'14px',padding:'24px',width:'100%',maxWidth:'480px',maxHeight:'92vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,0.6)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'22px'}}>
        <h3 style={{fontSize:'15px',fontWeight:600,color:'#ccc',letterSpacing:'0.01em'}}>{title}</h3>
        <button onClick={onClose} style={{background:'#141414',border:'1px solid #1e1e1e',cursor:'pointer',color:'#555',width:'28px',height:'28px',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',transition:'all 0.1s'}} onMouseEnter={(e:any)=>{e.currentTarget.style.color='#888';e.currentTarget.style.borderColor='#2a2a2a'}} onMouseLeave={(e:any)=>{e.currentTarget.style.color='#555';e.currentTarget.style.borderColor='#1e1e1e'}}>×</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>{children}</div>
    </div>
  )
}

function Panel({children}:{children:any}) {
  return <div style={{background:'#1a1a1a',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'22px'}}>{children}</div>
}

function F({label,children}:{label:string,children:any}) {
  return (
    <div>
      <label style={{fontSize:'10px',color:'#3a3a3a',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.16em',fontWeight:700}}>{label}</label>
      {children}
    </div>
  )
}

function In({style,...p}:any) {
  return <input {...p} style={{width:'100%',background:'#141414',border:'1px solid #1e1e1e',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',transition:'border-color 0.15s',letterSpacing:'0.01em',...style}} onFocus={(e:any)=>e.target.style.borderColor='rgba(0,230,118,0.4)'} onBlur={(e:any)=>e.target.style.borderColor='#1e1e1e'}/>
}

function Sel({style,...p}:any) {
  return <select {...p} style={{width:'100%',background:'#141414',border:'1px solid #1e1e1e',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',cursor:'pointer',...style}}/>
}

function Btn({children,onClick,color='gray'}:{children:any,onClick:()=>void,color?:string}) {
  const m:any={
    green:{bg:'#00e676',c:'#000',b:'none',fw:700},
    red:{bg:'rgba(244,67,54,0.07)',c:'#f44336',b:'1px solid rgba(244,67,54,0.15)',fw:600},
    gray:{bg:'rgba(255,255,255,0.04)',c:'#555',b:'1px solid #1e1e1e',fw:500},
  }
  const s=m[color]
  return <button onClick={onClick} style={{padding:'7px 14px',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:s.fw,background:s.bg,color:s.c,border:s.b,letterSpacing:'0.03em',transition:'opacity 0.12s',whiteSpace:'nowrap'}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.8'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>{children}</button>
}

function Cell({children}:{children:any}) {
  return <span style={{fontSize:'13px',color:'#888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block',maxWidth:'220px'}}>{children}</span>
}

function Actions({children}:{children:any}) {
  return <div style={{display:'flex',gap:'5px',alignItems:'center'}}>{children}</div>
}

function ModalActions({children}:{children:any}) {
  return <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>{children}</div>
}
