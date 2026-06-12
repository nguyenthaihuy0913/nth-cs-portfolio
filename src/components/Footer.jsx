import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  FaSteam, FaXbox, FaTiktok, FaDiscord, 
  FaFacebook, FaGithub, FaYoutube, FaEnvelope 
} from 'react-icons/fa';

const socials = [
  { name: 'Email', text: 'thaihuyxbox@gmail.com', icon: <FaEnvelope size={40} />, href: 'mailto:thaihuyxbox@gmail.com', color: '#b026ff' },
  { name: 'Discord', text: 'thaihuy1207', icon: <FaDiscord size={40} />, href: '#', color: '#00f3ff' },
  { name: 'Server Bot', text: 'discord.gg/6XeDqWcPWK', icon: <FaDiscord size={40} />, href: 'https://discord.gg/6XeDqWcPWK', color: '#b026ff' },
  { name: 'Facebook', text: 'huysimphutao', icon: <FaFacebook size={40} />, href: 'https://facebook.com/huysimphutao', color: '#00f3ff' },
  { name: 'GitHub', text: 'nguyenthaihuy0913', icon: <FaGithub size={40} />, href: 'https://github.com/nguyenthaihuy0913', color: '#b026ff' },
  { name: 'TikTok', text: '@huygaycanh', icon: <FaTiktok size={40} />, href: 'https://tiktok.com/@huygaycanh', color: '#00f3ff' },
  { name: 'YouTube', text: '@thaihuy1207', icon: <FaYoutube size={40} />, href: 'https://youtube.com/@thaihuy1207', color: '#b026ff' },
  { name: 'Steam', text: '76561199227928416', icon: <FaSteam size={40} />, href: 'https://steamcommunity.com/profiles/76561199227928416', color: '#00f3ff' },
  { name: 'Xbox', text: 'Thaihuy0913', icon: <FaXbox size={40} />, href: '#', color: '#b026ff' },
];

const MagneticSocial = ({ item }) => {
  const btnRef = useRef(null);
  const iconContentRef = useRef(null);

  useGSAP(() => {
    const btn = btnRef.current;
    const iconContent = iconContentRef.current;
    
    // Intense magnetic pull (duration 0.5, strong elastic)
    const xTo = gsap.quickTo(iconContent, "x", { duration: 0.5, ease: "elastic.out(1.2, 0.2)" });
    const yTo = gsap.quickTo(iconContent, "y", { duration: 0.5, ease: "elastic.out(1.2, 0.2)" });

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      
      // Pull heavily (factor 0.6)
      xTo(relX * 0.6);
      yTo(relY * 0.6);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      gsap.to(btn, { backgroundColor: 'transparent', boxShadow: 'none', duration: 0.4 });
    };

    const handleMouseEnter = () => {
      gsap.to(btn, { 
        backgroundColor: `${item.color}20`, // 20% opacity of the brand color 
        boxShadow: `0 0 30px ${item.color}40`, // 40% opacity glow
        duration: 0.4 
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    btn.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
      btn.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <a 
      ref={btnRef}
      href={item.href}
      target="_blank"
      rel="noreferrer"
      data-cursor="hover"
      className="flex flex-col items-center justify-center p-8 rounded-3xl border border-glassBorder bg-glassBg backdrop-blur-xl transition-all h-[200px]"
    >
      <div ref={iconContentRef} className="flex flex-col items-center gap-4 pointer-events-none">
        <div style={{ color: item.color }} className="drop-shadow-[0_0_15px_currentColor]">
          {item.icon}
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white mb-1">{item.name}</p>
          <p className="text-xs font-mono text-gray-400 break-all max-w-[120px]">{item.text}</p>
        </div>
      </div>
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="relative w-full py-40 px-6 md:px-12 z-10 border-t border-glassBorder/50 overflow-hidden">
      
      {/* Background Cyber Glow for Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-neonPurple/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <h2 className="text-[12vw] md:text-[8vw] font-black leading-none mb-24 text-center tracking-tighter" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent', backgroundImage: 'linear-gradient(to bottom, #fff, #b026ff)', WebkitBackgroundClip: 'text' }}>
          LET'S CONNECT
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
          {socials.map((item, idx) => (
            <MagneticSocial key={idx} item={item} />
          ))}
        </div>

        <div className="mt-40 text-center flex flex-col items-center">
          <div className="w-10 h-10 border border-cyberCyan/50 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <div className="w-2 h-2 bg-cyberCyan rounded-full" />
          </div>
          <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">
            System Shutdown // © {new Date().getFullYear()} Nguyễn Thái Huy.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
