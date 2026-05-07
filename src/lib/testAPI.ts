import { DEFAULT_OPENROUTER_CHAT_MODEL } from '../config/openRouter';
import { devAgentLog } from './devAgentLog';
import { supabase, isSupabaseConfigured } from './supabase';

let debugTestOpenRouterInvocation = 0;
/** Evita par duplo do Strict Mode (React 18) — ver logs H2 invocation 1+2 a 2ms. */
let lastHealthCheckAt = 0;
const HEALTH_CHECK_DEDUPE_MS = 4000;

export async function testOpenRouterConnection() {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return;

  const now = Date.now();
  if (now - lastHealthCheckAt < HEALTH_CHECK_DEDUPE_MS) {
    devAgentLog({
      sessionId: '3d88f5',
      runId: 'post-fix',
      hypothesisId: 'H2',
      location: 'testAPI.ts:testOpenRouterConnection',
      message: 'health_check_deduped',
      data: { deltaMs: now - lastHealthCheckAt },
    });
    return;
  }
  lastHealthCheckAt = now;

  debugTestOpenRouterInvocation += 1;
  const inv = debugTestOpenRouterInvocation;
  devAgentLog({
    sessionId: '3d88f5',
    runId: 'post-fix',
    hypothesisId: 'H2',
    location: 'testAPI.ts:testOpenRouterConnection',
    message: 'health_check_invoked',
    data: { invocation: inv, ts: Date.now() },
  });

  console.log('🔎 Testando conectividade do proxy interno /api/ai');
  
  try {
    const response = await fetch(
      '/api/ai',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: DEFAULT_OPENROUTER_CHAT_MODEL,
          messages: [{ role: 'user', content: 'oi' }],
        }),
      }
    );
    
    console.log('📡 Status:', response.status);
    
    // Clone before reading
    const responseClone = response.clone();
    
    let data;
    try {
        data = await response.json();
        console.log('📦 Resposta:', data);
    } catch (e) {
        try {
            const errorText = await responseClone.text();
            console.error('❌ Failed to parse response JSON. Raw text:', errorText);
        } catch (textError) {
            console.error('❌ Failed to parse response JSON and failed to get raw text');
        }
        return;
    }
    
    if (!response.ok) {
      console.error('❌ Erro da API:', data);
    } else {
      console.log('✅ API funcionando!');
    }
  } catch (error) {
    console.error('💥 Erro de rede:', error);
  }
}
