import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import InteractiveBackground from './components/InteractiveBackground';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
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
      <Footer />
    </div>
  );
}

export default App;
