import { TaskStatus } from "@prisma/client";
import z from "zod";
import { idSchema, paginationSchema } from "./commonSchemas";

const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "Title is required",
  TITLE_TOO_LONG: "Title must be less than 255 characters",
  DESCRIPTION_TOO_LONG: "Description must be less than 1000 characters",
  TITLE_FILTER_EMPTY: "Title filter cannot be empty",
} as const;

export const createTaskRequestSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, VALIDATION_MESSAGES.TITLE_REQUIRED)
      .max(255, VALIDATION_MESSAGES.TITLE_TOO_LONG)
      .trim(),
    description: z
      .string()
      .max(1000, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
      .optional()
      .default(""),
    status: z
      .enum([TaskStatus.PENDING, TaskStatus.COMPLETED])
      .optional()
      .default(TaskStatus.PENDING),
  }),
});

export const updateTaskRequestSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    title: z
      .string()
      .min(1, VALIDATION_MESSAGES.TITLE_REQUIRED)
      .max(255, VALIDATION_MESSAGES.TITLE_TOO_LONG)
      .trim()
      .optional(),
    description: z
      .string()
      .max(1000, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
      .optional(),
    status: z.enum([TaskStatus.PENDING, TaskStatus.COMPLETED]).optional(),
  }),
});

export const getTasksRequestSchema = z.object({
  query: z
    .object({
      status: z.enum([TaskStatus.PENDING, TaskStatus.COMPLETED]).optional(),
      title: z
        .string()
        .min(1, VALIDATION_MESSAGES.TITLE_FILTER_EMPTY)
        .optional(),
    })
    .extend(paginationSchema.shape),
});

export const getTaskRequestSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
});

export const deleteTaskRequestSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
});
