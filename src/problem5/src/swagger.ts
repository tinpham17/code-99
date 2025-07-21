import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crude Server API",
      version: "1.0.0",
      description: "A simple CRUD API server",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The task ID",
            },
            title: {
              type: "string",
              description: "The task title",
            },
            description: {
              type: "string",
              description: "The task description",
            },
            status: {
              type: "string",
              enum: ["PENDING", "COMPLETED"],
              description: "The task status",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The task creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The task last update date",
            },
          },
          required: ["title", "description", "status"],
        },
        TaskInput: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The task title",
            },
            description: {
              type: "string",
              description: "The task description",
            },
            status: {
              type: "string",
              enum: ["PENDING", "COMPLETED"],
              description: "The task status",
            },
          },
          required: ["title"],
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              description: "Current page number",
              example: 1,
            },
            limit: {
              type: "integer",
              description: "Number of items per page",
              example: 10,
            },
            total: {
              type: "integer",
              description: "Total number of items",
              example: 25,
            },
            totalPages: {
              type: "integer",
              description: "Total number of pages",
              example: 3,
            },
            hasNext: {
              type: "boolean",
              description: "Whether there is a next page",
              example: true,
            },
            hasPrev: {
              type: "boolean",
              description: "Whether there is a previous page",
              example: false,
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

export const specs = swaggerJsdoc(options);
