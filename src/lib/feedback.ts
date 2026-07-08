export type FeedbackTone = 'tap' | 'soft' | 'success' | 'error' | 'focusStart' | 'focusPause' | 'complete';

export type FeedbackSettings = {
  sound: boolean;
  haptics: boolean;
};

const STORAGE_KEY = 'studyflow_feedback_settings_v1';
const DEFAULT_SETTINGS: FeedbackSettings = { sound: true, haptics: true };

type AudioContextCtor = typeof AudioContext;

let audioContext: AudioContext | null = null;

function isBrowser() {
  return typeof window !== 'undefined';
}

function readStoredSettings(): Partial<FeedbackSettings> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<FeedbackSettings>;
    return {
      sound: typeof parsed.sound === 'boolean' ? parsed.sound : undefined,
      haptics: typeof parsed.haptics === 'boolean' ? parsed.haptics : undefined,
    };
  } catch {
    return {};
  }
}

export function getFeedbackSettings(): FeedbackSettings {
  return { ...DEFAULT_SETTINGS, ...readStoredSettings() };
}

export function setFeedbackSettings(next: Partial<FeedbackSettings>): FeedbackSettings {
  const settings = { ...getFeedbackSettings(), ...next };
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent<FeedbackSettings>('studyflow-feedback-settings', { detail: settings }));
  }
  return settings;
}

function hapticPattern(tone: FeedbackTone): number | number[] {
  switch (tone) {
    case 'success':
      return [10, 28, 12];
    case 'error':
      return [22, 36, 22];
    case 'complete':
      return [12, 32, 12, 32, 18];
    case 'focusStart':
      return [8, 18, 8];
    case 'focusPause':
      return 16;
    case 'soft':
      return 6;
    case 'tap':
    default:
      return 9;
  }
}

export function triggerHapticFeedback(tone: FeedbackTone = 'tap') {
  if (!isBrowser() || !getFeedbackSettings().haptics || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(hapticPattern(tone));
  } catch {
    // Some browsers expose vibrate but block it silently.
  }
}

function ensureAudioContext(): AudioContext | null {
  if (!isBrowser()) return null;
  if (audioContext) return audioContext;
  const AudioContextClass: AudioContextCtor | undefined =
    window.AudioContext || (window as Window & { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext = new AudioContextClass();
  return audioContext;
}

function scheduleTone(ctx: AudioContext, when: number, frequency: number, duration: number, gain = 0.028, type: OscillatorType = 'sine') {
  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, when);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 0.92), when + duration);
  envelope.gain.setValueAtTime(0.0001, when);
  envelope.gain.exponentialRampToValueAtTime(gain, when + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  oscillator.connect(envelope);
  envelope.connect(ctx.destination);
  oscillator.start(when);
  oscillator.stop(when + duration + 0.025);
}

function playTone(tone: FeedbackTone) {
  if (!getFeedbackSettings().sound) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;

  void ctx.resume().then(() => {
    const now = ctx.currentTime;
    switch (tone) {
      case 'success':
        scheduleTone(ctx, now, 660, 0.075, 0.026, 'sine');
        scheduleTone(ctx, now + 0.075, 990, 0.12, 0.032, 'triangle');
        break;
      case 'error':
        scheduleTone(ctx, now, 190, 0.11, 0.034, 'sawtooth');
        scheduleTone(ctx, now + 0.04, 145, 0.14, 0.024, 'sine');
        break;
      case 'complete':
        scheduleTone(ctx, now, 523.25, 0.09, 0.026, 'sine');
        scheduleTone(ctx, now + 0.075, 783.99, 0.11, 0.032, 'triangle');
        scheduleTone(ctx, now + 0.16, 1046.5, 0.16, 0.028, 'sine');
        break;
      case 'focusStart':
        scheduleTone(ctx, now, 440, 0.08, 0.022, 'triangle');
        scheduleTone(ctx, now + 0.065, 587.33, 0.11, 0.026, 'sine');
        break;
      case 'focusPause':
        scheduleTone(ctx, now, 392, 0.09, 0.022, 'sine');
        scheduleTone(ctx, now + 0.055, 293.66, 0.1, 0.018, 'sine');
        break;
      case 'soft':
        scheduleTone(ctx, now, 520, 0.06, 0.016, 'triangle');
        break;
      case 'tap':
      default:
        scheduleTone(ctx, now, 740, 0.045, 0.014, 'sine');
        break;
    }
  }).catch(() => {
    // Audio can be blocked before the first trusted interaction.
  });
}

export function playInteractionFeedback(tone: FeedbackTone = 'tap') {
  triggerHapticFeedback(tone);
  playTone(tone);
}