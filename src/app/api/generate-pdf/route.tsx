import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { CrosswordDocument } from '@/components/pdf/CrosswordDocument'
import { PrismaClient } from '@prisma/client'

let prismaClient: PrismaClient | null = null
function getPrisma() {
  if (!prismaClient) prismaClient = new PrismaClient()
  return prismaClient
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type') // 'free' or 'pro'

  if (!id) return new Response('Missing ID', { status: 400 })

  // 1. Fetch puzzle data
  const localizedData = await getPrisma().localizedPuzzle.findUnique({
    where: { id },
    include: {
      puzzle: {
        include: { theme: { include: { translations: true } } }
      },
      words: true
    }
  })

  if (!localizedData) return new Response('Not Found', { status: 404 })

  const isPro = type === 'pro'
  // In a real app, you would check authentication/subscription status here for `isPro`
  
  const translation = localizedData.puzzle.theme.translations.find(t => t.locale === localizedData.locale)

  // 2. Stream PDF generation
  const stream = await renderToStream(
    <CrosswordDocument 
      title={translation?.title || 'Crossword'}
      gridWidth={localizedData.puzzle.gridWidth}
      gridHeight={localizedData.puzzle.gridHeight}
      words={localizedData.words}
      isPro={isPro}
      showAnswers={false}
    />
  )

  // 3. Return as a downloadable file
  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${localizedData.puzzle.theme.slug || 'puzzle'}-${isPro ? 'pro' : 'free'}.pdf"`,
    }
  })
}
