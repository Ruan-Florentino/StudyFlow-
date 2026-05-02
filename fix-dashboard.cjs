const fs = require('fs');

let content = fs.readFileSync('src/views/core/DashboardView.tsx', 'utf8');

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
  'anki': '/notas', // Assuming flash is in notes or metodos? 
  'redacao': '/redacao',
  'routine': '/foco', 
};

// First, we replace all raw string literals onNavigate('xyzz')
content = content.replace(/onNavigate\('([\w-]+)'(?:\s+as\s+any)?\)/g, (match, p1) => {
  return `goTo('${pathMap[p1] || '/' + p1}')`;
});

// Second, we see `action.id` or `item.id` being used. Let's add path.
content = content.replace(/\{ id: '([\w-]+)',/g, (match, p1) => {
  return `{ id: '${p1}', path: '${pathMap[p1] || '/' + p1}',`;
});

// Third, change onClick={() => onNavigate(action.id as any)}
content = content.replace(/onClick=\{\(\) => onNavigate\((action|item).id(?: as any)?\)\}/g, "onClick={() => goTo($1.path)}");

// Next, smartRecommendation.actionTab
content = content.replace(/onClick=\{\(\) => onNavigate\(smartRecommendation\.actionTab as any\)\}/g, "onClick={() => goTo('/' + smartRecommendation.actionTab)}");

content = content.replace(/onClick=\{onStartFlow\}/g, "onClick={() => goTo('/foco')}");

fs.writeFileSync('src/views/core/DashboardView.tsx', content);
