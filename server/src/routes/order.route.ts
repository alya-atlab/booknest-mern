import { Router } from "express";
import protect from "../middlewares/auth.middleware";
import { checkout } from "../controllers/order.controller";

const router = Router();

router.post('/', protect, checkout);

export default router;