"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { randomColor } from "../lib/colors"
import { Button } from "../components/ui/button"

export default function QuickMatch() {
  const [left, setLeft] = useState("#ff0000")
  const [right, setRight] = useState("#00ff00")
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(30) // seconds
  const tickRef = useRef<number | null>(null)

  const difficulty = useMemo(() => Math.max(0.2, 1 - score * 0.03), [score]) // slowly harder

  useEffect(() => {
    nextPair()
    tickRef.current = window.setInterval(() => setTime((t) => t - 1), 1000) as unknown as number
    return () => tickRef.current && window.clearInterval(tickRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (time <= 0) {
      tickRef.current && window.clearInterval(tickRef.current)
    }
  }, [time])

  function nextPair() {
    const a = randomColor()
    const same = Math.random() < 0.5
    let b = a
    if (!same) {
      const n = (v: number) =>
        Math.max(
          0,
          Math.min(255, Math.round(v + (Math.random() * 60 + 20) * difficulty * (Math.random() < 0.5 ? -1 : 1))),
        )
      const r = Number.parseInt(a.slice(1, 3), 16)
      const g = Number.parseInt(a.slice(3, 5), 16)
      const bl = Number.parseInt(a.slice(5, 7), 16)
      const r2 = n(r),
        g2 = n(g),
        b2 = n(bl)
      b = `#${[r2, g2, b2].map((x) => x.toString(16).padStart(2, "0")).join("")}`
    }
    setLeft(a)
    setRight(b)
  }

  function answer(y: boolean) {
    const correct = (left === right) === y
    setScore((s) => s + (correct ? 1 : -1))
    nextPair()
  }

  return (
    <div>
               <main className="min-h-screen p-6">
<section className="mx-auto max-w-3xl rounded-2xl bg-white/85 backdrop-blur p-6 shadow-xl">
      
      <h1 className="text-xl font-bold mb-2">Quick Match</h1>
      <p className="text-sm opacity-70 mb-4">
        Time: {time}s · Score: {score}
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="h-40 rounded-xl border" style={{ backgroundColor: left }} />
        <div className="h-40 rounded-xl border" style={{ backgroundColor: right }} />
      </div>
      {time > 0 ? (
        <div className="flex gap-3">
          <Button onClick={() => answer(true)} className="bg-green-100 border">
            YES
          </Button>
          <Button onClick={() => answer(false)} className="bg-red-100 border">
            NO
          </Button>
        </div>
      ) : (
        <div className="font-medium">⏳ Time up! Final Score: {score}</div>
      )}
      </section>
      </main>
    </div>
  )
}
