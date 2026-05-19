import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Debris plane definitions ──────────────────────────────────────────────────
// Each represents a dissolved internet fragment: feed card, notification bar,
// loading strip, caption block — barely visible, floating in a digital void.
const DEBRIS = [
  { pos: [-4.5,  1.2, -5.5] as [number,number,number], rot: [ 0.10,  0.30,  0.05] as [number,number,number], w: 2.4, h: 0.22, op: 0.05,  ph: 0.0  },
  { pos: [ 3.8, -0.8, -4.5] as [number,number,number], rot: [-0.05, -0.20,  0.10] as [number,number,number], w: 1.5, h: 0.10, op: 0.04,  ph: 1.2  },
  { pos: [-2.1, -1.8, -7.0] as [number,number,number], rot: [ 0.08,  0.15, -0.06] as [number,number,number], w: 3.2, h: 0.15, op: 0.035, ph: 2.4  },
  { pos: [ 5.2,  0.4, -8.0] as [number,number,number], rot: [-0.12,  0.08,  0.04] as [number,number,number], w: 1.8, h: 0.28, op: 0.045, ph: 0.7  },
  { pos: [-6.0,  1.6, -9.5] as [number,number,number], rot: [ 0.06, -0.10,  0.08] as [number,number,number], w: 2.6, h: 0.13, op: 0.03,  ph: 3.1  },
  { pos: [ 1.3,  2.2, -6.0] as [number,number,number], rot: [ 0.15,  0.25, -0.10] as [number,number,number], w: 1.0, h: 0.07, op: 0.04,  ph: 1.8  },
  { pos: [-3.0, -2.4, -6.5] as [number,number,number], rot: [-0.08,  0.12,  0.05] as [number,number,number], w: 1.6, h: 0.11, op: 0.038, ph: 4.2  },
];

// ── Scene content (must live inside <Canvas> context) ────────────────────────
const SceneContent: React.FC = () => {
  const { pointer } = useThree();

  // ── Particle geometry (created once imperatively — most reliable approach) ──
  const particlePositions = useMemo(() => {
    const count = 65;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 28; // x spread
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18; // y spread
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4; // z: pushed back
    }
    return arr;
  }, []);

  const geoRef = useRef<THREE.BufferGeometry>(null!);
  useEffect(() => {
    if (geoRef.current) {
      geoRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(particlePositions, 3)
      );
    }
  }, [particlePositions]);

  const particlesRef = useRef<THREE.Points>(null!);
  const debrisRefs   = useRef<Array<THREE.Mesh | null>>(Array(DEBRIS.length).fill(null));

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;

    // ── Camera: mouse parallax + ambient breath ──────────────────────────
    // Mouse parallax — lerped so it feels weighted, not instant
    const targetX = pointer.x * 0.45;
    const targetY = pointer.y * 0.28;
    camera.position.x += (targetX - camera.position.x) * 0.022;
    camera.position.y += (targetY - camera.position.y) * 0.022;

    // Ambient breathing motion layered on top of parallax
    camera.position.y += Math.sin(t * 0.13) * 0.034;
    camera.position.x += Math.sin(t * 0.09 + 1.4) * 0.024;
    camera.position.z = 0;

    camera.lookAt(0, 0, -4);

    // ── Particles: imperceptibly slow rotation ───────────────────────────
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.006;
      particlesRef.current.rotation.x = Math.sin(t * 0.004) * 0.022;
    }

    // ── Debris: each plane drifts with unique phase ──────────────────────
    debrisRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = DEBRIS[i];
      mesh.position.y = d.pos[1] + Math.sin(t * 0.07 + d.ph)        * 0.18;
      mesh.position.x = d.pos[0] + Math.sin(t * 0.05 + d.ph * 1.35) * 0.10;
      mesh.rotation.z = d.rot[2] + Math.sin(t * 0.04 + d.ph)        * 0.016;
    });
  });

  return (
    <>
      {/* Fog — creates cinematic depth falloff without any postprocessing */}
      <fog attach="fog" args={['#050505', 5, 22]} />

      {/* Ambient light — almost zero, just enough for basic material */}
      <ambientLight intensity={0.06} />

      {/* ── Particle field ─────────────────────────────────────────────── */}
      <points ref={particlesRef}>
        <bufferGeometry ref={geoRef} />
        <pointsMaterial
          size={0.03}
          color="#ffffff"
          transparent
          opacity={0.13}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* ── Internet debris planes ──────────────────────────────────────── */}
      {DEBRIS.map((d, i) => (
        <mesh
          key={i}
          ref={el => { debrisRefs.current[i] = el; }}
          position={d.pos}
          rotation={d.rot}
        >
          <planeGeometry args={[d.w, d.h]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={d.op}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
};

// ── Exported canvas wrapper ───────────────────────────────────────────────────
export const AtmosphericScene: React.FC = () => (
  <div
    className="fixed inset-0 pointer-events-none"
    style={{ zIndex: 0 }}
    aria-hidden="true"
  >
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 0], fov: 70, near: 0.1, far: 30 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
      }}
      style={{ background: 'transparent' }}
    >
      <SceneContent />
    </Canvas>
  </div>
);
