'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Book = {
  id: string;
  title: string;
  description: string;
  genre: string | null;
  publishedYear: number | null;
  pages: number | null;
  author: {
    id: string;
    name: string;
  };
};

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Cargar autores y géneros
  useEffect(() => {
    async function loadData() {
      try {
        const [authorsRes, booksRes] = await Promise.all([
          fetch('/api/authors'),
          fetch('/api/books'),
        ]);
        const authorsData = await authorsRes.json();
        const booksData = await booksRes.json();

        setAuthors(authorsData);
        
        // Extraer géneros únicos
        const uniqueGenres = [...new Set(booksData.map((b: Book) => b.genre).filter(Boolean))];
        setGenres(uniqueGenres as string[]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    loadData();
  }, []);

  // Buscar libros
  useEffect(() => {
    async function searchBooks() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          sortBy,
          order,
        });

        if (search) params.append('search', search);
        if (selectedGenre) params.append('genre', selectedGenre);
        if (selectedAuthor) params.append('authorName', selectedAuthor);

        const res = await fetch(`/api/books/search?${params}`);
        const data = await res.json();

        setBooks(data.data);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error searching books:', error);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(searchBooks, 300);
    return () => clearTimeout(debounce);
  }, [search, selectedGenre, selectedAuthor, sortBy, order, pagination.page, pagination.limit]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;

    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBooks(books.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-2 inline-block"
              >
                ← Volver al inicio
              </Link>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Búsqueda de Libros
              </h1>
            </div>
            <Link
              href="/books/new"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              + Crear Libro
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 mb-6 space-y-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Buscar por título
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Escribe el título del libro..."
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros en grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Género
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los géneros</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Autor
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los autores</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Fecha de creación</option>
                <option value="title">Título</option>
                <option value="publishedYear">Año de publicación</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Orden
              </label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          {loading ? 'Buscando...' : `${pagination.total} resultados encontrados`}
        </div>

        {/* Lista de libros */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Cargando...</div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No se encontraron libros con los filtros seleccionados.
            </div>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                      {book.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                      {book.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-500">
                      <span>Por {book.author.name}</span>
                      {book.genre && <span>• {book.genre}</span>}
                      {book.publishedYear && <span>• {book.publishedYear}</span>}
                      {book.pages && <span>• {book.pages} páginas</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/books/${book.id}/edit`}
                      className="px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={!pagination.hasNext}
              className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
