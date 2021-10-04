import { Request, Response, NextFunction } from "express";
export class ApiError extends Error {
  constructor(
    public _message?: string,
    public status: number = 500,
    public body?: object
  ) {
    super(_message || "Internal Error from server");
    this.name = this.constructor.name;
  }
}

export function errorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: log using logger
  console.log(error);

  if (!error.status) {
    error = new ApiError();
  }
  res
    .status(error.status)
    .json({ message: error.message, status: error.status, body: error.body });
}
