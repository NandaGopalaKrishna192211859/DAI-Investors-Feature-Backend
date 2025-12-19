import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = "src/storage/profile";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const uniqueName = `temp_${Date.now()}${ext}`;
  cb(null, uniqueName);
}
});

function fileFilter(req, file, cb) {
  console.log("MULTER FILE >>>", file.mimetype);
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG or PNG images allowed"), false);
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter });

export default upload;
