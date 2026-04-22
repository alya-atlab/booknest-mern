import { Router } from "express";
import protect from "../middlewares/auth.middleware";
import { addToCart } from "../controllers/cart.controller";

const router = Router();

router.post('/', protect, addToCart);
export default router;