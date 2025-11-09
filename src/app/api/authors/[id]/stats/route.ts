import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verificar que el autor existe
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

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    const books = author.books;
    const totalBooks = books.length;

    if (totalBooks === 0) {
      return NextResponse.json({
        authorId: author.id,
        authorName: author.name,
        totalBooks: 0,
        firstBook: null,
        latestBook: null,
        averagePages: 0,
        genres: [],
        longestBook: null,
        shortestBook: null,
      });
    }

    // Primer y último libro
    const booksWithYear = books.filter((b) => b.publishedYear !== null);
    const firstBook = booksWithYear[0] || null;
    const latestBook = booksWithYear[booksWithYear.length - 1] || null;

    // Promedio de páginas
    const booksWithPages = books.filter((b) => b.pages !== null);
    const totalPages = booksWithPages.reduce((sum, book) => sum + (book.pages || 0), 0);
    const averagePages = booksWithPages.length > 0 
      ? Math.round(totalPages / booksWithPages.length) 
      : 0;

    // Géneros únicos
    const genres = [...new Set(books.filter((b) => b.genre).map((b) => b.genre))];

    // Libro con más y menos páginas
    const sortedByPages = [...booksWithPages].sort((a, b) => (b.pages || 0) - (a.pages || 0));
    const longestBook = sortedByPages[0] || null;
    const shortestBook = sortedByPages[sortedByPages.length - 1] || null;

    return NextResponse.json({
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
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas del autor' },
      { status: 500 }
    );
  }
}
