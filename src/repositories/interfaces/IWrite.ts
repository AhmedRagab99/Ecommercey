import { ObjectId } from "mongoose";
export interface IWrite<T> {
  save(item: T): Promise<T>;
  update(id: ObjectId, item: T): Promise<T | undefined>;
  delete(id: string): void;
}
