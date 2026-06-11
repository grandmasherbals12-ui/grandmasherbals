import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Candle({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const time = clock.getElapsedTime()
      lightRef.current.intensity =
        1.5 + Math.sin(time * 5 + position[0]) * 0.2
    }
  })

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="ivory" />
      </mesh>
      <pointLight
        ref={lightRef}
        color="#ffaa33"
        intensity={1.5}
        distance={10}
        decay={2}
        castShadow
      />
    </group>
  )
}

function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.5, 0.5, 10, 16]} />
      <meshStandardMaterial color="#4a4a4a" />
    </mesh>
  )
}

function Pew({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[5, 0.5, 0.2]} />
        <meshStandardMaterial color="#5C3A21" />
      </mesh>
      <mesh position={[0, 0.25, -0.3]}>
        <boxGeometry args={[5, 1, 0.2]} />
        <meshStandardMaterial color="#5C3A21" />
      </mesh>
    </group>
  )
}

export function SacredReflectionEnvironment() {
  const pillars = Array.from({ length: 6 }, (_, i) => (
    <group key={i}>
      <Pillar position={[-10, 0, -15 + i * 6]} />
      <Pillar position={[10, 0, -15 + i * 6]} />
    </group>
  ))

  const pews = Array.from({ length: 5 }, (_, i) => (
    <group key={i}>
      <Pew position={[-5, -2, -12 + i * 5]} />
      <Pew position={[5, -2, -12 + i * 5]} />
    </group>
  ))

  const candles = Array.from({ length: 10 }, (_, i) => {
    const x = (Math.random() - 0.5) * 15
    const z = (Math.random() - 0.5) * 25
    return <Candle key={i} position={[x, -1.5, z]} />
  })

  return (
    <Canvas
      style={{ height: '500px', width: '100%', background: '#1a1a1a' }}
      shadows
    >
      <ambientLight intensity={0.05} />
      <fog attach="fog" args={['#1a1a1a', 10, 40]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {pillars}
      {pews}
      {candles}

      <Text
        position={[0, 5, -20]}
        fontSize={1.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/cormorant-garamond-v16-latin-regular.woff"
      >
        Breathe and Reflect
      </Text>

      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={30}
      />
    </Canvas>
  )
}
