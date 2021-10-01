import { configureDB } from "./utils/configureDB";
import express, { Application } from "express";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
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
  }

  private startMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded());
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }
}
