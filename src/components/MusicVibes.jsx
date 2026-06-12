import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaSpotify, FaSoundcloud } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const MusicVibes = () => {
  const container = useRef(null);
  const cardsRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(cardsRef.current.children, 
      { y: 50, autoAlpha: 0 },
      { 
        y: 0, 
        autoAlpha: 1, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative z-10 w-full py-24 bg-voidBlack overflow-hidden border-t border-glassBorder/30">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-[#1DB954]">Audio</span>
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-widest uppercase">
            Favorite Tracks & Vibes
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Spotify Card */}
          <div className="bento-card p-6 md:p-8 flex flex-col justify-between group hover:border-[#1DB954]/50 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-6">
              <FaSpotify size={30} color="#1DB954" className="drop-shadow-[0_0_10px_#1DB954]" />
              <h3 className="text-2xl font-bold text-white tracking-wider">Spotify Flow</h3>
            </div>
            
            <div className="w-full h-[152px] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(29,185,84,0.1)]">
              <iframe 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/track/3qllaNK66kKxX123f0eKpj?utm_source=generator&theme=0" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
              </iframe>
            </div>

            <a 
              href="https://open.spotify.com/user/31uamnmghhe35th2bia6fmilwtoa" 
              target="_blank" 
              rel="noreferrer"
              data-cursor="hover"
              className="mt-6 inline-block text-sm font-mono tracking-widest uppercase text-[#1DB954] opacity-70 hover:opacity-100 transition-opacity"
            >
              → Visit Profile
            </a>
          </div>

          {/* SoundCloud Card */}
          <div className="bento-card p-6 md:p-8 flex flex-col justify-between group hover:border-[#ff5500]/50 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-6">
              <FaSoundcloud size={30} color="#ff5500" className="drop-shadow-[0_0_10px_#ff5500]" />
              <h3 className="text-2xl font-bold text-white tracking-wider">SoundCloud Vibes</h3>
            </div>
            
            <div className="w-full h-[152px] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,85,0,0.1)] flex items-center justify-center bg-[#111]">
              <iframe 
                width="100%" 
                height="152" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/user-603362622/i-a-ngu-c-tra-n-gian-remix&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true">
              </iframe>
            </div>

            <a 
              href="https://soundcloud.com/huy-thai-553444968" 
              target="_blank" 
              rel="noreferrer"
              data-cursor="hover"
              className="mt-6 inline-block text-sm font-mono tracking-widest uppercase text-[#ff5500] opacity-70 hover:opacity-100 transition-opacity"
            >
              → Visit Profile
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MusicVibes;
