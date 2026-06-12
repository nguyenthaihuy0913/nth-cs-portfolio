import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  FaPython, FaNodeJs, FaGitAlt, FaGithub, 
  FaHtml5, FaCss3Alt, FaDiscord, FaRobot 
} from 'react-icons/fa';
import { 
  SiC, SiCplusplus, SiJavascript, SiMongodb, 
  SiVercel, SiTailwindcss 
} from 'react-icons/si';

const row1 = [
  { name: 'Python', icon: <FaPython />, highlight: true },
  { name: 'C', icon: <SiC /> },
  { name: 'C++', icon: <SiCplusplus /> },
  { name: 'JavaScript', icon: <SiJavascript /> },
  { name: 'Node.js', icon: <FaNodeJs /> },
  { name: 'MongoDB', icon: <SiMongodb /> },
  { name: 'Git', icon: <FaGitAlt /> },
  { name: 'GitHub', icon: <FaGithub /> },
];

const row2 = [
  { name: 'Python', icon: <FaPython />, highlight: true },
  { name: 'Vercel', icon: <SiVercel /> },
  { name: 'UptimeRobot', icon: <FaRobot /> },
  { name: 'Discord Bot', icon: <FaDiscord /> },
  { name: 'HTML5', icon: <FaHtml5 /> },
  { name: 'CSS3', icon: <FaCss3Alt /> },
  { name: 'TailwindCSS', icon: <SiTailwindcss /> },
];

const TechItem = ({ item }) => {
  if (item.highlight) {
    return (
      <div className="flex items-center gap-4 px-10 py-6 mx-4 rounded-3xl border-2 border-neonPurple bg-neonPurple/10 shadow-[0_0_30px_rgba(176,38,255,0.4)] animate-pulse shrink-0">
        <div className="text-6xl text-neonPurple drop-shadow-[0_0_15px_rgba(176,38,255,0.8)]">
          {item.icon}
        </div>
        <span className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {item.name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-8 py-5 mx-4 rounded-2xl border border-glassBorder bg-glassBg backdrop-blur-md shrink-0 transition-colors hover:border-cyberCyan/50 hover:bg-cyberCyan/5">
      <div className="text-4xl text-cyberCyan opacity-80">
        {item.icon}
      </div>
      <span className="text-xl font-bold text-gray-300 tracking-wider">
        {item.name}
      </span>
    </div>
  );
};

const TechStack = () => {
  const container = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useGSAP(() => {
    // Duplicate content ensures smooth infinite loop
    const tl1 = gsap.to(row1Ref.current, {
      xPercent: -50,
      ease: "none",
      duration: 20,
      repeat: -1,
    });

    const tl2 = gsap.to(row2Ref.current, {
      xPercent: 50,
      ease: "none",
      duration: 25,
      repeat: -1,
    });
    
    // We start row 2 shifted left so it can seamlessly move right
    gsap.set(row2Ref.current, { xPercent: -50 });

    const handleMouseEnter = () => {
      gsap.to([tl1, tl2], { timeScale: 0.2, duration: 1, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      gsap.to([tl1, tl2], { timeScale: 1, duration: 1, ease: "power2.out" });
    };

    const section = container.current;
    section.addEventListener('mouseenter', handleMouseEnter);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      section.removeEventListener('mouseenter', handleMouseEnter);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: container });

  return (
    <section ref={container} className="relative z-10 w-full py-20 bg-voidBlack overflow-hidden border-t border-glassBorder/30">
      
      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Tech Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-cyberCyan">Arsenal</span>
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm tracking-widest uppercase">
          Core Modules & Dependencies
        </p>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative w-full flex mb-8">
        {/* Glow behind row */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[100px] bg-cyberCyan/5 blur-[50px] pointer-events-none" />
        
        <div ref={row1Ref} className="flex items-center w-max">
          {/* Original */}
          <div className="flex items-center">
            {row1.map((item, idx) => <TechItem key={idx} item={item} />)}
          </div>
          {/* Duplicated for infinite scroll */}
          <div className="flex items-center">
            {row1.map((item, idx) => <TechItem key={`dup-${idx}`} item={item} />)}
          </div>
        </div>
      </div>

      {/* Marquee Row 2 */}
      <div className="relative w-full flex">
        {/* Glow behind row */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[100px] bg-neonPurple/5 blur-[50px] pointer-events-none" />
        
        <div ref={row2Ref} className="flex items-center w-max">
          {/* Original */}
          <div className="flex items-center">
            {row2.map((item, idx) => <TechItem key={idx} item={item} />)}
          </div>
          {/* Duplicated for infinite scroll */}
          <div className="flex items-center">
            {row2.map((item, idx) => <TechItem key={`dup-${idx}`} item={item} />)}
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default TechStack;
