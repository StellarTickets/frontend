'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { FormError } from '@/components/form-error';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-24">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            required
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
          <span className="text-xs text-muted">At least 10 characters.</span>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
