import { UserModel } from "./../../src/models/user/UserSchema";
import { User } from "../../src/models/user/User";
import {
  IUserRepository,
  UserRepository,
} from "../../src/repositories/UserRepository";
import { configureDB } from "../../src/utils/configureDB";
import UserService from "../../src/services/UserService";

// jest.mock("../../src/repositories/UserRepository",{})
// const user = new User("ahmeddd", "test@test.com", "123123", "123");
// let userRepo = new UserService();
describe("test testing", () => {});

// describe('When data is valid', () => {
//     beforeAll(() => {
//         WorldModel.find = jest.fn().mockResolvedValue([{
//                 _id: '5dbff32e367a343830cd2f49',
//                 name: 'Earth',
//                 __v: 0
//             },
//             {
//                 _id: '5dbff89209dee20b18091ec3',
//                 name: 'Mars',
//                 __v: 0
//             },
//         ])
//     });

//     it('Should return entries', async () => {
//         const worldService = new WorldService(WorldModel);

//         const expected = [{
//                 _id: '5dbff32e367a343830cd2f49',
//                 name: 'Earth',
//                 __v: 0
//             },
//             {
//                 _id: '5dbff89209dee20b18091ec3',
//                 name: 'Mars',
//                 __v: 0
//             },
//         ];
//         await expect(worldService.getWorlds()).resolves.toEqual(expected);
//     });

// export default class WorldService {
//     constructor (worldModel) {
//         this.worldModel = worldModel;
//     }

//     async getWorlds () {
//         let resData = {};

//         try {
//             resData = await this.worldModel.find({});
//         } catch (e) {
//             console.log('Error occured in getWorlds', e);
//         }

//         return resData;
//     }
// }
