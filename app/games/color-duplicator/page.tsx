"use client"
import { useEffect, useState } from "react"
import "../../globals.css"

const baseColors = ["#FF6C00", "#00FFB3", "#FF003C", "#7D4AFF", "#00E4FF", "#FFEA00", "#00FF66", "#FF66CC"]

export default function ColorDuplicator() {
  const [grid, setGrid] = useState<string[]>([])
  const [duplicated, setDuplicated] = useState<string>("")
  const [status, setStatus] = useState<"waiting" | "win" | "fail">("waiting")
  const [round, setRound] = useState<number>(0) // 👈 new state

  useEffect(() => {
    const original = [...baseColors].sort(() => 0.5 - Math.random()).slice(0, 8)
    const dup = original[Math.floor(Math.random() * original.length)]
    const newGrid = [...original, dup].sort(() => 0.5 - Math.random())
    setGrid(newGrid)
    setDuplicated(dup)
    setStatus("waiting")
  }, [round]) // 👈 now runs whenever round changes

  const handleClick = (color: string) => {
    const count = grid.filter((c) => c === color).length
    if (count === 2 && color === duplicated) {
      setStatus("win")
      setTimeout(() => {
        setStatus("waiting")
        setRound((r) => r + 1) // 👈 triggers new round
      }, 1000)
    } else {
      setStatus("fail")
      setTimeout(() => {
        setStatus("waiting")
        setRound((r) => r + 1) // 👈 triggers new round
      }, 1000)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-6 p-6  text-">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white/85 backdrop-blur p-6 shadow-xl">
        <h2 className="text-4xl font-bold text-[#FF6C00] ">Color Duplicator</h2>
        <br />
        <p className="text-lg text-red text-center">Tap the duplicated color</p>
        <br />
        <div className="grid grid-cols-3 gap-4">
          {grid.map((color, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(color)}
              className="w-20 h-20 rounded-xl border-2 border-white"
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
        {status === "win" && <div className="text-green-400 text-xl animate-bounce">✅ Correct!</div>}
        {status === "fail" && <div className="text-red-400 text-xl animate-bounce">❌ Try Again</div>}
      </section>
    </main>
  )
}
