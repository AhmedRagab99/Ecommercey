import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError, errorHandler } from "../utils/ApiError";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    errorHandler(
      new ApiError("Cannot access please login!", 401),
      req,
      res,
      next
    );
  }
  const user = getUserFromToken(token ?? "", req, res, next);
  req.user = user;
  console.log(req.user._id);
  next();
};

const getUserFromToken = (
  token: string,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  try {
    // token Should be in this format: 'Bearer ' + token
    token = token.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    // Token is invalid
    errorHandler(
      new ApiError("Cannot access please login!", 401),
      req,
      res,
      next
    );
  }
};
