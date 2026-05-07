import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  pageShell,
  pageShellReduced,
  pageShellTransition,
} from '../../lib/animations/variants';
import { tweens } from '../../lib/animations/easings';
import { devAgentLog } from '../../lib/devAgentLog';

/**
 * Outlet com transição entre rotas (Fase 5).
 * `mode="wait"` evita sobreposição; scroll do main é resetado a cada pathname.
 */
export function AnimatedPageOutlet() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const pageKey = `${location.pathname}${location.search}`;

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
    document.getElementById('app-main-scroll')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pageKey, reduceMotion]);

  const variants = reduceMotion ? pageShellReduced : pageShell;
  const transition = reduceMotion ? tweens.micro : pageShellTransition;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        className="min-h-full"
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
