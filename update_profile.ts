import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const profileDecl = `const Profile = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (view: 'splash' | 'home' | 'questions' | 'redacao' | 'ranking' | 'reports' | 'profile' | 'focus' | 'ai' | 'exams' | 'methods' | 'anki' | 'routine' | 'feynman' | 'blurting' | 'mindmap' | 'notes' | 'pomodoro' | 'active-recall' | 'interleaving') => void }) => {`;

const startIdx = content.indexOf(profileDecl);
const endCompIdx = content.indexOf('const StudyRooms =', startIdx);
const endCompIdx2 = content.indexOf('const Ranking =', startIdx);
const endIdx = endCompIdx !== -1 ? endCompIdx : endCompIdx2;

const newProfileStr = `const Profile = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (view: any) => void }) => {
  const { name, bio, profilePic, coverPic, xp, level, streak, league, setName, setBio, setProfilePic, setCoverPic, history, sessions, plan } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name || '');
  const [editBio, setEditBio] = useState(bio || '');

  const masteryData = useMemo(() => {
    const subjects = Object.keys(TOPICS);
    return subjects.map(subject => {
      const subHistory = history.filter(h => {
        const q = QUESTION_MAP[h.questionId];
        return q?.materia === subject;
      });
      const subTotal = subHistory.length;
      const subCorrect = subHistory.filter(h => h.isCorrect).length;
      const accuracy = subTotal > 0 ? Math.round((subCorrect / subTotal) * 100) : 0;
      const volumeBonus = Math.min(subTotal, 50) / 50 * 20; 
      const score = subTotal > 0 ? Math.min(100, accuracy * 0.8 + volumeBonus) : 0;
      return {
        subject: subject.substring(0, 3).toUpperCase(),
        fullSubject: subject,
        score: Math.round(score),
        fullMark: 100
      };
    });
  }, [history]);

  const chartData = useMemo(() => {
    return Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const items = history.filter(h => h.timestamp.startsWith(dateStr));
      return { day: dateStr.slice(5), questoes: items.length };
    });
  }, [history]);

  const handleShare = async () => {
    import('html2canvas').then(html2canvas => {
      const el = document.getElementById('profile-capture');
      if (el) {
        html2canvas.default(el, { backgroundColor: '#050505', scale: 2 }).then(canvas => {
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = 'studyflow-stat.png';
          a.click();
        });
      }
    });
  };

  const handleSave = () => {
    setName(editName);
    setBio(editBio);
    setIsEditing(false);
  };

  const handleImageUpload = (type: 'profile' | 'cover') => {
    const url = prompt(\`Insira a URL da imagem para \${type === 'profile' ? 'foto de perfil' : 'capa'}:\`);
    if (url) {
      if (type === 'profile') setProfilePic(url);
      else setCoverPic(url);
    }
  };

  const totalQuestions = history.length;
  const totalCorrect = history.filter(h => h.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="pb-32">
      <div id="profile-capture">
        {/* Cover Photo */}
        <div className="relative h-48 bg-white/5 border-b border-white/10 overflow-hidden" data-html2canvas-ignore="false">
          {coverPic ? (
            <img src={coverPic} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          )}
          <button 
            onClick={() => handleImageUpload('cover')}
            data-html2canvas-ignore="true"
            className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <Camera size={16} />
          </button>
          <button onClick={onBack} data-html2canvas-ignore="true" className="absolute top-6 left-6 p-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-white">
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="px-6 relative">
          {/* Profile Picture */}
          <div className="absolute -top-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-background bg-card overflow-hidden">
                <img 
                  src={profilePic || \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${name}\`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button 
                onClick={() => handleImageUpload('profile')}
                data-html2canvas-ignore="true"
                className="absolute bottom-0 right-0 p-1.5 bg-primary text-black rounded-full border-2 border-background shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              >
                <Camera size={12} />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4" data-html2canvas-ignore="true">
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              {isEditing ? <><Check size={14} /> Salvar</> : <><Edit3 size={14} /> Editar Perfil</>}
            </button>
          </div>

          {/* User Info */}
          <div className="mt-4 space-y-4">
            {isEditing ? (
              <div className="space-y-3" data-html2canvas-ignore="true">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-xl focus:outline-none focus:border-primary/50"
                  placeholder="Seu Nome"
                />
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 resize-none h-24"
                  placeholder="Sua Bio"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-text-secondary text-sm mt-1">{bio}</p>
              </div>
            )}
            
            {/* Meu Plano */}
            <GlassCard className="p-4 flex items-center justify-between border-primary/20 bg-primary/5" glow>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 to-green-600/30 rounded-xl text-primary">
                  <Star size={20} fill={plan === 'premium' ? "currentColor" : "none"} />
                </div>
                <div>
                  <p className="text-xs font-premium-mono text-text-secondary uppercase tracking-widest">Plano Atual</p>
                  <p className="font-bold text-lg capitalize">{plan}</p>
                </div>
              </div>
              {plan === 'free' && (
                <button 
                  onClick={() => onNavigate('pricing')} 
                  data-html2canvas-ignore="true"
                  className="px-3 py-1.5 bg-primary/20 text-primary text-xs font-bold rounded-full hover:bg-primary/30 transition-colors"
                >
                  Fazer Upgrade
                </button>
              )}
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
              <GlassCard className="p-3 text-center" glow>
                <p className="text-[10px] font-premium-mono text-text-secondary uppercase tracking-widest mb-1">Horas</p>
                <p className="text-lg font-bold text-primary">{totalHours}h</p>
              </GlassCard>
              <GlassCard className="p-3 text-center" glow>
                <p className="text-[10px] font-premium-mono text-text-secondary uppercase tracking-widest mb-1">Precisão</p>
                <p className="text-lg font-bold text-primary">{accuracy}%</p>
              </GlassCard>
              <GlassCard className="p-3 text-center" glow>
                <p className="text-[10px] font-premium-mono text-text-secondary uppercase tracking-widest mb-1">Questões</p>
                <p className="text-lg font-bold text-primary">{totalQuestions}</p>
              </GlassCard>
              <GlassCard className="p-3 text-center" glow>
                <p className="text-[10px] font-premium-mono text-text-secondary uppercase tracking-widest mb-1">Streak</p>
                <p className="text-lg font-bold text-orange-500">{streak} 🔥</p>
              </GlassCard>
            </div>

            {/* Recharts chart */}
            <GlassCard className="p-4" glow>
              <h3 className="text-sm font-bold mb-4 font-premium-mono text-text-secondary uppercase tracking-widest">Atividade de Questões (7 Dias)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF94" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }} itemStyle={{ color: '#00FF94' }} />
                    <Area type="monotone" dataKey="questoes" stroke="#00FF94" fillOpacity={1} fill="url(#colorQ)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      <div className="px-6 pt-6">
        <AnimatedButton onClick={handleShare} className="w-full flex items-center justify-center gap-2 border border-white/10" variant="secondary">
          <Share2 size={16} /> Compartilhar Progresso
        </AnimatedButton>
      </div>

      {/* Ex-Settings / Export / Import Area goes here if needed, I'll drop them to simplify or they are below */}
    </div>
  );
};
`

if (endIdx !== -1) {
  content = content.substring(0, startIdx) + newProfileStr + '\n\n' + content.substring(endIdx);
  if (!content.includes('AreaChart')) {
    content = content.replace('RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar', 'RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area');
  }
  fs.writeFileSync('src/App.tsx', content);
  console.log('Profile updated via script');
} else {
  console.error("End index not found!");
}
