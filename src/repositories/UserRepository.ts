import { Model } from "mongoose";
import { User } from "../models/user/User";
import { UserModel, userType } from "../models/user/UserSchema";
import { BaseRepository } from "./BaseRepository";

export interface IUserRepository extends BaseRepository<User, userType> {
  findByEmail(email: string): Promise<User | undefined>;
}

export class UserRepository
  extends BaseRepository<User, userType>
  implements IUserRepository
{
  constructor(model: Model<userType> = UserModel) {
    super(model);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const model = await this._model.find({ email });
    if (!model.length) {
      return undefined;
    }
    return this.toEntity(model[0]);
  }

  protected toEntity(item: userType): User {
    console.log(item);
    const { name, email, password, age, photo, createdAt, _id } = item;
    return new User(name, email, password, age, photo, createdAt, _id);
  }
}
