import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAuthor() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('❌ Uso: npm run add-author "Nombre" "email@example.com" ["Bio"] ["Nacionalidad"] [AñoNacimiento]');
    console.log('\nEjemplo:');
    console.log('npm run add-author "Pablo Neruda" "neruda@example.com" "Poeta chileno" "Chileno" 1904');
    process.exit(1);
  }

  const [name, email, bio, nationality, birthYearStr] = args;
  const birthYear = birthYearStr ? parseInt(birthYearStr) : null;

  try {
    const author = await prisma.author.create({
      data: {
        name,
        email,
        bio: bio || null,
        nationality: nationality || null,
        birthYear,
      },
    });

    console.log('✅ Autor creado exitosamente:');
    console.log(JSON.stringify(author, null, 2));
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      console.error('❌ Error: El email ya está registrado');
    } else {
      console.error('❌ Error al crear autor:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addAuthor();
