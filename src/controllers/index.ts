import AccountController from "./AcountController";
import { IController } from "./interfaces/IController";
import UserController from "./UserController";

const controllers: IController[] = [new AccountController()];
export default controllers;
