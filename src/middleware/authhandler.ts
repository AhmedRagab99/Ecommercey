import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    throw new ApiError("Cannot access ", 401);
  }
  const user: any = getUserFromToken(token);
  req.user = user;
  next();
};

const getUserFromToken = (token: string): any => {
  try {
    // token Should be in this format: 'Bearer ' + token
    token = token.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    // Token is invalid
    throw new ApiError("Unauthenticated Access.", 401);
  }
};
