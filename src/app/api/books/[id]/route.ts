import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener un libro específico por ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const book = await prisma.book.findUnique({
            where: { id },
            include: {
                author: true,
            },
        });

        if (!book) {
            return NextResponse.json(
                { error: 'Libro no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(book);
    } catch {
        return NextResponse.json(
            { error: 'Error al obtener libro' },
            { status: 500 }
        );
    }
}

// PUT - Actualizar un libro
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

        // Si se proporciona authorId, verificar que existe
        if (authorId) {
            const authorExists = await prisma.author.findUnique({
                where: { id: authorId },
            });

            if (!authorExists) {
                return NextResponse.json(
                    { error: 'El autor especificado no existe' },
                    { status: 404 }
                );
            }
        }

        const book = await prisma.book.update({
            where: { id },
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

        return NextResponse.json(book);
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === 'P2025') {
                return NextResponse.json(
                    { error: 'Libro no encontrado' },
                    { status: 404 }
                );
            }
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: 'El ISBN ya está registrado' },
                    { status: 409 }
                );
            }
        }
        return NextResponse.json(
            { error: 'Error al actualizar libro' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar un libro
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.book.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Libro eliminado correctamente' });
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Libro no encontrado' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Error al eliminar libro' },
            { status: 500 }
        );
    }
}
