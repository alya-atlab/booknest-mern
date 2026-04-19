import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import { generateJWT } from "../utils/generateToken";
import { ApiError } from "../utils/ApiError";
interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
}: RegisterUserInput) => {
  email = email.trim().toLowerCase();
  password = password.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();
  if (!email || !password || !firstName || !lastName) {
    throw new ApiError(
      "Email, password, first name and last name are required",
      400,
    );
  }
  if (!email.includes("@") || !email.includes(".")) {
    throw new ApiError("Invalid email format", 400);
  }
  if (password.length < 6) {
    throw new ApiError("Password must be at least 6 characters", 400);
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError("Email already registered", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  const userId = createdUser._id.toString();
  const token = generateJWT({
    userId,
    role: createdUser.role,
  });
  return {
    token,
    user: { id: userId, role: createdUser.role },
  };
};

interface LoginUserInput {
  email: string;
  password: string;
}
export const loginUser = async ({ email, password }: LoginUserInput) => {
  email = email.trim().toLowerCase();
  password = password.trim();

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const findUser = await userModel
    .findOne({ email: email })
    .select("+password");
  if (!findUser) {
    throw new ApiError("Invalid email or password", 401);
  }
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    throw new ApiError("Invalid email or password", 401);
  }
  const userId = findUser._id.toString();
  const token = generateJWT({
    userId,
    role: findUser.role,
  });
  return {
    token,
    user: { id: userId, role: findUser.role },
  };
};
