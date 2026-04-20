import { Router } from "express";
import { getUserById, getUsers, updateUser } from "../controllers/user.controller";
import protect from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorization.middleware";

const router = Router();
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
export default router;
