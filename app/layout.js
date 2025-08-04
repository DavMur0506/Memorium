// app/layout.js
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import { headers } from "next/headers";
import { MobileProvider } from '@/contexts/MobileContext';
import { isMobileUserAgent } from "@/utils/isMobile";
export const metadata = {
  title: 'Memorium - Descubre historias cerca de ti',
  description: 'Comparte y descubre memorias de lugares especiales',
}

export default function RootLayout({ children }) {
   const userAgent = headers().get("user-agent") || "";
  const isMobile = isMobileUserAgent(userAgent);
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <MobileProvider>
            {children}
          </MobileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}