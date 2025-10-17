const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const PORT = 7001;
const PRINTER_NAME = "\\\\localhost\\epsonShare";
const TEMP_FILE = path.join(__dirname, "print.txt");


app.use(cors({
  origin: 'https://indosinar.kotaawan.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(bodyParser.json());


app.post("/print", (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ success: false, message: "Empty!" });
  }

  fs.writeFileSync(TEMP_FILE, text, "binary");

  exec(`print /D:"${PRINTER_NAME}" "${TEMP_FILE}"`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed",
        error: err.message,
      });
    }

    res.json({ success: true, message: "Printed" });
  });
});

app.listen(PORT, () => {
  console.log(`Server port : ${PORT} ${PRINTER_NAME}`);
});
