"use client"
import { useState, useEffect } from "react"

const COLORS = ["red", "blue", "green", "yellow", "purple"]
const TILE_COUNT = 25
const ROUND_TIME = 5000

export default function ColorRushGame() {
  const [tiles, setTiles] = useState<string[]>([])
  const [targetColor, setTargetColor] = useState("")
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState("")
  const [gameState, setGameState] = useState<"intro" | "playing" | "roundOver">("intro")
  const [roundKey, setRoundKey] = useState(0)

  const startRound = () => {
    const newTiles = Array.from({ length: TILE_COUNT }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
    const validColors = new Set(newTiles)
    const color = Array.from(validColors)[Math.floor(Math.random() * validColors.size)]

    setTiles(newTiles)
    setTargetColor(color)
    setMessage("")
    setGameState("playing")
    setRoundKey((prev) => prev + 1)
  }

  useEffect(() => {
    if (gameState !== "playing") return

    const timeout = setTimeout(() => {
      setMessage("⏰ Time’s up!")
      setGameState("roundOver")
    }, ROUND_TIME)

    return () => clearTimeout(timeout)
  }, [roundKey, gameState])

  const handleClick = (color: string) => {
    if (gameState !== "playing") return

    if (color === targetColor) {
      setScore((s) => s + 1)
      setMessage("✅ Nice!")
      // 👆 don't end the round early, let timer handle it
    } else {
      setMessage("❌ Wrong!")
    }
  }

  const getBg = (color: string) =>
    ({
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-400",
      purple: "bg-purple-500",
    })[color]

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center text-center px-4">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white/85 backdrop-blur p-6 shadow-xl">
        <h1 className="text-4xl font-bold mb-2 text-[#FF6C00] drop-shadow">Color Rush Reaction</h1>
        <p className="mb-4 text-lg">
          Score: <span className="text-green-300">{score}</span>
        </p>

        {gameState === "playing" && (
          <p className="mb-2 text-xl text-red">
            Click all <strong>{targetColor.toUpperCase()}</strong> tiles!
          </p>
        )}

        {gameState !== "playing" && message && <p className="mb-2 text-xl text-yellow-300">{message}</p>}

        <div className="grid grid-cols-5 gap-2 my-4">
          {tiles.map((color, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(color)}
              disabled={gameState !== "playing"}
              className={`w-14 h-14 ${getBg(color)} rounded shadow-lg transition-transform hover:scale-105 active:scale-95`}
            />
          ))}
        </div>

        {gameState === "intro" && (
          <button
            onClick={startRound}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black font-semibold"
          >
            Start Game
          </button>
        )}

        {gameState === "roundOver" && (
          <button
            onClick={startRound}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black font-semibold"
          >
            Next Round
          </button>
        )}
      </section>
    </main>
  )
}
