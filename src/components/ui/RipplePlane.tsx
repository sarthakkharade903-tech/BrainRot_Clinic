import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Custom Shader for soft, fading interactive ripples ──────────────────────
const RippleShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#4a6b8c') }, // Deep calming blue by default
    uRipples: { value: [] as THREE.Vector4[] }, // Array of Vector4 (x, y, startTime, intensity)
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec4 uRipples[10]; // Max 10 active ripples

    varying vec2 vUv;

    void main() {
      vec3 finalColor = vec3(0.0);
      float alpha = 0.0;

      // Aspect ratio correction (assume roughly 16:9 for screen space UVs)
      vec2 uv = vUv;
      uv.x *= 1.77; 

      for(int i = 0; i < 10; i++) {
        vec4 ripple = uRipples[i];
        if (ripple.w > 0.0) { // If intensity > 0
          vec2 center = ripple.xy;
          center.x *= 1.77; // Match aspect ratio
          
          float timeSince = uTime - ripple.z;
          if (timeSince > 0.0 && timeSince < 5.0) {
            float dist = distance(uv, center);
            
            // The wave expands over time: radius = timeSince * speed
            float radius = timeSince * 0.15;
            float thickness = 0.05 + timeSince * 0.02; // Gets thicker and softer as it expands
            
            // Gaussian-like ring
            float ring = exp(-pow(dist - radius, 2.0) / pow(thickness, 2.0));
            
            // Fade out over 5 seconds
            float fade = max(0.0, 1.0 - (timeSince / 5.0));
            
            float intensity = ring * fade * ripple.w;
            
            finalColor += uColor * intensity;
            alpha += intensity;
          }
        }
      }

      // Add a very subtle base ambient glow that breathes
      float baseGlow = (sin(uTime * 0.5) * 0.5 + 0.5) * 0.02;
      finalColor += uColor * baseGlow;
      alpha += baseGlow;

      gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    }
  `
};

export const RipplePlane: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();
  
  const [ripples, setRipples] = useState<THREE.Vector4[]>(
    () => Array.from({ length: 10 }, () => new THREE.Vector4(0, 0, -10, 0))
  );
  const rippleIndexRef = useRef(0);


  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      // Sync uniforms array
      materialRef.current.uniforms.uRipples.value = ripples;
    }
  });

  const handlePointerDown = (e: any) => {
    // e.uv contains the normalized 0-1 coordinates of the click on the plane
    if (e.uv) {
      const newRipples = [...ripples];
      const idx = rippleIndexRef.current;
      
      // We pass: x, y, startTime, intensity
      // Intensity determines how bright the ripple is
      newRipples[idx] = new THREE.Vector4(
        e.uv.x, 
        e.uv.y, 
        materialRef.current?.uniforms.uTime.value || 0, 
        0.8 // Intensity
      );
      
      setRipples(newRipples);
      rippleIndexRef.current = (idx + 1) % 10;
    }
  };

  return (
    <mesh 
      onPointerDown={handlePointerDown}
      // Fill the viewport. The plane size matches the orthographic/perspective bounds
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial 
        ref={materialRef}
        attach="material"
        args={[RippleShader]}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
