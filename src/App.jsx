import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AiBrainMorphIntro from './components/AiBrainMorphIntro';
import InteractiveBackground from './components/InteractiveBackground';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import MusicVibes from './components/MusicVibes';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [introState, setIntroState] = useState('playing'); // 'playing', 'exploded', 'finished'
  const mainContentRef = useRef(null);
  const introWrapperRef = useRef(null);

  useEffect(() => {
    // Set trạng thái ban đầu an toàn bằng GSAP
    if (mainContentRef.current) {
      gsap.set(mainContentRef.current, { opacity: 0, y: 50 });
    }
  }, []);

  const handleIntroFinish = () => {
    setIntroState('exploded');

    // Mờ dần lớp intro
    gsap.to(introWrapperRef.current, {
      autoAlpha: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // Trượt giao diện chính lên bằng GSAP
    gsap.to(mainContentRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 1.2, 
      ease: "power3.out",
      clearProps: "all", // Xóa TẤT CẢ inline style để ngăn xung đột với class CSS và ScrollTrigger
      onComplete: () => {
        setIntroState('finished');
        ScrollTrigger.refresh();
      }
    });
  };

  // Anti-Inspect & Selection Blocker
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Prevent F12
      if (e.key === 'F12' || e.keyCode === 123) e.preventDefault();
      // Prevent Ctrl+Shift+I / Cmd+Option+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) e.preventDefault();
      // Prevent Ctrl+Shift+J / Cmd+Option+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) e.preventDefault();
      // Prevent Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) e.preventDefault();
    };
    const handleDragStart = (e) => e.preventDefault();
    const handleSelectStart = (e) => e.preventDefault();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  return (
    <div className={`w-full bg-voidBlack text-white selection:bg-cyberCyan/30 min-h-screen font-sans relative ${introState !== 'finished' ? 'overflow-hidden h-screen' : ''}`}>
      
      {/* Lớp Overlay Intro 3D */}
      {introState !== 'finished' && (
        <div ref={introWrapperRef} className="fixed inset-0 z-[9999] bg-black">
          <AiBrainMorphIntro onFinish={handleIntroFinish} />
        </div>
      )}

      {/* Background tương tác độc lập (Không bị ảnh hưởng bởi transform) */}
      <InteractiveBackground />

      {/* Giao diện chính của Portfolio */}
      <div 
        ref={mainContentRef} 
        className="main-portfolio-content relative z-10"
      >
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <MusicVibes />
        <Footer />
      </div>

    </div>
  );
}

export default App;
