type Result<T = any> = Promise<{ data: T; error: any }>;
const empty = <T = any>(data: T = null as T): Result<T> => Promise.resolve({ data, error: null });
function query() { const q: any = { select: () => q, eq: () => q, neq: () => q, order: () => q, limit: () => q, single: () => empty(null), maybeSingle: () => empty(null), insert: () => empty(null), update: () => q, upsert: () => empty(null), delete: () => q, then: (r: any, j?: any) => empty([]).then(r, j) }; return q; }
export const localBackend: any = {
  auth: { getUser: () => empty({ user: { id: 'local-user', email: 'local@athena.app', user_metadata: { full_name: 'Estudante' } } }), getSession: () => empty({ session: null }), signInWithPassword: () => empty({ user: null, session: null }), signUp: () => empty({ user: null, session: null }), signInWithOAuth: () => empty({}), signOut: () => empty(null), resetPasswordForEmail: () => empty(null) },
  from: () => query(), channel: () => ({ on: () => ({ on: () => ({ subscribe: (cb: any) => { cb?.('SUBSCRIBED'); return { unsubscribe() {} }; } }) }), subscribe: (cb: any) => { cb?.('SUBSCRIBED'); return { unsubscribe() {} }; } }), removeChannel: () => {}, storage: { from: () => ({ upload: () => empty(null), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }, functions: { invoke: () => empty(null) }
};
