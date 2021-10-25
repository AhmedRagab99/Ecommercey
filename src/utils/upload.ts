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

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploads = (file: any, folder: any) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(file, { folder: folder }, (result: any) => {
      resolve({
        url: result.url,
        id: result.public_id,
      });
    });
  });
};
