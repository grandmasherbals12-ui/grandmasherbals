import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const geometryRef = useRef<THREE.PlaneGeometry>(null!)

  useFrame(({ clock }) => {
    if (geometryRef.current) {
      const time = clock.getElapsedTime()
      const positionAttribute = geometryRef.current.attributes.position

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i)
        const y = positionAttribute.getY(i)
        const z = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time) * 0.5
        positionAttribute.setZ(i, z)
      }

      positionAttribute.needsUpdate = true
      geometryRef.current.computeVertexNormals()
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry ref={geometryRef} args={[200, 200, 100, 100]} />
      <meshStandardMaterial
        color="#0077be"
        transparent
        opacity={0.8}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  )
}
