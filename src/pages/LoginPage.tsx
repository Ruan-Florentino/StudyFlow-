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
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
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
