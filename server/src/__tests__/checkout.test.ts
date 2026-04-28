import "dotenv/config";
import mongoose, { Types } from "mongoose";
import bookModel from "../models/books.model";
import cartModel from "../models/cart.model";
import { checkout } from "../services/order.service";
import orderModel from "../models/order.model";

describe("Checkout", () => {
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
  it("should create order when stock is available", async () => {
    const userId = new Types.ObjectId();

    const book = await bookModel.create({
      title: "test book",
      description: "this is the test book",
      price: 15,
      stock: 4,
      coverImage: "test_book_image.jpg",
      author: new Types.ObjectId(),
    });

    await cartModel.create({
      userId,
      items: [{ bookId: book._id, quantity: 1 }],
    });

    const order = await checkout(userId);

    expect(order).toHaveProperty("_id");
    expect(order.items[0].quantity).toBe(1);
    expect(order.items[0].priceAtPurchase).toBe(15);
    expect(order.totalAmount).toBe(15);

    const updatedBook = await bookModel.findById(book._id);
    expect(updatedBook).not.toBeNull();
    expect(updatedBook!.stock).toBe(3);

    const cart = await cartModel.findOne({ userId });
    expect(cart).not.toBeNull();
    expect(cart!.items).toHaveLength(0);
  });
  it("should throw error when stock is insufficient", async () => {
    const userId = new Types.ObjectId();

    const book = await bookModel.create({
      title: "failed test book",
      description: "this is the test book",
      price: 15,
      stock: 1,
      coverImage: "test_book_image.jpg",
      author: new Types.ObjectId(),
    });

    await cartModel.create({
      userId,
      items: [{ bookId: book._id, quantity: 3 }],
    });

    await expect(checkout(userId)).rejects.toMatchObject({
      statusCode: 409,
    });
    const updatedBook = await bookModel.findById(book._id);
    expect(updatedBook).not.toBeNull();
    expect(updatedBook!.stock).toBe(1);

    const cart = await cartModel.findOne({ userId });
    expect(cart).not.toBeNull();
    expect(cart!.items).toHaveLength(1);
    expect(cart!.items[0].quantity).toBe(3);
    expect(cart!.items[0].bookId.toString()).toBe(book._id.toString());

    const order = await orderModel.findOne({ userId });
    expect(order).toBeNull();
  });
  it("should fail checkout when cart is empty", async () => {
    const userId = new Types.ObjectId();

    await cartModel.create({
      userId,
      items: [],
    });

    await expect(checkout(userId)).rejects.toMatchObject({
      statusCode: 400,
    });

    const order = await orderModel.findOne({ userId });
    expect(order).toBeNull();

    const cart = await cartModel.findOne({ userId });
    expect(cart).not.toBeNull();
    expect(cart!.items).toHaveLength(0);
  });

  it("should fail and not update any stock when one item is insufficient", async () => {
    const userId = new Types.ObjectId();

    const book1 = await bookModel.create({
      title: "failed test book 1",
      description: "this is the test book",
      price: 15,
      stock: 3,
      coverImage: "test_book_image.jpg",
      author: new Types.ObjectId(),
    });

    const book2 = await bookModel.create({
      title: "failed test book 2",
      description: "this is the test book",
      price: 15,
      stock: 1,
      coverImage: "test_book_image.jpg",
      author: new Types.ObjectId(),
    });

    await cartModel.create({
      userId,
      items: [
        { bookId: book1._id, quantity: 2 },
        { bookId: book2._id, quantity: 2 },
      ],
    });
    await expect(checkout(userId)).rejects.toMatchObject({
      statusCode: 409,
    });

    const updatedBook1 = await bookModel.findById(book1._id);
    expect(updatedBook1).not.toBeNull();
    expect(updatedBook1!.stock).toBe(3);

    const updatedBook2 = await bookModel.findById(book2._id);
    expect(updatedBook2).not.toBeNull();
    expect(updatedBook2!.stock).toBe(1);

    const order = await orderModel.findOne({ userId });
    expect(order).toBeNull();

    const cart = await cartModel.findOne({ userId });
    expect(cart).not.toBeNull();
    expect(cart!.items).toHaveLength(2);

    const item1 = cart!.items.find(
      (i) => i.bookId.toString() === book1._id.toString(),
    );

    expect(item1).not.toBeNull();
    expect(item1!.quantity).toBe(2);

    const item2 = cart!.items.find(
      (i) => i.bookId.toString() === book2._id.toString(),
    );

    expect(item2).not.toBeNull();
    expect(item2!.quantity).toBe(2);
  });
});
