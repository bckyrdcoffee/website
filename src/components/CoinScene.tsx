import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Clouds, Cloud, Environment, Float } from '@react-three/drei';
import { MapPin, Play, Pause } from 'lucide-react';
import * as THREE from 'three';

function Coin({ isPlaying }: { isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, '/coin.png');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [rotationVelocity, setRotationVelocity] = useState(0);
  const lastDragTimeRef = useRef(0);
  const velocityHistoryRef = useRef<number[]>([]);

  const coinGeometry = useMemo(() => {
    const radius = 2;
    const segments = 64;
    const thickness = 0.2;
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      thickness,
      segments,
    );
    return geometry;
  }, []);

  const edgeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#4a90e2',
      metalness: 0.8,
      roughness: 0.3,
    });
  }, []);

  const faceMaterialFront = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.4,
      roughness: 0.4,
    });
  }, [texture]);

  const faceMaterialBack = useMemo(() => {
    const flippedTexture = texture.clone();
    flippedTexture.center.set(0.5, 0.5);
    flippedTexture.rotation = Math.PI;
    flippedTexture.needsUpdate = true;
    return new THREE.MeshStandardMaterial({
      map: flippedTexture,
      metalness: 0.4,
      roughness: 0.4,
    });
  }, [texture]);

  const materials = useMemo(() => {
    return [edgeMaterial, faceMaterialFront, faceMaterialBack];
  }, [edgeMaterial, faceMaterialFront, faceMaterialBack]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStartX(e.clientX || e.touches?.[0]?.clientX || 0);
    setRotationVelocity(0);
    lastDragTimeRef.current = Date.now();
    velocityHistoryRef.current = [];
  };

  useEffect(() => {
    const handlePointerMove = (e: any) => {
      if (!isDragging) return;

      const currentTime = Date.now();
      const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
      const deltaX = currentX - dragStartX;
      const deltaTime = Math.max(currentTime - lastDragTimeRef.current, 1);

      const velocity = (deltaX / deltaTime) * 16;

      velocityHistoryRef.current.push(velocity);
      if (velocityHistoryRef.current.length > 5) {
        velocityHistoryRef.current.shift();
      }

      const rotationDelta = velocity * 0.01;

      if (meshRef.current) {
        meshRef.current.rotation.y += rotationDelta;
      }

      setDragStartX(currentX);
      lastDragTimeRef.current = currentTime;
    };

    const handlePointerUp = () => {
      setIsDragging(false);

      if (velocityHistoryRef.current.length > 0) {
        const avgVelocity =
          velocityHistoryRef.current.reduce((a, b) => a + b, 0) /
          velocityHistoryRef.current.length;
        setRotationVelocity(avgVelocity * 0.01);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);

      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
      };
    }
  }, [isDragging, dragStartX]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      if (isPlaying && !isDragging) {
        meshRef.current.rotation.y += delta * 0.4;
      } else if (!isDragging && Math.abs(rotationVelocity) > 0.0001) {
        meshRef.current.rotation.y += rotationVelocity * delta * 60;
        const friction = 0.92;
        setRotationVelocity(rotationVelocity * friction);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={coinGeometry}
      material={materials}
      rotation={[0, 0, Math.PI / 2.1]}
      onPointerDown={handlePointerDown}
    />
  );
}

export function FogClouds({ isPlaying }: { isPlaying: boolean }) {
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud
        position={[-3, -1.2, -2]}
        speed={isPlaying ? 0.2 : 0}
        opacity={0.15}
        bounds={[4, 1, 1]}
        segments={8}
        color="#e8e8f0"
      />
      <Cloud
        position={[3, -1, -2.5]}
        speed={isPlaying ? 0.15 : 0}
        opacity={0.12}
        bounds={[4, 1, 1]}
        segments={8}
        color="#d8d8e8"
      />
      <Cloud
        position={[0, -1.5, -3]}
        speed={isPlaying ? 0.1 : 0}
        opacity={0.18}
        bounds={[5, 1.5, 1.5]}
        segments={10}
        color="#f0f0f8"
      />
    </Clouds>
  );
}

function Scene({ isPlaying }: { isPlaying: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#88ccdd" />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.5}
        color="#4488aa"
      />
      <pointLight position={[0, 3, 3]} intensity={0.8} color="#66bbcc" />
      <fog attach="fog" args={['#0a0a0f', 5, 15]} />
      <Float
        speed={isPlaying ? 1.5 : 0}
        rotationIntensity={0.1}
        floatIntensity={0.3}
      >
        <Coin isPlaying={isPlaying} />
      </Float>
      <FogClouds isPlaying={isPlaying} />
      <Environment preset="night" />
    </>
  );
}

export default function CoinScene() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const textStyle = {
    color: '#ffffff',
    fontFamily: "'Arial', sans-serif",
    fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
    fontWeight: 400,
    zIndex: 10,
    textAlign: 'center' as const,
    marginTop: '1rem',
    marginBottom: '2rem',
  };

  const linkStyle = {
    color: '#88ccdd',
    textDecoration: 'none',
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: '0.3rem',
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <audio ref={audioRef} loop>
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>
      <button
        onClick={toggleAudio}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          background: 'rgba(136, 204, 221, 0.2)',
          border: '2px solid #88ccdd',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#88ccdd',
          transition: 'all 0.3s ease',
          zIndex: 100,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(136, 204, 221, 0.3)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(136, 204, 221, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <h1
        style={{
          marginTop: 80,
          color: '#ffffff',
          fontFamily: "'Arial Black', 'Impact', sans-serif",
          fontSize: 'clamp(1.2rem, 3vw, 2.5rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          zIndex: 10,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 0 20px rgba(100, 200, 220, 0.3)',
        }}
      >
        {/* From the Land of Indonesia 🇮🇩 */}
        {/* BCKYRD COFFEE */}
        LOCKD IN
      </h1>
      <p style={textStyle}>
        {/* Visit us{' '} */}
        <a
          href="https://maps.app.goo.gl/8FBhfiYi3aCoeQjE7"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          <MapPin size={18} />
          West Jurang Manggu, South Tangerang City
        </a>
      </p>
      <p style={textStyle}>
        <a
          href="https://linktr.ee/bckyrdcoffee"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          linktr.ee/bckyrdcoffee
        </a>
      </p>
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <Scene isPlaying={isPlaying} />
        </Canvas>
      </div>
    </div>
  );
}
