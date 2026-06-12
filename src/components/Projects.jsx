import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Five Minds AI',
    desc: 'Nền tảng web bán slide & MMO, tích hợp AI để tối ưu hóa quy trình phân phối nội dung số.',
    github: 'https://github.com/fitnguyenthaiz/fivemindsai',
    highlight: true,
  },
  {
    title: 'E-Game Betting Battle',
    desc: 'Web luyện tiếng Anh thông qua game (Node.js/Socket.io), cược điểm realtime & Anti-cheat lật tab.',
    github: 'https://github.com/nguyenthaihuy0913/E-Game-Betting-Battle',
    highlight: false,
  },
  {
    title: 'FCode-Parking_Lot',
    desc: 'Hệ thống quản lý bãi đỗ xe (C). Tối ưu hóa quá trình quản lý phương tiện.',
    github: 'https://github.com/nguyenthaihuy0913/FCode-Parking_Lot_Management_System',
    highlight: false,
  },
  {
    title: 'LGBT-Website',
    desc: 'Project web báo chí đầu tay cấp 3. Không gian chia sẻ và nâng cao nhận thức.',
    github: 'https://github.com/nguyenthaihuy0913/LGBT-Website',
    highlight: false,
  }
];

const Projects = () => {
  const container = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    // Standard Horizontal Scroll with Flex Track
    const track = trackRef.current;
    
    // Calculate total distance to scroll (track width - viewport width)
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: "none"
    });

    ScrollTrigger.create({
      trigger: container.current,
      animation: tween,
      pin: true,
      scrub: 1,
      start: "top top",
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true
    });

  }, { scope: container });

  return (
    <section ref={container} className="h-screen w-full overflow-hidden bg-voidBlack text-white relative flex flex-col justify-center border-t border-glassBorder/30">
      
      <div className="absolute top-12 left-8 md:left-16 z-10">
        <h2 className="text-[12vw] md:text-[6vw] font-black text-cyberCyan blur-[4px] mix-blend-screen opacity-20 pointer-events-none">
          PROJECTS
        </h2>
      </div>

      {/* Flex Track */}
      <div 
        ref={trackRef} 
        className="flex w-max items-center h-full pt-20 pb-10 px-6 md:px-[10vw] gap-8 md:gap-16 relative z-20"
      >
        {projects.map((project, idx) => (
          <div 
            key={idx} 
            className={`w-[85vw] md:w-[60vw] h-[65vh] shrink-0 bento-card p-8 md:p-14 flex flex-col justify-center bg-voidBlack transition-colors duration-500 relative
              ${project.highlight ? 'border-[2px] border-neonPurple shadow-[0_0_50px_rgba(176,38,255,0.15)]' : 'border border-cyberCyan/30 shadow-[0_0_50px_rgba(0,243,255,0.05)] hover:border-cyberCyan/50'}
            `}
          >
            {project.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-neonPurple text-white px-6 py-1 rounded-b-xl text-xs font-bold tracking-widest uppercase">
                Currently Developing
              </div>
            )}

            <div className={`mb-4 font-mono text-xl tracking-widest ${project.highlight ? 'text-neonPurple' : 'text-cyberCyan'}`}>
              MODULE_0{idx + 1}
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {project.title}
            </h3>
            
            <p className="text-lg md:text-2xl text-gray-400 leading-relaxed max-w-2xl flex-grow">
              {project.desc}
            </p>

            <div className="mt-6 pt-6 border-t border-glassBorder/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <a 
                href={project.github} 
                target="_blank" 
                rel="noreferrer"
                data-cursor="hover"
                className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all backdrop-blur-md font-mono text-sm uppercase tracking-widest
                  ${project.highlight 
                    ? 'border-neonPurple/50 bg-neonPurple/10 text-white hover:bg-neonPurple hover:text-voidBlack' 
                    : 'border-cyberCyan/50 bg-cyberCyan/10 text-white hover:bg-cyberCyan hover:text-voidBlack'}
                `}
              >
                <FaGithub size={20} /> Access Repository
              </a>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
};

export default Projects;
