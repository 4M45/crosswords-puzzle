'use client';

import React, { useState, useEffect } from 'react';
import { generateCrossword, CrosswordLayout } from '@/lib/crosswordGenerator';
import CrosswordGrid from './CrosswordGrid';

interface WordPair {
  word: string;
  clue: string;
}

export default function CustomGenerator() {
  const [pairs, setPairs] = useState<WordPair[]>([
    { word: 'NEXTJS', clue: 'The React framework for production' },
    { word: 'REACT', clue: 'A JavaScript library for building UI' },
    { word: 'PRISMA', clue: 'Next-generation Node.js and TypeScript ORM' },
    { word: 'TAILWIND', clue: 'Utility-first CSS framework' }
  ]);
  const [layout, setLayout] = useState<CrosswordLayout | null>(null);
  const [showAnswers, setShowAnswers] = useState(true);

  useEffect(() => {
    // Basic debounce for generation
    const timer = setTimeout(() => {
      const validPairs = pairs.filter(p => p.word.trim().length > 1);
      if (validPairs.length > 0) {
        const result = generateCrossword(validPairs);
        setLayout(result);
      } else {
        setLayout(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [pairs]);

  const addPair = () => setPairs([...pairs, { word: '', clue: '' }]);
  
  const updatePair = (index: number, field: keyof WordPair, value: string) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
  };

  const removePair = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto p-4">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">Input Words & Clues</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {pairs.map((pair, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <input 
                  type="text" 
                  placeholder="Word (e.g. GHOST)" 
                  value={pair.word}
                  onChange={e => updatePair(idx, 'word', e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Clue (e.g. A spooky apparition)" 
                  value={pair.clue}
                  onChange={e => updatePair(idx, 'clue', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <button 
                onClick={() => removePair(idx)}
                className="mt-1 text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                title="Remove word"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={addPair}
          className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
        >
          + Add Another Word
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Live Preview</h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showAnswers} 
              onChange={e => setShowAnswers(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700 font-medium">Show Answers</span>
          </label>
        </div>
        
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden min-h-[400px]">
          {layout ? (
            <CrosswordGrid layout={layout} showAnswers={showAnswers} />
          ) : (
            <p className="text-gray-400">Add some words to generate a grid!</p>
          )}
        </div>
        
        <button 
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-colors disabled:opacity-50"
          disabled={!layout || layout.placements.length < 2}
        >
          Generate High-Res PDF
        </button>
      </div>
    </div>
  );
}
