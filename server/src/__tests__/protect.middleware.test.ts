import "dotenv/config";
import protect from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { generateJWT } from "../utils/generateToken";
import { Types } from "mongoose";

const createMockMiddlewareContext = (header = {}) => {
  const req = {
    headers: header,
  } as Request;

  const res = {} as Response;

  const next = jest.fn();

  return { req, res, next };
};
const getNextError = (next: jest.Mock) => next.mock.calls[0][0];

describe("protect middleware", () => {
  it("should throw error if authorization header was not provided", () => {
    const { req, res, next } = createMockMiddlewareContext();
    protect(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = getNextError(next);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("authorization header was not provided");
  });
  it("should throw error if authorization header format is invalid", () => {
    const { req, res, next } = createMockMiddlewareContext({
      authorization: "Bearer",
    });
    protect(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    const error = getNextError(next);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Unauthorized");
  });
  it("should throw error if token is invalid", () => {
    const { req, res, next } = createMockMiddlewareContext({
      authorization: "Bearer invalid-token",
    });
    protect(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = getNextError(next);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Invalid Token");
  });
  it("should attach user to request and call next for valid token", () => {
    const userId = new Types.ObjectId().toString();
    const token = generateJWT({
      userId,
      role: "user",
    });
    const { req, res, next } = createMockMiddlewareContext({
      authorization: `Bearer ${token}`,
    });
    protect(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user?._id).toBe(userId);
    expect(req.user?.role).toBe("user");
  });
});
