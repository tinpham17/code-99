# Crude Server

The project implements a modular backend server using ExpressJS and TypeScript, providing CRUD interfaces with SQLite as the database.

## Prerequisites

- Node.js (v24 or higher)
- npm (v11 or higher)

## Running the Application

### Development Mode

1. Clone `env.example` into a `.env` file in the project root and update the variable values.

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
```

4. (Optional) Seed the database with test data:

```bash
npm run db:seed
```

5. Run server with hot reload:

```bash
npm run dev
```

### Production Mode

1. Clone `env.example` into a `.env` file in the project root and update the variable values.

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
```

4. (Optional) Seed the database with test data:

```bash
npm run db:seed
```

5. Build the TypeScript code:

```bash
npm run build
```

6. Start the server:

```bash
npm start
```

### API Endpoints

Once the server is running, you can access these endpoints:

- **Health Check**: `/health`
- **Swagger UI**: `/api-docs`
- **API Base URL**: `/api/v1`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply database migrations
- `npm run db:seed` - Seed the database with test data
- `npm run db:studio` - Open Prisma Studio for database management
