// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [chunkType, setChunkType] = useState('sentence');
  const [useSBERT, setUseSBERT] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    const options = {
      chunkType,
      thresholds: {},
      useSBERT
    };

    formData.append('chunkType', chunkType);
    formData.append('thresholds', JSON.stringify({}));
    formData.append('useSBERT', useSBERT);

    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
      setResults(data);
    } catch (err) {
      alert('Upload failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📄 Plagiarism Detection</h1>
      <input type="file" accept=".pdf,.docx" onChange={e => setFile(e.target.files[0])} />
      <div className="my-4">
        <label className="mr-4">Chunk Type:</label>
        <select value={chunkType} onChange={e => setChunkType(e.target.value)} className="border p-2">
          <option value="sentence">Sentence</option>
          <option value="paragraph">Paragraph</option>
        </select>
        <label className="ml-4">Use SBERT:</label>
        <input type="checkbox" checked={useSBERT} onChange={e => setUseSBERT(e.target.checked)} className="ml-2" />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleUpload}>
        {loading ? 'Analyzing...' : 'Upload & Analyze'}
      </button>

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Similarity Results</h2>
          {results.map((r, idx) => {
            const avg = Object.values(r.scores).reduce((a, b) => a + b, 0) / Object.keys(r.scores).length;
            const color = avg > 0.8 ? 'bg-red-200' : avg > 0.5 ? 'bg-orange-200' : 'bg-green-200';
            return (
              <div key={idx} className={`p-3 my-2 rounded ${color}`}>
                <p><strong>Chunk 1:</strong> {r.chunk1}</p>
                <p><strong>Chunk 2:</strong> {r.chunk2}</p>
                <p><strong>Scores:</strong> {JSON.stringify(r.scores, null, 2)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
