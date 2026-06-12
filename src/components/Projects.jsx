import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { FaGithub } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Five Minds AI',
    shortName: 'FIVE MINDS',
    desc: 'Nền tảng web bán slide & MMO, tích hợp AI để tối ưu hóa quy trình phân phối nội dung số.',
    github: 'https://github.com/fitnguyenthaiz/fivemindsai',
    highlight: true,
  },
  {
    title: 'E-Game Betting Battle',
    shortName: 'E-GAME',
    desc: 'Web luyện tiếng Anh thông qua game (Node.js/Socket.io), cược điểm realtime & Anti-cheat lật tab.',
    github: 'https://github.com/nguyenthaihuy0913/E-Game-Betting-Battle',
    highlight: false,
  },
  {
    title: 'FCode-Parking_Lot',
    shortName: 'PARKING',
    desc: 'Hệ thống quản lý bãi đỗ xe (C). Tối ưu hóa quá trình quản lý phương tiện.',
    github: 'https://github.com/nguyenthaihuy0913/FCode-Parking_Lot_Management_System',
    highlight: false,
  },
  {
    title: 'LGBT-Website',
    shortName: 'LGBT WEB',
    desc: 'Project web báo chí đầu tay cấp 3. Không gian chia sẻ và nâng cao nhận thức.',
    github: 'https://github.com/nguyenthaihuy0913/LGBT-Website',
    highlight: false,
  }
];

const ProjectCard = React.forwardRef(({ project, idx, isMobile }, ref) => {
  return (
    <div 
      ref={ref} 
      className={`w-full md:w-[380px] bento-card p-4 md:p-6 bg-voidBlack/70 border-2 transition-all duration-300 flex flex-col relative overflow-hidden group backdrop-blur-3xl rounded-2xl ${project.highlight ? 'border-neonPurple shadow-[0_0_40px_rgba(176,38,255,0.4)]' : 'border-cyberCyan/40 shadow-[0_0_20px_rgba(0,243,255,0.15)]'}`}
      style={{ transformOrigin: 'center center' }}
    >
      {/* Tech Scanners overlay */}
      <div className="absolute top-3 right-4 text-right font-mono text-[8px] text-gray-400 opacity-80 pointer-events-none">
        <p>SYS_SCAN: <span className="text-cyberCyan font-bold">OK</span></p>
        <p>LATENCY: <span className="text-neonPurple font-bold">{(Math.random() * 0.5 + 0.1).toFixed(2)}ms</span></p>
      </div>

      {project.highlight && !isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
           <div className="absolute top-[10%] left-[5%] w-1.5 h-1.5 bg-yellow-400 rounded-sm animate-ping opacity-60 shadow-[0_0_5px_#facc15]"></div>
           <div className="absolute bottom-[20%] right-[10%] w-1 h-1 bg-neonPurple rounded-full animate-ping opacity-80 delay-75 shadow-[0_0_5px_#b026ff]"></div>
           <div className="absolute top-[40%] right-[5%] w-0.5 h-3 bg-cyberCyan animate-pulse opacity-40 shadow-[0_0_5px_#00f3ff]"></div>
           <div className="absolute top-[80%] left-[20%] w-1 h-1 bg-yellow-400 rounded-sm animate-pulse opacity-40 shadow-[0_0_5px_#facc15] delay-150"></div>
        </div>
      )}

      {project.highlight && (
        <div className="bg-neonPurple text-white px-3 py-1 rounded-full text-[8px] font-bold tracking-widest uppercase self-start mb-3 z-10 shadow-[0_0_15px_rgba(176,38,255,0.6)]">
          Currently Developing
        </div>
      )}
      
      <div className="mb-1 font-mono text-[10px] tracking-widest text-cyberCyan z-10">
        MODULE_0{idx + 1}
      </div>
      
      <h3 className="text-lg md:text-2xl font-black mb-2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10">
        {project.title}
      </h3>
      
      <p className="text-[10px] md:text-xs text-gray-300 leading-relaxed mb-5 z-10">
        {project.desc}
      </p>

      <div className="mt-auto pt-3 border-t border-glassBorder/50 flex flex-col sm:flex-row items-center gap-2 z-10">
        <a 
          href={project.github} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyberCyan/50 bg-cyberCyan/10 text-white hover:bg-cyberCyan hover:text-voidBlack transition-all backdrop-blur-md font-mono text-[9px] uppercase tracking-widest w-full justify-center sm:w-auto shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]"
        >
          <FaGithub size={14} /> Access Repository
        </a>
      </div>
    </div>
  )
});

const CarouselItem = ({ index, position, rotation, project, groupRef, angleStep }) => {
  const cardRef = useRef();

  useFrame(() => {
    if (!groupRef.current || !cardRef.current) return;
    
    const myTheta = -index * angleStep;
    const currentWorldAngle = myTheta + groupRef.current.rotation.y;
    const distanceToCenter = Math.abs(currentWorldAngle);
    
    const scale = Math.max(0.7, 1 - distanceToCenter * 0.3);
    
    cardRef.current.style.transform = `scale(${scale})`;
    cardRef.current.style.opacity = 1;
    cardRef.current.style.filter = 'none';
    
    // Disable clicks on panels that are not in the center
    if (distanceToCenter > 0.3) {
      cardRef.current.style.pointerEvents = 'none';
    } else {
      cardRef.current.style.pointerEvents = 'auto';
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <Html 
        transform 
        center 
        distanceFactor={3.5}
        zIndexRange={[100, 0]}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <ProjectCard ref={cardRef} project={project} idx={index} isMobile={false} />
        </div>
      </Html>
    </group>
  );
};

const Carousel = ({ projects, progressRef }) => {
  const groupRef = useRef();
  const radius = 10;
  const angleStep = Math.PI / 4; // 45 degrees apart

  useFrame(() => {
    if (!groupRef.current) return;
    
    const maxRotation = (projects.length - 1) * angleStep;
    const targetY = progressRef.current * maxRotation;
    
    // Smooth lerping
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.08);
  });

  return (
    <group ref={groupRef}>
      {projects.map((proj, i) => {
        const theta = -i * angleStep;
        const x = radius * Math.sin(theta);
        const z = radius * Math.cos(theta);
        
        return (
          <CarouselItem 
            key={i} 
            index={i} 
            position={[x, 0, z]} 
            rotation={[0, theta, 0]} 
            project={proj} 
            groupRef={groupRef} 
            angleStep={angleStep} 
          />
        );
      })}
      
      {/* Sci-Fi Particles inside the Carousel Group */}
      <points>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={200} 
            array={new Float32Array(600).map(() => (Math.random() - 0.5) * 40)} 
            itemSize={3} 
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00f3ff" transparent opacity={0.4} sizeAttenuation={true} />
      </points>
    </group>
  );
};

const Projects = () => {
  const containerRef = useRef(null);
  const progressRef = useRef(0);
  
  // Custom hook for window size to cleanly handle resize events
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    if (isMobile) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=3000",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      }
    });

    return () => {
      st.kill();
    };
  }, [isMobile]); // Re-run if isMobile changes

  return (
    <section 
      ref={containerRef} 
      className={`relative w-full bg-voidBlack text-white border-t border-glassBorder/30 ${!isMobile ? 'h-screen overflow-hidden' : ''}`}
    >
      
      {/* Background/HUD Titles */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-20 pointer-events-none">
        <h2 className="text-[12vw] md:text-[6vw] font-black text-cyberCyan blur-[2px] opacity-20 mix-blend-screen leading-none mb-2">
          JARVIS DB
        </h2>
        <div className="flex items-center gap-4 text-xs md:text-sm font-mono text-gray-400">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-neonPurple animate-pulse"></div> SYS_ACTIVE</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyberCyan animate-pulse"></div> NEURAL_LINK</span>
        </div>
      </div>

      {isMobile ? (
        // MOBILE FALLBACK: Normal Vertical Scrolling List
        <div className="pt-32 pb-20 px-6 flex flex-col gap-10 relative z-10">
          {projects.map((proj, i) => (
            <ProjectCard key={i} project={proj} idx={i} isMobile={true} />
          ))}
        </div>
      ) : (
        // DESKTOP: 3D Hologram Carousel
        <div className="h-screen w-full relative z-10">
          <Canvas camera={{ position: [0, 0, 16], fov: 45 }} dpr={[1, 1.5]}>
            <fog attach="fog" args={['#050511', 10, 30]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f3ff" />
            <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#b026ff" />
            <Carousel projects={projects} progressRef={progressRef} />
          </Canvas>
        </div>
      )}
      
    </section>
  );
};

export default Projects;
