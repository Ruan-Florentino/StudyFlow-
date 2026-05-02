import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { NavigationTab } from '../../types/navigation';

/**
 * useAppNavigation
 * Hook centralizado de navegação.
 * Substitui o antigo useStore.setActiveTab e useState activeTab.
 */

// Mapeamento bidirecional (opcional, útil para manter compatibilidade com BottomNav etc)
const pathToTabMap: Record<string, NavigationTab> = {
  '/': 'home',
  '/explorar': 'explore',
  '/questoes': 'questions',
  '/redacao': 'redacao',
  '/comunidade': 'comunidade',
  '/perfil': 'profile',
  '/metodos': 'methods',
  '/exames': 'exams',
  '/estatisticas': 'stats',
};

export function useAppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Deriva a a aba atual com base na URL
  const currentTab = pathToTabMap[location.pathname] || 'home';

  return {
    // Navegação simples
    goTo: (path: string) => navigate(path),
    goBack: () => navigate(-1),
    goHome: () => navigate('/'),
    
    // Navegação semântica (atalhos)
    goToDashboard:    () => navigate('/'),
    goToMethods:      () => navigate('/metodos'),
    goToExams:        () => navigate('/exames'),
    goToProfile:      () => navigate('/perfil'),
    goToExplore:      () => navigate('/explorar'),
    goToCommunity:    () => navigate('/comunidade'),
    
    // Estado atual
    currentPath: location.pathname,
    currentTab,
    params,
  };
}
