import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener todos los libros con filtros opcionales
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');

    const where = genre ? { genre } : {};

    const books = await prisma.book.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error al obtener libros' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo libro
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

    // Validación básica
    if (!title || !description || !authorId) {
      return NextResponse.json(
        { error: 'Título, descripción y autor son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el autor existe
    const authorExists = await prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      return NextResponse.json(
        { error: 'El autor especificado no existe' },
        { status: 404 }
      );
    }

    // Crear libro
    const book = await prisma.book.create({
      data: {
        title,
        description,
        isbn,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        genre,
        pages: pages ? parseInt(pages) : null,
        authorId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El ISBN ya está registrado' },
        { status: 409 }
      );
    }

    console.log(error);
    return NextResponse.json(
      { error: 'Error al crear libro' },
      { status: 500 }
    );
  }
}
