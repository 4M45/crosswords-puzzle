export type Orientation = 'ACROSS' | 'DOWN';

export interface PlacedWord {
  word: string;
  clue: string;
  orientation: Orientation;
  startX: number;
  startY: number;
}

export interface GridCell {
  letter: string;
  isStart: boolean;
  number?: number;
}

export interface CrosswordLayout {
  width: number;
  height: number;
  placements: PlacedWord[];
}

interface WordInput {
  word: string;
  clue: string;
}

export function generateCrossword(inputs: WordInput[]): CrosswordLayout {
  if (inputs.length === 0) return { width: 0, height: 0, placements: [] };

  // Sort words by length descending to place larger words first
  const words = [...inputs].map(i => ({...i, word: i.word.toUpperCase().replace(/[^A-Z]/g, '')}))
                           .sort((a, b) => b.word.length - a.word.length);

  let bestLayout: CrosswordLayout = { width: 0, height: 0, placements: [] };
  let bestScore = -1;

  // Try multiple times to find the most compact grid
  for (let attempt = 0; attempt < 5; attempt++) {
    // Optionally shuffle words after the first attempt to get different layouts
    if (attempt > 0) {
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
    }

    const currentPlacements: PlacedWord[] = [];
    
    // Place first word horizontally in the center
    currentPlacements.push({
      word: words[0].word,
      clue: words[0].clue,
      orientation: 'ACROSS',
      startX: 0,
      startY: 0
    });

    for (let i = 1; i < words.length; i++) {
      const wordToPlace = words[i];
      let bestPlacement: PlacedWord | null = null;
      let maxIntersections = -1;

      // Try intersecting with every already placed word
      for (const placed of currentPlacements) {
        for (let j = 0; j < wordToPlace.word.length; j++) {
          const letter = wordToPlace.word[j];

          for (let k = 0; k < placed.word.length; k++) {
            if (placed.word[k] === letter) {
              // Found an intersection point!
              const newOrientation: Orientation = placed.orientation === 'ACROSS' ? 'DOWN' : 'ACROSS';
              
              const startX = newOrientation === 'DOWN' 
                ? placed.startX + k 
                : placed.startX - j;
                
              const startY = newOrientation === 'DOWN' 
                ? placed.startY - j 
                : placed.startY + k;

              const candidate: PlacedWord = {
                word: wordToPlace.word,
                clue: wordToPlace.clue,
                orientation: newOrientation,
                startX,
                startY
              };

              if (isValidPlacement(candidate, currentPlacements)) {
                // Score based on intersections
                const intersections = countIntersections(candidate, currentPlacements);
                if (intersections > maxIntersections) {
                  maxIntersections = intersections;
                  bestPlacement = candidate;
                }
              }
            }
          }
        }
      }

      if (bestPlacement) {
        currentPlacements.push(bestPlacement);
      }
    }

    // Score layout: density (placed words / grid area)
    const normalized = normalizeCoordinates(currentPlacements);
    if (normalized.placements.length > 0) {
      const area = normalized.width * normalized.height;
      const score = (normalized.placements.length * 1000) - area; // Reward more words, penalize large area

      if (score > bestScore) {
        bestScore = score;
        bestLayout = normalized;
      }
    }
  }

  return bestLayout;
}

function isValidPlacement(candidate: PlacedWord, existing: PlacedWord[]): boolean {
  // Check bounds and collisions
  for (let i = 0; i < candidate.word.length; i++) {
    const cx = candidate.orientation === 'ACROSS' ? candidate.startX + i : candidate.startX;
    const cy = candidate.orientation === 'DOWN' ? candidate.startY + i : candidate.startY;

    let intersecting = false;

    for (const placed of existing) {
      for (let j = 0; j < placed.word.length; j++) {
        const px = placed.orientation === 'ACROSS' ? placed.startX + j : placed.startX;
        const py = placed.orientation === 'DOWN' ? placed.startY + j : placed.startY;

        if (cx === px && cy === py) {
          if (candidate.word[i] !== placed.word[j]) return false; // Conflicting letter
          intersecting = true;
        } else {
          // Check adjacency (words shouldn't touch side-by-side unless intersecting)
          const isAdjacent = Math.abs(cx - px) <= 1 && Math.abs(cy - py) <= 1 && !(cx !== px && cy !== py);
          if (isAdjacent && !intersecting) {
             // If it's the cell just before or after the word, it's invalid (prevents words running into each other)
             if (candidate.orientation === 'ACROSS' && py === cy && (cx === candidate.startX - 1 || cx === candidate.startX + candidate.word.length)) return false;
             if (candidate.orientation === 'DOWN' && px === cx && (cy === candidate.startY - 1 || cy === candidate.startY + candidate.word.length)) return false;
             
             // Parallel touching
             if (candidate.orientation === placed.orientation) return false;
          }
        }
      }
    }
  }
  return true;
}

function countIntersections(candidate: PlacedWord, existing: PlacedWord[]): number {
  let count = 0;
  for (let i = 0; i < candidate.word.length; i++) {
    const cx = candidate.orientation === 'ACROSS' ? candidate.startX + i : candidate.startX;
    const cy = candidate.orientation === 'DOWN' ? candidate.startY + i : candidate.startY;
    for (const placed of existing) {
      for (let j = 0; j < placed.word.length; j++) {
        const px = placed.orientation === 'ACROSS' ? placed.startX + j : placed.startX;
        const py = placed.orientation === 'DOWN' ? placed.startY + j : placed.startY;
        if (cx === px && cy === py) count++;
      }
    }
  }
  return count;
}

function normalizeCoordinates(placements: PlacedWord[]): CrosswordLayout {
  if (placements.length === 0) return { width: 0, height: 0, placements: [] };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  placements.forEach(p => {
    if (p.startX < minX) minX = p.startX;
    if (p.startY < minY) minY = p.startY;
    
    const endX = p.orientation === 'ACROSS' ? p.startX + p.word.length - 1 : p.startX;
    const endY = p.orientation === 'DOWN' ? p.startY + p.word.length - 1 : p.startY;
    
    if (endX > maxX) maxX = endX;
    if (endY > maxY) maxY = endY;
  });

  const normalizedPlacements = placements.map(p => ({
    ...p,
    startX: p.startX - minX,
    startY: p.startY - minY
  }));

  return {
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    placements: normalizedPlacements
  };
}
