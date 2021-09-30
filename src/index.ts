import Server from "./Server";

const server: Server = new Server();
export const app = server.startServer();

// import express, { Application, json, urlencoded } from "express";

// import { Connection, connect, Schema } from "mongoose";
// import mongoose from "mongoose";
// const app: Application = express();

// app.use(json());
// app.use(urlencoded());

// const url = process.env.MONGOURI || "mongodb://127.0.0.1:27017/ecommercy";
// mongoose.connect(url, () => {
//   console.log("conneced to db name");
// });

// const userSchema = new Schema({
//   name: { type: String },
//   email: { type: String },
// });

// export const UserModel = mongoose.model("User", userSchema);

// app.get("/", async (req, res) => {
//   await new UserModel({ name: "ahmed ", email: "test@test.com " }).save();
//   const users = await UserModel.find();
//   console.log(users);
//   res.send(users);
// });
// app.listen(5000, () => {
//   console.log("ahmed ragab the best one ");
// });
