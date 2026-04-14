import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import { generateJWT } from "../utils/generateToken";
interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const registerUser = async (data: RegisterUserInput) => {
  const existingUser = await userModel.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("Email already registered");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const createdUser = await userModel.create({
    ...data,
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
export const loginUser = async (data: LoginUserInput) => {
  const findUser = await userModel
    .findOne({ email: data.email })
    .select("+password");
  if (!findUser) {
    throw new Error("Invalid email or password");
  }
  const passwordMatch = await bcrypt.compare(data.password, findUser.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
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
