import { ObjectId } from "mongoose";
export interface IWrite<T> {
  Save(item: any): Promise<T | undefined>;
  update(id: string, item: T): Promise<T | undefined>;
  delete(id: string): void;
  create(item: T): Promise<T>;
}
