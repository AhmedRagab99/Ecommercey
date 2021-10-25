import { Document, ObjectId } from "mongoose";

export interface UserDTO {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  age: number;
  photo?: string;
  createdAt?: string;
  passwordResetToken?: String;
  passwordResetTokenExpiryDate?: Date;
}
