import AccountController from "./AcountController";
import { IController } from "./interfaces/IController";

const controllers: IController[] = [new AccountController()];
export default controllers;
