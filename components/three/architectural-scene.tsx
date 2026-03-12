"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface ArchitecturalSceneProps {
  progress: number;
  onReady?: () => void;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const segment = (progress: number, start: number, end: number) => {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  const t = (progress - start) / (end - start);
  return t * t * (3 - 2 * t);
};

function SceneReadyReporter({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return null;
}

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const desiredPosition = useRef(new THREE.Vector3(12.4, 4.5, 17.6));
  const desiredLookAt = useRef(new THREE.Vector3(0.15, 2.8, 0));

  useFrame((_, delta) => {
    const orbit = Math.sin(progress * Math.PI * 0.76) * 0.62;
    const lateral = Math.sin(progress * Math.PI * 1.18) * 0.22;
    const dolly = progress * 0.55;
    const rise = progress * 2.35;

    desiredPosition.current.set(12.2 + orbit + lateral, 4.2 + rise, 17.8 - dolly);
    desiredLookAt.current.set(0.08 + progress * 0.18, 2.1 + progress * 5.1, 0.02);

    camera.position.lerp(desiredPosition.current, 1 - Math.exp(-delta * 2.8));
    camera.lookAt(desiredLookAt.current);
  });

  return null;
}

function AtmosphereParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 960;
    const values = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 38;
      values[i * 3 + 1] = Math.random() * 24 - 4;
      values[i * 3 + 2] = (Math.random() - 0.5) * 34;
    }

    return values;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#b8d8f6" transparent opacity={0.22} size={0.05} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function SiteGrid() {
  const grid = useMemo(() => {
    const helper = new THREE.GridHelper(44, 44, "#37536f", "#152435");
    const materials = Array.isArray(helper.material) ? helper.material : [helper.material];

    materials.forEach((material) => {
      const lineMaterial = material as THREE.Material & {
        opacity: number;
        transparent: boolean;
        depthWrite: boolean;
      };
      lineMaterial.transparent = true;
      lineMaterial.opacity = 0.28;
      lineMaterial.depthWrite = false;
    });

    return helper;
  }, []);

  return <primitive object={grid} position={[0, -3.18, 0]} scale={[1.18, 1, 1.18]} />;
}

function Tree({
  position,
  scale = 1,
  reveal = 1
}: {
  position: [number, number, number];
  scale?: number;
  reveal?: number;
}) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  return (
    <group position={position} scale={scale * (0.72 + visible * 0.28)}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.58, 10]} />
        <meshStandardMaterial color="#465668" roughness={0.84} metalness={0.06} />
      </mesh>
      <mesh position={[-0.14, 0.84, 0.04]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#3d6355" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh position={[0.16, 0.9, 0.02]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#4b725f" roughness={0.9} metalness={0.02} />
      </mesh>
      <mesh position={[0.02, 1.14, -0.06]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#5d836d" roughness={0.88} metalness={0.02} />
      </mesh>
    </group>
  );
}

function Lamp({
  position,
  reveal = 1
}: {
  position: [number, number, number];
  reveal?: number;
}) {
  const visible = clamp(reveal);
  if (visible <= 0.01) return null;

  return (
    <group position={position}>
      <mesh position={[0, 0.56, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.03, 1.12, 10]} />
        <meshStandardMaterial color="#7a90a7" roughness={0.44} metalness={0.74} />
      </mesh>
      <mesh position={[0, 1.13, 0]}>
        <sphereGeometry args={[0.08, 14, 14]} />
        <meshStandardMaterial color="#ebf6ff" emissive="#9ed3ff" emissiveIntensity={visible * 2.1} />
      </mesh>
      <pointLight position={[0, 1.13, 0]} intensity={visible * 1.2} distance={3.8} color="#9dd5ff" />
    </group>
  );
}

function Skyline({ progress }: { progress: number }) {
  const reveal = segment(progress, 0.24, 0.74);
  const night = segment(progress, 0.74, 1);

  const towers = useMemo(
    () => [
      [-15.5, 1.9, -13.8, 2.2, 8.8, 1.8],
      [-12.4, 1.4, -14.6, 1.6, 7.1, 1.3],
      [-9.2, 1.1, -13.1, 1.2, 5.9, 1.0],
      [11.6, 1.8, -13.2, 2.1, 8.2, 1.6],
      [14.7, 1.35, -14.1, 1.5, 7.2, 1.2],
      [17.9, 1.0, -15.5, 1.1, 5.9, 0.94]
    ] as Array<[number, number, number, number, number, number]>,
    []
  );

  return (
    <group>
      {towers.map(([x, y, z, width, height, depth], index) => (
        <group key={`skyline-${index}`} position={[x, y, z]} scale={[1, 0.72 + reveal * 0.28, 1]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#233140" roughness={0.96} metalness={0.06} transparent opacity={0.24 + reveal * 0.18} />
          </mesh>

          {Array.from({ length: Math.max(4, Math.floor(height * 1.4)) }).map((_, row) =>
            Array.from({ length: Math.max(2, Math.floor(width * 1.6)) }).map((__, col) => (
              <mesh key={`window-${index}-${row}-${col}`} position={[-width * 0.32 + col * 0.34, -height * 0.36 + row * 0.46, depth * 0.51]}>
                <boxGeometry args={[0.08, 0.16, 0.02]} />
                <meshStandardMaterial color="#d9efff" emissive="#b3ddff" emissiveIntensity={(0.06 + ((row + col + index) % 3) * 0.08) * night} />
              </mesh>
            ))
          )}
        </group>
      ))}
    </group>
  );
}

function ParkEnvironment({ progress }: { progress: number }) {
  const parkReveal = segment(progress, 0.54, 0.84);
  const night = segment(progress, 0.74, 1);

  const treePositions = useMemo(
    () =>
      [
        [-5.8, -2.82, 5.2, 0.94],
        [-4.7, -2.82, 4.0, 1.04],
        [-3.2, -2.82, 6.1, 0.72],
        [-1.8, -2.82, 5.9, 0.62],
        [5.8, -2.82, 5.0, 0.94],
        [4.5, -2.82, 4.0, 1.02],
        [3.1, -2.82, 6.1, 0.72],
        [1.8, -2.82, 5.8, 0.62]
      ] as Array<[number, number, number, number]>,
    []
  );

  const lampPositions = useMemo(
    () =>
      [
        [-4.2, -2.82, 4.7],
        [-1.4, -2.82, 5.95],
        [1.4, -2.82, 5.95],
        [4.2, -2.82, 4.7],
        [0, -2.82, 5.1]
      ] as Array<[number, number, number]>,
    []
  );

  return (
    <group>
      <SiteGrid />

      <mesh position={[0, -3.34, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[24, 96]} />
        <meshStandardMaterial color="#09111a" roughness={0.98} metalness={0.02} />
      </mesh>

      <mesh position={[0, -3.28, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[3.3, 6.4, 80]} />
        <meshStandardMaterial color="#13202d" roughness={0.94} metalness={0.08} />
      </mesh>

      <mesh position={[0, -3.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.52, 72]} />
        <meshStandardMaterial color="#0b1823" roughness={0.14} metalness={0.08} emissive="#7ebfff" emissiveIntensity={0.08 + night * 0.16} />
      </mesh>

      <mesh position={[-6.3, -3.29, 4.9]} rotation={[-Math.PI / 2, 0.24, 0]} receiveShadow>
        <planeGeometry args={[6.3, 3.7]} />
        <meshStandardMaterial color="#13241d" roughness={0.98} metalness={0.02} transparent opacity={0.18 + parkReveal * 0.44} />
      </mesh>
      <mesh position={[6.3, -3.29, 4.9]} rotation={[-Math.PI / 2, -0.24, 0]} receiveShadow>
        <planeGeometry args={[6.3, 3.7]} />
        <meshStandardMaterial color="#13241d" roughness={0.98} metalness={0.02} transparent opacity={0.18 + parkReveal * 0.44} />
      </mesh>

      <mesh position={[-5.25, -3.22, 4.95]} rotation={[-Math.PI / 2, 0.3, 0]}>
        <planeGeometry args={[4.8, 1.18]} />
        <meshStandardMaterial color="#2b3945" roughness={0.88} metalness={0.14} transparent opacity={0.3 + parkReveal * 0.48} />
      </mesh>
      <mesh position={[5.25, -3.22, 4.95]} rotation={[-Math.PI / 2, -0.3, 0]}>
        <planeGeometry args={[4.8, 1.18]} />
        <meshStandardMaterial color="#2b3945" roughness={0.88} metalness={0.14} transparent opacity={0.3 + parkReveal * 0.48} />
      </mesh>

      {treePositions.map(([x, y, z, scale], index) => (
        <Tree key={`tree-${index}`} position={[x, y, z]} scale={scale} reveal={parkReveal} />
      ))}

      {lampPositions.map((position, index) => (
        <Lamp key={`lamp-${index}`} position={position} reveal={night} />
      ))}
    </group>
  );
}

function BlueprintOutline({ progress }: { progress: number }) {
  const geometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(4.7, 15.4, 5.2)), []);
  const fadeOut = 1 - segment(progress, 0.18, 0.52);

  if (fadeOut <= 0.01) return null;

  return (
    <lineSegments geometry={geometry} position={[0.12, 5.5, 0.08]}>
      <lineBasicMaterial color="#84c0f7" transparent opacity={0.08 + fadeOut * 0.18} />
    </lineSegments>
  );
}

function TowerAssembly({ progress }: { progress: number }) {
  const foundation = segment(progress, 0.12, 0.24);
  const columns = segment(progress, 0.24, 0.38);
  const frame = segment(progress, 0.38, 0.52);
  const floors = segment(progress, 0.52, 0.68);
  const facade = segment(progress, 0.68, 0.82);
  const upper = segment(progress, 0.82, 0.94);
  const roof = segment(progress, 0.94, 1);
  const night = segment(progress, 0.74, 1);

  const baseY = -2.84;
  const shaftBaseY = 1.68;
  const floorLevels = 16;
  const floorHeight = 0.74;
  const shaftHeight = floorLevels * floorHeight;

  const columnPositions = useMemo(
    () => [
      [-1.78, -1.42],
      [-0.64, -1.42],
      [0.52, -1.42],
      [1.68, -1.42],
      [-1.78, 1.32],
      [-0.64, 1.32],
      [0.52, 1.32],
      [1.68, 1.32]
    ] as Array<[number, number]>,
    []
  );

  const frontWindowColumns = [-1.18, -0.6, -0.02, 0.56, 1.14];
  const sideWindowColumns = [-0.96, 0, 0.96];
  const edgeStrips = [
    [-1.86, shaftBaseY + shaftHeight / 2, 1.6],
    [1.82, shaftBaseY + shaftHeight / 2, 1.6],
    [-1.86, shaftBaseY + shaftHeight / 2, -1.54],
    [1.82, shaftBaseY + shaftHeight / 2, -1.54]
  ] as Array<[number, number, number]>;

  return (
    <group position={[0, baseY, 0]}>
      <BlueprintOutline progress={progress} />

      <mesh position={[0, 0.14 * foundation, 0]} scale={[10.8, 0.28 * foundation, 10.8]} receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#414a55" roughness={0.92} metalness={0.06} />
      </mesh>

      <mesh position={[0, 0.7 * foundation, 0]} scale={[7.1, 1.18 * foundation, 6.8]} receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#434f5b" roughness={0.84} metalness={0.08} />
      </mesh>

      <mesh position={[0.04, 1.56 * foundation, 0.08]} scale={[5.02, 0.86 * foundation, 4.86]} receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a5867" roughness={0.76} metalness={0.16} />
      </mesh>

      <mesh position={[0.02, 2.02 * foundation, 0.04]} scale={[4.28, 0.16 * foundation, 4.34]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d5e7f7" roughness={0.18} metalness={0.34} transparent opacity={0.08 + night * 0.08} emissive="#9ed1ff" emissiveIntensity={0.04 + night * 0.14} />
      </mesh>

      <mesh position={[0.02, 2.24 * foundation, 1.74]} scale={[3.86, 0.52 * foundation, 0.08]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#8cb8e2"
          transparent
          opacity={0.14 + foundation * 0.22}
          roughness={0.12}
          metalness={0.24}
          transmission={0.92}
          thickness={0.4}
          emissive="#8ec8ff"
          emissiveIntensity={night * 0.16}
        />
      </mesh>

      <mesh position={[0.02, 2.06 * foundation, 2.14]} scale={[4.9, 0.04 * foundation, 0.62]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#90a7bf" roughness={0.28} metalness={0.68} />
      </mesh>

      <mesh position={[0.02, 2.58 * foundation, 1.08]} scale={[3.2, 0.1 * foundation, 2.06]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#dbe9f7" roughness={0.16} metalness={0.46} transparent opacity={0.04 + night * 0.06} emissive="#96ceff" emissiveIntensity={night * 0.14} />
      </mesh>

      {columnPositions.map(([x, z], index) => {
        const reveal = segment(columns, Math.max(0, index * 0.04), Math.min(1, 0.78 + index * 0.02));
        const height = shaftHeight + 2.1;

        return (
          <mesh key={`column-${index}`} position={[x, shaftBaseY + (height * reveal) / 2, z]} scale={[0.14, height * reveal, 0.14]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#9baabd" roughness={0.32} metalness={0.82} />
          </mesh>
        );
      })}

      {Array.from({ length: floorLevels }).map((_, level) => {
        const reveal = segment(frame, Math.max(0, level * 0.048 - 0.08), Math.min(1, 0.34 + level * 0.042));
        const y = shaftBaseY + level * floorHeight;

        return (
          <group key={`frame-${level}`}>
            <mesh position={[0.02, y, -1.48]} scale={[3.52 * reveal, 0.07, 0.1]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#8093a7" roughness={0.44} metalness={0.7} />
            </mesh>
            <mesh position={[0.02, y, 1.36]} scale={[3.52 * reveal, 0.07, 0.1]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#8093a7" roughness={0.44} metalness={0.7} />
            </mesh>
            <mesh position={[-1.84, y, -0.06]} scale={[0.1, 0.07, 2.94 * reveal]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#768ca1" roughness={0.46} metalness={0.68} />
            </mesh>
            <mesh position={[1.88, y, -0.06]} scale={[0.1, 0.07, 2.94 * reveal]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#768ca1" roughness={0.46} metalness={0.68} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: floorLevels }).map((_, level) => {
        const reveal = segment(floors, Math.max(0, level * 0.048 - 0.12), Math.min(1, 0.42 + level * 0.04));
        const y = shaftBaseY - 0.07 + level * floorHeight;

        return (
          <group key={`plate-${level}`}>
            <mesh position={[0.02, y, -0.06]} scale={[3.64 * reveal, 0.06, 3.08 * reveal]} castShadow receiveShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#4a5e72" roughness={0.56} metalness={0.42} />
            </mesh>

            {level < 10 ? (
              <mesh position={[2.28, y + 0.02, 1.36]} scale={[0.58 * reveal, 0.04, 0.88 * reveal]} castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#61778d" roughness={0.46} metalness={0.34} />
              </mesh>
            ) : null}
          </group>
        );
      })}

      <mesh position={[0.02, shaftBaseY + shaftHeight / 2, -0.02]} scale={[3.16, shaftHeight * floors, 2.98]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3f4e5e" roughness={0.66} metalness={0.26} transparent opacity={0.12 + floors * 0.16} />
      </mesh>

      <mesh position={[-2.2, shaftBaseY + 3.9 * floors, 0.26]} scale={[0.78, 6.7 * floors, 1.48]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#46586a" roughness={0.68} metalness={0.18} transparent opacity={0.12 + floors * 0.12} />
      </mesh>

      <mesh position={[1.98, shaftBaseY + 5.4 * floors, -0.12]} scale={[0.42, 8.2 * floors, 0.92]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#42586b" roughness={0.66} metalness={0.22} transparent opacity={0.1 + floors * 0.1} />
      </mesh>

      {Array.from({ length: floorLevels }).map((_, row) => {
        const reveal = segment(facade, Math.max(0, row * 0.042 - 0.16), Math.min(1, 0.44 + row * 0.034));
        const y = shaftBaseY + 0.34 + row * floorHeight;
        const glow = clamp(segment(progress, 0.76, 1) + (Math.sin(row * 1.8) + 1) * 0.05, 0, 1);

        return (
          <group key={`facade-${row}`}>
            <mesh position={[0.02, y, 1.44]} scale={[2.96, 0.56 * reveal, 0.03]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial
                color="#82abd4"
                transparent
                opacity={0.12 + reveal * 0.28}
                roughness={0.1}
                metalness={0.34}
                transmission={0.92}
                thickness={0.42}
                emissive="#95cbff"
                emissiveIntensity={glow * 0.22}
              />
            </mesh>

            <mesh position={[1.84, y, -0.02]} scale={[0.03, 0.56 * reveal, 2.8]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial
                color="#7ea8d1"
                transparent
                opacity={0.1 + reveal * 0.24}
                roughness={0.12}
                metalness={0.3}
                transmission={0.9}
                thickness={0.4}
                emissive="#91c8ff"
                emissiveIntensity={glow * 0.18}
              />
            </mesh>

            {frontWindowColumns.map((x, column) => (
              <mesh key={`front-window-${row}-${column}`} position={[x, y, 1.46]}>
                <boxGeometry args={[0.36, 0.42 * reveal, 0.04]} />
                <meshStandardMaterial
                  color="#e2f2ff"
                  emissive="#c3e3ff"
                  emissiveIntensity={(0.08 + ((row + column) % 3) * 0.05) * night}
                  transparent
                  opacity={0.18 + reveal * 0.56}
                />
              </mesh>
            ))}

            {sideWindowColumns.map((z, column) => (
              <mesh key={`side-window-${row}-${column}`} position={[1.86, y, z]}>
                <boxGeometry args={[0.04, 0.4 * reveal, 0.24]} />
                <meshStandardMaterial
                  color="#e2f2ff"
                  emissive="#c3e3ff"
                  emissiveIntensity={(0.06 + ((row + column) % 2) * 0.05) * night}
                  transparent
                  opacity={0.16 + reveal * 0.48}
                />
              </mesh>
            ))}

            {row < 10 ? (
              <mesh position={[-2.2, y, 0.82]} scale={[0.04, 0.38 * reveal, 0.94]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                  color="#79a3cb"
                  transparent
                  opacity={0.1 + reveal * 0.22}
                  roughness={0.14}
                  metalness={0.28}
                  transmission={0.9}
                  thickness={0.36}
                  emissive="#89c1fb"
                  emissiveIntensity={glow * 0.12}
                />
              </mesh>
            ) : null}
          </group>
        );
      })}

      {frontWindowColumns.map((x, index) => (
        <mesh key={`mullion-front-${index}`} position={[x, shaftBaseY + shaftHeight / 2, 1.47]} scale={[0.06, shaftHeight * facade, 0.03]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8fa6bc" roughness={0.32} metalness={0.72} transparent opacity={0.28 + facade * 0.36} />
        </mesh>
      ))}

      {sideWindowColumns.map((z, index) => (
        <mesh key={`mullion-side-${index}`} position={[1.86, shaftBaseY + shaftHeight / 2, z]} scale={[0.03, shaftHeight * facade, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8fa6bc" roughness={0.34} metalness={0.7} transparent opacity={0.24 + facade * 0.32} />
        </mesh>
      ))}

      {edgeStrips.map((position, index) => (
        <mesh key={`edge-strip-${index}`} position={position} scale={[0.04, shaftHeight * facade, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#9cc9ef" emissive="#92cbff" emissiveIntensity={night * 0.36} transparent opacity={0.18 + facade * 0.24} />
        </mesh>
      ))}

      {Array.from({ length: 8 }).map((_, level) => {
        const reveal = segment(facade, Math.max(0, level * 0.07 - 0.08), Math.min(1, 0.62 + level * 0.05));
        const y = shaftBaseY + 0.7 + level * 1.18;

        return (
          <mesh key={`terrace-${level}`} position={[2.02, y, 1.42]} scale={[0.08, 0.04, 0.86 * reveal]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#d8e8f7" roughness={0.22} metalness={0.58} transparent opacity={0.16 + reveal * 0.24} />
          </mesh>
        );
      })}

      {Array.from({ length: 6 }).map((_, level) => {
        const reveal = segment(upper, Math.max(0, level * 0.08 - 0.08), Math.min(1, 0.62 + level * 0.06));
        const y = shaftBaseY + shaftHeight + 0.44 + level * 0.48;
        const width = 2.18 - level * 0.12;
        const depth = 2.02 - level * 0.1;

        return (
          <group key={`upper-${level}`}>
            <mesh position={[0.18, y, -0.04]} scale={[width * reveal, 0.08, depth * reveal]} castShadow receiveShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#4d6073" roughness={0.52} metalness={0.36} />
            </mesh>
            <mesh position={[0.18, y + 0.28, -0.04]} scale={[width * 0.82, 0.52 * reveal, depth * 0.82]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial
                color="#89b5de"
                transparent
                opacity={0.14 + reveal * 0.28}
                roughness={0.12}
                metalness={0.3}
                transmission={0.9}
                thickness={0.34}
                emissive="#91cbff"
                emissiveIntensity={night * 0.14}
              />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0.18, shaftBaseY + shaftHeight + 3.52, -0.04]} scale={[1.08 * roof, 0.12, 1.02 * roof]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#dbe6f0" roughness={0.22} metalness={0.7} />
      </mesh>

      <mesh position={[0.4, shaftBaseY + shaftHeight + 3.92, 0.22]} scale={[0.38 * roof, 0.34 * roof, 0.34 * roof]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c9d7e5" roughness={0.24} metalness={0.66} />
      </mesh>

      <mesh position={[0.38, shaftBaseY + shaftHeight + 4.44, 0.24]} scale={[0.08, 0.84 * roof, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#9ac3ea" roughness={0.2} metalness={0.62} emissive="#98cdff" emissiveIntensity={roof * 0.48} />
      </mesh>

      <pointLight position={[0.18, shaftBaseY + shaftHeight * 0.64, 1.7]} intensity={0.42 + night * 0.34} distance={20} color="#a9d6ff" />
      <pointLight position={[0.06, 2.3, 1.6]} intensity={0.26 + night * 0.3} distance={8} color="#a9dbff" />
      <pointLight position={[0.38, shaftBaseY + shaftHeight + 4.5, 0.24]} intensity={roof * 0.8} distance={7} color="#a6d7ff" />
    </group>
  );
}

export default function ArchitecturalScene({ progress, onReady }: ArchitecturalSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [12.4, 4.5, 17.6], fov: 31, near: 0.1, far: 140 }}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={["#06101a", 12, 46]} />

      <SceneReadyReporter onReady={onReady} />

      <ambientLight intensity={0.22} color="#a6c5e2" />
      <hemisphereLight intensity={0.24} color="#b6d0ea" groundColor="#102132" />
      <directionalLight position={[-9, 13, 8]} intensity={1.05} color="#dcecff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <spotLight position={[9, 16, 12]} angle={0.32} penumbra={0.7} intensity={1.6} color="#d8ebff" castShadow />
      <spotLight position={[-12, 9, 14]} angle={0.44} penumbra={0.84} intensity={0.58} color="#8bc6ff" />

      <ParkEnvironment progress={progress} />
      <Skyline progress={progress} />
      <TowerAssembly progress={progress} />
      <ContactShadows position={[0, -3.14, 0]} opacity={0.42} scale={18} blur={2.8} far={10} color="#04070c" />
      <AtmosphereParticles />
      <CameraRig progress={progress} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.5} luminanceThreshold={0.28} luminanceSmoothing={0.82} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
