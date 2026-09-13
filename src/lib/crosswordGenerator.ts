export type Word = {
  answer: string
  clue: string
}

export type PlacedWord = {
  word: string
  clue: string
  startX: number
  startY: number
  orientation: 'ACROSS' | 'DOWN'
}

export type GridCell = {
  char: string
  number?: number
}

export type CrosswordGrid = {
  grid: GridCell[][]
  placedWords: PlacedWord[]
  width: number
  height: number
}

// Simple backtracking crossword generator
export function generateCrossword(words: Word[], gridSize: number = 20): CrosswordGrid {
  const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''))
  const placedWords: PlacedWord[] = []
  
  // Sort words by length descending
  const sortedWords = [...words].sort((a, b) => b.answer.length - a.answer.length)
  
  function canPlaceWord(word: string, startX: number, startY: number, isAcross: boolean): boolean {
    if (isAcross && startX + word.length > gridSize) return false
    if (!isAcross && startY + word.length > gridSize) return false

    // Check bounds before and after word (to prevent adjacent words without crossing)
    if (isAcross) {
      if (startX > 0 && grid[startY][startX - 1] !== '') return false;
      if (startX + word.length < gridSize && grid[startY][startX + word.length] !== '') return false;
    } else {
      if (startY > 0 && grid[startY - 1][startX] !== '') return false;
      if (startY + word.length < gridSize && grid[startY + word.length][startX] !== '') return false;
    }

    for (let i = 0; i < word.length; i++) {
      const x = isAcross ? startX + i : startX
      const y = isAcross ? startY : startY + i
      
      const currentCell = grid[y][x]
      if (currentCell !== '' && currentCell !== word[i]) return false

      // Check adjacent cells (parallel to the word) to prevent touching words
      const isIntersection = currentCell === word[i]
      if (!isIntersection) {
        if (isAcross) {
          if (y > 0 && grid[y-1][x] !== '') return false;
          if (y < gridSize - 1 && grid[y+1][x] !== '') return false;
        } else {
          if (x > 0 && grid[y][x-1] !== '') return false;
          if (x < gridSize - 1 && grid[y][x+1] !== '') return false;
        }
      }
    }
    return true
  }

  function placeWord(word: string, startX: number, startY: number, isAcross: boolean) {
    for (let i = 0; i < word.length; i++) {
      const x = isAcross ? startX + i : startX
      const y = isAcross ? startY : startY + i
      grid[y][x] = word[i]
    }
  }

  // Place first word in the middle
  if (sortedWords.length > 0) {
    const first = sortedWords[0]
    const isAcross = true
    const startX = Math.floor((gridSize - first.answer.length) / 2)
    const startY = Math.floor(gridSize / 2)
    placeWord(first.answer, startX, startY, isAcross)
    placedWords.push({ word: first.answer, clue: first.clue, startX, startY, orientation: 'ACROSS' })
  }

  // Place remaining words
  for (let i = 1; i < sortedWords.length; i++) {
    const currentWord = sortedWords[i]
    let placed = false

    // Try to intersect with existing words
    for (const pw of placedWords) {
      if (placed) break
      
      for (let j = 0; j < currentWord.answer.length; j++) {
        if (placed) break
        const letter = currentWord.answer[j]

        for (let k = 0; k < pw.word.length; k++) {
          if (letter === pw.word[k]) {
            const intersectX = pw.orientation === 'ACROSS' ? pw.startX + k : pw.startX
            const intersectY = pw.orientation === 'ACROSS' ? pw.startY : pw.startY + k
            
            const newIsAcross = pw.orientation === 'DOWN'
            const newStartX = newIsAcross ? intersectX - j : intersectX
            const newStartY = newIsAcross ? intersectY : intersectY - j

            if (newStartX >= 0 && newStartY >= 0 && canPlaceWord(currentWord.answer, newStartX, newStartY, newIsAcross)) {
              placeWord(currentWord.answer, newStartX, newStartY, newIsAcross)
              placedWords.push({ 
                word: currentWord.answer, 
                clue: currentWord.clue, 
                startX: newStartX, 
                startY: newStartY, 
                orientation: newIsAcross ? 'ACROSS' : 'DOWN' 
              })
              placed = true
              break
            }
          }
        }
      }
    }
    
    // If we can't intersect, we skip it (a production algorithm would try placing it elsewhere or backtrack)
  }

  // Calculate grid bounds to trim the grid
  let minX = gridSize, maxX = 0, minY = gridSize, maxY = 0
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] !== '') {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  const finalGrid: GridCell[][] = []
  const width = maxX - minX + 1
  const height = maxY - minY + 1
  
  if (width <= 0 || height <= 0) return { grid: [], placedWords: [], width: 0, height: 0 }

  for (let y = minY; y <= maxY; y++) {
    const row: GridCell[] = []
    for (let x = minX; x <= maxX; x++) {
      row.push({ char: grid[y][x] })
    }
    finalGrid.push(row)
  }

  // Number the words
  let currentNumber = 1
  const adjustedPlacedWords = placedWords.map(pw => {
    const adjX = pw.startX - minX
    const adjY = pw.startY - minY
    
    // If the cell doesn't have a number yet, add it
    if (!finalGrid[adjY][adjX].number) {
      finalGrid[adjY][adjX].number = currentNumber++
    }
    
    return { ...pw, startX: adjX, startY: adjY }
  })

  return {
    grid: finalGrid,
    placedWords: adjustedPlacedWords,
    width,
    height
  }
}
