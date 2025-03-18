import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

const secret = "mending-mind-admin-panel";

interface ErrorResponse {
  Status: string;
  Error: {
    message: string;
    name: string;
    code: string;
  };
}

const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      typeof req.headers["accesstoken"] === "string"
        ? req.headers
        : undefined;

    if (!token) {
      const errorResponse: ErrorResponse = {
        Status: "failure",
        Error: {
          message: "Unauthorized. No token provided.",
          name: "AuthenticationError",
          code: "EX-00103",
        },
      };
      res.status(405).json(errorResponse);
      return;
    }

    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== "string" && "id" in decoded) {
      req.user_Id = decoded.id;
    }
    next();
  } catch (error) {
    const errorResponse: ErrorResponse = {
      Status: "failure",
      Error: {
        message: "Invalid or expired token.",
        name: "AuthenticationError",
        code: "EX-00105",
      },
    };
    res.status(405).json(errorResponse);
  }
};

export default auth;
