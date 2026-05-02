import { useState, useEffect } from 'react';

export type PomodoroMode = 'foco' | 'curta' | 'longa';

const DURATIONS = {
  foco: 25 * 60,
  curta: 5 * 60,
  longa: 15 * 60
};

export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>('foco');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.foco);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // load state
    const savedTime = localStorage.getItem('studyflow_pomodoro_time');
    const savedMode = localStorage.getItem('studyflow_pomodoro_mode') as PomodoroMode;
    const savedActive = localStorage.getItem('studyflow_pomodoro_active') === 'true';
    const lastTick = localStorage.getItem('studyflow_pomodoro_last_tick');

    if (savedMode && DURATIONS[savedMode]) {
      setMode(savedMode);
      if (savedTime && lastTick && savedActive) {
        const passed = Math.floor((Date.now() - parseInt(lastTick)) / 1000);
        setTimeLeft(Math.max(0, parseInt(savedTime) - passed));
      } else if (savedTime) {
        setTimeLeft(parseInt(savedTime));
      } else {
        setTimeLeft(DURATIONS[savedMode]);
      }
      setIsActive(savedActive);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyflow_pomodoro_mode', mode);
    localStorage.setItem('studyflow_pomodoro_time', timeLeft.toString());
    localStorage.setItem('studyflow_pomodoro_active', isActive.toString());
    localStorage.setItem('studyflow_pomodoro_last_tick', Date.now().toString());

    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsActive(false);
            // play sound logic here?
            return 0;
          }
          return t - 1;
        });
        localStorage.setItem('studyflow_pomodoro_last_tick', Date.now().toString());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    }
  }, [isActive, timeLeft, mode]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const changeMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(DURATIONS[newMode]);
  };

  const formattedTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return { mode, timeLeft, isActive, toggle, reset, changeMode, formattedTime };
}
