import { useProgress } from '@react-three/drei'

export default function LoadingScreen() {
  const { progress, active } = useProgress()

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-command-bg transition-opacity duration-700 ${
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="font-mono-ui text-command-accent text-xs tracking-[0.3em] mb-4">
        INITIALIZING COMMAND CENTER
      </div>
      <div className="w-64 h-1 bg-command-border overflow-hidden rounded-full">
        <div
          className="h-full bg-command-accent transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-mono-ui text-command-text-dim text-[10px] mt-3 tabular-nums">
        {Math.floor(progress)}%
      </div>
    </div>
  )
}
