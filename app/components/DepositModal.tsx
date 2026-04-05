'use client'
import { useState } from 'react'

export default function DepositModal({onClose, balance, setBalance, minDeposit, API}: {
  onClose: ()=>void
  balance: number
  setBalance: (fn:(b:number)=>number)=>void
  minDeposit: string
  API: string
}) {
  const [step, setStep] = useState<'amount'|'cpf'|'pix'>('amount')
  const [amount, setAmount] = useState<string>('')
  const [cpf, setCpf] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [pixCode, setPixCode] = useState<string>('')
  const [qrCodeImage, setQrCodeImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  const num = Number(amount) || 0
  const min = Number(minDeposit) || 10
  const QUICK = ['5','10','30','50','100']

  function formatCpf(v: string) {
    const d = v.replace(/\D/g,'').slice(0,11)
    if (d.length <= 3) return d
    if (d.length <= 6) return d.slice(0,3)+'.'+d.slice(3)
    if (d.length <= 9) return d.slice(0,3)+'.'+d.slice(3,6)+'.'+d.slice(6)
    return d.slice(0,3)+'.'+d.slice(3,6)+'.'+d.slice(6,9)+'-'+d.slice(9)
  }

  function formatPhone(v: string) {
    const d = v.replace(/\D/g,'').slice(0,11)
    if (d.length <= 2) return d.length ? '('+d : d
    if (d.length <= 7) return '('+d.slice(0,2)+') '+d.slice(2)
    return '('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7)
  }

  function goToCpf() {
    if (num < min) { setError(`Valor mínimo: R$ ${Number(min).toFixed(2).replace('.',',')}`) ; return }
    setError('')
    setStep('cpf')
  }

  async function requestDeposit() {
    const rawCpf   = cpf.replace(/\D/g,'')
    const rawPhone = phone.replace(/\D/g,'')
    if (rawCpf.length !== 11)  { setError('CPF inválido — informe os 11 dígitos'); return }
    if (rawPhone.length < 10)  { setError('Telefone inválido — informe DDD + número'); return }
    setError('')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API + '/api/wallet/deposit', {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Authorization':'Bearer '+(token||'')},
        body: JSON.stringify({ amount: num, cpf: rawCpf, phone: rawPhone })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar depósito')
      setPixCode(data.pix_code || data.qr_code || data.code || '')
      setQrCodeImage(data.qr_code_image || '')
      setStep('pix')
    } catch(e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function copyPix() {
    navigator.clipboard.writeText(pixCode).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500) }).catch(()=>{})
  }

  const inputBox = {display:'flex',alignItems:'center',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'10px',overflow:'hidden',transition:'border-color 0.15s, box-shadow 0.15s'} as React.CSSProperties
  const focusIn  = (e:React.FocusEvent<HTMLInputElement>) => { const w=e.target.parentElement as HTMLElement; w.style.borderColor='var(--primary)'; w.style.boxShadow='0 0 0 2px rgba(var(--primary-rgb, 0,230,118),0.15)' }
  const focusOut = (e:React.FocusEvent<HTMLInputElement>) => { const w=e.target.parentElement as HTMLElement; w.style.borderColor=''; w.style.boxShadow='' }

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:9999,
      background:'#0f0f0f',overflowY:'auto',
      WebkitOverflowScrolling:'touch' as any,
    }}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 20px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'3px',height:'22px',background:'var(--primary)',borderRadius:'2px',flexShrink:0}}/>
          <span style={{fontSize:'18px',fontWeight:800,color:'#fff',letterSpacing:'-0.01em'}}>Depositar</span>
        </div>
        <button onClick={onClose} style={{width:'32px',height:'32px',borderRadius:'50%',background:'var(--card)',border:'1px solid rgba(255,255,255,0.1)',color:'var(--muted-foreground)',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>
      </div>

      <p style={{margin:'10px 20px 0',fontSize:'12px',color:'var(--muted-foreground)'}}>
        Saldo atual: <span style={{color:'#fff',fontWeight:600}}>R$ {balance.toFixed(2).replace('.',',')}</span>
      </p>

      {/* Step 1: Valor */}
      {step === 'amount' && (
        <div style={{padding:'0 20px'}}>
          <div style={{marginTop:'20px',display:'flex',alignItems:'center',gap:'14px',background:'#161616',border:'1px solid var(--border)',borderRadius:'14px',padding:'14px 16px'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'10px',background:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M6.5 17.5L2 13l4.5-4.5 1.06 1.06L4.12 13l3.44 3.44L6.5 17.5z" fill="var(--primary)"/>
                <path d="M17.5 17.5l4.5-4.5-4.5-4.5-1.06 1.06L19.88 13l-3.44 3.44L17.5 17.5z" fill="var(--primary)"/>
                <path d="M10.07 17.01L8.5 15.44l4.93-4.93 1.57 1.57-4.93 4.93z" fill="var(--primary)"/>
                <path d="M13.93 6.99L15.5 8.56l-4.93 4.93-1.57-1.57 4.93-4.93z" fill="var(--primary)"/>
              </svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:'15px',fontWeight:700,color:'#fff',lineHeight:1.2}}>Pix</div>
              <div style={{fontSize:'11px',color:'var(--muted-foreground)',marginTop:'2px'}}>Depósito Real brasileiro</div>
            </div>
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'20px',padding:'4px 10px',fontSize:'11px',fontWeight:600,color:'var(--muted-foreground)',flexShrink:0}}>5 minutos</div>
          </div>

          <p style={{fontSize:'11px',color:'var(--muted-foreground)',margin:'18px 0 8px',fontWeight:500}}>Valor a ser depositado:</p>

          <div style={inputBox}>
            <span style={{padding:'0 14px',fontSize:'15px',fontWeight:700,color:'var(--muted-foreground)',borderRight:'1px solid var(--border)',height:'48px',display:'flex',alignItems:'center',flexShrink:0}}>R$</span>
            <input
              type="number" min={min} step="1" placeholder="0,00" value={amount}
              onChange={e=>{setAmount(e.target.value);setError('')}}
              style={{flex:1,padding:'0 14px',height:'48px',background:'transparent',border:'none',color:'#fff',fontSize:'18px',fontWeight:700,outline:'none',appearance:'none' as any}}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          <div style={{display:'flex',overflowX:'auto',gap:'8px',marginTop:'12px',paddingBottom:'2px',scrollbarWidth:'none' as any}}>
            {QUICK.map(v=>(
              <button key={v} onClick={()=>{setAmount(v);setError('')}} style={{
                padding:'7px 18px',borderRadius:'9999px',fontSize:'13px',fontWeight:700,cursor:'pointer',flexShrink:0,
                border:`1.5px solid ${amount===v?'var(--primary)':'rgba(var(--primary-rgb, 0,230,118),0.35)'}`,
                background:amount===v?'var(--primary)':'transparent',color:amount===v?'#000':'var(--primary)',transition:'all 0.12s',
              }}>R${v}</button>
            ))}
          </div>

          <p style={{fontSize:'11px',color:'var(--muted-foreground)',margin:'10px 0 0'}}>Depósito mínimo: R$ {Number(min).toFixed(2).replace('.',',')}</p>

          {error && (
            <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'10px',padding:'10px 14px',marginTop:'12px',textAlign:'center'}}>
              <p style={{color:'#ef4444',fontSize:'13px',fontWeight:600}}>{error}</p>
            </div>
          )}

          <button disabled={num < min} onClick={goToCpf}
            style={{marginTop:'20px',width:'100%',height:'52px',borderRadius:'10px',border:'none',background:num>=min?'var(--primary)':'#1e1e1e',color:num>=min?'#000':'#333',fontWeight:900,fontSize:'15px',letterSpacing:'0.04em',cursor:num>=min?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',boxShadow:num>=min?'0 0 24px rgba(var(--primary-rgb, 0,230,118),0.25)':'none',transition:'all 0.2s'}}
          >
            CONTINUAR
          </button>
        </div>
      )}

      {/* Step 2: CPF */}
      {step === 'cpf' && (
        <div style={{padding:'0 20px'}}>
          <div style={{marginTop:'24px',background:'#161616',border:'1px solid var(--border)',borderRadius:'14px',padding:'16px'}}>
            <p style={{fontSize:'13px',color:'#aaa',marginBottom:'4px'}}>Valor selecionado</p>
            <p style={{fontSize:'24px',fontWeight:900,color:'var(--primary)'}}>R$ {num.toFixed(2).replace('.',',')}</p>
          </div>

          <p style={{fontSize:'13px',color:'#fff',fontWeight:700,margin:'20px 0 6px'}}>Seus dados para o PIX</p>
          <p style={{fontSize:'11px',color:'var(--muted-foreground)',marginBottom:'12px'}}>Necessário para identificação do pagamento</p>

          <div style={inputBox}>
            <input
              type="text" placeholder="CPF: 000.000.000-00" value={cpf}
              onChange={e=>{ setCpf(formatCpf(e.target.value)); setError('') }}
              inputMode="numeric"
              style={{flex:1,padding:'0 16px',height:'52px',background:'transparent',border:'none',color:'#fff',fontSize:'18px',fontWeight:700,outline:'none',letterSpacing:'0.05em'}}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          <div style={{...inputBox, marginTop:'10px'}}>
            <input
              type="text" placeholder="Telefone: (11) 99999-9999" value={phone}
              onChange={e=>{ setPhone(formatPhone(e.target.value)); setError('') }}
              inputMode="numeric"
              style={{flex:1,padding:'0 16px',height:'52px',background:'transparent',border:'none',color:'#fff',fontSize:'18px',fontWeight:700,outline:'none',letterSpacing:'0.04em'}}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          {error && (
            <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'10px',padding:'10px 14px',marginTop:'12px',textAlign:'center'}}>
              <p style={{color:'#ef4444',fontSize:'13px',fontWeight:600}}>{error}</p>
            </div>
          )}

          <button disabled={loading} onClick={requestDeposit}
            style={{marginTop:'20px',width:'100%',height:'52px',borderRadius:'10px',border:'none',background:'var(--primary)',color:'#000',fontWeight:900,fontSize:'15px',cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',opacity:loading?0.7:1,transition:'all 0.2s'}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="5" y="5" width="4" height="4" rx="0.5" fill="currentColor"/>
              <rect x="15" y="5" width="4" height="4" rx="0.5" fill="currentColor"/>
              <rect x="5" y="15" width="4" height="4" rx="0.5" fill="currentColor"/>
              <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
              <rect x="17" y="13" width="2" height="2" fill="currentColor"/>
              <rect x="13" y="17" width="2" height="2" fill="currentColor"/>
              <rect x="17" y="17" width="4" height="4" rx="0.5" fill="currentColor"/>
            </svg>
            {loading ? 'Gerando PIX...' : 'GERAR QR CODE'}
          </button>

          <button onClick={()=>{ setStep('amount'); setError('') }} style={{width:'100%',padding:'13px',marginTop:'10px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'var(--muted-foreground)',fontWeight:600,fontSize:'13px',cursor:'pointer'}}>
            Voltar
          </button>
        </div>
      )}

      {/* Step 3: QR Code */}
      {step === 'pix' && (
        <div style={{padding:'0 20px'}}>
          <div style={{marginTop:'24px',textAlign:'center'}}>
            <div style={{width:'200px',height:'200px',borderRadius:'16px',margin:'0 auto 16px',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 40px rgba(var(--primary-rgb, 0,230,118),0.15)',overflow:'hidden'}}>
              {qrCodeImage
                ? <img src={qrCodeImage} alt="QR Code PIX" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                : <div style={{padding:'12px',textAlign:'center'}}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style={{opacity:0.3}}>
                      <rect x="3" y="3" width="8" height="8" rx="1" stroke="#333" strokeWidth="1.5"/>
                      <rect x="13" y="3" width="8" height="8" rx="1" stroke="#333" strokeWidth="1.5"/>
                      <rect x="3" y="13" width="8" height="8" rx="1" stroke="#333" strokeWidth="1.5"/>
                    </svg>
                    <div style={{fontSize:'9px',color:'#666',fontWeight:700,marginTop:'4px'}}>USE O CÓDIGO ABAIXO</div>
                  </div>
              }
            </div>
            <p style={{fontSize:'13px',color:'var(--muted-foreground)',marginBottom:'6px'}}>Valor: <span style={{color:'#fff',fontWeight:700}}>R$ {num.toFixed(2).replace('.',',')}</span></p>
            <p style={{fontSize:'11px',color:'#555',marginBottom:'16px'}}>Escaneie o QR ou copie o código PIX</p>
          </div>

          {pixCode && (
            <div style={{background:'#161616',borderRadius:'12px',padding:'14px 16px',border:'1px solid var(--border)',marginBottom:'12px'}}>
              <p style={{fontSize:'9px',color:'var(--muted-foreground)',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'6px'}}>CÓDIGO PIX COPIA E COLA</p>
              <p style={{fontSize:'11px',color:'#ccc',wordBreak:'break-all',fontFamily:'monospace',lineHeight:1.5}}>{pixCode}</p>
            </div>
          )}

          {pixCode && (
            <button onClick={copyPix} style={{width:'100%',padding:'15px',borderRadius:'12px',border:'none',background:copied?'rgba(var(--primary-rgb, 0,230,118),0.15)':'var(--primary)',color:copied?'var(--primary)':'#000',fontWeight:900,fontSize:'15px',cursor:'pointer',marginBottom:'10px',outline:copied?'1px solid rgba(var(--primary-rgb, 0,230,118),0.4)':'none',transition:'all 0.2s'}}>
              {copied ? '✓ CÓDIGO COPIADO!' : 'COPIAR CÓDIGO PIX'}
            </button>
          )}

          <button onClick={onClose} style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'var(--muted-foreground)',fontWeight:600,fontSize:'13px',cursor:'pointer'}}>
            Fechar
          </button>
          <p style={{fontSize:'10px',color:'#444',textAlign:'center',marginTop:'12px'}}>O saldo será creditado automaticamente após a confirmação do pagamento</p>
        </div>
      )}

      <div style={{height:'40px'}}/>
    </div>
  )
}
