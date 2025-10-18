import multer from "multer";

const storage = multer.memoryStorage(); // <---- pakai memoryStorage agar ada buffer

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG are allowed!"), false);
    }
  },
});

export default upload;
