import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-500 bg-white text-slate-900';
        let iconColor = 'text-emerald-600 bg-emerald-50';

        if (t.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-red-500 bg-white text-slate-900';
          iconColor = 'text-red-600 bg-red-50';
        } else if (t.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500 bg-white text-slate-900';
          iconColor = 'text-amber-600 bg-amber-50';
        } else if (t.type === 'info') {
          Icon = Info;
          borderClass = 'border-blue-500 bg-white text-slate-900';
          iconColor = 'text-blue-600 bg-blue-50';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl border-l-4 shadow-xl border border-slate-200 flex items-start gap-3 animate-in slide-in-from-right duration-200 ${borderClass}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 text-xs">
              <h5 className="font-bold text-slate-900 leading-tight">{t.title}</h5>
              <p className="text-slate-600 mt-0.5 leading-relaxed">{t.message}</p>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
