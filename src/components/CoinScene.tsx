import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Clouds, Cloud, Environment, Float } from '@react-three/drei';
import { MapPin } from 'lucide-react';
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
      rotation={[0, 0, Math.PI / 2.1]}
    />
  );
}

export function FogClouds() {
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud
        position={[-3, -1.2, -2]}
        speed={0.2}
        opacity={0.15}
        bounds={[4, 1, 1]}
        segments={8}
        color="#e8e8f0"
      />
      <Cloud
        position={[3, -1, -2.5]}
        speed={0.15}
        opacity={0.12}
        bounds={[4, 1, 1]}
        segments={8}
        color="#d8d8e8"
      />
      <Cloud
        position={[0, -1.5, -3]}
        speed={0.1}
        opacity={0.18}
        bounds={[5, 1.5, 1.5]}
        segments={10}
        color="#f0f0f8"
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
      <FogClouds />
      <Environment preset="night" />
    </>
  );
}

export default function CoinScene() {
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
      }}
    >
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
        Meanwhile visit us{' '}
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
          <Scene />
        </Canvas>
      </div>
    </div>
  );
}
