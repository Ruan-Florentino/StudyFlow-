import { useEffect } from 'react';
import type { FocusSound } from './useFocusTimer';

type AudioContextCtor = typeof AudioContext;

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null;
  return window.AudioContext || (window as Window & { webkitAudioContext?: AudioContextCtor }).webkitAudioContext || null;
}

export function useAmbientSound(sound: FocusSound, enabled: boolean, volume: number) {
  useEffect(() => {
    if (!enabled || sound === 'silence') return undefined;
    const AudioContextClass = getAudioContextCtor();
    if (!AudioContextClass) return undefined;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = Math.min(0.16, Math.max(0, volume / 1000));
    master.connect(context.destination);
    const sources: AudioScheduledSourceNode[] = [];
    const nodes: AudioNode[] = [master];

    const startNoise = (filterType: BiquadFilterType, frequency: number) => {
      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const data = buffer.getChannelData(0);
      let previous = 0;
      for (let index = 0; index < data.length; index += 1) {
        const white = Math.random() * 2 - 1;
        previous = previous * 0.985 + white * 0.015;
        data[index] = sound === 'whiteNoise' ? white * 0.42 : previous * 2.6;
      }
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      source.buffer = buffer;
      source.loop = true;
      filter.type = filterType;
      filter.frequency.value = frequency;
      source.connect(filter);
      filter.connect(master);
      source.start();
      sources.push(source);
      nodes.push(source, filter);
    };

    if (sound === 'rain') startNoise('lowpass', 1500);
    if (sound === 'forest') startNoise('lowpass', 620);
    if (sound === 'whiteNoise') startNoise('highpass', 120);
    if (sound === 'cafe') startNoise('bandpass', 780);

    if (sound === 'lofi') {
      [110, 164.81, 220].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 0 ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 0 ? 0.38 : 0.12;
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start();
        sources.push(oscillator);
        nodes.push(oscillator, gain);
      });
    }

    void context.resume().catch(() => undefined);

    return () => {
      sources.forEach((source) => {
        try { source.stop(); } catch { /* already stopped */ }
        try { source.disconnect(); } catch { /* already disconnected */ }
      });
      nodes.forEach((node) => {
        try { node.disconnect(); } catch { /* already disconnected */ }
      });
      void context.close().catch(() => undefined);
    };
  }, [enabled, sound, volume]);
}
