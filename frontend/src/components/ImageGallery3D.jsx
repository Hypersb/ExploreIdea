import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, PerspectiveCamera, Environment, Float, Text3D, Center } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Heart, Download, ExternalLink, X } from 'lucide-react'
import { useFavoritesStore } from '../store/store'
import toast from 'react-hot-toast'
import * as THREE from 'three'

// 3D Image Card Component
function ImageCard3D({ image, position, index, onClick, onFavorite, isFav }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [texture] = useState(() => {
    const loader = new THREE.TextureLoader()
    return loader.load(image.thumbnail_url)
  })
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1
      
      // Gentle rotation when hovered
      if (hovered) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          Math.PI * 0.1,
          0.05
        )
        meshRef.current.scale.setScalar(
          THREE.MathUtils.lerp(meshRef.current.scale.x, 1.15, 0.05)
        )
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.05)
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.05))
      }
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position} ref={meshRef}>
        {/* Card Frame with Glow */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <boxGeometry args={[2.2, 2.8, 0.1]} />
          <meshStandardMaterial
            color={hovered ? '#10b981' : '#1e293b'}
            emissive={hovered ? '#10b981' : '#000000'}
            emissiveIntensity={hovered ? 0.3 : 0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Image Plane */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2, 2.6]} />
          <meshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Similarity Score Badge */}
        {hovered && (
          <Html
            position={[0, 1.5, 0.1]}
            center
            distanceFactor={4}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {Math.round(image.similarity_score * 100)}% Match
            </div>
          </Html>
        )}
        
        {/* Title and Info Overlay */}
        {hovered && (
          <Html
            position={[0, -1.5, 0.1]}
            center
            distanceFactor={4}
            style={{ width: '180px' }}
          >
            <div className="bg-black/90 backdrop-blur-sm p-3 rounded-lg shadow-2xl">
              <h3 className="text-white font-bold text-sm mb-1 truncate">
                {image.metadata.title || 'Untitled'}
              </h3>
              {image.metadata.photographer && (
                <p className="text-emerald-300 text-xs truncate">
                  {image.metadata.photographer}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFavorite()
                  }}
                  className="p-1.5 bg-slate-800 rounded-md hover:bg-emerald-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <button className="p-1.5 bg-slate-800 rounded-md hover:bg-emerald-500 transition-colors">
                  <Download className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 bg-slate-800 rounded-md hover:bg-emerald-500 transition-colors">
                  <ExternalLink className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// Animated 3D Scene Background
function Scene3DBackground() {
  const particlesRef = useRef()
  const { viewport } = useThree()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * viewport.width * 3,
          (Math.random() - 0.5) * viewport.height * 3,
          (Math.random() - 0.5) * 50
        ],
        scale: Math.random() * 0.5 + 0.1
      })
    }
    return temp
  }, [viewport])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5}>
          <mesh position={particle.position}>
            <sphereGeometry args={[particle.scale, 8, 8]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// Main 3D Gallery Component
const ImageGallery3D = ({ images, isLoading, onImageClick }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  
  const handleFavoriteClick = (image) => {
    if (isFavorite(image.id)) {
      removeFavorite(image.id)
      toast.success('Removed from favorites')
    } else {
      addFavorite(image)
      toast.success('Added to favorites')
    }
  }
  
  // Calculate 3D positions in a circular/spiral layout
  const calculatePositions = (count) => {
    const positions = []
    const radius = 8
    const heightSpacing = 3.5
    const itemsPerCircle = 6
    
    for (let i = 0; i < count; i++) {
      const circleIndex = Math.floor(i / itemsPerCircle)
      const angleIndex = i % itemsPerCircle
      const angle = (angleIndex / itemsPerCircle) * Math.PI * 2
      
      positions.push([
        Math.cos(angle) * (radius + circleIndex * 2),
        circleIndex * heightSpacing - (Math.floor(count / itemsPerCircle) * heightSpacing) / 2,
        Math.sin(angle) * (radius + circleIndex * 2)
      ])
    }
    
    return positions
  }
  
  if (isLoading) {
    return (
      <div className="w-full h-[600px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <Center>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.8}
              height={0.2}
              curveSegments={12}
            >
              Loading 3D Gallery...
              <meshNormalMaterial />
            </Text3D>
          </Center>
          
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    )
  }
  
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">No results found. Try a different search!</p>
      </div>
    )
  }
  
  const positions = calculatePositions(images.length)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-[800px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 shadow-2xl border border-emerald-500/20"
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          color="#10b981"
        />
        
        {/* Environment & Effects */}
        <Environment preset="city" />
        <fog attach="fog" args={['#0a0a0a', 15, 50]} />
        
        {/* Background Particles */}
        <Scene3DBackground />
        
        {/* Image Cards */}
        {images.map((image, index) => (
          <ImageCard3D
            key={image.id}
            image={image}
            position={positions[index]}
            index={index}
            onClick={() => onImageClick && onImageClick(image)}
            onFavorite={() => handleFavoriteClick(image)}
            isFav={isFavorite(image.id)}
          />
        ))}
        
        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={10}
          maxDistance={40}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Controls Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm">
        <p>🖱️ <strong>Drag:</strong> Rotate | <strong>Scroll:</strong> Zoom | <strong>Right Click:</strong> Pan</p>
      </div>
    </motion.div>
  )
}

export default ImageGallery3D
