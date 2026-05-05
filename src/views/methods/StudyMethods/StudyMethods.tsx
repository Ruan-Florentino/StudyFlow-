import { 
  Timer, Layers, Brain, PenTool, Zap, Shuffle, Network, Trophy, 
  Play, FileText, Sparkles, ShieldAlert, UploadCloud, Grid, ChevronRight 
} from 'lucide-react';
import { Header, GlassCard, IconTile } from '../../../components/UI';
import { useAppNavigation } from '../../../app/router/useAppNavigation';

/**
 * Paths must match src/app/router/routes.tsx. Do not use `/${id}` — unknown paths hit * → home.
 */
const STUDY_METHOD_ROUTE_BY_ID: Record<string, string> = {
  focus: '/foco',
  /** Spaced repetition: flashcards view (not /notas). */
  anki: '/cards',
  feynman: '/metodos/feynman',
  blurting: '/metodos/blurting',
  'active-recall': '/metodos/active-recall',
  interleaving: '/metodos/interleaving',
  mindmap: '/metodos/mindmap',
  'learning-path': '/metodos/path',
  'skill-tree': '/metodos/skill-tree',
  'video-summarizer': '/metodos/video',
  'document-analyzer': '/analisador-documentos',
  slides: '/metodos/slides',
  'memory-palace': '/palacio-memoria',
  'socratic-duel': '/duelo-socratico',
  'brain-upload': '/upload-cerebral',
};

export function StudyMethods() {
  const { goTo } = useAppNavigation();

  const realMethods = [
    { id: 'focus', name: 'Pomodoro', icon: Timer, desc: 'Foco intenso com intervalos curtos.', color: 'text-red-400' },
    { id: 'anki', name: 'Spaced Repetition', icon: Layers, desc: 'Revisões programadas com flashcards.', color: 'text-primary' },
    { id: 'feynman', name: 'Método Feynman', icon: Brain, desc: 'Explique como se fosse para uma criança.', color: 'text-blue-400' },
    { id: 'blurting', name: 'Blurting', icon: PenTool, desc: 'Escreva tudo o que lembra sobre um tema.', color: 'text-purple-400' },
    { id: 'active-recall', name: 'Active Recall', icon: Zap, desc: 'Force seu cérebro a recuperar a informação.', color: 'text-yellow-400' },
    { id: 'interleaving', name: 'Interleaving', icon: Shuffle, desc: 'Alterne entre diferentes matérias.', color: 'text-orange-400' },
    { id: 'mindmap', name: 'Mapas Mentais', icon: Network, desc: 'Conecte conceitos visualmente.', color: 'text-emerald-400' },
    { id: 'learning-path', name: 'Roteiro Adaptativo', icon: Network, desc: 'Caminho de aprendizagem personalizado por IA.', color: 'text-blue-400' },
    { id: 'skill-tree', name: 'Árvore de Habilidades', icon: Trophy, desc: 'Visualize sua maestria por matéria.', color: 'text-yellow-500' },
    { id: 'video-summarizer', name: 'Resumidor de Vídeo', icon: Play, desc: 'Resumos e flashcards de vídeos do YouTube.', color: 'text-red-500' },
    { id: 'document-analyzer', name: 'Análise de Documentos', icon: FileText, desc: 'Extraia resumos e flashcards de PDFs com IA.', color: 'text-blue-500' },
    { id: 'slides', name: 'Aulas IA (Slides)', icon: Sparkles, desc: 'Gere apresentações visuais sobre qualquer tema.', color: 'text-emerald-400' },
    { id: 'memory-palace', name: 'Palácio da Memória', icon: Brain, desc: 'Técnica Loci com associações bizarras geradas por IA.', color: 'text-emerald-400' },
    { id: 'socratic-duel', name: 'Arena Socrática', icon: ShieldAlert, desc: 'Debate implacável com IA para testar argumentos.', color: 'text-red-500' },
    { id: 'brain-upload', name: 'Upload Cerebral', icon: UploadCloud, desc: 'A IA digere seu texto e cria um ecossistema de estudos.', color: 'text-purple-500' }
  ];

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <Header 
        title="Métodos"
        subtitle="ESTUDO ATIVO"
        icon={Grid}
        color="blue"
        onBack={() => goTo('/')}
      />

      <div className="grid gap-4">
        {realMethods.map((m) => (
          <GlassCard 
            key={m.id} 
            className="flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => {
              const path = STUDY_METHOD_ROUTE_BY_ID[m.id];
              if (path) goTo(path);
            }}
          >
            <IconTile 
              icon={m.icon} 
              color={m.color.replace('text-', '').replace('-400', '').replace('-500', '') as any} 
              size="sm" 
            />
            <div className="flex-1">
              <h3 className="font-bold">{m.name}</h3>
              <p className="text-xs text-text-secondary">{m.desc}</p>
            </div>
            <ChevronRight size={16} className="text-white/20" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
