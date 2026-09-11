import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('Index')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold text-center mb-6">{t('title')}</h1>
      <p className="text-xl text-gray-600 text-center max-w-2xl">{t('description')}</p>
    </main>
  )
}
