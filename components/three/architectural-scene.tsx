"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface ArchitecturalSceneProps {
  progress: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const segment = (progress: number, start: number, end: number) => {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  const t = (progress - start) / (end - start);
  return t * t * (3 - 2 * t);
};

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(9, 5, 16));
  const targetLook = useRef(new THREE.Vector3(0, 2, 0));

  useFrame((_, delta) => {
    const orbit = Math.sin(progress * Math.PI * 1.45) * 1.25;
    targetPos.current.set(8.8 - progress * 3.8 + orbit, 4.2 + progress * 7.1, 17 - progress * 8.2);
    camera.position.lerp(targetPos.current, 1 - Math.exp(-delta * 2.45));

    targetLook.current.set(0, 1.6 + progress * 5.2, 0);
    camera.lookAt(targetLook.current);
  });

  return null;
}

function AtmosphereParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 950;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = Math.random() * 22 - 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#a7c9e8" transparent opacity={0.3} size={0.045} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function TowerAssembly({ progress }: { progress: number }) {
  const foundation = segment(progress, 0.08, 0.2);
  const columns = segment(progress, 0.17, 0.34);
  const beams = segment(progress, 0.28, 0.48);
  const floors = segment(progress, 0.4, 0.64);
  const facade = segment(progress, 0.56, 0.82);
  const upper = segment(progress, 0.74, 0.91);
  const roof = segment(progress, 0.87, 1);

  const mainLevels = 11;
  const upperLevels = 4;
  const floorHeight = 0.8;
  const baseY = -2.8;

  const columnPositions = useMemo(
    () => [
      [-2.3, -2.3],
      [0, -2.3],
      [2.3, -2.3],
      [-2.3, 0],
      [2.3, 0],
      [-2.3, 2.3],
      [0, 2.3],
      [2.3, 2.3]
    ],
    []
  );

  const facadeRows = useMemo(() => Array.from({ length: 15 }, (_, index) => index), []);

  return (
    <group>
      <mesh position={[0, -3.34, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[22, 96]} />
        <meshStandardMaterial color="#0b1119" roughness={0.98} metalness={0.03} />
      </mesh>

      <gridHelper args={[32, 64, "#2f4459", "#182433"]} position={[0, -3.33, 0]} />

      <group position={[0, baseY, 0]}>
        <mesh position={[0, 0.35 * foundation, 0]} scale={[10.5, 0.8 * foundation, 10.5]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#2a313a" roughness={0.9} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.85 * foundation, 0]} scale={[8.7, 0.54 * foundation, 8.7]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#323a44" roughness={0.84} metalness={0.12} />
        </mesh>
        <mesh position={[0, 1.2 * foundation, 0]} scale={[6.5, 0.3 * foundation, 6.5]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#303949" roughness={0.68} metalness={0.22} />
        </mesh>

        {columnPositions.map(([x, z], idx) => {
          const p = segment(columns, Math.max(0, idx * 0.04), Math.min(1, 0.7 + idx * 0.03));
          const height = mainLevels * floorHeight + 1.2;
          return (
            <mesh key={`col-${x}-${z}`} position={[x, 1.2 + (height * p) / 2, z]} scale={[0.26, height * p, 0.26]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#8f9eb0" roughness={0.36} metalness={0.76} />
            </mesh>
          );
        })}

        {Array.from({ length: mainLevels }, (_, level) => {
          const levelP = segment(beams, Math.max(0, level * 0.07 - 0.08), Math.min(1, 0.33 + level * 0.07));
          const y = 1.4 + level * floorHeight;
          return (
            <group key={`beam-level-${level}`}>
              <mesh position={[0, y, -2.3]} scale={[4.7 * levelP, 0.12, 0.18]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#75889f" roughness={0.45} metalness={0.65} />
              </mesh>
              <mesh position={[0, y, 2.3]} scale={[4.7 * levelP, 0.12, 0.18]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#75889f" roughness={0.45} metalness={0.65} />
              </mesh>
              <mesh position={[-2.3, y, 0]} scale={[0.18, 0.12, 4.7 * levelP]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#75889f" roughness={0.45} metalness={0.65} />
              </mesh>
              <mesh position={[2.3, y, 0]} scale={[0.18, 0.12, 4.7 * levelP]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#75889f" roughness={0.45} metalness={0.65} />
              </mesh>
            </group>
          );
        })}

        {Array.from({ length: mainLevels }, (_, level) => {
          const levelP = segment(floors, Math.max(0, level * 0.08 - 0.12), Math.min(1, 0.45 + level * 0.08));
          const y = 1.28 + level * floorHeight;
          return (
            <mesh key={`plate-${level}`} position={[0, y, 0]} scale={[4.95 * levelP, 0.08, 4.95 * levelP]} castShadow receiveShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#455567" roughness={0.58} metalness={0.42} />
            </mesh>
          );
        })}

        {facadeRows.map((row) => {
          const panelP = segment(facade, Math.max(0, row * 0.06 - 0.2), Math.min(1, 0.34 + row * 0.05));
          const y = 1.52 + row * 0.58;
          const glow = clamp(segment(progress, 0.83, 1) + (Math.sin(row * 2.1) + 1) * 0.08, 0, 1);
          return (
            <group key={`facade-row-${row}`}>
              <mesh position={[0, y, 2.43]} scale={[4.2, 0.5 * panelP, 0.03]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                  color="#7da5ce"
                  transparent
                  opacity={0.14 + panelP * 0.3}
                  roughness={0.12}
                  metalness={0.28}
                  transmission={0.9}
                  thickness={0.6}
                  emissive="#9ecfff"
                  emissiveIntensity={glow * 0.3}
                />
              </mesh>
              <mesh position={[0, y, -2.43]} scale={[4.2, 0.5 * panelP, 0.03]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                  color="#7da5ce"
                  transparent
                  opacity={0.12 + panelP * 0.28}
                  roughness={0.14}
                  metalness={0.28}
                  transmission={0.88}
                  thickness={0.55}
                  emissive="#8ec4fa"
                  emissiveIntensity={glow * 0.28}
                />
              </mesh>
              <mesh position={[2.43, y, 0]} scale={[0.03, 0.5 * panelP, 4.2]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                  color="#7199c2"
                  transparent
                  opacity={0.11 + panelP * 0.26}
                  roughness={0.15}
                  metalness={0.3}
                  transmission={0.9}
                  thickness={0.6}
                  emissive="#8bc1f8"
                  emissiveIntensity={glow * 0.26}
                />
              </mesh>
              <mesh position={[-2.43, y, 0]} scale={[0.03, 0.5 * panelP, 4.2]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                  color="#7199c2"
                  transparent
                  opacity={0.11 + panelP * 0.26}
                  roughness={0.15}
                  metalness={0.3}
                  transmission={0.9}
                  thickness={0.6}
                  emissive="#8bc1f8"
                  emissiveIntensity={glow * 0.26}
                />
              </mesh>
            </group>
          );
        })}

        {Array.from({ length: upperLevels }, (_, level) => {
          const levelP = segment(upper, Math.max(0, level * 0.12 - 0.1), Math.min(1, 0.55 + level * 0.12));
          const y = 10.3 + level * 0.82;
          const width = 3.65 - level * 0.18;
          return (
            <group key={`upper-${level}`}>
              <mesh position={[0, y, 0]} scale={[width * levelP, 0.11, width * levelP]} castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#4a5a6e" roughness={0.54} metalness={0.34} />
              </mesh>
              <mesh position={[0, y + 0.34, 0]} scale={[width * 0.88, 0.58 * levelP, width * 0.88]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                  color="#7ca4cd"
                  transparent
                  opacity={0.18 + levelP * 0.28}
                  roughness={0.14}
                  metalness={0.36}
                  transmission={0.86}
                  thickness={0.45}
                />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 13.9 + roof * 0.06, 0]} scale={[2.65 * roof, 0.1, 2.65 * roof]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#d8e3f0" roughness={0.28} metalness={0.68} />
        </mesh>
        <mesh position={[0.9, 14.25, 0.9]} scale={[0.32, 0.78 * roof, 0.32]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8db8e6" roughness={0.24} metalness={0.6} emissive="#8ec2fa" emissiveIntensity={roof * 0.55} />
        </mesh>
      </group>

      <pointLight position={[0, 9, 2]} intensity={0.5 + progress * 0.6} distance={24} color="#a8d3ff" />
      <spotLight position={[10, 18, 8]} angle={0.35} penumbra={0.6} intensity={1.8} color="#c9e0ff" castShadow />
      <directionalLight position={[-6, 12, 6]} intensity={1.05} color="#d8e7ff" castShadow />
    </group>
  );
}

export default function ArchitecturalScene({ progress }: ArchitecturalSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.7]}
      camera={{ position: [9, 4, 16], fov: 34, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 10, 44]} />

      <ambientLight intensity={0.16} color="#97b6d6" />
      <hemisphereLight intensity={0.24} color="#a8c9ea" groundColor="#142030" />

      <TowerAssembly progress={progress} />
      <AtmosphereParticles />
      <CameraRig progress={progress} />

      <OrbitControls enabled={false} />

      <EffectComposer>
        <Bloom intensity={0.62} mipmapBlur luminanceThreshold={0.42} luminanceSmoothing={0.82} />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.24} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
