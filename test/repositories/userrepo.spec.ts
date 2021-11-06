import { UserModel, userType } from "./../../src/models/user/UserSchema";
import { User } from "../../src/models/user/User";
import {
  IUserRepository,
  UserRepository,
} from "../../src/repositories/UserRepository";
import { configureDB } from "../../src/utils/configureDB";
import UserService, { IUserServices } from "../../src/services/UserService";
import AccountController from "../../src/controllers/AcountController";
import { BaseRepository } from "../../src/repositories/BaseRepository";
import { fn } from "moment";

// jest.mock("../../src/repositories/UserRepository",{})
// const user = new User("ahmeddd", "test@test.com", "123123", "123");
// let userRepo = new UserService();

describe("test testing", () => {
  // let controller = new UserRepository().create(
  //   new User("ahmeddd", "test@test.com", "123123", 123)
  // );
  let userRepo: IUserRepository;
  let testUser: User;
  beforeEach(() => {
    testUser = new User("ahmed", "test@test.com", "123123", 12);

    jest.mock("../../src/repositories/UserRepository", () => {
      create: jest.spyOn(userRepo, "create").mockImplementation((test) => {
        return Promise.resolve(test);
      });
    });
    userRepo = new UserRepository();

    // jest.spyOn(userRepo, "create").mockImplementation((test) => {
    //   return Promise.resolve(test);
    // });
    // userRepo.create = jest.fn((test) => {
    //   return Promise.resolve(test);
    // });
  });

  it("test create function ", async () => {
    const res = await userRepo.create(testUser);
    expect(res?.name).toBe("ahmed");
  });

  // beforeAll(() => {
  //   controller.create = jest.fn().mockReturnValueOnce(() => {
  //     new User("ahmeddd", "test@test.com", "123123", 123);
  //   });
  // });
  // beforeEach(() => {
  //   controller = new UserRepository();
  // });
  test("test thindgs", async () => {
    // let rs = await controller.create;
    // console.log(rs);
  });
});

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
