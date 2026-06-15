import React, { useEffect, useRef } from 'react';

const VisualizerCanvas = ({ getFrequencyData, isPlaying }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const barsDataRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      // Độ cao canvas lấy theo tailwind h-32 = 128px
      canvas.height = 128;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const draw = () => {
      // Xóa toàn bộ canvas để vẽ frame mới
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dataArray = getFrequencyData ? getFrequencyData() : null;
      
      const barCount = 128; // Tương đương fftSize = 256
      const barWidth = canvas.width / barCount;
      const heightMultiplier = canvas.height / 255.0; // 255 là max value của byte frequency data

      if (barsDataRef.current.length === 0) {
        barsDataRef.current = new Array(barCount).fill(0);
      }

      let allZero = true;

      for (let i = 0; i < barCount; i++) {
        const targetValue = dataArray ? dataArray[i] : 0;
        
        // Damping Effect (Quán tính)
        // Lên thì nhanh (không delay), xuống thì từ từ nhân với hệ số damping
        if (targetValue > barsDataRef.current[i]) {
           barsDataRef.current[i] = targetValue;
        } else {
           barsDataRef.current[i] *= 0.90; // Hệ số rơi tụt dần
        }

        const currentVal = barsDataRef.current[i];
        if (currentVal > 0.5) allZero = false;

        // Vẽ vạch baseline tối thiểu 2px để luôn thấy một đường thẳng khi tắt nhạc
        const barHeight = Math.max(2, currentVal * heightMultiplier);
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        // Gradient Cyan -> Neon Purple
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00f3ff');
        gradient.addColorStop(1, '#b026ff');

        ctx.fillStyle = gradient;

        // Glow Effect: tần số càng cao phát sáng càng rực
        if (currentVal > 150) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#b026ff';
        } else if (currentVal > 50) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00f3ff';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillRect(x, y, barWidth - 1, barHeight);
        
        // Reset shadow để không ảnh hưởng bar tiếp theo nếu nó thấp
        ctx.shadowBlur = 0;
      }

      // Tối ưu CPU: Nếu đang Pause và tất cả bar đã rơi xuống sát 0 thì ngắt requestAnimationFrame
      if (!isPlaying && allZero) {
        return;
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    // Khởi động vòng lặp vẽ vô điều kiện mỗi lần useEffect chạy
    requestRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(requestRef.current);
    };
  }, [getFrequencyData, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-[9999]"
    />
  );
};

export default VisualizerCanvas;
