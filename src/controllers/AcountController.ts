import { Application, Request, Response, Router } from "express";
import { User } from "../models/user/User";
import UserService from "../services/UserService";
import { ApiError } from "../utils/ApiError";
import { convertToLocalTimeormat } from "../utils/helperfunctions";
import { IController } from "./interfaces/IController";

export default class AccountController implements IController {
  private userService: UserService = new UserService();
  register(app: Application): void {
    const router = Router();
    router.post("/register", this.registerUser.bind(this));
    app.use("/user", router);
  }

  private async registerUser(req: Request, res: Response) {
    const { name, email, password, age } = req.body;

    const user: User = new User(name, email, password, age);
    //   console.log(user);

    if (await this.userService.findByEmail(email)) {
      const test = new ApiError("Invalid Input", 400, {
        email: "Email already exists",
      });
      res.json(test);
    } else {
      await this.userService.create(user);
      res.status(201).json({ success: true });
    }
  }
}
