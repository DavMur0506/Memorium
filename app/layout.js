import './globals.css'
import { Inter } from 'next/font/google'
import { MapPin, Plus } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Memorium',
  description: 'Descubre y comparte historias geolocalizadas de tu comunidad',
  manifest: '/manifest.json',
  themeColor: '#8b5cf6',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Memoria Colectiva" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  )
}