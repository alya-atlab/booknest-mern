import "dotenv/config";

import mongoose, { Types } from "mongoose";
import bookModel from "../models/books.model";
import orderModel from "../models/order.model";
import {
  getMyOrders,
  getOrderById,
  getOrdersForAuthor,
  updateStatus,
} from "../services/order.service";

describe("Order service", () => {
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
  describe("getOrdersForAuthor", () => {
    it("should return orders containing the author's items and filter items correctly", async () => {
      const author1Id = new Types.ObjectId();
      const author2Id = new Types.ObjectId();

      const book1 = await bookModel.create({
        title: "book for author1",
        description: "this is the book for author 1",
        price: 15,
        stock: 4,
        coverImage: "author1_book_image.jpg",
        author: author1Id,
      });
      const book2 = await bookModel.create({
        title: "book for author2",
        description: "this is the book for author 2",
        price: 20,
        stock: 5,
        coverImage: "author2_book_image.jpg",
        author: author2Id,
      });
      const order1 = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: book1._id,
            priceAtPurchase: book1.price,
            quantity: 1,
            authorId: author1Id,
            title: book1.title,
          },
          {
            bookId: book2._id,
            priceAtPurchase: book2.price,
            quantity: 1,
            authorId: author2Id,
            title: book2.title,
          },
        ],
        totalAmount: 35,
        status: "pending",
      });
      const order2 = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: book1._id,
            priceAtPurchase: book1.price,
            quantity: 2,
            authorId: author1Id,
            title: book1.title,
          },
        ],
        totalAmount: 30,
        status: "completed",
      });
      const order3 = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: book2._id,
            priceAtPurchase: book2.price,
            quantity: 1,
            authorId: author2Id,
            title: book2.title,
          },
        ],
        totalAmount: 20,
        status: "pending",
      });

      const author1Orders = await getOrdersForAuthor(author1Id);

      expect(author1Orders).not.toBeNull();
      expect(author1Orders.length).toBe(2);

      const order1Author1 = author1Orders.find(
        (o) => o?.orderId.toString() === order1._id.toString(),
      );
      expect(order1Author1).not.toBeUndefined();
      expect(order1Author1!.authorOrderTotal).toBe(15);
      expect(order1Author1!.status).toBe("pending");
      expect(order1Author1!.items.length).toBe(1);
      expect(order1Author1!.items[0].price).toBe(15);
      expect(order1Author1!.items[0].title).toBe("book for author1");
      expect(order1Author1!.items[0].quantity).toBe(1);

      const order2Author = author1Orders.find(
        (o) => o?.orderId.toString() === order2._id.toString(),
      );
      expect(order2Author).not.toBeUndefined();
      expect(order2Author!.authorOrderTotal).toBe(30);
      expect(order2Author!.status).toBe("completed");
      expect(order2Author!.items.length).toBe(1);
      expect(order2Author!.items[0].price).toBe(15);
      expect(order2Author!.items[0].title).toBe("book for author1");
      expect(order2Author!.items[0].quantity).toBe(2);

      const order3Author = author1Orders.find(
        (o) => o?.orderId.toString() === order3._id.toString(),
      );
      expect(order3Author).toBeUndefined();
    });
  });
  describe("getMyOrders", () => {
    it("should return orders for the user", async () => {
      const user1Id = new Types.ObjectId();
      const user2Id = new Types.ObjectId();

      const order1 = await orderModel.create({
        userId: user1Id,
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 2,
            authorId: new Types.ObjectId(),
            title: "book1",
          },
        ],
        totalAmount: 30,
        status: "completed",
      });
      const order2 = await orderModel.create({
        userId: user1Id,
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 18,
            quantity: 1,
            authorId: new Types.ObjectId(),
            title: "book2",
          },
        ],
        totalAmount: 18,
        status: "pending",
      });
      const order3 = await orderModel.create({
        userId: user2Id,
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 18,
            quantity: 2,
            authorId: new Types.ObjectId(),
            title: "book2",
          },
        ],
        totalAmount: 36,
        status: "pending",
      });
      const user1Orders = await getMyOrders(user1Id);

      expect(user1Orders).not.toBeUndefined();
      expect(user1Orders.length).toBe(2);

      const order1User1 = user1Orders.find(
        (o) => o?._id.toString() === order1._id.toString(),
      );

      expect(order1User1).not.toBeUndefined();

      const order2User1 = user1Orders.find(
        (o) => o?._id.toString() === order2._id.toString(),
      );

      expect(order2User1).not.toBeUndefined();

      const order3User1 = user1Orders.find(
        (o) => o?._id.toString() === order3._id.toString(),
      );
      expect(order3User1).toBeUndefined();
    });
  });

  describe("getOrderById", () => {
    it("should allow user to access their own order", async () => {
      const userId = new Types.ObjectId();

      const order = await orderModel.create({
        userId: userId,
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 2,
            authorId: new Types.ObjectId(),
            title: "book1",
          },
        ],
        totalAmount: 30,
        status: "completed",
      });
      const orderById = await getOrderById({
        userId,
        userRole: "user",
        orderId: order._id,
      });
      expect(orderById).not.toBeUndefined();
      expect(orderById.userId.toString()).toBe(userId.toString());
      expect(orderById._id.toString()).toBe(order._id.toString());
    });
    it("should allow admin to access any order", async () => {
      const order = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 1,
            authorId: new Types.ObjectId(),
            title: "book",
          },
        ],
        totalAmount: 30,
        status: "pending",
      });

      const orderById = await getOrderById({
        userId: new Types.ObjectId(),
        userRole: "admin",
        orderId: order._id,
      });
      expect(orderById).not.toBeUndefined();
      expect(orderById._id.toString()).toBe(order._id.toString());
    });
    it("should not allow user to access other users orders", async () => {
      const order = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 1,
            authorId: new Types.ObjectId(),
            title: "book",
          },
        ],
        totalAmount: 30,
        status: "pending",
      });
      await expect(
        getOrderById({
          userId: new Types.ObjectId(),
          userRole: "user",
          orderId: order._id,
        }),
      ).rejects.toMatchObject({
        statusCode: 403,
      });
    });
    it("should throw error when order not found", async () => {
      await expect(
        getOrderById({
          userId: new Types.ObjectId(),
          userRole: "user",
          orderId: new Types.ObjectId(),
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe("updateStatus", () => {
    it("should update status when transition is valid", async () => {
      const order = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 2,
            authorId: new Types.ObjectId(),
            title: "book",
          },
        ],
        totalAmount: 30,
        status: "pending",
      });
      const updatedOrder = await updateStatus({
        userRole: "admin",
        orderId: order._id,
        newStatus: "processing",
      });
      expect(updatedOrder).not.toBeUndefined();
      expect(updatedOrder.status).toBe("processing");
    });
    it("should not allow non-admin users to update status", async () => {
      const order = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 2,
            authorId: new Types.ObjectId(),
            title: "book",
          },
        ],
        totalAmount: 30,
        status: "pending",
      });
      await expect(
        updateStatus({
          userRole: "user",
          orderId: order._id,
          newStatus: "processing",
        }),
      ).rejects.toMatchObject({
        statusCode: 403,
      });
    });
    it("should not update status when transition is not valid", async () => {
      const order = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 2,
            authorId: new Types.ObjectId(),
            title: "book",
          },
        ],
        totalAmount: 30,
        status: "completed",
      });

      await expect(
        updateStatus({
          userRole: "admin",
          orderId: order._id,
          newStatus: "processing",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
    it("should not update status when new status is the same as current status", async () => {
      const order = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 2,
            authorId: new Types.ObjectId(),
            title: "book",
          },
        ],
        totalAmount: 30,
        status: "processing",
      });

      await expect(
        updateStatus({
          userRole: "admin",
          orderId: order._id,
          newStatus: "processing",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
    it("should throw error when new status is not valid", async () => {
      const order = await orderModel.create({
        userId: new Types.ObjectId(),
        items: [
          {
            bookId: new Types.ObjectId(),
            priceAtPurchase: 15,
            quantity: 2,
            authorId: new Types.ObjectId(),
            title: "book",
          },
        ],
        totalAmount: 30,
        status: "processing",
      });
      await expect(
        updateStatus({
          userRole: "admin",
          orderId: order._id,
          newStatus: "hello",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
    it("should throw error when order not found", async () => {
      await expect(
        updateStatus({
          userRole: "admin",
          orderId: new Types.ObjectId(),
          newStatus: "processing",
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});
