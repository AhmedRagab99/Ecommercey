import joi from "joi";

export function toErrorBody(errors: joi.ValidationError): object {
  const errorbody: any = {};
  errors.details.forEach((err) => {
    errorbody[(err.path[0] = err.message)];
  });
  return errorbody;
}
