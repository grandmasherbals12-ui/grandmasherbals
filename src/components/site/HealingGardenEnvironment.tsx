import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Flower({ position }: { position: [number, number, number] }) {
  const colors = ['#ff69b4', '#ffc0cb', '#ffb6c1', '#ffa07a', '#ee82ee']
  const color = colors[Math.floor(Math.random() * colors.length)]
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  )
}

function Butterflies() {
  const ref = useRef<THREE.Points>(null!)
  const count = 50
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30
  }

  useFrame(({ clock }) => {
    if (ref.current) {
      const time = clock.getElapsedTime()
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const y = positions[i3 + 1]
        const z = positions[i3 + 2]

        ref.current.geometry.attributes.position.setX(
          i,
          x + Math.sin(time + i) * 0.5,
        )
        ref.current.geometry.attributes.position.setY(
          i,
          Math.abs(y * Math.sin(time * 0.5 + i)) + 0.5,
        )
        ref.current.geometry.attributes.position.setZ(
          i,
          z + Math.cos(time + i) * 0.5,
        )
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="yellow" />
    </points>
  )
}

export function HealingGardenEnvironment() {
  const flowers = Array.from({ length: 200 }, (_, i) => {
    const x = (Math.random() - 0.5) * 50
    const z = (Math.random() - 0.5) * 50
    return <Flower key={i} position={[x, 0, z]} />
  })

  return (
    <Canvas style={{ height: '500px', width: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 5]} intensity={1} />
      <fog attach="fog" args={['#e6e6fa', 15, 60]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#90ee90" />
      </mesh>

      {flowers}
      <Butterflies />
      <Sparkles count={100} scale={15} size={1} speed={0.2} color="pink" />

      <OrbitControls maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  )
}
