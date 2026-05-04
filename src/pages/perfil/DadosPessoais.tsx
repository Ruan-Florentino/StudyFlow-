import React, { useState } from 'react';
import { GlassCard, AnimatedButton } from '../../components/UI';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { toast } from '../../store/useToastStore';
import { supabase } from '../../lib/supabase';
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
            const { error } = await supabase.from('users').update({ name: formData.name, bio: formData.bio }).eq('id', user.id);
            if (error) throw error;
            toast.success("Sucesso", "Dados atualizados com sucesso!");
          } catch(err) {
            console.error('Failed to save to Supabase:', err);
            toast.error("Erro", "Não foi possível salvar as alterações. Tente novamente.");
          }
        } else {
            toast.success("Sucesso", "Dados atualizados localmente!");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-white/60 hover:text-white">
            <ChevronLeft size={20} /> Voltar
          </button>
          <GlassCard className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Dados Pessoais</h1>
            
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
