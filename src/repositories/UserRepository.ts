import { Model } from "mongoose";
import { User } from "../models/user/User";
import { UserModel, userType } from "../models/user/UserSchema";
import { BaseRepository } from "./BaseRepository";

export interface IUserRepository extends BaseRepository<User, userType> {
  findByEmail(email: string): Promise<User | undefined>;
  // saveUser(data: any): Promise<User | undefined>;
}

export class UserRepository
  extends BaseRepository<User, userType>
  implements IUserRepository
{
  constructor(model: Model<userType> = UserModel) {
    super(model);
  }
  // public async saveUser(data: any): Promise<User | undefined> {
  //   await this.findOne(data).then(res=>{ })
  // }

  public async findByEmail(email: string): Promise<User | undefined> {
    const model = await this._model.findOne({ email });
    if (!model) {
      return undefined;
    }
    console.log(model.password);
    return this.toEntity(model);
  }

  protected toEntity(item: userType): User {
    const {
      name,
      email,
      password,
      age,
      photo,
      createdAt,
      _id,
      passwordResetToken,
      passwordResetTokenExpiryDate,
    } = item;
    const newUser = new User(
      name,
      email,
      password,
      age,
      photo,
      createdAt,
      _id,
      passwordResetToken,
      passwordResetTokenExpiryDate
    );
    // console.log(newUser);
    return newUser;
  }
}
