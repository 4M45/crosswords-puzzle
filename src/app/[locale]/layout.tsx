import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import '../globals.css'

const nunito = Nunito({ 
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito'
})

export const metadata: Metadata = {
  title: 'Crossword Generator | Create Printable Puzzles',
  description: 'Generate unlimited, high-quality printable crossword puzzles in multiple languages instantly.',
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <html lang={locale}>
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
