import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/** Partilhado entre chaves — igual ao comportamento de `localStorage`. */
const memoryBucket = new Map<string, string>();

function probeWebLocalStorage(): StateStorage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const key = '__sf_zustand_ls_probe__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return window.localStorage;
  } catch {
    return null;
  }
}

function memoryStateStorage(): StateStorage {
  return {
    getItem: (name) => memoryBucket.get(name) ?? null,
    setItem: (name, value) => {
      memoryBucket.set(name, value);
    },
    removeItem: (name) => {
      memoryBucket.delete(name);
    },
  };
}

function getZustandStorage(): StateStorage {
  return probeWebLocalStorage() ?? memoryStateStorage();
}

/**
 * Persistência Zustand tolerante a Safari (localStorage indisponível / a lançar).
 * Evita ecrã branco quando o módulo da store é avaliado.
 */
export const safeJsonStorage = createJSONStorage(getZustandStorage);
