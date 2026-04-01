'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { LayoutDashboard, BarChart3, Shield, Settings, Users, UserCog, Wallet, ArrowDownToLine, ArrowUpFromLine, UserCheck, FileText, History, Calendar, TrendingUp, Palette, ImageIcon, LogOut, ChevronDown, Search, ExternalLink, Bell, DollarSign, QrCode, UserPlus, Briefcase, ChevronLeft, ChevronRight, AlertTriangle, X, Check, Plus, Trash2, RefreshCw, FileDown, GripVertical, Upload, HelpCircle, Pencil } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

const NAV_SECTIONS = [
  { title: 'Principal', items: [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Métricas', icon: BarChart3, id: 'metricas' },
    { label: 'Auditoria', icon: Shield, id: 'audit' },
    { label: 'Configurações', icon: Settings, id: 'configs' },
  ]},
  { title: 'Gerenciamento', items: [
    { label: 'Admins', icon: UserCog, id: 'admins' },
    { label: 'Usuários', icon: Users, id: 'users' },
  ]},
  { title: 'Financeiro', items: [
    { label: 'Saques', icon: ArrowUpFromLine, id: 'withdrawals' },
    { label: 'Depósitos', icon: ArrowDownToLine, id: 'deposits' },
  ]},
  { title: 'Área de Afiliados', items: [
    { label: 'Gerentes', icon: Briefcase, id: 'gerentes' },
    { label: 'Afiliados', icon: UserCheck, id: 'afiliados' },
    { label: 'Saques Afiliados', icon: Wallet, id: 'saques-afiliados' },
    { label: 'Relatório', icon: FileText, id: 'relatorio' },
  ]},
  { title: 'Operacional', items: [
    { label: 'Apostas', icon: DollarSign, id: 'apostas' },
    { label: 'Histórico', icon: History, id: 'historico' },
    { label: 'Eventos', icon: Calendar, id: 'eventos' },
    { label: 'Mercados', icon: TrendingUp, id: 'markets' },
  ]},
  { title: 'Customização', items: [
    { label: 'Estilo', icon: Palette, id: 'estilo' },
    { label: 'Banners', icon: ImageIcon, id: 'banners' },
  ]},
]


const CATS = ['Entretenimento','Criptomoedas','Financeiro','Esportes','Politica','Clima','Celebridades']

export default function Admin() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [token, setToken] = useState('')
  const [adminName, setAdminName] = useState('SA')
  const [markets, setMarkets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [deposits, setDeposits] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [audit, setAudit] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [stats, setStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<any>(null)
  const [confirm, setConfirm] = useState<any>(null)
  const [editMarket, setEditMarket] = useState<any>(null)
  const [editUser, setEditUser] = useState<any>(null)
  const [balanceModal, setBalanceModal] = useState<any>(null)
  const [openSections, setOpenSections] = useState<any>({Principal:true,Gerenciamento:true,Financeiro:true,'Área de Afiliados':true,Operacional:true,Customização:true})
  const [chartPeriod, setChartPeriod] = useState('7d')
  const [newMarket, setNewMarket] = useState({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:'',image_url:'',type:'single',options:[{title:'',yes_odds:'50',no_odds:'50'}]})
  const [bets, setBets] = useState<any[]>([])
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [managers, setManagers] = useState<any[]>([])
  const [sidebarLogo, setSidebarLogo] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('user'), t = localStorage.getItem('token')
    if (!u||!t) { router.push('/login'); return }
    const p = JSON.parse(u)
    if (!p.is_admin) { router.push('/'); return }
    setAdminName(p.name?.slice(0,2).toUpperCase()||'SA')
    setToken(t); load(t)
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey||e.metaKey)&&e.key==='k') { e.preventDefault(); setSearchOpen(s=>!s) } }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  useEffect(() => {
    if (!token) return
    const days = chartPeriod === '7d' ? 7 : chartPeriod === '30d' ? 30 : 90
    fetch(API+`/api/admin/chart?days=${days}`, {headers:{'Authorization':'Bearer '+token}})
      .then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setChartData(d) }).catch(()=>{})
  }, [chartPeriod, token])

  async function load(t: string) {
    setLoading(true)
    const h = {'Authorization':'Bearer '+t}
    const [m,u,d,w,a,s,aff,bt,st,mg] = await Promise.all([
      fetch(API+'/api/admin/markets',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/users',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/deposits',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/withdrawals',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/audit',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/settings',{headers:h}).then(r=>r.json()).catch(()=>({})),
      fetch(API+'/api/admin/referrals',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/bets',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/stats',{headers:h}).then(r=>r.json()).catch(()=>({})),
      fetch(API+'/api/admin/managers',{headers:h}).then(r=>r.json()).catch(()=>[]),
    ])
    setMarkets(Array.isArray(m)?m:[]);setUsers(Array.isArray(u)?u:[])
    setDeposits(Array.isArray(d)?d:[]);setWithdrawals(Array.isArray(w)?w:[])
    setAudit(Array.isArray(a)?a:[]);setSettings(s||{}); setAffiliates(Array.isArray(aff)?aff:[]);setBets(Array.isArray(bt)?bt:[]);setStats(st||{});setManagers(Array.isArray(mg)?mg:[]);setLoading(false)
    if(s?.logo_url) setSidebarLogo(API+s.logo_url)
  }

  function showToast(text: string, type='success') { setToast({text,type}); setTimeout(()=>setToast(null),3500) }

  async function api(url: string, method='GET', body?: any) {
    const r = await fetch(API+url,{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:body?JSON.stringify(body):undefined})
    return r.json()
  }

  async function createMarket(e: any) {
    e.preventDefault()
    const r = await api('/api/admin/markets','POST',{...newMarket,yes_odds:Number(newMarket.yes_odds),no_odds:Number(newMarket.no_odds),expires_at:newMarket.expires_at||null,type:newMarket.type,options:newMarket.type==='multiple'?newMarket.options.filter((o:any)=>o.title).map((o:any)=>({...o,yes_odds:Number(o.yes_odds),no_odds:Number(o.no_odds)})):[]})
    if (r.id) { showToast('Mercado criado!'); setNewMarket({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:'',image_url:'',type:'single',options:[{title:'',yes_odds:'50',no_odds:'50'}]}); load(token); setTab('mercados') } else showToast(r.error||'Erro','error')
  }
  async function saveMarket() { const opts=editMarket.type==='multiple'?(editMarket.options||[]).filter((o:any)=>o.title).map((o:any)=>({...o,yes_odds:Number(o.yes_odds),no_odds:Number(o.no_odds)})):[] ; const r = await api(`/api/admin/markets/${editMarket.id}`,'PUT',{...editMarket,yes_odds:Number(editMarket.yes_odds),no_odds:Number(editMarket.no_odds),type:editMarket.type||'single',options:opts}); if(r.id){showToast('Salvo!');setEditMarket(null);load(token)}else showToast(r.error||'Erro','error') }
  async function saveUser() { const r = await api(`/api/admin/users/${editUser.id}`,'PUT',editUser); if(r.id){showToast('Salvo!');setEditUser(null);load(token)}else showToast(r.error||'Erro','error') }
  async function openEditUser(id: string) {
    try {
      const r = await fetch(API+`/api/admin/users/${id}/details`,{headers:{'Authorization':'Bearer '+token}})
      const d = await r.json()
      if(d.id) setEditUser(d)
      else showToast('Erro ao carregar usuário','error')
    } catch(e) { showToast('Erro de conexão','error') }
  }
  async function adjBalance() {
    const r = await fetch(API+`/api/admin/users/${balanceModal.id}/balance`,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({balance:Number(balanceModal.newBalance)})})
    const d = await r.json()
    if(d.success){
      showToast('Saldo ajustado!')
      setUsers(users.map((u:any)=>u.id===balanceModal.id?{...u,balance:d.new_balance}:u))
      setBalanceModal(null)
    } else showToast(d.error||'Erro','error')
  }
  async function saveSettings(e: any) { e.preventDefault(); const r = await api('/api/admin/settings','PUT',settings); if(r.success){showToast('Configurações salvas!')}else{showToast(r.error||'Erro','error')} }

  const totalDep = deposits.filter((d:any)=>d.status==='completed').reduce((a:number,d:any)=>a+Number(d.amount),0)
  const totalWith = withdrawals.filter((w:any)=>w.status==='completed'||w.status==='paid').reduce((a:number,w:any)=>a+Number(w.amount),0)
  const lucro = totalDep - totalWith
  const fmt = (n: number) => `R$ ${n.toLocaleString('pt-BR',{minimumFractionDigits:2})}`

  const currentLabel = NAV_SECTIONS.flatMap(s=>s.items).find(i=>i.id===tab)?.label||'Dashboard'

  const filteredUsers = users.filter((u:any) => (!filterStatus||(u.status||'active')===filterStatus) && (!filterSearch||u.name?.toLowerCase().includes(filterSearch.toLowerCase())||u.email?.toLowerCase().includes(filterSearch.toLowerCase())))
  const filteredMarkets = markets.filter((m:any) => (!filterStatus||m.status===filterStatus) && (!filterSearch||m.question?.toLowerCase().includes(filterSearch.toLowerCase())))
  const filteredWithdrawals = withdrawals.filter((w:any) => (!filterStatus||w.status===filterStatus) && (!filterSearch||w.name?.toLowerCase().includes(filterSearch.toLowerCase())))
  const filteredDeposits = deposits.filter((d:any) => (!filterStatus||d.status===filterStatus) && (!filterSearch||d.name?.toLowerCase().includes(filterSearch.toLowerCase())))

  const V = {
    bg: '#0f0f0f',
    sidebar: '#111',
    card: '#1a1a1a',
    hover: '#222',
    border: '#222',
    green: '#00e676',
    red: '#f44336',
    yellow: '#ffb300',
    blue: '#3b82f6',
    text: '#fff',
    muted: '#888',
    label: '#555',
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',background:V.bg,color:V.text,fontFamily:"'Inter',system-ui,sans-serif",fontSize:'14px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea,button{font-family:inherit;font-size:13px}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#0f0f0f}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#333}
        .nav-item:hover{background:#1a1a1a!important;color:#fff!important}
        .trow:hover td{background:#1a1a1a!important}
        .metric-card:hover{background:#1f1f1f!important}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .skel{background:linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%);background-size:200% 100%;animation:shimmer 1.6s ease infinite;border-radius:8px}
        .fade-in{animation:fadeIn 0.2s ease}
        .section-toggle{transition:transform 0.2s}
        @media (max-width: 768px) {
          .sidebar-mobile { transform: translateX(-100%) !important; transition: transform 0.25s ease !important; }
          .sidebar-mobile.open { transform: translateX(0) !important; }
          .main-mobile { margin-left: 0 !important; }
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
          .grid-3 { grid-template-columns: repeat(2,1fr) !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .header-search { display: none !important; }
          .table-wrap { overflow-x: auto !important; }
          .mobile-pad { padding: 16px !important; }
          .sidebar-overlay { display: block !important; }
          .hamburger-btn { display: flex !important; }
        }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 39; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div className={sidebarOpen ? 'sidebar-overlay' : ''} onClick={()=>setSidebarOpen(false)} />
      <aside className={`sidebar-mobile${sidebarOpen?' open':''}`} style={{width:'240px',flexShrink:0,background:V.sidebar,borderRight:`1px solid ${V.border}`,display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,height:'100vh',zIndex:40,overflowY:'auto'}}>
        {/* Logo */}
        <div style={{padding:'16px',borderBottom:`1px solid ${V.border}`,display:'flex',alignItems:'center',gap:'10px',height:'56px',flexShrink:0}}>
          {sidebarLogo
            ? <img src={sidebarLogo} alt="logo" style={{height:'32px',maxWidth:'160px',objectFit:'contain'}} onError={()=>setSidebarLogo('')}/>
            : <><div style={{width:'32px',height:'32px',borderRadius:'8px',background:V.green,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <TrendingUp size={16} color="#000" strokeWidth={2.5}/>
              </div>
              <span style={{fontWeight:700,fontSize:'14px',color:V.text}}>Admin Panel</span></>
          }
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:'8px 12px',overflowY:'auto'}}>
          {NAV_SECTIONS.map(section => (
            <div key={section.title} style={{marginBottom:'4px'}}>
              <button onClick={()=>setOpenSections((p:any)=>({...p,[section.title]:!p[section.title]}))}
                style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 8px',background:'none',border:'none',cursor:'pointer',color:V.label,marginTop:'8px'}}>
                <span style={{fontSize:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em'}}>{section.title}</span>
                <ChevronDown size={12} color={V.label} style={{transform:openSections[section.title]?'rotate(180deg)':'none',transition:'transform 0.2s'}}/>
              </button>
              {openSections[section.title] && section.items.map(item => {
                const active = tab === item.id
                return (
                  <button key={item.id} onClick={()=>{setTab(item.id);setFilterStatus('');setFilterSearch('');setPage(1);setSidebarOpen(false)}} className="nav-item"
                    style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'6px',border:'none',cursor:'pointer',background:active?`${V.green}15`:'transparent',color:active?V.green:V.muted,fontSize:'13px',fontWeight:active?600:400,textAlign:'left',marginBottom:'2px',position:'relative',transition:'all 0.1s'}}>
                    {active && <span style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:'3px',height:'20px',background:V.green,borderRadius:'0 2px 2px 0'}}/>}
                    <item.icon size={15} strokeWidth={1.75} style={{flexShrink:0}}/>
                    {item.label}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{padding:'12px',borderTop:`1px solid ${V.border}`,flexShrink:0}}>
          <button onClick={()=>{localStorage.clear();router.push('/')}} className="nav-item"
            style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'6px',border:'none',cursor:'pointer',background:'transparent',color:V.muted,fontSize:'13px',textAlign:'left',transition:'all 0.1s'}}>
            <LogOut size={15} strokeWidth={1.75}/> Sair
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-mobile" style={{marginLeft:'240px',flex:1,display:'flex',flexDirection:'column',minWidth:0}}>

        {/* HEADER */}
        <header style={{position:'sticky',top:0,zIndex:30,height:'56px',background:`${V.bg}cc`,backdropFilter:'blur(12px)',borderBottom:`1px solid ${V.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <button className="hamburger-btn" onClick={()=>setSidebarOpen(s=>!s)} style={{display:'none',alignItems:'center',justifyContent:'center',width:'36px',height:'36px',border:`1px solid ${V.border}`,borderRadius:'8px',background:'transparent',cursor:'pointer',color:V.muted}}>
              <GripVertical size={18}/>
            </button>
            <div className="header-search" style={{position:'relative'}}>
              <Search size={15} color={V.muted} style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
              <input placeholder="Buscar... (Ctrl+K)" onClick={()=>setSearchOpen(true)} readOnly
                style={{width:'240px',height:'36px',background:V.card,border:`1px solid ${V.border}`,borderRadius:'8px',padding:'0 12px 0 34px',color:V.muted,cursor:'pointer',outline:'none'}}/>
              <kbd style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:V.hover,border:`1px solid #333`,borderRadius:'4px',padding:'1px 5px',fontSize:'10px',color:V.label}}>Ctrl+K</kbd>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <a href="/" target="_blank" style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',borderRadius:'8px',border:`1px solid ${V.border}`,color:V.muted,fontSize:'12px',textDecoration:'none',background:'transparent',transition:'all 0.1s'}}>
              <ExternalLink size={13}/> Ver Site
            </a>
            <button style={{position:'relative',width:'36px',height:'36px',borderRadius:'8px',border:`1px solid ${V.border}`,background:'transparent',cursor:'pointer',color:V.muted,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Bell size={15}/>
              <span style={{position:'absolute',top:'8px',right:'8px',width:'6px',height:'6px',borderRadius:'50%',background:V.green}}/>
            </button>
            <div style={{width:'32px',height:'32px',borderRadius:'50%',background:V.green,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{color:'#000',fontWeight:700,fontSize:'11px'}}>{adminName}</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="mobile-pad" style={{flex:1,padding:'24px',overflowY:'auto'}}>

          {/* ═══ DASHBOARD ═══ */}
          {tab==='dashboard' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'24px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Dashboard</h1>

              {loading ? (
                <div className="grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                  {Array(16).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'88px'}}/>)}
                </div>
              ) : (
                <>
                  {/* ROW 1 */}
                  <div className="grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    <MCard title="Usuários Cadastrados" value={(stats?.usuarios_total??users.length).toLocaleString()} sub={`${stats?.usuarios_ativos??0} ativos`} icon={Users} color="blue" tip="Total de contas criadas na plataforma. Ativos = contas não bloqueadas."/>
                    <MCard title="Saldo dos Jogadores" value={fmt(stats?.saldo_jogadores??0)} sub={`${stats?.usuarios_com_saldo??0} com saldo`} icon={Wallet} color="green" tip="Soma real do saldo disponível nas carteiras de todos os jogadores agora."/>
                    <MCard title="Saldo do Portfólio" value={fmt(stats?.lucro_total??0)} sub="Lucro acumulado" icon={Briefcase} color="green" tip="Lucro da plataforma: total de depósitos aprovados menos total de saques pagos."/>
                    <MCard title="Mercados Ativos" value={(stats?.mercados_ativos??markets.filter((m:any)=>m.status==='open').length).toString()} sub={`${stats?.mercados_total??markets.length} total`} icon={TrendingUp} color="green" tip="Mercados com status 'aberto' disponíveis para apostas agora."/>
                  </div>
                  {/* ROW 2 */}
                  <div className="grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    <MCard title="Depósitos Hoje" value={fmt(stats?.dep_hoje_valor??0)} sub={`${stats?.dep_hoje_total??0} gerados · ${stats?.dep_hoje_pagos??0} pagos`} icon={ArrowDownToLine} color="green" tip="Valor total de depósitos confirmados (status=completed) apenas no dia de hoje."/>
                    <MCard title="Saques Hoje" value={fmt(stats?.saq_hoje_valor??0)} sub={`${stats?.saq_hoje_total??0} solicitados`} icon={ArrowUpFromLine} color="red" tip="Valor total de saques aprovados/pagos solicitados hoje."/>
                    <MCard title="Pix Gerados Hoje" value={(stats?.pix_hoje_total??0).toString()} sub={stats?.pix_hoje_total?`${Math.round((stats.pix_hoje_pagos/stats.pix_hoje_total)*100)}% pagos`:'—% pagos'} icon={QrCode} color="green" tip="Quantidade de cobranças Pix geradas hoje. % pagos = quantas foram efetivamente pagas."/>
                    <MCard title="Usuários Hoje" value={(stats?.usuarios_hoje??0).toString()} sub={stats?.usuarios_hoje&&stats?.dep_hoje_pagos?`${Math.round((stats.dep_hoje_pagos/stats.usuarios_hoje)*100)}% depositaram`:'—% depositaram'} icon={UserPlus} color="blue" tip="Novos cadastros realizados hoje. % depositaram = quantos dos novos já fizeram um depósito."/>
                  </div>
                  {/* ROW 3 */}
                  <div className="grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    <MCard title="Depósitos Total" value={fmt(stats?.dep_total_valor??0)} sub={`${stats?.dep_total_pagos??0} recebidos`} icon={ArrowDownToLine} color="green" tip="Soma de todos os depósitos confirmados desde o início da plataforma."/>
                    <MCard title="Saques Total" value={fmt(stats?.saq_total_valor??0)} sub={`${stats?.saq_total_aprovados??0} aprovados`} icon={ArrowUpFromLine} color="red" tip="Soma de todos os saques pagos desde o início da plataforma."/>
                    <MCard title="Pix Gerados Total" value={(stats?.pix_total_total??0).toString()} sub={stats?.pix_total_total?`${Math.round((stats.pix_total_pagos/stats.pix_total_total)*100)}% conversão`:'—% conversão'} icon={QrCode} color="blue" tip="Total de cobranças Pix geradas na plataforma. % conversão = proporção que foi paga."/>
                    <MCard title="Lucro Total" value={fmt(stats?.lucro_total??0)} sub="Lucro acumulado" icon={DollarSign} color="green" tip="Lucro líquido da plataforma: depósitos totais menos saques totais pagos."/>
                  </div>
                  {/* ROW 4 */}
                  <div className="grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    <MCard title="Saques Usuários Geral" value={fmt(stats?.saq_total_valor??0)} sub={`${stats?.saq_total_aprovados??0} aprovados`} icon={Wallet} color="green" tip="Total sacado por jogadores comuns (excluindo afiliados) desde o início."/>
                    <MCard title="Saques Usuários Hoje" value={fmt(stats?.saq_hoje_valor??0)} sub={`${stats?.saq_hoje_total??0} hoje`} icon={Wallet} color="yellow" tip="Total sacado por jogadores comuns apenas hoje."/>
                    <MCard title="Saques Afiliados Geral" value={fmt(stats?.afiliados_total_valor??0)} sub={`${stats?.afiliados_total_aprovados??0} aprovados`} icon={Wallet} color="green" tip="Total de comissões de afiliados sacadas e aprovadas desde o início."/>
                    <MCard title="Saques Afiliados Hoje" value={fmt(stats?.afiliados_hoje_valor??0)} sub="hoje" icon={Wallet} color="yellow" tip="Total de comissões de afiliados aprovadas para saque hoje."/>
                  </div>

                  {/* CHARTS */}
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    {['7d','30d','90d'].map(p=>(
                      <button key={p} onClick={()=>setChartPeriod(p)} style={{padding:'5px 14px',borderRadius:'6px',border:`1px solid ${chartPeriod===p?V.green:V.border}`,background:chartPeriod===p?`${V.green}15`:'transparent',color:chartPeriod===p?V.green:V.muted,fontSize:'12px',cursor:'pointer',fontWeight:chartPeriod===p?600:400,transition:'all 0.15s'}}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                    <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'20px'}}>
                      <h3 style={{fontSize:'14px',fontWeight:600,marginBottom:'16px'}}>Lucros</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f"/>
                          <XAxis dataKey="date" tick={{fill:V.muted,fontSize:11}} stroke="#1f1f1f"/>
                          <YAxis tick={{fill:V.muted,fontSize:11}} stroke="#1f1f1f"/>
                          <Tooltip contentStyle={{background:V.card,border:`1px solid ${V.border}`,borderRadius:'8px',fontSize:12}}/>
                          <Line type="monotone" dataKey="lucro" stroke={V.green} strokeWidth={2} dot={false}/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'20px'}}>
                      <h3 style={{fontSize:'14px',fontWeight:600,marginBottom:'16px'}}>Depósitos e Saques</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f"/>
                          <XAxis dataKey="date" tick={{fill:V.muted,fontSize:11}} stroke="#1f1f1f"/>
                          <YAxis tick={{fill:V.muted,fontSize:11}} stroke="#1f1f1f"/>
                          <Tooltip contentStyle={{background:V.card,border:`1px solid ${V.border}`,borderRadius:'8px',fontSize:12}}/>
                          <Legend wrapperStyle={{fontSize:11,color:V.muted}}/>
                          <Line type="monotone" dataKey="depositos" name="Depósitos" stroke={V.green} strokeWidth={2} dot={false}/>
                          <Line type="monotone" dataKey="saques" name="Saques" stroke={V.red} strokeWidth={2} dot={false}/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══ MERCADOS ═══ */}
          {tab==='markets' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Mercados</h1>
                <PrimaryBtn onClick={()=>setTab('criar-mercado')}><Plus size={14}/> Criar Mercado</PrimaryBtn>
              </div>
              <FilterRow search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOpts={['open','suspended','resolved','cancelled']}/>
              <DataTbl loading={loading}
                cols={['Pergunta','Categoria','SIM%','NAO%','Tipo','Status','Encerra','Ações']}
                rows={filteredMarkets.map((m:any)=>[
                  <span style={{color:'#ccc',fontSize:'13px',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>{m.question}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{m.category||'—'}</span>,
                  <span style={{color:V.green,fontWeight:600,fontSize:'12px'}}>{m.yes_odds}%</span>,
                  <span style={{color:V.red,fontWeight:600,fontSize:'12px'}}>{m.no_odds}%</span>,
                  <span style={{padding:'2px 8px',borderRadius:'4px',fontSize:'10px',fontWeight:700,background:m.type==='multiple'?'rgba(106,221,0,0.1)':'rgba(255,255,255,0.06)',color:m.type==='multiple'?'#6ADD00':'#555'}}>{m.type==='multiple'?'MÚLTIPLO':'SIMPLES'}</span>,
                  <SBadge status={m.status}/>,
                  <span style={{color:V.muted,fontSize:'11px'}}>{m.expires_at?new Date(m.expires_at).toLocaleDateString('pt-BR'):'—'}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    <GhostBtn onClick={()=>setEditMarket({...m})}>Editar</GhostBtn>
                    {m.status==='open'&&<>
                      <GhostBtn color="green" onClick={()=>setConfirm({msg:'Resolver como SIM?',action:async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'yes'});if(r.success){showToast('Resolvido!');load(token)}else showToast(r.error,'error')}})}>SIM</GhostBtn>
                      <GhostBtn color="red" onClick={()=>setConfirm({msg:'Resolver como NAO?',action:async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'no'});if(r.success){showToast('Resolvido!');load(token)}else showToast(r.error,'error')}})}>NAO</GhostBtn>
                      <GhostBtn color="red" onClick={()=>setConfirm({msg:'Cancelar mercado?',action:async()=>{const r=await api(`/api/admin/markets/${m.id}/cancel`,'PUT',{});if(r.success){showToast('Cancelado!');load(token)}else showToast(r.error,'error')}})}>Cancelar</GhostBtn>
                    </>}
                  </div>
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ CRIAR MERCADO ═══ */}
          {tab==='criar-mercado' && (
            <div className="fade-in" style={{maxWidth:'560px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif",marginBottom:'20px'}}>Criar Mercado</h1>
              <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'24px'}}>
                <form onSubmit={createMarket} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                  <FField label="Pergunta *"><FInput value={newMarket.question} onChange={(e:any)=>setNewMarket({...newMarket,question:e.target.value})} placeholder="Ex: Bitcoin vai superar $100k?" required/></FField>
                  <FField label="Categoria"><FSelect value={newMarket.category} onChange={(e:any)=>setNewMarket({...newMarket,category:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</FSelect></FField>
                  <FField label="Tipo"><FSelect value={newMarket.type} onChange={(e:any)=>setNewMarket({...newMarket,type:e.target.value})}><option value="single">Simples (SIM/NAO)</option><option value="multiple">Multiplo (varias opcoes)</option></FSelect></FField>
                  {newMarket.type==='multiple'&&(
                    <FField label="Opcoes">
                      {newMarket.options.map((opt:any,i:number)=>(
                        <div key={i} style={{display:'flex',gap:'8px',marginBottom:'8px',alignItems:'center'}}>
                          <FInput placeholder={`Opcao ${i+1}`} value={opt.title} onChange={(e:any)=>setNewMarket({...newMarket,options:newMarket.options.map((o:any,j:number)=>j===i?{...o,title:e.target.value}:o)})} style={{flex:2}}/>
                          <FInput type="number" min="1" max="99" placeholder="%" value={opt.yes_odds} onChange={(e:any)=>setNewMarket({...newMarket,options:newMarket.options.map((o:any,j:number)=>j===i?{...o,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))}:o)})} style={{flex:1,color:'#00e676'}}/>
                          <button type="button" onClick={()=>setNewMarket({...newMarket,options:newMarket.options.filter((_:any,j:number)=>j!==i)})} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#ef5350',borderRadius:'6px',padding:'4px 8px',cursor:'pointer',fontSize:'12px'}}>X</button>
                        </div>
                      ))}
                      <button type="button" onClick={()=>setNewMarket({...newMarket,options:[...newMarket.options,{title:'',yes_odds:'50',no_odds:'50'}]})} style={{background:'rgba(0,230,118,0.08)',border:'1px solid rgba(0,230,118,0.2)',color:'#00e676',borderRadius:'6px',padding:'6px 12px',cursor:'pointer',fontSize:'12px',fontWeight:600}}>+ Adicionar opcao</button>
                    </FField>
                  )}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                    <FField label={<span style={{display:'flex',alignItems:'center',gap:'4px'}}>Chance SIM (%)<AdminTip text="Probabilidade de o evento ocorrer. Quanto menor a chance, maior o multiplicador e mais arriscada a aposta." pos="bottom"/></span>}><FInput type="number" min="1" max="99" value={newMarket.yes_odds} style={{color:V.green,fontWeight:600}} onChange={(e:any)=>setNewMarket({...newMarket,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))})}/></FField>
                    <FField label={<span style={{display:'flex',alignItems:'center',gap:'4px'}}>Chance NAO (%)<AdminTip text="Probabilidade de o evento NÃO ocorrer. Ajustado automaticamente ao alterar Chance SIM." pos="bottom"/></span>}><FInput type="number" min="1" max="99" value={newMarket.no_odds} style={{color:V.red,fontWeight:600}} onChange={(e:any)=>setNewMarket({...newMarket,no_odds:e.target.value,yes_odds:String(100-Number(e.target.value))})}/></FField>
                  </div>
                  <div style={{background:'#141414',borderRadius:'8px',padding:'14px',display:'flex',justifyContent:'space-around'}}>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'11px',color:V.muted,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em',display:'flex',alignItems:'center',justifyContent:'center',gap:'4px'}}>Mult. SIM<AdminTip text="Multiplicador de ganho para quem apostar SIM. Calculado como 100 ÷ Chance SIM." pos="bottom"/></p>
                      <p style={{fontSize:'24px',fontWeight:700,color:V.green,fontFamily:"'Manrope',sans-serif"}}>{(100/Number(newMarket.yes_odds||1)).toFixed(2)}x</p>
                    </div>
                    <div style={{width:'1px',background:V.border}}/>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'11px',color:V.muted,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Mult. NAO</p>
                      <p style={{fontSize:'24px',fontWeight:700,color:V.red,fontFamily:"'Manrope',sans-serif"}}>{(100/Number(newMarket.no_odds||1)).toFixed(2)}x</p>
                    </div>
                  </div>
                  <div style={{height:'4px',borderRadius:'2px',background:V.border,overflow:'hidden'}}>
                    <div style={{height:'100%',background:`linear-gradient(90deg,${V.green},${V.green}60)`,width:`${newMarket.yes_odds}%`,transition:'width 0.3s',borderRadius:'2px'}}/>
                  </div>
                  <FField label={<span style={{display:'flex',alignItems:'center',gap:'4px'}}>Data de encerramento<AdminTip text="Quando o mercado fecha para novas apostas. Após esta data, não é possível apostar — apenas resolver." pos="bottom"/></span>}><FInput type="datetime-local" value={newMarket.expires_at} onChange={(e:any)=>setNewMarket({...newMarket,expires_at:e.target.value})}/></FField>
                  <FField label="Imagem (URL)">
                    <FInput placeholder="https://... ou deixe vazio" value={newMarket.image_url} onChange={(e:any)=>setNewMarket({...newMarket,image_url:e.target.value})}/>
                    {newMarket.image_url && <img src={newMarket.image_url} alt="preview" style={{marginTop:'8px',width:'100%',height:'120px',objectFit:'cover',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)'}} onError={(e:any)=>e.target.style.display='none'}/>}
                  </FField>
                  <PrimaryBtn type="submit">CRIAR MERCADO</PrimaryBtn>
                </form>
              </div>
            </div>
          )}

          {/* ═══ USUARIOS ═══ */}
          {tab==='users' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Usuários</h1>
              <FilterRow search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOpts={['active','blocked','suspended']}/>
              <DataTbl loading={loading}
                cols={['Nome','E-mail','Status','Tipo','Saldo','Cadastro','Ações']}
                rows={filteredUsers.map((u:any)=>[
                  <span style={{fontWeight:500,color:'#ccc'}}>{u.name}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{u.email}</span>,
                  <SBadge status={u.status||'active'}/>,
                  <div style={{display:'flex',gap:'4px'}}><SBadge status={u.is_admin?'admin':'user'}/>{u.is_affiliate&&<SBadge status='affiliate'/>}</div>,
                  <span style={{color:V.green,fontWeight:600,fontSize:'13px'}}>R$ {Number(u.balance||0).toFixed(2)}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    <GhostBtn onClick={()=>setEditUser({...u})}>Editar</GhostBtn>
                    <GhostBtn color="green" onClick={()=>setBalanceModal({id:u.id,name:u.name,currentBalance:Number(u.balance||0),newBalance:''})}>Saldo</GhostBtn>
                  </div>
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ SAQUES ═══ */}
          {tab==='withdrawals' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Saques</h1>
              <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                <MCard title="Pendentes" value={withdrawals.filter((w:any)=>w.status==='pending').length.toString()} sub="Aguardando aprovação" icon={ArrowUpFromLine} color="yellow" tip="Saques solicitados pelos jogadores que ainda não foram aprovados ou pagos."/>
                <MCard title="Pagos" value={withdrawals.filter((w:any)=>w.status==='paid'||w.status==='completed').length.toString()} sub="Processados" icon={Check} color="green" tip="Total de saques que já foram aprovados e pagos com sucesso."/>
                <MCard title="Total Saques" value={fmt(totalWith)} sub="Volume total" icon={Wallet} color="red" tip="Soma em reais de todos os saques pagos e pendentes na plataforma."/>
              </div>
              <FilterRow search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOpts={['pending','approved','paid','rejected']}/>
              <DataTbl loading={loading}
                cols={['Usuário','Valor','Status','Data','Ações']}
                rows={filteredWithdrawals.map((w:any)=>[
                  <span style={{fontWeight:500,color:'#ccc'}}>{w.name||'—'}</span>,
                  <span style={{color:V.red,fontWeight:600}}>{fmt(Number(w.amount))}</span>,
                  <SBadge status={w.status}/>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(w.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    {w.status==='pending'&&<>
                      <GhostBtn color="green" onClick={()=>setConfirm({msg:'Aprovar este saque?',action:async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/approve`,'PUT',{});if(r.success){showToast('Aprovado!');load(token)}else showToast(r.error,'error')}})}>Aprovar</GhostBtn>
                      <GhostBtn color="red" onClick={()=>setConfirm({msg:'Recusar e devolver saldo?',action:async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/reject`,'PUT',{reason:'Recusado'});if(r.success){showToast('Recusado!');load(token)}else showToast(r.error,'error')}})}>Recusar</GhostBtn>
                    </>}
                    {w.status==='approved'&&<GhostBtn color="green" onClick={()=>setConfirm({msg:'Marcar como pago?',action:async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/paid`,'PUT',{});if(r.success){showToast('Pago!');load(token)}else showToast(r.error,'error')}})}>Pago</GhostBtn>}
                  </div>
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ DEPOSITOS ═══ */}
          {tab==='deposits' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Depósitos</h1>
              <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                <MCard title="Pendentes" value={deposits.filter((d:any)=>d.status==='pending').length.toString()} sub="Aguardando confirmação" icon={ArrowDownToLine} color="yellow" tip="Depósitos via Pix gerados mas ainda não confirmados pelo banco."/>
                <MCard title="Confirmados" value={deposits.filter((d:any)=>d.status==='completed').length.toString()} sub="Processados" icon={Check} color="green" tip="Depósitos com pagamento confirmado e saldo já creditado ao jogador."/>
                <MCard title="Total Depósitos" value={fmt(totalDep)} sub="Volume total" icon={DollarSign} color="green" tip="Soma em reais de todos os depósitos confirmados na plataforma."/>
              </div>
              <FilterRow search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOpts={['pending','completed','refunded']}/>
              <DataTbl loading={loading}
                cols={['Usuário','Valor','Status','Data','Ações']}
                rows={filteredDeposits.map((d:any)=>[
                  <span style={{fontWeight:500,color:'#ccc'}}>{d.name||'—'}</span>,
                  <span style={{color:V.green,fontWeight:600}}>{fmt(Number(d.amount))}</span>,
                  <SBadge status={d.status}/>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    {d.status==='pending'&&<GhostBtn color="green" onClick={()=>setConfirm({msg:'Aprovar este depósito?',action:async()=>{const r=await api(`/api/admin/deposits/${d.id}/approve`,'PUT',{});if(r.success){showToast('Aprovado!');load(token)}else showToast(r.error,'error')}})}>Aprovar</GhostBtn>}
                    {d.status==='completed'&&<GhostBtn color="red" onClick={()=>setConfirm({msg:'Estornar este depósito?',action:async()=>{const r=await api(`/api/admin/deposits/${d.id}/refund`,'PUT',{});if(r.success){showToast('Estornado!');load(token)}else showToast(r.error,'error')}})}>Estornar</GhostBtn>}
                  </div>
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ AUDITORIA ═══ */}
          {tab==='audit' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Auditoria</h1>
              <DataTbl loading={loading}
                cols={['Admin','Ação','IP','Data/Hora']}
                rows={audit.map((a:any)=>[
                  <span style={{fontWeight:500,color:'#ccc'}}>{a.name||'—'}</span>,
                  <span style={{background:'rgba(99,102,241,0.1)',color:'#818cf8',fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'4px'}}>{a.action}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{a.ip||'—'}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(a.created_at).toLocaleString('pt-BR')}</span>,
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ CONFIGURAÇÕES ═══ */}
          {tab==='configs' && <div className="fade-in"><ConfiguracoesFullPage settings={settings} setSettings={setSettings} api={api} showToast={showToast}/></div>}

          {tab==='metricas' && <div className="fade-in"><MetricasPage/></div>}
          {tab==='admins' && <div className="fade-in"><AdminsPage/></div>}
          {tab==='gerentes' && <div className="fade-in"><GerentesPage managers={managers} token={token} api={API} onRefresh={()=>load(token)}/></div>}
          {tab==='afiliados' && <div className="fade-in"><AfiliadosPage affiliates={affiliates} token={token} api={API} onEdit={openEditUser}/></div>}
          {tab==='saques-afiliados' && <div className="fade-in"><SaquesAfiliadosPage token={token} api={API}/></div>}
          {tab==='relatorio' && <div className="fade-in"><RelatorioPage/></div>}
          {tab==='apostas' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Apostas</h1>
              <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                <MCard title="Total de Apostas" value={bets.length.toString()} sub="Todas as apostas" icon={DollarSign} color="blue" tip="Número total de apostas feitas por todos os jogadores na plataforma."/>
                <MCard title="Apostas Ativas" value={bets.filter((b:any)=>b.status==='pending').length.toString()} sub="Aguardando resolução" icon={TrendingUp} color="yellow" tip="Apostas ainda abertas em mercados não resolvidos. O jogador aguarda o resultado."/>
                <MCard title="Apostas Resolvidas" value={bets.filter((b:any)=>b.status==='won'||b.status==='lost').length.toString()} sub="Finalizadas" icon={Check} color="green" tip="Apostas que já tiveram resultado definido (ganhou ou perdeu)."/>
              </div>
              <DataTbl loading={loading}
                cols={['Usuário','Mercado','Opção','Escolha','Valor',<span style={{display:'flex',alignItems:'center',gap:'4px'}}>Mult.<AdminTip text="Multiplicador aplicado à aposta. Ex: 2x = o jogador ganha o dobro do valor apostado se acertar."/></span>,'Status','Data']}
                rows={bets.map((b:any)=>[
                  <div><p style={{fontWeight:500,color:'#ccc',fontSize:'13px'}}>{b.user_name||'—'}</p><p style={{color:V.muted,fontSize:'11px'}}>{b.user_email}</p></div>,
                  <span style={{color:'#aaa',fontSize:'12px',maxWidth:'200px',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.market_question||'—'}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{b.option_title||'—'}</span>,
                  <SBadge status={b.choice}/>,
                  <span style={{color:V.green,fontWeight:600}}>R$ {Number(b.amount||0).toFixed(2)}</span>,
                  <span style={{color:'#aaa',fontSize:'12px'}}>{b.odds?Number(b.odds).toFixed(2)+'x':'—'}</span>,
                  <SBadge status={b.status}/>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(b.created_at).toLocaleDateString('pt-BR')}</span>,
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}
          {tab==='historico' && <div className="fade-in"><HistoricoPage/></div>}
          {tab==='eventos' && <div className="fade-in"><EventosPage/></div>}
          {tab==='configs' && tab==='configs' && false && null}
          {tab==='estilo' && <div className="fade-in"><EstiloPage token={token} api={API} onLogoChange={setSidebarLogo}/></div>}
          {tab==='banners' && <div className="fade-in"><BannersPage token={token} api={API}/></div>}
        </main>
      </div>

      {/* ══ MODAL EDITAR MERCADO ══ */}
      {editMarket && (
        <Overlay onClose={()=>setEditMarket(null)}>
          <Modal title="Editar Mercado" onClose={()=>setEditMarket(null)}>
            <FField label="Pergunta"><FInput value={editMarket.question} onChange={(e:any)=>setEditMarket({...editMarket,question:e.target.value})}/></FField>
            <FField label="Categoria"><FSelect value={editMarket.category||''} onChange={(e:any)=>setEditMarket({...editMarket,category:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</FSelect></FField>
            <FField label="Tipo"><FSelect value={editMarket.type||'single'} onChange={(e:any)=>setEditMarket({...editMarket,type:e.target.value,options:e.target.value==='multiple'?(editMarket.options?.length?editMarket.options:[{title:'',yes_odds:'50',no_odds:'50'}]):[]})}><option value="single">Simples (SIM/NAO)</option><option value="multiple">Múltiplo (várias opções)</option></FSelect></FField>
            {editMarket.type==='multiple'&&(
              <FField label="Opções">
                {(editMarket.options||[]).map((opt:any,i:number)=>(
                  <div key={i} style={{display:'flex',gap:'8px',marginBottom:'8px',alignItems:'center'}}>
                    <FInput placeholder={`Opção ${i+1}`} value={opt.title||''} onChange={(e:any)=>setEditMarket({...editMarket,options:(editMarket.options||[]).map((o:any,j:number)=>j===i?{...o,title:e.target.value}:o)})} style={{flex:2}}/>
                    <FInput type="number" min="1" max="99" placeholder="%" value={opt.yes_odds||'50'} onChange={(e:any)=>setEditMarket({...editMarket,options:(editMarket.options||[]).map((o:any,j:number)=>j===i?{...o,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))}:o)})} style={{flex:1,color:'#00e676'}}/>
                    <button type="button" onClick={()=>setEditMarket({...editMarket,options:(editMarket.options||[]).filter((_:any,j:number)=>j!==i)})} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#ef5350',borderRadius:'6px',padding:'4px 8px',cursor:'pointer',fontSize:'12px'}}>X</button>
                  </div>
                ))}
                <button type="button" onClick={()=>setEditMarket({...editMarket,options:[...(editMarket.options||[]),{title:'',yes_odds:'50',no_odds:'50'}]})} style={{background:'rgba(0,230,118,0.08)',border:'1px solid rgba(0,230,118,0.2)',color:'#00e676',borderRadius:'6px',padding:'6px 12px',cursor:'pointer',fontSize:'12px',fontWeight:600}}>+ Adicionar opção</button>
              </FField>
            )}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              <FField label="SIM (%)"><FInput type="number" min="1" max="99" style={{color:V.green}} value={editMarket.yes_odds} onChange={(e:any)=>setEditMarket({...editMarket,yes_odds:e.target.value,no_odds:100-Number(e.target.value)})}/></FField>
              <FField label="NAO (%)"><FInput type="number" min="1" max="99" style={{color:V.red}} value={editMarket.no_odds} onChange={(e:any)=>setEditMarket({...editMarket,no_odds:e.target.value,yes_odds:100-Number(e.target.value)})}/></FField>
            </div>
            <FField label="Data encerramento"><FInput type="datetime-local" value={editMarket.expires_at?String(editMarket.expires_at).slice(0,16):''} onChange={(e:any)=>setEditMarket({...editMarket,expires_at:e.target.value})}/></FField>
            <FField label="Status"><FSelect value={editMarket.status} onChange={(e:any)=>setEditMarket({...editMarket,status:e.target.value})}>{['open','suspended','resolved','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}</FSelect></FField>
            <FField label="Imagem (URL ou Upload)">
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <FInput placeholder="https://... ou deixe vazio" value={editMarket.image_url||''} onChange={(e:any)=>setEditMarket({...editMarket,image_url:e.target.value})} style={{flex:1}}/>
                <label style={{cursor:'pointer',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'8px 12px',fontSize:'12px',color:'#aaa',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:'6px'}}>
                  <Upload size={14}/>Enviar
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={async(e:any)=>{
                    const file=e.target.files?.[0];if(!file)return;
                    const fd=new FormData();fd.append('image',file);
                    const r=await fetch(API+`/api/admin/markets/${editMarket.id}/image`,{method:'POST',headers:{'Authorization':'Bearer '+token},body:fd});
                    const d=await r.json();
                    if(d.image_url){setEditMarket({...editMarket,image_url:API+d.image_url});showToast('Imagem enviada!')}
                    else showToast(d.error||'Erro ao enviar','error')
                  }}/>
                </label>
              </div>
              {editMarket.image_url && <img src={editMarket.image_url} alt="preview" style={{marginTop:'8px',width:'100%',height:'120px',objectFit:'cover',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)'}} onError={(e:any)=>e.target.style.display='none'}/>}
            </FField>
            <p style={{fontSize:'11px',color:'#333',marginTop:'4px'}}>Esta alteração será registrada no log de auditoria com seu IP.</p>
            <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
              <PrimaryBtn onClick={saveMarket}>SALVAR</PrimaryBtn>
              <GhostBtn onClick={()=>setEditMarket(null)}>Cancelar</GhostBtn>
            </div>
          </Modal>
        </Overlay>
      )}

      {/* ══ EDITAR USUÁRIO — Drawer Full Width Premium ══ */}
      {editUser && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(10px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={(e:any)=>{if(e.target===e.currentTarget)setEditUser(null)}}>
          <div style={{width:'min(1200px,90vw)',height:'min(820px,90vh)',background:'#141414',borderRadius:'16px',border:'1px solid #222',boxShadow:'0 32px 100px rgba(0,0,0,0.7)',display:'flex',flexDirection:'column',overflow:'hidden'}}>

            {/* ── HEADER STICKY ── */}
            <div style={{flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'24px 28px',borderBottom:'1px solid #222',background:'#161616'}}>
              <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'rgba(0,230,118,0.1)',border:'1px solid rgba(0,230,118,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Users size={16} color="#00e676"/>
                </div>
                <div>
                  <h2 style={{fontSize:'16px',fontWeight:700,color:'#fff',fontFamily:"'Manrope',sans-serif",margin:0,letterSpacing:'-0.01em'}}>Editar Usuário</h2>
                  <p style={{fontSize:'12px',color:'#555',margin:'2px 0 0'}}>{editUser.name} · {editUser.email}</p>
                </div>
              </div>
              <button onClick={()=>setEditUser(null)} style={{background:'transparent',border:'1px solid #2a2a2a',cursor:'pointer',color:'#555',width:'34px',height:'34px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',flexShrink:0}} onMouseEnter={(e:any)=>{e.currentTarget.style.background='#222';e.currentTarget.style.color='#ccc';e.currentTarget.style.borderColor='#333'}} onMouseLeave={(e:any)=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#555';e.currentTarget.style.borderColor='#2a2a2a'}}><X size={14}/></button>
            </div>

            {/* ── BODY SCROLLÁVEL — GRID 2 COLUNAS ── */}
            <div style={{flex:1,overflowY:'auto',padding:'24px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px',alignContent:'start'}}>

              {/* ══ CARD ESQUERDO — Informações Pessoais ══ */}
              <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'14px',padding:'24px',boxShadow:'0 4px 20px rgba(0,0,0,0.25)',display:'flex',flexDirection:'column',gap:'0'}}>
                <div style={{marginBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#fff',margin:'0 0 12px',fontFamily:"'Manrope',sans-serif",textTransform:'uppercase',letterSpacing:'0.06em'}}>Informações Pessoais</h3>
                  <div style={{height:'1px',background:'linear-gradient(90deg,#333,transparent)'}}/>
                </div>

                {/* Grid 2x3: Nome + Email, Telefone + Código, Status + Função */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px'}}>
                  <UField label="Nome">
                    <UInput value={editUser.name||''} onChange={(e:any)=>setEditUser({...editUser,name:e.target.value})} placeholder="Nome completo"/>
                  </UField>
                  <UField label="E-mail">
                    <UInput type="email" value={editUser.email||''} onChange={(e:any)=>setEditUser({...editUser,email:e.target.value})} placeholder="email@exemplo.com"/>
                  </UField>
                  <UField label="Telefone">
                    <UInput value={editUser.phone||''} onChange={(e:any)=>setEditUser({...editUser,phone:e.target.value})} placeholder="(11) 99999-9999"/>
                  </UField>
                  <UField label="Código de Afiliação">
                    <UInput value={editUser.referral_code||'—'} readOnly style={{opacity:0.4,cursor:'not-allowed'}}/>
                  </UField>
                  <UField label="Status">
                    <USelect value={editUser.status||'active'} onChange={(e:any)=>setEditUser({...editUser,status:e.target.value})}>
                      <option value="active">Ativo</option>
                      <option value="blocked">Bloqueado</option>
                      <option value="suspended">Suspenso</option>
                    </USelect>
                  </UField>
                  <UField label="Função">
                    <USelect value={editUser.role||'user'} onChange={(e:any)=>setEditUser({...editUser,role:e.target.value,is_affiliate:e.target.value==='affiliate'||e.target.value==='manager'})}>
                      <option value="user">Usuário</option>
                      <option value="admin">Administrador</option>
                      <option value="affiliate">Afiliado</option>
                      <option value="manager">Gerente</option>
                    </USelect>
                  </UField>
                </div>
              </div>

              {/* ══ CARD DIREITO — Segurança e Saldo ══ */}
              <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'14px',padding:'24px',boxShadow:'0 4px 20px rgba(0,0,0,0.25)',display:'flex',flexDirection:'column',gap:'0'}}>
                <div style={{marginBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#fff',margin:'0 0 12px',fontFamily:"'Manrope',sans-serif",textTransform:'uppercase',letterSpacing:'0.06em'}}>Segurança e Saldo</h3>
                  <div style={{height:'1px',background:'linear-gradient(90deg,#333,transparent)'}}/>
                </div>

                {/* Segurança — 2 colunas */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px',marginBottom:'24px'}}>
                  <UField label="Nova Senha">
                    <UInput type="password" value={editUser._password||''} placeholder="em branco = sem alteração" onChange={(e:any)=>setEditUser({...editUser,_password:e.target.value,password:e.target.value})}/>
                  </UField>
                  <UField label="Confirmar Senha">
                    <UInput type="password" value={editUser._password2||''} placeholder="em branco = sem alteração" onChange={(e:any)=>setEditUser({...editUser,_password2:e.target.value})}/>
                  </UField>
                </div>

                {/* Saldos */}
                <div style={{marginBottom:'24px'}}>
                  <p style={{fontSize:'11px',fontWeight:600,color:'#9a9a9a',textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 14px'}}>Saldos</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px'}}>
                    <UField label="Disponível (R$)">
                      <UInput type="number" step="0.01" min="0" value={editUser.balance||0} onChange={(e:any)=>setEditUser({...editUser,balance:e.target.value})}/>
                    </UField>
                    <UField label="Rollover (R$)">
                      <UInput type="number" step="0.01" min="0" value={editUser.balance_rollover||0} onChange={(e:any)=>setEditUser({...editUser,balance_rollover:e.target.value})}/>
                    </UField>
                    <UField label="Bônus (R$)">
                      <UInput type="number" step="0.01" min="0" value={editUser.balance_bonus||0} onChange={(e:any)=>setEditUser({...editUser,balance_bonus:e.target.value})}/>
                    </UField>
                    <UField label="Bloqueado (R$)">
                      <UInput type="number" step="0.01" min="0" value={editUser.balance_blocked||0} onChange={(e:any)=>setEditUser({...editUser,balance_blocked:e.target.value})}/>
                    </UField>
                    <UField label="Afiliado (R$)">
                      <UInput type="number" step="0.01" min="0" value={editUser.balance_affiliate||0} onChange={(e:any)=>setEditUser({...editUser,balance_affiliate:e.target.value})}/>
                    </UField>
                    <UField label="Demo (R$)">
                      <UInput type="number" step="0.01" min="0" value={editUser.balance_demo||0} onChange={(e:any)=>setEditUser({...editUser,balance_demo:e.target.value})}/>
                    </UField>
                  </div>
                </div>

                {/* Afiliação — condicional */}
                {(editUser.role==='affiliate'||editUser.role==='manager') && (
                  <div>
                    <p style={{fontSize:'11px',fontWeight:600,color:'#9a9a9a',textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 14px'}}>Configurações de Afiliação</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px',marginBottom:'18px'}}>
                      <UField label="CPA (R$)">
                        <UInput type="number" step="0.01" min="0" placeholder="0.00" value={editUser.cpa||0} onChange={(e:any)=>setEditUser({...editUser,cpa:e.target.value})}/>
                      </UField>
                      <UField label="RevShare (%)">
                        <UInput type="number" step="0.01" min="0" max="100" placeholder="0" value={editUser.rev_share||0} onChange={(e:any)=>setEditUser({...editUser,rev_share:e.target.value})}/>
                      </UField>
                    </div>
                    <UField label="Baseline (R$)">
                      <UInput type="number" step="0.01" min="0" placeholder="0.00" value={editUser.baseline||0} onChange={(e:any)=>setEditUser({...editUser,baseline:e.target.value})}/>
                    </UField>
                  </div>
                )}
              </div>
            </div>

            {/* ── FOOTER STICKY ── */}
            <div style={{flexShrink:0,display:'flex',gap:'12px',alignItems:'center',padding:'20px 28px',borderTop:'1px solid #222',background:'#161616'}}>
              <button
                onClick={()=>{if(editUser._password&&editUser._password!==editUser._password2){showToast('Senhas não conferem','error');return;}saveUser()}}
                style={{flex:1,height:'48px',background:'#00e676',color:'#000',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'14px',cursor:'pointer',letterSpacing:'0.05em',transition:'opacity 0.15s',fontFamily:"'Manrope',sans-serif"}}
                onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.85'}
                onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}
              >SALVAR ALTERAÇÕES</button>
              <button
                onClick={()=>setEditUser(null)}
                style={{height:'48px',padding:'0 28px',background:'#1e1e1e',color:'#888',border:'1px solid #2a2a2a',borderRadius:'10px',fontWeight:500,fontSize:'14px',cursor:'pointer',transition:'all 0.15s',fontFamily:"'Manrope',sans-serif",whiteSpace:'nowrap'}}
                onMouseEnter={(e:any)=>{e.currentTarget.style.background='#252525';e.currentTarget.style.color='#bbb'}}
                onMouseLeave={(e:any)=>{e.currentTarget.style.background='#1e1e1e';e.currentTarget.style.color='#888'}}
              >Cancelar</button>
            </div>

          </div>
        </div>
      )}

      {/* ══ MODAL SALDO ══ */}
      {balanceModal && (
        <Overlay onClose={()=>setBalanceModal(null)}>
          <Modal title={`Ajustar Saldo — ${balanceModal.name}`} onClose={()=>setBalanceModal(null)}>
            <div style={{background:'rgba(0,230,118,0.06)',border:'1px solid rgba(0,230,118,0.15)',borderRadius:'10px',padding:'14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:'12px',color:'#555',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:600}}>Saldo atual</span>
              <span style={{fontSize:'22px',fontWeight:700,color:'#00e676',fontFamily:"'Manrope',sans-serif"}}>R$ {Number(balanceModal.currentBalance||0).toLocaleString('pt-BR',{minimumFractionDigits:2})}</span>
            </div>
            <FField label="Novo saldo (R$)">
              <FInput type="number" step="0.01" min="0" placeholder="Ex: 150.00" value={balanceModal.newBalance} onChange={(e:any)=>setBalanceModal({...balanceModal,newBalance:e.target.value})}/>
              <p style={{fontSize:'11px',color:'#555',marginTop:'4px'}}>Digite o valor final que o usuário deve ter.</p>
            </FField>
            <p style={{fontSize:'11px',color:'#333',marginTop:'4px'}}>Esta ação será registrada no log de auditoria com seu IP.</p>
            <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
              <PrimaryBtn onClick={()=>setConfirm({msg:`Definir saldo de ${balanceModal.name} para R$ ${Number(balanceModal.newBalance||0).toFixed(2)}?`,action:adjBalance})}>AJUSTAR</PrimaryBtn>
              <GhostBtn onClick={()=>setBalanceModal(null)}>Cancelar</GhostBtn>
            </div>
          </Modal>
        </Overlay>
      )}

      {/* ══ MODAL CONFIRM ══ */}
      {confirm && (
        <Overlay onClose={()=>setConfirm(null)}>
          <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'28px 24px',maxWidth:'400px',width:'100%',textAlign:'center'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(255,179,0,0.1)',border:'1px solid rgba(255,179,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
              <AlertTriangle size={20} color="#ffb300"/>
            </div>
            <p style={{fontSize:'14px',color:'#ccc',lineHeight:1.6,marginBottom:'6px'}}>{confirm.msg}</p>
            <p style={{fontSize:'11px',color:V.muted,marginBottom:'20px'}}>Esta ação será registrada na auditoria.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <PrimaryBtn onClick={async()=>{await confirm.action();setConfirm(null)}}>Confirmar</PrimaryBtn>
              <GhostBtn onClick={()=>setConfirm(null)}>Cancelar</GhostBtn>
            </div>
          </div>
        </Overlay>
      )}

      {/* ══ SEARCH ══ */}
      {searchOpen && (
        <Overlay onClose={()=>setSearchOpen(false)}>
          <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,width:'100%',maxWidth:'480px',overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'14px 16px',borderBottom:`1px solid ${V.border}`}}>
              <Search size={15} color={V.muted}/>
              <input autoFocus placeholder="Buscar página..." style={{flex:1,background:'transparent',border:'none',outline:'none',color:V.text,fontSize:'14px'}} onKeyDown={(e:any)=>{if(e.key==='Escape')setSearchOpen(false)}}/>
            </div>
            <div style={{padding:'6px'}}>
              {NAV_SECTIONS.flatMap(s=>s.items).map(item=>(
                <button key={item.id} onClick={()=>{setTab(item.id);setSearchOpen(false)}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',border:'none',background:'transparent',cursor:'pointer',borderRadius:'7px',color:V.muted,fontSize:'13px',textAlign:'left',transition:'all 0.08s'}}
                  onMouseEnter={(e:any)=>{e.currentTarget.style.background=V.hover;e.currentTarget.style.color=V.text}} onMouseLeave={(e:any)=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=V.muted}}>
                  <item.icon size={15} strokeWidth={1.75}/>{item.label}
                </button>
              ))}
            </div>
          </div>
        </Overlay>
      )}

      {/* ══ TOAST ══ */}
      {toast && (
        <div style={{position:'fixed',bottom:'20px',right:'20px',zIndex:999,display:'flex',alignItems:'center',gap:'10px',background:V.card,border:`1px solid ${toast.type==='error'?'rgba(244,67,54,0.3)':'rgba(0,230,118,0.3)'}`,borderRadius:'10px',padding:'12px 16px',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',animation:'fadeIn 0.2s ease'}}>
          {toast.type==='error'?<X size={14} color={V.red}/>:<Check size={14} color={V.green}/>}
          <span style={{fontSize:'13px',color:toast.type==='error'?V.red:V.green,fontWeight:500}}>{toast.text}</span>
        </div>
      )}
    </div>
  )
}

// ── COMPONENTS ──

function MCard({title,value,sub,icon:Icon,color='green',tip}:{title:string,value:string,sub:string,icon:any,color?:string,tip?:string}) {
  const colors:any = {green:'#00e676',red:'#f44336',blue:'#3b82f6',yellow:'#ffb300'}
  const bgs:any = {green:'rgba(0,230,118,0.08)',red:'rgba(244,67,54,0.08)',blue:'rgba(59,130,246,0.08)',yellow:'rgba(255,179,0,0.08)'}
  const c = colors[color]||'#00e676', bg = bgs[color]||bgs.green
  const [show,setShow] = useState(false)
  return (
    <div className="metric-card" style={{background:'#1a1a1a',borderRadius:'10px',border:'1px solid #222',padding:'16px',transition:'all 0.2s',cursor:'default',position:'relative'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'10px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'5px',flex:1,minWidth:0}}>
          <p style={{fontSize:'11px',color:'#555',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',lineHeight:1.3}}>{title}</p>
          {tip&&(
            <div style={{position:'relative',flexShrink:0}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
              <div style={{width:'14px',height:'14px',borderRadius:'50%',border:'1px solid #444',display:'flex',alignItems:'center',justifyContent:'center',cursor:'help'}}>
                <span style={{fontSize:'9px',color:'#666',fontWeight:700,lineHeight:1}}>?</span>
              </div>
              {show&&(
                <div style={{position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',background:'#2a2a2a',border:'1px solid #333',borderRadius:'8px',padding:'8px 10px',width:'200px',zIndex:100,boxShadow:'0 4px 16px rgba(0,0,0,0.5)'}}>
                  <p style={{fontSize:'11px',color:'#ccc',lineHeight:1.5,margin:0}}>{tip}</p>
                  <div style={{position:'absolute',bottom:'-5px',left:'50%',transform:'translateX(-50%)',width:'8px',height:'8px',background:'#2a2a2a',border:'1px solid #333',borderTop:'none',borderLeft:'none',rotate:'45deg'}}/>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{width:'28px',height:'28px',borderRadius:'7px',background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <Icon size={14} color={c} strokeWidth={1.75}/>
        </div>
      </div>
      <p style={{fontSize:'22px',fontWeight:700,color:color==='red'?'#f44336':color==='blue'?'#3b82f6':color==='yellow'?'#ffb300':'#00e676',fontFamily:"'Manrope',sans-serif",letterSpacing:'-0.5px',marginBottom:'4px'}}>{value}</p>
      <p style={{fontSize:'11px',color:'#555'}}>{sub}</p>
    </div>
  )
}

function AdminTip({text,pos='top'}:{text:string,pos?:'top'|'bottom'}) {
  const [rect,setRect]=useState<DOMRect|null>(null)
  const ref=useRef<HTMLDivElement>(null)
  const show=rect!==null
  const enter=()=>{if(ref.current)setRect(ref.current.getBoundingClientRect())}
  const leave=()=>setRect(null)
  const tipStyle:any = rect ? {
    position:'fixed',
    left: rect.left + rect.width/2,
    ...(pos==='top' ? {top: rect.top - 8, transform:'translateX(-50%) translateY(-100%)'} : {top: rect.bottom + 8, transform:'translateX(-50%)'}),
    background:'#2a2a2a',border:'1px solid #333',borderRadius:'8px',padding:'8px 10px',
    width:'210px',zIndex:99999,boxShadow:'0 4px 20px rgba(0,0,0,0.7)',pointerEvents:'none',
  } : {}
  return (
    <div ref={ref} style={{display:'inline-flex',alignItems:'center',flexShrink:0}} onMouseEnter={enter} onMouseLeave={leave}>
      <div style={{width:'14px',height:'14px',borderRadius:'50%',border:`1px solid ${show?'#00e676':'#444'}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'help',transition:'border-color 0.15s'}}>
        <span style={{fontSize:'9px',color:show?'#00e676':'#666',fontWeight:700,lineHeight:1}}>?</span>
      </div>
      {show&&(
        <div style={tipStyle}>
          <p style={{fontSize:'11px',color:'#ccc',lineHeight:1.5,margin:0,whiteSpace:'normal'}}>{text}</p>
          <div style={{position:'absolute',...(pos==='top'?{bottom:'-5px',borderTop:'none',borderLeft:'none'}:{top:'-5px',borderBottom:'none',borderRight:'none'}),left:'50%',transform:'translateX(-50%)',width:'8px',height:'8px',background:'#2a2a2a',border:'1px solid #333',rotate:'45deg'}}/>
        </div>
      )}
    </div>
  )
}

function SBadge({status}:{status:string}) {
  const m:any = {
    open:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    active:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    completed:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    paid:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    resolved:{bg:'rgba(99,102,241,0.1)',c:'#818cf8',b:'rgba(99,102,241,0.2)'},
    admin:{bg:'rgba(59,130,246,0.1)',c:'#3b82f6',b:'rgba(59,130,246,0.2)'},
    pending:{bg:'rgba(255,179,0,0.1)',c:'#ffb300',b:'rgba(255,179,0,0.2)'},
    suspended:{bg:'rgba(255,179,0,0.1)',c:'#ffb300',b:'rgba(255,179,0,0.2)'},
    processing:{bg:'rgba(255,179,0,0.1)',c:'#ffb300',b:'rgba(255,179,0,0.2)'},
    cancelled:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    blocked:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    rejected:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    refunded:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    won:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    lost:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    affiliate:{bg:'rgba(139,92,246,0.1)',c:'#a78bfa',b:'rgba(139,92,246,0.2)'},
    user:{bg:'rgba(255,255,255,0.05)',c:'#666',b:'rgba(255,255,255,0.1)'},
  }
  const s = m[status]||{bg:'rgba(255,255,255,0.05)',c:'#666',b:'rgba(255,255,255,0.1)'}
  const labels:any = {open:'Aberto',active:'Ativo',inactive:'Inativo',completed:'Confirmado',paid:'Pago',resolved:'Resolvido',pending:'Pendente',suspended:'Suspenso',processing:'Processando',cancelled:'Cancelado',blocked:'Bloqueado',rejected:'Recusado',refunded:'Estornado',admin:'Admin',user:'Usuário',won:'Ganhou',lost:'Perdeu',yes:'SIM',no:'NÃO',affiliate:'Afiliado'}
  return <span style={{display:'inline-flex',alignItems:'center',padding:'2px 8px',borderRadius:'99px',fontSize:'11px',fontWeight:600,background:s.bg,color:s.c,border:`1px solid ${s.b}`}}>{labels[status]||status}</span>
}

function DataTbl({cols,rows,loading,page,perPage,onPage,onPerPage}:{cols:any[],rows:any[][],loading:boolean,page:number,perPage:number,onPage:(p:number)=>void,onPerPage:(p:number)=>void}) {
  if (loading) return <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'44px'}}/>)}</div>
  const totalPages = Math.ceil(rows.length/perPage)
  const paged = rows.slice((page-1)*perPage, page*perPage)
  if (!paged.length) return <div style={{background:'#1a1a1a',borderRadius:'10px',border:'1px solid #222',padding:'48px',textAlign:'center'}}><p style={{color:'#555',fontSize:'13px'}}>Nenhum registro encontrado</p></div>
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      <div className="table-wrap" style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead>
            <tr style={{background:'#141414'}}>
              {cols.map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222',whiteSpace:'nowrap'}}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {paged.map((row,i)=>(
              <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e',transition:'background 0.1s'}}>
                {row.map((cell,j)=><td key={j} style={{padding:'11px 14px',verticalAlign:'middle'}}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'12px',color:'#555'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span>Itens por página:</span>
          <select value={perPage} onChange={(e:any)=>{onPerPage(Number(e.target.value));onPage(1)}} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'6px',padding:'3px 6px',color:'#888',fontSize:'12px',outline:'none',cursor:'pointer'}}>
            <option value="10">10</option><option value="25">25</option><option value="50">50</option>
          </select>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
          <span>{(page-1)*perPage+1}–{Math.min(page*perPage,rows.length)} de {rows.length}</span>
          <button onClick={()=>onPage(page-1)} disabled={page<=1} style={{width:'26px',height:'26px',borderRadius:'6px',border:'1px solid #222',background:'transparent',cursor:page<=1?'not-allowed':'pointer',color:page<=1?'#333':'#888',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <ChevronLeft size={13}/>
          </button>
          <button onClick={()=>onPage(page+1)} disabled={page>=totalPages} style={{width:'26px',height:'26px',borderRadius:'6px',border:'1px solid #222',background:'transparent',cursor:page>=totalPages?'not-allowed':'pointer',color:page>=totalPages?'#333':'#888',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <ChevronRight size={13}/>
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterRow({search,onSearch,status,onStatus,statusOpts}:any) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
      <div style={{position:'relative',flex:1,minWidth:'180px',maxWidth:'300px'}}>
        <Search size={13} color="#555" style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
        <input value={search} onChange={(e:any)=>onSearch(e.target.value)} placeholder="Filtrar..." style={{width:'100%',background:'#1a1a1a',border:'1px solid #222',borderRadius:'8px',padding:'7px 10px 7px 30px',color:'#888',fontSize:'12px',outline:'none',transition:'border-color 0.15s'}} onFocus={(e:any)=>e.target.style.borderColor='rgba(0,230,118,0.4)'} onBlur={(e:any)=>e.target.style.borderColor='#222'}/>
      </div>
      <select value={status} onChange={(e:any)=>onStatus(e.target.value)} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'8px',padding:'7px 10px',color:status?'#ccc':'#555',fontSize:'12px',outline:'none',cursor:'pointer'}}>
        <option value="">Todos os status</option>
        {statusOpts.map((s:string)=>{const lbl:any={active:'Ativo',blocked:'Bloqueado',suspended:'Suspenso',open:'Aberto',pending:'Pendente',completed:'Confirmado',paid:'Pago',resolved:'Resolvido',cancelled:'Cancelado',rejected:'Recusado',won:'Ganhou',lost:'Perdeu'};return<option key={s} value={s}>{lbl[s]||s}</option>})}
      </select>
      {(search||status)&&<button onClick={()=>{onSearch('');onStatus('')}} style={{background:'transparent',border:'1px solid #222',borderRadius:'8px',padding:'7px 12px',color:'#555',fontSize:'12px',cursor:'pointer'}}>Limpar</button>}
    </div>
  )
}

function Overlay({children,onClose}:{children:any,onClose:()=>void}) {
  return <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(6px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>{children}</div>
}

function Modal({title,onClose,children}:{title:string,onClose:()=>void,children:any}) {
  return (
    <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'24px',width:'100%',maxWidth:'480px',maxHeight:'90vh',overflowY:'auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <h3 style={{fontSize:'15px',fontWeight:600,color:'#fff',fontFamily:"'Manrope',sans-serif"}}>{title}</h3>
        <button onClick={onClose} style={{background:'#222',border:'none',cursor:'pointer',color:'#666',width:'28px',height:'28px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.color='#ccc'} onMouseLeave={(e:any)=>e.currentTarget.style.color='#666'}><X size={14}/></button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{children}</div>
    </div>
  )
}

function FField({label,children}:{label:any,children:any}) {
  return <div><label style={{fontSize:'11px',color:'#555',display:'flex',alignItems:'center',gap:'4px',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:600}}>{label}</label>{children}</div>
}

function FInput({style,...p}:any) {
  return <input {...p} style={{width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',transition:'border-color 0.15s',...style}} onFocus={(e:any)=>e.target.style.borderColor='rgba(0,230,118,0.4)'} onBlur={(e:any)=>e.target.style.borderColor='#222'}/>
}

/* ── Componentes premium para o modal de edição de usuário ── */
function UField({label,children}:{label:string,children:any}) {
  return (
    <div>
      <label style={{fontSize:'11px',color:'#9a9a9a',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:600}}>{label}</label>
      {children}
    </div>
  )
}
function UInput({style,...p}:any) {
  return (
    <input {...p}
      style={{width:'100%',background:'#111',border:'1px solid #333',borderRadius:'8px',padding:'0 14px',color:'#fff',fontSize:'14px',outline:'none',height:'46px',transition:'border-color 0.15s, box-shadow 0.15s',boxSizing:'border-box',...style}}
      onFocus={(e:any)=>{e.target.style.borderColor='#00e676';e.target.style.boxShadow='0 0 0 3px rgba(0,230,118,0.15)'}}
      onBlur={(e:any)=>{e.target.style.borderColor='#333';e.target.style.boxShadow='none'}}
    />
  )
}
function USelect({style,children,...p}:any) {
  return (
    <select {...p}
      style={{width:'100%',background:'#111',border:'1px solid #333',borderRadius:'8px',padding:'0 14px',color:'#fff',fontSize:'14px',outline:'none',height:'46px',cursor:'pointer',transition:'border-color 0.15s, box-shadow 0.15s',boxSizing:'border-box',...style}}
      onFocus={(e:any)=>{e.target.style.borderColor='#00e676';e.target.style.boxShadow='0 0 0 3px rgba(0,230,118,0.15)'}}
      onBlur={(e:any)=>{e.target.style.borderColor='#333';e.target.style.boxShadow='none'}}
    >{children}</select>
  )
}

function FSelect({style,...p}:any) {
  return <select {...p} style={{width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',cursor:'pointer',...style}}/>
}

function PrimaryBtn({children,onClick,type,style,disabled}:{children:any,onClick?:()=>void,type?:any,style?:any,disabled?:boolean}) {
  return <button type={type||'button'} onClick={onClick} disabled={disabled} style={{background:'linear-gradient(135deg,#00e676,#00c853)',color:'#000',border:'none',borderRadius:'8px',padding:'10px 18px',fontWeight:700,fontSize:'13px',cursor:disabled?'not-allowed':'pointer',transition:'opacity 0.15s',letterSpacing:'0.02em',display:'flex',alignItems:'center',gap:'6px',whiteSpace:'nowrap',opacity:disabled?0.6:1,...style}} onMouseEnter={(e:any)=>{if(!disabled)e.currentTarget.style.opacity='0.85'}} onMouseLeave={(e:any)=>{if(!disabled)e.currentTarget.style.opacity=disabled?'0.6':'1'}}>{children}</button>
}

function GhostBtn({children,onClick,color='gray'}:{children:any,onClick:()=>void,color?:string}) {
  const m:any={green:{bg:'rgba(0,230,118,0.08)',c:'#00e676',b:'rgba(0,230,118,0.2)'},red:{bg:'rgba(244,67,54,0.08)',c:'#f44336',b:'rgba(244,67,54,0.2)'},gray:{bg:'rgba(255,255,255,0.04)',c:'#888',b:'#222'}}
  const s=m[color]||m.gray
  return <button onClick={onClick} style={{padding:'5px 12px',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:500,background:s.bg,color:s.c,border:`1px solid ${s.b}`,transition:'opacity 0.12s',whiteSpace:'nowrap'}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.75'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>{children}</button>
}

// ══════════════════════════════════════════════════════════
// PÁGINAS COMPLETAS
// ══════════════════════════════════════════════════════════

function MetricasPage() {
  const [activeTab, setActiveTab] = useState('Comissões')
  const tabs = ['Comissões', 'Depósitos', 'Convites']
  const mockData:any = {
    'Comissões': [
      { pos: 1, nome: 'Carlos Silva', valor: 'R$ 12.480' },
      { pos: 2, nome: 'Ana Martins', valor: 'R$ 9.320' },
      { pos: 3, nome: 'João Oliveira', valor: 'R$ 7.150' },
      { pos: 4, nome: 'Maria Santos', valor: 'R$ 5.890' },
      { pos: 5, nome: 'Pedro Costa', valor: 'R$ 4.200' },
    ],
    'Depósitos': [
      { pos: 1, nome: 'Carlos Silva', valor: 'R$ 45.200' },
      { pos: 2, nome: 'Ana Martins', valor: 'R$ 38.100' },
      { pos: 3, nome: 'João Oliveira', valor: 'R$ 29.500' },
      { pos: 4, nome: 'Maria Santos', valor: 'R$ 21.300' },
      { pos: 5, nome: 'Pedro Costa', valor: 'R$ 14.800' },
    ],
    'Convites': [
      { pos: 1, nome: 'Carlos Silva', valor: '42' },
      { pos: 2, nome: 'Ana Martins', valor: '30' },
      { pos: 3, nome: 'João Oliveira', valor: '25' },
      { pos: 4, nome: 'Maria Santos', valor: '18' },
      { pos: 5, nome: 'Pedro Costa', valor: '11' },
    ],
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Métricas - Top Afiliados</h1>
        <GhostBtn onClick={()=>{}}><RefreshCw size={13}/> Atualizar Ranking</GhostBtn>
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{padding:'6px 14px',borderRadius:'6px',border:`1px solid ${t===activeTab?'#00e676':'#222'}`,background:t===activeTab?'rgba(0,230,118,0.1)':'transparent',color:t===activeTab?'#00e676':'#888',fontSize:'12px',cursor:'pointer',fontWeight:t===activeTab?600:400,transition:'all 0.15s'}}>{t}</button>
        ))}
      </div>
      <div className="table-wrap" style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead>
            <tr style={{background:'#141414'}}>
              {['#','Nome',activeTab==='Convites'?'Convites':'Valor'].map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {(mockData[activeTab]||[]).map((item:any,i:number)=>(
              <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                <td style={{padding:'11px 14px'}}><span style={{fontWeight:700,color:'#00e676'}}>{item.pos}</span></td>
                <td style={{padding:'11px 14px',color:'#ccc'}}>{item.nome}</td>
                <td style={{padding:'11px 14px',color:'#888'}}>{item.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminsPage() {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [form, setForm] = useState({nome:'',email:'',senha:'',cargo:'suporte',ativo:true})
  const [admins, setAdmins] = useState([
    { id:1, nome:'Master Admin', email:'master@admin.com', cargo:'super_admin', ativo:true },
    { id:2, nome:'João Admin', email:'joao@admin.com', cargo:'admin', ativo:true },
    { id:3, nome:'Carlos Mod', email:'carlos@admin.com', cargo:'moderador', ativo:true },
    { id:4, nome:'Ana Suporte', email:'ana@admin.com', cargo:'suporte', ativo:false },
  ])
  const cargoColors:any = {super_admin:{bg:'rgba(139,92,246,0.1)',c:'#a78bfa',b:'rgba(139,92,246,0.2)'},admin:{bg:'rgba(59,130,246,0.1)',c:'#3b82f6',b:'rgba(59,130,246,0.2)'},moderador:{bg:'rgba(255,179,0,0.1)',c:'#ffb300',b:'rgba(255,179,0,0.2)'},suporte:{bg:'rgba(255,255,255,0.05)',c:'#666',b:'rgba(255,255,255,0.1)'}}
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Admins</h1>
        <PrimaryBtn onClick={()=>{setSelected(null);setForm({nome:'',email:'',senha:'',cargo:'suporte',ativo:true});setEditOpen(true)}}><Plus size={14}/> Criar Admin</PrimaryBtn>
      </div>
      <div className="table-wrap" style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead><tr style={{background:'#141414'}}>
            {['Nome','E-mail','Cargo','Status','Ações'].map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {admins.map((a,i)=>(
              <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                <td style={{padding:'11px 14px',color:'#ccc',fontWeight:500}}>{a.nome}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{a.email}</td>
                <td style={{padding:'11px 14px'}}><span style={{padding:'2px 8px',borderRadius:'99px',fontSize:'11px',fontWeight:600,...cargoColors[a.cargo]}}>{a.cargo.replace('_',' ')}</span></td>
                <td style={{padding:'11px 14px'}}><SBadge status={a.ativo?'active':'inactive'}/></td>
                <td style={{padding:'11px 14px'}}>
                  <div style={{display:'flex',gap:'5px'}}>
                    <GhostBtn onClick={()=>{setSelected(a);setForm({nome:a.nome,email:a.email,senha:'',cargo:a.cargo,ativo:a.ativo});setEditOpen(true)}}><Pencil size={12}/></GhostBtn>
                    <GhostBtn color="red" onClick={()=>{setSelected(a);setDeleteOpen(true)}}><Trash2 size={12}/></GhostBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editOpen&&(
        <Overlay onClose={()=>setEditOpen(false)}>
          <Modal title={selected?'Editar Admin':'Criar Admin'} onClose={()=>setEditOpen(false)}>
            <FField label="Nome *"><FInput value={form.nome} onChange={(e:any)=>setForm({...form,nome:e.target.value})}/></FField>
            <FField label="E-mail *"><FInput value={form.email} onChange={(e:any)=>setForm({...form,email:e.target.value})}/></FField>
            <FField label="Senha *"><FInput type="password" value={form.senha} onChange={(e:any)=>setForm({...form,senha:e.target.value})}/></FField>
            <FField label="Cargo *">
              <FSelect value={form.cargo} onChange={(e:any)=>setForm({...form,cargo:e.target.value})}>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderador">Moderador</option>
                <option value="suporte">Suporte</option>
              </FSelect>
            </FField>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div onClick={()=>setForm({...form,ativo:!form.ativo})} style={{width:'36px',height:'20px',borderRadius:'10px',background:form.ativo?'#00e676':'#333',cursor:'pointer',position:'relative',transition:'background 0.2s'}}>
                <div style={{position:'absolute',top:'2px',left:form.ativo?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
              </div>
              <span style={{fontSize:'13px',color:'#888'}}>Ativo</span>
            </div>
            <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
              <PrimaryBtn onClick={()=>setEditOpen(false)}>SALVAR</PrimaryBtn>
              <GhostBtn onClick={()=>setEditOpen(false)}>Cancelar</GhostBtn>
            </div>
          </Modal>
        </Overlay>
      )}
      {deleteOpen&&(
        <Overlay onClose={()=>setDeleteOpen(false)}>
          <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'28px',maxWidth:'380px',width:'100%',textAlign:'center'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(244,67,54,0.1)',border:'1px solid rgba(244,67,54,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><AlertTriangle size={20} color="#f44336"/></div>
            <p style={{fontSize:'14px',color:'#ccc',marginBottom:'6px'}}>Excluir admin <strong>{selected?.nome}</strong>?</p>
            <p style={{fontSize:'11px',color:'#888',marginBottom:'20px'}}>Esta ação será registrada na auditoria.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={()=>setDeleteOpen(false)} style={{flex:1,background:'rgba(244,67,54,0.08)',color:'#f44336',border:'1px solid rgba(244,67,54,0.2)',borderRadius:'8px',padding:'10px',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>Excluir</button>
              <GhostBtn onClick={()=>setDeleteOpen(false)}>Cancelar</GhostBtn>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}

function GerentesPage({managers,token,api,onRefresh}:{managers:any[],token:string,api:string,onRefresh:()=>void}) {
  const [selected, setSelected] = useState<any>(null)
  const [editAff, setEditAff] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const V2 = {green:'#00e676',border:'#222',card:'#1a1a1a',muted:'#888',label:'#555',text:'#ccc'}
  const LabelStyle = {fontSize:'11px',color:V2.label,display:'block' as any,marginBottom:'5px',textTransform:'uppercase' as any,letterSpacing:'0.1em',fontWeight:600}
  const InputStyle = {width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'8px',padding:'9px 12px',color:V2.text,fontSize:'13px',outline:'none'}

  async function saveCommission() {
    if(!editAff||!selected) return
    setSaving(true)
    try {
      const r = await fetch(api+`/api/admin/managers/${selected.id}/affiliates/${editAff.id}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({cpa:Number(editAff.cpa||0),rev_share:Number(editAff.rev_share||0),baseline:Number(editAff.baseline||0)})
      })
      const d = await r.json()
      if(d.success){setToast('Comissão salva!');setEditAff(null);onRefresh()}else setToast(d.error||'Erro')
    } catch{setToast('Erro de conexão')}
    setSaving(false)
    setTimeout(()=>setToast(''),3000)
  }

  const totalManagers = managers.length
  const totalAfiliados = managers.reduce((s,m)=>s+Number(m.total_affiliates||0),0)
  const totalComissoes = managers.reduce((s,m)=>s+Number(m.total_commissions||0),0)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Gerentes</h1>
      {toast&&<div style={{padding:'10px 14px',borderRadius:'8px',background:'rgba(0,230,118,0.08)',border:'1px solid rgba(0,230,118,0.2)',color:V2.green,fontSize:'13px'}}>{toast}</div>}

      {/* Cards resumo */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}} className="grid-3">
        <MCard title="Total Gerentes" value={String(totalManagers)} sub="Usuários com função gerente" icon={Briefcase} color="blue" tip="Total de usuários com role=manager na plataforma."/>
        <MCard title="Afiliados Gerenciados" value={String(totalAfiliados)} sub="Afiliados com gerente" icon={UserCheck} color="green" tip="Total de afiliados que se cadastraram pelo link de um gerente."/>
        <MCard title="Comissões Distribuídas" value={'R$ '+totalComissoes.toFixed(2)} sub="Por afiliados gerenciados" icon={Wallet} color="green" tip="Total de comissões geradas pelos afiliados dos gerentes."/>
      </div>

      {/* Lista de gerentes */}
      {!selected ? (
        <div style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
            <thead><tr style={{background:'#141414'}}>
              {['Nome','Email','Código','Afiliados','Comissões','Status','Ações'].map(c=>(
                <th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>
              ))}
            </tr></thead>
            <tbody>
              {managers.length===0?(
                <tr><td colSpan={7} style={{padding:'24px',textAlign:'center',color:'#555',fontSize:'13px'}}>Nenhum gerente cadastrado ainda</td></tr>
              ):managers.map((m:any,i:number)=>(
                <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                  <td style={{padding:'11px 14px',color:'#ccc',fontWeight:500}}>{m.name}</td>
                  <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{m.email}</td>
                  <td style={{padding:'11px 14px'}}><code style={{background:'#111',padding:'2px 7px',borderRadius:'4px',fontSize:'11px',color:V2.green}}>{m.referral_code||'—'}</code></td>
                  <td style={{padding:'11px 14px',color:'#ccc'}}>{m.total_affiliates}</td>
                  <td style={{padding:'11px 14px',color:V2.green,fontWeight:600}}>R$ {Number(m.total_commissions||0).toFixed(2)}</td>
                  <td style={{padding:'11px 14px'}}><SBadge status={m.status||'active'}/></td>
                  <td style={{padding:'11px 14px'}}>
                    <button onClick={()=>setSelected(m)} style={{padding:'5px 12px',borderRadius:'6px',border:'1px solid #333',background:'transparent',color:'#ccc',fontSize:'12px',cursor:'pointer'}}>
                      Ver afiliados ({m.total_affiliates})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Detalhe do gerente selecionado */
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <button onClick={()=>setSelected(null)} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',borderRadius:'8px',border:'1px solid #333',background:'transparent',color:'#888',fontSize:'12px',cursor:'pointer'}}>
              <ChevronLeft size={13}/> Voltar
            </button>
            <div>
              <p style={{fontWeight:700,fontSize:'16px',color:'#ccc'}}>{selected.name}</p>
              <p style={{fontSize:'12px',color:'#555'}}>{selected.email} · Código: <code style={{color:V2.green}}>{selected.referral_code}</code></p>
            </div>
          </div>

          <p style={{fontSize:'13px',color:'#888'}}>Afiliados cadastrados pelo link deste gerente. Configure a comissão de cada um.</p>

          <div style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
              <thead><tr style={{background:'#141414'}}>
                {['Nome','Email','CPA (R$)','RevShare (%)','Baseline (R$)','Indicados','Comissões','Ações'].map(c=>(
                  <th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>
                ))}
              </tr></thead>
              <tbody>
                {(!selected.affiliates||selected.affiliates.length===0)?(
                  <tr><td colSpan={8} style={{padding:'24px',textAlign:'center',color:'#555',fontSize:'13px'}}>Nenhum afiliado vinculado a este gerente ainda</td></tr>
                ):selected.affiliates.map((a:any,i:number)=>(
                  <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                    <td style={{padding:'11px 14px',color:'#ccc',fontWeight:500}}>{a.name}</td>
                    <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{a.email}</td>
                    <td style={{padding:'11px 14px',color:'#ccc'}}>R$ {Number(a.cpa||0).toFixed(2)}</td>
                    <td style={{padding:'11px 14px',color:'#ccc'}}>{Number(a.rev_share||0).toFixed(1)}%</td>
                    <td style={{padding:'11px 14px',color:'#ccc'}}>R$ {Number(a.baseline||0).toFixed(2)}</td>
                    <td style={{padding:'11px 14px',color:'#ccc'}}>{a.total_referred}</td>
                    <td style={{padding:'11px 14px',color:V2.green,fontWeight:600}}>R$ {Number(a.total_earned||0).toFixed(2)}</td>
                    <td style={{padding:'11px 14px'}}>
                      <button onClick={()=>setEditAff({...a})} style={{padding:'5px 12px',borderRadius:'6px',border:'1px solid #333',background:'transparent',color:'#ccc',fontSize:'12px',cursor:'pointer'}}>
                        <Pencil size={12}/> Comissão
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal editar comissão do afiliado */}
      {editAff&&(
        <Overlay onClose={()=>setEditAff(null)}>
          <Modal title={`Comissão — ${editAff.name}`} onClose={()=>setEditAff(null)}>
            <div style={{display:'flex',flexDirection:'column',gap:'14px',minWidth:'320px'}}>
              <p style={{fontSize:'12px',color:'#888'}}>Configure a comissão deste afiliado gerenciado por <strong style={{color:'#ccc'}}>{selected?.name}</strong>.</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div>
                  <label style={LabelStyle}>CPA (R$)</label>
                  <input type="number" step="0.01" min="0" style={InputStyle} value={editAff.cpa||0} onChange={(e:any)=>setEditAff({...editAff,cpa:e.target.value})}/>
                </div>
                <div>
                  <label style={LabelStyle}>RevShare (%)</label>
                  <input type="number" step="0.01" min="0" max="100" style={InputStyle} value={editAff.rev_share||0} onChange={(e:any)=>setEditAff({...editAff,rev_share:e.target.value})}/>
                </div>
                <div style={{gridColumn:'1/-1'}}>
                  <label style={LabelStyle}>Baseline / Depósito mínimo (R$)</label>
                  <input type="number" step="0.01" min="0" style={InputStyle} value={editAff.baseline||0} onChange={(e:any)=>setEditAff({...editAff,baseline:e.target.value})}/>
                </div>
              </div>
              <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
                <button onClick={()=>setEditAff(null)} style={{padding:'8px 16px',borderRadius:'8px',border:'1px solid #333',background:'transparent',color:'#888',fontSize:'13px',cursor:'pointer'}}>Cancelar</button>
                <PrimaryBtn onClick={saveCommission}>{saving?'Salvando...':'Salvar comissão'}</PrimaryBtn>
              </div>
            </div>
          </Modal>
        </Overlay>
      )}
    </div>
  )
}

function AfiliadosPage({affiliates,token,api,onEdit}:{affiliates:any[],token:string,api:string,onEdit:(id:string)=>void}) {
  const safe = affiliates.filter(Boolean)
  const totalEarned = safe.reduce((s:number,a:any)=>s+Number(a.total_earned||0),0)
  const totalReferred = safe.reduce((s:number,a:any)=>s+Number(a.total_referred||0),0)
  const [detalhes,setDetalhes]=useState<any>(null)
  const [toast2,setToast2]=useState('')
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Afiliados</h1>
      {toast2&&<div style={{padding:'10px 14px',borderRadius:'8px',background:'rgba(0,230,118,0.08)',border:'1px solid rgba(0,230,118,0.2)',color:'#00e676',fontSize:'13px'}}>{toast2}</div>}
      <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
        <MCard title="Total Afiliados" value={String(affiliates.length)} sub="Usuários com indicados" icon={UserCheck} color="green" tip="Quantidade de usuários com status de afiliado que possuem pelo menos um indicado."/>
        <MCard title="Total Indicados" value={String(totalReferred)} sub="Todos os indicados" icon={Users} color="blue" tip="Soma de todos os usuários indicados por afiliados via link de referência."/>
        <MCard title="Comissões Pagas" value={'R$ '+totalEarned.toFixed(2)} sub="Total distribuído" icon={Wallet} color="green" tip="Total em reais já distribuído em comissões para todos os afiliados."/>
      </div>
      <div className="table-wrap" style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead><tr style={{background:'#141414'}}>
            {[
              'Nome','Email',
              <span style={{display:'flex',alignItems:'center',gap:'4px'}}>Código<AdminTip text="Link de convite exclusivo do afiliado. Quando um novo usuário se cadastra usando esse código, é vinculado a este afiliado."/></span>,
              <span style={{display:'flex',alignItems:'center',gap:'4px'}}>Indicados<AdminTip text="Total de usuários que se cadastraram usando o código deste afiliado."/></span>,
              'Comissões',
              <span style={{display:'flex',alignItems:'center',gap:'4px'}}>Taxa<AdminTip text="Percentual de comissão que este afiliado recebe sobre os depósitos dos seus indicados."/></span>,
              'Status','Ações'
            ].map((c,i)=><th key={i} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {safe.length===0?(
              <tr><td colSpan={8} style={{padding:'24px',textAlign:'center',color:'#555',fontSize:'13px'}}>Nenhum afiliado ainda</td></tr>
            ):safe.map((a:any,i:number)=>(
              <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                <td style={{padding:'11px 14px',color:'#ccc',fontWeight:500}}>{a.name}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{a.email}</td>
                <td style={{padding:'11px 14px',color:'#00e676',fontWeight:700,letterSpacing:'0.1em',fontSize:'12px'}}>{a.referral_code}</td>
                <td style={{padding:'11px 14px',color:'#888',textAlign:'center'}}>{a.total_referred||0}</td>
                <td style={{padding:'11px 14px',color:'#00e676',fontWeight:600}}>R$ {Number(a.total_earned||0).toFixed(2)}</td>
                <td style={{padding:'11px 14px',color:'#aaa'}}>{a.commission_rate||0}%</td>
                <td style={{padding:'11px 14px'}}><SBadge status={a.status||'active'}/></td>
                <td style={{padding:'11px 14px'}}>
                  <div style={{display:'flex',gap:'5px'}}>
                    <GhostBtn onClick={()=>onEdit(a.id)}>Editar</GhostBtn>
                    <GhostBtn color="green" onClick={()=>setDetalhes(a)}>Detalhes</GhostBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Modal Detalhes do Afiliado */}
      {detalhes&&(
        <Overlay onClose={()=>setDetalhes(null)}>
          <Modal title={`Detalhes — ${detalhes.name}`} onClose={()=>setDetalhes(null)}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'8px'}}>
              <div style={{background:'#111',borderRadius:'8px',padding:'12px'}}>
                <p style={{fontSize:'11px',color:'#555',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Código</p>
                <p style={{fontSize:'16px',fontWeight:700,color:'#00e676',letterSpacing:'0.15em'}}>{detalhes.referral_code}</p>
              </div>
              <div style={{background:'#111',borderRadius:'8px',padding:'12px'}}>
                <p style={{fontSize:'11px',color:'#555',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Indicados</p>
                <p style={{fontSize:'20px',fontWeight:700,color:'#3b82f6'}}>{detalhes.total_referred||0}</p>
              </div>
              <div style={{background:'#111',borderRadius:'8px',padding:'12px'}}>
                <p style={{fontSize:'11px',color:'#555',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Comissões</p>
                <p style={{fontSize:'16px',fontWeight:700,color:'#00e676'}}>R$ {Number(detalhes.total_earned||0).toFixed(2)}</p>
              </div>
              <div style={{background:'#111',borderRadius:'8px',padding:'12px'}}>
                <p style={{fontSize:'11px',color:'#555',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Taxa</p>
                <p style={{fontSize:'20px',fontWeight:700,color:'#ffb300'}}>{detalhes.commission_rate||0}%</p>
              </div>
            </div>
            <div style={{background:'#111',borderRadius:'8px',padding:'12px'}}>
              <p style={{fontSize:'11px',color:'#555',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Contato</p>
              <p style={{fontSize:'13px',color:'#ccc'}}>{detalhes.email}</p>
            </div>
            <GhostBtn onClick={()=>setDetalhes(null)}>Fechar</GhostBtn>
          </Modal>
        </Overlay>
      )}
    </div>
  )
}

function SaquesAfiliadosPage({token, api}:{token:string,api:string}) {
  const [activeTab, setActiveTab] = useState('todos')
  const [rows, setRows] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{id:string,type:'approve'|'reject'}|null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [acting, setActing] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch(api+'/api/admin/affiliate-withdrawals',{headers:{'Authorization':'Bearer '+token}})
      const d = await r.json()
      setRows(d.rows||[])
      setStats(d.stats||{})
    } catch{}
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  const filtered = activeTab==='todos'?rows:rows.filter((r:any)=>r.status===activeTab)

  const openConfirm = (id:string,type:'approve'|'reject') => {
    setConfirmAction({id,type})
    setRejectReason('')
    setConfirmOpen(true)
  }

  const doAction = async () => {
    if(!confirmAction) return
    setActing(true)
    const {id,type} = confirmAction
    const url = api+`/api/admin/affiliate-withdrawals/${id}/${type==='approve'?'approve':'reject'}`
    try {
      await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({reason:rejectReason||undefined})})
    } catch{}
    setActing(false)
    setConfirmOpen(false)
    setConfirmAction(null)
    load()
  }

  const fmt = (v:number) => 'R$ '+Number(v||0).toFixed(2)
  const fmtDate = (d:string) => new Date(d).toLocaleDateString('pt-BR')

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Saques Afiliados</h1>
      <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
        <MCard title="Pendentes" value={fmt(stats.total_pending)} sub={`${stats.count_pending||0} saques`} icon={ArrowUpFromLine} color="yellow" tip="Total em reais de comissões solicitadas por afiliados ainda aguardando aprovação."/>
        <MCard title="Total Pago" value={fmt(stats.total_paid_all)} sub={`${stats.count_paid||0} pagos`} icon={ArrowUpFromLine} color="green" tip="Total acumulado em reais já pago em saques de comissões para afiliados."/>
        <MCard title="Total Solicitações" value={String(rows.length)} sub="Todas" icon={ArrowUpFromLine} color="blue" tip="Número total de pedidos de saque de comissão feitos por todos os afiliados."/>
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        {(['todos','pending','paid','rejected'] as const).map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{padding:'6px 14px',borderRadius:'6px',border:`1px solid ${t===activeTab?'#00e676':'#222'}`,background:t===activeTab?'rgba(0,230,118,0.1)':'transparent',color:t===activeTab?'#00e676':'#888',fontSize:'12px',cursor:'pointer',fontWeight:t===activeTab?600:400,transition:'all 0.15s'}}>
            {t==='todos'?'Todos':t==='pending'?'Pendentes':t==='paid'?'Pagos':'Rejeitados'}
          </button>
        ))}
      </div>
      <div className="table-wrap" style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead><tr style={{background:'#141414'}}>
            {['Afiliado','Valor','PIX','Data','Status','Ações'].map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{padding:'24px',textAlign:'center',color:'#555'}}>Carregando...</td></tr>}
            {!loading && filtered.length===0 && <tr><td colSpan={6} style={{padding:'24px',textAlign:'center',color:'#555'}}>Nenhum saque</td></tr>}
            {filtered.map((item:any)=>(
              <tr key={item.id} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                <td style={{padding:'11px 14px'}}>
                  <p style={{color:'#ccc',fontWeight:500,fontSize:'13px'}}>{item.name}</p>
                  <p style={{color:'#555',fontSize:'11px'}}>{item.email}</p>
                </td>
                <td style={{padding:'11px 14px',color:'#ffb300',fontWeight:600}}>{fmt(item.amount)}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{item.pix_key}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{fmtDate(item.created_at)}</td>
                <td style={{padding:'11px 14px'}}><SBadge status={item.status}/></td>
                <td style={{padding:'11px 14px'}}>
                  {item.status==='pending'&&(
                    <div style={{display:'flex',gap:'5px'}}>
                      <GhostBtn color="green" onClick={()=>openConfirm(item.id,'approve')}>Aprovar</GhostBtn>
                      <GhostBtn color="red" onClick={()=>openConfirm(item.id,'reject')}>Recusar</GhostBtn>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {confirmOpen&&confirmAction&&(
        <Overlay onClose={()=>setConfirmOpen(false)}>
          <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'28px',maxWidth:'380px',width:'100%',textAlign:'center'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(255,179,0,0.1)',border:'1px solid rgba(255,179,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><AlertTriangle size={20} color="#ffb300"/></div>
            <p style={{fontSize:'14px',color:'#ccc',marginBottom:'6px'}}>{confirmAction.type==='approve'?'Aprovar este saque?':'Recusar este saque?'}</p>
            {confirmAction.type==='reject'&&(
              <input value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Motivo (opcional)" style={{width:'100%',background:'#111',border:'1px solid #333',borderRadius:'8px',padding:'8px 12px',color:'#fff',fontSize:'13px',fontFamily:'inherit',outline:'none',marginBottom:'12px',boxSizing:'border-box'}}/>
            )}
            <p style={{fontSize:'11px',color:'#888',marginBottom:'20px'}}>Esta ação será registrada na auditoria.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <PrimaryBtn onClick={doAction} disabled={acting}>{acting?'Aguarde...':'Confirmar'}</PrimaryBtn>
              <GhostBtn onClick={()=>setConfirmOpen(false)}>Cancelar</GhostBtn>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}

function RelatorioPage() {
  const mockData = [
    { afiliado:'Carlos Silva', indicados:84, depositaram:52, comissao:'R$ 12.480', conversao:'61.9%' },
    { afiliado:'Ana Martins', indicados:42, depositaram:28, comissao:'R$ 9.320', conversao:'66.7%' },
    { afiliado:'Pedro Costa', indicados:18, depositaram:8, comissao:'R$ 3.100', conversao:'44.4%' },
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Relatório de Afiliados</h1>
        <GhostBtn onClick={()=>{}}><FileDown size={13}/> Exportar CSV</GhostBtn>
      </div>
      <div className="table-wrap" style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead><tr style={{background:'#141414'}}>
            {['Afiliado','Indicados','Depositaram','Comissão','Conversão'].map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {mockData.map((item,i)=>(
              <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                <td style={{padding:'11px 14px',color:'#ccc',fontWeight:500}}>{item.afiliado}</td>
                <td style={{padding:'11px 14px',color:'#888'}}>{item.indicados}</td>
                <td style={{padding:'11px 14px',color:'#888'}}>{item.depositaram}</td>
                <td style={{padding:'11px 14px',color:'#00e676',fontWeight:600}}>{item.comissao}</td>
                <td style={{padding:'11px 14px',color:'#888'}}>{item.conversao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function HistoricoPage() {
  const mockData = [
    { tipo:'Depósito', usuario:'Ricardo Alves', descricao:'Depósito PIX R$ 200', admin:'Sistema', data:'24/03/2026 14:32', acao:'creation' },
    { tipo:'Saque', usuario:'Fernanda Lima', descricao:'Saque aprovado R$ 1.200', admin:'Admin Master', data:'24/03/2026 13:18', acao:'edition' },
    { tipo:'Mercado', usuario:'-', descricao:'Mercado #48 encerrado', admin:'Admin Master', data:'24/03/2026 12:00', acao:'edition' },
    { tipo:'Usuário', usuario:'Lucas Costa', descricao:'Status: ativo → bloqueado', admin:'Admin Master', data:'24/03/2026 11:45', acao:'edition' },
    { tipo:'Admin', usuario:'Ana Suporte', descricao:'Admin removido', admin:'Admin Master', data:'24/03/2026 10:20', acao:'deletion' },
  ]
  const acaoBadge:any = { creation:{bg:'rgba(0,230,118,0.1)',c:'#00e676'}, edition:{bg:'rgba(255,179,0,0.1)',c:'#ffb300'}, deletion:{bg:'rgba(244,67,54,0.1)',c:'#f44336'} }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Histórico</h1>
        <GhostBtn onClick={()=>{}}><FileDown size={13}/> Exportar CSV</GhostBtn>
      </div>
      <div className="table-wrap" style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead><tr style={{background:'#141414'}}>
            {['Tipo','Usuário','Descrição','Ação','Admin','Data'].map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {mockData.map((item,i)=>(
              <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                <td style={{padding:'11px 14px',color:'#ccc'}}>{item.tipo}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{item.usuario}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px',maxWidth:'200px'}}>{item.descricao}</td>
                <td style={{padding:'11px 14px'}}><span style={{padding:'2px 8px',borderRadius:'99px',fontSize:'11px',fontWeight:600,...acaoBadge[item.acao]}}>{item.acao}</span></td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{item.admin}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{item.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EventosPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({titulo:'',categoria:'',subcategoria:'',descricao:'',status:'active'})
  const mockEventos = [
    { id:1, categoria:'Futebol', subcategoria:'Copa do Mundo', titulo:'Brasil vs Argentina', volume:'R$ 284.000', mercados:5, status:'active' },
    { id:2, categoria:'Política', subcategoria:'Eleições', titulo:'Eleições 2026', volume:'R$ 120.000', mercados:3, status:'active' },
    { id:3, categoria:'Entretenimento', subcategoria:'TV', titulo:'BBB 26', volume:'R$ 45.000', mercados:8, status:'inactive' },
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Eventos</h1>
        <PrimaryBtn onClick={()=>setCreateOpen(true)}><Plus size={14}/> Criar Evento</PrimaryBtn>
      </div>
      <div className="table-wrap" style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead><tr style={{background:'#141414'}}>
            {['Categoria','Subcategoria','Título','Volume Total','Mercados','Status'].map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222'}}>{c}</th>)}
          </tr></thead>
          <tbody>
            {mockEventos.map((e,i)=>(
              <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{e.categoria}</td>
                <td style={{padding:'11px 14px',color:'#888',fontSize:'12px'}}>{e.subcategoria}</td>
                <td style={{padding:'11px 14px',color:'#ccc',fontWeight:500}}>{e.titulo}</td>
                <td style={{padding:'11px 14px',color:'#00e676',fontWeight:600}}>{e.volume}</td>
                <td style={{padding:'11px 14px',color:'#888'}}>{e.mercados}</td>
                <td style={{padding:'11px 14px'}}><SBadge status={e.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {createOpen&&(
        <Overlay onClose={()=>setCreateOpen(false)}>
          <Modal title="Criar Evento" onClose={()=>setCreateOpen(false)}>
            <FField label="Título *"><FInput value={form.titulo} onChange={(e:any)=>setForm({...form,titulo:e.target.value})}/></FField>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <FField label="Categoria *"><FInput value={form.categoria} onChange={(e:any)=>setForm({...form,categoria:e.target.value})}/></FField>
              <FField label="Subcategoria"><FInput value={form.subcategoria} onChange={(e:any)=>setForm({...form,subcategoria:e.target.value})}/></FField>
            </div>
            <FField label="Descrição"><textarea value={form.descricao} onChange={(e:any)=>setForm({...form,descricao:e.target.value})} style={{width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',resize:'vertical',minHeight:'80px'}} onFocus={(e:any)=>e.target.style.borderColor='rgba(0,230,118,0.4)'} onBlur={(e:any)=>e.target.style.borderColor='#222'}/></FField>
            <FField label="Status"><FSelect value={form.status} onChange={(e:any)=>setForm({...form,status:e.target.value})}><option value="active">Ativo</option><option value="inactive">Inativo</option></FSelect></FField>
            <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
              <PrimaryBtn onClick={()=>setCreateOpen(false)}>CRIAR</PrimaryBtn>
              <GhostBtn onClick={()=>setCreateOpen(false)}>Cancelar</GhostBtn>
            </div>
          </Modal>
        </Overlay>
      )}
    </div>
  )
}

function ConfiguracoesFullPage({settings,setSettings,api,showToast}:{settings:any,setSettings:any,api:any,showToast:any}) {
  const [activeTab, setActiveTab] = useState('seo')
  const [finTab, setFinTab] = useState('usuario')
  const [keywords, setKeywords] = useState<string[]>(['apostas','mercados','pix'])
  const [kwInput, setKwInput] = useState('')
  const [cpaType, setCpaType] = useState('fixed')
  const [local, setLocal] = useState<any>(settings)
  const upd = (k:string) => (e:any) => setLocal((p:any)=>({...p,[k]:e.target.value}))
  const tabs = [{id:'seo',l:'SEO'},{id:'cpa',l:'Afiliados CPA'},{id:'financeiro',l:'Financeiro'},{id:'scripts',l:'Scripts'},{id:'social',l:'Social'}]
  const finTabs = [{id:'usuario',l:'Usuário'},{id:'taxas',l:'Taxas'},{id:'afiliado',l:'Afiliado'}]
  const addKw = () => { if(kwInput.trim()&&!keywords.includes(kwInput.trim())){setKeywords([...keywords,kwInput.trim()]);setKwInput('')} }
  const InputStyle = {width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none'}
  const LabelStyle = {fontSize:'11px',color:'#555',display:'block' as any,marginBottom:'5px',textTransform:'uppercase' as any,letterSpacing:'0.1em',fontWeight:600}
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Configurações</h1>
      <div style={{display:'flex',gap:'6px',borderBottom:'1px solid #222',paddingBottom:'0'}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:'8px 16px',border:'none',background:'transparent',cursor:'pointer',color:t.id===activeTab?'#00e676':'#888',fontSize:'13px',fontWeight:t.id===activeTab?600:400,borderBottom:t.id===activeTab?'2px solid #00e676':'2px solid transparent',transition:'all 0.15s',marginBottom:'-1px'}}>{t.l}</button>
        ))}
      </div>

      {activeTab==='seo'&&(
        <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'24px',display:'flex',flexDirection:'column',gap:'16px'}}>
          <div><label style={LabelStyle}>Título do site *</label><input value={local.platform_name||''} onChange={upd('platform_name')} style={InputStyle}/></div>
          <div><label style={LabelStyle}>Descrição *</label><textarea value={local.platform_description||''} onChange={upd('platform_description')} style={{...InputStyle,resize:'vertical',minHeight:'80px'} as any}/></div>
          <div>
            <label style={LabelStyle}>Palavras-chave</label>
            <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
              <input value={kwInput} onChange={(e:any)=>setKwInput(e.target.value)} onKeyDown={(e:any)=>{if(e.key==='Enter'){e.preventDefault();addKw()}}} placeholder="Digite e pressione Enter" style={InputStyle}/>
              <button onClick={addKw} style={{padding:'9px 14px',borderRadius:'8px',border:'1px solid #222',background:'#141414',color:'#888',cursor:'pointer'}}><Plus size={14}/></button>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
              {keywords.map(kw=>(
                <span key={kw} style={{display:'flex',alignItems:'center',gap:'5px',background:'#222',borderRadius:'99px',padding:'4px 10px',fontSize:'12px',color:'#888'}}>
                  {kw}<button onClick={()=>setKeywords(keywords.filter(k=>k!==kw))} style={{background:'none',border:'none',cursor:'pointer',color:'#555',display:'flex'}}><X size={11}/></button>
                </span>
              ))}
            </div>
          </div>
          <PrimaryBtn onClick={()=>{if(!local.platform_name?.trim()){showToast('Nome da plataforma é obrigatório','error');return;}api('/api/admin/settings','PUT',local).then(()=>showToast('SEO salvo!'))}}>Salvar</PrimaryBtn>
        </div>
      )}

      {activeTab==='cpa'&&(
        <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>
          <div>
            <p style={{fontSize:'14px',fontWeight:700,color:'#ccc',margin:'0 0 4px'}}>Configurações de Afiliação</p>
            <p style={{fontSize:'12px',color:'#555',margin:0}}>Configure os valores padrão para novos afiliados</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'5px'}}>
                <label style={{...LabelStyle,marginBottom:0}}>CPA (R$)</label>
                <AdminTip text="Valor pago por cada primeiro depósito de usuário indicado." pos="bottom"/>
              </div>
              <input type="number" step="0.01" min="0" placeholder="0.00" value={local.cpa_value??''} onChange={upd('cpa_value')} style={InputStyle}/>
            </div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'5px'}}>
                <label style={{...LabelStyle,marginBottom:0}}>RevShare (%)</label>
                <AdminTip text="Percentual pago sobre todos os depósitos dos usuários indicados." pos="bottom"/>
              </div>
              <input type="number" step="0.01" min="0" max="100" placeholder="0.00" value={local.rev_share??''} onChange={upd('rev_share')} style={InputStyle}/>
            </div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'5px'}}>
                <label style={{...LabelStyle,marginBottom:0}}>Depósito mínimo para comissão (R$)</label>
                <AdminTip text="Valor mínimo do depósito para gerar comissão ao afiliado." pos="bottom"/>
              </div>
              <input type="number" step="0.01" min="0" placeholder="0.00" value={local.min_deposit_commission??''} onChange={upd('min_deposit_commission')} style={InputStyle}/>
            </div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'5px'}}>
                <label style={{...LabelStyle,marginBottom:0}}>Taxa de contabilização (%)</label>
                <AdminTip text="Percentual de depósitos dos indicados que contabilizam comissão por ciclo. Ex: 40% = de 10 depósitos, apenas 4 geram comissão, então o ciclo reinicia." pos="bottom"/>
              </div>
              <input type="number" step="1" min="0" max="100" placeholder="40" value={local.commission_rate??''} onChange={upd('commission_rate')} style={InputStyle}/>
            </div>
          </div>
          <PrimaryBtn onClick={()=>api('/api/admin/settings','PUT',local).then(()=>showToast('Configurações de afiliação salvas!'))}>Salvar</PrimaryBtn>
        </div>
      )}

      {activeTab==='financeiro'&&(
        <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'24px',display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{display:'flex',gap:'6px'}}>
            {finTabs.map(t=>(
              <button key={t.id} onClick={()=>setFinTab(t.id)} style={{padding:'6px 14px',borderRadius:'6px',border:`1px solid ${t.id===finTab?'#00e676':'#222'}`,background:t.id===finTab?'rgba(0,230,118,0.1)':'transparent',color:t.id===finTab?'#00e676':'#888',fontSize:'12px',cursor:'pointer',fontWeight:t.id===finTab?600:400,transition:'all 0.15s'}}>{t.l}</button>
            ))}
          </div>
          {finTab==='usuario'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div><div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}><label style={{...LabelStyle,marginBottom:0}}>Depósito Mínimo (R$) *</label><AdminTip text="Valor mínimo que um jogador precisa depositar por transação. Depósitos abaixo disso são recusados." pos="bottom"/></div><input type="number" value={local.min_deposit||''} onChange={upd('min_deposit')} style={InputStyle}/></div>
                <div><div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}><label style={{...LabelStyle,marginBottom:0}}>Saque Mínimo (R$) *</label><AdminTip text="Valor mínimo que um jogador pode solicitar por saque. Solicitações abaixo disso são bloqueadas." pos="bottom"/></div><input type="number" value={local.saque_minimo||''} onChange={upd('saque_minimo')} style={InputStyle}/></div>
                <div><div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}><label style={{...LabelStyle,marginBottom:0}}>Saque Máximo (R$) *</label><AdminTip text="Valor máximo por solicitação de saque. Acima deste limite o saque é recusado automaticamente." pos="bottom"/></div><input type="number" value={local.saque_maximo||''} onChange={upd('saque_maximo')} style={InputStyle}/></div>
                <div><div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}><label style={{...LabelStyle,marginBottom:0}}>Rollover Base *</label><AdminTip text="Multiplicador de apostas obrigatórias antes de sacar bônus. Ex: rollover 2x sobre bônus de R$10 exige R$20 em apostas." pos="bottom"/></div><input type="number" value={local.rollover||''} onChange={upd('rollover')} style={InputStyle}/></div>
                <div><div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}><label style={{...LabelStyle,marginBottom:0}}>Limite Diário (R$) *</label><AdminTip text="Valor máximo que um jogador pode sacar por dia. Protege o caixa contra saques em massa." pos="bottom"/></div><input type="number" value={local.saque_diario||''} onChange={upd('saque_diario')} style={InputStyle}/></div>
              </div>
              <PrimaryBtn onClick={()=>api('/api/admin/settings','PUT',local).then(()=>showToast('Salvo!'))}>Salvar</PrimaryBtn>
            </div>
          )}
          {finTab==='taxas'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}>
                <div><div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}><label style={{...LabelStyle,marginBottom:0}}>Taxa Saque (%)</label><AdminTip text="Percentual descontado sobre cada saque. Ex: taxa 2% sobre R$100 = jogador recebe R$98." pos="bottom"/></div><input type="number" value={local.taxa_saque||''} onChange={upd('taxa_saque')} style={InputStyle}/></div>
                <div><div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}><label style={{...LabelStyle,marginBottom:0}}>Taxa Depósito (%)</label><AdminTip text="Percentual cobrado sobre cada depósito. Ex: taxa 2% sobre R$100 = R$98 creditados ao jogador." pos="bottom"/></div><input type="number" value={local.taxa_deposito||''} onChange={upd('taxa_deposito')} style={InputStyle}/></div>
                <div><div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}><label style={{...LabelStyle,marginBottom:0}}>Taxa Vitória (%)</label><AdminTip text="Percentual retido sobre os ganhos de cada aposta vencida. Ex: taxa 5% sobre ganho de R$100 = R$95 para o jogador." pos="bottom"/></div><input type="number" value={local.taxa_vitoria||''} onChange={upd('taxa_vitoria')} style={InputStyle}/></div>
              </div>
              <PrimaryBtn onClick={()=>api('/api/admin/settings','PUT',local).then(()=>showToast('Salvo!'))}>Salvar</PrimaryBtn>
            </div>
          )}
          {finTab==='afiliado'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}>
                <div><label style={LabelStyle}>Saque Mínimo (R$) *</label><input type="number" defaultValue="50" style={InputStyle}/></div>
                <div><label style={LabelStyle}>Saque Máximo (R$) *</label><input type="number" defaultValue="10000" style={InputStyle}/></div>
                <div><label style={LabelStyle}>Limite Diário (R$) *</label><input type="number" defaultValue="20000" style={InputStyle}/></div>
              </div>
              <PrimaryBtn onClick={()=>api('/api/admin/settings','PUT',local).then(()=>showToast('Salvo!'))}>Salvar</PrimaryBtn>
            </div>
          )}
        </div>
      )}

      {activeTab==='scripts'&&(
        <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'24px',display:'flex',flexDirection:'column',gap:'16px'}}>
          <div><label style={LabelStyle}>Scripts externos</label><textarea rows={10} placeholder="Cole seus scripts aqui..." style={{...InputStyle,resize:'vertical',fontFamily:"monospace",fontSize:'12px'} as any}/></div>
          <PrimaryBtn onClick={()=>api('/api/admin/settings','PUT',local).then(()=>showToast('Scripts salvos!'))}>Salvar</PrimaryBtn>
        </div>
      )}

      {activeTab==='social'&&(
        <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'24px',display:'flex',flexDirection:'column',gap:'16px'}}>
          {['Instagram','Telegram','WhatsApp','Twitter/X','YouTube','TikTok'].map(s=>(
            <div key={s}><label style={LabelStyle}>{s}</label><input placeholder={`URL do ${s}`} style={InputStyle}/></div>
          ))}
          <PrimaryBtn onClick={()=>api('/api/admin/settings','PUT',local).then(()=>showToast('Social salvo!'))}>Salvar</PrimaryBtn>
        </div>
      )}
    </div>
  )
}

function EstiloPage({token,api,onLogoChange}:{token:string,api:string,onLogoChange?:(url:string)=>void}) {
  const [logoUrl,setLogoUrl]=useState('')
  const [faviconUrl,setFaviconUrl]=useState('')
  const [saving,setSaving]=useState(false)
  const [msg,setMsg]=useState('')
  useEffect(()=>{
    fetch(api+'/api/admin/settings',{headers:{Authorization:'Bearer '+token}})
      .then(r=>r.json())
      .then(d=>{
        if(d.logo_url) setLogoUrl(api+d.logo_url)
        if(d.favicon_url) setFaviconUrl(api+d.favicon_url)
      }).catch(()=>{})
  },[])
  async function uploadFile(endpoint:string,file:File,setUrl:(u:string)=>void){
    setSaving(true);setMsg('')
    try {
      const fd=new FormData();fd.append('image',file)
      const r=await fetch(api+endpoint,{method:'POST',headers:{Authorization:'Bearer '+token},body:fd})
      const d=await r.json()
      if(d.url){const full=api+d.url;setUrl(full);setMsg('Enviado com sucesso!');if(endpoint.includes('logo')&&onLogoChange)onLogoChange(full)}
      else setMsg(d.error||'Erro ao enviar')
    } catch(e:any) {
      setMsg('Erro de conexão: '+e.message)
    } finally {
      setSaving(false)
    }
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Customização - Estilo</h1>
      <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'24px',display:'flex',flexDirection:'column',gap:'20px',maxWidth:'500px'}}>
        <div>
          <label style={{fontSize:'11px',color:'#555',display:'block',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:600}}>Logo</label>
          <label style={{height:'100px',border:`2px dashed ${logoUrl?'rgba(0,230,118,0.4)':'#222'}`,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'border-color 0.15s',overflow:'hidden'}} onMouseEnter={(e:any)=>e.currentTarget.style.borderColor='rgba(0,230,118,0.3)'} onMouseLeave={(e:any)=>e.currentTarget.style.borderColor=logoUrl?'rgba(0,230,118,0.4)':'#222'}>
            {logoUrl?<img src={logoUrl} alt="logo" style={{maxHeight:'90px',maxWidth:'100%',objectFit:'contain'}} onError={()=>setLogoUrl('')}/>:<div style={{textAlign:'center'}}><Upload size={24} color="#555" style={{margin:'0 auto 6px'}}/><p style={{fontSize:'12px',color:'#555'}}>Clique para enviar logo</p></div>}
            <input type="file" accept="image/*" style={{display:'none'}} onChange={(e:any)=>{const f=e.target.files?.[0];if(f)uploadFile('/api/admin/settings/logo',f,setLogoUrl)}}/>
          </label>
        </div>
        <div>
          <label style={{fontSize:'11px',color:'#555',display:'block',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:600}}>Favicon</label>
          <label style={{width:'80px',height:'80px',border:`2px dashed ${faviconUrl?'rgba(0,230,118,0.4)':'#222'}`,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden'}}>
            {faviconUrl?<img src={faviconUrl} alt="favicon" style={{width:'60px',height:'60px',objectFit:'contain'}} onError={()=>setFaviconUrl('')}/>:<Upload size={18} color="#555"/>}
            <input type="file" accept="image/*" style={{display:'none'}} onChange={(e:any)=>{const f=e.target.files?.[0];if(f)uploadFile('/api/admin/settings/favicon',f,setFaviconUrl)}}/>
          </label>
        </div>
        {saving&&<p style={{fontSize:'12px',color:'#ffb300'}}>Enviando...</p>}
        {msg&&<p style={{fontSize:'12px',color:msg.includes('Erro')?'#f44336':'#00e676'}}>{msg}</p>}
      </div>
    </div>
  )
}

function BannersPage({token,api}:{token:string,api:string}) {
  const [banners,setBanners]=useState<any[]>([])
  const [uploading,setUploading]=useState(false)
  const [newLink,setNewLink]=useState('')
  const [editingLink,setEditingLink]=useState<{id:any,val:string}|null>(null)
  const h={'Authorization':'Bearer '+token}
  useEffect(()=>{ fetch(api+'/api/admin/banners',{headers:h}).then(r=>r.json()).then(d=>setBanners(Array.isArray(d)?d:[])).catch(()=>{}) },[])
  async function toggleBanner(id:any,active:boolean){
    await fetch(api+`/api/admin/banners/${id}`,{method:'PATCH',headers:{...h,'Content-Type':'application/json'},body:JSON.stringify({active})})
    setBanners(banners.map(b=>String(b.id)===String(id)?{...b,active}:b))
  }
  async function deleteBanner(id:any){
    await fetch(api+`/api/admin/banners/${id}`,{method:'DELETE',headers:h})
    setBanners(banners.filter(b=>String(b.id)!==String(id)))
  }
  async function saveLink(id:any,link:string){
    await fetch(api+`/api/admin/banners/${id}`,{method:'PATCH',headers:{...h,'Content-Type':'application/json'},body:JSON.stringify({link})})
    setBanners(banners.map(b=>String(b.id)===String(id)?{...b,link}:b))
    setEditingLink(null)
  }
  async function uploadBanner(file:File){
    setUploading(true)
    const fd=new FormData();fd.append('image',file);fd.append('name',file.name);if(newLink)fd.append('link',newLink)
    const r=await fetch(api+'/api/admin/banners',{method:'POST',headers:h,body:fd})
    const d=await r.json()
    if(d.banner) setBanners([...banners,d.banner])
    setNewLink('');setUploading(false)
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Banners</h1>
      </div>
      <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'10px',padding:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
        <p style={{fontSize:'11px',color:'#555',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:600}}>Novo Banner</p>
        <input value={newLink} onChange={e=>setNewLink(e.target.value)} placeholder="Link ao clicar (opcional, ex: https://...)" style={{background:'#111',border:'1px solid #2a2a2a',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',width:'100%'}}/>
        <PrimaryBtn onClick={()=>{(document.getElementById('banner-file-input') as HTMLInputElement)?.click()}}><Upload size={14}/> {uploading?'Enviando...':'Escolher imagem e enviar'}</PrimaryBtn>
        <input id="banner-file-input" type="file" accept="image/*" style={{display:'none'}} onChange={(e:any)=>{const f=e.target.files?.[0];if(f){uploadBanner(f);(e.target as HTMLInputElement).value=''}}}/>
      </div>
      {banners.length===0&&<p style={{color:'#555',fontSize:'13px',textAlign:'center',padding:'40px'}}>Nenhum banner cadastrado.</p>}
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {banners.map((banner:any)=>(
          <div key={banner.id} style={{display:'flex',flexDirection:'column',gap:'8px',background:'#1a1a1a',border:'1px solid #222',borderRadius:'10px',padding:'14px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
              <GripVertical size={16} color="#555" style={{cursor:'grab',flexShrink:0}}/>
              <div style={{width:'100px',height:'56px',background:'#222',borderRadius:'6px',flexShrink:0,overflow:'hidden'}}>
                {banner.url&&<img src={api+banner.url} alt={banner.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={(e:any)=>e.target.style.display='none'}/>}
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:'13px',fontWeight:500,color:'#ccc',marginBottom:'3px'}}>{banner.name}</p>
                <p style={{fontSize:'11px',color:'#555'}}>{new Date(banner.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div onClick={()=>toggleBanner(banner.id,!banner.active)} style={{width:'36px',height:'20px',borderRadius:'10px',background:banner.active?'#00e676':'#333',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
                <div style={{position:'absolute',top:'2px',left:banner.active?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
              </div>
              <button onClick={()=>deleteBanner(banner.id)} style={{width:'32px',height:'32px',borderRadius:'6px',border:'none',background:'transparent',cursor:'pointer',color:'#f44336',display:'flex',alignItems:'center',justifyContent:'center'}}><Trash2 size={14}/></button>
            </div>
            {editingLink?.id===banner.id&&editingLink?(
              <div style={{display:'flex',gap:'8px'}}>
                <input value={editingLink.val} onChange={e=>setEditingLink({id:banner.id,val:e.target.value})} placeholder="https://..." style={{flex:1,background:'#111',border:'1px solid rgba(0,230,118,0.3)',borderRadius:'7px',padding:'7px 10px',color:'#ccc',fontSize:'12px',outline:'none'}} autoFocus/>
                <button onClick={()=>{const v=editingLink.val;saveLink(banner.id,v)}} style={{padding:'7px 14px',borderRadius:'7px',border:'none',background:'#00e676',color:'#000',fontWeight:700,fontSize:'12px',cursor:'pointer'}}>Salvar</button>
                <button onClick={()=>setEditingLink(null)} style={{padding:'7px 10px',borderRadius:'7px',border:'1px solid #333',background:'transparent',color:'#777',fontSize:'12px',cursor:'pointer'}}>Cancelar</button>
              </div>
            ):(
              <div style={{display:'flex',alignItems:'center',gap:'8px',paddingLeft:'30px'}}>
                <span style={{fontSize:'11px',color:banner.link?'#00e676':'#444'}}>{banner.link||'Sem link'}</span>
                <button onClick={()=>setEditingLink({id:banner.id,val:banner.link||''})} style={{fontSize:'11px',color:'#666',background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>editar link</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
