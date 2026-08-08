import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Environment } from '@react-three/drei'
import Room from './Room'
import { sections, defaultCamera, ROOM_SCALE } from '../data/content'
import type { SectionId } from '../types'

function CameraRig({ activeSection }: { activeSection: SectionId | null }) {
  const controls = useRef<CameraControls>(null)

  useEffect(() => {
    if (!controls.current) return
    if (activeSection) {
      const s = sections.find((s) => s.id === activeSection)
      if (s) {
        controls.current.setLookAt(...s.cameraPosition, ...s.cameraTarget, true)
      }
    } else {
      controls.current.setLookAt(...defaultCamera.position, ...defaultCamera.target, true)
    }
  }, [activeSection])

  return (
    <CameraControls
      ref={controls}
      minDistance={0.8 * ROOM_SCALE}
      maxDistance={7 * ROOM_SCALE}
      minPolarAngle={0.5}
      maxPolarAngle={Math.PI / 2.05}
      dollySpeed={0.4}
      truckSpeed={0}
    />
  )
}

export default function Scene({
  activeSection,
  onSelect,
  onOpenGame,
  gameActive,
}: {
  activeSection: SectionId | null
  onSelect: (id: SectionId) => void
  onOpenGame: () => void
  gameActive: boolean
}) {
  return (
    <Canvas shadows camera={{ position: defaultCamera.position, fov: 45 }} gl={{ antialias: true }}>
      <color attach="background" args={['#05070a']} />
      <fog attach="fog" args={['#05070a', 6 * ROOM_SCALE, 14 * ROOM_SCALE]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 2]} intensity={0.6} color="#dbe4ea" />

      <Suspense fallback={null}>
        <Room activeSection={activeSection} onSelect={onSelect} onOpenGame={onOpenGame} gameActive={gameActive} />
        <Environment preset="city" environmentIntensity={0.25} />
      </Suspense>

      <CameraRig activeSection={activeSection} />
    </Canvas>
  )
}
