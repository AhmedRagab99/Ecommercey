import { Document, ObjectId } from "mongoose";

export interface UserDTO {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  age: string;
  photo?: string;
  createdAt?: string;
}
