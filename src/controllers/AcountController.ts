import { Application, Request, Response, Router } from "express";
import { authorize } from "../middleware/authhandler";
import { User } from "../models/user/User";
import UserService from "../services/UserService";
import { ApiError } from "../utils/ApiError";
import { convertToLocalTimeormat } from "../utils/helperfunctions";
import { validateLoginInputs, validateRegistraionInputs } from "../validation";
import { IController } from "./interfaces/IController";

export default class AccountController implements IController {
  private userService: UserService = new UserService();
  register(app: Application): void {
    const router = Router();
    router.post("/register", this.registerUser.bind(this));
    router.post("/login", this.userLogin.bind(this));

    app.use("/user", router);
  }

  private async registerUser(req: Request, res: Response) {
    const { errors } = validateRegistraionInputs(req.body);
    if (errors) {
      throw new ApiError("Invalid inputs", 400, errors);
    }
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

  private async userLogin(req: Request, res: Response) {
    const { errors } = validateLoginInputs(req.body);
    if (errors) {
      throw new ApiError("Invalid email or password", 400, errors);
    }

    const user = await this.userService.findByEmail(req.body.email);
    if (!user) {
      throw new ApiError("Invalid email or password", 400, errors);
    }

    const checkPassword = await user.validatePasswords(req.body.password);
    if (checkPassword === false) {
      throw new ApiError("Invalid email or password", 400, errors);
    }

    const token = user.generateAuthenticationToken();

    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        photo: user.photo ?? "",
        creteadAt: user.createdAt,
        token: token,
      },
    });
  }
}
