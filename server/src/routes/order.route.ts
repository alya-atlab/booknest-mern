import { Router } from "express";
import protect from "../middlewares/auth.middleware";
import {
  checkout,
  getMyOrders,
  getOrderById,
  getOrders,
} from "../controllers/order.controller";
import { authorizeRoles } from "../middlewares/authorization.middleware";

const router = Router();

router.post("/", protect, checkout);
router.get("/", protect, authorizeRoles("admin"), getOrders);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;
