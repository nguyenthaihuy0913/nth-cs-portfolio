import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  FaSteam, FaXbox, FaTiktok, FaDiscord, 
  FaFacebook, FaGithub, FaYoutube, FaEnvelope,
  FaSpotify, FaSoundcloud, FaTimes
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
  { name: 'Spotify', text: '31uamnm...', icon: <FaSpotify size={40} />, href: 'https://open.spotify.com/user/31uamnmghhe35th2bia6fmilwtoa', color: '#1DB954' },
  { name: 'SoundCloud', text: 'huy-thai', icon: <FaSoundcloud size={40} />, href: 'https://soundcloud.com/huy-thai-553444968', color: '#ff5500' },
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
      className="flex flex-col items-center justify-center p-4 md:p-8 rounded-3xl border border-glassBorder bg-glassBg backdrop-blur-xl transition-all h-[150px] md:h-[200px]"
    >
      <div ref={iconContentRef} className="flex flex-col items-center gap-3 md:gap-4 pointer-events-none">
        <div style={{ color: item.color }} className="drop-shadow-[0_0_15px_currentColor] scale-75 md:scale-100">
          {item.icon}
        </div>
        <div className="text-center">
          <p className="text-xs md:text-sm font-bold text-white mb-1">{item.name}</p>
          <p className="text-[10px] md:text-xs font-mono text-gray-400 break-all max-w-[100px] md:max-w-[120px] leading-tight">{item.text}</p>
        </div>
      </div>
    </a>
  );
};

const DonateModal = ({ isOpen, onClose }) => {
  const modalOverlayRef = useRef(null);
  const modalContentRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(modalOverlayRef.current, { autoAlpha: 1, duration: 0.3 });
      gsap.fromTo(modalContentRef.current, 
        { scale: 0.8, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(modalOverlayRef.current, { autoAlpha: 0, duration: 0.3 });
      gsap.to(modalContentRef.current, { scale: 0.8, autoAlpha: 0, duration: 0.2 });
    }
  }, [isOpen]);

  return (
    <div 
      ref={modalOverlayRef} 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-voidBlack/80 backdrop-blur-md invisible opacity-0 p-4"
    >
      {/* Click overlay to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div 
        ref={modalContentRef} 
        className="relative z-10 w-full max-w-lg bg-glassBg border border-cyberCyan/30 shadow-[0_0_50px_rgba(176,38,255,0.2)] rounded-3xl p-6 md:p-8 text-center"
      >
        <button 
          onClick={onClose}
          data-cursor="hover"
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-white transition-colors p-2"
        >
          <FaTimes size={20} className="md:w-6 md:h-6" />
        </button>

        <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-widest uppercase">
          INITIALIZE <span className="text-neonPurple">SUPPORT</span>
        </h3>
        <p className="text-gray-300 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed">
          Cảm ơn bạn đã ủng hộ để mình duy trì server và phát triển thêm nhiều dự án xịn xò hơn! 🚀
        </p>

        {/* QR Code Container with Neon Trace */}
        <div className="relative inline-block rounded-3xl overflow-hidden p-[2px] bg-gradient-to-br from-neonPurple via-voidBlack to-cyberCyan animate-pulse">
          <div className="bg-voidBlack rounded-[22px] p-4 md:p-6 relative">
            <img 
              src="/qr-donate.png" 
              alt="Donate QR Code" 
              className="w-56 h-56 md:w-80 md:h-80 object-contain rounded-xl relative z-10"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=QR+Code' }}
            />
          </div>
        </div>
        
        <p className="mt-4 md:mt-6 text-[10px] md:text-xs text-cyberCyan font-mono tracking-widest uppercase opacity-70">
          Awaiting Transaction...
        </p>
      </div>
    </div>
  );
};

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="relative w-full py-24 md:py-40 px-4 md:px-12 z-10 border-t border-glassBorder/50 overflow-hidden">
        
        {/* Background Cyber Glow for Footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-neonPurple/10 blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <h2 className="text-[15vw] md:text-[8vw] font-black leading-none mb-16 md:mb-24 text-center tracking-tighter" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent', backgroundImage: 'linear-gradient(to bottom, #fff, #b026ff)', WebkitBackgroundClip: 'text' }}>
            LET'S CONNECT
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl">
            {socials.map((item, idx) => (
              <MagneticSocial key={idx} item={item} />
            ))}
          </div>

          {/* Donate Button */}
          <div className="mt-16 md:mt-20 w-full px-4 md:w-auto text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              data-cursor="hover"
              className="w-full md:w-auto px-6 md:px-10 py-4 md:py-5 bg-transparent border-2 border-neonPurple text-neonPurple font-black uppercase tracking-widest text-sm md:text-lg rounded-full relative overflow-hidden group hover:shadow-[0_0_40px_rgba(176,38,255,0.6)] transition-all duration-300"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Support My Server ☕</span>
              <div className="absolute inset-0 bg-neonPurple transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0 mix-blend-screen" />
            </button>
          </div>

          <div className="mt-24 text-center flex flex-col items-center">
            <div className="w-10 h-10 border border-cyberCyan/50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <div className="w-2 h-2 bg-cyberCyan rounded-full" />
            </div>
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">
              System Shutdown // © {new Date().getFullYear()} Nguyễn Thái Huy.
            </p>
          </div>
        </div>
      </footer>

      {/* Render Donate Modal */}
      <DonateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Footer;
