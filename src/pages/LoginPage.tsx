import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedButton, GlassCard } from '../components/UI';
import { toast } from '../store/useToastStore';

export function LoginPage() {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (err: any) {
      toast.error('Erro', err.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast.error('Erro', err.message || 'Erro no login com Google');
    }
  };

  const handleReset = async () => {
    if (!email) {
      toast.warning('Aviso', 'Preencha o email para resetar a senha');
      return;
    }
    try {
      await resetPassword(email);
      toast.success('Sucesso', 'Email de reset enviado!');
    } catch (err: any) {
      toast.error('Erro', err.message || 'Erro ao resetar senha');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <GlassCard className="w-full max-w-md p-8 relative z-10 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-premium-title italic mb-2">StudyFlow</h1>
          <p className="text-text-secondary text-sm">Bem-vindo à Jornada.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-text-secondary font-bold">Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Seu nome"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-text-secondary font-bold">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-text-secondary font-bold">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <AnimatedButton className="w-full mt-4" onClick={handleSubmit as any} disabled={loading}>
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </AnimatedButton>
        </form>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-white/10 w-full absolute" />
          <span className="bg-[#111] px-4 text-xs tracking-widest uppercase text-text-secondary z-10">OU</span>
        </div>

        <button 
          onClick={handleGoogle}
          className="flex items-center justify-center gap-3 bg-white text-black font-semibold rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="Google" className="w-5 h-5" />
          Entrar com Google
        </button>

        <div className="flex flex-col items-center gap-2 mt-4 text-sm text-text-secondary">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="hover:text-primary transition-colors">
            {isLogin ? 'Não tem uma conta? Crie uma.' : 'Já tem uma conta? Entre.'}
          </button>
          {isLogin && (
            <button type="button" onClick={handleReset} className="text-xs hover:text-white transition-colors">
              Esqueci minha senha
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
