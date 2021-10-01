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
