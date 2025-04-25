# 📄 Plagiarism Detection System

This project is a full-stack plagiarism detection system that:
- 🧠 Uses traditional and semantic algorithms
- 📎 Extracts text from PDF/Word files
- 🧮 Computes similarity using TF-IDF, Jaccard, Levenshtein, LCS, Rabin-Karp
- 🧬 Uses Sentence-BERT via Python microservice
- 🎨 Visualizes matches in React UI with color-coded reports

---

## 🛠️ Project Structure
```
plagiarism-detector/
├── server/              # Express backend
├── microservice/        # SBERT Python microservice
├── client/              # React frontend
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python 3.7+
- Docker (for containerized deployment)

### 🔧 Manual Installation

#### Backend
```bash
cd server
npm install
node index.js
```

#### Python Microservice
```bash
cd microservice
pip install flask sentence-transformers
python sbert_service.py
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## 🐳 Docker Support (Optional)

### Build and Run with Docker Compose
```bash
docker-compose up --build
```
Then visit: `http://localhost:5173`

---

## 📦 Features
- Upload `.pdf` or `.docx`
- Choose chunk type (sentence/paragraph)
- Enable/disable SBERT
- View colored match results (Red > 0.8, Orange > 0.5, Green < 0.5)
- Export similarity report as PDF

---

## 📤 Export Report to PDF (Frontend)
- Click the print/save button from browser print menu (Ctrl+P / Cmd+P)
- Select "Save as PDF"
- Done!

> Soon: Auto PDF button via [jsPDF](https://github.com/parallax/jsPDF) or similar

---

## 🙌 Authors
- Muhammad Awais (SP22-BSE-061)

---

## 📬 Feedback
Pull requests, suggestions, and bug reports are welcome!

