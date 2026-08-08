import { useEffect, useState } from 'react'
import Scene from './components/Scene'
import ContentPanel from './components/ContentPanel'
import LoadingScreen from './components/LoadingScreen'
import GameOverlay from './components/GameOverlay'
import { sections } from './data/content'
import type { SectionId } from './types'

export default function App() {
  const [active, setActive] = useState<SectionId | null>(null)
  const [gameOpen, setGameOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(null)
        setGameOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative w-full h-full">
      <LoadingScreen />

      <Scene
        activeSection={active}
        onSelect={setActive}
        onOpenGame={() => setGameOpen(true)}
        gameActive={gameOpen}
      />

      {/* HUD header */}
      <div className="pointer-events-none fixed top-0 left-0 p-6 z-30">
        <div className="font-mono-ui text-command-accent text-[10px] tracking-[0.3em] uppercase">
          Adnan Saliyawala — Command Center
        </div>
        <div className="font-mono-ui text-command-text-dim text-[10px] tracking-[0.2em] uppercase mt-1">
          Drag to orbit · Click a marker to explore
        </div>
      </div>

      {/* Nav dots */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 flex-wrap justify-center px-4">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(active === s.id ? null : s.id)}
            className={`font-mono-ui text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded border transition-colors
              ${
                active === s.id
                  ? 'bg-command-accent text-command-bg border-command-accent'
                  : 'bg-command-panel/80 text-command-text-dim border-command-border hover:text-command-accent hover:border-command-accent'
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ContentPanel section={active} onClose={() => setActive(null)} />
      <GameOverlay open={gameOpen} onClose={() => setGameOpen(false)} />
    </div>
  )
}
