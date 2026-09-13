'use client'

import React, { useState } from 'react'
import { FileText, Leaf, Book, Atom, Smile, Star, Brain, Download, Globe, Printer, PiggyBank, Facebook, Twitter, ChevronDown } from 'lucide-react'

export default function Home() {
  const [difficulty, setDifficulty] = useState('Medium')
  const [theme, setTheme] = useState('Nature')

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center pt-16 pb-8">
      {/* Background Decorative Elements (Simulated) */}
      <div className="absolute top-10 left-10 opacity-30 rotate-[-15deg]">
        <GridIcon className="w-24 h-24 text-orange-400" />
      </div>
      <div className="absolute top-20 right-20 opacity-30 rotate-[15deg]">
        <GridIcon className="w-32 h-32 text-orange-400" />
      </div>
      <div className="absolute bottom-[40%] left-0 opacity-20">
        <GridIcon className="w-40 h-40 text-orange-500 rotate-45" />
      </div>

      {/* Main Hero Card */}
      <div className="relative z-10 w-full max-w-2xl bg-cream-50 rounded-[40px] shadow-soft p-10 md:p-14 border-[6px] border-white text-center mb-20">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-brown-800 mb-10 leading-tight">
          Generate Your<br/>Crossword Puzzle
        </h1>

        <div className="space-y-6">
          {/* Language Selector */}
          <div className="bg-cream-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden shadow-inner-soft">
             <div className="flex items-center gap-2 font-bold text-brown-800 absolute top-2 left-4 text-sm">
                <span className="w-4 h-4 bg-blue-600 inline-block rounded-sm"></span> Choose language
             </div>
             <div className="mt-6 w-full flex items-center bg-cream-100 rounded-xl p-2 border-2 border-cream-500/30 justify-between">
                <div className="flex gap-2 text-2xl px-2">
                  <span>🇺🇸</span><span>🇪🇸</span><span>🇷🇺</span>
                </div>
                <div className="flex items-center gap-3 text-brown-800 font-semibold bg-cream-50 px-4 py-2 rounded-lg cursor-pointer border border-cream-200 shadow-sm flex-1 ml-4 justify-between">
                  <span className="text-sm opacity-60">Language</span>
                  <div className="flex gap-4 text-sm">
                    <span>English</span>
                    <span className="opacity-40">Common</span>
                    <span className="opacity-40">Spanish</span>
                  </div>
                  <ChevronDown className="w-5 h-5 opacity-60" />
                </div>
             </div>
          </div>

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
             
             <div className="mt-6 w-full flex justify-end gap-2">
                {[
                  { id: 'Nature', icon: <Leaf className="w-6 h-6 text-green-600" /> },
                  { id: 'History', icon: <Book className="w-6 h-6 text-amber-700" /> },
                  { id: 'Science', icon: <Atom className="w-6 h-6 text-blue-500" /> },
                  { id: 'Pop Culture', icon: <Smile className="w-6 h-6 text-pink-500" /> }
                ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center justify-center w-[72px] h-[80px] rounded-xl border-2 transition-all bg-cream-50 shadow-sm
                      ${theme === t.id ? 'border-primary scale-105' : 'border-cream-500/20 hover:border-cream-500'}`}
                  >
                    {t.icon}
                    <span className="text-[10px] font-bold mt-2 text-brown-800 leading-tight text-center px-1">{t.id}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-10 flex justify-center">
          <button className="bg-primary hover:bg-[#00babb] text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg shadow-primary/30 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
            Generate & Download PDF
            <span className="bg-white text-red-500 p-1 rounded-md text-xs flex items-center font-black">
               PDF
            </span>
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-5xl px-6 relative z-10 text-center">
        <h2 className="text-4xl font-extrabold text-brown-800 mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
          {/* Connector Line simulated */}
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
            desc="Instant generation into a high-quality PDF, ready to print and solve."
          />
        </div>

        <div className="flex justify-center">
          <div className="bg-cream-50 rounded-3xl shadow-soft p-8 max-w-md w-full border-[4px] border-white flex items-center gap-6">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-500">
              <FileText className="w-10 h-10" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-xl mb-1">Crossword Design</h3>
              <p className="text-sm opacity-80 font-medium">Crossword built on puzzle format with perfect structure.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 bg-cream-50/80 backdrop-blur-md w-full max-w-4xl mx-auto rounded-t-3xl py-10 px-6 text-center text-brown-800 font-bold border-t border-white/50">
        <div className="flex justify-center gap-8 mb-6 text-sm">
          <a href="#" className="hover:text-primary transition">About</a>
          <a href="#" className="hover:text-primary transition">Contact</a>
          <a href="#" className="hover:text-primary transition">Privacy Policy</a>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <a href="#" className="bg-brown-800 text-white p-2 rounded-full hover:bg-primary transition">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="#" className="bg-brown-800 text-white p-2 rounded-full hover:bg-primary transition">
            <Twitter className="w-4 h-4" />
          </a>
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
