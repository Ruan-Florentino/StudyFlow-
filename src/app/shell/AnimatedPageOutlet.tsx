import { useEffect, useLayoutEffect, useSyncExternalStore } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  pageShell,
  pageShellReduced,
  pageShellTouch,
} from '../../lib/animations/variants';
import { tweens } from '../../lib/animations/easings';
import { devAgentLog } from '../../lib/devAgentLog';
import { debugSessionIngest } from '../../lib/debugSessionIngest';

const MOBILE_OUTLET_MQ = '(max-width: 767px)';

function subscribeMobileOutlet(callback: () => void) {
  const mq = window.matchMedia(MOBILE_OUTLET_MQ);
  const onChange = () => {
    // #region agent log
    debugSessionIngest({
      hypothesisId: 'H1',
      location: 'AnimatedPageOutlet:matchMedia',
      message: 'narrow breakpoint changed',
      data: { matches: mq.matches },
    });
    // #endregion
    callback();
  };
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getMobileOutletSnapshot() {
  return window.matchMedia(MOBILE_OUTLET_MQ).matches;
}

function getMobileOutletServerSnapshot() {
  return false;
}

/**
 * Outlet com transição entre rotas (Fase 5).
 * `mode="wait"` evita sobreposição; scroll do main é resetado a cada pathname.
 */
export function AnimatedPageOutlet() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isNarrowViewport = useSyncExternalStore(
    subscribeMobileOutlet,
    getMobileOutletSnapshot,
    getMobileOutletServerSnapshot
  );
  const pageKey = `${location.pathname}${location.search}`;

  useEffect(() => {
    // #region agent log
    debugSessionIngest({
      hypothesisId: 'H1',
      location: 'AnimatedPageOutlet:branch',
      message: 'motion branch snapshot',
      data: {
        pathname: location.pathname,
        search: location.search,
        pageKey,
        isNarrowViewport,
        reduceMotion: Boolean(reduceMotion),
        variantMode: reduceMotion
          ? 'reduced'
          : isNarrowViewport
            ? 'touch'
            : 'desktop',
      },
    });
    // #endregion
  }, [
    pageKey,
    isNarrowViewport,
    reduceMotion,
    location.pathname,
    location.search,
  ]);

  useLayoutEffect(() => {
    devAgentLog({
      hypothesisId: 'H4',
      location: 'src/app/shell/AnimatedPageOutlet.tsx',
      message: 'Animated outlet page change',
      data: {
        pathname: location.pathname,
        search: location.search,
        pageKey,
        reduceMotion: Boolean(reduceMotion),
      },
    });
    devAgentLog({
      hypothesisId: 'H5',
      location: 'src/app/shell/AnimatedPageOutlet.tsx:scroll',
      message: 'Scroll reset effect fired',
      data: { pageKey, targetFound: Boolean(document.getElementById('app-main-scroll')) },
    });
    const main = document.getElementById('app-main-scroll');
    requestAnimationFrame(() => {
      main?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      // #region agent log
      debugSessionIngest({
        hypothesisId: 'H2',
        location: 'AnimatedPageOutlet:rAF-scroll',
        message: 'after scrollTo',
        data: {
          pageKey,
          scrollTop: main?.scrollTop ?? null,
        },
      });
      // #endregion
    });
  }, [pageKey, reduceMotion]);

  const variants = reduceMotion
    ? pageShellReduced
    : isNarrowViewport
      ? pageShellTouch
      : pageShell;
  const transition = reduceMotion
    ? tweens.micro
    : isNarrowViewport
      ? tweens.micro
      : tweens.fast;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        className="flex w-full min-w-0 flex-col max-md:flex-1"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
