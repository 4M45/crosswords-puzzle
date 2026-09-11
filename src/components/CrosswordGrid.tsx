'use client';

import React, { useMemo } from 'react';
import { CrosswordLayout, PlacedWord } from '@/lib/crosswordGenerator';

interface CrosswordGridProps {
  layout: CrosswordLayout;
  showAnswers?: boolean;
}

interface Cell {
  x: number;
  y: number;
  letter: string;
  number?: number;
  isEmpty: boolean;
}

export default function CrosswordGrid({ layout, showAnswers = false }: CrosswordGridProps) {
  const grid = useMemo(() => {
    if (!layout || layout.width === 0) return [];

    // Initialize empty grid
    const g: Cell[][] = Array.from({ length: layout.height }, (_, y) =>
      Array.from({ length: layout.width }, (_, x) => ({
        x,
        y,
        letter: '',
        isEmpty: true,
      }))
    );

    let wordNumber = 1;

    // Fill grid with letters and numbers
    layout.placements.forEach((word) => {
      let requiresNumber = false;

      for (let i = 0; i < word.word.length; i++) {
        const x = word.orientation === 'ACROSS' ? word.startX + i : word.startX;
        const y = word.orientation === 'DOWN' ? word.startY + i : word.startY;

        const cell = g[y][x];
        cell.letter = word.word[i];
        cell.isEmpty = false;

        // If it's the first letter of a word and hasn't been numbered yet
        if (i === 0 && !cell.number) {
          requiresNumber = true;
          cell.number = wordNumber;
        }
      }

      if (requiresNumber) {
        wordNumber++;
      }
    });

    return g;
  }, [layout]);

  if (!layout || layout.width === 0) {
    return <div className="text-center p-8 text-gray-500">No layout generated.</div>;
  }

  return (
    <div className="w-full overflow-auto p-4 bg-gray-50 rounded-lg shadow-inner">
      <div 
        className="inline-grid gap-0 border-2 border-gray-800 bg-gray-800"
        style={{
          gridTemplateColumns: `repeat(${layout.width}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`
                relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-gray-400
                ${cell.isEmpty ? 'bg-gray-800' : 'bg-white'}
                flex items-center justify-center text-lg md:text-xl font-bold uppercase
              `}
            >
              {!cell.isEmpty && cell.number && (
                <span className="absolute top-0 left-0.5 text-[8px] sm:text-[10px] text-gray-600 font-normal select-none">
                  {cell.number}
                </span>
              )}
              {showAnswers && !cell.isEmpty && (
                <span className="text-gray-900">{cell.letter}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
