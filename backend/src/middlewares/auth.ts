import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token yo'q" });
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    // Sabab (eskirgan/soxta) foydalanuvchiga aytilmaydi — faqat umumiy xabar
    return res.status(401).json({ error: "Token yaroqsiz yoki muddati o'tgan" });
  }
}