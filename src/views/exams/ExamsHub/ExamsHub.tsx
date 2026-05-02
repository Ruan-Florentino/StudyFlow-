import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Target, 
  Star, 
  Calendar, 
  ChevronLeft 
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAppNavigation } from '../../../app/router/useAppNavigation';
import { useStore } from '../../../store';
import { 
  GlassCard, 
  AnimatedButton, 
  Badge, 
  Header 
} from '../../../components/UI';
import { Exam, calculateDaysLeft } from '../shared';

interface ExamsHubProps {
  onSelectExam: (exam: Exam, view: 'plan' | 'simulado') => void;
}

export const ExamsHub = ({ onSelectExam }: ExamsHubProps) => {
  const { goBack, goTo } = useAppNavigation();
  const { exams, favoriteExams, toggleFavoriteExam } = useStore();
  const [filter, setFilter] = useState<'all' | 'vestibular' | 'concurso' | 'upcoming' | 'favorites'>('all');
  const [search, setSearch] = useState('');

  const filteredExams = exams
    .filter(e => {
      if (!e) return false;
      const nome = e.nome || '';
      const descricao = e.descricao || '';
      const matchesSearch = nome.toLowerCase().includes(search.toLowerCase()) || 
                           descricao.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (filter === 'all') return true;
      if (filter === 'vestibular') return e.tipo === 'vestibular';
      if (filter === 'concurso') return e.tipo === 'concurso';
      if (filter === 'upcoming') {
        const days = calculateDaysLeft(e.data);
        return days !== null && days < 60;
      }
      if (filter === 'favorites') return favoriteExams.includes(e.id);
      return true;
    })
    .sort((a, b) => {
      const dateA = a.data ? new Date(a.data).getTime() : Infinity;
      const dateB = b.data ? new Date(b.data).getTime() : Infinity;
      return dateA - dateB;
    });

  return (
    <div className="p-6 space-y-6 pb-28">
      <div className="space-y-4">
        <Header 
          title="Provas 2026"
          subtitle="Simulados"
          icon={FileText}
          color="orange"
          onBack={goBack}
          rightContent={
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar prova..."
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-orange-500 w-40"
              />
            </div>
          }
        />
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['all', 'vestibular', 'concurso', 'upcoming', 'favorites'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                filter === f ? "bg-orange-500 text-black border-orange-500" : "bg-white/5 text-text-secondary border-white/10 hover:bg-white/10"
              )}
            >
              {f === 'all' ? 'Todos' : 
               f === 'vestibular' ? 'Vestibulares' : 
               f === 'concurso' ? 'Concursos' : 
               f === 'upcoming' ? 'Próximos' : 
               'Favoritos'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredExams.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-text-secondary">
              <Search size={32} />
            </div>
            <p className="text-text-secondary font-medium">Nenhuma prova encontrada.</p>
          </div>
        ) : (
          filteredExams.map((exam) => {
            const daysLeft = calculateDaysLeft(exam.data);
            const isFavorite = favoriteExams.includes(exam.id);
            const formattedDate = exam.data ? new Date(exam.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Edital em breve';

            return (
              <GlassCard key={exam.id} className="space-y-6 border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
                {daysLeft !== null && daysLeft < 30 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold px-4 py-1 rotate-45 translate-x-4 -translate-y-1 uppercase tracking-widest">
                    Urgente
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:green-glow transition-all">
                      <Target size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{exam.nome}</h3>
                        <Badge variant={
                          exam.nivel === 'Muito Difícil' ? 'danger' : 
                          exam.nivel === 'Difícil' ? 'orange' : 
                          exam.nivel === 'Médio' ? 'warning' : 
                          'success'
                        }>
                          {exam.nivel}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{exam.tipo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => toggleFavoriteExam(exam.id)}
                      className={clsx("p-2 rounded-xl border transition-all", isFavorite ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-text-secondary")}
                    >
                      <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <div className="text-right">
                      {daysLeft !== null ? (
                        <>
                          <p className="text-3xl font-black text-primary leading-none tracking-tighter">{daysLeft}</p>
                          <p className="text-[8px] text-text-secondary uppercase font-bold tracking-widest">Dias Restantes</p>
                        </>
                      ) : (
                        <Badge variant="warning">Edital em breve</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Calendar size={14} className="text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(exam.materias || []).map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-[9px] text-text-secondary border border-white/10 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <AnimatedButton 
                    onClick={() => onSelectExam(exam, 'plan')} 
                    className="flex-1 py-3 text-[10px] font-bold"
                    glow
                  >
                    Plano IA
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="secondary" 
                    onClick={() => onSelectExam(exam, 'simulado')} 
                    className="flex-1 py-3 text-[10px] font-bold"
                  >
                    Simulado
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="secondary" 
                    onClick={() => goTo('/foco')} 
                    className="flex-1 py-3 text-[10px] font-bold border-primary/20 text-primary"
                  >
                    Estudar
                  </AnimatedButton>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};
