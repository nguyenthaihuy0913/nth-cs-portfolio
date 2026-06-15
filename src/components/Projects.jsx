import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const ProjectCard = React.forwardRef(({ project, idx }, ref) => {
  return (
    <div 
      ref={ref} 
      className={`project-card w-full max-w-2xl mx-auto bento-card p-6 md:p-10 bg-voidBlack/95 border-2 flex flex-col relative overflow-hidden group backdrop-blur-3xl rounded-2xl ${project.highlight ? 'border-neonPurple shadow-[0_0_40px_rgba(176,38,255,0.4)]' : 'border-cyberCyan/40 shadow-[0_0_20px_rgba(0,243,255,0.15)]'}`}
    >
      {/* Tech Scanners overlay */}
      <div className="absolute top-4 right-6 text-right font-mono text-xs text-gray-400 opacity-80 pointer-events-none">
        <p>SYS_SCAN: <span className="text-cyberCyan font-bold">OK</span></p>
        <p>LATENCY: <span className="text-neonPurple font-bold">{(Math.random() * 0.5 + 0.1).toFixed(2)}ms</span></p>
      </div>

      {project.highlight && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
           <div className="absolute top-[10%] left-[5%] w-1.5 h-1.5 bg-yellow-400 rounded-sm animate-ping opacity-60 shadow-[0_0_5px_#facc15]"></div>
           <div className="absolute bottom-[20%] right-[10%] w-1 h-1 bg-neonPurple rounded-full animate-ping opacity-80 delay-75 shadow-[0_0_5px_#b026ff]"></div>
           <div className="absolute top-[40%] right-[5%] w-0.5 h-3 bg-cyberCyan animate-pulse opacity-40 shadow-[0_0_5px_#00f3ff]"></div>
           <div className="absolute top-[80%] left-[20%] w-1 h-1 bg-yellow-400 rounded-sm animate-pulse opacity-40 shadow-[0_0_5px_#facc15] delay-150"></div>
        </div>
      )}

      {project.highlight && (
        <div className="bg-neonPurple text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase self-start mb-4 z-10 shadow-[0_0_15px_rgba(176,38,255,0.6)]">
          Currently Developing
        </div>
      )}
      
      <div className="mb-2 font-mono text-xs tracking-widest text-cyberCyan z-10">
        MODULE_0{idx + 1}
      </div>
      
      <h3 className="text-2xl md:text-3xl font-black mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10">
        {project.title}
      </h3>
      
      <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8 z-10 max-w-xl">
        {project.desc}
      </p>

      <div className="mt-auto pt-4 border-t border-glassBorder/50 flex flex-col sm:flex-row items-center gap-4 z-10">
        <a 
          href={project.github} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-cyberCyan/50 bg-cyberCyan/10 text-white hover:bg-cyberCyan hover:text-voidBlack transition-all backdrop-blur-md font-mono text-xs uppercase tracking-widest w-full sm:w-auto justify-center shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]"
        >
          <FaGithub size={18} /> Access Repository
        </a>
      </div>
    </div>
  )
});

const Projects = () => {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    const cards = gsap.utils.toArray('.project-card');
    
    cards.forEach((card, i) => {
      // Thẻ chẵn bay từ trái sang, thẻ lẻ bay từ phải sang
      const xOffset = i % 2 === 0 ? -150 : 150;
      
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          x: xOffset,
          y: 50
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // Kích hoạt khi đỉnh của thẻ vào vùng 85% màn hình
            toggleActions: "play none none reverse", // Chơi khi cuộn xuống, reverse khi cuộn lên
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-voidBlack text-white border-t border-glassBorder/30 py-24 px-6 md:px-20 overflow-hidden"
    >


      <div className="max-w-7xl mx-auto pt-24 md:pt-40 flex flex-col gap-12 relative z-10">
        {projects.map((proj, i) => (
          <ProjectCard key={i} project={proj} idx={i} />
        ))}
      </div>
      
    </section>
  );
};

export default Projects;
