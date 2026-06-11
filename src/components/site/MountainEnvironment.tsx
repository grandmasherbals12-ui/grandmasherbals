import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import * as THREE from 'three'

function Tree({ position }: { position: [number, number, number] }) {
  const height = Math.random() * 10 + 5
  const radius = Math.random() * 1.5 + 0.5
  return (
    <mesh position={position}>
      <coneGeometry args={[radius, height, 8]} />
      <meshStandardMaterial color="#224422" />
    </mesh>
  )
}

export function MountainEnvironment() {
  const trees = Array.from({ length: 100 }, (_, i) => {
    const x = (Math.random() - 0.5) * 200
    const z = (Math.random() - 0.5) * 200
    return <Tree key={i} position={[x, 0, z]} />
  })

  return (
    <Canvas style={{ height: '500px', width: '100%' }}>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[50, 50, 50]}
        intensity={1.5}
        castShadow
      />
      <Sky
        sunPosition={[100, 10, 100]}
        inclination={0.2}
        azimuth={0.15}
      />
      <fog attach="fog" args={['#aaccff', 20, 150]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#556B2F" />
      </mesh>

      {trees}

      <OrbitControls
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10}
        maxDistance={100}
      />
    </Canvas>
  )
}
