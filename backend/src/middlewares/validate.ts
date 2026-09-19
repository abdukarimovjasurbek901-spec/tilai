import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// Har bir POST/PATCH endpoint uchun body'ni shu bilan tekshiring.
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Noto'g'ri so'rov", details: result.error.flatten() });
    }
    req.body = result.data;
    next();
  };
}