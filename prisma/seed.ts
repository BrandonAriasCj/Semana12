import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear autores
  const author1 = await prisma.author.upsert({
    where: { email: 'gabo@example.com' },
    update: {},
    create: {
      name: 'Gabriel García Márquez',
      email: 'gabo@example.com',
      bio: 'Escritor colombiano, premio Nobel de Literatura 1982',
      nationality: 'Colombiano',
      birthYear: 1927,
    },
  });

  const author2 = await prisma.author.upsert({
    where: { email: 'isabel@example.com' },
    update: {},
    create: {
      name: 'Isabel Allende',
      email: 'isabel@example.com',
      bio: 'Escritora chilena, una de las más leídas en español',
      nationality: 'Chilena',
      birthYear: 1942,
    },
  });

  const author3 = await prisma.author.upsert({
    where: { email: 'borges@example.com' },
    update: {},
    create: {
      name: 'Jorge Luis Borges',
      email: 'borges@example.com',
      bio: 'Escritor argentino, maestro del cuento corto',
      nationality: 'Argentino',
      birthYear: 1899,
    },
  });

  const author4 = await prisma.author.upsert({
    where: { email: 'cortazar@example.com' },
    update: {},
    create: {
      name: 'Julio Cortázar',
      email: 'cortazar@example.com',
      bio: 'Escritor argentino, exponente del boom latinoamericano',
      nationality: 'Argentino',
      birthYear: 1914,
    },
  });

  console.log('✅ Autores creados:', { author1, author2, author3, author4 });

  // Crear libros
  const book1 = await prisma.book.upsert({
    where: { isbn: '978-0307474728' },
    update: {},
    create: {
      title: 'Cien años de soledad',
      description: 'Una obra maestra del realismo mágico',
      isbn: '978-0307474728',
      publishedYear: 1967,
      genre: 'Realismo mágico',
      pages: 417,
      authorId: author1.id,
    },
  });

  const book2 = await prisma.book.upsert({
    where: { isbn: '978-0307387370' },
    update: {},
    create: {
      title: 'El amor en los tiempos del cólera',
      description: 'Una historia de amor que trasciende el tiempo',
      isbn: '978-0307387370',
      publishedYear: 1985,
      genre: 'Romance',
      pages: 368,
      authorId: author1.id,
    },
  });

  const book3 = await prisma.book.upsert({
    where: { isbn: '978-1501117015' },
    update: {},
    create: {
      title: 'La casa de los espíritus',
      description: 'Primera novela de Isabel Allende',
      isbn: '978-1501117015',
      publishedYear: 1982,
      genre: 'Ficción',
      pages: 448,
      authorId: author2.id,
    },
  });

  const book4 = await prisma.book.upsert({
    where: { isbn: '978-0142437223' },
    update: {},
    create: {
      title: 'Ficciones',
      description: 'Colección de cuentos de Borges',
      isbn: '978-0142437223',
      publishedYear: 1944,
      genre: 'Cuento',
      pages: 174,
      authorId: author3.id,
    },
  });

  const book5 = await prisma.book.upsert({
    where: { isbn: '978-0394752846' },
    update: {},
    create: {
      title: 'Rayuela',
      description: 'Novela experimental de Cortázar',
      isbn: '978-0394752846',
      publishedYear: 1963,
      genre: 'Ficción experimental',
      pages: 600,
      authorId: author4.id,
    },
  });

  console.log('✅ Libros creados:', { book1, book2, book3, book4, book5 });
  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
