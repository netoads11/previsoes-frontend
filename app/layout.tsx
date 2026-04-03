import type { Metadata } from 'next'
import './globals.css'
import ThemeLoader from './components/ThemeLoader'

export const metadata: Metadata = {
  title: 'Previmarket - Mercado de Previsoes',
  description: 'Aposte em eventos reais com dinheiro real via PIX',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeLoader/>
        {children}
      </body>
    </html>
  )
}
