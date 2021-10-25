import { User } from "./../models/user/User";
import nodemailer from "nodemailer";
export const sendEmail = async (options: any) => {
  const connection = {
    host: process.env.EMAIL_HOST as string,
    port: process.env.EMAIL_PORT,
  };
  const transporter = nodemailer.createTransport({
    host: connection.host,
    port: Number(connection.port),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Ecommercy team <hello@ecommercy.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  await transporter.sendMail(mailOptions);
};
