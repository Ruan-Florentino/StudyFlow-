const fs = require('fs');

let content = fs.readFileSync('src/views/core/QuestionsView.tsx', 'utf8');

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
  'home': '/'
};

content = content.replace(/import type \{ NavigationTab \} from '\.\.\/\.\.\/types\/navigation';/g, "import { useAppNavigation } from '../../app/router/useAppNavigation';");
content = content.replace(/const QuestionsView = \(\{ onNavigate \}: \{ onNavigate\?: \(tab: NavigationTab\) => void \}\) => \{/g, "const QuestionsView = () => {\n  const { goBack, goTo } = useAppNavigation();");
content = content.replace(/import \{ NavigationTab \} from '\.\.\/\.\.\/types\/navigation';/g, "");

content = content.replace(/onBack=\{onNavigate \? \(\) => onNavigate\('home'\) : undefined\}/g, "onBack={() => goTo('/')}");

content = content.replace(/onNavigate=\{onNavigate\}/g, "");
content = content.replace(/onNavigate\('([\w-]+)'\)/g, (match, p1) => {
  return `goTo('${pathMap[p1] || '/' + p1}')`;
});

content = content.replace(/const InlineQuestionCard = \(\{ q, onNavigate \}: \{ q: any, onNavigate\?: \(tab: any\) => void \}\)/g, "const InlineQuestionCard = ({ q }: { q: any })");
content = content.replace(/onClick=\{\(\) => onNavigate\?.*/g, "onClick={() => {}}");

fs.writeFileSync('src/views/core/QuestionsView.tsx', content);
