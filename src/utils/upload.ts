import { upload } from "./multer";
import dotenv from "dotenv";
import { ApiError } from "./ApiError";
import path from "path";

import cloudinary from "cloudinary";
import { Request, Response, NextFunction } from "express";
import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, __dirname);
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   },
// });

export interface IUploadImage {
  uploadSingleImage(
    file: string,
    folder: any
  ): Promise<{
    url: string;
    id: string;
    width: any;
    height: any;
    format: any;
    secure_url: any;
  }>;
}

export class UploadImages implements IUploadImage {
  private uploader = cloudinary.v2.uploader;

  constructor() {
    dotenv.config();
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: `${process.env.CLOUDINARY_API_KEY}`,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  public uploadSingleImage(
    file: string,
    folder: any
  ): Promise<{
    url: string;
    id: string;
    width: any;
    height: any;
    format: any;
    secure_url: any;
  }> {
    return new Promise((resolve) => {
      cloudinary.v2.uploader.upload(
        file,
        { folder: folder },
        (error, result: any) => {
          if (error) {
            console.log(error);
          }
          console.log(result);
          resolve({
            url: result.url,
            id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            secure_url: result.secure_url,
          });
        }
      );
    });
  }
}

// export const uploads = (file: any, folder: any) => {
//   return new Promise((resolve) => {
//     cloudinary.v2.uploader.upload(
//       file,
//       { folder: folder },
//       (error, result: any) => {
//         if (error) {
//           console.log(error);
//         }
//         console.log(result);
//         resolve({
//           url: result.url,
//           id: result.public_id,
//         });
//       }
//     );
//   });
// };
