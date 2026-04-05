'use client'
import { useState, useRef, useEffect } from 'react'
import { CreditCard } from 'lucide-react'

export default function DepositModal({onClose, balance, setBalance, minDeposit, API}: {
  onClose: ()=>void
  balance: number
  setBalance: (fn:(b:number)=>number)=>void
  minDeposit: string
  API: string
}) {
  const [step, setStep]             = useState<'amount'|'cpf'|'pix'|'done'>('amount')
  const [amount, setAmount]         = useState('')
  const [cpf, setCpf]               = useState('')
  const [txId, setTxId]             = useState('')
  const [pixCode, setPixCode]       = useState('')
  const [qrCodeImage, setQrCodeImage] = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [copied, setCopied]         = useState(false)
  const pollRef = useRef<any>(null)

  const num = Number(amount) || 0
  const min = Number(minDeposit) || 10
  const QUICK = ['5','10','30','50','100']

  function fmtCpf(v: string) {
    const d = v.replace(/\D/g,'').slice(0,11)
    if (d.length <= 3) return d
    if (d.length <= 6) return d.slice(0,3)+'.'+d.slice(3)
    if (d.length <= 9) return d.slice(0,3)+'.'+d.slice(3,6)+'.'+d.slice(6)
    return d.slice(0,3)+'.'+d.slice(3,6)+'.'+d.slice(6,9)+'-'+d.slice(9)
  }

  async function openCpfPopup() {
    if (num < min) { setError(`Valor mínimo: R$ ${min.toFixed(2).replace('.',',')}`) ; return }
    setError('')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const r = await fetch(API + '/api/auth/me', { headers: { 'Authorization': 'Bearer ' + (token||'') } })
      if (r.ok) {
        const u = await r.json()
        if (u.cpf) { setCpf(u.cpf); await generatePix(u.cpf); return }
      }
    } catch {}
    setLoading(false)
    setStep('cpf')
  }

  async function generatePix(cpfValue: string) {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API + '/api/wallet/deposit', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':'Bearer '+(token||'')},
        body: JSON.stringify({ amount: num, cpf: cpfValue.replace(/\D/g,'') })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar depósito')
      setPixCode(data.pix_code || '')
      setQrCodeImage(data.qr_code_image || '')
      setTxId(data.id || '')
      setStep('pix')
      pollRef.current = setInterval(async () => {
        try {
          const t = localStorage.getItem('token')
          const r = await fetch(API + '/api/wallet/transaction/' + data.id + '/status', { headers: { 'Authorization': 'Bearer '+(t||'') } })
          const d = await r.json()
          if (d.status === 'completed') { clearInterval(pollRef.current); setBalance((b:number) => b+num); setStep('done') }
        } catch {}
      }, 5000)
    } catch(e:any) {
      setError(e.message)
      setStep('cpf')
    } finally {
      setLoading(false)
    }
  }

  async function requestDeposit() {
    const raw = cpf.replace(/\D/g,'')
    if (raw.length !== 11) { setError('CPF inválido — informe os 11 dígitos'); return }
    setError('')
    await generatePix(raw)
  }

  function copyPix() {
    navigator.clipboard.writeText(pixCode)
      .then(()=>{ setCopied(true); setTimeout(()=>setCopied(false), 2500) })
      .catch(()=>{})
  }

  return (
    <>
      {/* Fundo escuro da tela cheia */}
      <div style={{position:'fixed',inset:0,zIndex:9999,background:'#0d0d0d',overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 20px 0'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'3px',height:'22px',background:'var(--primary)',borderRadius:'2px'}}/>
            <span style={{fontSize:'18px',fontWeight:800,color:'#fff',letterSpacing:'-0.01em'}}>Depositar</span>
          </div>
          <button onClick={onClose} style={{width:'32px',height:'32px',borderRadius:'50%',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>

        <p style={{margin:'10px 20px 0',fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>
          Saldo atual: <span style={{color:'#fff',fontWeight:600}}>R$ {balance.toFixed(2).replace('.',',')}</span>
        </p>

        {/* ── Tela de valor ── */}
        {step !== 'pix' && (
          <div style={{padding:'0 20px'}}>
            <div style={{marginTop:'20px',display:'flex',alignItems:'center',gap:'14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',padding:'14px 16px'}}>
              <div style={{width:'44px',height:'44px',borderRadius:'10px',background:'rgba(var(--primary-rgb,106,221,0),0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6.5 17.5L2 13l4.5-4.5 1.06 1.06L4.12 13l3.44 3.44L6.5 17.5z" fill="var(--primary)"/>
                  <path d="M17.5 17.5l4.5-4.5-4.5-4.5-1.06 1.06L19.88 13l-3.44 3.44L17.5 17.5z" fill="var(--primary)"/>
                  <path d="M10.07 17.01L8.5 15.44l4.93-4.93 1.57 1.57-4.93 4.93z" fill="var(--primary)"/>
                  <path d="M13.93 6.99L15.5 8.56l-4.93 4.93-1.57-1.57 4.93-4.93z" fill="var(--primary)"/>
                </svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:'14px',fontWeight:700,color:'#fff'}}>PIX</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>Crédito imediato após confirmação</div>
              </div>
              <div style={{background:'rgba(var(--primary-rgb,106,221,0),0.1)',border:'1px solid rgba(var(--primary-rgb,106,221,0),0.2)',borderRadius:'20px',padding:'4px 10px',fontSize:'11px',fontWeight:600,color:'var(--primary)'}}>Instantâneo</div>
            </div>

            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',margin:'20px 0 8px',fontWeight:500}}>Valor a depositar</p>

            <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',overflow:'hidden',transition:'border-color 0.15s'}}>
              <span style={{padding:'0 14px',fontSize:'15px',fontWeight:700,color:'rgba(255,255,255,0.4)',borderRight:'1px solid rgba(255,255,255,0.08)',height:'52px',display:'flex',alignItems:'center',flexShrink:0}}>R$</span>
              <input type="number" min={min} step="1" placeholder="0,00" value={amount}
                onChange={e=>{setAmount(e.target.value);setError('')}}
                style={{flex:1,padding:'0 14px',height:'52px',background:'transparent',border:'none',color:'#fff',fontSize:'22px',fontWeight:800,outline:'none',appearance:'none' as any}}
                onFocus={e=>{const p=e.target.parentElement as HTMLElement;p.style.borderColor='rgba(var(--primary-rgb,106,221,0),0.5)'}}
                onBlur={e=>{const p=e.target.parentElement as HTMLElement;p.style.borderColor='rgba(255,255,255,0.1)'}}
              />
            </div>

            <div style={{display:'flex',gap:'8px',marginTop:'12px',overflowX:'auto',paddingBottom:'2px',scrollbarWidth:'none' as any}}>
              {QUICK.map(v=>(
                <button key={v} onClick={()=>{setAmount(v);setError('')}} style={{
                  padding:'7px 16px',borderRadius:'9999px',fontSize:'13px',fontWeight:700,cursor:'pointer',flexShrink:0,
                  border:`1.5px solid ${amount===v?'var(--primary)':'rgba(var(--primary-rgb,106,221,0),0.3)'}`,
                  background:amount===v?'var(--primary)':'transparent',
                  color:amount===v?'#000':'var(--primary)',transition:'all 0.12s',
                }}>R${v}</button>
              ))}
            </div>

            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',margin:'10px 0 0'}}>
              Depósito mínimo: R$ {min.toFixed(2).replace('.',',')}
            </p>

            {error && (
              <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'10px',padding:'10px 14px',marginTop:'14px'}}>
                <p style={{color:'#f87171',fontSize:'13px',fontWeight:600,margin:0}}>{error}</p>
              </div>
            )}

            <button disabled={num < min || loading} onClick={openCpfPopup} style={{
              marginTop:'24px',width:'100%',height:'52px',borderRadius:'10px',border:'none',
              background:num>=min?'var(--primary)':'rgba(255,255,255,0.06)',
              color:num>=min?'#000':'rgba(255,255,255,0.2)',
              fontWeight:900,fontSize:'15px',letterSpacing:'0.04em',
              cursor:(num>=min&&!loading)?'pointer':'not-allowed',
              opacity:loading?0.7:1,
              boxShadow:num>=min?'0 0 24px rgba(var(--primary-rgb,106,221,0),0.3)':'none',
              transition:'all 0.2s',fontFamily:'Kanit,sans-serif'
            }}>
              {loading ? 'Aguarde...' : `DEPOSITAR R$ ${num > 0 ? num.toFixed(2).replace('.',',') : '—'}`}
            </button>
          </div>
        )}

        {/* ── Tela QR Code ── */}
        {step === 'pix' && (
          <div style={{padding:'0 20px'}}>
            <div style={{marginTop:'24px',textAlign:'center'}}>
              <div style={{width:'210px',height:'210px',borderRadius:'16px',margin:'0 auto 16px',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 50px rgba(var(--primary-rgb,106,221,0),0.2)',overflow:'hidden',padding:'8px'}}>
                {qrCodeImage
                  ? <img src={qrCodeImage} alt="QR Code PIX" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                  : <div style={{textAlign:'center',padding:'16px'}}>
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" style={{opacity:0.2}}>
                        <rect x="3" y="3" width="8" height="8" rx="1" stroke="#333" strokeWidth="1.5"/>
                        <rect x="13" y="3" width="8" height="8" rx="1" stroke="#333" strokeWidth="1.5"/>
                        <rect x="3" y="13" width="8" height="8" rx="1" stroke="#333" strokeWidth="1.5"/>
                      </svg>
                      <p style={{fontSize:'10px',color:'#666',fontWeight:700,marginTop:'6px'}}>USE O CÓDIGO ABAIXO</p>
                    </div>
                }
              </div>
              <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(var(--primary-rgb,106,221,0),0.1)',border:'1px solid rgba(var(--primary-rgb,106,221,0),0.2)',borderRadius:'20px',padding:'5px 12px',marginBottom:'12px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--primary)',animation:'pulse 2s ease-in-out infinite'}}/>
                <span style={{fontSize:'12px',color:'var(--primary)',fontWeight:600}}>Aguardando pagamento</span>
              </div>
              <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>
                Valor: <span style={{color:'#fff',fontWeight:700}}>R$ {num.toFixed(2).replace('.',',')}</span>
              </p>
            </div>

            {pixCode && (
              <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'12px',padding:'14px 16px',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'12px',marginTop:'12px'}}>
                <p style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'8px'}}>CÓDIGO PIX COPIA E COLA</p>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.6)',wordBreak:'break-all',fontFamily:'monospace',lineHeight:1.6,margin:0}}>{pixCode.slice(0,80)}...</p>
              </div>
            )}

            {pixCode && (
              <button onClick={copyPix} style={{
                width:'100%',padding:'15px',borderRadius:'12px',border:'none',
                background:copied?'rgba(var(--primary-rgb,106,221,0),0.12)':'var(--primary)',
                color:copied?'var(--primary)':'#000',fontWeight:900,fontSize:'15px',cursor:'pointer',
                marginBottom:'10px',outline:copied?'1px solid rgba(var(--primary-rgb,106,221,0),0.4)':'none',
                transition:'all 0.2s',fontFamily:'Kanit,sans-serif',
                display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'
              }}>
                {copied
                  ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>CÓDIGO COPIADO!</>
                  : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/></svg>COPIAR CÓDIGO PIX</>
                }
              </button>
            )}

            <button onClick={onClose} style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.08)',background:'transparent',color:'rgba(255,255,255,0.4)',fontWeight:600,fontSize:'13px',cursor:'pointer',fontFamily:'Kanit,sans-serif'}}>
              Fechar
            </button>
            <p style={{fontSize:'10px',color:'rgba(255,255,255,0.2)',textAlign:'center',marginTop:'12px',lineHeight:1.5}}>
              O saldo será creditado automaticamente após a confirmação do pagamento
            </p>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          </div>
        )}

        {/* ── Tela de sucesso ── */}
        {step === 'done' && (
          <div style={{padding:'0 20px',textAlign:'center',paddingTop:'48px'}}>
            <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'rgba(var(--primary-rgb,106,221,0),0.15)',border:'2px solid var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 style={{fontSize:'22px',fontWeight:900,color:'#fff',marginBottom:'8px'}}>Pagamento confirmado!</h3>
            <p style={{fontSize:'15px',color:'rgba(255,255,255,0.5)',marginBottom:'4px'}}>
              <span style={{color:'var(--primary)',fontWeight:800,fontSize:'22px'}}>+R$ {num.toFixed(2).replace('.',',')}</span>
            </p>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',marginBottom:'36px'}}>já disponível na sua carteira</p>
            <button onClick={onClose} style={{width:'100%',padding:'17px',borderRadius:'14px',border:'none',background:'var(--primary)',color:'#000',fontWeight:900,fontSize:'16px',cursor:'pointer',boxShadow:'0 0 28px rgba(var(--primary-rgb,106,221,0),0.35)',fontFamily:'Kanit,sans-serif'}}>
              APOSTAR AGORA
            </button>
          </div>
        )}

        <div style={{height:'40px'}}/>
      </div>

      {/* ── Pop-up CPF (overlay centralizado) ── */}
      {step === 'cpf' && (
        <div style={{position:'fixed',inset:0,zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}>
          <div style={{width:'100%',maxWidth:'360px',background:'#161616',borderRadius:'20px',padding:'28px 24px',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'0 24px 60px rgba(0,0,0,0.6)'}}>

            {/* Header popup */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
              <div>
                <h3 style={{fontSize:'17px',fontWeight:800,color:'#fff',margin:0}}>Confirmar identidade</h3>
                <p style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',margin:'4px 0 0'}}>Necessário para o pagamento PIX</p>
              </div>
              <button onClick={()=>{setStep('amount');setError('')}} style={{width:'30px',height:'30px',borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)',fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>
            </div>

            {/* Resumo valor */}
            <div style={{background:'rgba(var(--primary-rgb,106,221,0),0.06)',border:'1px solid rgba(var(--primary-rgb,106,221,0),0.15)',borderRadius:'10px',padding:'10px 14px',marginBottom:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>Depósito</span>
              <span style={{fontSize:'18px',fontWeight:900,color:'var(--primary)'}}>R$ {num.toFixed(2).replace('.',',')}</span>
            </div>

            {/* Input CPF */}
            <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px',fontWeight:500}}>CPF</label>
            <div style={{position:'relative',marginBottom:'8px'}}>
              <CreditCard style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
              <input
                type="text" placeholder="000.000.000-00" value={cpf} inputMode="numeric" autoFocus
                onChange={e=>{setCpf(fmtCpf(e.target.value));setError('')}}
                onKeyDown={e=>e.key==='Enter'&&requestDeposit()}
                style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'13px 13px 13px 40px',color:'#fff',fontSize:'16px',fontWeight:700,outline:'none',fontFamily:'Kanit,sans-serif',letterSpacing:'0.04em',boxSizing:'border-box' as any}}
                onFocus={e=>e.target.style.borderColor='rgba(var(--primary-rgb,106,221,0),0.5)'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}
              />
            </div>

            {error && (
              <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'8px',padding:'8px 12px',marginBottom:'8px'}}>
                <p style={{color:'#f87171',fontSize:'12px',fontWeight:600,margin:0}}>{error}</p>
              </div>
            )}

            <button disabled={loading} onClick={requestDeposit} style={{
              marginTop:'12px',width:'100%',height:'50px',borderRadius:'10px',border:'none',
              background:'var(--primary)',color:'#000',fontWeight:900,fontSize:'15px',
              cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,
              fontFamily:'Kanit,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
              boxShadow:'0 0 20px rgba(var(--primary-rgb,106,221,0),0.3)',transition:'opacity 0.2s'
            }}>
              {loading
                ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{animation:'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#000" strokeWidth="3" strokeLinecap="round"/></svg>Gerando PIX...</>
                : 'GERAR QR CODE'
              }
            </button>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      )}
    </>
  )
}
