import React, { useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const NeuralScene = ({ onExplode }) => {
  const isMobile = window.innerWidth < 768;
  const progressObj = useRef({ value: 0 });
  const materialRef = useRef();
  const shockwaveRef = useRef();
  const shockwaveMatRef = useRef();

  const { positions } = useMemo(() => {
    const numPoints = isMobile ? 500 : 1500;
    const maxDist = 20;
    const connectDist = isMobile ? 3.5 : 2.5;

    const points = [];
    for (let i = 0; i < numPoints; i++) {
      // eslint-disable-next-line react-hooks/purity
      const r = maxDist * Math.cbrt(Math.random());
      // eslint-disable-next-line react-hooks/purity
      const theta = Math.random() * 2 * Math.PI;
      // eslint-disable-next-line react-hooks/purity
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      points.push(new THREE.Vector3(x, y, z));
    }

    const linePositions = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < connectDist) {
          linePositions.push(
            points[i].x, points[i].y, points[i].z,
            points[j].x, points[j].y, points[j].z
          );
        }
      }
    }

    return {
      positions: new Float32Array(linePositions)
    };
  }, [isMobile]);

  const vertexShader = `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uProgress;
    varying vec3 vPos;
    
    // Simple noise for spark jitter
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    void main() {
      vec3 baseColor = vec3(0.01, 0.03, 0.04); 
      vec3 activeColor = vec3(0.0, 0.95, 1.0); 
      
      // The spark travels from top-right (+15, +15) to center (0,0)
      vec3 startPos = vec3(15.0, 15.0, 5.0);
      vec3 dir = normalize(vec3(0.0) - startPos);
      float totalDist = length(vec3(0.0) - startPos);
      
      // Project current vertex along the travel direction
      float proj = dot(vPos - startPos, dir); 
      
      // Calculate current position of the wave front
      float waveFront = uProgress * (totalDist + 5.0); // +5.0 to ensure it passes completely
      
      // State of the line: has the wave passed it?
      float activated = smoothstep(waveFront + 2.0, waveFront, proj);
      
      // Spark happens exactly at the wave front
      float spark = smoothstep(2.0, 0.0, abs(proj - waveFront));
      
      // Add noise to make the spark look like lightning/electricity
      spark *= (hash(vPos * 20.0) * 0.6 + 0.4);
      
      // Convergence glow at the end
      float centerGlow = smoothstep(0.9, 1.0, uProgress) * smoothstep(8.0, 0.0, length(vPos));
      
      vec3 finalColor = mix(baseColor, activeColor * 0.25, activated);
      finalColor += activeColor * spark * 2.5;
      finalColor += vec3(1.0, 1.0, 1.0) * centerGlow * 2.0; 
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  useGSAP(() => {
    const tl = gsap.timeline();

    // Phase 1 & 2: Spark travels along the graph (0s to 2.5s)
    tl.to(progressObj.current, {
      value: 1.0,
      duration: 2.5,
      ease: "power2.in",
      onUpdate: () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uProgress.value = progressObj.current.value;
        }
      }
    });

    // Phase 3: Explosion at exactly 2.5s
    tl.add(() => {
      if (onExplode) onExplode();
    }, 2.5);

    // Shockwave animation
    tl.to(shockwaveRef.current.scale, {
      x: 60, y: 60, z: 60,
      duration: 0.6,
      ease: "power3.out"
    }, 2.5);

    tl.to(shockwaveMatRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    }, 2.5);
  });

  return (
    <>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uProgress: { value: 0.0 }
          }}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Shockwave Sphere */}
      <mesh ref={shockwaveRef} scale={[0.1, 0.1, 0.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          ref={shockwaveMatRef}
          color="#00f3ff" 
          transparent={true} 
          opacity={1} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

const AiNeuralSparkIntro = ({ onExplode }) => {
  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <NeuralScene onExplode={onExplode} />
      </Canvas>
    </div>
  );
};

export default AiNeuralSparkIntro;
