import Joi from "joi";
import joi from "joi";
import { toErrorBody } from "./ErrorBody";
export function validateRegistraionInputs(input: any) {
  const registrationInputSchema = joi.object({
    name: joi.string().min(5).max(100),
    email: joi.string().min(5).max(100).email(),
    password: joi.string().min(5).max(100),
    age: joi.number().min(1).max(100),
  });

  const { error } = registrationInputSchema.validate(input, {
    abortEarly: false,
    presence: "required",
  });

  return { errors: error ? toErrorBody(error) : undefined };
}
