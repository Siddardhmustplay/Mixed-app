"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "../components/ui/button"

export default function ColorStopper() {
  const [running, setRunning] = useState(true)
  const [pos, setPos] = useState(0) // 0..100
  const [target, setTarget] = useState({ start: 55, end: 70 })
  const [score, setScore] = useState(0)
  const req = useRef<number | null>(null)

  useEffect(() => {
    const speed = 0.10 // percent per ms
    let last = performance.now()
    const loop = (t: number) => {
      if (!running) return
      const dt = t - last
      last = t
      setPos((p) => (p + dt * speed) % 100)
      req.current = requestAnimationFrame(loop)
    }
    req.current = requestAnimationFrame(loop)
    return () => {
      if (req.current) cancelAnimationFrame(req.current)
    }
  }, [running])

  function stop() {
    setRunning(false)
    const center = (target.start + target.end) / 2
    const width = (target.end - target.start) / 2 // half width
    const dist = Math.abs(pos - center)
    let gained = 0
    if (pos >= target.start && pos <= target.end) {
      gained = Math.max(1, Math.round(100 - (dist / width) * 100))
    } else {
      gained = -20 // penalty
    }
    setScore((s) => s + gained)
  }

  function next() {
    setRunning(true)
    setPos(0)
    const w = Math.max(6, Math.round(20 - score * 0.2)) // harder as score grows
    const start = Math.floor(Math.random() * (100 - w))
    setTarget({ start, end: start + w })
  }

  return (
    <div>
       <main className="min-h-screen p-6">
<section className="mx-auto max-w-3xl rounded-2xl bg-white/85 backdrop-blur p-6 shadow-xl">
      <h1 className="text-xl font-bold mb-2">Color Stopper</h1>
      <p className="text-sm opacity-70 mb-4">Score: {score}</p>
      <div className="h-10 rounded-xl border overflow-hidden relative bg-white/70">
        <div
          className="absolute inset-y-0"
          style={{
            left: `${target.start}%`,
            width: `${target.end - target.start}%`,
            background: "rgba(34,197,94,0.4)",
          }}
        />
        <div
          className="h-full"
          style={{ width: `${pos}%`, background: "linear-gradient(90deg, rgba(59,130,246,0.6), rgba(99,102,241,0.6))" }}
        />
      </div>
      <div className="mt-4 flex gap-3">
        <Button onClick={stop} className="bg-white border">
          Stop
        </Button>
        {!running && (
          <Button onClick={next} className="bg-white border">
            Next
          </Button>
        )}
      </div>
     
      </section>
       </main>
    </div>
  )
}
