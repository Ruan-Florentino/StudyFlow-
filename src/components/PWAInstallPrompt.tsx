import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share, PlusSquare, Download, Check, X, Smartphone, Monitor, ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { GlassCard, AnimatedButton, Logo, cn } from './UI';

export const PWAInstallPrompt = () => {
  const { 
    platform, 
    showPrompt, 
    installApp, 
    dismissPrompt, 
    markAsInstalled 
  } = usePWAInstall();

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md relative"
        >
          <GlassCard className="p-0 border-primary/20 overflow-visible shadow-2xl shadow-primary/10">
            {/* Close Button */}
            <button 
              onClick={dismissPrompt}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-8 space-y-8 text-center relative z-10">
              {/* Logo/Icon */}
              <div className="flex justify-center -mt-16 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <Logo size="xl" className="relative z-10" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {platform === 'ios' ? 'Instale no seu iPhone' : 
                   platform === 'android' ? 'Instale o StudyFlow' : 
                   'Instale no seu Computador'}
                </h2>
                <p className="text-text-secondary text-sm">
                  Tenha a experiência completa, acesso instantâneo e estude sem distrações.
                </p>
              </div>

              {/* Platform Specific Content */}
              <div className="space-y-6 text-left">
                {platform === 'ios' && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] text-center">Tutorial de Instalação</p>
                    <div className="space-y-3">
                      {[
                        { icon: Share, text: 'Toque no ícone de Compartilhar na barra do Safari' },
                        { icon: PlusSquare, text: 'Role para baixo e toque em "Adicionar à Tela de Início"' },
                        { icon: Check, text: 'Toque em "Adicionar" no canto superior direito' }
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {i + 1}
                          </div>
                          <p className="text-xs font-medium text-white/80">{step.text}</p>
                          <step.icon size={16} className="text-white/20 ml-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(platform === 'android' || platform === 'desktop') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                        <Zap size={20} className="text-primary mx-auto" />
                        <span className="text-[10px] font-bold block">Acesso Rápido</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                        <Smartphone size={20} className="text-primary mx-auto" />
                        <span className="text-[10px] font-bold block">Tela Cheia</span>
                      </div>
                    </div>
                    
                    <AnimatedButton 
                      onClick={installApp}
                      className="w-full bg-primary text-black border-primary py-4 rounded-2xl font-bold uppercase tracking-widest"
                      glow
                    >
                      <Download size={18} className="mr-2" />
                      Instalar Agora
                    </AnimatedButton>
                  </div>
                )}

                {/* Common Benefits Footer */}
                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                    <ShieldCheck size={12} className="text-primary" />
                    Não ocupa espaço
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                    <Sparkles size={12} className="text-primary" />
                    Neural Core v3.1
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {platform === 'ios' && (
                  <AnimatedButton 
                    onClick={markAsInstalled}
                    className="w-full bg-white/5 text-white border-white/10 py-4 rounded-2xl"
                  >
                    Já instalei o app
                  </AnimatedButton>
                )}
                <button 
                  onClick={dismissPrompt}
                  className="text-xs text-white/40 hover:text-white transition-colors font-medium"
                >
                  Talvez mais tarde
                </button>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
