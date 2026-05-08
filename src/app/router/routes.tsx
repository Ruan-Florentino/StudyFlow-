import React, { lazy, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { PremiumGate } from '../../components/PremiumGate';
import { devAgentLog } from '../../lib/devAgentLog';

// Core Views
const DashboardView = lazy(() => import('../../views/core/DashboardView').then(m => ({ default: m.default })));

// ⚡ Lazy Loaded Views
const QuestionsView = lazy(() => import('../../views/core/QuestionsView').then(m => ({ default: m.default })));
const ExploreView = lazy(() => import('../../views/core/ExploreView').then(m => ({ default: m.default })));
const ProfileView = lazy(() => import('../../views/core/ProfileView').then(m => ({ default: m.default })));
const DadosPessoais = lazy(() => import('../../pages/perfil/DadosPessoais').then(m => ({ default: m.DadosPessoais })));
const SuportePage = lazy(() => import('../../pages/perfil/Suporte').then(m => ({ default: m.Suporte })));
const TermosDeUsoPage = lazy(() => import('../../pages/perfil/TermosDeUso').then(m => ({ default: m.TermosDeUso })));
const PoliticaPrivacidadePage = lazy(() => import('../../pages/perfil/PoliticaPrivacidade').then(m => ({ default: m.PoliticaPrivacidade })));
const SobrePage = lazy(() => import('../../pages/perfil/Sobre').then(m => ({ default: m.Sobre })));
const FlashcardsView = lazy(() => import('../../views/core/FlashcardsView').then(m => ({ default: m.default })));
const StatsView = lazy(() => import('../../views/core/StatsView').then(m => ({ default: m.default })));
const NotesView = lazy(() => import('../../views/core/NotesView').then(m => ({ default: m.default })));

const StudyMethods = lazy(() => import('../../views/methods/StudyMethods').then(m => ({ default: m.StudyMethods })));
const ExamsView = lazy(() => import('../../views/exams/ExamsView').then(m => ({ default: m.ExamsView })));

/** Simulados: mesma view para hub, setup, prova e resultado (params em `ExamsView`). */
function SimuladosExamView() {
  const location = useLocation();
  useEffect(() => {
    devAgentLog({
      hypothesisId: 'H9',
      location: 'src/app/router/routes.tsx:SimuladosExamView',
      message: 'Simulados route render',
      data: { pathname: location.pathname, search: location.search },
    });
  }, [location.pathname, location.search]);
  return (
    <PremiumGate feature="exams">
      <ExamsView />
    </PremiumGate>
  );
}

const PricingPage = lazy(() =>
  import('../../components/PricingPage').then((m) => ({ default: m.PricingPage }))
);
const PremiumCheckoutPage = lazy(() =>
  import('../../pages/premium/PremiumCheckoutPage').then((m) => ({ default: m.PremiumCheckoutPage }))
);
const PremiumSuccessPage = lazy(() =>
  import('../../pages/premium/PremiumSuccessPage').then((m) => ({ default: m.PremiumSuccessPage }))
);
const AIHub = lazy(() => import('../../pages/AIHub').then(m => ({ default: m.AIHub })));
const ComunidadePage = lazy(() => import('../../pages/ComunidadePage').then(m => ({ default: m.ComunidadePage })));
const Redacao = lazy(() => import('../../components/Redacao').then(m => ({ default: m.Redacao })));
const FocusMode = lazy(() => import('../../components/FocusMode').then(m => ({ default: m.FocusMode })));
const Ranking = lazy(() => import('../../components/Ranking').then(m => ({ default: m.Ranking })));
const SmartSchedule = lazy(() => import('../../components/SmartSchedule').then(m => ({ default: m.SmartSchedule })));

// Easter Eggs / Advanced methods
const MemoryPalace = lazy(() => import('../../components/MemoryPalace').then(m => ({ default: m.MemoryPalace })));
const SocraticDuel = lazy(() => import('../../components/SocraticDuel').then(m => ({ default: m.SocraticDuel })));
const QuantumReading = lazy(() => import('../../components/QuantumReading').then(m => ({ default: m.QuantumReading })));
const TimeDilation = lazy(() => import('../../components/TimeDilation').then(m => ({ default: m.TimeDilation })));
const AkashicRecords = lazy(() => import('../../components/AkashicRecords').then(m => ({ default: m.AkashicRecords })));
const SubliminalAudio = lazy(() => import('../../components/SubliminalAudio').then(m => ({ default: m.SubliminalAudio })));
const HolographicTutor = lazy(() => import('../../components/HolographicTutor').then(m => ({ default: m.HolographicTutor })));
const MatrixDownload = lazy(() => import('../../components/MatrixDownload').then(m => ({ default: m.MatrixDownload })));
const NeuralTerminal = lazy(() => import('../../components/NeuralTerminal').then(m => ({ default: m.NeuralTerminal })));
const CyberneticImplants = lazy(() => import('../../components/CyberneticImplants').then(m => ({ default: m.CyberneticImplants })));
const OmniscienceProtocol = lazy(() => import('../../components/OmniscienceProtocol').then(m => ({ default: m.OmniscienceProtocol })));
const TheOracle = lazy(() => import('../../components/TheOracle').then(m => ({ default: m.TheOracle })));
const NeuralSculptor = lazy(() => import('../../components/NeuralSculptor').then(m => ({ default: m.NeuralSculptor })));
const ConceptGenesis = lazy(() => import('../../components/ConceptGenesis').then(m => ({ default: m.ConceptGenesis })));
const Credits = lazy(() => import('../../components/Credits').then(m => ({ default: m.Credits })));
const DocumentAnalyzer = lazy(() => import('../../components/DocumentAnalyzer').then(m => ({ default: m.DocumentAnalyzer })));
const ArchiveView = lazy(() => import('../../components/TheArchive').then(m => ({ default: m.TheArchive })));
const HiveMindView = lazy(() => import('../../components/HiveMind').then(m => ({ default: m.HiveMind })));
const NeuralForgeView = lazy(() => import('../../components/NeuralForge').then(m => ({ default: m.NeuralForge })));
const NeuralAlchemistView = lazy(() => import('../../components/NeuralAlchemist').then(m => ({ default: m.NeuralAlchemist })));
const NeuralSyncView = lazy(() => import('../../components/NeuralSync').then(m => ({ default: m.NeuralSync })));
const TheNexusView = lazy(() => import('../../components/TheNexus').then(m => ({ default: m.TheNexus })));

const FeynmanMethod = lazy(() =>
  import('../../views/methods/Feynman/FeynmanMethod').then(m => ({ default: m.FeynmanMethod }))
);
const BlurtingMethod = lazy(() =>
  import('../../views/methods/Blurting/BlurtingMethod').then(m => ({ default: m.BlurtingMethod }))
);
const ActiveRecallScreen = lazy(() =>
  import('../../views/methods/ActiveRecall/ActiveRecallScreen').then(m => ({ default: m.ActiveRecallScreen }))
);
const InterleavingScreen = lazy(() =>
  import('../../views/methods/Interleaving/InterleavingScreen').then(m => ({ default: m.InterleavingScreen }))
);
const SlidesView = lazy(() =>
  import('../../views/methods/Slides/SlidesView').then(m => ({ default: m.SlidesView }))
);
const VideoSummarizer = lazy(() =>
  import('../../views/methods/VideoSummarizer/VideoSummarizer').then(m => ({ default: m.VideoSummarizer }))
);
const SkillTree = lazy(() =>
  import('../../views/methods/SkillTree/SkillTree').then(m => ({ default: m.SkillTree }))
);
const LearningPath = lazy(() =>
  import('../../views/methods/LearningPath/LearningPath').then(m => ({ default: m.LearningPath }))
);
const MindMapScreen = lazy(() =>
  import('../../views/methods/MindMap/MindMapScreen').then(m => ({ default: m.MindMapScreen }))
);

// Global AI Hub
const ATHENA_HUB = () => (
  <PremiumGate feature="aiTutor">
    <AIHub />
  </PremiumGate>
);

function ArchiveRoute() {
  const navigate = useNavigate();
  return <ArchiveView onBack={() => navigate(-1)} />;
}

function HiveMindRoute() {
  const navigate = useNavigate();
  return <HiveMindView onBack={() => navigate(-1)} />;
}

function NeuralForgeRoute() {
  const navigate = useNavigate();
  return <NeuralForgeView onBack={() => navigate(-1)} />;
}

function NeuralAlchemistRoute() {
  const navigate = useNavigate();
  return <NeuralAlchemistView onBack={() => navigate(-1)} />;
}

function NeuralSyncRoute() {
  const navigate = useNavigate();
  return <NeuralSyncView onBack={() => navigate(-1)} />;
}

function TheNexusRoute() {
  const navigate = useNavigate();
  return <TheNexusView onBack={() => navigate(-1)} />;
}

function MemoryPalaceRoute() {
  const navigate = useNavigate();
  return <MemoryPalace onBack={() => navigate(-1)} />;
}

function DocumentAnalyzerRoute() {
  const navigate = useNavigate();
  return <DocumentAnalyzer onBack={() => navigate(-1)} />;
}

function DueloSocraticoRoute() {
  const navigate = useNavigate();
  return (
    <PremiumGate feature="aiTutor">
      <SocraticDuel onBack={() => navigate(-1)} />
    </PremiumGate>
  );
}

function PremiumLandingRoute() {
  const navigate = useNavigate();
  return <PricingPage onBack={() => navigate(-1)} />;
}

export interface RouteConfig {
  path: string;
  label?: string;
  Component: React.ComponentType<any>;
}

export const routes: RouteConfig[] = [
  { path: '/', label: 'Dashboard', Component: DashboardView },
  { path: '/notas', label: 'Notas', Component: NotesView },
  { path: '/upgrade', label: 'Premium', Component: () => <Navigate to="/premium" replace /> },
  { path: '/premium', label: 'Upgrade Premium', Component: PremiumLandingRoute },
  { path: '/premium/checkout', label: 'Checkout Premium', Component: PremiumCheckoutPage },
  { path: '/premium/success', label: 'Premium — Sucesso', Component: PremiumSuccessPage },
  { path: '/explorar', label: 'Explorar', Component: ExploreView },
  { path: '/foco', label: 'Modo Foco', Component: FocusMode },
  { path: '/ai', label: 'Mentoria', Component: ATHENA_HUB },
  { path: '/questoes', label: 'Questões', Component: QuestionsView },
  { path: '/redacao', label: 'Redação', Component: () => <PremiumGate feature="essay"><Redacao onBack={() => {}} /></PremiumGate> },
  { path: '/perfil', label: 'Perfil', Component: ProfileView },
  { path: '/perfil/dados-pessoais', label: 'Dados Pessoais', Component: DadosPessoais },
  { path: '/perfil/suporte', label: 'Suporte', Component: SuportePage },
  { path: '/perfil/termos-de-uso', label: 'Termos de Uso', Component: TermosDeUsoPage },
  { path: '/perfil/politica-de-privacidade', label: 'Política de Privacidade', Component: PoliticaPrivacidadePage },
  { path: '/perfil/sobre', label: 'Sobre', Component: SobrePage },
  { path: '/comunidade', label: 'Comunidade', Component: ComunidadePage },
  { path: '/palacio-memoria', label: 'Memorização Visual', Component: MemoryPalaceRoute },
  { path: '/duelo-socratico', label: 'Debate Guiado', Component: DueloSocraticoRoute },
  { path: '/leitura-quantica', Component: QuantumReading },
  { path: '/dilatacao-tempo', Component: TimeDilation },
  { path: '/registros-akasicos', Component: AkashicRecords },
  { path: '/audio-subliminar', Component: SubliminalAudio },
  { path: '/tutor-holografico', Component: HolographicTutor },
  { path: '/matrix-download', Component: MatrixDownload },
  { path: '/terminal-neural', Component: NeuralTerminal },
  { path: '/implantes-ciberneticos', Component: CyberneticImplants },
  { path: '/protocolo-onisciencia', Component: OmniscienceProtocol },
  { path: '/oraculo', Component: TheOracle },
  { path: '/escultor-neural', Component: NeuralSculptor },
  { path: '/genese-conceitos', Component: ConceptGenesis },
  { path: '/creditos', Component: Credits },
  { path: '/analisador-documentos', Component: DocumentAnalyzerRoute },
  { path: '/o-arquivo', label: 'Biblioteca Pessoal', Component: ArchiveRoute },
  { path: '/mente-colmeia', label: 'Estudo Colaborativo', Component: HiveMindRoute },
  { path: '/forja-neural', label: 'Laboratório de Ideias', Component: NeuralForgeRoute },
  { path: '/alquimista-neural', label: 'Reescrita Inteligente', Component: NeuralAlchemistRoute },
  { path: '/sincronia-neural', label: 'Sincronia de Estudos', Component: NeuralSyncRoute },
  { path: '/nexus', label: 'Central de Resultados', Component: TheNexusRoute },
  { path: '/ranking', label: 'Ranking', Component: Ranking },
  { path: '/estatisticas', label: 'Estatísticas', Component: StatsView },
  { path: '/relatorios', label: 'Relatórios', Component: () => <Navigate to="/estatisticas" replace /> },
  { path: '/exames', label: 'Exames', Component: () => <PremiumGate feature="exams"><ExamsView /></PremiumGate> },
  { path: '/simulados', label: 'Simulados', Component: SimuladosExamView },
  { path: '/simulados/:examId/run', label: 'Simulado — Prova', Component: SimuladosExamView },
  { path: '/simulados/:examId/result', label: 'Simulado — Resultado', Component: SimuladosExamView },
  { path: '/simulados/:examId', label: 'Simulado', Component: SimuladosExamView },
  { path: '/cards', label: 'Flashcards', Component: FlashcardsView },
  { path: '/rotina', label: 'Smart Schedule', Component: SmartSchedule },
  { path: '/metodos', label: 'Métodos de Estudo', Component: StudyMethods },
  { path: '/metodos/feynman', label: 'Feynman', Component: FeynmanMethod },
  { path: '/metodos/blurting', label: 'Blurting', Component: BlurtingMethod },
  { path: '/metodos/active-recall', label: 'Active Recall', Component: ActiveRecallScreen },
  { path: '/metodos/interleaving', label: 'Interleaving', Component: InterleavingScreen },
  { path: '/metodos/slides', label: 'Slides', Component: SlidesView },
  { path: '/metodos/video', label: 'Video Summarizer', Component: VideoSummarizer },
  { path: '/metodos/skill-tree', label: 'Skill Tree', Component: SkillTree },
  { path: '/metodos/path', label: 'Learning Path', Component: LearningPath },
  { path: '/metodos/mindmap', label: 'Mind Map', Component: MindMapScreen },
];
