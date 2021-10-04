import { express } from "express";

declare global {
  declare namespace Express {
    interface Request {
      user: {
        _id: string;
      };
    }
  }
}
