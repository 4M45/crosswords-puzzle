import { Document, Page, Text, View, StyleSheet, Canvas } from '@react-pdf/renderer'
import React from 'react'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    flexDirection: 'column',
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  watermark: {
    position: 'absolute',
    top: 300,
    left: 100,
    opacity: 0.1,
    transform: 'rotate(-45deg)',
    fontSize: 60,
    color: 'red',
    zIndex: -1,
  },
  gridContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cluesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clueColumn: {
    width: '45%',
  },
  clueHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  clueText: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.4,
  }
})

type ClueWord = { word: string; clue: string; orientation: string; startX: number; startY: number }

interface CrosswordDocumentProps {
  title: string;
  gridWidth: number;
  gridHeight: number;
  words: ClueWord[];
  isPro: boolean;
  showAnswers: boolean;
}

// React-PDF Document Structure
export const CrosswordDocument = ({ title, gridWidth, gridHeight, words, isPro, showAnswers }: CrosswordDocumentProps) => (
  <Document>
    {/* Page 1: The Puzzle */}
    <Page size="A4" style={styles.page}>
      {!isPro && <Text style={styles.watermark}>CROSSWORDSPUZZLE.COM</Text>}
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.gridContainer}>
        <Canvas 
          style={{ width: 400, height: 400 }}
          paint={(painter) => {
            const cellSize = 400 / Math.max(gridWidth, gridHeight)
            
            // Draw grid cells based on word coordinates
            words.forEach(w => {
              let x = w.startX
              let y = w.startY
              
              for (let i = 0; i < w.word.length; i++) {
                // Draw cell box
                painter.rect(x * cellSize, y * cellSize, cellSize, cellSize).stroke()
                
                // If rendering answer key, fill in the letters
                if (showAnswers) {
                  painter.fontSize(cellSize * 0.6)
                         .text(w.word[i], x * cellSize + cellSize*0.2, y * cellSize + cellSize*0.8)
                }
                
                w.orientation === 'ACROSS' ? x++ : y++
              }
            })
            return null
          }}
        />
      </View>

      <View style={styles.cluesContainer}>
        <View style={styles.clueColumn}>
          <Text style={styles.clueHeader}>Across</Text>
          {words.filter(w => w.orientation === 'ACROSS').map((w, i) => (
            <Text key={i} style={styles.clueText}>{w.startX},{w.startY}: {w.clue}</Text>
          ))}
        </View>
        <View style={styles.clueColumn}>
          <Text style={styles.clueHeader}>Down</Text>
          {words.filter(w => w.orientation === 'DOWN').map((w, i) => (
            <Text key={i} style={styles.clueText}>{w.startX},{w.startY}: {w.clue}</Text>
          ))}
        </View>
      </View>
    </Page>

    {/* Page 2: Answer Key */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title} - Answer Key</Text>
      <View style={styles.gridContainer}>
        <Canvas 
          style={{ width: 400, height: 400 }}
          paint={(painter) => {
            const cellSize = 400 / Math.max(gridWidth, gridHeight)
            words.forEach(w => {
              let x = w.startX
              let y = w.startY
              for (let i = 0; i < w.word.length; i++) {
                painter.rect(x * cellSize, y * cellSize, cellSize, cellSize).stroke()
                painter.fontSize(cellSize * 0.6).text(w.word[i], x * cellSize + cellSize*0.2, y * cellSize + cellSize*0.8)
                w.orientation === 'ACROSS' ? x++ : y++
              }
            })
            return null
          }}
        />
      </View>
    </Page>
  </Document>
)
