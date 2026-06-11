import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function BreathingOrb() {
  const meshRef = useRef<THREE.Mesh>(null!)

  // Breathing cycle: 4s inhale, 2s hold, 6s exhale
  const cycleDuration = 12 // seconds
  const inhaleTime = 4
  const holdTime = 2
  const exhaleTime = 6

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const cycleTime = time % cycleDuration

    let scale = 1
    let color = new THREE.Color('gold')

    if (cycleTime < inhaleTime) {
      // Inhale
      const progress = cycleTime / inhaleTime
      scale = 1 + progress * 0.5 // Scale from 1 to 1.5
      color.lerp(new THREE.Color('lightblue'), progress)
    } else if (cycleTime < inhaleTime + holdTime) {
      // Hold
      scale = 1.5
      color = new THREE.Color('lightblue')
    } else {
      // Exhale
      const progress = (cycleTime - inhaleTime - holdTime) / exhaleTime
      scale = 1.5 - progress * 0.5 // Scale from 1.5 to 1
      color.lerp(new THREE.Color('gold'), 1 - progress)
    }

    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale)
      ;(meshRef.current.material as THREE.MeshStandardMaterial).color = color
      ;(meshRef.current.material as THREE.MeshStandardMaterial).emissive = color
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="gold" emissive="gold" emissiveIntensity={0.5} />
    </mesh>
  )
}
