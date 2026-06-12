import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const projects = [
  { title: 'FCode-Parking_Lot_Management_System', label: 'C / System' },
  { title: 'Five Minds AI', label: 'Web / MMO' },
  { title: 'LGBT-Website', label: 'Web / Media' },
];

const OtherProjects = () => {
  const container = useRef(null);
  const cursorImage = useRef(null);

  useGSAP(() => {
    const xTo = gsap.quickTo(cursorImage.current, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(cursorImage.current, "y", { duration: 0.3, ease: "power3" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const projectItems = container.current.querySelectorAll('.project-item');

    projectItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(cursorImage.current, { autoAlpha: 1, scale: 1, duration: 0.3 });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(cursorImage.current, { autoAlpha: 0, scale: 0.8, duration: 0.3 });
      });
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full px-6 md:px-20 py-32 z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-16 border-b border-glassBorder pb-6">
          Other Selected Works
        </h2>

        <div className="flex flex-col">
          {projects.map((p, idx) => (
            <div 
              key={idx} 
              className="project-item group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-glassBorder cursor-pointer"
            >
              <h3 className="text-3xl md:text-5xl font-bold text-charcoal/60 group-hover:text-charcoal transition-colors duration-500">
                {p.title}
              </h3>
              <span className="text-lg font-mono text-gray-500 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Reveal Image */}
      <div 
        ref={cursorImage}
        className="fixed top-0 left-0 w-[400px] h-[300px] pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 opacity-0"
      >
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 backdrop-blur-2xl border border-white shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0,transparent_50%)] animate-pulse mix-blend-overlay"></div>
          <p className="text-gray-500 font-mono tracking-widest uppercase">Preview</p>
        </div>
      </div>
    </section>
  );
};

export default OtherProjects;
