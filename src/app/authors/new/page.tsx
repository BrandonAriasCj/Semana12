'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAuthorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    nationality: '',
    birthYear: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio || null,
        nationality: formData.nationality || null,
        birthYear: formData.birthYear ? parseInt(formData.birthYear) : null,
      };

      const res = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear autor');
      }

      const author = await res.json();
      router.push(`/authors/${author.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear autor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-4 inline-block"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Crear Nuevo Autor
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-zinc-200 dark:border-zinc-800 space-y-6"
        >
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Gabriel García Márquez"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="gabo@example.com"
            />
          </div>

          {/* Nacionalidad */}
          <div>
            <label
              htmlFor="nationality"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Nacionalidad
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Colombiano"
            />
          </div>

          {/* Año de nacimiento */}
          <div>
            <label
              htmlFor="birthYear"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Año de Nacimiento
            </label>
            <input
              type="number"
              id="birthYear"
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1927"
            />
          </div>

          {/* Biografía */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Biografía
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Escribe una breve biografía del autor..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear Autor'}
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
