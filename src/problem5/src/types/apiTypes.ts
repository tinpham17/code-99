import { Request, Response } from "express";
import { $ZodIssue } from "zod/v4/core/errors.cjs";

export interface PagedData<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
}

export enum ErrorResponseCode {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorResponseCode;
    message: string;
    details?: $ZodIssue[];
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface RouteHandler<T> {
  (req: Request, res: Response<ApiResponse<T>>): void;
}
