import { NextFunction, Request, Response } from "express";
import { ErrorResponse, ErrorResponseCode } from "../types";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: ErrorResponseCode.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    },
  });
};
