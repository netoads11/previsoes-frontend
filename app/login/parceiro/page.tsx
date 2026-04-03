'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, TrendingUp, Users, DollarSign, Briefcase } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

export default function LoginParceiro() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      try {
        const u = JSON.parse(user)
        if (u.role === 'manager') { router.push('/dashboard/gerente'); return }
        if (u.role === 'affiliate') { router.push('/dashboard/afiliado'); return }
      } catch {}
    }
    fetch(API + '/api/admin/branding')
      .then(r => r.json())
      .then(d => { if (d.logo_url) setLogoUrl(API + d.logo_url) })
      .catch(() => {})
  }, [])

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const role = data.user?.role
      if (role !== 'manager' && role !== 'affiliate') {
        throw new Error('Esta área é exclusiva para parceiros (gerentes e afiliados).')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (role === 'manager') router.push('/dashboard/gerente')
      else router.push('/dashboard/afiliado')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const green = '#6ADD00'
  const greenGlow = 'rgba(106,221,0,0.35)'
  const greenBg = 'rgba(106,221,0,0.1)'
  const greenBorder = 'rgba(106,221,0,0.2)'

  function Logo({ size = 36 }: { size?: number }) {
    if (logoUrl) return (
      <img src={logoUrl} alt="logo" style={{ height: size + 'px', maxWidth: '160px', objectFit: 'contain' }}
        onError={() => setLogoUrl('')} />
    )
    return (
      <div style={{ width: size + 'px', height: size + 'px', borderRadius: '8px', background: green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${greenGlow}`, flexShrink: 0 }}>
        <TrendingUp size={Math.round(size * 0.45)} color="#000" strokeWidth={2.5} />
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0d0d0d}
        .pc{display:flex;min-height:100vh;background:#0d0d0d;font-family:'Inter',system-ui,sans-serif}
        .pl{flex:1;background:linear-gradient(135deg,#0a0a0a 0%,#0d1a00 50%,#0a0f00 100%);display:flex;flex-direction:column;justify-content:space-between;padding:48px;position:relative;overflow:hidden}
        .pr{width:480px;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;padding:48px;border-left:1px solid rgba(255,255,255,0.06)}
        input{font-family:'Inter',system-ui,sans-serif}
        .inp{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:13px 13px 13px 40px;color:#fff;font-size:14px;outline:none;transition:border-color 0.2s}
        .inp:focus{border-color:rgba(106,221,0,0.5)}
        .inp-r{padding:13px 40px}
        .btn{width:100%;padding:15px;border-radius:10px;border:none;cursor:pointer;background:#6ADD00;color:#0a0a0a;font-weight:800;font-size:15px;font-family:'Inter',system-ui,sans-serif;box-shadow:0 0 24px rgba(106,221,0,0.35);transition:opacity 0.2s}
        .btn:disabled{opacity:0.7;cursor:not-allowed}
        .stat-card{display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px}
        @media(max-width:768px){
          .pl{display:none}
          .pr{width:100%;padding:40px 24px;border-left:none;justify-content:flex-start;padding-top:60px}
        }
      `}</style>

      <div className="pc">
        {/* LEFT */}
        <div className="pl">
          <div style={{position:'absolute',top:'-80px',right:'-80px',width:'320px',height:'320px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.15) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'260px',height:'260px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>

          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',position:'relative'}}>
            <Logo size={36} />
            {!logoUrl && <span style={{color:'#fff',fontWeight:700,fontSize:'18px'}}>Previmarket</span>}
            <span style={{marginLeft:'4px',padding:'2px 8px',borderRadius:'6px',background:greenBg,border:`1px solid ${greenBorder}`,color:green,fontSize:'11px',fontWeight:600}}>Parceiros</span>
          </div>

          {/* Hero */}
          <div style={{position:'relative'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:greenBg,border:`1px solid ${greenBorder}`,borderRadius:'20px',padding:'6px 14px',marginBottom:'24px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:green}}/>
              <span style={{color:green,fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>Área exclusiva</span>
            </div>
            <h1 style={{fontSize:'40px',fontWeight:800,color:'#fff',lineHeight:1.2,marginBottom:'16px',fontFamily:"'Manrope',sans-serif"}}>
              SEU PAINEL<br/>DE PARCEIRO<br/>
              <span style={{color:green,textShadow:`0 0 30px ${greenGlow}`}}>PREVIMARKET</span>
            </h1>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'15px',lineHeight:1.6,maxWidth:'360px'}}>
              Acompanhe seus indicados, gerencie comissões e maximize seus ganhos em tempo real.
            </p>

            <div style={{display:'flex',flexDirection:'column',gap:'10px',marginTop:'40px',maxWidth:'340px'}}>
              {[
                {icon:Users,label:'Indicados',desc:'Acompanhe todos os usuários captados'},
                {icon:DollarSign,label:'Comissões em tempo real',desc:'RevShare creditado a cada depósito aprovado'},
                {icon:Briefcase,label:'Painel do gerente',desc:'Gerencie seus afiliados e defina comissões'},
              ].map(({icon:Icon,label,desc})=>(
                <div key={label} className="stat-card">
                  <div style={{width:'34px',height:'34px',borderRadius:'8px',background:greenBg,border:`1px solid ${greenBorder}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Icon size={16} color={green}/>
                  </div>
                  <div>
                    <p style={{color:'#fff',fontWeight:600,fontSize:'13px'}}>{label}</p>
                    <p style={{color:'rgba(255,255,255,0.4)',fontSize:'11px',marginTop:'1px'}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={{color:'rgba(255,255,255,0.2)',fontSize:'12px',position:'relative'}}>© 2026 Previmarket — Área de Parceiros</p>
        </div>

        {/* RIGHT */}
        <div className="pr">
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'32px'}}>
            <Logo size={30} />
            {!logoUrl && <span style={{color:'#fff',fontWeight:700,fontSize:'15px'}}>Previmarket</span>}
            <span style={{padding:'2px 7px',borderRadius:'5px',background:greenBg,border:`1px solid ${greenBorder}`,color:green,fontSize:'10px',fontWeight:600}}>Parceiros</span>
          </div>

          <div style={{marginBottom:'28px'}}>
            <h2 style={{fontSize:'26px',fontWeight:800,color:'#fff',marginBottom:'6px',fontFamily:"'Manrope',sans-serif"}}>Bem-vindo, parceiro!</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'14px'}}>Acesse seu painel de gerente ou afiliado</p>
          </div>

          {error && (
            <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'12px 16px',marginBottom:'20px',color:'#f87171',fontSize:'14px',lineHeight:1.4}}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div>
              <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu@email.com" className="inp"/>
              </div>
            </div>
            <div>
              <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Senha</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Sua senha" className="inp inp-r"/>
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'13px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',padding:0}}>
                  {showPass?<EyeOff style={{width:'15px',height:'15px'}}/>:<Eye style={{width:'15px',height:'15px'}}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn" style={{marginTop:'6px'}}>
              {loading ? 'Entrando...' : 'ENTRAR NO PAINEL'}
            </button>
          </form>

          <div style={{marginTop:'28px',padding:'16px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'10px'}}>
            <p style={{color:'rgba(255,255,255,0.35)',fontSize:'12px',lineHeight:1.6,textAlign:'center'}}>
              Esta área é exclusiva para <strong style={{color:'rgba(255,255,255,0.6)'}}>gerentes e afiliados</strong> cadastrados.<br/>
              Jogador? <a href="/login" style={{color:green,fontWeight:600,textDecoration:'none'}}>Acesse aqui</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
