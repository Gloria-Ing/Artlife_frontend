import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let _id = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = ++_id;
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => dismiss(id), 3500);
    }, [dismiss]);

    const icons = {
        success: <CheckCircle2 className="w-4 h-4 shrink-0 text-olive-600" />,
        error: <AlertCircle className="w-4 h-4 shrink-0 text-terracotta" />,
        info: <Info className="w-4 h-4 shrink-0 text-brown-500" />,
    };

    const styles = {
        success: 'bg-white border-l-4 border-olive text-midnight-900',
        error: 'bg-white border-l-4 border-terracotta text-midnight-900',
        info: 'bg-white border-l-4 border-sand-400 text-midnight-900',
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* ── Toast container ── */}
            <div
                aria-live="polite"
                className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border border-sand-200/80 pointer-events-auto animate-fadeIn ${styles[t.type]}`}
                    >
                        {icons[t.type]}
                        <span className="flex-1 text-xs font-medium leading-snug">{t.message}</span>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="shrink-0 text-brown-400 hover:text-midnight-900 transition mt-0.5"
                            aria-label="Dismiss"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx.toast;
};
