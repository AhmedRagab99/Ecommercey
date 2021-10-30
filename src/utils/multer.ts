import multer from "multer";
import path from "path";
// var path = require('path');
var dir = path.join(__dirname, "./uploads");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // console.log(file.path);
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    //reject file
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: fileFilter,
});
