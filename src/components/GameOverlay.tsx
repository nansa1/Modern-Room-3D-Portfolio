import { useEffect, useRef, useState } from 'react'

interface Threat {
  id: number
  angle: number
  spawnedAt: number
  duration: number
}

const HIGH_SCORE_KEY = 'command-center-threat-highscore'
const START_LIVES = 3

export default function GameOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [threats, setThreats] = useState<Threat[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(START_LIVES)
  const [running, setRunning] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [, forceTick] = useState(0)

  const idRef = useRef(0)
  const scoreRef = useRef(0)

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HIGH_SCORE_KEY)
      if (stored) setHighScore(parseInt(stored, 10) || 0)
    } catch {
      /* localStorage unavailable — high score just won't persist */
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setRunning(false)
      setThreats([])
    }
  }, [open])

  const start = () => {
    setThreats([])
    setScore(0)
    setLives(START_LIVES)
    setRunning(true)
  }

  // Spawn loop — ramps up difficulty using scoreRef so it doesn't need to
  // restart the timer chain every time score changes.
  useEffect(() => {
    if (!running) return
    let cancelled = false
    let timer: number

    const spawn = () => {
      if (cancelled) return
      const s = scoreRef.current
      const id = idRef.current++
      setThreats((prev) => [
        ...prev,
        {
          id,
          angle: Math.random() * Math.PI * 2,
          spawnedAt: performance.now(),
          duration: Math.max(3000 - s * 45, 1300),
        },
      ])
      const delay = Math.max(1300 - s * 18, 450)
      timer = window.setTimeout(spawn, delay)
    }

    timer = window.setTimeout(spawn, 500)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [running])

  // Animation loop — advances each threat's approach and resolves misses.
  useEffect(() => {
    if (!running) return
    let raf: number

    const loop = () => {
      const now = performance.now()
      setThreats((prev) => {
        let missed = 0
        const next = prev.filter((t) => {
          if ((now - t.spawnedAt) / t.duration >= 1) {
            missed += 1
            return false
          }
          return true
        })
        if (missed > 0) {
          setLives((l) => {
            const nl = Math.max(l - missed, 0)
            if (nl <= 0) {
              setRunning(false)
              setHighScore((hs) => {
                const finalScore = scoreRef.current
                if (finalScore > hs) {
                  try {
                    localStorage.setItem(HIGH_SCORE_KEY, String(finalScore))
                  } catch {
                    /* ignore */
                  }
                  return finalScore
                }
                return hs
              })
            }
            return nl
          })
        }
        return next
      })
      forceTick((t) => t + 1)
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])

  const handleHit = (id: number) => {
    setThreats((prev) => prev.filter((t) => t.id !== id))
    setScore((s) => s + 10)
  }

  if (!open) return null

  const now = performance.now()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-command-bg/80 backdrop-blur-sm p-4">
      <div className="scanline w-full max-w-sm bg-command-panel border border-command-border rounded-lg p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 font-mono-ui text-[10px] tracking-[0.15em] text-command-text-dim hover:text-command-accent transition-colors"
        >
          ✕ CLOSE
        </button>

        <div className="font-mono-ui text-command-accent text-[10px] tracking-[0.3em] uppercase mb-1">
          soc.exe — live feed
        </div>
        <h2 className="font-display text-xl text-command-text mb-1">Threat Neutralizer</h2>
        <p className="text-command-text-dim text-xs leading-relaxed mb-4">
          Click each intrusion before its ring closes. {START_LIVES} misses and the core is breached.
        </p>

        <div className="flex justify-between font-mono-ui text-[11px] text-command-text-dim mb-3">
          <span>
            SCORE <span className="text-command-accent">{score}</span>
          </span>
          <span>
            LIVES{' '}
            <span className="text-command-warn tracking-widest">
              {'●'.repeat(lives)}
              {'○'.repeat(Math.max(START_LIVES - lives, 0))}
            </span>
          </span>
          <span>
            BEST <span className="text-command-text">{highScore}</span>
          </span>
        </div>

        <div className="relative w-full aspect-square rounded border border-command-border bg-command-bg overflow-hidden">
          {/* core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rotate-45 bg-command-accent/15 border border-command-accent" />

          {threats.map((t) => {
            const progress = Math.min((now - t.spawnedAt) / t.duration, 1)
            const radius = 42 * (1 - progress)
            const x = 50 + Math.cos(t.angle) * radius
            const y = 50 + Math.sin(t.angle) * radius
            const ringScale = 1 + (1 - progress) * 1.6
            return (
              <button
                key={t.id}
                onClick={() => handleHit(t.id)}
                aria-label="Neutralize threat"
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-red-500/80 border-2 border-red-300"
              >
                <span
                  className="absolute inset-0 rounded-full border-2 border-red-300/60"
                  style={{ transform: `scale(${ringScale})`, opacity: 0.7 - progress * 0.5 }}
                />
              </button>
            )
          })}

          {!running && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-command-bg/70">
              {lives <= 0 && (
                <div className="font-mono-ui text-command-warn text-xs tracking-[0.15em] uppercase">
                  Core breached — score {score}
                </div>
              )}
              <button
                onClick={start}
                className="font-mono-ui text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded border border-command-accent text-command-accent hover:bg-command-accent hover:text-command-bg transition-colors"
              >
                {score > 0 || lives <= 0 ? 'Restart' : 'Start'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
