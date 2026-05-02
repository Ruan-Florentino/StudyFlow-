const fs = require('fs');

let content = fs.readFileSync('src/views/core/ExploreView.tsx', 'utf8');

const pathMap = {
  'stats': '/estatisticas',
  'profile': '/perfil',
  'focus': '/foco',
  'ai': '/ai',
  'questions': '/questoes',
  'comunidade': '/comunidade',
  'reports': '/estatisticas', 
  'exams': '/exames',
  'explore': '/explorar',
  'methods': '/metodos',
  'anki': '/notas',
  'redacao': '/redacao',
  'routine': '/foco', 
};

content = content.replace(/import type { NavigationTab } from '\.\.\/\.\.\/types\/navigation';/g, "import { useAppNavigation } from '../../app/router/useAppNavigation';");
content = content.replace(/interface ExploreViewProps \{\s*onNavigate: \(tab: NavigationTab\) => void;\s*\}/g, "");
content = content.replace(/const ExploreView: React\.FC<ExploreViewProps> = \(\{ onNavigate \}\) => \{/g, "const ExploreView: React.FC = () => {\n  const { goTo } = useAppNavigation();");
content = content.replace(/onNavigate\('([\w-]+)'\)/g, (match, p1) => {
  return `goTo('${pathMap[p1] || '/' + p1}')`;
});

fs.writeFileSync('src/views/core/ExploreView.tsx', content);
