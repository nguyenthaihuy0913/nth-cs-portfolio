import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { FaGithub, FaTimes } from 'react-icons/fa';

gsap.registerPlugin(Draggable);

const mapWidth = 3000;
const mapHeight = 2000;

const projects = [
  {
    title: 'Five Minds AI',
    shortName: 'FIVE MINDS',
    desc: 'Nền tảng web bán slide & MMO, tích hợp AI để tối ưu hóa quy trình phân phối nội dung số.',
    github: 'https://github.com/fitnguyenthaiz/fivemindsai',
    highlight: true,
    x: 600,
    y: 500,
  },
  {
    title: 'E-Game Betting Battle',
    shortName: 'E-GAME',
    desc: 'Web luyện tiếng Anh thông qua game (Node.js/Socket.io), cược điểm realtime & Anti-cheat lật tab.',
    github: 'https://github.com/nguyenthaihuy0913/E-Game-Betting-Battle',
    highlight: false,
    x: 1700,
    y: 400,
  },
  {
    title: 'FCode-Parking_Lot',
    shortName: 'PARKING',
    desc: 'Hệ thống quản lý bãi đỗ xe (C). Tối ưu hóa quá trình quản lý phương tiện.',
    github: 'https://github.com/nguyenthaihuy0913/FCode-Parking_Lot_Management_System',
    highlight: false,
    x: 900,
    y: 1300,
  },
  {
    title: 'LGBT-Website',
    shortName: 'LGBT WEB',
    desc: 'Project web báo chí đầu tay cấp 3. Không gian chia sẻ và nâng cao nhận thức.',
    github: 'https://github.com/nguyenthaihuy0913/LGBT-Website',
    highlight: false,
    x: 2000,
    y: 1400,
  }
];

const Projects = () => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeNode, setActiveNode] = useState(null);

  useGSAP(() => {
    // Initialize Draggable
    const dragInstance = Draggable.create(mapRef.current, {
      type: "x,y",
      bounds: containerRef.current,
      edgeResistance: 0.65,
      zIndexBoost: false,
      cursor: 'grab',
      activeCursor: 'grabbing'
    })[0];

    // SVG Data Packets Animation
    gsap.fromTo('.packet-1', { attr: { cx: 600, cy: 500 } }, { attr: { cx: 1700, cy: 400 }, duration: 4, repeat: -1, ease: "none" });
    gsap.fromTo('.packet-2', { attr: { cx: 600, cy: 500 } }, { attr: { cx: 900, cy: 1300 }, duration: 3.5, repeat: -1, ease: "none", delay: 1 });
    gsap.fromTo('.packet-3', { attr: { cx: 1700, cy: 400 } }, { attr: { cx: 2000, cy: 1400 }, duration: 4, repeat: -1, ease: "none", delay: 0.5 });
    gsap.fromTo('.packet-4', { attr: { cx: 900, cy: 1300 } }, { attr: { cx: 2000, cy: 1400 }, duration: 3.8, repeat: -1, ease: "none" });
    gsap.fromTo('.packet-5', { attr: { cx: 1700, cy: 400 } }, { attr: { cx: 900, cy: 1300 }, duration: 4.2, repeat: -1, ease: "none", delay: 2 });

    return () => {
      // Cleanup
      if (dragInstance) dragInstance.kill();
    };
  }, { scope: containerRef });

  const handleNodeClick = (idx, x, y) => {
    setActiveNode(idx);
    
    // Disable drag
    const drag = Draggable.get(mapRef.current);
    if (drag) drag.disable();

    // Center the map at (x, y)
    const targetX = window.innerWidth / 2 - x;
    const targetY = window.innerHeight / 2 - y;

    // Apply limits so it doesn't leave the bounds completely black
    const minX = window.innerWidth - mapWidth;
    const minY = window.innerHeight - mapHeight;
    const boundedX = Math.max(minX, Math.min(0, targetX));
    const boundedY = Math.max(minY, Math.min(0, targetY));

    gsap.to(mapRef.current, {
      x: boundedX,
      y: boundedY,
      duration: 1,
      ease: "power3.inOut"
    });

    // Fade out others
    gsap.to('.node-wrapper', {
      opacity: 0.1,
      duration: 0.5
    });
    gsap.to(`#node-${idx}`, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      zIndex: 50
    });
  };

  const handleCloseNode = (e, idx) => {
    e.stopPropagation();
    setActiveNode(null);

    const drag = Draggable.get(mapRef.current);
    if (drag) drag.enable();

    gsap.to('.node-wrapper', {
      opacity: 1,
      zIndex: 10,
      duration: 0.5
    });
  };

  return (
    <section ref={containerRef} className="h-screen w-full overflow-hidden bg-voidBlack text-white relative border-t border-glassBorder/30">
      
      {/* HUD Info Overlay */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-20 pointer-events-none">
        <h2 className="text-[8vw] md:text-[4vw] font-black text-cyberCyan blur-[2px] opacity-20 pointer-events-none mix-blend-screen leading-none mb-2">
          NEURAL WORKSPACE
        </h2>
        <div className="flex items-center gap-4 text-xs md:text-sm font-mono text-gray-400">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-neonPurple animate-pulse"></div> DRAG TO PAN</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyberCyan animate-pulse"></div> CLICK TO ACCESS</span>
        </div>
      </div>

      {/* Draggable Map Canvas */}
      <div 
        ref={mapRef} 
        className="absolute top-0 left-0"
        style={{ width: mapWidth, height: mapHeight }}
      >
        {/* SVG Data Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <line x1="600" y1="500" x2="1700" y2="400" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="600" y1="500" x2="900" y2="1300" stroke="rgba(176, 38, 255, 0.15)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="1700" y1="400" x2="2000" y2="1400" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="900" y1="1300" x2="2000" y2="1400" stroke="rgba(176, 38, 255, 0.15)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="1700" y1="400" x2="900" y2="1300" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="2" strokeDasharray="5,5" />

          {/* Packets */}
          <circle r="5" fill="#00f3ff" className="packet-1 shadow-[0_0_15px_#00f3ff]" style={{filter: 'drop-shadow(0 0 5px #00f3ff)'}} />
          <circle r="5" fill="#b026ff" className="packet-2 shadow-[0_0_15px_#b026ff]" style={{filter: 'drop-shadow(0 0 5px #b026ff)'}} />
          <circle r="5" fill="#00f3ff" className="packet-3 shadow-[0_0_15px_#00f3ff]" style={{filter: 'drop-shadow(0 0 5px #00f3ff)'}} />
          <circle r="5" fill="#b026ff" className="packet-4 shadow-[0_0_15px_#b026ff]" style={{filter: 'drop-shadow(0 0 5px #b026ff)'}} />
          <circle r="5" fill="#00f3ff" className="packet-5 shadow-[0_0_15px_#00f3ff]" style={{filter: 'drop-shadow(0 0 5px #00f3ff)'}} />
        </svg>

        {/* Data Nodes */}
        {projects.map((project, idx) => {
          const isActive = activeNode === idx;
          
          return (
            <div 
              key={idx}
              id={`node-${idx}`}
              className="node-wrapper absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all"
              style={{ left: project.x, top: project.y }}
              onClick={() => !isActive && handleNodeClick(idx, project.x, project.y)}
            >
              {/* Closed State (Hexagon/Circle) */}
              {!isActive && (
                <div 
                  data-cursor="hover"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-cyberCyan/50 bg-voidBlack/80 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 hover:border-neonPurple hover:bg-neonPurple/10 shadow-[0_0_30px_rgba(0,243,255,0.15)] animate-pulse"
                >
                  <div className="font-mono text-xs md:text-sm text-cyberCyan mb-2 tracking-widest">MOD_0{idx + 1}</div>
                  <div className="text-center text-white font-black text-xs md:text-sm px-4">
                    {project.shortName}
                  </div>
                </div>
              )}

              {/* Opened State (Dashboard) */}
              {isActive && (
                <div 
                  className="w-[90vw] md:w-[600px] bento-card p-8 md:p-10 bg-voidBlack/95 border-2 border-neonPurple/60 shadow-[0_0_50px_rgba(176,38,255,0.3)] flex flex-col cursor-default backdrop-blur-2xl rounded-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={(e) => handleCloseNode(e, idx)}
                    data-cursor="hover"
                    className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors p-2 z-20"
                  >
                    <FaTimes size={24} />
                  </button>

                  {project.highlight && (
                    <div className="bg-neonPurple text-white px-4 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase self-start mb-6">
                      Currently Developing
                    </div>
                  )}
                  
                  <div className="mb-2 font-mono text-base md:text-lg tracking-widest text-cyberCyan">
                    MODULE_0{idx + 1}
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-black mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-8">
                    {project.desc}
                  </p>

                  <div className="mt-auto pt-6 border-t border-glassBorder/50 flex flex-col sm:flex-row items-center gap-4">
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noreferrer"
                      data-cursor="hover"
                      className="flex items-center gap-3 px-6 py-3 rounded-full border border-cyberCyan/50 bg-cyberCyan/10 text-white hover:bg-cyberCyan hover:text-voidBlack transition-all backdrop-blur-md font-mono text-sm uppercase tracking-widest w-full justify-center sm:w-auto"
                    >
                      <FaGithub size={20} /> Access Repository
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
