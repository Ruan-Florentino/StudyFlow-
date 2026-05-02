import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

let toastCount = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastCount}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Helper para uso fora do React
export const toast = {
  success: (title: string, message?: string, duration?: number) => useToastStore.getState().addToast({ type: 'success', title, message, duration }),
  error: (title: string, message?: string, duration?: number) => useToastStore.getState().addToast({ type: 'error', title, message, duration }),
  info: (title: string, message?: string, duration?: number) => useToastStore.getState().addToast({ type: 'info', title, message, duration }),
  warning: (title: string, message?: string, duration?: number) => useToastStore.getState().addToast({ type: 'warning', title, message, duration }),
};
