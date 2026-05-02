import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

let audioCtx: AudioContext | null = null;

let audioUnlocked = false;

export const playSuccessSound = async () => {
  if (!audioUnlocked) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      try {
        await audioCtx.resume();
      } catch (e) {
        return;
      }
    }

    if (audioCtx.state !== 'running') return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    // Silent fail
  }
};

export const safePlayAudio = async (url: string | HTMLAudioElement) => {
  if (!audioUnlocked) return null;
  
  try {
    const audio = typeof url === 'string' ? new Audio(url) : url;
    
    // Some browsers require interaction. We catch the promise to avoid console errors.
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      try {
        await playPromise;
      } catch (error) {
        // This handles the "play() failed because the user didn't interact" error silently
        return null;
      }
    }
    return audio;
  } catch (error) {
    return null;
  }
};

/**
 * Prime the audio context on first interaction.
 * Call this in a top-level useEffect in App.tsx.
 */
export const initAudioUnlocker = () => {
  const unlock = () => {
    if (audioUnlocked) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    // Try to play a silent sound to unlock Media elements too
    const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
    silent.play()
      .then(() => {
        audioUnlocked = true;
      })
      .catch(() => {
        // Still locked
      });

    // We can consider it unlocked after any interaction even if silent play fails
    // as the next call (from a real interaction) will work.
    // But setting it to true here might be premature if the silent play failed.
    // However, for studyFlow, we want to allow audio as soon as a click happens.
    audioUnlocked = true;

    // Remove listeners once unlocked
    window.removeEventListener('click', unlock);
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('keydown', unlock);
  };

  window.addEventListener('click', unlock);
  window.addEventListener('touchstart', unlock);
  window.addEventListener('keydown', unlock);
};

export const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00E88F', '#3B82F6', '#8B5CF6', '#F59E0B']
  });
};

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#121214', // Match app background
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
};

export const calculateDaysLeft = (date: string | undefined) => {
  if (!date) return null;
  const today = new Date();
  const examDate = new Date(date);
  if (isNaN(examDate.getTime())) return null;
  const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};
