import { Router } from "express";
import { telegramLogin, refresh, botLogin } from "./auth.controller";
import { authRateLimiter } from "../../middlewares/rateLimit";
import { requireInternalSecret } from "../../middlewares/internalAuth";

const router = Router();

router.post("/telegram", authRateLimiter, telegramLogin);
router.post("/refresh", authRateLimiter, refresh);
router.post("/bot", requireInternalSecret, authRateLimiter, botLogin);

export default router;