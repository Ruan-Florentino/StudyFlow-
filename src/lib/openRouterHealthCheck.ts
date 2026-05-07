/**
 * Ping opcional ao proxy `/api/ai` no mount do app.
 *
 * - **Produção:** desligado por padrão; só roda se `VITE_OPENROUTER_HEALTHCHECK=true`.
 * - **Desenvolvimento:** ligado por padrão; desligue com `VITE_OPENROUTER_HEALTHCHECK=false`.
 */
export function shouldRunOpenRouterHealthCheckOnMount(): boolean {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_OPENROUTER_HEALTHCHECK === 'true';
  }
  return import.meta.env.VITE_OPENROUTER_HEALTHCHECK !== 'false';
}
