const fs = require('fs');

let content = fs.readFileSync('src/views/exams/ExamsView.tsx', 'utf8');

content = content.replace(/import { ExamsHub } from '.\/ExamsHub\/ExamsHub';/g, "import { ExamsHub } from './ExamsHub/ExamsHub';\nimport { useAppNavigation } from '../../app/router/useAppNavigation';");
content = content.replace(/interface ExamsViewProps \{\n  onBack: \(\) => void;\n  onNavigate: \(tab: any\) => void;\n\}\n\nexport const ExamsView = \(\{ onBack, onNavigate \}: ExamsViewProps\) => \{/g, "export const ExamsView = () => {\n  const { goBack, goTo } = useAppNavigation();");

content = content.replace(/<ExamsHub onBack=\{onBack\} onNavigate=\{onNavigate\} onSelectExam=\{handleSelectExam\} \/>/g, "<ExamsHub onSelectExam={handleSelectExam} />");

fs.writeFileSync('src/views/exams/ExamsView.tsx', content);
