import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';

gsap.registerPlugin(SplitText);

const AICore = () => {
  const meshRef = useRef(null);
  const { scene } = useGLTF('/nvidiaRTX5090.glb');

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    
    // Mouse parallax tilt
    const targetX = (state.pointer.x * Math.PI) / 6;
    const targetY = (state.pointer.y * Math.PI) / 6;
    meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
    meshRef.current.rotation.y += 0.05 * (targetX - meshRef.current.rotation.y);
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      {/* Rotate the model 180 degrees on Z axis to flip it upside right and decrease scale to reduce zoom */}
      <primitive ref={meshRef} object={scene} scale={0.8} position={[0, 0, 0]} rotation={[0, 0, Math.PI]} />
    </Float>
  );
};

const Hero = () => {
  const container = useRef(null);
  const nameRef = useRef(null);
  const avatarRef = useRef(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  useGSAP(() => {
    // Floating Avatar
    gsap.to(avatarRef.current, {
      y: -20,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    // Typography Reveal
    const splitName = new SplitText(nameRef.current, { type: 'chars' });
    gsap.set(splitName.chars, { y: 50, autoAlpha: 0 });

    const tl = gsap.timeline();
    tl.to(splitName.chars, {
      y: 0,
      autoAlpha: 1,
      duration: 1.2,
      stagger: 0.04,
      ease: 'power4.out',
      delay: 0.2
    })
    .fromTo('.hero-fade', 
      { autoAlpha: 0, y: 20 }, 
      { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2 }, 
      "-=0.8"
    );

    return () => splitName.revert();
  }, { scope: container });

  return (
    <section ref={container} className="relative z-10 w-full min-h-screen flex flex-col md:flex-row items-center px-6 md:px-20 pt-20">
      
      {/* 3D Canvas Background for Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#00f3ff" />
          <directionalLight position={[-10, -10, -5]} intensity={2} color="#b026ff" />
          <Environment preset="city" />
          <AICore />
        </Canvas>
      </div>

      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-10">
        
        {/* Left Typography */}
        <div className="w-full md:w-2/3 text-center md:text-left">
          <p className="hero-fade text-neonPurple font-mono text-lg md:text-xl mb-4 tracking-[0.2em] uppercase">
            System Initialized
          </p>
          <h1 
            ref={nameRef} 
            className="text-6xl md:text-[8rem] font-black tracking-tighter leading-none text-white mb-6 drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]"
          >
            Nguyễn Thái Huy
          </h1>
          <p className="hero-fade text-xl md:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed mb-10">
            Sinh viên F21 ĐH FPT | Bằng kép <span className="text-cyberCyan font-bold">Computer Science</span> & <span className="text-neonPurple font-bold">Master AI</span>
          </p>
          
          <div className="hero-fade">
            <a 
              href="/cv.pdf"
              download
              data-cursor="hover"
              className="inline-block px-8 py-4 bg-transparent border border-cyberCyan text-cyberCyan font-mono font-bold uppercase tracking-widest relative overflow-hidden group hover:animate-glitch shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:shadow-[0_0_25px_rgba(176,38,255,0.5)] transition-all"
            >
              <span className="relative z-10 group-hover:text-white transition-colors">Initialize CV</span>
              <div className="absolute inset-0 bg-cyberCyan transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0 mix-blend-screen" />
            </a>
          </div>
        </div>

        {/* Right Avatar */}
        <div className="w-full md:w-1/3 flex justify-center mt-10 md:mt-0 hero-fade">
          <div 
            ref={avatarRef} 
            className="relative cursor-pointer w-64 h-80" 
            data-cursor="hover"
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
          >
            {/* SVG Border Tracer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" xmlns="http://www.w3.org/2000/svg">
              <rect 
                x="2" y="2" 
                width="calc(100% - 4px)" height="calc(100% - 4px)" 
                rx="24" ry="24" 
                fill="none" 
                stroke="#00f3ff" 
                strokeWidth="4"
                style={{
                  strokeDasharray: '1500',
                  strokeDashoffset: isAvatarHovered ? '0' : '1500',
                  transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </svg>
            
            {/* Avatar Image container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-glassBg backdrop-blur-md">
              <img 
                src="/avatar.png" 
                alt="Avatar" 
                className="w-full h-full object-cover opacity-90 transition-opacity duration-500 hover:opacity-100" 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500/050511/00f3ff?text=AVATAR' }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
