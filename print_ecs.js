const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TEMP_FILE = path.join(__dirname, "print_temp.txt");

// 🔧 Ganti dengan nama printer kamu (lihat di Control Panel → Devices and Printers)
const PRINTER_NAME = "POS-80"; // contoh: "EPSON TM-T82", "XP-80C", "POS-58"

app.post("/print", (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ success: false, message: "Empty!" });
  }

  // ========== ESC/POS Commands ==========
  // ESC @  -> Initialize printer
  // ESC a 1 -> Align center
  // GS V 0 -> Cut paper
  const ESC = "\x1B";
  const GS = "\x1D";
  const LF = "\x0A";
  const CUT = GS + "V" + "\x00";

  const content =
    ESC +
    "@" + // init
    ESC +
    "a" +
    "\x01" + // center
    "KOTA AWAN" +
    LF +
    ESC +
    "a" +
    "\x00" + // left
    text +
    LF +
    LF +
    CUT;

  // Simpan ke file sementara (binary)
  fs.writeFileSync(TEMP_FILE, content, "binary");

  // Kirim ke printer pakai perintah Windows "print"
  exec(`print /D:"${PRINTER_NAME}" "${TEMP_FILE}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Print failed:", err.message);
      return res.status(500).json({
        success: false,
        message: "Print failed",
        error: err.message,
      });
    }

    console.log("✅ Printed:", stdout || "OK");
    res.json({ success: true, message: "Printed successfully" });
  });
});

const PORT = 7001;
app.listen(PORT, () => {
  console.log(`🖨️ ESC/POS Print Server running on port ${PORT}`);
});
