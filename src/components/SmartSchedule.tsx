import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Calendar, Clock, BookOpen, Target, Zap, CheckCircle2, Brain } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, Badge } from './UI';
import { aiService } from '../services/aiService';
import clsx from 'clsx';

export const SmartSchedule = ({ onBack }: { onBack: () => void }) => {
  const { setRoutine, routine, themeColor } = useStore();
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState('');
  const [hours, setHours] = useState(4);
  const [days, setDays] = useState<string[]>(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);
  const [level, setLevel] = useState('Intermediário');
  const [loading, setLoading] = useState(false);

  const toggleDay = (day: string) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generatedRoutine = await aiService.generateRoutine(target, hours, days, level);
      setRoutine(generatedRoutine as any);
      setStep(5); // Result step
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isValidRoutine = routine && routine.target && routine.schedule && routine.schedule[0]?.blocks;

  if (isValidRoutine && step === 1) {
    return (
      <div className="p-6 space-y-8 pb-32">
        <header className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-premium-title italic">CRONOGRAMA<span className="text-primary font-normal not-italic ml-2 text-sm tracking-widest uppercase opacity-50">Ativo</span></h2>
        </header>

        <GlassCard className="p-6 border-primary/30 bg-primary/5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{routine.target}</h3>
              <p className="text-sm text-text-secondary">{routine.weeklyHours}h semanais</p>
            </div>
            <Badge variant="primary">Ativo</Badge>
          </div>
          <button onClick={() => { setRoutine(null); setStep(1); }} className="text-xs text-red-400 hover:text-red-300 underline">Criar novo cronograma</button>
        </GlassCard>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Sua Semana</h3>
          </div>
          
          {routine.schedule.map((dayPlan: any, idx: number) => (
            <GlassCard key={idx} className="p-4 border-white/5">
              <h4 className="font-bold text-primary mb-3">{dayPlan.day}</h4>
              <div className="space-y-2">
                {dayPlan.blocks.map((block: any, bIdx: number) => (
                  <div key={bIdx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      {block.type === 'theory' && <BookOpen size={16} className="text-blue-400" />}
                      {block.type === 'practice' && <Target size={16} className="text-orange-400" />}
                      {block.type === 'review' && <Zap size={16} className="text-yellow-400" />}
                      <span className="text-sm font-medium">{block.subject}</span>
                    </div>
                    <span className="text-xs font-premium-mono text-text-secondary">{block.duration} min</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-32 min-h-screen flex flex-col">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-premium-title italic">CRONOGRAMA<span className="text-primary font-normal not-italic ml-2 text-sm tracking-widest uppercase opacity-50">IA</span></h2>
      </header>

      {step < 5 && (
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]' : 'bg-white/10'}`} />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-2 text-center">
              <Target size={48} className="mx-auto text-primary mb-4" />
              <h3 className="text-3xl font-premium-title italic">Qual seu objetivo?</h3>
              <p className="text-text-secondary text-sm">Escolha o vestibular ou concurso foco.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['ENEM', 'Fuvest', 'Unicamp', 'ITA/IME', 'EsPCEx/ESA', 'Concursos', 'OAB', 'Outro'].map(t => (
                <button 
                  key={t}
                  onClick={() => { setTarget(t); setStep(2); }}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all ${target === t ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,148,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-2 text-center">
              <Clock size={48} className="mx-auto text-primary mb-4" />
              <h3 className="text-3xl font-premium-title italic">Tempo Diário</h3>
              <p className="text-text-secondary text-sm">Quantas horas por dia você pode estudar?</p>
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="text-7xl font-premium-mono font-black text-primary drop-shadow-[0_0_20px_rgba(0,255,148,0.4)]">{hours}h</div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={hours} 
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <button onClick={() => setStep(3)} className="w-full py-4 bg-primary text-black font-bold rounded-2xl uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,255,148,0.3)]">Continuar</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-2 text-center">
              <Calendar size={48} className="mx-auto text-primary mb-4" />
              <h3 className="text-3xl font-premium-title italic">Dias da Semana</h3>
              <p className="text-text-secondary text-sm">Quais dias você vai estudar?</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                <button 
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`w-16 h-16 rounded-2xl border flex items-center justify-center font-bold transition-all ${days.includes(d) ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,148,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 text-text-secondary'}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(4)} disabled={days.length === 0} className="w-full py-4 bg-primary text-black font-bold rounded-2xl uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,255,148,0.3)] disabled:opacity-50 disabled:shadow-none mt-8">Continuar</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-2 text-center">
              <Brain size={48} className="mx-auto text-primary mb-4" />
              <h3 className="text-3xl font-premium-title italic">Seu Nível</h3>
              <p className="text-text-secondary text-sm">Como você avalia sua base atual?</p>
            </div>
            <div className="space-y-3">
              {['Iniciante', 'Intermediário', 'Avançado'].map(l => (
                <button 
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`w-full p-5 rounded-2xl border text-left font-bold transition-all ${level === l ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,148,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 text-text-secondary'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-white text-black font-bold rounded-2xl uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] mt-8 flex justify-center items-center">
              {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : 'Gerar Cronograma IA'}
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-primary" />
            </div>
            <h3 className="text-3xl font-premium-title italic">Cronograma Pronto!</h3>
            <p className="text-text-secondary">Sua rotina foi otimizada pela IA com base no seu perfil e objetivo.</p>
            <button onClick={() => setStep(1)} className="w-full py-4 bg-primary text-black font-bold rounded-2xl uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,255,148,0.3)] mt-8">Ver Cronograma</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
