# Preglow API

Backend REST API untuk Preglow, sebuah platform pendamping ibu hamil. API ini menyediakan autentikasi pengguna, edukasi kehamilan, afirmasi, pencatatan mood dan makanan, chatbot berbasis Gemini, serta forum komunitas.

## Fitur

- Registrasi, verifikasi email, login, reset password, logout, dan hapus akun.
- Informasi pengguna dan status kehamilan.
- Artikel edukasi, FAQ, dan afirmasi.
- Pencatatan makanan serta ringkasan nutrisi dan kalori.
- Pencatatan mood harian, mingguan, dan bulanan.
- Chatbot SARA AI untuk pertanyaan seputar kehamilan dan nutrisi.
- Forum dengan foto, komentar, balasan, dan balasan bertingkat.
- Upload gambar ke Cloudinary.

## Teknologi

- Node.js dan Express 5
- MongoDB dengan Mongoose
- JWT dan bcrypt
- Google Gemini API
- Cloudinary
- Nodemailer
- Vercel

## Persyaratan

- Node.js 18 atau lebih baru
- npm
- MongoDB (lokal atau MongoDB Atlas)
- Akun dan kredensial Google Gemini, Cloudinary, serta SMTP Gmail

## Instalasi

```bash
git clone https://github.com/sewysei/Preglow.git
cd Preglow
npm install
```

Buat file `.env` di root proyek:

```env
PORT=3000
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=ganti-dengan-secret-yang-kuat

FOOD_API_KEY=your-google-gemini-api-key
CHATBOT_API_KEY=your-google-gemini-api-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

EMAIL_USER=your-gmail-address
EMAIL_PASS=your-gmail-app-password
```

`EMAIL_PASS` sebaiknya menggunakan Google App Password, bukan password utama akun Gmail. Jangan commit file `.env` atau membagikan nilai secret.

## Menjalankan aplikasi

Mode production:

```bash
npm start
```

Mode development dengan Nodemon:

```bash
npm run dev
```

Server berjalan di `http://localhost:3000` atau port yang ditentukan oleh `PORT`.

Health check:

```http
GET /
```

Respons:

```json
{
  "message": "Server is running"
}
```

## Autentikasi

Endpoint yang membutuhkan autentikasi menggunakan JWT melalui header:

```http
Authorization: Bearer <token>
```

Token diperoleh dari respons `POST /auth/login` dan berlaku selama 7 hari. Token yang sudah digunakan untuk logout masuk blacklist dan tidak dapat digunakan kembali.

## Referensi endpoint

Base URL lokal: `http://localhost:3000`

### Auth — `/auth`

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/register` | Mendaftarkan pengguna baru |
| POST | `/verify-registration` | Memverifikasi kode registrasi |
| POST | `/send-otp-regis` | Mengirim ulang OTP registrasi |
| POST | `/login` | Login dan memperoleh JWT |
| POST | `/forget-password` | Memulai proses lupa password |
| POST | `/verify-forgotpass` | Memverifikasi OTP reset password |
| POST | `/send-otp-reset` | Mengirim ulang OTP reset password |
| POST | `/reset-password` | Mengatur password baru |
| POST | `/logout` | Logout dan blacklist token |
| DELETE | `/delete` | Menghapus akun |

Contoh body registrasi:

```json
{
  "username": " contoh ",
  "email": "contoh@gmail.com",
  "password": "password-rahasia",
  "pregnancyDate": "13/11/2026"
}
```

Email registrasi harus menggunakan alamat Gmail dan `pregnancyDate` berformat `dd/mm/yyyy`.

### Landing — `/landing`

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/education` | Daftar edukasi |
| GET | `/education/:id` | Detail edukasi |
| GET | `/other-education/:id` | Edukasi lain berdasarkan ID |
| GET | `/faq` | Daftar FAQ |

### Dashboard — `/dashboard`

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/user-info` | Ya |
| PUT | `/update-status` | Ya |
| GET | `/affirmation` | Ya |
| GET | `/daily-nutrition` | Ya |

### Makanan — `/menu/food`

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/add` | Ya |
| GET | `/nutrition` | Ya |
| GET | `/weekly-nutrition` | Ya |
| GET | `/report` | Ya |
| GET | `/all` | Ya |
| GET | `/last` | Ya |

Body minimal untuk menambahkan makanan:

```json
{
  "name": "Nasi goreng",
  "category": "Breakfast"
}
```

Nilai `category` yang tersedia: `Breakfast`, `Lunch`, `Dinner`, dan `Snack`. Makanan baru akan dianalisis menggunakan Gemini.

### Mood — `/menu/mood`

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/add-feelings` | Ya |
| GET | `/daily-mood` | Ya |
| GET | `/weekly-mood` | Ya |
| GET | `/monthly-mood` | Ya |
| GET | `/all` | Ya |
| GET | `/get/:id` | Ya |
| DELETE | `/delete/:id` | Ya |

### Chatbot — `/menu/chatbot`

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/` | Ya |
| GET | `/history` | Ya |

Body chatbot:

```json
{
  "message": "Makanan apa yang baik untuk ibu hamil?"
}
```

### Forum — `/menu/forum`

| Method | Endpoint | Auth | Catatan |
|---|---|---|---|
| POST | `/add` | Ya | `multipart/form-data`, field gambar: `photo` |
| GET | `/all` | Tidak | |
| GET | `/:id` | Tidak | |
| POST | `/add-comment/:id` | Ya | |
| GET | `/get-comment/:id` | Tidak | |
| POST | `/add-reply/:id` | Ya | |
| GET | `/get-reply/:id` | Tidak | |
| POST | `/add-reofre/:id` | Ya | Balasan dari balasan |
| GET | `/get-reofre/:id` | Tidak | Balasan dari balasan |
| DELETE | `/delete/:id` | Ya | |

Upload gambar menerima JPEG, JPG, atau PNG dengan ukuran maksimum 5 MB.

### Admin/data — `/add`

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/education` | Menambahkan edukasi; mendukung field gambar `photo` |
| POST | `/faq` | Menambahkan FAQ |
| POST | `/affirmation` | Menambahkan afirmasi |

Endpoint data sebaiknya dilindungi autentikasi/otorisasi tambahan sebelum digunakan di lingkungan production.

## Deployment ke Vercel

Konfigurasi deployment tersedia di [`vercel.json`](./vercel.json). Tambahkan seluruh environment variable pada **Project Settings → Environment Variables** di Vercel, kemudian deploy:

```bash
npx vercel
```

Pastikan MongoDB mengizinkan koneksi dari deployment Vercel dan semua secret telah diatur pada environment yang sesuai.

## Struktur proyek

```text
.
├── handler/       # Logika handler setiap fitur
├── middleware/    # Autentikasi dan upload file
├── models/        # Schema dan model Mongoose
├── routes/        # Definisi route Express
├── database.js    # Koneksi MongoDB
├── index.js       # Entry point server
└── vercel.json    # Konfigurasi deployment Vercel
```

## Lisensi

Proyek ini menggunakan lisensi ISC sesuai konfigurasi pada `package.json`.
