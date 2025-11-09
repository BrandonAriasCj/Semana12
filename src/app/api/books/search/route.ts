import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parámetros de búsqueda y filtros
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const authorName = searchParams.get('authorName') || '';
    
    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    
    // Parámetros de ordenamiento
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Validar sortBy
    const validSortFields = ['title', 'publishedYear', 'createdAt'];
    const orderBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = order === 'asc' ? 'asc' : 'desc';

    // Construir filtros
    const where: {
      title?: { contains: string; mode: 'insensitive' };
      genre?: string;
      author?: { name: { contains: string; mode: 'insensitive' } };
    } = {};

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (genre) {
      where.genre = genre;
    }

    if (authorName) {
      where.author = { name: { contains: authorName, mode: 'insensitive' } };
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Obtener total de resultados
    const total = await prisma.book.count({ where });

    // Obtener libros con paginación
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
        [orderBy]: orderDirection,
      },
      skip,
      take: limit,
    });

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error al buscar libros' },
      { status: 500 }
    );
  }
}
