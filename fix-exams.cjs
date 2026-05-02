const fs = require('fs');

let content = fs.readFileSync('src/views/exams/ExamsView.tsx', 'utf8');

content = content.replace(/import { ExamsHub } from '.\/ExamsHub\/ExamsHub';/g, "import { ExamsHub } from './ExamsHub/ExamsHub';\nimport { useAppNavigation } from '../../app/router/useAppNavigation';");
content = content.replace(/interface ExamsViewProps \{\n  onBack: \(\) => void;\n  onNavigate: \(tab: any\) => void;\n\}\n\nexport const ExamsView = \(\{ onBack, onNavigate \}: ExamsViewProps\) => \{/g, "export const ExamsView = () => {\n  const { goBack, goTo } = useAppNavigation();");

content = content.replace(/<ExamsHub onBack=\{onBack\} onNavigate=\{onNavigate\} onSelectExam=\{handleSelectExam\} \/>/g, "<ExamsHub onSelectExam={handleSelectExam} />");

content = fs.readFileSync('src/views/exams/ExamsHub/ExamsHub.tsx', 'utf8');

content = content.replace(/import \{ clsx \} from 'clsx';/g, "import { clsx } from 'clsx';\nimport { useAppNavigation } from '../../../app/router/useAppNavigation';");
content = content.replace(/interface ExamsHubProps \{\n  onBack: \(\) => void;\n  onNavigate: \(tab: any\) => void;\n  onSelectExam: \(exam: Exam, view: 'plan' | 'simulado'\) => void;\n\}\n\nexport const ExamsHub = \(\{ onBack, onNavigate, onSelectExam \}: ExamsHubProps\) => \{/g, "interface ExamsHubProps {\n  onSelectExam: (exam: Exam, view: 'plan' | 'simulado') => void;\n}\n\nexport const ExamsHub = ({ onSelectExam }: ExamsHubProps) => {\n  const { goBack, goTo } = useAppNavigation();");

content = content.replace(/onBack=\{onBack\}/g, "onBack={goBack}");
content = content.replace(/onClick=\{\(\) => onNavigate\('focus'\)\}/g, "onClick={() => goTo('/foco')}");

fs.writeFileSync('src/views/exams/ExamsHub/ExamsHub.tsx', content);
