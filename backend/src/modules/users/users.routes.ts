import { Router, Response } from "express";
import { authenticate, AuthenticatedRequest } from "../../middlewares/auth";
import { prisma } from "../../server";

const router = Router();

router.get("/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(req.user!.userId) },
    select: {
      id: true,
      telegramId: true,
      username: true,
      firstName: true,
      role: true,
      registeredAt: true,
    },
  });

  if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

  // BigInt'ni JSON'ga chiqarish uchun string'ga o'giramiz
  res.json({ ...user, id: user.id.toString(), telegramId: user.telegramId.toString() });
});

export default router;