import PdfPrinter from "pdfmake";
import Food from "../../models/Food.js";
import User from "../../models/Users.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// --- Konfigurasi Cloudinary ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getDetailReport = async (req, res) => {
  try {
    // --- Auth check ---
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ status: "Failed", message: "No token sent" });
    }

    const token = authHeader.split(" ")[1];
    const { valid, expired, decoded } = checkToken(token);
    const userId = decoded.id;

    if (!valid) {
      return res.status(401).json({
        status: "Failed",
        message: expired ? "Token expired." : "Token invalid.",
      });
    }

    if (await isBlacklisted(token)) {
      return res
        .status(401)
        .json({ message: "Token invalidated. Please login again." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // --- Get today's foods ---
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const foods = await Food.find({
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ category: 1 });

    if (foods.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "Tidak ada data makanan untuk hari ini.",
      });
    }

    // --- Total nutrition ---
    const total = foods.reduce(
      (sum, f) => ({
        calories: sum.calories + (f.calories || 0),
        protein: sum.protein + (f.protein || 0),
        carbs: sum.carbs + (f.carbs || 0),
        fat: sum.fat + (f.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // --- Font setup (Times New Roman) ---
    const fonts = {
      TimesNewRoman: {
        normal: path.resolve("fonts/times-new-roman.ttf"),
        bold: path.resolve("fonts/times-new-roman-bold.ttf"),
      },
    };

    const printer = new PdfPrinter(fonts);
    const today = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // --- Logo ---
    const logoPath = path.resolve("public/preglow-logo.png");
    const logoBase64 = fs.existsSync(logoPath)
      ? fs.readFileSync(logoPath).toString("base64")
      : null;

    // --- Table body ---
    const tableBody = [
      [
        { text: "Category", style: "tableHeader" },
        { text: "Name", style: "tableHeader" },
        { text: "Calories", style: "tableHeader" },
        { text: "Protein", style: "tableHeader" },
        { text: "Carbs", style: "tableHeader" },
        { text: "Fat", style: "tableHeader" },
      ],
      ...foods.map((f) => [
        { text: f.category, style: "tableCellCenter" },
        { text: f.name, style: "tableCellCenter" },
        { text: f.calories.toString(), style: "tableCellCenter" },
        { text: f.protein.toString(), style: "tableCellCenter" },
        { text: f.carbs.toString(), style: "tableCellCenter" },
        { text: f.fat.toString(), style: "tableCellCenter" },
      ]),
      [
        { text: "Total", colSpan: 2, style: "tableTotalCenter" },
        {},
        { text: total.calories.toString(), style: "tableTotalCenter" },
        { text: total.protein.toString(), style: "tableTotalCenter" },
        { text: total.carbs.toString(), style: "tableTotalCenter" },
        { text: total.fat.toString(), style: "tableTotalCenter" },
      ],
    ];

    // --- Document definition ---
    const docDefinition = {
      pageMargins: [40, 80, 40, 60],
      content: [
        {
          columns: [
            {
              image: "data:image/png;base64," + logoBase64,
              width: 90,
            },
            {
              text: "Preglow Nutrition Report",
              style: "title",
              alignment: "right",
              margin: [0, 15, 0, 0],
            },
          ],
          columnGap: 10,
          margin: [0, 0, 0, 5],
        },
        {
          canvas: [
            { type: "rect", x: 0, y: 0, w: 520, h: 1, color: "#f28ca0" },
          ],
          margin: [0, 5, 0, 10],
        },
        {
          table: {
            widths: [60, "*"],
            body: [
              [
                { text: "Nama:", bold: true, margin: [0, 1, 2, 1] },
                { text: user.username || "-", margin: [0, 1, 0, 1] },
              ],
              [
                { text: "Tanggal:", bold: true, margin: [0, 1, 2, 1] },
                { text: today, margin: [0, 1, 0, 1] },
              ],
              [
                { text: "Email:", bold: true, margin: [0, 1, 2, 1] },
                { text: user.email || "-", margin: [0, 1, 0, 1] },
              ],
            ],
          },
          layout: "noBorders",
          fontSize: 10,
          margin: [0, 0, 0, 15],
        },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto", "auto"],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex, node, columnIndex) => {
              if (rowIndex === 0) return "#f2f2f2";
              if (rowIndex === node.table.body.length - 1) return "#eaeaea";
              return rowIndex % 2 === 0 ? "#ffffff" : "#f9f9f9";
            },
            hLineColor: () => "#cccccc",
            vLineColor: () => "#cccccc",
          },
        },
        {
          text: "Generated by Preglow — your maternal health companion.",
          style: "footer",
          margin: [0, 25, 0, 0],
        },
      ],

      styles: {
        title: { fontSize: 16, bold: true, color: "#f28ca0" },
        tableHeader: {
          fontSize: 11,
          bold: true,
          color: "#333333",
          alignment: "center",
          margin: [0, 6, 0, 6],
        },
        tableCellCenter: {
          fontSize: 10,
          color: "#333333",
          alignment: "center",
          margin: [0, 4, 0, 4],
        },
        tableTotalCenter: {
          bold: true,
          fontSize: 11,
          color: "#000000",
          alignment: "center",
        },
        footer: {
          fontSize: 9,
          color: "#888888",
          alignment: "center",
        },
      },

      defaultStyle: { font: "TimesNewRoman" },
    };

    // --- Generate PDF ke buffer dan upload ke Cloudinary ---
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);
        const pdfBase64 = pdfBuffer.toString("base64");
        const dataURI = `data:application/pdf;base64,${pdfBase64}`;

        // Upload ke Cloudinary
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "preglow-reports",
          public_id: `PreglowReport-${user.username}-${Date.now()}`,
          resource_type: "auto",
          format: "pdf",
        });

        // Respon URL Cloudinary
        res.status(200).json({
          message: "Report generated successfully",
          reportUrl: uploadResult.secure_url,
        });
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        res.status(500).json({ message: "Upload to Cloudinary failed." });
      }
    });

    pdfDoc.end();
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
