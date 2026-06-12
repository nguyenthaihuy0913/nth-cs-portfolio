import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'Betting Battle',
    desc: 'Cược điểm rủi ro cao trong từng vòng đấu trí.',
  },
  {
    title: 'Totem of Undying',
    desc: 'Hồi sinh tức thời và cộng ngay 10 điểm để lật ngược tình thế.',
  },
  {
    title: 'Anti-Cheat Troll',
    desc: 'Phát hiện lật tab, kích hoạt jumpscare và bêu tên công khai trên dashboard.',
  }
];

const FeaturedProject = () => {
  const container = useRef(null);
  const cardsWrapper = useRef(null);
  const cards = useRef([]);

  useGSAP(() => {
    // We want the features to slide in from right to left one by one
    // We pin the container, and translate the cardsWrapper
    
    // Total scroll distance will be determined by number of cards
    const totalScroll = window.innerWidth * 1.5;

    // Timeline for sliding cards
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 1,
      }
    });

    // Animate cards wrapper from right to left
    // We slide the whole wrapper so cards come into view
    // Or we stagger each card sliding from xPercent: 100 to 0
    cards.current.forEach((card, i) => {
      // initially set cards (except first if we want) to the right
      // Actually, since they are absolute/overlapping or side-by-side?
      // "3 tính năng lần lượt trượt vào từ bên phải (xPercent: 100 -> 0)"
      gsap.set(card, { xPercent: 100, autoAlpha: 0 });
      
      tl.to(card, {
        xPercent: 0,
        autoAlpha: 1,
        ease: 'none',
        duration: 1
      });
      // Optionally slide out the previous card
      if (i < cards.current.length - 1) {
        tl.to(card, {
          xPercent: -100,
          autoAlpha: 0,
          ease: 'none',
          duration: 1
        }, "+=0.5"); // hold it for a bit
      }
    });

  }, { scope: container });

  return (
    <section ref={container} className="relative z-10 w-full h-screen bg-offWhite flex items-center overflow-hidden border-t border-glassBorder">
      <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-20 h-full flex items-center">
        
        {/* Left Info Column */}
        <div className="w-full md:w-1/2 z-20">
          <p className="text-sm font-mono tracking-widest text-gray-500 mb-2 uppercase">Featured Masterpiece</p>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-charcoal mb-6 leading-tight">
            E-Game<br/>Betting Battle
          </h2>
          <div className="mb-6 space-y-2">
            <p className="text-lg text-charcoal font-medium">Tech Stack: Node.js, Socket.io</p>
            <p className="text-lg text-gray-600">Highlight: Trò chơi trắc nghiệm đấu trí thời gian thực.</p>
          </div>
        </div>

        {/* Right Cards Wrapper */}
        <div ref={cardsWrapper} className="absolute right-0 w-full md:w-1/2 h-full flex items-center justify-center">
          {features.map((feature, i) => (
            <div 
              key={i}
              ref={el => cards.current[i] = el}
              className="absolute w-[80%] max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-glassBg border border-glassBorder shadow-2xl"
            >
              <div className="text-6xl font-black text-lightGray mb-6 opacity-50">0{i + 1}</div>
              <h3 className="text-3xl font-bold text-charcoal mb-4">{feature.title}</h3>
              <p className="text-xl text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProject;
