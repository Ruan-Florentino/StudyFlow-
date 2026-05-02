import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Crown, Award, Shield, Gem, Flame, Sparkles, ShieldPlus, Trophy, Users as UsersIcon, Globe } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, cn } from './UI';
import confetti from 'canvas-confetti';

const LEAGUES = [
  { id: 'bronze',     name: 'Bronze',      color: '#CD7F32', glow: 'rgba(205,127,50,0.4)',  min: 0,    icon: 'Shield'    },
  { id: 'prata',      name: 'Prata',       color: '#C0C0C0', glow: 'rgba(192,192,192,0.4)', min: 500,  icon: 'ShieldPlus'},
  { id: 'ouro',       name: 'Ouro',        color: '#FFD700', glow: 'rgba(255,215,0,0.5)',   min: 1500, icon: 'Award'     },
  { id: 'diamante',   name: 'Diamante',    color: '#B9F2FF', glow: 'rgba(185,242,255,0.6)', min: 3500, icon: 'Gem'       },
  { id: 'mestre',     name: 'Mestre',      color: '#9D4EDD', glow: 'rgba(157,78,221,0.6)',  min: 6500, icon: 'Crown'     },
  { id: 'graomestre', name: 'Grão-Mestre', color: '#FF006E', glow: 'rgba(255,0,110,0.6)',   min: 10000,icon: 'Flame'     },
  { id: 'lendario',   name: 'Lendário',    color: '#00F0FF', glow: 'rgba(0,240,255,0.7)',   min: 20000,icon: 'Sparkles'  },
];

const FAKE_NAMES = [
  'Ana Clara', 'Gabriele Sá', 'Lucas Mendes', 'Julia Rocha', 'Pedro Alves',
  'Mariana Costa', 'Rafael Lima', 'Beatriz Silva', 'Thiago Santos', 'Isabela Dias',
  'Bruno Oliveira', 'Letícia Souza', 'Felipe Castro', 'Camila Ferreira', 'André Melo',
  'Larissa Gomes', 'Gustavo Ramos', 'Natália Cardoso', 'Vinícius Torres', 'Fernanda Duarte',
  'Matheus Pires', 'Sophia Moreira', 'Diego Barbosa', 'Valentina Nunes', 'Enzo Cavalcanti',
  'Helena Monteiro', 'Arthur Correia', 'Alice Fonseca', 'Davi Ribeiro', 'Laura Azevedo',
  'Ryan Pacheco', 'Mirella Campos', 'Nicolas Freitas', 'Rebeca Brito', 'Caio Moura',
  'Maitê Teixeira', 'Theo Araújo', 'Luna Pereira', 'Benício Farias', 'Eloá Macedo',
  'Yuri Sampaio', 'Sarah Batista', 'Noah Siqueira', 'Antonella Reis', 'Pietro Cunha',
  'Lívia Xavier', 'Cauã Borges', 'Melissa Tavares', 'Lorenzo Prado', 'Cecília Coelho'
];

const FAKE_USERS = FAKE_NAMES.map((name, i) => ({
  id: `fake_${i}`,
  name,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  xpWeekly: Math.floor(Math.random() * 8000) + 100,
  xpTotal: Math.floor(Math.random() * 50000) + 500,
  level: Math.floor(Math.random() * 50) + 1,
  streak: Math.floor(Math.random() * 60),
  league: ['bronze','prata','ouro','diamante','mestre','graomestre','lendario'][Math.floor(Math.random() * 7)],
}));

const LEAGUE_ICONS: Record<string, any> = {
  bronze: Shield, prata: ShieldPlus, ouro: Award, diamante: Gem,
  mestre: Crown, graomestre: Flame, lendario: Sparkles
};

export const Ranking: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { name, xp, level, streak, league } = useStore();
  const [activeTab, setActiveTab] = useState<'liga' | 'amigos' | 'mundial'>('liga');
  
  const userLeague = LEAGUES.find(l => l.id === (league?.toLowerCase() || 'bronze')) || LEAGUES[0];
  const LeagueIcon = LEAGUE_ICONS[userLeague.id];
  
  // Usuários da minha liga (filtra os fake pela liga + adiciona o próprio user)
  const myLeagueUsers = useMemo(() => {
    const sameLeague = FAKE_USERS.filter(u => u.league === userLeague.id);
    const selfUser = {
      id: 'self', name: name || 'Você', 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'You')}`,
      xpWeekly: xp % 1000, xpTotal: xp, level, streak, league: userLeague.id
    };
    return [...sameLeague, selfUser].sort((a,b) => b.xpWeekly - a.xpWeekly).slice(0, 30);
  }, [name, xp, level, streak, userLeague.id]);
  
  const myPosition = myLeagueUsers.findIndex(u => u.id === 'self') + 1;
  const totalInLeague = myLeagueUsers.length;
  
  // Zona
  let zone: 'promo' | 'safe' | 'danger' = 'safe';
  let zoneText = '🛡️ Zona Segura. Continue assim.';
  let zoneColor = '#3B82F6';
  if (myPosition <= 5) {
    zone = 'promo';
    zoneText = `🚀 Zona de Promoção! Top ${myPosition}`;
    zoneColor = '#00E88F';
  } else if (myPosition >= totalInLeague - 4) {
    zone = 'danger';
    zoneText = '⚠️ Zona de Perigo! Estude mais pra não ser rebaixado.';
    zoneColor = '#EF4444';
  }
  
  // Global (todos ordenados por xpTotal)
  const globalUsers = useMemo(() => {
    const selfUser = {
      id: 'self', name: name || 'Você',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'You')}`,
      xpWeekly: xp % 1000, xpTotal: xp, level, streak, league: userLeague.id
    };
    return [...FAKE_USERS, selfUser].sort((a,b) => b.xpTotal - a.xpTotal).slice(0, 100);
  }, [name, xp, level, streak, userLeague.id]);
  
  // Amigos (pega 10 aleatórios)
  const friends = useMemo(() => {
    const shuffled = [...FAKE_USERS].sort(() => 0.5 - Math.random()).slice(0, 9);
    const selfUser = {
      id: 'self', name: name || 'Você',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'You')}`,
      xpWeekly: xp % 1000, xpTotal: xp, level, streak, league: userLeague.id
    };
    return [...shuffled, selfUser].sort((a,b) => b.xpWeekly - a.xpWeekly);
  }, [name, xp, level, streak, userLeague.id]);

  // Timer temporada
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setHours(23, 59, 59, 0);
      const diff = endOfWeek.getTime() - now.getTime();
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    };
    updateTimer();
    const int = setInterval(updateTimer, 60000);
    return () => clearInterval(int);
  }, []);

  // Confete quando abre em mundial e user tá top 3
  useEffect(() => {
    if (activeTab === 'mundial') {
      const pos = globalUsers.findIndex(u => u.id === 'self');
      if (pos >= 0 && pos < 3) {
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 }, colors: ['#FFD700','#C0C0C0','#CD7F32'] });
        }, 500);
      }
    }
  }, [activeTab, globalUsers]);

  const renderUserRow = (user: any, position: number, isHighlight: boolean = false) => {
    const isSelf = user.id === 'self';
    const isTop3 = position <= 3;
    const medalColor = position === 1 ? '#FFD700' : position === 2 ? '#C0C0C0' : position === 3 ? '#CD7F32' : null;
    
    return (
      <motion.div
        key={user.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: position * 0.02 }}
        className={cn(
          "flex items-center gap-3 p-3 rounded-2xl border transition-all",
          isSelf 
            ? "bg-primary/10 border-primary/40" 
            : isTop3
              ? "bg-white/[0.03] border-white/10"
              : "bg-white/[0.02] border-white/5"
        )}
        style={isSelf ? { boxShadow: '0 0 20px rgba(0,232,143,0.2)' } : {}}
      >
        {/* Position */}
        <div className="w-10 shrink-0 flex items-center justify-center">
          {medalColor ? (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
              style={{ 
                background: `linear-gradient(135deg, ${medalColor}, ${medalColor}88)`,
                color: position === 1 ? '#000' : '#fff',
                boxShadow: `0 0 15px ${medalColor}80`,
              }}
            >
              {position}
            </div>
          ) : (
            <span className="text-white/40 font-bold text-sm">#{position}</span>
          )}
        </div>
        
        {/* Avatar */}
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-10 h-10 rounded-full bg-white/10 shrink-0"
        />
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white truncate">
              {user.name}
            </span>
            {isSelf && (
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary text-black"
              >
                VOCÊ
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
            <span>Nv {user.level}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <Flame size={10} className="text-orange-400" />
              {user.streak}
            </span>
          </div>
        </div>
        
        {/* XP */}
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-primary">
            {user.xpWeekly.toLocaleString('pt-BR')}
          </div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider">XP</div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pb-28">
      {/* HERO HEADER */}
      <div 
        className="relative px-4 pt-6 pb-8 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at top, ${userLeague.color}20, transparent 70%)`,
        }}
      >
        <button 
          onClick={onBack}
          className="absolute top-6 left-4 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-3 pt-4">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              filter: [
                `drop-shadow(0 0 20px ${userLeague.glow})`,
                `drop-shadow(0 0 40px ${userLeague.glow})`,
                `drop-shadow(0 0 20px ${userLeague.glow})`,
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center border-2"
              style={{
                background: `radial-gradient(circle, ${userLeague.color}40, ${userLeague.color}10)`,
                borderColor: userLeague.color + '60',
              }}
            >
              <LeagueIcon size={56} style={{ color: userLeague.color, filter: `drop-shadow(0 0 10px ${userLeague.color})` }} />
            </div>
          </motion.div>
          
          <h1 
            className="font-anton text-4xl uppercase tracking-wider"
            style={{ 
              color: userLeague.color,
              textShadow: `0 0 30px ${userLeague.glow}`,
            }}
          >
            {userLeague.name}
          </h1>
          
          <div className="flex items-center gap-4 text-xs text-white/60 font-mono">
            <span>#{myPosition} · {(xp % 1000).toLocaleString('pt-BR')} XP</span>
            <span>·</span>
            <span>Temporada: {timeLeft}</span>
          </div>
        </div>
      </div>

      {/* TABS STICKY */}
      <div className="sticky top-0 z-20 px-4 py-3 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="flex gap-2">
          {[
            { id: 'liga', label: 'Minha Liga', icon: Trophy },
            { id: 'amigos', label: 'Amigos', icon: UsersIcon },
            { id: 'mundial', label: 'Mundial', icon: Globe },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  active 
                    ? "bg-primary/15 text-primary border border-primary/30" 
                    : "bg-white/5 text-white/40 border border-transparent"
                )}
                style={active ? { boxShadow: '0 0 15px rgba(0,232,143,0.2)' } : {}}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'liga' && (
            <motion.div 
              key="liga"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {/* Zone banner */}
              <div 
                className="p-3 rounded-xl border text-sm font-bold text-center"
                style={{
                  background: zoneColor + '15',
                  borderColor: zoneColor + '40',
                  color: zoneColor,
                }}
              >
                {zoneText}
              </div>
              
              {myLeagueUsers.map((user, idx) => renderUserRow(user, idx + 1))}
            </motion.div>
          )}

          {activeTab === 'amigos' && (
            <motion.div 
              key="amigos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <button className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 text-white/40 text-sm font-bold hover:border-primary/30 hover:text-primary transition-colors">
                + Adicionar Amigo
              </button>
              {friends.map((user, idx) => renderUserRow(user, idx + 1))}
            </motion.div>
          )}

          {activeTab === 'mundial' && (
            <motion.div 
              key="mundial"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Pódio top 3 */}
              <div className="grid grid-cols-3 gap-2 mb-6 items-end">
                {[1, 0, 2].map((idx) => {
                  const user = globalUsers[idx];
                  const pos = idx + 1;
                  const heights = ['h-32', 'h-40', 'h-28'];
                  const colors = ['#C0C0C0', '#FFD700', '#CD7F32'];
                  const h = pos === 1 ? heights[1] : pos === 2 ? heights[0] : heights[2];
                  const c = colors[pos - 1];
                  
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: pos * 0.2 }}
                      className="flex flex-col items-center"
                    >
                      {pos === 1 && <Crown size={24} className="text-yellow-400 mb-1" style={{ filter: 'drop-shadow(0 0 8px #FFD700)' }} />}
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-14 h-14 rounded-full mb-2 border-2"
                        style={{ borderColor: c, boxShadow: `0 0 15px ${c}60` }}
                      />
                      <span className="text-[10px] font-bold text-white truncate max-w-full">{user.name.split(' ')[0]}</span>
                      <span className="text-[9px] text-white/50 mb-1">{user.xpTotal.toLocaleString('pt-BR')} XP</span>
                      <div 
                        className={cn(h, "w-full rounded-t-lg flex items-start justify-center pt-2")}
                        style={{
                          background: `linear-gradient(180deg, ${c}40, ${c}10)`,
                          borderTop: `2px solid ${c}`,
                        }}
                      >
                        <span className="font-black text-2xl" style={{ color: c, textShadow: `0 0 10px ${c}` }}>
                          {pos}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* 4+ lista */}
              <div className="space-y-2">
                {globalUsers.slice(3).map((user, idx) => renderUserRow(user, idx + 4))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
