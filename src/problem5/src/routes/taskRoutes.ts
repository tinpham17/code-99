import { Router, Request, Response } from "express";
import { PrismaClient, Prisma, Task } from "@prisma/client";
import { ApiResponse, ErrorResponseCode, PagedData } from "../types";
import {
  createTaskRequestSchema,
  deleteTaskRequestSchema,
  getTaskRequestSchema,
  getTasksRequestSchema,
  updateTaskRequestSchema,
} from "../schemas";

const router = Router();
const prisma = new PrismaClient();

const createTask = async (req: Request, res: Response<ApiResponse<Task>>) => {
  const { success, data, error } = createTaskRequestSchema.safeParse(req);
  if (!success) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorResponseCode.BAD_REQUEST,
        message: "Invalid request parameters",
        details: error.issues,
      },
    });
  }

  const { title, description, status } = data.body;

  const task = await prisma.task.create({
    data: { title, description, status },
  });

  res.status(201).json({
    success: true,
    data: task,
  });
};

const getTasks = async (
  req: Request,
  res: Response<ApiResponse<PagedData<Task>>>,
) => {
  const { success, data, error } = getTasksRequestSchema.safeParse(req);
  if (!success) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorResponseCode.BAD_REQUEST,
        message: "Invalid request parameters",
        details: error.issues,
      },
    });
  }

  const { page, limit, status, title } = data.query;

  const where: Prisma.TaskWhereInput = {};
  if (status) {
    where.status = status;
  }
  if (title) {
    where.title = { contains: title };
  }

  const [total, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  res.json({
    success: true,
    data: {
      page,
      limit,
      total,
      items: tasks,
    },
  });
};

const getTaskById = async (req: Request, res: Response<ApiResponse<Task>>) => {
  const { success, data, error } = getTaskRequestSchema.safeParse(req);
  if (!success) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorResponseCode.BAD_REQUEST,
        message: "Invalid request parameters",
        details: error.issues,
      },
    });
  }

  const { id } = data.params;
  const task = await prisma.task.findUnique({ where: { id: Number(id) } });

  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        code: ErrorResponseCode.NOT_FOUND,
        message: "Task not found",
      },
    });
  }

  res.json({
    success: true,
    data: task,
  });
};

const updateTask = async (req: Request, res: Response<ApiResponse<Task>>) => {
  const { success, data, error } = updateTaskRequestSchema.safeParse(req);
  if (!success) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorResponseCode.BAD_REQUEST,
        message: "Invalid request parameters",
        details: error.issues,
      },
    });
  }

  const { id } = data.params;
  const updateData = data.body;

  const existingTask = await prisma.task.findUnique({ where: { id } });

  if (!existingTask) {
    return res.status(404).json({
      success: false,
      error: {
        code: ErrorResponseCode.NOT_FOUND,
        message: "Task not found",
      },
    });
  }

  const dataToUpdate: Prisma.TaskUpdateInput = {
    title: updateData.title || existingTask.title,
    description:
      updateData.description !== undefined
        ? updateData.description
        : existingTask.description,
    status: updateData.status || existingTask.status,
  };

  const task = await prisma.task.update({
    where: { id },
    data: dataToUpdate,
  });

  res.json({
    success: true,
    data: task,
  });
};

const deleteTask = async (req: Request, res: Response<ApiResponse<Task>>) => {
  const { success, data, error } = deleteTaskRequestSchema.safeParse(req);
  if (!success) {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorResponseCode.BAD_REQUEST,
        message: "Invalid request parameters",
        details: error.issues,
      },
    });
  }
  const { id } = data.params;
  const existingTask = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  if (!existingTask) {
    return res.status(404).json({
      success: false,
      error: {
        code: ErrorResponseCode.NOT_FOUND,
        message: "Task not found",
      },
    });
  }

  await prisma.task.delete({ where: { id: Number(id) } });
  res.status(204).send();
};

// Route definitions with Swagger documentation
/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", createTask);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks with optional filters and pagination
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED]
 *         description: Filter tasks by status
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter tasks by title (partial match)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (starts from 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page (max 100)
 *     responses:
 *       200:
 *         description: Paginated list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 meta:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getTaskById);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", deleteTask);

export const taskRoutes = router;
