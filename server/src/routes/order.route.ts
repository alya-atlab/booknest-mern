import { Router } from "express";
import protect from "../middlewares/auth.middleware";
import {
  cancelOrder,
  checkout,
  getMyOrders,
  getOrderById,
  getOrders,
  getOrdersForAuthor,
  updateStatus,
} from "../controllers/order.controller";
import { authorizeRoles } from "../middlewares/authorization.middleware";

const router = Router();

router.post("/", protect, checkout);
router.get("/", protect, authorizeRoles("admin"), getOrders);
router.get("/my", protect, getMyOrders);
router.get("/author/my", protect, authorizeRoles("author"), getOrdersForAuthor);
router.get("/:id", protect, getOrderById);
router.patch("/:id/cancel", protect, cancelOrder);
router.patch("/:id", protect, authorizeRoles("admin"), updateStatus);

export default router;
