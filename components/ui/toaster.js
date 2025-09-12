"use client";

import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border shadow-md p-4 rounded-md w-64 animate-in fade-in-0 slide-in-from-bottom-2"
        >
          {toast.title && (
            <p className="font-bold text-gray-800">{toast.title}</p>
          )}
          {toast.description && (
            <p className="text-sm text-gray-600">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
