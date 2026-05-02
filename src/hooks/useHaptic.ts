import { useEffect, useCallback } from 'react';

export const useHaptic = () => {
  const trigger = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;
    
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(40);
        break;
      case 'success':
        navigator.vibrate([10, 30, 20]);
        break;
      case 'warning':
        navigator.vibrate([20, 20, 20]);
        break;
      case 'error':
        navigator.vibrate([40, 20, 40, 20, 40]);
        break;
    }
  }, []);

  return trigger;
};
