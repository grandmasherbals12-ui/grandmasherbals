import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import { BreathingOrb } from './BreathingOrb'
import { Ocean } from './Ocean'

export function BeachEnvironment() {
  return (
    <Canvas style={{ height: '500px', width: '100%' }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Sky sunPosition={[100, 20, 100]} />
      <Stars />
      <OrbitControls />
      <mesh position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="sandybrown" />
      </mesh>
      <Ocean />
      <BreathingOrb />
    </Canvas>
  )
}
