import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'

function MouseModel({ onPartClick }){
  const [hovered, setHovered] = useState(null)

  return (
    <group>
      {/* main body */}
      <mesh
        position={[0,0.1,0]}
        onPointerOver={() => setHovered('body')}
        onPointerOut={() => setHovered(null)}
        onClick={() => onPartClick('body')}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={hovered==='body'? '#7dd3fc' : '#94a3b8'} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* left button */}
      <mesh position={[-0.18,0.25,0.4]} rotation={[0,0.2,0]} onPointerOver={() => setHovered('left-button')} onPointerOut={() => setHovered(null)} onClick={() => onPartClick('left-button')}>
        <boxGeometry args={[0.25,0.05,0.5]} />
        <meshStandardMaterial color={hovered==='left-button'? '#60a5fa' : '#cbd5e1'} />
      </mesh>

      {/* right button */}
      <mesh position={[0.18,0.25,0.4]} rotation={[0,-0.2,0]} onPointerOver={() => setHovered('right-button')} onPointerOut={() => setHovered(null)} onClick={() => onPartClick('right-button')}>
        <boxGeometry args={[0.25,0.05,0.5]} />
        <meshStandardMaterial color={hovered==='right-button'? '#60a5fa' : '#cbd5e1'} />
      </mesh>

      {/* wheel */}
      <mesh position={[0,0.18,0.5]} onPointerOver={() => setHovered('wheel')} onPointerOut={() => setHovered(null)} onClick={() => onPartClick('wheel')}>
        <cylinderGeometry args={[0.06,0.06,0.12,32]} />
        <meshStandardMaterial color={hovered==='wheel'? '#fef08a' : '#f1f5f9'} />
      </mesh>
    </group>
  )
}

export default function Viewer({ onPartClick, style }){
  const [info, setInfo] = useState(null)
  const handleClick = (part) => {
    setInfo(part)
    if(onPartClick) onPartClick(part)
  }

  return (
    <div style={{height:400}} className="rounded-lg shadow-md bg-white" aria-label="3D mouse viewer">
      <Canvas camera={{ position: [0, 1.5, 2.5], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5,5,5]} intensity={0.6} />
        <MouseModel onPartClick={handleClick} />
        <OrbitControls enablePan={true} enableZoom={true} />
      </Canvas>
      {info && (
        <div className="p-2 text-sm text-slate-700">Selected part: <strong>{info}</strong></div>
      )}
    </div>
  )
}
