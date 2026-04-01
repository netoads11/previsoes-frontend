'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BottomNav from '../components/BottomNav'

export default function ComoFunciona() {
  const router = useRouter()
  const [faq, setFaq] = useState<number|null>(null)
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const refs = useRef<{[k:string]:HTMLDivElement|null}>({})

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(p => new Set([...p, e.target.getAttribute('data-id')||''])) })
    }, { threshold: 0.15 })
    Object.values(refs.current).forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const reg = (id: string) => (el: HTMLDivElement|null) => { refs.current[id] = el; if (el) el.setAttribute('data-id', id) }
  const anim = (id: string, delay = 0) => ({
    opacity: visible.has(id) ? 1 : 0,
    transform: visible.has(id) ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  })

  const faqs = [
    { q: 'Preciso ter 18 anos para usar a plataforma?', a: 'Sim. A plataforma é exclusiva para maiores de 18 anos.' },
    { q: 'Como funciona o pagamento?', a: 'Depósitos e saques são feitos via PIX, de forma rápida e segura.' },
    { q: 'O que acontece se o mercado for cancelado?', a: 'Se um mercado for cancelado, o valor investido é devolvido integralmente para sua carteira.' },
    { q: 'Quanto tempo leva para sacar?', a: 'Saques são processados em até 24 horas úteis após aprovação.' },
    { q: 'Posso perder dinheiro?', a: 'Sim. Previsões envolvem risco. Nunca invista mais do que pode perder.' },
    { q: 'Como as odds funcionam?', a: 'As odds refletem a probabilidade de um evento acontecer. Quanto maior a odd, maior o retorno potencial — e o risco.' },
  ]

  const steps = [
    { n:1, title:'Escolha seu mercado', desc:'Navegue pelas categorias (Esportes, Política, Social, Crypto, etc.) e encontre um evento que você tem opinião sobre o resultado.', emoji:'🔍' },
    { n:2, title:'Escolha sua previsão: SIM ou NÃO', desc:'Cada mercado tem uma pergunta binária. Você só precisa decidir: aquele evento vai acontecer (SIM) ou não vai (NÃO)?', emoji:'🤔' },
    { n:3, title:'Invista na sua intuição', desc:'Coloque um valor a partir de R$1 na opção que você acredita.', emoji:'💰' },
    { n:4, title:'Aguarde o evento acontecer', desc:'Acompanhe o mercado e veja as odds mudarem conforme mais pessoas fazem suas previsões.', emoji:'⏳' },
    { n:5, title:'Receba sua recompensa', desc:'Se sua intuição estiver correta, você recebe o valor investido multiplicado pela odd.', emoji:'🏆' },
  ]

  const cats = [
    { name:'Esportes', desc:'Preveja sobre futebol, basquete, tênis e outros esportes!', tags:['Copa do Mundo','Brasileirao','Champions League'], bg:'linear-gradient(135deg,#1a0a00,#2d1500)', emoji:'⚽', accent:'#f97316' },
    { name:'Crypto', desc:'Preveja sobre Bitcoin, Ethereum e outras moedas digitais!', tags:['Bitcoin','Ethereum','Tokens'], bg:'linear-gradient(135deg,#0a0a1a,#0d0d2d)', emoji:'₿', accent:'#f59e0b' },
    { name:'Política', desc:'Preveja sobre eleições e decisões políticas!', tags:['Eleições','Governadores','Senadores'], bg:'linear-gradient(135deg,#0a001a,#1a0028)', emoji:'🏛️', accent:'#a855f7' },
    { name:'E-Sports', desc:'Preveja sobre competições de videogames!', tags:['CBLOL','League of Legends','CS:GO'], bg:'linear-gradient(135deg,#00111a,#00202e)', emoji:'🎮', accent:'#06b6d4' },
    { name:'Social', desc:'Preveja sobre programas de TV, celebridades e internet!', tags:['BBB','Celebridades','Eventos'], bg:'linear-gradient(135deg,#1a001a,#2d0028)', emoji:'📱', accent:'#ec4899' },
    { name:'Fast Markets', desc:'Mercados que fecham muito rápido! Previsões em horas ou dias.', tags:['Curto prazo','Diários','Rápidos'], bg:'linear-gradient(135deg,#001a0a,#002d14)', emoji:'⚡', accent:'#6ADD00' },
  ]

  return (
    <div style={{background:'#000',minHeight:'100vh',color:'#fff',fontFamily:'Kanit,sans-serif',paddingBottom:'80px'}}>
      <style>{`
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-10px) rotate(-6deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(3deg)} 50%{transform:translateY(-14px) rotate(3deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(-2deg)} }
        .step-card:hover { border-color: rgba(106,221,0,0.4) !important; transform: translateY(-4px); }
        .cat-card:hover { transform: translateY(-6px) scale(1.02); }
        .faq-row:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* TICKER */}
      <div style={{background:'#0a0a0a',borderBottom:'1px solid #111',overflow:'hidden',height:'32px',display:'flex',alignItems:'center'}}>
        <div style={{display:'flex',gap:'40px',animation:'ticker 30s linear infinite',whiteSpace:'nowrap'}}>
          {[...Array(2)].map((_,rep)=>(
            <span key={rep} style={{display:'flex',gap:'40px'}}>
              {[{l:'BTC/BRL',v:'R$ 87.420',c:true},{l:'ETH/BRL',v:'R$ 2.024',c:true},{l:'USD/BRL',v:'R$ 5,24',c:false},{l:'EUR/BRL',v:'R$ 6,03',c:false},{l:'Mercados',v:'12',c:true}].map(t=>(
                <span key={t.l} style={{fontSize:'11px',color:'#555'}}>
                  <span style={{color:'#444',marginRight:'6px'}}>{t.l}</span>
                  <span style={{color:t.c?'#6ADD00':'#f87171',fontWeight:600}}>{t.v}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 24px',borderBottom:'1px solid #111',position:'sticky',top:0,background:'rgba(0,0,0,0.95)',backdropFilter:'blur(10px)',zIndex:50}}>
        <button onClick={()=>router.push('/')} style={{display:'flex',alignItems:'center',gap:'8px',background:'none',border:'none',cursor:'pointer'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'#6ADD00',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#000',fontWeight:800,fontSize:'14px'}}>P</span>
          </div>
          <span style={{color:'#fff',fontWeight:700,fontSize:'16px'}}>Previmarket</span>
        </button>
        <div style={{display:'flex',gap:'8px'}}>
          <Link href="/" style={{padding:'7px 16px',borderRadius:'8px',border:'1px solid #222',color:'#aaa',fontSize:'13px',textDecoration:'none',fontWeight:500}}>Mercados</Link>
          <Link href="/cadastrar" style={{padding:'7px 16px',borderRadius:'8px',background:'#6ADD00',color:'#000',fontSize:'13px',textDecoration:'none',fontWeight:700}}>Criar conta</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{textAlign:'center',padding:'100px 24px 80px',background:'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(106,221,0,0.08) 0%,transparent 70%)'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(106,221,0,0.1)',border:'1px solid rgba(106,221,0,0.3)',borderRadius:'20px',padding:'5px 16px',marginBottom:'24px',animation:'fadeUp 0.6s ease'}}>
          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#6ADD00',animation:'pulse 2s infinite'}}/>
          <span style={{color:'#6ADD00',fontSize:'12px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}}>GUIA COMPLETO</span>
        </div>
        <h1 style={{fontSize:'clamp(28px,5vw,56px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:'20px',animation:'fadeUp 0.6s ease 100ms both'}}>
          Aprenda Tudo Sobre o<br/>
          <span style={{color:'#6ADD00'}}>Mercado de Previsões</span>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:'16px',maxWidth:'500px',margin:'0 auto 36px',lineHeight:1.7,animation:'fadeUp 0.6s ease 200ms both'}}>
          Um guia super fácil de entender sobre previsões de mercado. Aprenda como funcionam as odds, as categorias, as taxas e comece a fazer suas primeiras previsões!
        </p>
        <a href="#como-funciona" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#6ADD00',color:'#000',fontWeight:800,fontSize:'15px',padding:'14px 32px',borderRadius:'12px',textDecoration:'none',animation:'fadeUp 0.6s ease 300ms both',boxShadow:'0 0 32px rgba(106,221,0,0.4)'}}>
          Começar a Aprender →
        </a>
      </section>

      {/* O QUE É */}
      <section style={{maxWidth:'1100px',margin:'0 auto',padding:'80px 24px'}}>
        <div ref={reg('oq')} style={anim('oq')}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'32px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#6ADD00',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{color:'#000',fontWeight:900,fontSize:'18px'}}>?</span>
            </div>
            <h2 style={{fontSize:'32px',fontWeight:900,color:'#fff'}}>O que é?</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'60px',alignItems:'start'}}>
            <div>
              <p style={{color:'rgba(255,255,255,0.7)',fontSize:'16px',lineHeight:1.8,marginBottom:'20px'}}>
                Imagina você dentro de uma plataforma onde <strong style={{color:'#6ADD00'}}>tudo é possível</strong>, onde você pode prever qualquer tipo de acontecimento. Bom, você acabou de achar.
              </p>
              <div style={{borderLeft:'3px solid #6ADD00',paddingLeft:'16px',marginBottom:'20px'}}>
                <p style={{color:'rgba(255,255,255,0.6)',fontSize:'15px',lineHeight:1.8}}>
                  É um lugar na internet onde você pode fazer previsões sobre coisas que vão acontecer no futuro e ganhar dinheiro se acertar. De modo binário, apenas dizendo <strong style={{color:'#fff'}}>SIM ou NÃO</strong> se aquele evento irá ocorrer.
                </p>
              </div>
            </div>
            <div>
              <p style={{fontSize:'11px',color:'#555',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'12px'}}>EXEMPLOS DE PREVISÕES QUE VOCÊ PODE FAZER:</p>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {['🍼  Neymar vai ter outro filho em 2026?','⚽  Qual time de futebol terá o maior número de visitantes em estádios em 2026?','💍  Virgínia e Vini Jr irão anunciar casamento em 2026?','🗳️  Quem irá ganhar a eleição no Brasil?'].map((ex,i)=>(
                  <div key={i} style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'12px 16px',fontSize:'14px',color:'rgba(255,255,255,0.7)'}}>
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* FANOUT CARDS */}
          <div style={{position:'relative',height:'280px',marginTop:'60px',display:'flex',justifyContent:'center',alignItems:'center'}}>
            {[
              {q:'Qual time de futebol terá o maior número de visitantes em estádios em 2026?',yes:69,color:'#16a34a',delay:0,rot:-10,left:-180,anim:'float'},
              {q:'Neymar vai ter outro filho em 2026?',yes:69,color:'#16a34a',delay:0.5,rot:-3,left:-60,anim:'float2'},
              {q:'Quem irá ganhar a eleição no Brasil?',yes:69,color:'#16a34a',delay:1,rot:5,left:60,anim:'float3'},
              {q:'Virgínia e Vini Jr irão anunciar casamento em 2026?',yes:31,color:'#dc2626',delay:1.5,rot:12,left:180,anim:'float'},
            ].map((c,i)=>(
              <div key={i} style={{position:'absolute',width:'200px',background:'#111',borderRadius:'14px',border:'1px solid #222',padding:'14px',transform:`rotate(${c.rot}deg) translateX(${c.left}px)`,boxShadow:'0 8px 32px rgba(0,0,0,0.6)',animation:`${c.anim} ${3+i*0.5}s ease-in-out infinite ${c.delay}s`}}>
                <div style={{height:'80px',background:'linear-gradient(135deg,#1a1a1a,#0a0a0a)',borderRadius:'8px',marginBottom:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}}>
                  {['⚽','👶','🗳️','💍'][i]}
                </div>
                <p style={{fontSize:'11px',color:'#fff',fontWeight:600,lineHeight:1.4,marginBottom:'8px'}}>{c.q}</p>
                <div style={{display:'flex',gap:'1px',height:'4px',borderRadius:'2px',overflow:'hidden',marginBottom:'8px'}}>
                  <div style={{flex:c.yes,background:'#16a34a'}}/>
                  <div style={{flex:100-c.yes,background:'#dc2626'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px'}}>
                  <div style={{background:'#16a34a',borderRadius:'6px',padding:'5px',textAlign:'center',fontSize:'11px',fontWeight:700,color:'#fff'}}>✓ Sim</div>
                  <div style={{background:'#dc2626',borderRadius:'6px',padding:'5px',textAlign:'center',fontSize:'11px',fontWeight:700,color:'#fff'}}>✕ Não</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA - 5 PASSOS */}
      <section id="como-funciona" style={{background:'#050505',padding:'80px 24px'}}>
        <div ref={reg('cf')} style={{...anim('cf'),maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'60px'}}>
            <h2 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:900,color:'#fff',marginBottom:'10px'}}>Como Funciona a Plataforma</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'15px'}}>Em 5 passos simples você entende todo o processo</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
            {steps.map((s,i)=>(
              <div key={s.n} ref={reg('s'+i)} style={{...anim('s'+i, i*100), background:'#111',border:'1px solid #1a1a1a',borderRadius:'14px',padding:'24px',transition:'border-color 0.2s, transform 0.2s'}} className="step-card">
                <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#6ADD00',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'16px',color:'#000',marginBottom:'16px'}}>{s.n}</div>
                <h3 style={{fontSize:'16px',fontWeight:700,color:'#fff',marginBottom:'10px'}}>{s.title}</h3>
                <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginBottom:'16px'}}>{s.desc}</p>
                <div style={{height:'100px',background:'linear-gradient(135deg,#0a0a0a,#111)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px',border:'1px solid #1a1a1a'}}>
                  {s.emoji}
                </div>
              </div>
            ))}
            <div style={{background:'linear-gradient(135deg,rgba(106,221,0,0.08),rgba(106,221,0,0.03))',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'14px',padding:'24px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',gap:'12px'}}>
              <div style={{fontSize:'40px'}}>🎯</div>
              <p style={{color:'rgba(255,255,255,0.6)',fontSize:'14px',lineHeight:1.6}}>Simples assim! Você prevê, investe e torce pelo seu palpite.</p>
              <Link href="/cadastrar" style={{background:'#6ADD00',color:'#000',fontWeight:800,fontSize:'13px',padding:'10px 20px',borderRadius:'8px',textDecoration:'none'}}>Começar agora →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={{padding:'80px 24px'}}>
        <div ref={reg('cats')} style={{...anim('cats'),maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'50px'}}>
            <h2 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:900,color:'#fff',marginBottom:'10px'}}>As Diferentes Categorias</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'15px'}}>Escolha o tema que você mais domina</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
            {cats.map((c,i)=>(
              <div key={c.name} ref={reg('cat'+i)} style={{...anim('cat'+i, i*80), background:c.bg, border:'1px solid #1a1a1a', borderRadius:'14px', overflow:'hidden', transition:'transform 0.25s', cursor:'default'}} className="cat-card">
                <div style={{height:'140px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'60px',background:'rgba(255,255,255,0.03)',borderBottom:'1px solid #1a1a1a'}}>
                  {c.emoji}
                </div>
                <div style={{padding:'20px'}}>
                  <h3 style={{fontSize:'17px',fontWeight:700,color:c.accent,marginBottom:'8px'}}>{c.name}</h3>
                  <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',lineHeight:1.6,marginBottom:'14px'}}>{c.desc}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {c.tags.map(t=>(
                      <span key={t} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'20px',padding:'3px 10px',fontSize:'11px',color:'rgba(255,255,255,0.5)'}}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TAXAS */}
      <section style={{background:'#050505',padding:'80px 24px'}}>
        <div ref={reg('tax')} style={{...anim('tax'),maxWidth:'700px',margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(22px,3vw,36px)',fontWeight:900,color:'#fff',marginBottom:'8px'}}>Informações Importantes sobre seu Dinheiro</h2>
          <div style={{height:'2px',width:'60px',background:'#6ADD00',marginBottom:'32px'}}/>
          <h3 style={{fontSize:'18px',fontWeight:700,color:'#fff',marginBottom:'8px'}}>Somos uma corretora, não uma casa de apostas</h3>
          <div style={{height:'2px',width:'40px',background:'#6ADD00',marginBottom:'20px'}}/>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'15px',lineHeight:1.8,marginBottom:'12px'}}>
            Antes de falar sobre taxas, é importante você entender: <strong style={{color:'#fff'}}>a nossa plataforma não lucra quando você perde</strong>.
          </p>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'15px',lineHeight:1.8,marginBottom:'40px'}}>
            Nós operamos como uma <strong style={{color:'#fff'}}>corretora de mercados preditivos</strong>. Nosso papel é ser o intermediário que garante que tudo funcione de forma justa.
          </p>
          <h3 style={{fontSize:'18px',fontWeight:700,color:'#fff',marginBottom:'8px'}}>Quais são as taxas?</h3>
          <div style={{height:'2px',width:'40px',background:'#6ADD00',marginBottom:'20px'}}/>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'36px'}}>
            {[{l:'Taxa de Depósito',v:'2%'},{l:'Taxa de Vitória',v:'0.36%'},{l:'Taxa de Saque',v:'2%'}].map(t=>(
              <div key={t.l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#111',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'16px 20px'}}>
                <span style={{fontWeight:600,fontSize:'15px',color:'#fff'}}>{t.l}</span>
                <span style={{background:'rgba(106,221,0,0.1)',border:'1px solid rgba(106,221,0,0.2)',color:'#6ADD00',fontWeight:700,fontSize:'14px',padding:'4px 12px',borderRadius:'8px'}}>{t.v}</span>
              </div>
            ))}
          </div>
          <h3 style={{fontSize:'18px',fontWeight:700,color:'#fff',marginBottom:'8px'}}>Valores mínimos para começar</h3>
          <div style={{height:'2px',width:'40px',background:'#6ADD00',marginBottom:'16px'}}/>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'15px',marginBottom:'8px'}}>Depósito mínimo: <strong style={{color:'#fff'}}>R$ 1,00</strong></p>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'15px'}}>Previsão mínima: <strong style={{color:'#fff'}}>R$ 1,00</strong></p>
        </div>
      </section>

      {/* DICAS */}
      <section style={{padding:'80px 24px'}}>
        <div ref={reg('dicas')} style={{...anim('dicas'),maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'50px'}}>
            <h2 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:900,color:'#fff',marginBottom:'10px'}}>Dicas Importantes</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'15px'}}>O que fazer e o que evitar para ter sucesso</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            <div style={{background:'rgba(22,163,74,0.05)',border:'1px solid rgba(22,163,74,0.2)',borderRadius:'14px',padding:'28px'}}>
              <h3 style={{color:'#4ade80',fontSize:'17px',fontWeight:700,marginBottom:'20px'}}>O que FAZER</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                {[
                  ['Comece pequeno','Coloque pouco dinheiro no início para aprender'],
                  ['Estude antes de apostar','Leia notícias sobre o assunto'],
                  ['Diversifique','Não coloque todo seu dinheiro em uma previsão'],
                  ['Acompanhe os mercados','Veja como as odds mudam'],
                  ['Tenha paciência','Nem sempre você vai ganhar na primeira'],
                ].map(([b,d])=>(
                  <div key={b} style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                    <span style={{color:'#4ade80',fontWeight:700,fontSize:'14px',flexShrink:0,marginTop:'2px'}}>✓</span>
                    <p style={{fontSize:'14px',color:'rgba(255,255,255,0.7)',lineHeight:1.6}}><strong style={{color:'#fff'}}>{b}</strong> - {d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'rgba(220,38,38,0.05)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:'14px',padding:'28px'}}>
              <h3 style={{color:'#f87171',fontSize:'17px',fontWeight:700,marginBottom:'20px'}}>O que NÃO FAZER</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                {[
                  ['Não coloque dinheiro que você não pode perder','Isso é importante!'],
                  ['Não aposte por emoção','Pense com a cabeça, não com o coração'],
                  ['Não tente recuperar perdas rápido','Isso geralmente piora as coisas'],
                  ['Não ignore as notícias','Estude antes de fazer previsões'],
                  ['Não coloque tudo em um único mercado','Distribua seu dinheiro'],
                ].map(([b,d])=>(
                  <div key={b} style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                    <span style={{color:'#f87171',fontWeight:700,fontSize:'14px',flexShrink:0,marginTop:'2px'}}>✕</span>
                    <p style={{fontSize:'14px',color:'rgba(255,255,255,0.7)',lineHeight:1.6}}><strong style={{color:'#fff'}}>{b}</strong> - {d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{background:'#050505',padding:'80px 24px'}}>
        <div ref={reg('faq')} style={{...anim('faq'),maxWidth:'700px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'50px'}}>
            <h2 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:900,color:'#fff',marginBottom:'10px'}}>Perguntas Frequentes</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'15px'}}>Tire suas dúvidas sobre a plataforma</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {faqs.map((f,i)=>(
              <div key={i} style={{background:'#111',border:`1px solid ${faq===i?'rgba(106,221,0,0.3)':'#1a1a1a'}`,borderRadius:'12px',overflow:'hidden',transition:'border-color 0.2s'}}>
                <button onClick={()=>setFaq(faq===i?null:i)} className="faq-row" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 20px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left',gap:'12px',transition:'background 0.15s'}}>
                  <span style={{fontSize:'15px',fontWeight:600,color:'#fff'}}>{f.q}</span>
                  <span style={{color:'#6ADD00',fontSize:'18px',flexShrink:0,transition:'transform 0.2s',display:'block',transform:faq===i?'rotate(45deg)':'rotate(0deg)'}}>+</span>
                </button>
                {faq===i&&(
                  <div style={{padding:'0 20px 18px',borderTop:'1px solid #1a1a1a'}}>
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',lineHeight:1.7,marginTop:'14px'}}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESUMO RÁPIDO */}
      <section style={{padding:'80px 24px'}}>
        <div ref={reg('res')} style={{...anim('res'),maxWidth:'900px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'50px'}}>
            <h2 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:900,color:'#fff'}}>Resumo Rápido</h2>
          </div>
          <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'14px',overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',background:'#0a0a0a',padding:'12px 20px',borderBottom:'1px solid #1a1a1a'}}>
              <span style={{fontSize:'11px',fontWeight:700,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em'}}>ASPECTO</span>
              <span style={{fontSize:'11px',fontWeight:700,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em'}}>DESCRIÇÃO</span>
            </div>
            {[
              ['O que é','Plataforma para fazer previsões sobre eventos reais e ganhar dinheiro se acertar'],
              ['Como funciona','Você escolhe SIM ou NÃO, coloca dinheiro e ganha se acertar'],
              ['Categorias','Esportes, Criptomoedas, Política, E-Sports, Social, Mercados Rápidos'],
              ['Depósito mínimo','R$ 1,00'],
              ['Previsão mínima','R$ 1,00'],
              ['Taxa de Depósito','2%'],
              ['Taxa de Vitória','0.36% (cobrada apenas ao ganhar)'],
              ['Taxa de Saque','2%'],
              ['Idade mínima','18 anos'],
              ['Risco','Você pode perder o dinheiro que colocou'],
            ].map(([a,d],i)=>(
              <div key={a} style={{display:'grid',gridTemplateColumns:'1fr 2fr',padding:'14px 20px',borderBottom:i<9?'1px solid #1a1a1a':'none',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                <span style={{fontSize:'14px',fontWeight:600,color:'#fff'}}>{a}</span>
                <span style={{fontSize:'14px',color:'rgba(255,255,255,0.5)'}}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{padding:'80px 24px',textAlign:'center',background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(106,221,0,0.06) 0%,transparent 70%)'}}>
        <div ref={reg('cta')} style={anim('cta')}>
          <h2 style={{fontSize:'clamp(24px,4vw,44px)',fontWeight:900,color:'#fff',marginBottom:'16px'}}>Pronto para Começar?</h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'16px',maxWidth:'440px',margin:'0 auto 40px',lineHeight:1.7}}>
            Agora que você entendeu como funciona a nossa plataforma, é hora de começar a fazer suas primeiras previsões!
          </p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'16px',flexWrap:'wrap'}}>
            <Link href="/cadastrar" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#6ADD00',color:'#000',fontWeight:800,fontSize:'15px',padding:'14px 32px',borderRadius:'12px',textDecoration:'none',boxShadow:'0 0 32px rgba(106,221,0,0.35)'}}>
              Acessar →
            </Link>
            <div style={{background:'rgba(255,179,0,0.08)',border:'1px solid rgba(255,179,0,0.2)',borderRadius:'10px',padding:'12px 20px',maxWidth:'360px'}}>
              <p style={{fontSize:'12px',color:'#ffb300',lineHeight:1.5,textAlign:'left'}}>
                ⚠️ Lembre-se: Apostar é divertido, mas sempre há risco. Nunca coloque dinheiro que você não pode perder!
              </p>
            </div>
          </div>
        </div>
      </section>

      <BottomNav active="mercados"/>
    </div>
  )
}
