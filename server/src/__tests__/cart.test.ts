import "dotenv/config";
import mongoose, { Types } from "mongoose";
import bookModel from "../models/books.model";
import {
  addToCart,
  deleteItem,
  getCart,
  updateItem,
} from "../services/cart.service";
const createTestBook = async (stock = 1) => {
  const book = await bookModel.create({
    title: "book",
    description: "this is the book",
    price: 15,
    stock,
    coverImage: "book_image.jpg",
    author: new Types.ObjectId(),
  });
  return book;
};
const createUserId = () => {
  return new Types.ObjectId();
};

describe("Cart service", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URL!);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });
  describe("addToCart", () => {
    it("should not allow adding item to cart if stock is zero", async () => {
      const book = await createTestBook(0);
      await expect(
        addToCart({
          userId: createUserId(),
          bookId: book._id,
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
    it("should not allow adding quantity beyond available stock", async () => {
      const book = await createTestBook(1);
      const userId = createUserId();
      await addToCart({ userId, bookId: book._id });
      await expect(
        addToCart({
          userId,
          bookId: book._id,
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });
      const newCart = await getCart(userId);
      expect(newCart.items[0].quantity).toBe(1);
      expect(newCart.items).toHaveLength(1);
    });
    it("should add item to empty cart", async () => {
      const book = await createTestBook();
      const userId = createUserId();
      const cart = await addToCart({
        userId,
        bookId: book._id,
      });
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(1);
      expect(cart.userId.toString()).toBe(userId.toString());
      expect(cart.items[0].bookId._id.toString()).toBe(book._id.toString());
    });
    it("should increase quantity if item already exists", async () => {
      const book = await createTestBook(5);
      const userId = createUserId();
      await addToCart({
        userId,
        bookId: book._id,
      });
      const cart = await addToCart({
        userId,
        bookId: book._id,
      });
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items).toHaveLength(1);
    });
    it("should throw when adding a non-existing book", async () => {
      await expect(
        addToCart({
          userId: createUserId(),
          bookId: new Types.ObjectId(),
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
  describe("updateItem", () => {
    it("should update item quantity when stock is sufficient", async () => {
      const book = await createTestBook(5);
      const userId = createUserId();
      const cart = await addToCart({ userId, bookId: book._id });
      const newCart = await updateItem({
        userId,
        bookId: book._id,
        quantity: 3,
      });
      expect(newCart._id.toString()).toBe(cart._id.toString());
      expect(newCart.items[0].quantity).toBe(3);
    });
    it("should delete item if new quantity is zero", async () => {
      const book1 = await createTestBook(5);
      const book2 = await createTestBook(3);
      const userId = createUserId();
      await addToCart({ userId, bookId: book1._id });
      await addToCart({ userId, bookId: book2._id });
      const newCart = await updateItem({
        userId,
        bookId: book1._id,
        quantity: 0,
      });
      expect(newCart.items).toHaveLength(1);
      expect(newCart.items[0].bookId._id.toString()).toBe(book2._id.toString());
      expect(newCart.items[0].quantity).toBe(1);
    });
    it("should throw error if item not found", async () => {
      const book1 = await createTestBook(5);
      const book2 = await createTestBook(3);
      const userId = createUserId();

      await addToCart({ userId, bookId: book1._id });
      await expect(
        updateItem({
          userId,
          bookId: book2._id,
          quantity: 2,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Item not found",
      });
    });
    it("should throw error if book not found", async () => {
      const book = await createTestBook(5);
      const userId = createUserId();
      await addToCart({ userId, bookId: book._id });
      await book.deleteOne();
      await expect(
        updateItem({
          userId,
          bookId: book._id,
          quantity: 2,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
      });
    });
    it("should throw error if stock is zero", async () => {
      const book = await createTestBook(3);
      const userId = createUserId();
      await addToCart({ userId, bookId: book._id });
      book.stock = 0;
      await book.save();
      await expect(
        updateItem({
          userId,
          bookId: book._id,
          quantity: 2,
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Out of stock",
      });
      const cart = await getCart(userId);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(1);
    });
    it("should throw error if quantity exceeds available stock", async () => {
      const book = await createTestBook(1);
      const userId = createUserId();
      await addToCart({ userId, bookId: book._id });
      await expect(
        updateItem({
          userId,
          bookId: book._id,
          quantity: 2,
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Requested quantity exceeds available stock",
      });
      const cart = await getCart(userId);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(1);
    });
    it("should throw error if quantity is negative", async () => {
      const book = await createTestBook(3);
      const userId = createUserId();
      await addToCart({ userId, bookId: book._id });
      await expect(
        updateItem({
          userId,
          bookId: book._id,
          quantity: -2,
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Quantity cannot be negative",
      });
       const cart = await getCart(userId);
       expect(cart.items).toHaveLength(1);
       expect(cart.items[0].quantity).toBe(1);
    });
  });

  describe("deleteItem", () => {
    it("should remove only the requested item from cart", async () => {
      const book1 = await createTestBook(5);
      const book2 = await createTestBook(3);
      const userId = createUserId();
      await addToCart({ userId, bookId: book1._id });
      await addToCart({ userId, bookId: book2._id });
      const newCart = await deleteItem({
        userId,
        bookId: book1._id,
      });
      expect(newCart.items).toHaveLength(1);
      expect(newCart.items[0].bookId._id.toString()).toBe(book2._id.toString());
      expect(newCart.items[0].quantity).toBe(1);
    });
    it("should throw error if item not found", async () => {
      const book1 = await createTestBook(5);
      const book2 = await createTestBook(3);
      const userId = createUserId();

      await addToCart({ userId, bookId: book1._id });
      await expect(
        deleteItem({
          userId,
          bookId: book2._id,
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Item not found",
      });
    });
  });
});
