import { Router } from "express";
import protect from "../middlewares/auth.middleware";
import { addToCart, deleteItem, getCart, updateItem } from "../controllers/cart.controller";

const router = Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:bookId", protect, updateItem);
router.delete("/:bookId", protect, deleteItem);
export default router;
