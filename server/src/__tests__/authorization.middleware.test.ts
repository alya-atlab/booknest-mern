import "dotenv/config";
import { Request, Response } from "express";
import { authorizeRoles } from "../middlewares/authorization.middleware";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";
import { generateJWT } from "../utils/generateToken";
import protect from "../middlewares/auth.middleware";
const createMockMiddlewareContext = (header = {}) => {
  const req = {
    headers: header,
  } as Request;

  const res = {} as Response;

  const next = jest.fn();

  return { req, res, next };
};
const getNextError = (next: jest.Mock) => next.mock.calls[0][0];

describe("authorization middleware", () => {
  it("should throw error if user is unauthorized", () => {
    const { req, res, next } = createMockMiddlewareContext();
    const middleware = authorizeRoles("admin");
    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = getNextError(next);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Unauthorized");
  });
  it("should throw error if user role is not authorized", () => {
    const userId = new Types.ObjectId().toString();
    const token = generateJWT({
      userId,
      role: "user",
    });
    const { req, res, next } = createMockMiddlewareContext({
      authorization: `Bearer ${token}`,
    });
    protect(req, res, next);
    const middleware = authorizeRoles("admin");
    next.mockClear();
    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = getNextError(next);
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Forbidden");
  });
  it("should attach user to request and call next for valid role", () => {
    const userId = new Types.ObjectId().toString();
    const token = generateJWT({
      userId,
      role: "author",
    });
    const { req, res, next } = createMockMiddlewareContext({
      authorization: `Bearer ${token}`,
    });
    protect(req, res, next);
    const middleware = authorizeRoles("admin", "author");
    next.mockClear();
    middleware(req, res, next);
    expect(req.user?.role).toBe("author");
    expect(next).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
