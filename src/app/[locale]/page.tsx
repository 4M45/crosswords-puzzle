'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Leaf, Book, Atom, Smile, Star, Brain, Download, Globe, Printer, PiggyBank, Facebook, Twitter, ChevronDown, Music, Heart, Zap, Coffee, Plus, Trash } from 'lucide-react'
import { generateCrossword, Word, CrosswordGrid } from '@/lib/crosswordGenerator'

const THEMES = [
  { id: 'Nature', icon: <Leaf className="w-6 h-6 text-green-600" />, words: [{answer: "TREE", clue: "Tall plant"}, {answer: "FLOWER", clue: "Blooming plant"}, {answer: "FOREST", clue: "Many trees"}, {answer: "RIVER", clue: "Flowing water"}] },
  { id: 'History', icon: <Book className="w-6 h-6 text-amber-700" />, words: [{answer: "CASTLE", clue: "Medieval fort"}, {answer: "KNIGHT", clue: "Armor wearer"}, {answer: "KING", clue: "Ruler"}, {answer: "ROMAN", clue: "Ancient empire"}] },
  { id: 'Science', icon: <Atom className="w-6 h-6 text-blue-500" />, words: [{answer: "ATOM", clue: "Basic particle"}, {answer: "SPACE", clue: "Final frontier"}, {answer: "GRAVITY", clue: "Falling force"}, {answer: "CELL", clue: "Biological unit"}] },
  { id: 'Pop Culture', icon: <Smile className="w-6 h-6 text-pink-500" />, words: [{answer: "MOVIE", clue: "Cinema film"}, {answer: "MUSIC", clue: "Songs"}, {answer: "MEME", clue: "Internet joke"}, {answer: "VIRAL", clue: "Spreads fast"}] },
  { id: 'Music', icon: <Music className="w-6 h-6 text-purple-500" />, words: [{answer: "GUITAR", clue: "String instrument"}, {answer: "PIANO", clue: "Keys"}, {answer: "DRUM", clue: "Beat maker"}, {answer: "SONG", clue: "Vocal track"}] },
  { id: 'Food', icon: <Coffee className="w-6 h-6 text-orange-800" />, words: [{answer: "PIZZA", clue: "Italian pie"}, {answer: "BURGER", clue: "Meat sandwich"}, {answer: "SUSHI", clue: "Raw fish"}, {answer: "PASTA", clue: "Noodles"}] },
]

export default function Home() {
  const [difficulty, setDifficulty] = useState('Medium')
  const [theme, setTheme] = useState('Nature')
  const [language, setLanguage] = useState('English')
  const [isLangOpen, setIsLangOpen] = useState(false)
  
  const [mode, setMode] = useState<'Themed' | 'Custom'>('Themed')
  const [customWords, setCustomWords] = useState<Word[]>([{ answer: 'HELLO', clue: 'Greeting' }, { answer: 'WORLD', clue: 'Earth' }])
  
  const [gridData, setGridData] = useState<CrosswordGrid | null>(null)

  useEffect(() => {
    // Generate grid when inputs change
    const wordsToUse = mode === 'Themed' 
      ? THEMES.find(t => t.id === theme)?.words || []
      : customWords.filter(w => w.answer.length > 1 && w.clue.length > 1).map(w => ({ ...w, answer: w.answer.toUpperCase() }))
    
    if (wordsToUse.length >= 2) {
      setGridData(generateCrossword(wordsToUse))
    } else {
      setGridData(null)
    }
  }, [theme, mode, customWords])

  const handleAddCustomWord = () => {
    setCustomWords([...customWords, { answer: '', clue: '' }])
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center pt-16 pb-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-30 rotate-[-15deg] pointer-events-none">
        <GridIcon className="w-24 h-24 text-orange-400" />
      </div>
      <div className="absolute top-20 right-20 opacity-30 rotate-[15deg] pointer-events-none">
        <GridIcon className="w-32 h-32 text-orange-400" />
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-cream-50 rounded-[40px] shadow-soft p-10 md:p-14 border-[6px] border-white text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-black text-brown-900 mb-10 leading-tight tracking-tight drop-shadow-sm">
          Generate Your<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
            Crossword Puzzle
          </span>
        </h1>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-cream-200 p-1 rounded-full flex font-bold text-brown-800 border-2 border-cream-500/20 shadow-inner-soft">
            <button 
              onClick={() => setMode('Themed')}
              className={`px-8 py-3 rounded-full transition-all ${mode === 'Themed' ? 'bg-white shadow-sm' : 'opacity-60 hover:opacity-100'}`}
            >
              Themed Mode
            </button>
            <button 
              onClick={() => setMode('Custom')}
              className={`px-8 py-3 rounded-full transition-all ${mode === 'Custom' ? 'bg-white shadow-sm' : 'opacity-60 hover:opacity-100'}`}
            >
              Custom Mode
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Language Selector */}
          <div className="bg-cream-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative shadow-inner-soft z-50">
             <div className="flex items-center gap-2 font-bold text-brown-800 absolute top-2 left-4 text-sm">
                <span className="w-4 h-4 bg-blue-600 inline-block rounded-sm"></span> Choose language
             </div>
             <div className="mt-6 w-full flex items-center bg-cream-100 rounded-xl p-2 border-2 border-cream-500/30 justify-between relative">
                <div className="flex gap-2 text-2xl px-2">
                  <span>🇺🇸</span><span>🇪🇸</span><span>🇷🇺</span>
                </div>
                <div 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-3 text-brown-800 font-semibold bg-cream-50 px-4 py-2 rounded-lg cursor-pointer border border-cream-200 shadow-sm flex-1 ml-4 justify-between hover:bg-white transition-colors"
                >
                  <span className="text-sm opacity-60">Language</span>
                  <div className="flex gap-4 text-sm">
                    <span>{language}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 opacity-60 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </div>

                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-cream-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {['English', 'Spanish', 'French', 'German', 'Portuguese'].map(lang => (
                      <div 
                        key={lang}
                        onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                        className="px-4 py-3 hover:bg-cream-100 cursor-pointer text-sm font-bold text-brown-800 border-b border-cream-50 last:border-0"
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>

          {mode === 'Themed' ? (
            <>
              {/* Difficulty Selector */}
              <div className="bg-cream-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative shadow-inner-soft">
                 <div className="flex items-center gap-2 font-bold text-brown-800 absolute top-2 left-4 text-sm">
                    <GridIcon className="w-4 h-4" /> difficulty
                 </div>
                 
                 <div className="mt-6 w-full flex justify-end">
                   <div className="flex bg-cream-50 rounded-xl overflow-hidden border-2 border-cream-500/20 shadow-sm">
                      {[
                        { id: 'Easy', icon: <Star className="w-5 h-5 text-green-500" />, color: 'bg-green-100' },
                        { id: 'Medium', icon: <Star className="w-5 h-5 text-yellow-500" />, color: 'bg-yellow-200' },
                        { id: 'Hard', icon: <Brain className="w-5 h-5 text-red-400" />, color: 'bg-red-200' },
                        { id: 'Expert', icon: <Brain className="w-5 h-5 text-gray-500" />, color: 'bg-gray-200' }
                      ].map(diff => (
                        <button 
                          key={diff.id}
                          onClick={() => setDifficulty(diff.id)}
                          className={`flex flex-col items-center justify-center px-4 py-2 border-r border-cream-500/20 last:border-0 transition-all ${difficulty === diff.id ? diff.color : 'hover:bg-cream-100'}`}
                        >
                          {diff.icon}
                          <span className="text-xs font-bold mt-1 text-brown-800">{diff.id}</span>
                        </button>
                      ))}
                   </div>
                 </div>
              </div>

              {/* Theme Selector */}
              <div className="bg-cream-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative shadow-inner-soft">
                 <div className="flex items-center gap-2 font-bold text-brown-800 absolute top-2 left-4 text-sm">
                    <GridIcon className="w-4 h-4" /> theme
                 </div>
                 
                 <div className="mt-6 w-full flex justify-end gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {THEMES.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-[72px] h-[80px] rounded-xl border-2 transition-all bg-cream-50 shadow-sm
                          ${theme === t.id ? 'border-primary scale-105' : 'border-cream-500/20 hover:border-cream-500'}`}
                      >
                        {t.icon}
                        <span className="text-[10px] font-bold mt-2 text-brown-800 leading-tight text-center px-1">{t.id}</span>
                      </button>
                    ))}
                 </div>
              </div>
            </>
          ) : (
            <div className="bg-cream-200 rounded-2xl p-4 relative shadow-inner-soft text-left">
               <div className="flex items-center gap-2 font-bold text-brown-800 absolute top-2 left-4 text-sm">
                  <GridIcon className="w-4 h-4" /> custom words & clues
               </div>
               
               <div className="mt-8 space-y-3">
                 {customWords.map((cw, i) => (
                    <div key={i} className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Word (e.g. REACT)" 
                        className="flex-1 bg-white border-2 border-cream-500/30 rounded-lg p-2 font-bold text-brown-800 uppercase outline-none focus:border-primary"
                        value={cw.answer}
                        onChange={(e) => {
                          const newWords = [...customWords]
                          newWords[i].answer = e.target.value.toUpperCase().replace(/[^A-Z]/g, '')
                          setCustomWords(newWords)
                        }}
                      />
                      <input 
                        type="text" 
                        placeholder="Clue (e.g. A popular UI library)" 
                        className="flex-[2] bg-white border-2 border-cream-500/30 rounded-lg p-2 text-sm text-brown-800 outline-none focus:border-primary"
                        value={cw.clue}
                        onChange={(e) => {
                          const newWords = [...customWords]
                          newWords[i].clue = e.target.value
                          setCustomWords(newWords)
                        }}
                      />
                      <button 
                        onClick={() => setCustomWords(customWords.filter((_, idx) => idx !== i))}
                        className="p-2 text-red-400 hover:text-red-600 bg-white border-2 border-cream-500/30 rounded-lg transition-colors"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                 ))}
                 <button 
                  onClick={handleAddCustomWord}
                  className="w-full mt-2 py-3 border-2 border-dashed border-primary/50 text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                 >
                   <Plus className="w-5 h-5" /> Add Another Word
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Visual Preview */}
        {gridData && gridData.grid.length > 0 && (
          <div className="mt-12 bg-cream-100 p-8 rounded-3xl border-2 border-cream-200">
            <h3 className="text-xl font-bold text-brown-800 mb-6">Puzzle Preview</h3>
            <div className="flex justify-center overflow-x-auto pb-4">
              <div 
                className="grid gap-[1px] bg-brown-900 p-[2px] rounded-lg shadow-sm"
                style={{ gridTemplateColumns: `repeat(${gridData.width}, minmax(0, 1fr))` }}
              >
                {gridData.grid.map((row, y) => (
                  row.map((cell, x) => (
                    <div 
                      key={`${x}-${y}`} 
                      className={`w-8 h-8 md:w-10 md:h-10 relative flex items-center justify-center font-bold text-lg md:text-xl
                        ${cell.char ? 'bg-white text-brown-900' : 'bg-transparent'}`}
                    >
                      {cell.number && <span className="absolute top-0.5 left-0.5 text-[8px] md:text-[10px] leading-none text-gray-500">{cell.number}</span>}
                      {cell.char && <span className="opacity-20">{cell.char}</span>} {/* Faded answers for preview */}
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-12 flex justify-center">
          <a href="/api/generate-pdf?type=free&id=preview" target="_blank" className="bg-gradient-to-b from-primary to-[#00b0b1] hover:from-[#00e3e4] hover:to-primary text-white text-xl md:text-2xl font-black py-5 px-12 rounded-full shadow-[0_15px_30px_-5px_rgba(0,210,211,0.5)] flex items-center gap-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 border-b-4 border-[#009b9c] active:border-b-0 active:translate-y-1 group">
            Generate & Download
            <span className="bg-white text-red-500 px-2 py-1 rounded-lg text-sm flex items-center font-black uppercase tracking-wider group-hover:bg-red-50 transition-colors">
               <Download className="w-4 h-4 mr-1" /> PDF
            </span>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-5xl px-6 relative z-10 text-center">
        <h2 className="text-4xl font-extrabold text-brown-800 mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-brown-800/10 -z-10 rounded-full"></div>

          <FeatureCard 
            icon={<PiggyBank className="w-12 h-12 text-pink-400" />}
            title="100% Free"
            desc="Create unlimited puzzles without spending a dime."
          />
          <FeatureCard 
            icon={<Globe className="w-12 h-12 text-blue-500" />}
            title="Multiple Languages"
            desc="Crossword generation in a wide range of popular languages."
          />
          <FeatureCard 
            icon={<Printer className="w-12 h-12 text-gray-600" />}
            title="Printable PDF"
            desc="Includes Answer Keys automatically on Page 2 for every puzzle."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 bg-cream-50/80 backdrop-blur-md w-full max-w-4xl mx-auto rounded-t-3xl py-10 px-6 text-center text-brown-800 font-bold border-t border-white/50">
        <div className="flex justify-center gap-8 mb-6 text-sm">
          <a href="#" className="hover:text-primary transition">About</a>
          <a href="#" className="hover:text-primary transition">Contact</a>
          <a href="#" className="hover:text-primary transition">Privacy Policy</a>
        </div>
        <p className="text-xs font-semibold opacity-60">
          © 2024 Crossword Generator. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-cream-50 rounded-3xl shadow-soft p-8 border-[4px] border-white flex flex-col items-center">
      <div className="mb-6 relative">
         <div className="absolute -top-12 -left-4">
           <GridIcon className="w-16 h-16 text-brown-800/10" />
         </div>
         {icon}
      </div>
      <h3 className="font-extrabold text-xl mb-3">{title}</h3>
      <p className="text-sm opacity-80 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
      <rect x="10" y="30" width="20" height="20" rx="4" />
      <rect x="30" y="30" width="20" height="20" rx="4" />
      <rect x="50" y="30" width="20" height="20" rx="4" />
      <rect x="30" y="10" width="20" height="20" rx="4" />
      <rect x="30" y="50" width="20" height="20" rx="4" />
      <rect x="30" y="70" width="20" height="20" rx="4" />
      <rect x="70" y="30" width="20" height="20" rx="4" />
    </svg>
  )
}
