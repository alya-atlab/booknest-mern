import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { loginUser, registerUser } from "../services/auth.service";
import userModel from "../models/user.model";

const registerTestUser = async ({
  email = "Example@test.com",
  password = "test123",
} = {}) => {
  const user = await registerUser({
    email,
    password,
    firstName: "test",
    lastName: "test",
  });
  return user;
};

const getUserFromDB = async (userId: string) => {
  const user = await userModel.findById(userId).select("+password");
  return user;
};
describe("Auth service", () => {
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
  describe("registerUser", () => {
    it("should register new user and returns token", async () => {
      const user = await registerTestUser({});

      expect(user.token).toBeDefined();
      expect(user.user.id).toBeDefined();
      expect(user.user.role).toBe("user");

      const savedUser = await getUserFromDB(user.user.id);

      expect(savedUser).toBeDefined();
    });
    it("should normalize the email", async () => {
      const user = await registerTestUser({});
      const savedUser = await getUserFromDB(user.user.id);
      expect(savedUser?.email).toBe("example@test.com");
    });
    it("should store hashed password", async () => {
      const user = await registerTestUser({});

      const savedUser = await getUserFromDB(user.user.id);
      const passwordMatch = await bcrypt.compare(
        "test123",
        savedUser!.password,
      );
      expect(savedUser?.password).not.toBe("test123");
      expect(passwordMatch).toBe(true);
    });
    it("should not register if user email exists in database", async () => {
      await registerTestUser({ email: "user@test.com" });
      await expect(
        registerTestUser({ email: "user@test.com" }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Email already registered",
      });
    });
    it("should throw error if password is less than 6 characters", async () => {
      await expect(
        registerTestUser({
          password: "123",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Password must be at least 6 characters",
      });
    });
    it("should throw error if email is not valid", async () => {
      await expect(
        registerTestUser({
          email: "123",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Invalid email format",
      });
    });
    it("should throw error if required fields are empty", async () => {
      await expect(
        registerTestUser({
          email: "",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Email, password, first name and last name are required",
      });
    });
    it("should trim email and password before register", async () => {
      const user = await registerTestUser({
        email: "  user@gmail.com  ",
        password: "  user123  ",
      });

      const savedUser = await getUserFromDB(user.user.id);
      expect(savedUser).toBeDefined();
      expect(savedUser!.email).toBe("user@gmail.com");
      const passwordMatch = await bcrypt.compare(
        "user123",
        savedUser!.password,
      );
      expect(passwordMatch).toBe(true);
    });
  });
  describe("loginUser", () => {
    it("should login user with valid credentials", async () => {
      await registerTestUser({
        email: "user@gmail.com",
        password: "user123",
      });
      const user = await loginUser({
        email: "user@gmail.com",
        password: "user123",
      });
      expect(user.token).toBeDefined();
      expect(user.user.id).toBeDefined();
      expect(user.user.role).toBe("user");
    });
    it("should reject login for non-existing email", async () => {
      await expect(
        loginUser({ email: "user@gmai.com", password: "user123" }),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });
    });
    it("should throw error if password is wrong", async () => {
      await registerTestUser({
        email: "user@gmail.com",
        password: "user123",
      });
      await expect(
        loginUser({ email: "user@gmail.com", password: "USER123" }),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });
    });
    it("should throw error if required fields are empty", async () => {
      await expect(
        loginUser({
          email: "",
          password: "123",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Email and password are required",
      });
    });
    it("should trim email and password before login", async () => {
      await registerTestUser({
        email: "user@gmail.com",
        password: "user123",
      });
      const user = await loginUser({
        email: "  user@gmail.com  ",
        password: "  user123  ",
      });

      expect(user.token).toBeDefined();
      expect(user.user.id).toBeDefined();
      expect(user.user.role).toBe("user");
    });
  });
});
