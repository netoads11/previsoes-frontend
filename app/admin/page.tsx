'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://187.77.248.115:3001'

export default function Admin() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [markets, setMarkets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [token, setToken] = useState('')
  const [msg, setMsg] = useState({text:'',type:''})
  const [editMarket, setEditMarket] = useState<any>(null)
  const [editUser, setEditUser] = useState<any>(null)
  const [balanceModal, setBalanceModal] = useState<any>(null)
  const [confirm, setConfirm] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // CRIAR MERCADO
  const [newMarket, setNewMarket] = useState({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''})

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    if (!JSON.parse(u).is_admin) { router.push('/'); return }
    setToken(t)
    loadAll(t)
  }, [])

  async function loadAll(t: string) {
    const h = { 'Authorization': 'Bearer ' + t }
    const [m, u, tx, s, a] = await Promise.all([
      fetch(API+'/api/markets').then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/users',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/transactions',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/settings',{headers:h}).then(r=>r.json()).catch(()=>({})),
      fetch(API+'/api/admin/audit',{headers:h}).then(r=>r.json()).catch(()=>[]),
    ])
    setMarkets(Array.isArray(m)?m:[])
    setUsers(Array.isArray(u)?u:[])
    setTransactions(Array.isArray(tx)?tx:[])
    setSettings(s||{})
    setAuditLogs(Array.isArray(a)?a:[])
  }

  function showMsg(text: string, type='success') {
    setMsg({text,type})
    setTimeout(()=>setMsg({text:'',type:''}),3000)
  }

  async function apiCall(url: string, method='GET', body?: any) {
    const res = await fetch(API+url, {
      method,
      headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
      body: body ? JSON.stringify(body) : undefined
    })
    return res.json()
  }

  async function createMarket(e: any) {
    e.preventDefault()
    const r = await apiCall('/api/admin/markets','POST',{
      ...newMarket, yes_odds: Number(newMarket.yes_odds), no_odds: Number(newMarket.no_odds),
      expires_at: newMarket.expires_at || null
    })
    if (r.id) { showMsg('Mercado criado!'); setNewMarket({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''}); loadAll(token) }
    else showMsg(r.error||'Erro','error')
  }

  async function saveMarket() {
    if (!editMarket) return
    const r = await apiCall(`/api/admin/markets/${editMarket.id}`,'PUT',editMarket)
    if (r.id) { showMsg('Mercado atualizado!'); setEditMarket(null); loadAll(token) }
    else showMsg(r.error||'Erro','error')
  }

  async function resolveMarket(id: string, result: string) {
    setConfirm({
      msg: `Resolver mercado com resultado "${result.toUpperCase()}"? Esta ação é irreversível.`,
      action: async () => {
        const r = await apiCall(`/api/admin/markets/${id}/resolve`,'PUT',{result})
        if (r.success) { showMsg('Mercado resolvido!'); loadAll(token) }
        else showMsg(r.error||'Erro','error')
      }
    })
  }

  async function cancelMarket(id: string) {
    setConfirm({
      msg: 'Cancelar mercado? Todas as apostas serão devolvidas.',
      action: async () => {
        const r = await apiCall(`/api/admin/markets/${id}/cancel`,'PUT',{})
        if (r.success) { showMsg('Mercado cancelado!'); loadAll(token) }
        else showMsg(r.error||'Erro','error')
      }
    })
  }

  async function saveUser() {
    if (!editUser) return
    const r = await apiCall(`/api/admin/users/${editUser.id}`,'PUT',editUser)
    if (r.id) { showMsg('Usuario atualizado!'); setEditUser(null); loadAll(token) }
    else showMsg(r.error||'Erro','error')
  }

  async function adjustBalance() {
    if (!balanceModal) return
    setConfirm({
      msg: `${balanceModal.amount > 0 ? 'Adicionar' : 'Remover'} R$ ${Math.abs(balanceModal.amount)} do saldo de ${balanceModal.name}?`,
      action: async () => {
        const r = await apiCall(`/api/admin/users/${balanceModal.id}/balance`,'POST',{amount: Number(balanceModal.amount), note: balanceModal.note})
        if (r.success) { showMsg('Saldo ajustado!'); setBalanceModal(null); loadAll(token) }
        else showMsg(r.error||'Erro','error')
      }
    })
  }

  async function saveSettings(e: any) {
    e.preventDefault()
    const r = await apiCall('/api/admin/settings','PUT',settings)
    if (r.success) showMsg('Configuracoes salvas!')
    else showMsg(r.error||'Erro','error')
  }

  const TABS = [
    {id:'dashboard',label:'Dashboard'},
    {id:'markets',label:'Mercados'},
    {id:'criar',label:'Criar Mercado'},
    {id:'users',label:'Usuarios'},
    {id:'financeiro',label:'Financeiro'},
    {id:'configs',label:'Configuracoes'},
    {id:'audit',label:'Auditoria'},
  ]

  const CATS = ['Entretenimento','Criptomoedas','Financeiro','Esportes','Politica','Clima','Celebridades']

  const s = {
    container: {display:'flex',minHeight:'100vh',background:'#111',color:'#fff',fontFamily:'Kanit,sans-serif'} as any,
    sidebar: {width:'200px',flexShrink:0,background:'#1a1a1a',borderRight:'1px solid #222',padding:'16px 0',display:'flex',flexDirection:'column' as any,height:'100vh',position:'sticky' as any,top:0},
    main: {flex:1,padding:'24px',overflowY:'auto' as any},
    card: {background:'#1a1a1a',border:'1px solid #222',borderRadius:'10px',padding:'20px',marginBottom:'16px'},
    input: {width:'100%',background:'#2a2a2a',border:'1px solid #333',borderRadius:'8px',padding:'10px 12px',color:'#fff',fontSize:'13px',outline:'none',fontFamily:'Kanit,sans-serif'},
    btn: {background:'#00c853',color:'#000',border:'none',borderRadius:'7px',padding:'9px 18px',fontWeight:700,fontSize:'13px',cursor:'pointer',fontFamily:'Kanit,sans-serif'},
    btnRed: {background:'rgba(239,68,68,0.15)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'7px',padding:'7px 14px',fontWeight:600,fontSize:'12px',cursor:'pointer',fontFamily:'Kanit,sans-serif'},
    btnGray: {background:'#2a2a2a',color:'#aaa',border:'1px solid #333',borderRadius:'7px',padding:'7px 14px',fontWeight:600,fontSize:'12px',cursor:'pointer',fontFamily:'Kanit,sans-serif'},
    label: {fontSize:'11px',color:'#888',display:'block' as any,marginBottom:'5px',textTransform:'uppercase' as any,letterSpacing:'0.08em'},
    badge: (c: string) => ({display:'inline-block',padding:'2px 8px',borderRadius:'4px',fontSize:'11px',fontWeight:700,background: c==='open'?'rgba(0,200,83,0.12)':c==='resolved'?'rgba(99,102,241,0.12)':c==='cancelled'?'rgba(239,68,68,0.12)':'rgba(255,255,255,0.08)',color: c==='open'?'#00c853':c==='resolved'?'#818cf8':c==='cancelled'?'#ef4444':'#888'}),
    th: {textAlign:'left' as any,padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#666',textTransform:'uppercase' as any,letterSpacing:'0.05em',borderBottom:'1px solid #222'},
    td: {padding:'10px 14px',fontSize:'13px',borderBottom:'1px solid #1a1a1a'},
  }

  return (
    <div style={s.container}>
      <style>{`.tab-nav::-webkit-scrollbar{display:none}`}</style>

      {/* SIDEBAR DESKTOP */}
      <aside style={{...s.sidebar,display:'flex'}}>
        <div style={{padding:'0 16px 16px',borderBottom:'1px solid #222',marginBottom:'8px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'6px',background:'#00c853',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#000',fontWeight:900,fontSize:'12px'}}>P</span>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:'13px'}}>Previmarket</div>
              <div style={{color:'#00c853',fontSize:'10px'}}>Admin</div>
            </div>
          </div>
        </div>
        <nav style={{flex:1,overflowY:'auto'}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{width:'100%',padding:'9px 16px',border:'none',cursor:'pointer',background:tab===t.id?'rgba(0,200,83,0.08)':'transparent',borderLeft:tab===t.id?'2px solid #00c853':'2px solid transparent',color:tab===t.id?'#00c853':'#888',fontSize:'13px',fontWeight:tab===t.id?600:400,fontFamily:'Kanit,sans-serif',textAlign:'left'}}>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{padding:'12px 16px',borderTop:'1px solid #222'}}>
          <button onClick={()=>{localStorage.clear();router.push('/')}} style={{...s.btnGray,width:'100%'}}>Sair</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        {/* MSG */}
        {msg.text && (
          <div style={{background:msg.type==='error'?'rgba(239,68,68,0.12)':'rgba(0,200,83,0.12)',border:`1px solid ${msg.type==='error'?'rgba(239,68,68,0.3)':'rgba(0,200,83,0.3)'}`,borderRadius:'8px',padding:'10px 16px',marginBottom:'16px',color:msg.type==='error'?'#ef4444':'#00c853',fontSize:'13px'}}>
            {msg.text}
          </div>
        )}

        {/* DASHBOARD */}
        {tab==='dashboard' && (
          <div>
            <h1 style={{fontSize:'20px',fontWeight:800,marginBottom:'20px'}}>Dashboard</h1>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'12px',marginBottom:'24px'}}>
              {[
                {label:'Mercados',value:markets.length,color:'#00c853'},
                {label:'Usuarios',value:users.length,color:'#818cf8'},
                {label:'Transacoes',value:transactions.length,color:'#f59e0b'},
                {label:'Auditoria',value:auditLogs.length,color:'#ef4444'},
              ].map(c=>(
                <div key={c.label} style={s.card}>
                  <p style={{fontSize:'11px',color:'#666',marginBottom:'6px'}}>{c.label}</p>
                  <p style={{fontSize:'28px',fontWeight:800,color:c.color}}>{c.value}</p>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <h3 style={{fontSize:'14px',fontWeight:700,marginBottom:'12px'}}>Ultimos mercados</h3>
              {markets.slice(0,5).map(m=>(
                <div key={m.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #222'}}>
                  <div>
                    <p style={{fontSize:'13px',fontWeight:500}}>{m.question}</p>
                    <p style={{fontSize:'11px',color:'#666'}}>{m.category}</p>
                  </div>
                  <span style={s.badge(m.status)}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MERCADOS */}
        {tab==='markets' && (
          <div>
            <h1 style={{fontSize:'20px',fontWeight:800,marginBottom:'20px'}}>Mercados ({markets.length})</h1>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a',borderRadius:'10px',overflow:'hidden'}}>
                <thead>
                  <tr>
                    {['Pergunta','Categoria','SIM','NAO','Status','Encerra','Acoes'].map(h=>(
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {markets.map(m=>(
                    <tr key={m.id}>
                      <td style={{...s.td,maxWidth:'220px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.question}</td>
                      <td style={{...s.td,color:'#888'}}>{m.category||'-'}</td>
                      <td style={{...s.td,color:'#00c853',fontWeight:600}}>{m.yes_odds}%</td>
                      <td style={{...s.td,color:'#ef4444',fontWeight:600}}>{m.no_odds}%</td>
                      <td style={s.td}><span style={s.badge(m.status)}>{m.status}</span></td>
                      <td style={{...s.td,color:'#888',fontSize:'11px'}}>{m.expires_at?new Date(m.expires_at).toLocaleDateString('pt-BR'):'-'}</td>
                      <td style={s.td}>
                        <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                          <button onClick={()=>setEditMarket({...m})} style={s.btnGray}>Editar</button>
                          {m.status==='open' && <>
                            <button onClick={()=>resolveMarket(m.id,'yes')} style={{...s.btn,padding:'5px 10px',fontSize:'11px'}}>SIM</button>
                            <button onClick={()=>resolveMarket(m.id,'no')} style={{...s.btnRed,padding:'5px 10px'}}>NAO</button>
                            <button onClick={()=>cancelMarket(m.id)} style={{...s.btnGray,fontSize:'11px'}}>Cancelar</button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CRIAR MERCADO */}
        {tab==='criar' && (
          <div>
            <h1 style={{fontSize:'20px',fontWeight:800,marginBottom:'20px'}}>Criar Mercado</h1>
            <div style={{...s.card,maxWidth:'580px'}}>
              <form onSubmit={createMarket} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                <div>
                  <label style={s.label}>Pergunta</label>
                  <input style={s.input} type="text" value={newMarket.question} onChange={e=>setNewMarket({...newMarket,question:e.target.value})} required placeholder="Ex: Bitcoin vai subir?"/>
                </div>
                <div>
                  <label style={s.label}>Categoria</label>
                  <select style={s.input} value={newMarket.category} onChange={e=>setNewMarket({...newMarket,category:e.target.value})}>
                    {CATS.map(c=><option key={c} value={c} style={{background:'#1a1a1a'}}>{c}</option>)}
                  </select>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  <div>
                    <label style={s.label}>% SIM</label>
                    <input style={{...s.input,color:'#00c853'}} type="number" min="1" max="99" value={newMarket.yes_odds} onChange={e=>{setNewMarket({...newMarket,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))})}}/>
                  </div>
                  <div>
                    <label style={s.label}>% NAO</label>
                    <input style={{...s.input,color:'#ef4444'}} type="number" min="1" max="99" value={newMarket.no_odds} onChange={e=>{setNewMarket({...newMarket,no_odds:e.target.value,yes_odds:String(100-Number(e.target.value))})}}/>
                  </div>
                </div>
                <div>
                  <label style={s.label}>Data de encerramento</label>
                  <input style={s.input} type="datetime-local" value={newMarket.expires_at} onChange={e=>setNewMarket({...newMarket,expires_at:e.target.value})}/>
                </div>
                <div style={{background:'#2a2a2a',borderRadius:'8px',padding:'12px',display:'flex',justifyContent:'space-around'}}>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'10px',color:'#666',marginBottom:'3px'}}>Mult. SIM</p>
                    <p style={{fontSize:'18px',fontWeight:800,color:'#00c853'}}>{(100/Number(newMarket.yes_odds||1)).toFixed(2)}x</p>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'10px',color:'#666',marginBottom:'3px'}}>Mult. NAO</p>
                    <p style={{fontSize:'18px',fontWeight:800,color:'#ef4444'}}>{(100/Number(newMarket.no_odds||1)).toFixed(2)}x</p>
                  </div>
                </div>
                <button type="submit" style={{...s.btn,padding:'13px',fontSize:'14px',width:'100%'}}>CRIAR MERCADO</button>
              </form>
            </div>
          </div>
        )}

        {/* USUARIOS */}
        {tab==='users' && (
          <div>
            <h1 style={{fontSize:'20px',fontWeight:800,marginBottom:'20px'}}>Usuarios ({users.length})</h1>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a',borderRadius:'10px',overflow:'hidden'}}>
                <thead>
                  <tr>
                    {['Nome','Email','Tipo','Status','Cadastro','Acoes'].map(h=>(
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td style={{...s.td,fontWeight:500}}>{u.name}</td>
                      <td style={{...s.td,color:'#888'}}>{u.email}</td>
                      <td style={s.td}><span style={s.badge(u.is_admin?'resolved':'open')}>{u.is_admin?'Admin':'Usuario'}</span></td>
                      <td style={s.td}><span style={s.badge(u.status||'open')}>{u.status||'active'}</span></td>
                      <td style={{...s.td,color:'#888',fontSize:'11px'}}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                      <td style={s.td}>
                        <div style={{display:'flex',gap:'4px'}}>
                          <button onClick={()=>setEditUser({...u})} style={s.btnGray}>Editar</button>
                          <button onClick={()=>setBalanceModal({id:u.id,name:u.name,amount:'',note:''})} style={{...s.btn,padding:'5px 10px',fontSize:'11px'}}>Saldo</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FINANCEIRO */}
        {tab==='financeiro' && (
          <div>
            <h1 style={{fontSize:'20px',fontWeight:800,marginBottom:'20px'}}>Financeiro</h1>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a',borderRadius:'10px',overflow:'hidden'}}>
                <thead>
                  <tr>
                    {['Usuario','Tipo','Valor','Status','Data','Descricao'].map(h=>(
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t:any)=>(
                    <tr key={t.id}>
                      <td style={{...s.td,fontWeight:500}}>{t.name||'-'}</td>
                      <td style={s.td}><span style={s.badge(t.type==='deposit'?'open':t.type==='withdrawal'?'cancelled':'resolved')}>{t.type}</span></td>
                      <td style={{...s.td,fontWeight:600,color: t.type==='deposit'?'#00c853':'#ef4444'}}>R$ {Number(t.amount).toFixed(2)}</td>
                      <td style={s.td}><span style={s.badge(t.status==='completed'?'resolved':t.status==='pending'?'open':'cancelled')}>{t.status}</span></td>
                      <td style={{...s.td,color:'#888',fontSize:'11px'}}>{new Date(t.created_at).toLocaleDateString('pt-BR')}</td>
                      <td style={{...s.td,color:'#888',fontSize:'11px',maxWidth:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.description||'-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONFIGURACOES */}
        {tab==='configs' && (
          <div>
            <h1 style={{fontSize:'20px',fontWeight:800,marginBottom:'20px'}}>Configuracoes Globais</h1>
            <div style={{...s.card,maxWidth:'520px'}}>
              <form onSubmit={saveSettings} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                {[
                  {key:'taxa_vitoria',label:'Taxa de vitoria (%)'},
                  {key:'taxa_deposito',label:'Taxa de deposito (%)'},
                  {key:'taxa_saque',label:'Taxa de saque (%)'},
                  {key:'saque_minimo',label:'Saque minimo (R$)'},
                  {key:'saque_maximo',label:'Saque maximo (R$)'},
                  {key:'saque_diario',label:'Limite saque diario (R$)'},
                  {key:'rollover',label:'Rollover base (x)'},
                ].map(f=>(
                  <div key={f.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
                    <label style={{...s.label,marginBottom:0,flex:1}}>{f.label}</label>
                    <input style={{...s.input,width:'140px',color:'#00c853',fontWeight:700}} type="number" step="0.01" value={settings[f.key]||''} onChange={e=>setSettings({...settings,[f.key]:e.target.value})}/>
                  </div>
                ))}
                <button type="submit" style={{...s.btn,padding:'12px',fontSize:'14px',width:'100%',marginTop:'8px'}}>SALVAR CONFIGURACOES</button>
              </form>
            </div>
          </div>
        )}

        {/* AUDITORIA */}
        {tab==='audit' && (
          <div>
            <h1 style={{fontSize:'20px',fontWeight:800,marginBottom:'20px'}}>Log de Auditoria</h1>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a',borderRadius:'10px',overflow:'hidden'}}>
                <thead>
                  <tr>
                    {['Admin','Acao','Data','IP'].map(h=>(
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length===0?(
                    <tr><td colSpan={4} style={{textAlign:'center',padding:'32px',color:'#666'}}>Nenhum log ainda.</td></tr>
                  ):auditLogs.map((a:any)=>(
                    <tr key={a.id}>
                      <td style={{...s.td,fontWeight:500}}>{a.name||'-'}</td>
                      <td style={s.td}><span style={{background:'rgba(99,102,241,0.1)',color:'#818cf8',fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'4px'}}>{a.action}</span></td>
                      <td style={{...s.td,color:'#888',fontSize:'11px'}}>{new Date(a.created_at).toLocaleString('pt-BR')}</td>
                      <td style={{...s.td,color:'#888',fontSize:'11px'}}>{a.ip||'-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL EDITAR MERCADO */}
      {editMarket && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#1a1a1a',borderRadius:'12px',padding:'24px',width:'100%',maxWidth:'500px',border:'1px solid #333'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
              <h3 style={{fontSize:'16px',fontWeight:700}}>Editar Mercado</h3>
              <button onClick={()=>setEditMarket(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#888',fontSize:'20px'}}>×</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div><label style={s.label}>Pergunta</label><input style={s.input} value={editMarket.question} onChange={e=>setEditMarket({...editMarket,question:e.target.value})}/></div>
              <div><label style={s.label}>Categoria</label>
                <select style={s.input} value={editMarket.category||''} onChange={e=>setEditMarket({...editMarket,category:e.target.value})}>
                  {CATS.map(c=><option key={c} value={c} style={{background:'#1a1a1a'}}>{c}</option>)}
                </select>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div><label style={s.label}>% SIM</label><input style={{...s.input,color:'#00c853'}} type="number" min="1" max="99" value={editMarket.yes_odds} onChange={e=>setEditMarket({...editMarket,yes_odds:e.target.value,no_odds:100-Number(e.target.value)})}/></div>
                <div><label style={s.label}>% NAO</label><input style={{...s.input,color:'#ef4444'}} type="number" min="1" max="99" value={editMarket.no_odds} onChange={e=>setEditMarket({...editMarket,no_odds:e.target.value,yes_odds:100-Number(e.target.value)})}/></div>
              </div>
              <div><label style={s.label}>Data encerramento</label><input style={s.input} type="datetime-local" value={editMarket.expires_at?editMarket.expires_at.slice(0,16):''} onChange={e=>setEditMarket({...editMarket,expires_at:e.target.value})}/></div>
              <div><label style={s.label}>Status</label>
                <select style={s.input} value={editMarket.status} onChange={e=>setEditMarket({...editMarket,status:e.target.value})}>
                  {['open','suspended','resolved','cancelled'].map(s=><option key={s} value={s} style={{background:'#1a1a1a'}}>{s}</option>)}
                </select>
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                <button onClick={saveMarket} style={{...s.btn,flex:1,padding:'12px'}}>SALVAR</button>
                <button onClick={()=>setEditMarket(null)} style={{...s.btnGray,flex:1,padding:'12px'}}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR USUARIO */}
      {editUser && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#1a1a1a',borderRadius:'12px',padding:'24px',width:'100%',maxWidth:'480px',border:'1px solid #333'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
              <h3 style={{fontSize:'16px',fontWeight:700}}>Editar Usuario</h3>
              <button onClick={()=>setEditUser(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#888',fontSize:'20px'}}>×</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div><label style={s.label}>Nome</label><input style={s.input} value={editUser.name} onChange={e=>setEditUser({...editUser,name:e.target.value})}/></div>
              <div><label style={s.label}>Email</label><input style={s.input} value={editUser.email} onChange={e=>setEditUser({...editUser,email:e.target.value})}/></div>
              <div><label style={s.label}>Status</label>
                <select style={s.input} value={editUser.status||'active'} onChange={e=>setEditUser({...editUser,status:e.target.value})}>
                  {['active','blocked','suspended'].map(s=><option key={s} value={s} style={{background:'#1a1a1a'}}>{s}</option>)}
                </select>
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                <button onClick={saveUser} style={{...s.btn,flex:1,padding:'12px'}}>SALVAR</button>
                <button onClick={()=>setEditUser(null)} style={{...s.btnGray,flex:1,padding:'12px'}}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJUSTE DE SALDO */}
      {balanceModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#1a1a1a',borderRadius:'12px',padding:'24px',width:'100%',maxWidth:'400px',border:'1px solid #333'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
              <h3 style={{fontSize:'16px',fontWeight:700}}>Ajustar Saldo</h3>
              <button onClick={()=>setBalanceModal(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#888',fontSize:'20px'}}>×</button>
            </div>
            <p style={{fontSize:'13px',color:'#888',marginBottom:'16px'}}>Usuario: <strong style={{color:'#fff'}}>{balanceModal.name}</strong></p>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div>
                <label style={s.label}>Valor (negativo para remover)</label>
                <input style={s.input} type="number" step="0.01" placeholder="Ex: 100 ou -50" value={balanceModal.amount} onChange={e=>setBalanceModal({...balanceModal,amount:e.target.value})}/>
              </div>
              <div>
                <label style={s.label}>Motivo</label>
                <input style={s.input} placeholder="Ex: Bonus de boas-vindas" value={balanceModal.note} onChange={e=>setBalanceModal({...balanceModal,note:e.target.value})}/>
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                <button onClick={adjustBalance} style={{...s.btn,flex:1,padding:'12px'}}>AJUSTAR</button>
                <button onClick={()=>setBalanceModal(null)} style={{...s.btnGray,flex:1,padding:'12px'}}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACAO */}
      {confirm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#1a1a1a',borderRadius:'12px',padding:'24px',width:'100%',maxWidth:'400px',border:'1px solid #333',textAlign:'center'}}>
            <div style={{fontSize:'32px',marginBottom:'12px'}}>⚠️</div>
            <p style={{fontSize:'14px',marginBottom:'8px',lineHeight:1.5}}>{confirm.msg}</p>
            <p style={{fontSize:'12px',color:'#666',marginBottom:'20px'}}>Esta acao sera registrada na auditoria.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={async()=>{await confirm.action();setConfirm(null)}} style={{...s.btn,flex:1,padding:'12px'}}>CONFIRMAR</button>
              <button onClick={()=>setConfirm(null)} style={{...s.btnGray,flex:1,padding:'12px'}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
