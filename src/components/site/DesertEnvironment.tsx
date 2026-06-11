import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Sparkles } from '@react-three/drei'

export function DesertEnvironment() {
  return (
    <Canvas style={{ height: '500px', width: '100%' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Sky
        distance={450000}
        sunPosition={[5, 1, 8]}
        inclination={0}
        azimuth={0.25}
      />
      <fog attach="fog" args={['#f0e6d2', 10, 100]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>

      <Sparkles
        count={200}
        scale={10}
        size={2}
        speed={0.1}
        color="white"
        position={[0, 1, 0]}
      />

      <OrbitControls
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </Canvas>
  )
}
