import expressSession from "express-session";
import { configureDB } from "./utils/configureDB";
import express, { Application } from "express";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import controllers from "./controllers";
import { extend } from "joi";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy } from "passport-facebook";
import cloudinary from "cloudinary";
import session from "express-session";

export default class Server {
  private app: Application;
  private configureDB: configureDB;

  constructor() {
    this.app = express();
    this.configureDB = new configureDB();

    this.configServer();
  }

  public startServer(): Application {
    const PORT = process.env.PORT || 4000;
    const HOST = process.env.HOST || "http://localhost";

    this.configureDB.configure();

    this.app.listen(PORT, () => {
      console.log(`server is running on ${HOST}:${PORT} `);
    });
    return this.app;
  }

  private configServer() {
    this.startMiddlewares();
    this.registerControllers();
  }

  private startMiddlewares() {
    dotenv.config();
    this.app.use(express.json());
    this.app.use(express.urlencoded());
    this.app.use(session({ secret: "ecommercy" }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    // this.app.use(express.static(__dirname));

    // this.app.use(passport.initialize());
    // this.app.use(passport.session());
    // this.app.use(bodyParser.json());
    // this.app.use(bodyParser.urlencoded(extended:false));
    this.app.use(morgan("dev"));
    // this.app.use(cors());
  }

  private registerControllers(): void {
    controllers.forEach((controller) => controller.register(this.app));
  }
}
