import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { aiService } from '../../../services/aiService';
import { AnimatedButton, GlassCard } from '../../../components/UI';

interface SlidesViewProps {
  onBack: () => void;
}

export function SlidesView({ onBack }: SlidesViewProps) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<{title: string, content: string[]}[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.generateSlides(topic);
      setSlides(res);
      setCurrentSlide(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 space-y-6 pb-28 h-full flex flex-col">
      <header className="flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Aulas IA</h2>
      </header>

      {slides.length === 0 ? (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Qual tema você quer aprender?</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Revolução Francesa, Mitose..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
              />
            </div>
            <AnimatedButton onClick={handleGenerate} className="w-full py-4 text-black" glow disabled={loading}>
              {loading ? 'Gerando Aula...' : 'Gerar Aula'}
              <Sparkles size={18} />
            </AnimatedButton>
          </GlassCard>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-full flex gap-1 mb-4">
            {slides.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentSlide ? 'bg-primary' : 'bg-white/10'}`} />
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -50 }}
              className="w-full aspect-[9/16] max-h-[70vh] bg-gradient-to-br from-card to-background border border-white/10 rounded-3xl p-8 flex flex-col justify-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
              
              <h3 className="text-3xl font-premium-title italic mb-8 relative z-10">{slides[currentSlide].title}</h3>
              <ul className="space-y-6 relative z-10">
                {slides[currentSlide].content.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 text-lg text-white/90 leading-relaxed"
                  >
                    <span className="text-primary mt-1.5">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 mt-8 shrink-0">
            <button 
              onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
              disabled={currentSlide === 0}
              className="flex-1 py-4 rounded-2xl bg-white/5 disabled:opacity-30 font-bold"
            >
              Anterior
            </button>
            <button 
              onClick={() => {
                if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
                else { setSlides([]); setTopic(''); }
              }}
              className="flex-1 py-4 rounded-2xl bg-primary text-black font-bold shadow-[0_0_20px_rgba(0,255,148,0.3)]"
            >
              {currentSlide === slides.length - 1 ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
