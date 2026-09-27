import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { buildings, type CampusBuilding } from "@/lib/campus-data";

const STATUS_HEX: Record<CampusBuilding["status"], string> = {
  normal: "#2fb7e8",
  warning: "#e8a63a",
  alarm: "#e85a68",
};

function Block({
  b,
  active,
  onSelect,
}: {
  b: CampusBuilding;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { x, z, w, d, h } = b.model;

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const mesh = ref.current;
    if (!mesh) return;
    const target = active ? h * 1.12 : 1;
    mesh.scale.y += (target / h - mesh.scale.y / 1) * 0 + (target - mesh.scale.y * h) * dt * 4 / h;
  });

  const color = STATUS_HEX[b.status];

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={ref}
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(b.id);
        }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.85 : hovered ? 0.5 : 0.22}
          metalness={0.55}
          roughness={0.28}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* 顶部描边环 */}
      <mesh position={[0, h + 0.03, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[Math.max(w, d) * 0.52, Math.max(w, d) * 0.58, 32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.35} />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial color="#12243a" metalness={0.3} roughness={0.85} />
      </mesh>
      <gridHelper args={[26, 26, "#2c6c91", "#1c3f5c"]} position-y={0.005} />
      {/* 主干道 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0.2]}>
        <planeGeometry args={[24, 1.1]} />
        <meshStandardMaterial color="#1d3c58" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Rig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.08;
    camera.position.x = Math.sin(t) * 13;
    camera.position.z = Math.cos(t) * 13;
    camera.lookAt(0, 1, 0);
  });
  return null;
}

export default function CampusModel({
  selectedId,
  onSelect,
  autoRotate = true,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  autoRotate?: boolean;
}) {
  return (
    <Canvas shadows camera={{ position: [11, 8, 11], fov: 45 }} dpr={[1, 1.75]}>
      <color attach="background" args={["#0c1venv" as unknown as string]} />
      <fog attach="fog" args={["#0b1726", 22, 44]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment>
        <Lightformer intensity={2} position={[0, 6, 0]} scale={[12, 12, 1]} color="#8fd7ff" />
        <Lightformer
          intensity={1.2}
          color="#3d7fb5"
          position={[-6, 2, -2]}
          rotation-y={Math.PI / 2}
          scale={[20, 2, 1]}
        />
      </Environment>
      <Ground />
      {buildings.map((b) => (
        <Block key={b.id} b={b} active={b.id === selectedId} onSelect={onSelect} />
      ))}
      {autoRotate && !selectedId ? <Rig /> : null}
      <OrbitControls
        enablePan={false}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.35}
        minDistance={8}
        maxDistance={22}
      />
    </Canvas>
  );
}
