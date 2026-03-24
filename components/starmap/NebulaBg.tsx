'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */`
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */`
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPos;

  // Simple hash noise
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.01;

    // Base gradient: deep purple → dark blue → near-black
    vec3 col = mix(
      mix(vec3(0.039, 0.0, 0.082), vec3(0.0, 0.039, 0.102), uv.y),
      vec3(0.0, 0.0, 0.02),
      pow(abs(uv.x - 0.5) * 2.0, 1.5)
    );

    // Layer 1: faint cyan wisps
    float n1 = fbm(uv * 3.0 + vec2(t, t * 0.7));
    float n1b = fbm(uv * 5.0 - vec2(t * 0.5, t * 0.3));
    float cyan = smoothstep(0.45, 0.75, n1 * n1b * 2.0);
    col += vec3(0.0, 0.831, 1.0) * cyan * 0.05;

    // Layer 2: faint purple clouds
    float n2 = fbm(uv * 2.0 + vec2(-t * 0.4, t * 0.6) + 5.3);
    float purple = smoothstep(0.5, 0.8, n2);
    col += vec3(0.655, 0.545, 0.980) * purple * 0.035;

    // Layer 3: slight blue haze near center
    float dist = length((uv - 0.5) * 2.0);
    float haze = smoothstep(1.4, 0.3, dist) * 0.04;
    col += vec3(0.04, 0.15, 0.35) * haze;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function NebulaBg() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
