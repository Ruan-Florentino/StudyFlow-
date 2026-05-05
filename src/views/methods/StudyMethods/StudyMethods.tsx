import { useState } from 'react';
import { 
  Timer, Layers, Brain, PenTool, Zap, Shuffle, Network, Trophy, 
  Play, FileText, Sparkles, ShieldAlert, UploadCloud, Clock, 
  Star, Wand2, Cpu, Database, Hammer, Beaker, Activity, Eye, 
  Download, Terminal, Headphones, Library, Grid, ChevronRight 
} from 'lucide-react';
import { Header, GlassCard, IconTile } from '../../../components/UI';
import { useAppNavigation } from '../../../app/router/useAppNavigation';

export function StudyMethods() {
  const { goBack, goTo } = useAppNavigation();
  const [clickCount, setClickCount] = useState(0);
  const showHidden = clickCount >= 7;

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

  const memeMethods = [
    { id: 'the-zeno', name: 'Paradoxo de Zenão', icon: Clock, desc: 'Avançando... mas nunca chegando.', color: 'text-gray-500' },
    { id: 'credits', name: 'Créditos', icon: Star, desc: 'Obrigado por jogar.', color: 'text-gray-400' },
    { id: 'akashic-records', name: 'Registros Akáshicos', icon: Network, desc: 'Acesse a biblioteca universal do conhecimento.', color: 'text-amber-500' },
    { id: 'concept-genesis', name: 'Gênese de Conceitos', icon: Wand2, desc: 'Manifeste novas estruturas de conhecimento através da intenção pura.', color: 'text-orange-500' },
    { id: 'multiverse-navigator', name: 'Navegador do Multiverso', icon: Layers, desc: 'Escolha a realidade estética que melhor ressoa com sua mente.', color: 'text-blue-500' },
    { id: 'neural-sculptor', name: 'Escultor Neural', icon: Cpu, desc: 'Reconfigure suas conexões sinápticas.', color: 'text-blue-400' },
    { id: 'the-oracle', name: 'A Oráculo', icon: Star, desc: 'Descubra o destino escrito no seu conhecimento.', color: 'text-amber-600' },
    { id: 'the-archive', name: 'O Arquivo', icon: Database, desc: 'Todos os seus ciclos, todas as suas vidas.', color: 'text-green-500' },
    { id: 'hive-mind', name: 'Mente Colmeia', icon: Network, desc: 'Conecte-se a um conselho de IAs geniais para debater tópicos.', color: 'text-blue-400' },
    { id: 'neural-forge', name: 'Forja Neural', icon: Hammer, desc: 'Funda dois conceitos para criar uma nova teoria híbrida.', color: 'text-red-500' },
    { id: 'neural-alchemist', name: 'Alquimista Neural', icon: Beaker, desc: 'Transmute dois tópicos em um conceito proibido.', color: 'text-purple-400' },
    { id: 'neural-sync', name: 'Sincronização Neural', icon: Activity, desc: 'Visualize sua rede neural em tempo real.', color: 'text-primary' },
    { id: 'cybernetic-implants', name: 'Implantes Cibernéticos', icon: Cpu, desc: 'Faça upgrade no seu cérebro com XP.', color: 'text-pink-500' },
    { id: 'omniscience-protocol', name: 'Protocolo Onisciência', icon: Eye, desc: 'Preveja o futuro das suas provas.', color: 'text-amber-500' },
    { id: 'matrix-download', name: 'Download Direto', icon: Download, desc: 'Baixe habilidades diretamente para o seu córtex.', color: 'text-green-500' },
    { id: 'neural-terminal', name: 'Terminal Neural', icon: Terminal, desc: 'Hackeie seu próprio foco através de linha de comando.', color: 'text-emerald-500' },
    { id: 'holographic-tutor', name: 'Tutor Holográfico', icon: Cpu, desc: 'Seu mentor de IA pessoal em formato holográfico.', color: 'text-cyan-400' },
    { id: 'subliminal-audio', name: 'Frequências Neurais', icon: Headphones, desc: 'Áudio binaural para induzir estados de foco e memória.', color: 'text-indigo-400' },
    { id: 'time-dilation', name: 'Dilatação Temporal', icon: Clock, desc: 'Câmara hiperbárica cognitiva. 1 hora parece 10 minutos.', color: 'text-purple-400' },
    { id: 'quantum-reading', name: 'Leitura Quântica', icon: Zap, desc: 'Leitura dinâmica RSVP e Biônica para absorção 3x mais rápida.', color: 'text-blue-400' },
    { id: 'library-of-babel', name: 'Biblioteca de Babel', icon: Library, desc: 'Acesse o arquivo infinito de todo o conhecimento possível.', color: 'text-stone-500' },
  ];

  const displayMethods = showHidden ? [...realMethods, ...memeMethods] : realMethods;

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <Header 
        title="Métodos"
        subtitle={showHidden ? "GOD MODE ON" : "ESTUDO ATIVO"}
        icon={showHidden ? Sparkles : Grid}
        color={showHidden ? "primary" : "blue"}
        onBack={() => goTo('/')}
        onClickTitle={() => setClickCount(c => c + 1)}
      />

      <div className="grid gap-4">
        {displayMethods.map((m) => (
          <GlassCard 
            key={m.id} 
            className="flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => {
              const path = m.id === 'anki' ? '/notas' : m.id === 'focus' ? '/foco' : `/${m.id}`;
              goTo(path as any);
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
