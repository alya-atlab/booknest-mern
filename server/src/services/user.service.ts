import { Types } from "mongoose";
import userModel from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { validateEmail, validateName } from "../validators/user.validator";

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
  const user = await userModel.findById(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }
  const allowedFields: (keyof userUpdateInput)[] = [
    "firstName",
    "lastName",
    "email",
  ];

  const filteredData: Partial<userUpdateInput> = {};

  for (const key of allowedFields) {
    if (cleanData[key] !== undefined) {
      filteredData[key] = cleanData[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new ApiError("No data to update", 400);
  }

  if (filteredData.firstName !== undefined) {
    filteredData.firstName = validateName(filteredData.firstName, "First Name");
  }

  if (filteredData.lastName !== undefined) {
    filteredData.lastName = validateName(filteredData.lastName, "Last Name");
  }

  if (filteredData.email !== undefined) {
    filteredData.email = validateEmail(filteredData.email);
    const currentEmail = user.email.trim().toLowerCase();
    if (filteredData.email !== currentEmail) {
      const existingUser = await userModel.findOne({
        email: filteredData.email,
      });

      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        throw new ApiError("Email already registered", 400);
      }
    }
  }

  Object.assign(user, filteredData);

  await user.save();

  return user;
};
