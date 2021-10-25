import { Application, Router } from "express";
import { IController } from "./interfaces/IController";
export default class UserController implements IController {
  register(app: Application): void {
    const router = Router();

    app.use(router);
  }
}
