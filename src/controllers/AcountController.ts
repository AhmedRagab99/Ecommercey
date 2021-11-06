import { IUploadImage, UploadImages } from "./../utils/upload";
import { ObjectId } from "mongoose";
import { sendEmail } from "./../utils/email";
import { IUserServices } from "./../services/UserService";
import { Application, NextFunction, Request, Response, Router } from "express";
import { authorize } from "../middleware/authhandler";

import { User } from "../models/user/User";
import UserService from "../services/UserService";
import { ApiError, errorHandler } from "../utils/ApiError";

import { validateLoginInputs, validateRegistraionInputs } from "../validation";
import { IController } from "./interfaces/IController";
import { encryptValue } from "../utils/helperfunctions";
import { UserModel } from "../models/user/UserSchema";
import { upload } from "../utils/multer";

import "../services/SocialAuthService";
import passport from "passport";
import SocialMediaAuthStrategy, {
  IAuthStrateegy,
} from "../services/SocialAuthService";
// import { uploads } from "../utils/upload";
export default class AccountController implements IController {
  private userService: IUserServices;
  private uploadImages: IUploadImage;
  private authStrategy: IAuthStrateegy;

  constructor(
    userService: IUserServices = new UserService(),
    uploadImage: IUploadImage = new UploadImages(),
    googleStrategy: IAuthStrateegy = new SocialMediaAuthStrategy(userService)
  ) {
    this.userService = userService;
    this.uploadImages = uploadImage;
    this.authStrategy = googleStrategy;
    this.authStrategy.facebookSetup();
    this.authStrategy.googleSetup();
  }

  register(app: Application): void {
    const router = Router();
    // facebook routes for testing
    router.get("/face", (req, res) => {
      res.send('<a href = "/user/auth/facebook">Auth with facebook </a>');
    });
    router.get(
      "/auth/facebook",
      passport.authenticate("facebook", { scope: ["email"] })
    );

    router.get(
      "/facebook/callback",
      passport.authenticate("facebook", {
        successRedirect: "/user/face/protected",
        failureRedirect: "/user/face/failure",
      })
    );

    router.get("/face/failure", (req, res) => {
      res.send("facebook something was wrong");
    });

    router.get("/face/protected", this.isLoggedIn || authorize, (req, res) => {
      res.send("facebook succes");
    });

    // google routes for testing
    router.get("/", (req, res) => {
      res.send(
        '<a href = "/user/auth/google">Auth with google </a><br/><a href = "/user/auth/facebook">Auth with facebook </a>'
      );
    });
    router.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["email", "profile"] })
    );

    router.get(
      "/google/callback",
      passport.authenticate("google", {
        successRedirect: "/user/protected",
        failureRedirect: "/user/failure",
      })
    );

    router.get("/failure", (req, res) => {
      res.send("something was wrong");
    });

    router.get("/protected", this.isLoggedIn || authorize, (req, res) => {
      res.send("google succes");
    });

    router.get("/logout", this.logOut.bind(this));

    router.post("/register", this.registerUser.bind(this));
    router.post("/login", this.userLogin.bind(this));
    router.get("/test", authorize, this.testToken.bind(this));

    router.post("/forgot-password", this.forgetPassword.bind(this));
    router.post(
      "/upload",
      upload.single("image"),
      authorize,
      this.uploadImage.bind(this)
    );
    router.patch("/reset-password/:token", this.resetPassword.bind(this));

    app.use("/user", router);
  }

  private logOut(req: Request, res: Response, next: NextFunction) {
    req.logout();
    res.redirect("/user");
  }

  private isLoggedIn(req: Request, res: Response, next: NextFunction) {
    req.user ? next() : res.sendStatus(401);
  }
  private async registerUser(req: Request, res: Response, next: NextFunction) {
    const { errors } = validateRegistraionInputs(req.body);
    if (errors) {
      let error = new ApiError("Invalid inputs", 400, errors);
      res.json(error);
    }

    const { name, email, password, age } = req.body;
    const user: User = new User(name, email, age, password);

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
      res.status(201).json("Success register user");
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
        },
        token,
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const uploader = async (path: any) =>
        await this.uploadImages.uploadSingleImage(path, "images/profiles");

      const filePath = req.file?.path;
      console.log(req.file);
      const result = await uploader(
        filePath ??
          "/Users/ahmedragab/Desktop/Ecommercey/src/utils/2021-10-25T22:41:23.602Z-test.png"
      );

      const user: any = req.user;
      const newUser = await this.userService.findById(user._id);
      if (newUser) {
        console.log(newUser);
        newUser.photo = result.secure_url;
        await this.userService.updateOne(user._id, newUser);
      }

      console.log(result);
      res.status(200).json({
        message: "images uploaded successfully",
        data: result,
      });
    } catch (err) {
      let error = new ApiError("Cannot upload image!", 500, { body: err });
      errorHandler(error, req, res, next);
    }
  }

  private async testToken(req: Request, res: Response, next: NextFunction) {
    let authUser: any = req.user;
    let user = await this.userService.findById(authUser._id);

    res.send({
      test: "success to access ",
      user,
      // req.user as any
    });
  }

  private async forgetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await this.userService.findByEmail(req.body.email);
    if (!user) {
      let err = new ApiError("cannot find that user with this email ", 400);
      errorHandler(err, req, res, next);
    }

    this.userService.resetPassword(user!);

    await this.userService.update(user?._id!, user!);

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/user/reset-password/${user?.passwordResetToken}`;
    const message = `forgot your password! click on this link to confirm forgot  your password: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user?.email,
        subject: "Your password reset token valid for 10 minuts",
        message,
      });
      res.status(200).json({
        status: "success",
        body: "Token sent to email",
      });
    } catch (err) {
      user!.passwordResetToken = undefined;
      user!.passwordResetTokenExpiryDate = undefined;

      await this.userService.update(user?._id!, user!);
      let error = new ApiError(`${err}`, 500);
      errorHandler(error, req, res, next);
    }
  }

  private async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(hashedToken);
      const newdate = new Date(Date.now());

      const user = await this.userService.find({
        passwordResetToken: req.params.token,
        // passwordResetTokenExpiryDate: { $gte: date },
      });
      const tempexpiry = user[0].passwordResetTokenExpiryDate;

      if (!user || tempexpiry!.getTime() < newdate.getTime()) {
        let err = new ApiError("Token is invalid or has expired", 400, {
          body: "Token is invalid or has expired",
        });
        errorHandler(err, req, res, next);
      }
      const currentuser = user[0]!;
      console.log(user);
      currentuser.password = req.body.password;
      currentuser.password = await currentuser.hashPasswords();
      currentuser.passwordResetToken = undefined;
      currentuser.passwordResetTokenExpiryDate = undefined;
      // this.userService.save(user[0]!);

      console.log(user);

      await this.userService.update(currentuser._id!, currentuser);

      currentuser.password = "";
      res.status(200).json({ user: currentuser });
    } catch (error) {
      console.log(error);
      let err = new ApiError("Token is invalid or has expired", 400, {
        body: error,
      });
      errorHandler(err, req, res, next);
    }
  }
}
