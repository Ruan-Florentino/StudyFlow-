import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { tweens } from '../../lib/animations/easings';

const HIDE_DELAY_MS = 360;

export function RouteProgress() {
  const location = useLocation();
  const navigation = useNavigation();
  const reduceMotion = useReducedMotion();
  const hideTimerRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const routeKey = useMemo(
    () => `${location.pathname}${location.search}`,
    [location.pathname, location.search]
  );
  const isNavigating = navigation.state !== 'idle';

  useEffect(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    setVisible(true);
    setProgress(isNavigating ? 34 : 100);

    const progressTimer = window.setTimeout(() => {
      setProgress(isNavigating ? 78 : 100);
    }, reduceMotion ? 16 : 90);

    if (!isNavigating) {
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
        hideTimerRef.current = null;
      }, HIDE_DELAY_MS);
    }

    return () => {
      window.clearTimeout(progressTimer);
    };
  }, [isNavigating, reduceMotion, routeKey]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 right-0 top-[env(safe-area-inset-top,0px)] z-[1002] flex justify-center px-0 md:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0.08 } : tweens.fast}
        >
          <div className="h-[3px] w-full max-w-md overflow-hidden bg-white/[0.035] md:max-w-4xl lg:max-w-7xl">
            <motion.div
              className="h-full rounded-r-full bg-[linear-gradient(90deg,var(--hub-primary),rgba(96,245,255,0.95),rgba(255,255,255,0.86))] shadow-[0_0_22px_rgba(var(--hub-primary-rgb),0.42)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={reduceMotion ? { duration: 0.08 } : tweens.fast}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
