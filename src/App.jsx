import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import InteractiveBackground from './components/InteractiveBackground';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import MusicVibes from './components/MusicVibes';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
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

  useEffect(() => {
    // Refresh ScrollTrigger to ensure pinned elements are perfectly calculated
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full bg-voidBlack text-white selection:bg-cyberCyan/30 min-h-screen font-sans relative">
      <InteractiveBackground />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <MusicVibes />
      <Footer />
    </div>
  );
}

export default App;
