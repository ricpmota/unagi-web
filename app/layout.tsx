import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import HeaderWithMenu from '../components/HeaderWithMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Unagi',
  description: 'Unagi - Previsão de Jogos',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <HeaderWithMenu />
        {children}
      </body>
    </html>
  )
} 