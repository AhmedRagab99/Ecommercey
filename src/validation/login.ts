import joi from "joi";
import { toErrorBody } from "./ErrorBody";

export function validateLoginInputs(inputs: any) {
  const loginInputsSchema = joi.object({
    email: joi.string().email(),
    password: joi.string().min(5).max(100),
  });

  const { error } = loginInputsSchema.validate(inputs, {
    abortEarly: false,
    presence: "required",
  });

  return { errors: error ? toErrorBody(error) : undefined };
}
