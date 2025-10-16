import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.json());

const PRINTER_PORT = "\\\\?\\LPT1";

app.post("/print", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ success: false, message: "Empty !" });
  }

  try {
    fs.writeFileSync(PRINTER_PORT, text + "\r\n\r\n\r\n", "utf8");
    console.log("Printed");
    res.json({ success: true, message: "Printed" });
  } catch (err) {
    console.error("Failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 7001;
app.listen(PORT, () => {
  console.log(`🖨️ Print : ${PORT} >> ${PRINTER_PORT}`);
});
