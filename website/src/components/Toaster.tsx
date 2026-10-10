'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

type Toast = { id: number; message: string };

let listeners: ((t: Toast) => void)[] = [];

export function pushToast(message: string) {
  const t: Toast = { id: Date.now(), message };
  listeners.forEach((cb) => cb(t));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    const cb = (t: Toast) => {
      setItems((s) => [...s, t]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== t.id)), 4000);
    };
    listeners.push(cb);
    return () => {
      listeners = listeners.filter((x) => x !== cb);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 space-y-2">
      {items.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border border-leaf-200 bg-white px-4 py-3 text-sm shadow-lg"
        >
          <CheckCircle2 className="h-5 w-5 flex-none text-leaf-600" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}