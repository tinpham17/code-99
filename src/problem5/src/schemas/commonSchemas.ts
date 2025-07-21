import z from "zod";

const VALIDATION_MESSAGES = {
  PAGE_POSITIVE: "Page must be a positive integer",
  PAGE_GREATER_THAN_ZERO: "Page must be greater than 0",
  LIMIT_POSITIVE: "Limit must be a positive integer",
  LIMIT_GREATER_THAN_ZERO: "Limit must be greater than 0",
  LIMIT_MAX_EXCEEDED: "Limit cannot exceed 100",
  ID_POSITIVE: "ID must be a positive integer",
} as const;

export const idSchema = z
  .string()
  .regex(/^\d+$/, VALIDATION_MESSAGES.ID_POSITIVE)
  .transform((val: string) => parseInt(val))
  .refine(
    (val: number) => val > 0,
    VALIDATION_MESSAGES.LIMIT_GREATER_THAN_ZERO,
  );

export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, VALIDATION_MESSAGES.PAGE_POSITIVE)
    .transform((val: string) => parseInt(val))
    .refine(
      (val: number) => val > 0,
      VALIDATION_MESSAGES.PAGE_GREATER_THAN_ZERO,
    ),
  limit: z
    .string()
    .regex(/^\d+$/, VALIDATION_MESSAGES.LIMIT_POSITIVE)
    .transform((val: string) => parseInt(val))
    .refine(
      (val: number) => val > 0,
      VALIDATION_MESSAGES.LIMIT_GREATER_THAN_ZERO,
    ),
});
