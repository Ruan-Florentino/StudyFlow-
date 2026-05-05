import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Network, ChevronRight, RotateCcw, Download, Share2 } from 'lucide-react';
import { useStore, MindMap } from '../../../store';
import { aiService } from '../../../services/aiService';
import { AnimatedButton, GlassCard, MindMapNode } from '../../../components/UI';

interface MindMapScreenProps {
  onBack: () => void;
}

export function MindMapScreen({ onBack }: MindMapScreenProps) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState<MindMap | null>(null);
  const { addMindMap, mindMaps } = useStore();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.generateMindMap(topic);
      const newMap = {
        id: Math.random().toString(36).substr(2, 9),
        topic: res.topic,
        nodes: res.nodes,
        createdAt: new Date().toISOString()
      };
      setMap(newMap);
      addMindMap(newMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Mapa Mental IA</h2>
      </header>

      {!map ? (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Qual o tema do mapa?</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Revolução Industrial, Mitose..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
              />
            </div>
            <AnimatedButton onClick={handleGenerate} className="w-full py-4" glow disabled={loading}>
              {loading ? 'Gerando Conexões...' : 'Gerar Mapa Mental'}
              <Network size={18} />
            </AnimatedButton>
          </GlassCard>

          {mindMaps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-secondary uppercase">Mapas Recentes</h3>
              <div className="grid gap-3">
                {mindMaps.map((m) => (
                  <GlassCard key={m.id} onClick={() => setMap(m)} className="flex items-center justify-between py-3 cursor-pointer hover:border-primary/30">
                    <div className="flex items-center gap-3">
                      <Network size={18} className="text-primary" />
                      <span className="font-bold text-sm">{m.topic}</span>
                    </div>
                    <ChevronRight size={16} className="text-white/20" />
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary">{map.topic}</h3>
            <div className="flex gap-2">
              <button onClick={() => setMap(null)} className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary">
                <RotateCcw size={18} />
              </button>
              <button className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border-primary/20 bg-primary/5 min-h-[400px] flex flex-col items-center justify-center gap-12 overflow-x-auto">
            <MindMapNode label={map.topic} color="border-primary" />
            <div className="flex flex-wrap justify-center gap-8">
              {map.nodes.map((node, i) => (
                <MindMapNode key={i} label={node.label} subNodes={node.subNodes} color="border-white/20" />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <AnimatedButton className="flex-1 py-3 text-sm" variant="secondary">
              <Share2 size={18} /> Compartilhar
            </AnimatedButton>
            <AnimatedButton className="flex-1 py-3 text-sm" onClick={() => setMap(null)}>
              Novo Mapa
            </AnimatedButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}
