import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastItem = { id: string; type: ToastType; message: string };

type NotifyContextType = {
  notify: (type: ToastType, message: string) => void;
  confirm: (message: string) => Promise<boolean>;
};

const NotifyContext = createContext<NotifyContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; resolver?: (v: boolean) => void }>({ open: false, message: '' });

  const notify = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    setToasts(t => [...t, { id, type, message }]);
    // auto-dismiss
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>(resolve => {
      setConfirmState({ open: true, message, resolver: resolve });
    });
  }, []);

  const handleConfirm = (v: boolean) => {
    if (confirmState.resolver) confirmState.resolver(v);
    setConfirmState({ open: false, message: '' });
  };

  return (
    <NotifyContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Toast root */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`w-full px-4 py-2 rounded shadow-lg text-white flex items-center justify-between gap-3 animate-fade-in ${
            t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : t.type === 'warning' ? 'bg-amber-500 text-black' : 'bg-sky-600'
          }`}>
            <div className="flex-1 pr-2">{t.message}</div>
            <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} className="opacity-80 hover:opacity-100">✕</button>
          </div>
        ))}
      </div>

      {/* Confirm modal */}
      {confirmState.open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white max-w-md w-full rounded shadow p-6">
            <div className="text-lg font-medium mb-4">Confirm</div>
            <div className="mb-6 text-gray-700">{confirmState.message}</div>
            <div className="flex justify-end gap-3">
              <button onClick={() => handleConfirm(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button onClick={() => handleConfirm(true)} className="px-4 py-2 rounded bg-red-600 text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error('useNotify must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
