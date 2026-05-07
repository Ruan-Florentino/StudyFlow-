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

export function preloadRoute(path: string) {
  const preload = preloadMap[path as keyof typeof preloadMap];
  if (preload) {
    preload().catch(() => {
      // Silenciar: preload é best-effort
    });
  }
}
