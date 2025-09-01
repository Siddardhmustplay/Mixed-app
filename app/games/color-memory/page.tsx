"use client"

import { useEffect, useState } from "react"
import styles from "./styles.module.css"

const COLORS = ["#FF6C00", "#00FFB3", "#FF003C", "#7D4AFF", "#00E4FF", "#FFEA00", "#00FF66", "#FF66CC"]

function shuffle(array: string[]): string[] {
  let currentIndex = array.length,
    randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

export default function ColorMatcherPage() {
  const [tiles, setTiles] = useState<
    {
      id: number
      color: string
      flipped: boolean
      matched: boolean
    }[]
  >([])

  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])

  const initializeTiles = () => {
    const colorPairs = shuffle([...COLORS, ...COLORS])
    const initialTiles = colorPairs.map((color, index) => ({
      id: index,
      color,
      flipped: false,
      matched: false,
    }))
    setTiles(initialTiles)
    setFlipped([])
    setMatched([])
  }

  useEffect(() => {
    initializeTiles()
  }, [])

  useEffect(() => {
    if (matched.length === COLORS.length * 2) {
      setTimeout(() => {
        initializeTiles()
      }, 1500)
    }
  }, [matched])

  const handleClick = (index: number) => {
    if (flipped.length === 2 || tiles[index].flipped || tiles[index].matched) return

    const newTiles = [...tiles]
    newTiles[index].flipped = true
    setTiles(newTiles)

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped
      if (tiles[firstIdx].color === tiles[secondIdx].color) {
        setTimeout(() => {
          const updatedTiles = [...tiles]
          updatedTiles[firstIdx].matched = true
          updatedTiles[secondIdx].matched = true
          setTiles(updatedTiles)
          setMatched([...matched, firstIdx, secondIdx])
          setFlipped([])
        }, 500)
      } else {
        setTimeout(() => {
          const updatedTiles = [...tiles]
          updatedTiles[firstIdx].flipped = false
          updatedTiles[secondIdx].flipped = false
          setTiles(updatedTiles)
          setFlipped([])
        }, 1000)
      }
    }
  }

  return (
    <div className={styles.container}>
      {/* ✅ Card wrapper with blur effect */}
      <section className="mx-auto max-w-3xl rounded-2xl bg-white/85 backdrop-blur p-6 shadow-xl">
        <h1 className={styles.title}>🎨 Color Matcher Game</h1>
        <div className={styles.grid}>
          {tiles.map((tile, index) => (
            <div
              key={tile.id}
              className={styles.card}
              onClick={() => handleClick(index)}
              style={{
                backgroundColor: tile.flipped || tile.matched ? tile.color : "gray",
                cursor: tile.flipped || tile.matched ? "default" : "pointer",
              }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
