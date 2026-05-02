const fs = require('fs');

let content = fs.readFileSync('src/views/core/FlashcardsView.tsx', 'utf8');

content = content.replace(/import \{ aiService \} from '\.\.\/\.\.\/services\/aiService';/g, "import { aiService } from '../../services/aiService';\nimport { useAppNavigation } from '../../app/router/useAppNavigation';");
content = content.replace(/interface FlashcardsViewProps \{\n  onBack: \(\) => void;\n\}\n\nconst FlashcardsView = \(\{ onBack \}: FlashcardsViewProps\) => \{/g, "const FlashcardsView = () => {\n  const { goBack } = useAppNavigation();");

content = content.replace(/onBack=\{\(\) => \{\n\s*if \(view === 'list'\) onBack\(\);\n\s*else setView\('list'\);\n\s*\}\}/g, "onBack={() => {\n            if (view === 'list') goBack();\n            else setView('list');\n          }}");

fs.writeFileSync('src/views/core/FlashcardsView.tsx', content);
