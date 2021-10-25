import { ObjectId } from "mongoose";
import { User } from "../models/user/User";
import {
  IUserRepository,
  UserRepository,
} from "./../repositories/UserRepository";

export interface IUserServices {
  findAll(): Promise<User[]>;
  find(item: any): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  save(item: User): Promise<User>;
  update(id: ObjectId, item: User): Promise<User | undefined>;
  delete(id: string): void;
  findByEmail(email: string): Promise<User | undefined>;
  resetPassword(user: User): string;
  findOne(item: any): Promise<User | undefined>;
  updateOne(id: ObjectId, item: User): Promise<User | undefined>;
  // saveUser(data: any, searchedItems: any): Promise<User | undefined>;
}
export default class UserService implements IUserServices {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  findOne(item: any): Promise<User | undefined> {
    return this.userRepository.findOne(item);
  }
  // public async saveUser(data: any): Promise<User | undefined> {
  //   return this.userRepository.saveUser(data);
  // }

  resetPassword(user: User): string {
    const resetPasswordToken = user.createPasswordResetToken();
    return resetPasswordToken;
  }
  public async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  public async find(item: any): Promise<User[]> {
    return await this.userRepository.find(item);
  }
  public async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findById(id);
  }
  public async save(item: User): Promise<User> {
    const res = await this.userRepository.save(item);

    return res;
  }

  public async update(id: ObjectId, item: User): Promise<User | undefined> {
    return await this.userRepository.update(id, item);
  }

  public async delete(id: string): Promise<void> {
    return await this.userRepository.delete(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findByEmail(email);
  }

  public async updateOne(id: ObjectId, item: User): Promise<User | undefined> {
    return await this.userRepository.updateOne(id, item);
  }
}
