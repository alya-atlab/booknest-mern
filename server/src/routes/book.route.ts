import { Router } from "express";
import protect from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorization.middleware";
import {
  createBook,
  deleteBook,
  getBookByID,
  getBooks,
} from "../controllers/book.controller";

const router = Router();
router.post("/", protect, authorizeRoles("author", "admin"), createBook);
router.get("/", getBooks);
router.get("/:id", getBookByID);
router.delete("/:id", protect, authorizeRoles("author", "admin"), deleteBook);

export default router;
