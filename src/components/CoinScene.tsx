import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Clouds, Cloud, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function Coin() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, '/coin.png');

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

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={coinGeometry}
      material={materials}
      rotation={[0, 0, Math.PI / 2]}
    />
  );
}

export function FogClouds() {
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud
        position={[-3, -1.2, 0.5]}
        speed={0.2}
        opacity={0.4}
        bounds={[6, 1.5, 1.5]}
        segments={20}
        color="#1a3a4a"
      />
      <Cloud
        position={[3, -1, 1]}
        speed={0.15}
        opacity={0.35}
        bounds={[7, 1.5, 1.5]}
        segments={20}
        color="#1a3a4a"
      />
      <Cloud
        position={[0, -1.5, 0]}
        speed={0.1}
        opacity={0.5}
        bounds={[10, 2, 2]}
        segments={30}
        color="#0d2030"
      />
      <Cloud
        position={[-1, 0.5, -1]}
        speed={0.25}
        opacity={0.2}
        bounds={[5, 1, 1]}
        segments={15}
        color="#1a4a5a"
      />
      <Cloud
        position={[2, 0.8, -1.5]}
        speed={0.18}
        opacity={0.15}
        bounds={[4, 1, 1]}
        segments={12}
        color="#1a4a5a"
      />
    </Clouds>
  );
}

function Scene() {
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
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Coin />
      </Float>
      <Environment preset="night" />
    </>
  );
}

export default function CoinScene() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0a0a0f',
        position: 'relative',
      }}
    >
      <h1
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
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
        From the Land of Indonesia
      </h1>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
