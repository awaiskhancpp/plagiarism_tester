// server/index.js
const express = require('express');
const multer = require('multer');
const fileUpload = multer({ dest: 'uploads/' });
const { extractTextFromFile } = require("./utils/extract");
const { runAllChecks } = require("./utils/similarity");
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/upload', fileUpload.single('file'), async (req, res) => {
  const { chunkType, thresholds, useSBERT } = req.body;
  const filePath = path.join(__dirname, req.file.path);

  try {
    const text = await extractTextFromFile(filePath);
    const report = await runAllChecks(text, { chunkType, thresholds, useSBERT });
    fs.unlinkSync(filePath); // cleanup
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));