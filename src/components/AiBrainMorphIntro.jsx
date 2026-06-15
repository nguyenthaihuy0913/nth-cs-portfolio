/* eslint-disable react-hooks/purity */
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const MorphingScene = ({ onFinish }) => {
  const isMobile = window.innerWidth < 768;
  const numPoints = isMobile ? 8000 : 20000;
  
  const pointsRef = useRef();
  const materialRef = useRef();

  const { positionsA, positionsB } = useMemo(() => {
    const posA = new Float32Array(numPoints * 3);
    const posB = new Float32Array(numPoints * 3);

    for (let i = 0; i < numPoints; i++) {
      // --- BIOLOGICAL BRAIN (posA) ---
      // Distribute in a sphere, but push more points to the surface to define the shape clearly
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const r_norm = Math.pow(Math.random(), 0.3); // 0.0 -> 1.0, tập trung ở rìa (bề mặt)
      const r = r_norm * 4.0;

      // Trục tọa độ: X (trái/phải), Y (trên/dưới), Z (trước/sau)
      let ax = r * Math.sin(phi) * Math.cos(theta);
      let ay = r * Math.sin(phi) * Math.sin(theta);
      let az = r * Math.cos(phi);

      // 1. Tỉ lệ cơ bản: Dài ra trước sau, hẹp hai bên
      az *= 1.45; // Chiều dài 
      ax *= 0.85; // Bề ngang
      ay *= 0.95; // Chiều cao

      // 2. Tách cấu trúc: Đại não (Cerebrum) và Tiểu não (Cerebellum)
      if (Math.random() < 0.15) {
        // --- TIỂU NÃO (Cerebellum) ---
        // Nằm ở phía dưới, đằng sau
        ax *= 0.7;
        ay = (ay * 0.4) - 2.2; 
        az = (az * 0.5) + 2.5; 
        
        // Nếp nhăn tiểu não thường là các sọc ngang song song
        const cerebellumFolds = Math.sin(ay * 15.0) * 0.1;
        ax += cerebellumFolds * (ax / r);
        az += cerebellumFolds * (az / r);
        
      } else {
        // --- ĐẠI NÃO (Cerebrum) ---
        // Thùy não (Lobe shaping)
        if (az < 0) {
          // Thùy trán (Frontal): dốc xuống và hẹp
          ax *= (1.0 + az * 0.15); 
          ay *= (1.0 + az * 0.05); 
        } else {
          // Thùy chẩm (Occipital): cong tròn đằng sau
          ax *= (1.0 + az * 0.05);
        }

        if (ay < 0) {
          // Làm phẳng đáy đại não
          ay *= 0.6; 
          // Thùy thái dương (Temporal): phình ra 2 bên hông
          if (az > -1.0 && az < 2.0) {
             ax *= 1.2; 
          }
        }

        // Khe nứt dọc giữa 2 bán cầu (Longitudinal Fissure)
        const absX = Math.abs(ax);
        const gapStrength = Math.max(0, 0.4 - absX) * (ay > -1.0 ? 1.0 : 0.0);
        if (ax > 0) ax += 0.25 + gapStrength;
        else ax -= 0.25 + gapStrength;

        // Tạo nếp nhăn bề mặt (Gyri & Sulci)
        if (r_norm > 0.5) {
          const foldPattern = Math.sin(ax * 4.0 + Math.sin(az * 4.0)) * Math.cos(ay * 4.0 + Math.cos(ax * 4.0));
          const foldDepth = 0.4 * ((r_norm - 0.5) / 0.5); 
          
          const len = Math.sqrt(ax*ax + ay*ay + az*az);
          ax += (ax / len) * foldPattern * foldDepth;
          ay += (ay / len) * foldPattern * foldDepth;
          az += (az / len) * foldPattern * foldDepth;
        }
      }

      posA[i * 3] = ax;
      posA[i * 3 + 1] = ay;
      posA[i * 3 + 2] = az;

      // --- AI CORE / TESSERACT (posB) ---
      // Distribute densely along the edges of a cube
      const edge = Math.floor(Math.random() * 12);
      let bx, by, bz;
      const s = 4.0; // scale
      const t = (Math.random() - 0.5) * s;
      const h1 = (Math.random() > 0.5 ? 1 : -1) * (s / 2);
      const h2 = (Math.random() > 0.5 ? 1 : -1) * (s / 2);

      if (edge < 4) { bx = t; by = h1; bz = h2; }
      else if (edge < 8) { bx = h1; by = t; bz = h2; }
      else { bx = h1; by = h2; bz = t; }

      // Thêm chút nhiễu nhẹ để cube không quá sắc nét, tạo cảm giác data particles
      bx += (Math.random() - 0.5) * 0.5;
      by += (Math.random() - 0.5) * 0.5;
      bz += (Math.random() - 0.5) * 0.5;

      posB[i * 3] = bx;
      posB[i * 3 + 1] = by;
      posB[i * 3 + 2] = bz;
    }

    return { positionsA: posA, positionsB: posB };
  }, [isMobile, numPoints]);

  const vertexShader = `
    uniform float uMorphProgress;
    uniform float uPulse;
    uniform float uTime;
    attribute vec3 positionB;
    
    varying float vMorph;

    // Pseudo-random function for delay
    float random(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }

    void main() {
      vMorph = uMorphProgress;
      
      // Delay morph per particle based on its position
      float delay = random(position) * 0.3;
      // Remap morph progress so particles don't start at the exact same time
      float individualProgress = clamp((uMorphProgress - delay) / 0.7, 0.0, 1.0);
      
      // We rely on GSAP for easing, so we can just mix directly
      vec3 pos = mix(position, positionB, individualProgress);
      
      // Biological Jitter when it's a brain
      vec3 jitter = vec3(
         sin(uTime * 2.0 + position.y * 5.0),
         cos(uTime * 1.5 + position.x * 5.0),
         sin(uTime * 2.5 + position.z * 5.0)
      ) * 0.15 * (1.0 - uMorphProgress);
      
      pos += jitter;

      // Pulse at the end
      pos += normalize(pos) * uPulse * 1.5;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Kích thước hạt nhỏ lại khi ở dạng core, to ra khi pulse
      float size = mix(4.0, 2.5, uMorphProgress) + (uPulse * 15.0);
      gl_PointSize = size * (10.0 / -mvPosition.z);
    }
  `;

  const fragmentShader = `
    uniform float uMorphProgress;
    uniform float uPulse;
    uniform float uOpacity;
    uniform float uTime;

    void main() {
      // Shape the point into a soft circle
      float d = distance(gl_PointCoord, vec2(0.5));
      if(d > 0.5) discard;
      
      vec3 cyan = vec3(0.0, 0.95, 1.0);
      vec3 purple = vec3(0.69, 0.15, 1.0); // #b026ff
      
      vec3 color = mix(cyan, purple, uMorphProgress);
      
      // Intense glow on pulse
      color += vec3(1.0, 1.0, 1.0) * uPulse * 2.0;
      
      // Soft edge alpha
      float alpha = smoothstep(0.5, 0.1, d) * uOpacity;
      
      // Twinkle effect based on gl_FragCoord
      float twinkle = 0.3 + 0.7 * sin(gl_FragCoord.x * 50.0 + gl_FragCoord.y * 50.0 + uTime * 5.0);
      alpha *= mix(twinkle, 1.0, uMorphProgress); // Less twinkle when morphed
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      // Nhìn từ góc ngang sườn (Side profile) để khoe rõ hình dáng não và phần tiểu não đặc trưng
      pointsRef.current.rotation.y = Math.PI / 2 + state.clock.elapsedTime * 0.15;
      pointsRef.current.rotation.x = 0; // Để thẳng góc
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  useGSAP(() => {
    const tl = gsap.timeline();

    // Khởi tạo
    if (!materialRef.current || !pointsRef.current) return;
    
    // Giai đoạn 1: Não bộ lơ lửng (0s - 1s)
    tl.to({}, { duration: 1.0 });

    // Giai đoạn 2: Biến hình (1s - 2.5s)
    tl.to(materialRef.current.uniforms.uMorphProgress, {
      value: 1.0,
      duration: 1.5,
      ease: "power3.inOut" // Mượt mà, vật lý sắc sảo
    });

    // Giai đoạn 3: Nhịp đập thức tỉnh và Lên đỉnh điểm (2.5s - 2.8s)
    tl.to(materialRef.current.uniforms.uPulse, {
      value: 1.0,
      duration: 0.15,
      ease: "power2.out"
    }, 2.5);
    
    tl.to(materialRef.current.uniforms.uPulse, {
      value: 0.0,
      duration: 0.15,
      ease: "power2.in"
    }, 2.65);

    // Giai đoạn 4: Trượt rèm - Phóng to camera và mờ dần (2.8s -> 3.2s)
    tl.to(pointsRef.current.scale, {
      x: 20, y: 20, z: 20,
      duration: 0.4,
      ease: "power3.in"
    }, 2.8);

    tl.to(materialRef.current.uniforms.uOpacity, {
      value: 0.0,
      duration: 0.3,
      ease: "power2.inOut"
    }, 2.8);

    // Báo hiệu App.jsx để trượt giao diện chính lên
    tl.add(() => {
      if (onFinish) onFinish();
    }, 2.8);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positionsA.length / 3}
          array={positionsA}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-positionB"
          count={positionsB.length / 3}
          array={positionsB}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uMorphProgress: { value: 0.0 },
          uPulse: { value: 0.0 },
          uOpacity: { value: 1.0 },
          uTime: { value: 0.0 }
        }}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const AiBrainMorphIntro = ({ onFinish }) => {
  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <MorphingScene onFinish={onFinish} />
        {/* Hậu kỳ (Post-Processing) Bloom để tạo glow ảo diệu */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            intensity={1.5} 
            mipmapBlur 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default AiBrainMorphIntro;
