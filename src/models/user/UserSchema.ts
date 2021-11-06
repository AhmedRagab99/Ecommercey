import { string } from "joi";
import { model, Model, Schema } from "mongoose";
import { convertToLocalTimeormat } from "../../utils/helperfunctions";
import { UserDTO } from "./UserDTO";

export type userType = UserDTO & Document;
const userSchema = new Schema(
  {
    name: { type: String, required: true, min: 5, max: 100, trim: true },
    oAuthId: { type: String, min: 4, default: "" },
    oAuthToken: { type: String, min: 4 },
    email: {
      type: String,
      required: true,

      min: 5,
      max: 1000,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 100,
      default: " ",
    },
    age: { type: Number, required: true, min: 2, max: 100, default: 18 },
    photo: {
      type: String,
      default:
        "https://tse2.mm.bing.net/th?id=OIP.PB3QCTk1kCZZ6ZvvVqpM5gHaHa&pid=Api&P=0&w=300&h=300",
    },
    createdAt: {
      type: String,
      default: convertToLocalTimeormat(Date.now()),
    },
    passwordResetToken: String,
    passwordResetTokenExpiryDate: Date,
  }
  // { strict: false }
);

export const UserModel: Model<userType> = model<userType>("User", userSchema);
