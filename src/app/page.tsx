import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getAuthors() {
  try {
    const authors = await prisma.author.findMany({
      include: {
        books: true,
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return authors;
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

async function getStats() {
  const authors = await getAuthors();
  const totalAuthors = authors.length;
  const totalBooks = authors.reduce((sum: number, author: { _count: { books: number } }) => sum + author._count.books, 0);
  return { totalAuthors, totalBooks };
}

export default async function Home() {
  const authors = await getAuthors();
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            📚 Sistema de Biblioteca
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Gestión de autores y libros
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Total Autores
            </div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-white">
              {stats.totalAuthors}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Total Libros
            </div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-white">
              {stats.totalBooks}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Promedio por Autor
            </div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-white">
              {stats.totalAuthors > 0 ? (stats.totalBooks / stats.totalAuthors).toFixed(1) : 0}
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href="/authors/new"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Crear Autor
          </Link>
          <Link
            href="/books"
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium transition-colors"
          >
            Ver Libros
          </Link>
        </div>

        {/* Lista de autores */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Autores
            </h2>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {authors.length === 0 ? (
              <div className="px-6 py-12 text-center text-zinc-500">
                No hay autores registrados. Crea uno para comenzar.
              </div>
            ) : (
              authors.map((author: {
                id: string;
                name: string;
                email: string;
                nationality: string | null;
                _count: { books: number };
              }) => (
                <div
                  key={author.id}
                  className="px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {author.name}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {author.email}
                        {author.nationality && ` • ${author.nationality}`}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                        {author._count.books} {author._count.books === 1 ? 'libro' : 'libros'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/authors/${author.id}`}
                        className="px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
