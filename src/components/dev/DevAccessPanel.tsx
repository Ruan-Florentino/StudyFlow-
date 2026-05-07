import React, { useCallback, useEffect, useState } from 'react';
import { Crown, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserAccess } from '../../hooks/useUserAccess';
import { useDevAccessStore } from '../../store/useDevAccessStore';
import { useUserStore } from '../../store/useUserStore';
import type { UserRole } from '../../types/userAccess';
import { toast } from 'sonner';

const ROLES: UserRole[] = ['free', 'premium', 'supremo', 'admin'];

/**
 * Painel DEV: Ctrl+Shift+D — só em `import.meta.env.DEV` ou e-mail em `VITE_DEV_OWNER_EMAIL`.
 */
export function DevAccessPanel() {
  const { user } = useAuth();
  const billingPlan = useUserStore((s) => s.billingPlan);
  const { role, allowDevTools, simulateFree } = useUserAccess();
  const devRoleOverride = useDevAccessStore((s) => s.devRoleOverride);
  const setDevRoleOverride = useDevAccessStore((s) => s.setDevRoleOverride);
  const setSimulateFree = useDevAccessStore((s) => s.setSimulateFree);
  const applyDevRoleToLocalPlan = useDevAccessStore((s) => s.applyDevRoleToLocalPlan);
  const resetOnboardingLocal = useDevAccessStore((s) => s.resetOnboardingLocal);
  const clearStudyflowLocalCaches = useDevAccessStore((s) => s.clearStudyflowLocalCaches);

  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    if (!allowDevTools) {
      console.warn('[FASE-1] DevAccessPanel: ferramentas DEV não permitidas para este contexto.');
      return;
    }
    setOpen((o) => !o);
  }, [allowDevTools]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  if (!allowDevTools) return null;

  const pickRole = (r: UserRole | null) => {
    setDevRoleOverride(r);
    applyDevRoleToLocalPlan(r);
    toast(`[FASE-1] Role DEV: ${r ?? '(perfil DB)'}`);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dev-access-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-[#0a0f0d] shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 id="dev-access-title" className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Crown size={16} />
                  Painel DEV — Modo Supremo
                </h2>
                <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                  Atalho: Ctrl+Shift+D. Produção: só com VITE_DEV_OWNER_EMAIL igual ao login.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-[11px] space-y-1 font-mono text-white/70 bg-black/40 rounded-xl p-3 border border-white/10">
              <p>
                <span className="text-white/40">user:</span> {user?.email ?? '(offline)'}
              </p>
              <p>
                <span className="text-white/40">billingPlan:</span> {billingPlan ?? '—'}
              </p>
              <p>
                <span className="text-white/40">effective role:</span> {role}
              </p>
              <p>
                <span className="text-white/40">override:</span> {devRoleOverride ?? '(nenhum)'}
              </p>
              <p>
                <span className="text-white/40">simular free:</span> {simulateFree ? 'sim' : 'não'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Role local (DEV)</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => pickRole(null)}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 border border-white/10 hover:bg-white/10"
                >
                  Usar DB
                </button>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => pickRole(r)}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateFree}
                onChange={(e) => {
                  setSimulateFree(e.target.checked);
                  toast(`[FASE-1] Simular free: ${e.target.checked ? 'on' : 'off'}`);
                }}
                className="rounded border-white/20"
              />
              Simular usuário free (força limites mesmo supremo)
            </label>

            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  resetOnboardingLocal();
                  toast.success('[FASE-1] Onboarding local resetado.');
                }}
                className="py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10"
              >
                Reset onboarding (local)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Limpar caches StudyFlow no navegador e recarregar?')) {
                    clearStudyflowLocalCaches();
                  }
                }}
                className="py-2 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                Limpar caches + reload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
