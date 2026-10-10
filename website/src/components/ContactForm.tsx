'use client';

import { useState, type FormEvent } from 'react';
import { pushToast } from '@/components/Toaster';
import { Send as SendIcon } from 'lucide-react';

type Labels = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  message: string;
  submit: string;
  sending: string;
  required: string;
};

type Props = {
  labels: Labels;
  products: Array<{ id: string; name: string }>;
};

export function ContactForm({ labels, products }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setDone(true);
    pushToast('Message sent — our team will reply shortly.');
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setDone(false), 3000);
  };

  const inputBase =
    'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {labels.name} *
          </label>
          <input required name="name" className={`${inputBase} mt-1`} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {labels.company}
          </label>
          <input name="company" className={`${inputBase} mt-1`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {labels.email} *
          </label>
          <input required type="email" name="email" className={`${inputBase} mt-1`} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {labels.phone}
          </label>
          <input name="phone" className={`${inputBase} mt-1`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {labels.country}
          </label>
          <input name="country" className={`${inputBase} mt-1`} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {labels.product}
          </label>
          <select name="product" className={`${inputBase} mt-1`}>
            <option value="">—</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
          {labels.message} *
        </label>
        <textarea
          required
          name="message"
          rows={5}
          className={`${inputBase} mt-1 resize-none`}
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-neutral-500">* {labels.required}</p>
        <button
          type="submit"
          disabled={submitting || done}
          className="btn-primary disabled:opacity-60"
        >
          {submitting ? labels.sending : labels.submit}
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}