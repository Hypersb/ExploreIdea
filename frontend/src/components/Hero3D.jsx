import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Float, 
  Stars,
  Text3D,
  Center,
  Box,
  Torus
} from '@react-three/drei'
import * as THREE from 'three'

// Animated 3D Logo/Icon
function AnimatedLogo() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group ref={meshRef}>
        {/* Main Sphere */}
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color="#10b981"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0}
            metalness={0.8}
            emissive="#10b981"
            emissiveIntensity={0.5}
          />
        </Sphere>
        
        {/* Orbiting Rings */}
        <Torus args={[2.2, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
        </Torus>
        <Torus args={[2.5, 0.08, 16, 100]} rotation={[0, Math.PI / 3, 0]}>
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
        </Torus>
      </group>
    </Float>
  )
}

// Floating Geometric Shapes
function FloatingShapes() {
  const shapes = [
    { type: 'box', position: [-4, 2, -2], color: '#10b981', size: 0.5 },
    { type: 'box', position: [4, -2, -3], color: '#06b6d4', size: 0.6 },
    { type: 'sphere', position: [-3, -3, 1], color: '#8b5cf6', size: 0.4 },
    { type: 'sphere', position: [5, 1, -1], color: '#ec4899', size: 0.5 },
    { type: 'torus', position: [3, 3, -2], color: '#f59e0b', size: 0.3 },
    { type: 'torus', position: [-5, 0, 2], color: '#ef4444', size: 0.4 },
  ]
  
  return (
    <>
      {shapes.map((shape, index) => (
        <Float
          key={index}
          speed={1 + Math.random()}
          rotationIntensity={0.5 + Math.random()}
          floatIntensity={0.5 + Math.random()}
        >
          {shape.type === 'box' && (
            <Box position={shape.position} args={[shape.size, shape.size, shape.size]}>
              <meshStandardMaterial
                color={shape.color}
                emissive={shape.color}
                emissiveIntensity={0.3}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
          )}
          {shape.type === 'sphere' && (
            <Sphere position={shape.position} args={[shape.size, 32, 32]}>
              <meshStandardMaterial
                color={shape.color}
                emissive={shape.color}
                emissiveIntensity={0.3}
                metalness={0.8}
                roughness={0.2}
              />
            </Sphere>
          )}
          {shape.type === 'torus' && (
            <Torus position={shape.position} args={[shape.size, shape.size * 0.3, 16, 100]}>
              <meshStandardMaterial
                color={shape.color}
                emissive={shape.color}
                emissiveIntensity={0.3}
                metalness={0.8}
                roughness={0.2}
              />
            </Torus>
          )}
        </Float>
      ))}
    </>
  )
}

// Particle System
function ParticleField() {
  const count = 1000
  const particlesRef = useRef()
  
  const particles = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 50
    particles[i * 3 + 1] = (Math.random() - 0.5) * 50
    particles[i * 3 + 2] = (Math.random() - 0.5) * 50
    
    const color = new THREE.Color()
    color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Main 3D Hero Component
const Hero3D = () => {
  return (
    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-12">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#8b5cf6"
        />
        
        {/* Background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        {/* 3D Elements */}
        <ParticleField />
        <AnimatedLogo />
        <FloatingShapes />
        
        {/* Fog */}
        <fog attach="fog" args={['#0a0a0a', 5, 30]} />
        
        {/* Controls - subtle auto-rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900 pointer-events-none" />
    </div>
  )
}

export default Hero3D
