import { ApiError } from "../utils/ApiError";

export const validateName = (value: unknown, field: string): string => {
  if (typeof value !== "string") {
    throw new ApiError(`${field} must be a string`, 400);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ApiError(`${field} cannot be empty`, 400);
  }
  return trimmed;
};
export const validateEmail = (email: unknown):string => {
  if (typeof email !== "string") {
    throw new ApiError("Email must be a string", 400);
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new ApiError("Email cannot be empty", 400);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new ApiError("Invalid email format", 400);
  }
  return normalizedEmail;
};
