import { compareHashedValue, hash } from "../../utils/helperfunctions";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import crypto from "crypto";
export class User {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public age: number,
    public photo?: string,
    public createdAt?: string,
    public _id?: ObjectId,
    public passwordResetToken?: String,
    public passwordResetTokenExpiryDate?: Date
  ) {}

  public async hashPasswords(): Promise<string> {
    return await hash(this.password);
  }

  public async validatePasswords(password: string): Promise<boolean> {
    return await compareHashedValue(password, this.password);
  }

  public createPasswordResetToken = (): string => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    console.log(this.passwordResetToken);

    this.passwordResetTokenExpiryDate = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
  };

  public generateAuthenticationToken(): string {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRY_DATE }
    );
  }
}
