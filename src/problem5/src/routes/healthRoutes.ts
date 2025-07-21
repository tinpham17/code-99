import { Request, Response, Router } from "express";
import { ApiResponse } from "../types";

const router = Router();

router.get(
  "/",
  (
    req: Request,
    res: Response<
      ApiResponse<{ name: string; status: string; timestamp: string }>
    >,
  ) => {
    res.json({
      success: true,
      data: {
        name: "Crude Server",
        status: "OK",
        timestamp: new Date().toISOString(),
      },
    });
  },
);

export const healthRoutes = router;
