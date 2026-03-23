import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-green-400">Previsões.cc</h1>
        <div className="flex gap-4">
          <Link href="/explorar" className="text-gray-400 hover:text-white">Explorar</Link>
          <Link href="/login" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium">Entrar</Link>
        </div>
      </nav>
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Preveja o futuro.<br/>Ganhe dinheiro.</h2>
        <p className="text-gray-400 text-xl mb-10">Aposte em eventos reais com dinheiro real via PIX. Simples, rápido e transparente.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/cadastrar" className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-lg text-lg font-bold">Criar conta grátis</Link>
          <Link href="/explorar" className="border border-gray-600 hover:border-gray-400 px-8 py-4 rounded-lg text-lg">Ver mercados</Link>
        </div>
      </section>
    </main>
  )
}
