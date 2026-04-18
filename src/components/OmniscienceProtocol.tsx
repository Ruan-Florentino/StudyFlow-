import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, ChevronLeft, Radar, Target, Crosshair } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';

export const OmniscienceProtocol = ({ onBack }: { onBack: () => void }) => {
  const [targetExam, setTargetExam] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const startScan = async () => {
    if (!targetExam.trim()) return;
    setIsScanning(true);
    setResults(null);

    try {
      const prompt = `Atue como um analista de dados educacionais onisciente. O usuário quer saber o que vai cair na prova: "${targetExam}".
      Gere uma lista de 5 tópicos altamente prováveis de serem cobrados, baseando-se no histórico dessa prova (ou provas similares).
      Retorne APENAS um JSON estruturado como um array de objetos, onde cada objeto tem:
      - topic: string (nome do assunto)
      - probability: number (probabilidade de 0 a 100, com uma casa decimal)
      - impact: string ("Crítico", "Alto", ou "Médio")`;

      const response = await aiService.generateStudyPlan(prompt); // Using generateStudyPlan as a generic text generator
      
      // Try to parse the response as JSON
      try {
        const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedResults = JSON.parse(jsonStr);
        setResults(parsedResults);
      } catch (e) {
        // Fallback if AI doesn't return perfect JSON
        setResults([
          { topic: 'Erro na Matriz Neural', probability: 0, impact: 'Crítico' },
          { topic: 'Tente ser mais específico', probability: 0, impact: 'Alto' }
        ]);
      }
    } catch (error) {
      console.error("Omniscience error:", error);
      setResults([
        { topic: 'Falha de Conexão Akáshica', probability: 0, impact: 'Crítico' }
      ]);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32 min-h-screen bg-black relative overflow-hidden">
      {/* Radar Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full border border-amber-500/30 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full border border-amber-500/30 flex items-center justify-center">
            <div className="w-[400px] h-[400px] rounded-full border border-amber-500/30 flex items-center justify-center">
              <div className="w-[200px] h-[200px] rounded-full border border-amber-500/30" />
            </div>
          </div>
        </div>
        <motion.div 
          className="absolute w-[400px] h-[400px] border-r-2 border-amber-500 rounded-full origin-bottom-right"
          style={{ right: '50%', bottom: '50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">
          Protocolo Onisciência<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8 mt-12">
        <GlassCard className="p-8 border-amber-500/30 bg-black/80 backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <Eye size={48} className="mx-auto text-amber-500 mb-4" />
            <h3 className="text-xl font-bold text-white font-mono uppercase tracking-widest">Previsão Quântica de Provas</h3>
            <p className="text-sm text-amber-400/70 font-mono">Insira o alvo. A IA calculará a matriz de probabilidade exata do que vai cair.</p>
          </div>
          
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Ex: ENEM 2026, ITA, Polícia Federal..." 
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="flex-1 bg-amber-950/30 border border-amber-500/50 rounded-xl p-4 text-amber-400 font-mono focus:outline-none focus:border-amber-400 uppercase"
            />
            <AnimatedButton onClick={startScan} disabled={isScanning || !targetExam.trim()} className="px-8 bg-amber-600 hover:bg-amber-500 text-black font-bold font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50">
              {isScanning ? <Radar className="animate-spin" /> : <Target />}
            </AnimatedButton>
          </div>
        </GlassCard>

        {isScanning && (
          <div className="text-center space-y-4">
            <Crosshair size={64} className="mx-auto text-amber-500 animate-pulse" />
            <p className="text-amber-400 font-mono uppercase tracking-widest animate-pulse">Analisando 14.582.304 futuros possíveis...</p>
          </div>
        )}

        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h4 className="text-amber-500 font-mono uppercase tracking-widest text-center mb-6">Matriz de Probabilidade: {targetExam}</h4>
            {results.map((res, i) => (
              <GlassCard key={i} className="p-4 border-amber-500/20 bg-amber-950/20 flex items-center justify-between">
                <div>
                  <h5 className="text-white font-bold">{res.topic}</h5>
                  <span className={cn(
                    "text-xs font-mono uppercase tracking-wider",
                    res.impact === 'Crítico' ? 'text-red-400' : res.impact === 'Alto' ? 'text-amber-400' : 'text-yellow-400'
                  )}>
                    Impacto: {res.impact}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
                    {res.probability}%
                  </div>
                  <span className="text-xs text-amber-400/50 font-mono uppercase">Certeza</span>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
