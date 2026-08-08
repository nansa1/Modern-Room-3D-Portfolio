import { useEffect, useMemo, useState } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Same base mesh as the plain `computerScreen` <Model/>, but with a
 * dashboard screenshot texture-mapped onto the screen face and the
 * click/hover nav behavior built directly in (so it can carry its own
 * image, rather than <Model>'s generic path/clickable API).
 *
 * The screenshot is a plain <img>-style THREE.TextureLoader load, not a
 * video — static dashboard screenshots per the brief. If `imageSrc` 404s,
 * it falls back to a soft teal glow instead of a black/broken texture, same
 * fallback pattern used everywhere else in this project (WindowView,
 * CertCard).
 */
export default function MonitorScreen({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  imageSrc,
  clickable,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  imageSrc: string
  clickable: { label: string; onSelect: () => void; isActive?: boolean }
}) {
  const { scene } = useGLTF('/models/computerScreen.glb')
  const [hovered, setHovered] = useState(false)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [failed, setFailed] = useState(false)

  const { centered, size } = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const center = new THREE.Vector3()
    box.getCenter(center)
    clone.position.x -= center.x
    clone.position.z -= center.z
    clone.position.y -= box.min.y
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    const size = new THREE.Vector3()
    box.getSize(size)
    return { centered: clone, size }
  }, [scene])

  useEffect(() => {
    let cancelled = false
    const loader = new THREE.TextureLoader()
    loader.load(
      imageSrc,
      (tex) => {
        if (cancelled) return
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        setTexture(tex)
      },
      undefined,
      () => {
        if (!cancelled) setFailed(true)
      }
    )
    return () => {
      cancelled = true
    }
  }, [imageSrc])

  // Screen "face" plane sized relative to the model's own measured bounding
  // box (not hand-guessed pixels) so it tracks the real bezel regardless of
  // scale — ~82% of width, ~62% of height, sitting just proud of the glass
  // so it doesn't z-fight with the bezel mesh underneath.
  const panelW = size.x * 0.82
  const panelH = size.y * 0.6
  const panelY = size.y * 0.56
  const panelZ = size.z * 0.52 + 0.003

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group
        onClick={(e) => {
          e.stopPropagation()
          clickable.onSelect()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <primitive object={centered} />
        <mesh position={[0, panelY, panelZ]}>
          <planeGeometry args={[panelW, panelH]} />
          {texture && !failed ? (
            <meshBasicMaterial map={texture} toneMapped={false} />
          ) : (
            <meshStandardMaterial color="#0a2f3a" emissive="#4fd1c5" emissiveIntensity={0.22} roughness={0.5} />
          )}
        </mesh>
        <mesh position={[0, size.y / 2, 0]}>
          <boxGeometry args={[size.x + 0.1, size.y + 0.1, size.z + 0.1]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {(hovered || clickable.isActive) && (
          <mesh position={[0, size.y / 2, 0]}>
            <boxGeometry args={[size.x + 0.1, size.y + 0.1, size.z + 0.1]} />
            <meshBasicMaterial
              color={clickable.isActive ? '#f0b656' : '#4fd1c5'}
              wireframe
              transparent
              opacity={hovered ? 0.9 : 0.5}
            />
          </mesh>
        )}
        {hovered && (
          <Html center distanceFactor={6} position={[0, size.y + 0.18, 0]} occlude={false}>
            <div className="font-mono-ui text-[10px] tracking-[0.15em] uppercase bg-command-panel/95 text-command-accent border border-command-border px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              {clickable.label}
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}
