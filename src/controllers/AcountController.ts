import { Application, NextFunction, Request, Response, Router } from "express";
import { authorize } from "../middleware/authhandler";

import { User } from "../models/user/User";
import UserService from "../services/UserService";
import { ApiError, errorHandler } from "../utils/ApiError";
import { validateLoginInputs, validateRegistraionInputs } from "../validation";
import { IController } from "./interfaces/IController";

export default class AccountController implements IController {
  private userService: UserService = new UserService();
  register(app: Application): void {
    const router = Router();
    router.post("/register", this.registerUser.bind(this));
    router.post("/login", this.userLogin.bind(this));
    router.get("/test", authorize, this.testToken.bind(this));

    app.use("/user", router);
  }

  private async registerUser(req: Request, res: Response, next: NextFunction) {
    const { errors } = validateRegistraionInputs(req.body);
    if (errors) {
      let error = new ApiError("Invalid inputs", 400, errors);
      res.json(error);
    }
    const { name, email, password, age } = req.body;

    const user: User = new User(name, email, password, age);
    const hashedPassword = await user.hashPasswords();
    console.log(hashedPassword);
    //   console.log(user);
    user.password = hashedPassword;

    if (await this.userService.findByEmail(email)) {
      const test = new ApiError("Invalid Input", 400, {
        email: "Email already exists",
      });
      res.json(test);
    } else {
      await this.userService.create(user);
      res.status(201).json({ user });
    }
  }

  private async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { errors } = validateLoginInputs(req.body);
      if (errors) {
        let err = new ApiError("Invalid email or password", 400, errors);
        errorHandler(err, req, res, next);
      }

      const { email, password } = req.body;

      const user = await this.userService.findByEmail(email);
      // console.log("userrrrrrrrr" + "     " + user?.email);

      // console.log(user);
      if (!user) {
        let err = new ApiError("cannot find that user with this email ", 400);
        errorHandler(err, req, res, next);
      }
      console.log(user?.password);

      const checkPassword = await user?.validatePasswords(password);
      console.log(checkPassword);
      if (checkPassword === false) {
        let err = new ApiError("Invalid email or password", 400, errors);
        errorHandler(err, req, res, next);
      }

      const token = user?.generateAuthenticationToken();
      console.log("token" + token);

      res.status(200).json({
        user: {
          name: user?.name,
          email: user?.email,
          age: user?.age,
          photo: user?.photo ?? "",
          creteadAt: user?.createdAt,
          token: token,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async testToken(req: Request, res: Response, next: NextFunction) {
    let authUser = req.user;
    let user = await this.userService.findById(authUser._id);

    res.send({
      test: "success to access ",
      user,
      // req.user as any
    });
  }
}
