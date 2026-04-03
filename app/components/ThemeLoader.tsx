'use client'
import { useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

export default function ThemeLoader() {
  useEffect(() => {
    fetch(API + '/api/admin/branding')
      .then(r => r.json())
      .then(d => {
        if (d.theme_colors) {
          try {
            const colors: Record<string, string> = JSON.parse(d.theme_colors)
            Object.entries(colors).forEach(([k, v]) =>
              document.documentElement.style.setProperty(k, v)
            )
          } catch {}
        }
      })
      .catch(() => {})
  }, [])
  return null
}
