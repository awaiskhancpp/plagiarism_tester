// utils/extract.js
const fsPromises = require('fs/promises');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(filePath) {
  const ext = filePath.split('.').pop();

  if (ext === 'pdf') {
    const dataBuffer = await fsPromises.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  }

  if (ext === 'docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error('Unsupported file type');
}

module.exports = { extractTextFromFile };