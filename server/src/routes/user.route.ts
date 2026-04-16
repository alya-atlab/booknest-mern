import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import protect from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorization.middleware";

const router = Router();
router.get("/", protect, authorizeRoles("admin"), getUsers);
export default router;
