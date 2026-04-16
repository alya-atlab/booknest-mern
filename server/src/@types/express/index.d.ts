declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: "admin" | "author" | "user";
      };
    }
  }
}
export {};
