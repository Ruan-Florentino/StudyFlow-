import React, { lazy } from 'react';

// Core Views
const DashboardView = lazy(() => import('../../views/core/DashboardView').then(m => ({ default: m.default })));
import { PremiumGate } from '../../components/PremiumGate';
import { useAIUI } from '../../hooks/useAIUI';

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

const StudyMethods = lazy(() => import('../../views/methods').then(m => ({ default: m.StudyMethods })));
const ExamsView = lazy(() => import('../../views/exams').then(m => ({ default: m.ExamsView })));

const PricingPage = lazy(() => import('../../components/PricingPage').then(m => ({ default: m.PricingPage })));
const AgentChatPage = lazy(() => import('../../components/AI/AgentChatPage').then(m => ({ default: m.AgentChatPage })));
const AIHub = lazy(() => import('../../pages/AIHub').then(m => ({ default: m.AIHub })));
const ComunidadePage = lazy(() => import('../../pages/ComunidadePage').then(m => ({ default: m.ComunidadePage })));
const Redacao = lazy(() => import('../../components/Redacao').then(m => ({ default: m.Redacao })));
const FocusMode = lazy(() => import('../../components/FocusMode').then(m => ({ default: m.FocusMode })));
const Ranking = lazy(() => import('../../components/Ranking').then(m => ({ default: m.Ranking })));
const SmartSchedule = lazy(() => import('../../components/SmartSchedule').then(m => ({ default: m.SmartSchedule })));

// Easter Eggs / Advanced methods
const MemoryPalace = lazy(() => import('../../components/MemoryPalace').then(m => ({ default: m.MemoryPalace })));
const SocraticDuel = lazy(() => import('../../components/SocraticDuel').then(m => ({ default: m.SocraticDuel })));
const BrainUpload = lazy(() => import('../../components/BrainUpload').then(m => ({ default: m.BrainUpload })));
const GodMode = lazy(() => import('../../components/GodMode').then(m => ({ default: m.GodMode })));
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

const FeynmanMethod = lazy(() => import('../../views/methods').then(m => ({ default: m.FeynmanMethod })));
const BlurtingMethod = lazy(() => import('../../views/methods').then(m => ({ default: m.BlurtingMethod })));
const ActiveRecallScreen = lazy(() => import('../../views/methods').then(m => ({ default: m.ActiveRecallScreen })));
const InterleavingScreen = lazy(() => import('../../views/methods').then(m => ({ default: m.InterleavingScreen })));
const SlidesView = lazy(() => import('../../views/methods').then(m => ({ default: m.SlidesView })));
const VideoSummarizer = lazy(() => import('../../views/methods').then(m => ({ default: m.VideoSummarizer })));
const SkillTree = lazy(() => import('../../views/methods').then(m => ({ default: m.SkillTree })));
const LearningPath = lazy(() => import('../../views/methods').then(m => ({ default: m.LearningPath })));
const MindMapScreen = lazy(() => import('../../views/methods').then(m => ({ default: m.MindMapScreen })));

// Wrapper component to handle AI conditional
const AIWrapper = () => {
  const { selectedAgent: aiSelectedAgent, viewMode: aiViewMode } = useAIUI();
  return (
    <PremiumGate feature="aiTutor">
      {aiSelectedAgent && aiViewMode === 'page' ? (
        <AgentChatPage />
      ) : (
        <AIHub />
      )}
    </PremiumGate>
  );
};

export interface RouteConfig {
  path: string;
  label?: string;
  Component: React.ComponentType<any>;
}

export const routes: RouteConfig[] = [
  { path: '/', label: 'Dashboard', Component: DashboardView },
  { path: '/notas', label: 'Notas', Component: NotesView },
  { path: '/upgrade', label: 'Premium', Component: PricingPage },
  { path: '/premium', label: 'Upgrade Premium', Component: PricingPage },
  { path: '/explorar', label: 'Explorar', Component: ExploreView },
  { path: '/foco', label: 'Focus Mode', Component: FocusMode },
  { path: '/ai', label: 'AI Tutor', Component: AIWrapper },
  { path: '/questoes', label: 'Questões', Component: QuestionsView },
  { path: '/redacao', label: 'Redação', Component: () => <PremiumGate feature="essay"><Redacao onBack={() => {}} /></PremiumGate> },
  { path: '/perfil', label: 'Perfil', Component: ProfileView },
  { path: '/perfil/dados-pessoais', label: 'Dados Pessoais', Component: DadosPessoais },
  { path: '/perfil/suporte', label: 'Suporte', Component: SuportePage },
  { path: '/perfil/termos-de-uso', label: 'Termos de Uso', Component: TermosDeUsoPage },
  { path: '/perfil/politica-de-privacidade', label: 'Política de Privacidade', Component: PoliticaPrivacidadePage },
  { path: '/perfil/sobre', label: 'Sobre', Component: SobrePage },
  { path: '/comunidade', label: 'Comunidade', Component: ComunidadePage },
  { path: '/palacio-memoria', label: 'Palácio da Memória', Component: MemoryPalace },
  { path: '/duelo-socratico', label: 'Duelo Socrático', Component: () => <PremiumGate feature="aiTutor"><SocraticDuel onBack={() => {}} /></PremiumGate> },
  { path: '/upload-cerebral', Component: BrainUpload },
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
  { path: '/analisador-documentos', Component: DocumentAnalyzer },
  { path: '/god-mode', Component: GodMode },
  { path: '/ranking', label: 'Ranking', Component: Ranking },
  { path: '/estatisticas', label: 'Estatísticas', Component: StatsView },
  { path: '/relatorios', label: 'Relatórios', Component: StatsView },
  { path: '/exames', label: 'Exames', Component: () => <PremiumGate feature="exams"><ExamsView /></PremiumGate> },
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
