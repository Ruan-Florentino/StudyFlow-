import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add new imports
const newImports = `
import { PricingPage } from './components/PricingPage';
import { Onboarding } from './components/Onboarding';
import { PremiumGate } from './components/PremiumGate';
import { PaywallModal } from './components/PaywallModal';
`;
content = content.replace("import React, {", newImports + "import React, {");

// Add PricingPage to the type signature of activeTab
content = content.replace("useState<'splash' | 'home'", "useState<'splash' | 'pricing' | 'home'");

// Insert logic inside App
const appLogicRegex = /export default function App\(\) \{\n(.*)const \[activeTab, setActiveTab\]/s;
content = content.replace(/export default function App\(\) \{/, `export default function App() {\n  const { hasCompletedOnboarding } = useStore();`);

// Where it renders activeTabs:
const activeTabsRenderStr = `{activeTab === 'home' && <motion.div key="home"`;
const newTabs = `{activeTab === 'pricing' && <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PricingPage onBack={() => setActiveTab('home')} /></motion.div>}
          ` + activeTabsRenderStr;

content = content.replace(activeTabsRenderStr, newTabs);

// Update Onboarding early return
const returnStr = `return (\n    <div className="min-h-screen`;
const onboardingReturn = `if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={() => window.location.reload()} />;
  }

  return (\n    <div className="min-h-screen`;
content = content.replace(returnStr, onboardingReturn);


// Streak UI in Navbar
const navProfileStr = `{ id: 'profile', icon: User },\n          ].map((tab) => {`;
content = content.replace(navProfileStr, `{ id: 'profile', icon: User },
          ].map((tab) => {`);

// Actually the prompt says "Exibe flame + numero de dias na navbar"
// I will just add a special badge on the 'ranking' or floating on bottom nav
const bottomNavRegex = /<nav \n\s*className="h-\[70px\] px-4 flex justify-between items-center/;
const bottomNavReplacement = `<div className="absolute -top-12 inset-x-0 flex justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 flex items-center gap-2 shadow-lg">
            <Flame size={16} className="text-orange-500" />
            <span className="font-premium-mono font-bold text-sm">{useStore.getState().streak}</span>
          </div>
        </div>
        <nav 
          className="h-[70px] px-4 flex justify-between items-center`;

content = content.replace(bottomNavRegex, bottomNavReplacement);

// Fix premium gates. E.g. <SocraticDuel to <PremiumGate feature="aiTutor"><SocraticDuel
content = content.replace(
  /<SocraticDuel onBack=\{\(\) => setActiveTab\('home'\)\} \/>/g,
  `<PremiumGate feature="aiTutor"><SocraticDuel onBack={() => setActiveTab('home')} /></PremiumGate>`
);
content = content.replace(
  /<Exams onBack=\{\(\) => setActiveTab\('home'\)\} onNavigate=\{setActiveTab as any\} \/>/g,
  `<PremiumGate feature="exams"><Exams onBack={() => setActiveTab('home')} onNavigate={setActiveTab as any} /></PremiumGate>`
);
content = content.replace(
  /<Redacao onBack=\{\(\) => setActiveTab\('home'\)\} \/>/g,
  `<PremiumGate feature="essay"><Redacao onBack={() => setActiveTab('home')} /></PremiumGate>`
);
content = content.replace(
  /<AIChat \/>/g,
  `<PremiumGate feature="aiTutor"><AIChat /></PremiumGate>`
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated using script');
