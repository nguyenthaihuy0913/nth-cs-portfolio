import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaPlay, FaPause, FaSpotify, FaSoundcloud } from 'react-icons/fa';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';
import VisualizerCanvas from './VisualizerCanvas';

gsap.registerPlugin(ScrollTrigger);

const tracks = [
  {
    id: 1,
    title: 'Mùa Mưa Ấy',
    author: 'Vũ',
    src: '/music/track1.mp3',
    icon: FaSpotify,
    color: '#1DB954',
    profileUrl: 'https://open.spotify.com/user/31uamnmghhe35th2bia6fmilwtoa'
  },
  {
    id: 2,
    title: 'Địa Ngục Trần Gian Remix',
    author: 'hoanghaiiin',
    src: '/music/track2.mp3',
    icon: FaSoundcloud,
    color: '#ff5500',
    profileUrl: 'https://soundcloud.com/huy-thai-553444968'
  }
];

const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const CustomPlayer = ({ track, currentPlaying, setCurrentPlaying, visualizer }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const isCurrentlyPlaying = currentPlaying === track.id;

  // Khi audio element sẵn sàng và visualizer đã được init, hãy connect source
  useEffect(() => {
    if (audioRef.current && visualizer.isInitialized) {
      visualizer.connectSource(audioRef.current);
    }
  }, [visualizer.isInitialized]);

  // Nếu bài khác đang phát, pause bài này lại
  useEffect(() => {
    if (!isCurrentlyPlaying && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentPlaying, isCurrentlyPlaying, isPlaying]);

  const togglePlay = () => {
    // Luôn yêu cầu init audioContext khi tương tác (để tránh lỗi policy autoplay)
    if (!visualizer.isInitialized) {
      visualizer.initContext();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentPlaying(null);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentPlaying(track.id);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(current);
    setDuration(dur);
    setProgress(dur > 0 ? (current / dur) * 100 : 0);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / bounds.width;
    const newTime = percent * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(percent * 100);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentPlaying(null);
    setProgress(0);
  };

  const Icon = track.icon;

  return (
    <div className={`bento-card p-6 md:p-8 flex flex-col group transition-all duration-500 border-2 bg-voidBlack/60 backdrop-blur-xl rounded-2xl ${isCurrentlyPlaying ? 'border-cyberCyan shadow-[0_0_30px_rgba(0,243,255,0.2)]' : 'border-glassBorder hover:border-neonPurple/50'}`}>
      <audio 
        ref={audioRef} 
        src={track.src} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-voidBlack border border-gray-800 flex items-center justify-center shrink-0">
            <Icon size={24} color={track.color} className={`drop-shadow-[0_0_8px_${track.color}]`} />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-wider line-clamp-1">{track.title}</h3>
            <p className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest">{track.author}</p>
          </div>
        </div>
        <a 
          href={track.profileUrl} 
          target="_blank" 
          rel="noreferrer"
          className="text-[10px] md:text-xs font-mono tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block"
          style={{ color: track.color }}
        >
          → Profile
        </a>
      </div>

      <div className="mt-auto flex items-center gap-6">
        <button 
          onClick={togglePlay}
          className={`w-14 h-14 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isCurrentlyPlaying ? 'bg-cyberCyan border-cyberCyan text-voidBlack shadow-[0_0_20px_rgba(0,243,255,0.6)]' : 'bg-voidBlack border-cyberCyan/50 text-cyberCyan hover:bg-cyberCyan hover:text-voidBlack hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]'}`}
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
        </button>
        
        <div className="flex-grow flex flex-col gap-3">
          <div 
            className="w-full h-1.5 bg-gray-800 rounded-full cursor-pointer relative overflow-visible group-hover:bg-gray-700 transition-colors"
            onClick={handleSeek}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyberCyan to-neonPurple transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-gray-400 tracking-wider">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MusicVibes = () => {
  const container = useRef(null);
  const cardsRef = useRef(null);
  const [currentPlaying, setCurrentPlaying] = useState(null); // id của bài đang phát
  
  const visualizer = useAudioVisualizer();

  useGSAP(() => {
    gsap.fromTo(cardsRef.current.children, 
      { y: 50, autoAlpha: 0 },
      { 
        y: 0, 
        autoAlpha: 1, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: container });

  const isAnyPlaying = currentPlaying !== null;

  return (
    <section ref={container} className="relative z-10 w-full py-24 bg-voidBlack overflow-hidden border-t border-glassBorder/30">
      <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-20">
        
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-cyberCyan">Audio</span>
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-widest uppercase flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAnyPlaying ? 'bg-cyberCyan animate-pulse shadow-[0_0_8px_#00f3ff]' : 'bg-gray-600'}`}></span>
            Audio Visualizer Active
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map(track => (
            <CustomPlayer 
              key={track.id} 
              track={track} 
              currentPlaying={currentPlaying} 
              setCurrentPlaying={setCurrentPlaying}
              visualizer={visualizer}
            />
          ))}
        </div>
      </div>

      {/* Canvas Visualizer đặt ở background của section hoặc fixed. User yêu cầu fixed bottom màn hình */}
      <VisualizerCanvas 
        getFrequencyData={visualizer.getFrequencyData} 
        isPlaying={isAnyPlaying} 
      />
    </section>
  );
};

export default MusicVibes;
