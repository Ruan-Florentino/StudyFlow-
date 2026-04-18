import fs from 'fs';

const targets = [
  'TheVoid', 'Ouroboros', 'Entropy', 'TheSilence', 'TheBSOD', 'TheBackrooms', 'TheNo', 
  'TheEcho', 'SystemCollapse', 'SimulationEscape', 'TheLiteralEnd', 'TheReboot', 
  'TheNewGamePlus', 'TheIntervention', 'TheTouchGrass', 'TheResignation', 'TheWhiteFlag', 
  'TheSelfDestruct', 'TheClicker', 'TheCaptcha', 'TheTerminal', 'TheCode', 'TheFourthWall', 
  'ThePrompt', 'Eternity', 'Singularity', 'UniversalConsciousness', 'Transcendence', 
  'CosmicPrestige', 'Zenith', 'TrueEnding', 'SourceCode', 'TheSourceCode', 'TheBigBang', 
  'TheArchitect', 'InfinitePrompt', 'TheNexus', 'RealityTuner', 'TheMirror', 
  'ConsciousnessExport', 'TheServerRoom'
];

let content = fs.readFileSync('src/App.tsx', 'utf8');

targets.forEach(t => {
  // eliminate imports
  content = content.replace(new RegExp(`import \\{ ${t} \\} from '\\./components/${t}';?\\n?`, 'g'), '');
  // eliminate from methods constant
  content = content.replace(new RegExp(`\\s*\\{.*id:\\s*['"]${t.toLowerCase().replace(/the-/, '')}.*\\},?\\n?`, 'g'), '');
  // eliminate from commands constant
  content = content.replace(new RegExp(`\\s*\\{.*id:\\s*['"]${t.toLowerCase().replace(/the-/, '')}.*\\},?\\n?`, 'g'), '');
  // eliminate from activeTab rendering
  content = content.replace(new RegExp(`\\s*\\{activeTab === ['"](.*)['"] && <motion.div key=['"](.*)['"].*<${t}.*<\\/motion\\.div>\\}\\n?`, 'g'), '');
});

// Since the ids might be tricky, let's just regex out any activeTab lines that render <TheVoid or any targets
targets.forEach(t => {
  const compRegex = new RegExp(`\\s*\\{activeTab === '.*?' && <motion\\.div.*?>\\s*<${t}( |\\/).*?<\\/motion\\.div>\\}\\n?`, 'g');
  content = content.replace(compRegex, '');
});

// Remove them from methods list
targets.forEach(t => {
  // convert PascalCalse to kebab-case
  const kebab = t.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  
  const cmdRegex = new RegExp(`\\s*\\{\\s*id:\\s*'${kebab}'.*?\\},?\\n?`, 'g');
  content = content.replace(cmdRegex, '');
});

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx cleaned');
