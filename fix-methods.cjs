const fs = require('fs');

let content = fs.readFileSync('src/views/methods/StudyMethods/StudyMethods.tsx', 'utf8');

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

content = content.replace(/import \{ Header, GlassCard, IconTile \} from '\.\.\/\.\.\/\.\.\/components\/UI';/g, "import { Header, GlassCard, IconTile } from '../../../components/UI';\nimport { useAppNavigation } from '../../../app/router/useAppNavigation';");
content = content.replace(/interface StudyMethodsProps \{[\s\S]*?\}\n\nexport function StudyMethods\(\{ onNavigate \}: StudyMethodsProps\) \{/g, "export function StudyMethods() {\n  const { goBack, goTo } = useAppNavigation();");
content = content.replace(/onBack=\{\(\) => onNavigate\('home'\)\}/g, "onBack={() => goTo('/')}");
content = content.replace(/onClick=\{\(\) => onNavigate\(m\.id as any\)\}/g, "onClick={() => {\n              const path = m.id === 'anki' ? '/notas' : m.id === 'focus' ? '/foco' : `/${m.id}`;\n              goTo(path as any);\n            }}");

fs.writeFileSync('src/views/methods/StudyMethods/StudyMethods.tsx', content);
