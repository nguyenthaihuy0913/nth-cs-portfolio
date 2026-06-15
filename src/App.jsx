import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AiNeuralSparkIntro from './components/AiNeuralSparkIntro';
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

  const handleIntroFinish = () => {
    setIntroState('exploded');
    
    // Giao diện chính hiện ra mượt mà (Fade In & Slide Up nhẹ)
    gsap.fromTo(mainContentRef.current, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      }
    );

    // Mờ dần lớp intro
    gsap.to(introWrapperRef.current, {
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setIntroState('finished');
        // Refresh ScrollTrigger sau khi giao diện trượt lên và ổn định
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
          <AiNeuralSparkIntro onFinish={handleIntroFinish} />
        </div>
      )}

      {/* Giao diện chính của Portfolio */}
      <div 
        ref={mainContentRef} 
        className="main-portfolio-content relative opacity-0"
      >
        <InteractiveBackground />
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
