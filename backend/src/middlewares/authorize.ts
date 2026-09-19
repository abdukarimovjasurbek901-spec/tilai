import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

const ROLE_LEVEL = { USER: 0, MODERATOR: 1, ADMIN: 2, SUPER_ADMIN: 3 } as const;
type Role = keyof typeof ROLE_LEVEL;

// Misol: authorize("ADMIN") -> faqat ADMIN va undan yuqori (SUPER_ADMIN) kira oladi
export function authorize(minRole: Role) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // MUHIM: rol faqat req.user (JWT'dan, backend chiqargan) orqali tekshiriladi.
    // req.body.isAdmin yoki shunga o'xshash frontend'dan kelgan qiymatga HECH QACHON ishonilmaydi.
    if (!req.user) {
      return res.status(401).json({ error: "Autentifikatsiya talab qilinadi" });
    }
    if (ROLE_LEVEL[req.user.role] < ROLE_LEVEL[minRole]) {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    next();
  };
}