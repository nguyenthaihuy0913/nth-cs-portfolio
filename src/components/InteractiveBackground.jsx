import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const InteractiveBackground = () => {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(() => {
    // Custom Cursor tracking
    const cursorX = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
    const cursorY = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });

    // Background Glow Spotlight tracking
    const glowX = gsap.quickTo(glowRef.current, "left", { duration: 0.6, ease: "power3" });
    const glowY = gsap.quickTo(glowRef.current, "top", { duration: 0.6, ease: "power3" });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorX(mouseX);
      cursorY(mouseY);
      glowX(mouseX);
      glowY(mouseY);
    };

    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor="hover"]');
      if (target) {
        gsap.to(cursorRef.current, {
          scale: 2.5,
          backgroundColor: '#b026ff', 
          boxShadow: '0 0 20px #b026ff',
          mixBlendMode: 'screen',
          duration: 0.3
        });
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest('a, button, [data-cursor="hover"]');
      if (target) {
        gsap.to(cursorRef.current, {
          scale: 1,
          backgroundColor: '#00f3ff', 
          boxShadow: '0 0 10px #00f3ff',
          mixBlendMode: 'normal',
          duration: 0.3
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    // Neural Network Canvas setup
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particleCount = 80;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Cap device pixel ratio for performance
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      // Reduce particle count on mobile to boost performance
      particleCount = width < 768 ? 35 : 80;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    let particles = [];
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };
    initParticles();
    
    // Re-init on resize to update count
    window.addEventListener('resize', initParticles);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update & draw particles
      ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
      for (let i = 0; i < particleCount; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, width < 768 ? 1 : 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particleCount; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          const connectionDistance = width < 768 ? 100 : 150;
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(176, 38, 255, ${0.15 - dist / 1000})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to mouse (only on desktop/large screens to save mobile perf)
        if (width >= 768) {
          let mdx = p.x - mouseX;
          let mdy = p.y - mouseY;
          let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.3 - mdist / 666})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }
      }
    };

    gsap.ticker.add(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', initParticles);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      gsap.ticker.remove(render);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-voidBlack">
        {/* Neural Network Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 opacity-40 mix-blend-screen" />
        
        {/* Spotlight */}
        <div 
          ref={glowRef}
          className="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, rgba(176, 38, 255, 0.1) 40%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-5 h-5 bg-cyberCyan rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#00f3ff]"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default InteractiveBackground;
