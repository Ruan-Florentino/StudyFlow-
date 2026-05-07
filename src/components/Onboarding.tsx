import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Target, Clock, BookOpen, Sparkles, Home, Compass } from 'lucide-react';
import { GlassCard, AnimatedButton } from './UI';
import { useStore } from '../store';

export const Onboarding = ({ onComplete }: { onComplete: (initialPath: string) => void }) => {
  const [step, setStep] = useState(1);
  const { setOnboardingData } = useStore();
  const [data, setData] = useState({
    objetivo: '',
    horas: '',
    dificuldades: [] as string[],
    objetivoFinalText: '',
    objetivoFinalDate: ''
  });

  const nextStep = () => {
    if (step < 5) setStep(s => s + 1);
  };
  
  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const finishWithRoute = (initialPath: string) => {
    setOnboardingData(data);
    onComplete(initialPath);
  };

  const difficultiesList = ['Matemática', 'Português', 'Redação', 'História', 'Geografia', 'Biologia', 'Física', 'Química', 'Inglês'];

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-white/10 w-full relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step / 5) * 100}%` }}
          className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Target size={32} className="text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Qual seu objetivo principal?</h2>
                <p className="text-text-secondary">Isso nos ajuda a personalizar sua jornada de estudos.</p>
              </div>

              <div className="grid gap-3">
                {['ENEM', 'Vestibular (USP/UNICAMP/etc)', 'Concurso Público', 'Ensino Médio', 'Outro'].map((option) => (
                  <button
                    key={option}
                    onClick={() => { setData({ ...data, objetivo: option }); nextStep(); }}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      data.objetivo === option ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-bold">{option}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Clock size={32} className="text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Quantas horas você estuda por dia?</h2>
                <p className="text-text-secondary">Seja honesto. A constância vence a intensidade.</p>
              </div>

              <div className="grid gap-3">
                {['Menos de 1h', '1-2h', '2-4h', 'Mais de 4h'].map((option) => (
                  <button
                    key={option}
                    onClick={() => { setData({ ...data, horas: option }); nextStep(); }}
                    className={`p-5 rounded-2xl border text-center transition-all ${
                      data.horas === option ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-bold">{option}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen size={32} className="text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Quais matérias são sua maior dificuldade?</h2>
                <p className="text-text-secondary">Selecione quantas quiser. Nossa IA focará em suas fraquezas.</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {difficultiesList.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      const isSelected = data.dificuldades.includes(option);
                      setData({
                        ...data,
                        dificuldades: isSelected 
                          ? data.dificuldades.filter(d => d !== option)
                          : [...data.dificuldades, option]
                      });
                    }}
                    className={`px-6 py-3 rounded-full border transition-all ${
                      data.dificuldades.includes(option) ? 'border-primary bg-primary text-black' : 'border-white/10 bg-white/5 hover:border-white/20 text-white'
                    }`}
                  >
                    <span className="font-bold">{option}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <AnimatedButton onClick={prevStep} variant="ghost" className="px-6">Voltar</AnimatedButton>
                <AnimatedButton 
                  onClick={nextStep} 
                  disabled={data.dificuldades.length === 0}
                  className="px-8"
                >
                  Continuar <ArrowRight size={16} />
                </AnimatedButton>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,148,0.3)]">
                  <Sparkles size={32} className="text-black" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Configure seu objetivo</h2>
                <p className="text-text-secondary">Para onde estamos indo?</p>
              </div>

              <GlassCard className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Eu quero passar em...</label>
                  <input
                    type="text"
                    value={data.objetivoFinalText}
                    onChange={e => setData({ ...data, objetivoFinalText: e.target.value })}
                    placeholder="Ex: Medicina na USP"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Até...</label>
                  <input
                    type="date"
                    value={data.objetivoFinalDate}
                    onChange={e => setData({ ...data, objetivoFinalDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white color-scheme-dark"
                  />
                </div>
              </GlassCard>

              <div className="flex justify-between mt-8">
                <AnimatedButton onClick={prevStep} variant="ghost" className="px-6">Voltar</AnimatedButton>
                <AnimatedButton 
                  onClick={nextStep} 
                  disabled={!data.objetivoFinalText || !data.objetivoFinalDate}
                  className="px-8 border-primary bg-primary text-black"
                >
                  <Sparkles size={16} />
                  Continuar
                </AnimatedButton>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen size={32} className="text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Seu primeiro passo (rápido)</h2>
                <p className="text-text-secondary max-w-md mx-auto">
                  Escolha uma ação para sentir o app agora. Você pode mudar de ideia depois — o objetivo é uma vitória
                  rápida antes de explorar o restante.
                </p>
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => finishWithRoute('/questoes')}
                  className="p-5 rounded-2xl border border-primary/40 bg-primary/10 text-left transition-all hover:border-primary hover:bg-primary/15"
                >
                  <span className="flex items-center gap-3">
                    <BookOpen size={22} className="text-primary shrink-0" />
                    <span>
                      <span className="font-bold text-white block">Resolver questões</span>
                      <span className="text-sm text-white/55">Banco e treino — ganho imediato</span>
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => finishWithRoute('/')}
                  className="p-5 rounded-2xl border border-white/10 bg-white/5 text-left transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <Home size={22} className="text-primary shrink-0" />
                    <span>
                      <span className="font-bold text-white block">Ver meu painel</span>
                      <span className="text-sm text-white/55">Foco do dia e atalhos</span>
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => finishWithRoute('/explorar')}
                  className="p-5 rounded-2xl border border-white/10 bg-white/5 text-left transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <Compass size={22} className="text-primary shrink-0" />
                    <span>
                      <span className="font-bold text-white block">Explorar métodos</span>
                      <span className="text-sm text-white/55">Descobrir ferramentas de estudo</span>
                    </span>
                  </span>
                </button>
              </div>

              <div className="flex justify-start">
                <AnimatedButton onClick={prevStep} variant="ghost" className="px-6">
                  Voltar
                </AnimatedButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
