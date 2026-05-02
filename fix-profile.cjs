const fs = require('fs');

let content = fs.readFileSync('src/views/core/ProfileView.tsx', 'utf8');

content = content.replace(/import \{ clsx \} from 'clsx';/g, "import { clsx } from 'clsx';\nimport { useAppNavigation } from '../../app/router/useAppNavigation';");
content = content.replace(/interface ProfileProps \{\n  onBack: \(\) => void;\n  onNavigate: \(view: any\) => void;\n\}\n\nconst ProfileView = \(\{ onBack, onNavigate \}: ProfileProps\) => \{/g, "const ProfileView = () => {\n  const { goBack, goTo } = useAppNavigation();");

content = content.replace(/onBack=\{onBack\}/g, "onBack={goBack}");
content = content.replace(/onClick=\{\(\) => onNavigate\('pricing'\)\}/g, "onClick={() => goTo('/pricing')}");
content = content.replace(/onClick=\{\(\) => onNavigate\('stats' as any\)\}/g, "onClick={() => goTo('/estatisticas')}");

fs.writeFileSync('src/views/core/ProfileView.tsx', content);
