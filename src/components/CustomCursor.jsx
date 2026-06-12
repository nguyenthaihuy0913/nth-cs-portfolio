import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useGSAP(() => {
    // quickTo for smooth performance
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3" });

    const onMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseOver = (e) => {
      // If we hover over elements with data-cursor="hover" or standard links/buttons
      const target = e.target.closest('a, button, [data-cursor="hover"]');
      if (target) {
        gsap.to(cursorRef.current, {
          scale: 3,
          backgroundColor: '#9d00ff', // neonPurple
          mixBlendMode: 'difference',
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest('a, button, [data-cursor="hover"]');
      if (target) {
        gsap.to(cursorRef.current, {
          scale: 1,
          backgroundColor: '#00f3ff', // neonBlue
          mixBlendMode: 'normal',
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 bg-neonBlue rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{ willChange: 'transform' }}
    />
  );
};

export default CustomCursor;
