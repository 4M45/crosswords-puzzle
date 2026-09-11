import { useTranslations } from 'next-intl';
import CustomGenerator from '@/components/CustomGenerator';

export default function CustomPuzzlePage() {
  const t = useTranslations('Index'); // Fallback or use specific Custom dict

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Custom Puzzle Maker</h1>
        <p className="mt-2 text-lg text-gray-600">Enter your own words and clues to instantly generate a printable crossword.</p>
      </div>
      
      <CustomGenerator />
    </main>
  );
}
