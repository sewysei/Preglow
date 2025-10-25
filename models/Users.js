import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        "Hanya email Gmail yang diperbolehkan",
      ],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    pregnancy_date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },

    pregnancy_status: {
      type: String,
      enum: ["Pregnant", "Born"],
      default: "Pregnant",
    },

    token: {
      type: String,
    },

    lastReportPublicId: {
      type: String,
      default: null,
    },
    verificationCode: {
      type: String,
      select: false,
    },

    verificationCodeExpires: {
      type: Date,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// --- Middleware Pre-Save untuk Enkripsi Password ---
// Fungsi ini akan dijalankan sebelum dokumen disimpan ke database (misalnya saat registrasi)
userSchema.pre("save", async function (next) {
  // Hanya jalankan fungsi ini jika field password dimodifikasi
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt dan hash password
    const salt = await bcrypt.genSalt(10); // Level salt (biasanya 10)
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// --- Metode Kustom untuk Membandingkan Password ---
// Metode ini dapat digunakan di controller saat proses login
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Bandingkan password yang dimasukkan user dengan password yang di-hash di database
  return await bcrypt.compare(enteredPassword, this.password);
};

// Buat Model Mongoose dari skema
const User = mongoose.model("user", userSchema);

export default User;
