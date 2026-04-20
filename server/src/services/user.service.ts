import { Types } from "mongoose";
import userModel from "../models/user.model";
import { ApiError } from "../utils/ApiError";

export const getUsers = async () => {
  return userModel.find();
};
export const getUserById = async (userId: Types.ObjectId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new ApiError("User Not Found", 404);
  }
  return user;
};
interface userUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}
export const updateUser = async (
  userId: Types.ObjectId,
  cleanData: Partial<userUpdateInput>,
) => {
  const allowedFields = ["firstName", "lastName", "email"];

  const filteredData: Partial<userUpdateInput> = {};

  for (const key of allowedFields) {
    if (cleanData[key as keyof userUpdateInput] !== undefined) {
      filteredData[key as keyof userUpdateInput] =
        cleanData[key as keyof userUpdateInput];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new ApiError("No data to update", 400);
  }

  if (filteredData.firstName !== undefined) {
    if (typeof filteredData.firstName !== "string") {
      throw new ApiError("First name must be string", 400);
    }
    filteredData.firstName = filteredData.firstName.trim();
    if (!filteredData.firstName) {
      throw new ApiError("First name cannot be empty", 400);
    }
  }

  if (filteredData.lastName !== undefined) {
    if (typeof filteredData.lastName !== "string") {
      throw new ApiError("Last name must be string", 400);
    }
    filteredData.lastName = filteredData.lastName.trim();
    if (!filteredData.lastName) {
      throw new ApiError("Last name cannot be empty", 400);
    }
  }

  if (filteredData.email !== undefined) {
    if (typeof filteredData.email !== "string") {
      throw new ApiError("Email must be string", 400);
    }

    filteredData.email = filteredData.email.trim().toLowerCase();

    if (!filteredData.email) {
      throw new ApiError("Email cannot be empty", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(filteredData.email)) {
      throw new ApiError("Invalid email format", 400);
    }

    const existingUser = await userModel.findOne({
      email: filteredData.email,
    });

    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new ApiError("Email already registered", 400);
    }
  }

  const user = await userModel.findById(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  Object.assign(user, filteredData);

  await user.save();

  return user;
};