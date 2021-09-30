import mongoose from "mongoose";
export class configureDB {
  constructor() {}

  public configure() {
    const url = process.env.MONGOURI || "mongodb://127.0.0.1:27017/ecommercy";
    mongoose.connect(url, (error) => {
      if (error) {
        console.log(`failed to connect with error ${error.message}`);
        return;
      }
      console.log(`conneced to db  at ${url}`);
    });
  }
}
