'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Author = {
  id: string;
  name: string;
};

function NewBookForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAuthorId = searchParams.get('authorId');

  const [loading, setLoading] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [error, setError] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorId: preselectedAuthorId || '',
    isbn: '',
    publishedYear: '',
    genre: '',
    pages: '',
  });

  // Cargar autores
  useEffect(() => {
    async function loadAuthors() {
      try {
        const res = await fetch('/api/authors');
        const data = await res.json();
        setAuthors(data);
      } catch (err) {
        console.error('Error loading authors:', err);
      } finally {
        setLoadingAuthors(false);
      }
    }
    loadAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        authorId: formData.authorId,
        isbn: formData.isbn || null,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null,
        genre: formData.genre || null,
        pages: formData.pages ? parseInt(formData.pages) : null,
      };

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear libro');
      }

      const book = await res.json();
      router.push(`/authors/${book.authorId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear libro');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
            href="/books"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-4 inline-block"
          >
            ← Volver a libros
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Crear Nuevo Libro
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

          {/* Título */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cien años de soledad"
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe el libro..."
            />
          </div>

          {/* Autor */}
          <div>
            <label
              htmlFor="authorId"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Autor <span className="text-red-500">*</span>
            </label>
            {loadingAuthors ? (
              <div className="text-zinc-500">Cargando autores...</div>
            ) : (
              <select
                id="authorId"
                name="authorId"
                required
                value={formData.authorId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona un autor</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ISBN */}
            <div>
              <label
                htmlFor="isbn"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="978-0307474728"
              />
            </div>

            {/* Año de publicación */}
            <div>
              <label
                htmlFor="publishedYear"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Año de Publicación
              </label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1967"
              />
            </div>

            {/* Género */}
            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Género
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Novela, Ficción, etc."
              />
            </div>

            {/* Páginas */}
            <div>
              <label
                htmlFor="pages"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Páginas
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="417"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || loadingAuthors}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear Libro'}
            </button>
            <Link
              href="/books"
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

export default function NewBookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Cargando...</div>
      </div>
    }>
      <NewBookForm />
    </Suspense>
  );
}
