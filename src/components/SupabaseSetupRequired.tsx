import React from 'react';
import { motion } from 'motion/react';
import { Database, AlertTriangle, ExternalLink } from 'lucide-react';
import { GlassCard, AnimatedButton } from './UI';

export const SupabaseSetupRequired = () => {
  return (
    <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-8 border-primary/20 bg-primary/5">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
            <Database size={40} className="text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Configuração Necessária</h1>
            <p className="text-white/60 text-sm">
              As variáveis de ambiente do Supabase não foram encontradas. 
              Siga as instruções abaixo para ativar o backend.
            </p>
          </div>

          <div className="w-full space-y-4 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle size={14} />
                <span>Passos para configurar:</span>
              </div>
              <ol className="text-xs text-white/50 space-y-2 list-decimal list-inside">
                <li>Acesse o dashboard do <span className="text-white">Supabase</span></li>
                <li>Vá em <span className="text-white">Settings &gt; API</span></li>
                <li>Copie a <span className="text-white">Project URL</span> e <span className="text-white">anon public key</span></li>
                <li>No editor (settings), adicione as keys em: <br/> 
                   <code className="text-primary block mt-1 bg-black/40 p-1 rounded">VITE_SUPABASE_URL</code>
                   <code className="text-primary block mt-1 bg-black/40 p-1 rounded">VITE_SUPABASE_ANON_KEY</code>
                </li>
              </ol>
            </div>
          </div>

          <AnimatedButton 
            className="w-full py-4 bg-primary text-black font-bold flex items-center justify-center gap-2"
            onClick={() => window.location.reload()}
          >
            <span>Já configurei, recarregar</span>
          </AnimatedButton>

          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="no-referrer"
            className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1"
          >
            Ir para Supabase Dashboard <ExternalLink size={12} />
          </a>
        </div>
      </GlassCard>
    </div>
  );
};
