import Link from 'next/link';
import prisma from '@/lib/prisma';

type Author = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  nationality: string | null;
  birthYear: number | null;
  books: Book[];
};

type Stats = {
  authorId: string;
  authorName: string;
  totalBooks: number;
  firstBook: { title: string; year: number | null } | null;
  latestBook: { title: string; year: number | null } | null;
  averagePages: number;
  genres: (string | null)[];
  longestBook: { title: string; pages: number | null } | null;
  shortestBook: { title: string; pages: number | null } | null;
};

type Book = {
  id: string;
  title: string;
  description: string;
  genre: string | null;
  publishedYear: number | null;
  pages: number | null;
};

async function getAuthor(id: string) {
  try {
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          orderBy: {
            publishedYear: 'desc',
          },
        },
      },
    });
    return author;
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
}

async function getStats(id: string) {
  try {
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          orderBy: {
            publishedYear: 'asc',
          },
        },
      },
    });

    if (!author) return null;

    const books = author.books;
    const totalBooks = books.length;

    if (totalBooks === 0) {
      return {
        authorId: author.id,
        authorName: author.name,
        totalBooks: 0,
        firstBook: null,
        latestBook: null,
        averagePages: 0,
        genres: [],
        longestBook: null,
        shortestBook: null,
      };
    }

    const booksWithYear = books.filter((b) => b.publishedYear !== null);
    const firstBook = booksWithYear[0] || null;
    const latestBook = booksWithYear[booksWithYear.length - 1] || null;

    const booksWithPages = books.filter((b) => b.pages !== null);
    const totalPages = booksWithPages.reduce((sum, book) => sum + (book.pages || 0), 0);
    const averagePages = booksWithPages.length > 0 
      ? Math.round(totalPages / booksWithPages.length) 
      : 0;

    const genres = [...new Set(books.filter((b) => b.genre).map((b) => b.genre))];

    const sortedByPages = [...booksWithPages].sort((a, b) => (b.pages || 0) - (a.pages || 0));
    const longestBook = sortedByPages[0] || null;
    const shortestBook = sortedByPages[sortedByPages.length - 1] || null;

    return {
      authorId: author.id,
      authorName: author.name,
      totalBooks,
      firstBook: firstBook
        ? {
            title: firstBook.title,
            year: firstBook.publishedYear,
          }
        : null,
      latestBook: latestBook
        ? {
            title: latestBook.title,
            year: latestBook.publishedYear,
          }
        : null,
      averagePages,
      genres,
      longestBook: longestBook
        ? {
            title: longestBook.title,
            pages: longestBook.pages,
          }
        : null,
      shortestBook: shortestBook
        ? {
            title: shortestBook.title,
            pages: shortestBook.pages,
          }
        : null,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

export default async function AuthorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [author, stats] = await Promise.all([
    getAuthor(id),
    getStats(id),
  ]);

  if (!author) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            Autor no encontrado
          </h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const books: Book[] = author.books || [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-4 inline-block"
          >
            ← Volver al inicio
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                {author.name}
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {author.email}
              </p>
              {author.nationality && (
                <p className="text-zinc-500 dark:text-zinc-500 mt-1">
                  {author.nationality}
                  {author.birthYear && ` • Nacido en ${author.birthYear}`}
                </p>
              )}
            </div>
            <Link
              href={`/authors/${author.id}/edit`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Editar Autor
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Biografía */}
        {author.bio && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Biografía
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {author.bio}
            </p>
          </div>
        )}

        {/* Estadísticas */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              Estadísticas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Total de Libros
                </div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {stats.totalBooks}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Promedio de Páginas
                </div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {stats.averagePages}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Primer Libro
                </div>
                <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {stats.firstBook ? stats.firstBook.year : 'N/A'}
                </div>
                {stats.firstBook && (
                  <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                    {stats.firstBook.title}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Último Libro
                </div>
                <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {stats.latestBook ? stats.latestBook.year : 'N/A'}
                </div>
                {stats.latestBook && (
                  <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                    {stats.latestBook.title}
                  </div>
                )}
              </div>
            </div>

            {/* Géneros y récords */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Géneros
                </div>
                <div className="flex flex-wrap gap-2">
                  {stats.genres.length > 0 ? (
                    stats.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500">Sin géneros</span>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Libro Más Largo
                </div>
                {stats.longestBook ? (
                  <>
                    <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {stats.longestBook.pages} páginas
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                      {stats.longestBook.title}
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-500">N/A</div>
                )}
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Libro Más Corto
                </div>
                {stats.shortestBook ? (
                  <>
                    <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {stats.shortestBook.pages} páginas
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                      {stats.shortestBook.title}
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-500">N/A</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lista de libros */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Libros ({books.length})
            </h2>
            <Link
              href={`/books/new?authorId=${author.id}`}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium transition-colors"
            >
              + Agregar Libro
            </Link>
          </div>

          {books.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 border border-zinc-200 dark:border-zinc-800 text-center">
              <p className="text-zinc-500 mb-4">
                Este autor aún no tiene libros registrados.
              </p>
              <Link
                href={`/books/new?authorId=${author.id}`}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                Agregar el primer libro
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                        {book.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                        {book.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
                        {book.genre && <span>{book.genre}</span>}
                        {book.publishedYear && <span>• {book.publishedYear}</span>}
                        {book.pages && <span>• {book.pages} páginas</span>}
                      </div>
                    </div>
                    <Link
                      href={`/books/${book.id}/edit`}
                      className="px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition-colors"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
