# Sistema de Gestión de Autores y Libros

API REST construida con Next.js 16, Prisma y PostgreSQL para gestionar autores y sus libros.

## Características

- CRUD completo para autores
- CRUD completo para libros
- Relación uno a muchos entre autores y libros
- Validación de datos
- Manejo de errores
- TypeScript
- Prisma ORM
- PostgreSQL

## Tecnologías

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **Tailwind CSS 4** - Estilos

## Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd next-api-routes
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` y agrega tu URL de base de datos PostgreSQL:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

4. Genera el cliente de Prisma:
```bash
npm run prisma:generate
```

5. Ejecuta las migraciones:
```bash
npm run prisma:migrate
```

6. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Scripts Disponibles

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build para producción
npm run start            # Servidor de producción
npm run lint             # Ejecutar linter
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:push      # Sincronizar schema con DB
```

## Estructura del Proyecto

```
next-api-routes/
├── prisma/
│   └── schema.prisma          # Schema de base de datos
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── authors/       # Endpoints de autores
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── books/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── books/         # Endpoints de libros
│   │   │       ├── [id]/
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── prisma.ts          # Cliente Prisma
├── .env                       # Variables de entorno (no subir a git)
├── .env.example               # Ejemplo de variables
└── package.json
```

## API Endpoints

### Autores

- `GET /api/authors` - Listar todos los autores
- `POST /api/authors` - Crear un autor
- `GET /api/authors/[id]` - Obtener un autor
- `PUT /api/authors/[id]` - Actualizar un autor
- `DELETE /api/authors/[id]` - Eliminar un autor
- `GET /api/authors/[id]/books` - Obtener libros de un autor

### Libros

- `GET /api/books` - Listar todos los libros
- `POST /api/books` - Crear un libro
- `GET /api/books/[id]` - Obtener un libro
- `PUT /api/books/[id]` - Actualizar un libro
- `DELETE /api/books/[id]` - Eliminar un libro

Para más detalles sobre los endpoints, consulta [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Modelo de Datos

### Author (Autor)
- id: String (CUID)
- name: String
- email: String (único)
- bio: String (opcional)
- nationality: String (opcional)
- birthYear: Int (opcional)
- books: Book[]

### Book (Libro)
- id: String (CUID)
- title: String
- description: String
- isbn: String (único, opcional)
- publishedYear: Int (opcional)
- genre: String (opcional)
- pages: Int (opcional)
- authorId: String
- author: Author

## Seguridad

- Las credenciales de base de datos están en `.env` (excluido de git)
- Validación de datos en todos los endpoints
- Manejo apropiado de errores
- Sanitización de inputs
