import { Router } from "express";
import protect from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorization.middleware";
import {
  createBook,
  getBookByID,
  getBooks,
} from "../controllers/book.controller";

const router = Router();
router.post("/", protect, authorizeRoles("author", "admin"), createBook);
router.get("/", getBooks);
router.get("/:id", getBookByID);

export default router;
