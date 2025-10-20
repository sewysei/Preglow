import PdfPrinter from "pdfmake";
import Food from "../../models/Food.js";
import User from "../../models/Users.js";
import checkToken from "../../middleware/auth.js";
import { isBlacklisted } from "../../middleware/auth.js";

export const getDetailReport = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "There is no Token sent!",
      });
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
        .json({ message: "Token has been invalidated. Please login again." });
    }
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Ambil data makanan hanya dari hari ini
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

    // Hitung total harian
    const total = foods.reduce(
      (sum, f) => ({
        calories: sum.calories + (f.calories || 0),
        protein: sum.protein + (f.protein || 0),
        carbs: sum.carbs + (f.carbs || 0),
        fat: sum.fat + (f.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Font standar
    const fonts = {
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);
    const today = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // ======== HEADER TABEL ========
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
        { text: f.category, style: "tableCell" },
        { text: f.name, style: "tableCell" },
        { text: f.calories.toString(), style: "tableCell" },
        { text: f.protein.toString(), style: "tableCell" },
        { text: f.carbs.toString(), style: "tableCell" },
        { text: f.fat.toString(), style: "tableCell" },
      ]),
      [
        {
          text: "Total",
          colSpan: 2,
          alignment: "center",
          style: "tableTotal",
        },
        {},
        { text: total.calories.toString(), style: "tableTotal" },
        { text: total.protein.toString(), style: "tableTotal" },
        { text: total.carbs.toString(), style: "tableTotal" },
        { text: total.fat.toString(), style: "tableTotal" },
      ],
    ];

    // ======== DOKUMEN DEFINISI ========
    const docDefinition = {
      pageMargins: [40, 60, 40, 60],
      content: [
        // HEADER: soft pink bar
        {
          table: {
            widths: ["*", "auto"],
            body: [
              [
                { text: "Daily Food Report", style: "title" },
                { text: `Tanggal: ${today}`, style: "date" },
              ],
            ],
          },
          layout: {
            fillColor: "#f28ca0", // 🌸 soft pink header
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 20],
        },

        // TABLE
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto", "auto"],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex, node, columnIndex) => {
              if (rowIndex === 0) return "#fff5f7"; // header pink muda
              if (rowIndex === node.table.body.length - 1) return "#fff0f2"; // total bar lembut
              return rowIndex % 2 === 0 ? "#ffffff" : "#fdfdfd"; // zebra rows
            },
            hLineColor: () => "#f0f0f0",
            vLineColor: () => "#f0f0f0",
          },
        },

        // FOOTER
        {
          text: "Generated by Preglow",
          style: "footer",
          margin: [0, 25, 0, 0],
        },
      ],

      // ======== STYLES ========
      styles: {
        title: {
          font: "Helvetica",
          bold: true,
          fontSize: 18,
          color: "#ffffff",
          margin: [10, 10, 0, 10],
        },
        date: {
          font: "Helvetica",
          fontSize: 10,
          color: "#ffffff",
          alignment: "right",
          margin: [0, 14, 10, 10],
        },
        tableHeader: {
          fontSize: 11,
          bold: true,
          color: "#1b2559",
          alignment: "center",
          margin: [0, 6, 0, 6],
        },
        tableCell: {
          fontSize: 10,
          color: "#333333",
          margin: [0, 4, 0, 4],
        },
        tableTotal: {
          bold: true,
          fontSize: 11,
          color: "#f28ca0",
          alignment: "center",
        },
        footer: {
          fontSize: 9,
          color: "#999999",
          alignment: "center",
        },
      },

      defaultStyle: {
        font: "Helvetica",
      },
    };

    // ======== GENERATE PDF ========
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=DailyFoodReport.pdf"
      );
      res.send(result);
    });

    pdfDoc.end();
  } catch (error) {
    res.status(500).json({
      message: "A server error occurred: " + error.message,
    });
  }
};
