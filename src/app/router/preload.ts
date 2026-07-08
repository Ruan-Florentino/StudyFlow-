/**
 * Mapa de preload functions.
 * Cada chave aponta pra um chunk lazy.
 */

export const preloadMap = {
  '/estatisticas': () => import('../../views/core/StatsView').then(m => m.default),
  '/perfil': () => import('../../views/core/ProfileView').then(m => m.default),
  '/foco': () => import('../../components/FocusMode').then(m => m.FocusMode),
  '/ai': () => import('../../pages/AIHub').then(m => m.AIHub),
  '/questoes': () => import('../../views/core/QuestionsView').then(m => m.default),
  '/comunidade': () => import('../../pages/ComunidadePage').then(m => m.ComunidadePage),
  '/exames': () => import('../../views/exams/ExamsView').then(m => m.ExamsView),
  '/simulados': () => import('../../views/exams/ExamsView').then(m => m.ExamsView),
  '/explorar': () => import('../../views/core/ExploreView').then(m => m.default),
  '/metodos': () => import('../../views/methods/StudyMethods/StudyMethods').then(m => m.StudyMethods),
  '/notas': () => import('../../views/core/NotesView').then(m => m.default),
  '/redacao': () => import('../../components/Redacao').then(m => m.Redacao),
  '/ranking': () => import('../../components/Ranking').then(m => m.Ranking),
  '/rotina': () => import('../../components/SmartSchedule').then(m => m.SmartSchedule),
} as const;

const preloadedRoutes = new Set<string>();
let coreRoutesQueued = false;

export const CORE_PRELOAD_PATHS = [
  '/explorar',
  '/questoes',
  '/redacao',
  '/ai',
  '/simulados',
  '/metodos',
] as const;

function normalizePreloadPath(path: string) {
  const [pathname] = path.split('?');
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

type WindowWithIdleCallback = Window & typeof globalThis & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
};

function runOnIdle(task: () => void, timeout: number) {
  const idleWindow = window as WindowWithIdleCallback;
  if (typeof idleWindow.requestIdleCallback === 'function') {
    idleWindow.requestIdleCallback(task, { timeout });
    return;
  }
  window.setTimeout(task, Math.min(timeout, 800));
}

export function preloadRoute(path: string) {
  const normalizedPath = normalizePreloadPath(path);
  const preload = preloadMap[normalizedPath as keyof typeof preloadMap];
  if (!preload || preloadedRoutes.has(normalizedPath)) return;

  preloadedRoutes.add(normalizedPath);
  preload().catch(() => {
    preloadedRoutes.delete(normalizedPath);
  });
}

export function preloadRouteOnIdle(path: string, timeout = 1200) {
  runOnIdle(() => preloadRoute(path), timeout);
}

export function preloadCoreRoutes() {
  if (coreRoutesQueued) return;
  coreRoutesQueued = true;
  CORE_PRELOAD_PATHS.forEach((path, index) => {
    preloadRouteOnIdle(path, 900 + index * 220);
  });
}
