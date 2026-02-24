import bcrypt from "bcrypt";
import userModel from "../models/user.model";

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

  const user = await userModel.findById(createdUser._id);

  return user;
};
