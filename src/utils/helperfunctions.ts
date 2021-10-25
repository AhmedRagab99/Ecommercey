import bcrypt from "bcryptjs";
import moment from "moment";
import crypto from "crypto";

export async function hash(
  dataToHash: any,
  saltNumber: number = 10
): Promise<string> {
  const salt = await bcrypt.genSalt(saltNumber);
  const hashedVal = await bcrypt.hash(dataToHash, salt);
  return hashedVal;
}

export async function compareHashedValue(
  data: any,
  dataEncrypted: string
): Promise<boolean> {
  const compareResult = await bcrypt.compare(data, dataEncrypted);
  return compareResult;
}

export function convertToLocalTimeormat(date: any): string {
  const FORMAT = "YYYY ddd MMM DD HH:mm";
  const resDate = moment(date).format("LLLL");
  return resDate;
}

export function encryptValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
