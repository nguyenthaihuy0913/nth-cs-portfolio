import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    title: 'Olympic Tin Học',
    desc: 'Huy chương Đồng, Giải Ba Olympic Tin học cấp thành phố.',
  },
  {
    title: 'MYOR 2024',
    desc: 'Giải Ba lập trình robot MYOR năm 2024.',
  },
  {
    title: 'Core Member',
    desc: 'Hoạt động tích cực tại 9.5AI & F-Code.',
  }
];

const About = () => {
  const container = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    const boxes = gridRef.current.children;
    
    gsap.set(boxes, { autoAlpha: 0, y: 30 });

    ScrollTrigger.create({
      trigger: container.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(boxes, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        });
      },
      once: true
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative z-10 w-full px-6 md:px-20 py-24 border-t border-glassBorder/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyberCyan to-neonPurple">About</span> & Achievements
        </h2>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((item, idx) => (
            <div 
              key={idx}
              className="bento-card p-6 md:p-10 hover:bg-white/[0.05] transition-colors duration-500"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-lg text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
