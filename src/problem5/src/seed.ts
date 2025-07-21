import { PrismaClient, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

const tasks = [
  {
    title: "Complete project documentation",
    description:
      "Write comprehensive documentation for the current project including API endpoints, setup instructions, and deployment guide.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Implement user authentication",
    description:
      "Add JWT-based authentication system with login, register, and password reset functionality.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Set up CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing, building, and deployment to staging environment.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Design responsive UI components",
    description:
      "Create reusable React components with proper TypeScript types and responsive design patterns.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Write unit tests",
    description:
      "Add comprehensive unit tests for all business logic functions with at least 90% code coverage.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Optimize database queries",
    description:
      "Review and optimize slow database queries, add proper indexes, and implement query caching.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Implement error handling",
    description:
      "Add proper error handling middleware and custom error classes for better debugging.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Add logging system",
    description:
      "Implement structured logging with different levels (debug, info, warn, error) and log rotation.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Create API documentation",
    description:
      "Generate OpenAPI/Swagger documentation for all REST endpoints with examples and schemas.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Set up monitoring",
    description:
      "Configure application monitoring with metrics collection, health checks, and alerting.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Implement rate limiting",
    description:
      "Add rate limiting middleware to prevent API abuse and ensure fair usage.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Add data validation",
    description:
      "Implement comprehensive input validation using Joi or similar validation libraries.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Create deployment scripts",
    description:
      "Write shell scripts for automated deployment to different environments (dev, staging, prod).",
    status: TaskStatus.PENDING,
  },
  {
    title: "Implement caching strategy",
    description:
      "Add Redis caching for frequently accessed data to improve application performance.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Add security headers",
    description:
      "Configure security headers like CSP, HSTS, and X-Frame-Options for better security.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Create backup strategy",
    description:
      "Set up automated database backups with retention policies and recovery procedures.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Implement search functionality",
    description:
      "Add full-text search capabilities using Elasticsearch or similar search engine.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Add file upload feature",
    description:
      "Implement secure file upload with virus scanning, size limits, and cloud storage integration.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Create admin dashboard",
    description:
      "Build an admin interface for managing users, monitoring system health, and viewing analytics.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Implement webhooks",
    description:
      "Add webhook system for real-time notifications and third-party integrations.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Add internationalization",
    description: "Implement i18n support for multiple languages and locales.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Create performance tests",
    description:
      "Write load testing scripts to ensure the application can handle expected traffic.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Implement OAuth integration",
    description:
      "Add OAuth 2.0 support for Google, GitHub, and other popular providers.",
    status: TaskStatus.PENDING,
  },
  {
    title: "Add real-time features",
    description:
      "Implement WebSocket connections for real-time chat and notifications.",
    status: TaskStatus.COMPLETED,
  },
  {
    title: "Create mobile API",
    description:
      "Develop RESTful API endpoints specifically optimized for mobile applications.",
    status: TaskStatus.PENDING,
  },
];

async function main() {
  console.log("Starting database seeding...");

  // Clear existing tasks
  await prisma.task.deleteMany({});
  console.log("Cleared existing tasks");

  // Create new tasks
  for (const task of tasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log(`Successfully seeded ${tasks.length} tasks`);

  // Display summary
  const completedCount = await prisma.task.count({
    where: { status: TaskStatus.COMPLETED },
  });

  const pendingCount = await prisma.task.count({
    where: { status: TaskStatus.PENDING },
  });

  console.log(`Summary: ${completedCount} completed, ${pendingCount} pending`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed");
  });
