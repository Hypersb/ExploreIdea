import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, Box, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Animated floating shapes for background
function AnimatedShapes() {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere position={[-8, 3, -5]} args={[0.8, 32, 32]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <Sphere position={[8, -2, -6]} args={[1, 32, 32]}>
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <Box position={[-6, -3, -4]} args={[1.2, 1.2, 1.2]}>
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.3} />
        </Box>
      </Float>
      
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.5}>
        <Box position={[6, 4, -5]} args={[0.9, 0.9, 0.9]}>
          <meshStandardMaterial color="#db2777" emissive="#db2777" emissiveIntensity={0.3} />
        </Box>
      </Float>
    </group>
  )
}

// 3D Background for Favorites page
const Background3D = ({ variant = 'favorites' }) => {
  const colors = {
    favorites: {
      primary: '#ef4444',
      secondary: '#ec4899',
      ambient: 0.4
    },
    dashboard: {
      primary: '#10b981',
      secondary: '#06b6d4',
      ambient: 0.5
    }
  }
  
  const theme = colors[variant] || colors.favorites
  
  return (
    <div className="absolute inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={theme.ambient} />
        <pointLight position={[10, 10, 10]} intensity={1} color={theme.primary} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={theme.secondary} />
        
        <Stars radius={50} depth={30} count={2000} factor={3} fade speed={0.5} />
        
        <AnimatedShapes />
        
        <fog attach="fog" args={['#0a0a0a', 10, 40]} />
      </Canvas>
    </div>
  )
}

export default Background3D
