import "dotenv/config";
import mongoose, { Types } from "mongoose";
import bookModel from "../models/books.model";
import cartModel from "../models/cart.model";
import { checkout } from "../services/order.service";

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
    // Arrange
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
    // Act
    const order = await checkout(userId);

    // Assert
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
});
