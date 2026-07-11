import React, { useState } from 'react';
import { GlassCard, AnimatedButton } from '../../components/UI';
import { ChevronLeft, Shield, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { toast } from '../../store/useToastStore';
import { localBackend } from '../../lib/localBackend';
import { useAuth } from '../../contexts/AuthContext';

export const DadosPessoais = () => {
    const navigate = useNavigate();
    const { name, bio, setName, setBio } = useStore();
    const [formData, setFormData] = useState({ name, bio });

    const { user } = useAuth();

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error("Erro", "Nome não pode ser vazio.");
            return;
        }

        setName(formData.name);
        setBio(formData.bio);
        if (user?.id) {
          try {
            const { error } = await localBackend.from('users').update({ name: formData.name, bio: formData.bio }).eq('id', user.id);
            if (error) throw error;
            toast.success("Sucesso", "Dados atualizados com sucesso!");
          } catch(err) {
            console.error('Failed to save to backend:', err);
            toast.error("Erro", "Não foi possível salvar as alterações. Tente novamente.");
          }
        } else {
            toast.success("Sucesso", "Dados atualizados localmente!");
        }
    };

    return (
        <div className="app-shell-premium max-w-xl pt-6 md:pt-8 pb-32 md:pb-36">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-white/60 hover:text-white">
            <ChevronLeft size={20} /> Voltar
          </button>
          <GlassCard className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Dados Pessoais</h1>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <div className="flex items-center gap-2 text-white/90">
                <Shield size={18} className="text-primary shrink-0" aria-hidden />
                <span className="text-sm font-bold">Proteção de dados (LGPD)</span>
              </div>
              <p className="text-xs text-white/65 leading-relaxed">
                Aqui você corrige <strong className="text-white/85">nome e bio</strong> exibidos no perfil. Para acesso
                integral, eliminação, portabilidade, oposição ou relatos de incidente, use o{' '}
                <strong className="text-white/85">encarregado</strong>: altavistaholdingltda@gmail.com — cite os{' '}
                <strong className="text-white/85">Pontos</strong> da Política de Privacidade quando quiser rastrear o
                trecho aplicável.
              </p>
              <button
                type="button"
                onClick={() => navigate('/perfil/politica-de-privacidade')}
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg px-1 py-1"
              >
                <ScrollText size={14} aria-hidden />
                Abrir Política de Privacidade completa
              </button>
            </div>
            
            <div className="space-y-4">
                <label className="block text-sm text-white/60">Nome</label>
                <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                />
            </div>

            <div className="space-y-4">
                <label className="block text-sm text-white/60">Bio</label>
                <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                    rows={3}
                />
            </div>
            
            <AnimatedButton onClick={handleSave} className="w-full">Salvar Alterações</AnimatedButton>
          </GlassCard>
        </div>
    );
};
