import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PrismaClient } from '@prisma/client'

// Example Prisma instantiation (in a real app, use a singleton lib/prisma.ts)
const prisma = new PrismaClient()

type Props = {
  params: { locale: string; slug: string }
}

// 1. Dynamic SEO Metadata Injection (Hreflang & Canonical handling)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params

  const theme = await prisma.theme.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { locale }
      }
    }
  })

  const translation = theme?.translations[0]
  if (!translation) return {}

  return {
    title: translation.metaTitle,
    description: translation.metaDescription,
    alternates: {
      canonical: `https://crosswordspuzzle.com/${locale}/printables/${slug}`,
      languages: {
        en: `https://crosswordspuzzle.com/en/printables/${slug}`,
        es: `https://crosswordspuzzle.com/es/imprimibles/${slug}`,
        fr: `https://crosswordspuzzle.com/fr/imprimables/${slug}`,
        de: `https://crosswordspuzzle.com/de/ausdruckbar/${slug}`,
        pt: `https://crosswordspuzzle.com/pt/imprimiveis/${slug}`
      }
    }
  }
}

// 2. Programmatic SEO Landing Page Template
export default async function PrintableCrosswordPage({ params }: Props) {
  const { locale, slug } = params

  // Server-Side Data Fetching
  const theme = await prisma.theme.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      puzzles: {
        include: {
          localized: {
            where: { locale },
            include: { words: true }
          }
        }
      }
    }
  })

  const translation = theme?.translations[0]
  const puzzle = theme?.puzzles[0]
  const localizedData = puzzle?.localized[0]

  if (!theme || !translation || !localizedData) {
    notFound()
  }

  // 3. Structured Data / JSON-LD for Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: translation.title,
    description: translation.description,
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: 'Vocabulary'
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">{translation.title}</h1>
        <p className="text-lg text-gray-600">{translation.description}</p>
      </header>

      {/* 4. Zero-Click Satisfaction: Direct Download Links */}
      <section className="flex justify-center gap-4 mb-12">
        <a 
          href={`/api/generate-pdf?id=${localizedData.id}&type=free`}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Download Free PDF (Watermarked)
        </a>
        <a 
          href={`/api/generate-pdf?id=${localizedData.id}&type=pro`}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Download Pro PDF (Commercial Rights)
        </a>
      </section>

      {/* 5. Crawlable HTML Text for Clues (Crucial for pSEO) */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Across Clues</h2>
          <ul className="list-decimal pl-5 space-y-2">
            {localizedData.words.filter(w => w.orientation === 'ACROSS').map(w => (
              <li key={w.id}>
                <strong>{w.startX},{w.startY}:</strong> {w.clue} 
                <span className="text-transparent selection:text-black"> (Answer: {w.word})</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Down Clues</h2>
          <ul className="list-decimal pl-5 space-y-2">
            {localizedData.words.filter(w => w.orientation === 'DOWN').map(w => (
              <li key={w.id}>
                <strong>{w.startX},{w.startY}:</strong> {w.clue}
                <span className="text-transparent selection:text-black"> (Answer: {w.word})</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
