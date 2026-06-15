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
  // Kiểm tra thiết bị mobile ngay lần đầu (width < 768px)
  const isMobileInitial = window.innerWidth < 768;
  const [introState, setIntroState] = useState(isMobileInitial ? 'finished' : 'playing'); // 'playing', 'exploded', 'finished'
  const mainContentRef = useRef(null);
  const introWrapperRef = useRef(null);

  const handleIntroFinish = () => {
    setIntroState('exploded');

    // Mờ dần lớp nền đen của intro (cross-fade mượt mà với shader)
    gsap.to(introWrapperRef.current, {
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // Trượt giao diện chính lên bằng GSAP
    gsap.fromTo(mainContentRef.current, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: "power3.out",
        onComplete: () => {
          setIntroState('finished');
          // Chờ một frame để React cập nhật DOM
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        }
      }
    );
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
        <Hero isReady={introState !== 'playing'} />
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
