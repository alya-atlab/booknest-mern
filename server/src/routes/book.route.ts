import { Router } from "express";
import protect from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorization.middleware";
import { createBook } from "../controllers/book.controller";
const router = Router();
router.post("/", protect, authorizeRoles("author", "admin"), createBook);
export default router;
