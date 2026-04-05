'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, Phone, X, ArrowRight } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

export default function Cadastrar() {
  const router = useRouter()
  const [step, setStep]         = useState<1|2>(1)
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [refCode, setRefCode]   = useState('')
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (localStorage.getItem('token')) { router.push('/'); return }
    const p = new URLSearchParams(window.location.search)
    const r = p.get('ref')
    if (r) setRefCode(r.toUpperCase())
  }, [])

  function fmtPhone(v: string) {
    const d = v.replace(/\D/g,'').slice(0,11)
    if (d.length <= 2) return d.length ? '('+d : d
    if (d.length <= 7) return '('+d.slice(0,2)+') '+d.slice(2)
    return '('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7)
  }

  function goStep2() {
    if (!name.trim()) { setError('Informe seu nome completo'); return }
    setError('')
    setStep(2)
    setTimeout(() => emailRef.current?.focus(), 100)
  }

  async function handleCadastro(e: any) {
    e.preventDefault()
    if (password !== confirm) { setError('As senhas não coincidem'); return }
    if (password.length < 8)  { setError('Senha deve ter no mínimo 8 caracteres'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(API + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.replace(/\D/g,'') || undefined,
          email,
          password,
          ...(refCode ? { ref: refCode } : {})
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width:'100%', background:'rgba(255,255,255,0.06)',
    border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px',
    padding:'13px 13px 13px 40px', color:'#fff', fontSize:'14px',
    outline:'none', fontFamily:'Kanit,sans-serif', boxSizing:'border-box'
  }
  const fo = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor='rgba(106,221,0,0.5)'
  const bl = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor='rgba(255,255,255,0.1)'

  return (
    <>
      <style>{`
        .auth-wrap { display:flex; min-height:100vh; background:#0d0d0d; font-family:Kanit,sans-serif; }
        .auth-panel-l {
          flex:1; background:linear-gradient(135deg,#0a0a0a 0%,#0d1a00 50%,#0a0f00 100%);
          display:flex; flex-direction:column; justify-content:space-between;
          padding:48px; position:relative; overflow:hidden;
        }
        .auth-panel-r {
          width:480px; flex-shrink:0; display:flex; flex-direction:column;
          justify-content:center; padding:48px;
          border-left:1px solid rgba(255,255,255,0.06); overflow-y:auto;
        }
        @media(max-width:768px){
          .auth-wrap{ flex-direction:column; }
          .auth-panel-l{ display:none; }
          .auth-panel-r{ width:100%; padding:40px 24px; border-left:none; justify-content:flex-start; padding-top:56px; }
        }
      `}</style>

      <div className="auth-wrap">
        <button onClick={()=>router.push('/')}
          style={{position:'fixed',top:'16px',right:'16px',width:'36px',height:'36px',borderRadius:'50%',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',zIndex:50}}>
          <X style={{width:'18px',height:'18px',color:'#fff'}}/>
        </button>

        {/* ── Left ── */}
        <div className="auth-panel-l">
          <div style={{position:'absolute',top:'-80px',right:'-80px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.15) 0%,transparent 70%)'}}/>
          <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'250px',height:'250px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.08) 0%,transparent 70%)'}}/>
          <div style={{display:'flex',alignItems:'center',gap:'10px',position:'relative'}}>
            <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(106,221,0,0.5)'}}>
              <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'16px'}}>P</span>
            </div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'18px'}}>Previmarket</span>
          </div>
          <div style={{position:'relative'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(106,221,0,0.1)',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'20px',padding:'6px 14px',marginBottom:'24px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--primary)'}}/>
              <span style={{color:'var(--primary)',fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>Plataforma ao vivo</span>
            </div>
            <h1 style={{fontSize:'40px',fontWeight:800,color:'#fff',lineHeight:1.2,marginBottom:'16px',textTransform:'uppercase'}}>
              PREVEJA O<br/>
              <span style={{color:'var(--primary)',textShadow:'0 0 30px rgba(106,221,0,0.4)'}}>FUTURO</span><br/>
              E GANHE
            </h1>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'16px',lineHeight:1.6,maxWidth:'360px'}}>
              Aposte em eventos reais com dinheiro real via PIX.
            </p>
            <div style={{display:'flex',gap:'32px',marginTop:'40px'}}>
              {[{label:'Mercados ativos',value:'100+'},{label:'Usuários',value:'5k+'},{label:'Pagamentos',value:'R$1M+'}].map(s=>(
                <div key={s.label}>
                  <div style={{fontSize:'22px',fontWeight:800,color:'#fff',marginBottom:'4px'}}>{s.value}</div>
                  <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{color:'rgba(255,255,255,0.2)',fontSize:'12px',position:'relative'}}>© 2026 Previmarket</p>
        </div>

        {/* ── Right ── */}
        <div className="auth-panel-r">

          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'28px'}}>
            <div style={{width:'30px',height:'30px',borderRadius:'7px',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'13px'}}>P</span>
            </div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'16px'}}>Previmarket</span>
          </div>

          {/* Step pills */}
          <div style={{display:'flex',alignItems:'center',gap:'0',marginBottom:'28px'}}>
            {[{n:1,label:'Perfil'},{n:2,label:'Acesso'}].map((s,i)=>(
              <div key={s.n} style={{display:'flex',alignItems:'center',gap:'0',flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <div style={{
                    width:'28px',height:'28px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'12px',fontWeight:800,flexShrink:0,
                    background: step===s.n ? 'var(--primary)' : step>s.n ? 'rgba(106,221,0,0.15)' : 'rgba(255,255,255,0.06)',
                    color: step===s.n ? '#000' : step>s.n ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                    border: step>s.n ? '1.5px solid rgba(106,221,0,0.4)' : 'none',
                    transition:'all 0.3s'
                  }}>
                    {step>s.n
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : s.n}
                  </div>
                  <span style={{fontSize:'12px',fontWeight:600,color:step===s.n?'#fff':'rgba(255,255,255,0.3)',transition:'color 0.3s'}}>{s.label}</span>
                </div>
                {i<1 && <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.08)',margin:'0 12px'}}/>}
              </div>
            ))}
          </div>

          {/* Heading */}
          <div style={{marginBottom:'24px'}}>
            <h2 style={{fontSize:'24px',fontWeight:800,color:'#fff',marginBottom:'4px'}}>
              {step===1 ? 'Crie sua conta!' : 'Quase lá!'}
            </h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>
              {step===1 ? 'Passo 1 de 2 — Como podemos te chamar?' : 'Passo 2 de 2 — Defina seu acesso'}
            </p>
          </div>

          {refCode && (
            <div style={{background:'rgba(106,221,0,0.08)',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'8px',padding:'10px 14px',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{color:'var(--primary)',fontSize:'13px'}}>Indicado por: <strong>{refCode}</strong></span>
            </div>
          )}

          {error && (
            <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'12px 16px',marginBottom:'16px',color:'#f87171',fontSize:'14px'}}>
              {error}
            </div>
          )}

          {/* ── STEP 1: Nome + Telefone ── */}
          {step === 1 && (
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Nome completo</label>
                <div style={{position:'relative'}}>
                  <User style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                  <input type="text" value={name} onChange={e=>{setName(e.target.value);setError('')}} autoFocus
                    placeholder="Seu nome completo" style={inp} onFocus={fo} onBlur={bl}
                    onKeyDown={e=>e.key==='Enter'&&goStep2()}/>
                </div>
              </div>

              <div>
                <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>
                  Telefone com DDD <span style={{color:'rgba(255,255,255,0.2)',fontWeight:400}}>(opcional)</span>
                </label>
                <div style={{position:'relative'}}>
                  <Phone style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                  <input type="text" value={phone} onChange={e=>{setPhone(fmtPhone(e.target.value));setError('')}}
                    placeholder="(11) 99999-9999" inputMode="numeric" style={inp} onFocus={fo} onBlur={bl}
                    onKeyDown={e=>e.key==='Enter'&&goStep2()}/>
                </div>
              </div>

              <button onClick={goStep2} style={{
                width:'100%',padding:'15px',borderRadius:'10px',border:'none',
                background:'var(--primary)',color:'#0a0a0a',fontWeight:800,fontSize:'15px',
                fontFamily:'Kanit,sans-serif',cursor:'pointer',letterSpacing:'0.02em',
                boxShadow:'0 0 24px rgba(106,221,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
                marginTop:'4px'
              }}>
                CONTINUAR
                <ArrowRight style={{width:'18px',height:'18px'}}/>
              </button>

              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.06)'}}/>
                <span style={{color:'rgba(255,255,255,0.3)',fontSize:'13px'}}>ou</span>
                <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.06)'}}/>
              </div>

              <p style={{textAlign:'center',color:'rgba(255,255,255,0.4)',fontSize:'14px',margin:0}}>
                Já tem uma conta?{' '}
                <Link href="/login" style={{color:'var(--primary)',fontWeight:600,textDecoration:'none'}}>Entrar</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: Email + Senha + Confirmar ── */}
          {step === 2 && (
            <form onSubmit={handleCadastro} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {/* Resumo step 1 */}
              <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{fontSize:'13px',fontWeight:700,color:'#fff',margin:0}}>{name}</p>
                  {phone && <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:'2px 0 0'}}>{phone}</p>}
                </div>
                <button type="button" onClick={()=>{setStep(1);setError('')}}
                  style={{fontSize:'12px',color:'var(--primary)',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:'Kanit,sans-serif',padding:0}}>
                  editar
                </button>
              </div>

              <div>
                <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Email</label>
                <div style={{position:'relative'}}>
                  <Mail style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                  <input ref={emailRef} type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('')}} required
                    placeholder="exemplo@gmail.com" style={inp} onFocus={fo} onBlur={bl}/>
                </div>
              </div>

              <div>
                <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Senha</label>
                <div style={{position:'relative'}}>
                  <Lock style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                  <input type={showPass?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('')}}
                    required minLength={8} placeholder="Mínimo 8 caracteres"
                    style={{...inp,paddingRight:'40px'}} onFocus={fo} onBlur={bl}/>
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    style={{position:'absolute',right:'13px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',padding:0,display:'flex'}}>
                    {showPass?<EyeOff style={{width:'15px',height:'15px'}}/>:<Eye style={{width:'15px',height:'15px'}}/>}
                  </button>
                </div>
              </div>

              <div>
                <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Confirmar senha</label>
                <div style={{position:'relative'}}>
                  <Lock style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                  <input type={showConf?'text':'password'} value={confirm} onChange={e=>{setConfirm(e.target.value);setError('')}}
                    required placeholder="Repita a senha"
                    style={{...inp,paddingRight:'40px',borderColor:confirm&&confirm!==password?'rgba(239,68,68,0.5)':undefined}}
                    onFocus={fo} onBlur={bl}/>
                  <button type="button" onClick={()=>setShowConf(!showConf)}
                    style={{position:'absolute',right:'13px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',padding:0,display:'flex'}}>
                    {showConf?<EyeOff style={{width:'15px',height:'15px'}}/>:<Eye style={{width:'15px',height:'15px'}}/>}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p style={{fontSize:'11px',color:'#f87171',marginTop:'4px',margin:'4px 0 0'}}>As senhas não coincidem</p>
                )}
              </div>

              <button type="submit" disabled={loading||(!!confirm&&confirm!==password)} style={{
                width:'100%',padding:'15px',borderRadius:'10px',border:'none',
                cursor:(loading||(!!confirm&&confirm!==password))?'not-allowed':'pointer',
                background:'var(--primary)',color:'#0a0a0a',fontWeight:800,fontSize:'15px',
                fontFamily:'Kanit,sans-serif',boxShadow:'0 0 24px rgba(106,221,0,0.35)',
                opacity:(loading||(!!confirm&&confirm!==password))?0.6:1,
                letterSpacing:'0.02em',transition:'opacity 0.2s',marginTop:'4px'
              }}>
                {loading ? 'Criando conta...' : 'CRIAR CONTA'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
