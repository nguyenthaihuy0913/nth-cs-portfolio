import { useState, useRef } from 'react';

// Giữ AudioContext và Analyser ở mức global scope để tránh lỗi "The number of hardware contexts provided (6) is greater than or equal to the maximum bound (6)" khi re-render
let audioContext = null;
let analyser = null;

export const useAudioVisualizer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const dataArrayRef = useRef(null);
  const sourceNodesMap = useRef(new Map());

  const initContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.connect(audioContext.destination);
      
      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    }
    
    // Yêu cầu resume nếu state đang bị suspended do policy trình duyệt
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    setIsInitialized(true);
  };

  const connectSource = (audioElement) => {
    if (!audioContext || !analyser) return;

    // Tránh lỗi DOMException khi gọi createMediaElementSource 2 lần trên cùng 1 element
    if (!sourceNodesMap.current.has(audioElement)) {
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      sourceNodesMap.current.set(audioElement, source);
    }
  };

  const getFrequencyData = () => {
    if (analyser && dataArrayRef.current) {
      analyser.getByteFrequencyData(dataArrayRef.current);
      return dataArrayRef.current;
    }
    return null;
  };

  return {
    initContext,
    connectSource,
    getFrequencyData,
    isInitialized
  };
};
