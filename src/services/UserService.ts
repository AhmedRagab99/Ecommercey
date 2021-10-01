import { User } from "../models/user/User";
import {
  IUserRepository,
  UserRepository,
} from "./../repositories/UserRepository";
export default class UserService {
  private userRepository: IUserRepository = new UserRepository();

  public async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  public async find(item: any): Promise<User[]> {
    return await this.userRepository.find(item);
  }
  public async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findById(id);
  }
  public async create(item: User): Promise<User> {
    const res = await this.userRepository.create(item);
    // console.log(res);
    return res;
  }

  public async update(id: string, item: User): Promise<User | undefined> {
    return await this.userRepository.update(id, item);
  }
  public async delete(id: string): Promise<void> {
    return await this.userRepository.delete(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findByEmail(email);
  }
}
