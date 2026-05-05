import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Brain, Map as MapIcon, Sparkles, Trash2 } from 'lucide-react';
import { GlassCard, AnimatedButton } from './UI';
import { useStore } from '../store';
import { aiService } from '../services/aiService';

export const MemoryPalace = ({ onBack }: { onBack: () => void }) => {
  const { memoryRooms, addMemoryRoom, addMemoryItem } = useStore();
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [newConcept, setNewConcept] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    addMemoryRoom({
      id: Math.random().toString(36).substr(2, 9),
      name: newRoomName,
      items: []
    });
    setNewRoomName('');
  };

  const handleAddItem = async (roomId: string, roomName: string) => {
    if (!newConcept.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const association = await aiService.generateMemoryAssociation(newConcept, roomName);
      addMemoryItem(roomId, {
        id: Math.random().toString(36).substr(2, 9),
        concept: newConcept,
        association
      });
      setNewConcept('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 animate-in fade-in duration-700">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-premium-title italic uppercase">Palácio da Memória</h2>
          <p className="text-xs text-text-secondary font-premium-mono uppercase tracking-widest">Método de Loci</p>
        </div>
      </header>

      {!selectedRoom ? (
        <div className="space-y-6">
          <GlassCard className="p-6 border-primary/20 bg-primary/5">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-primary">
              <Brain size={18} />
              Como Funciona?
            </h3>
            <p className="text-sm text-text-secondary">
              O Palácio da Memória é uma técnica milenar. Crie "cômodos" virtuais e a IA gerará associações bizarras e memoráveis para os conceitos que você precisa decorar.
            </p>
          </GlassCard>

          <div className="flex gap-2">
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Ex: Minha Sala de Estar, Quarto do Pânico..."
              className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
            />
            <AnimatedButton onClick={handleCreateRoom} className="px-4">
              <Plus size={20} />
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {memoryRooms.map(room => (
              <GlassCard 
                key={room.id} 
                className="p-4 cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden"
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <MapIcon size={24} className="text-text-secondary group-hover:text-primary mb-3 transition-colors" />
                <h4 className="font-bold text-lg">{room.name}</h4>
                <p className="text-xs text-text-secondary">{room.items.length} itens armazenados</p>
              </GlassCard>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {(() => {
            const room = memoryRooms.find(r => r.id === selectedRoom);
            if (!room) return null;
            return (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-primary">{room.name}</h3>
                  <button onClick={() => setSelectedRoom(null)} className="text-xs text-text-secondary underline">Voltar aos Cômodos</button>
                </div>

                <div className="flex gap-2">
                  <input
                    value={newConcept}
                    onChange={(e) => setNewConcept(e.target.value)}
                    placeholder="Conceito para memorizar (ex: Mitocôndria)"
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem(room.id, room.name)}
                  />
                  <AnimatedButton 
                    onClick={() => handleAddItem(room.id, room.name)} 
                    disabled={isGenerating}
                    className="px-4 bg-primary text-black"
                  >
                    {isGenerating ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Sparkles size={20} />}
                  </AnimatedButton>
                </div>

                <div className="space-y-4 relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                  <AnimatePresence>
                    {room.items.map((item, idx) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative pl-10"
                      >
                        <div className="absolute left-[11px] top-4 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]" />
                        <GlassCard className="p-4 border-white/5 hover:border-primary/30 transition-colors">
                          <h4 className="font-bold text-primary mb-2">{item.concept}</h4>
                          <p className="text-sm text-text-secondary leading-relaxed italic">"{item.association}"</p>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {room.items.length === 0 && (
                    <p className="text-center text-text-secondary text-sm py-10 pl-10">Cômodo vazio. Adicione um conceito para a IA gerar uma associação.</p>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
