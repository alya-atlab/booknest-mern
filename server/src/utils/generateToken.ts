import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: "admin" | "author" | "user";
}

export const generateJWT = (payload: JwtPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
