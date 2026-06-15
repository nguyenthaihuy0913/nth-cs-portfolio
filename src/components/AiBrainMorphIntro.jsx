import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CombinedIntroScene = ({ onFinish }) => {
  const pointsRef = useRef();
  const linesRef = useRef();
  const pointsMatRef = useRef();
  const linesMatRef = useRef();
  
  // 600 đường cáp, tương đương 1200 trạm phát (Nodes)
  const numConnections = 600; 

  const { posIntro, posBrain, linesIntro, linesBrain, offsets } = useMemo(() => {
    const pIntro = new Float32Array(numConnections * 2 * 3);
    const pBrain = new Float32Array(numConnections * 2 * 3);
    const lIntro = new Float32Array(numConnections * 2 * 3);
    const lBrain = new Float32Array(numConnections * 2 * 3);
    const off = new Float32Array(numConnections * 2); 
    
    for (let i = 0; i < numConnections; i++) {
      // Mỗi đường cáp luôn nối 1 điểm bên Trái và 1 điểm bên Phải
      for (let s = 0; s < 2; s++) {
        const side = s === 0 ? -1 : 1; // -1: Trái, 1: Phải
        const idx = i * 2 + s;

        // 1. TỌA ĐỘ INTRO (Trạm phát 2 bên)
        pIntro[idx * 3 + 0] = side * (20 + Math.random() * 5); // Tách ra 2 mép màn hình
        pIntro[idx * 3 + 1] = (Math.random() - 0.5) * 40;
        pIntro[idx * 3 + 2] = (Math.random() - 0.5) * 10;

        // 2. TỌA ĐỘ BRAIN (Bộ não 3D chia 2 bán cầu)
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI; // Nửa khối cầu
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.pow(Math.random(), 0.3) * 4.0;

        let ax = r * Math.sin(phi) * Math.cos(theta);
        let ay = r * Math.sin(phi) * Math.sin(theta);
        let az = r * Math.cos(phi);

        // Bóp thành khối bầu dục
        az *= 1.3; 
        ax *= 0.8; 
        ay *= 0.9; 

        // Tách bán cầu trái và phải dựa vào 'side'
        ax = Math.abs(ax) * side;
        ax += side * 0.2; // Rãnh não (Fissure)

        pBrain[idx * 3 + 0] = ax;
        pBrain[idx * 3 + 1] = ay;
        pBrain[idx * 3 + 2] = az;
      }

      // Nối đường dây Intro
      const leftIdx = i * 2;
      const rightIdx = i * 2 + 1;
      
      lIntro[i * 6 + 0] = pIntro[leftIdx * 3]; lIntro[i * 6 + 1] = pIntro[leftIdx * 3 + 1]; lIntro[i * 6 + 2] = pIntro[leftIdx * 3 + 2];
      lIntro[i * 6 + 3] = pIntro[rightIdx * 3]; lIntro[i * 6 + 4] = pIntro[rightIdx * 3 + 1]; lIntro[i * 6 + 5] = pIntro[rightIdx * 3 + 2];

      // Nối đường dây Brain (Các đường nối sẽ đâm xuyên từ bán cầu trái sang bán cầu phải - Corpus Callosum)
      lBrain[i * 6 + 0] = pBrain[leftIdx * 3]; lBrain[i * 6 + 1] = pBrain[leftIdx * 3 + 1]; lBrain[i * 6 + 2] = pBrain[leftIdx * 3 + 2];
      lBrain[i * 6 + 3] = pBrain[rightIdx * 3]; lBrain[i * 6 + 4] = pBrain[rightIdx * 3 + 1]; lBrain[i * 6 + 5] = pBrain[rightIdx * 3 + 2];

      // Random offset cho đạn dữ liệu bắn loạn xạ
      const randomSeed = Math.random() * 100.0;
      off[i * 2 + 0] = randomSeed;
      off[i * 2 + 1] = randomSeed;
    }

    return { posIntro: pIntro, posBrain: pBrain, linesIntro: lIntro, linesBrain: lBrain, offsets: off };
  }, []);

  const sharedUniforms = useMemo(() => ({
    uFormation: { value: 0.0 }, // 0 = Intro Cáp, 1 = Brain
    uScale: { value: 1.0 },
    uOpacity: { value: 1.0 },
    uTime: { value: 0.0 }
  }), []);

  const vertexShader = `
    uniform float uTime;
    uniform float uFormation;
    uniform float uScale;
    attribute vec3 positionBrain;
    attribute float aOffset;
    varying vec3 vPos;
    varying float vOffset;

    float random(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }

    void main() {
      // Morphing ngẫu nhiên từ Intro sang Brain
      float delay = random(position) * 0.3;
      float individualProgress = clamp((uFormation - delay) / 0.7, 0.0, 1.0);
      
      vec3 pos = mix(position, positionBrain, individualProgress);
      
      // Floating nhẹ chỉ khi cuộn thành Não
      pos += vec3(
         sin(uTime * 1.5 + pos.y * 2.0),
         cos(uTime * 1.2 + pos.x * 2.0),
         sin(uTime * 1.8 + pos.z * 2.0)
      ) * 0.05 * uFormation;

      pos *= uScale;
      vPos = pos;
      vOffset = aOffset;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      #ifdef IS_POINT
        gl_PointSize = mix(10.0, 5.0, uFormation) * (20.0 / -mvPosition.z); // Thu nhỏ điểm khi thành não
      #endif
    }
  `;

  const fragmentShader = `
    uniform float uOpacity;
    uniform float uTime;
    uniform float uFormation;
    varying vec3 vPos;
    varying float vOffset;

    void main() {
      float d = 0.0;
      #ifdef IS_POINT
        d = distance(gl_PointCoord, vec2(0.5));
        if(d > 0.5) discard;
      #endif
      
      // Chuyển màu từ Xanh ngầu sang Tím hồng khi biến thành não
      vec3 cyan = vec3(0.0, 0.8, 1.0); 
      vec3 purple = vec3(0.69, 0.15, 1.0);
      vec3 color = mix(cyan, purple, uFormation);
      
      // Bề ngang thay đổi khi cuộn thành não (Intro width ~ 40, Brain width ~ 8)
      float currentWidth = mix(40.0, 8.0, uFormation);
      float nx = (vPos.x + currentWidth / 2.0) / currentWidth; 
      
      // Tốc độ bắn thay đổi ngẫu nhiên theo vOffset
      float speed = 1.5 + mod(vOffset, 2.5); 
      float localTime = uTime * speed + vOffset;
      float packetPos = fract(localTime); 
      
      float diff = packetPos - nx;
      
      // Đạn dữ liệu (Core) chói lóa & Đuôi (Tail)
      float core = smoothstep(0.015, 0.0, abs(diff)); 
      float tail = smoothstep(0.2, 0.0, diff) * step(0.0, diff); 
      float dataFlow = tail + core * 3.0; 
      
      // Lõi đạn rực rỡ
      vec3 packetColor = mix(purple, vec3(1.0, 0.0, 0.5), core);
      color = mix(color, packetColor, clamp(dataFlow, 0.0, 1.0));
      color += vec3(1.0, 1.0, 1.0) * core * 2.0; 
      
      float finalAlpha = uOpacity;
      #ifdef IS_POINT
        finalAlpha *= smoothstep(0.5, 0.1, d);
        // Node nháy sáng ở Intro, ngừng nháy khi thành não
        float blink = step(0.95, fract(uTime * 2.0 + vOffset));
        finalAlpha *= mix(1.0 + blink * 1.5, 1.0, uFormation); 
      #else
        // Đường ống mờ ở Intro, mờ hơn nữa ở Não
        finalAlpha *= mix(0.35, 0.15, uFormation); 
        finalAlpha += clamp(dataFlow, 0.0, 1.0) * 1.5;
      #endif

      gl_FragColor = vec4(color, finalAlpha);
    }
  `;

  useFrame((state) => {
    sharedUniforms.uTime.value = state.clock.elapsedTime;
    
    if (pointsMatRef.current) {
      pointsMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      pointsMatRef.current.uniforms.uFormation.value = sharedUniforms.uFormation.value;
      pointsMatRef.current.uniforms.uScale.value = sharedUniforms.uScale.value;
      pointsMatRef.current.uniforms.uOpacity.value = sharedUniforms.uOpacity.value;
    }
    
    if (linesMatRef.current) {
      linesMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      linesMatRef.current.uniforms.uFormation.value = sharedUniforms.uFormation.value;
      linesMatRef.current.uniforms.uScale.value = sharedUniforms.uScale.value;
      linesMatRef.current.uniforms.uOpacity.value = sharedUniforms.uOpacity.value;
    }
    
    // Khi thành Não thì từ từ xoay ngang khoe hình dáng
    if (pointsRef.current && linesRef.current) {
      const targetRotY = Math.PI / 2 + state.clock.elapsedTime * 0.15;
      pointsRef.current.rotation.y = targetRotY * sharedUniforms.uFormation.value;
      linesRef.current.rotation.y = targetRotY * sharedUniforms.uFormation.value;
    }
  });

  useGSAP(() => {
    const tl = gsap.timeline();

    // 0s -> 1.5s: Giữ nguyên hiện trường Intro, cho đạn bay liên tục
    
    // 1.5s -> 3s: Bắt đầu cuộn thành Bộ Não, đồng thời phóng to mạnh (Scale -> 1.4)
    tl.to(sharedUniforms.uFormation, { value: 1.0, duration: 1.5, ease: "power3.inOut" }, 1.5);
    tl.to(sharedUniforms.uScale, { value: 1.4, duration: 1.5, ease: "power3.inOut" }, 1.5);

    // 3.5s -> 4.5s: Lùi ra xa (Zoom out nhẹ) và Fade out hoàn toàn để lộ Menu chính
    tl.to(sharedUniforms.uScale, { value: 0.8, duration: 1.0, ease: "power2.inOut" }, 3.5);
    tl.to(sharedUniforms.uOpacity, { value: 0.0, duration: 1.0, ease: "power2.inOut" }, 3.5);

    tl.add(() => {
      if (onFinish) onFinish();
    }, 4.2);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={posIntro.length / 3} array={posIntro} itemSize={3} />
          <bufferAttribute attach="attributes-positionBrain" count={posBrain.length / 3} array={posBrain} itemSize={3} />
          <bufferAttribute attach="attributes-aOffset" count={offsets.length} array={offsets} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMatRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={sharedUniforms}
          defines={{ IS_POINT: true }}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linesIntro.length / 3} array={linesIntro} itemSize={3} />
          <bufferAttribute attach="attributes-positionBrain" count={linesBrain.length / 3} array={linesBrain} itemSize={3} />
          <bufferAttribute attach="attributes-aOffset" count={offsets.length} array={offsets} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={linesMatRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={sharedUniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
};

const AiBrainMorphIntro = ({ onFinish }) => {
  const textContainerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    // Chữ hiện ra từ từ với hiệu ứng giãn khoảng cách chữ
    tl.fromTo(textContainerRef.current, 
      { opacity: 0, scale: 0.9 }, 
      { opacity: 1, scale: 1.0, duration: 1.0, ease: "power2.out" }, 
      0.0
    );
    // Chữ mờ dần và biến mất đúng lúc bắt đầu cuộn não (1.5s)
    tl.to(textContainerRef.current, 
      { opacity: 0, scale: 1.1, duration: 0.5, ease: "power2.in" }, 
      1.2
    );
  });

  return (
    <div className="w-full h-full bg-black relative">
      <Canvas camera={{ position: [0, 0, 28], fov: 60 }}>
        <CombinedIntroScene onFinish={onFinish} />
      </Canvas>

      {/* Text Overlay hiển thị trong Đoạn 1 */}
      <div 
        ref={textContainerRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
      >
        <div className="flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl px-10 py-8 md:px-20 md:py-12 rounded-3xl border border-cyan-500/40 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          <span 
            className="text-white text-4xl md:text-6xl font-black uppercase tracking-[10px] md:tracking-[20px] text-center"
            style={{ textShadow: "0 0 20px #00f3ff, 0 0 40px #00f3ff, 0 0 10px #ffffff" }}
          >
            AI Neural Core
          </span>
          <span 
            className="text-[#e2a8ff] text-base md:text-xl font-mono uppercase tracking-[5px] md:tracking-[8px] mt-5 font-bold text-center"
            style={{ textShadow: "0 0 10px #b026ff, 0 0 20px #b026ff" }}
          >
            Deep Learning Initialization
          </span>
        </div>
      </div>
    </div>
  );
};

export default AiBrainMorphIntro;
