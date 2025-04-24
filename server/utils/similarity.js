// utils/similarity.js
const natural = require('natural');
const { cosineSimilarity } = require('simple-statistics');
const levenshtein = natural.LevenshteinDistance;

function tokenize(text) {
  return text.toLowerCase().match(/\b(\w+)\b/g);
}

function tfidfCosine(text1, text2) {
  const allWords = [...new Set([...tokenize(text1), ...tokenize(text2)])];
  const tfidf1 = allWords.map(word => text1.includes(word) ? 1 : 0);
  const tfidf2 = allWords.map(word => text2.includes(word) ? 1 : 0);
  return cosineSimilarity(tfidf1, tfidf2);
}

function jaccard(text1, text2, n = 3) {
  const ngrams = s => new Set([...s.matchAll(new RegExp(`(?=(.{${n}}))`, 'g'))].map(m => m[1]));
  const set1 = ngrams(text1);
  const set2 = ngrams(text2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = text1[i - 1] === text2[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n] / Math.max(m, n);
}

function rabinKarp(text1, text2) {
  const hash = str => str.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0);
  const windowSize = 10;
  const hashes1 = new Set();
  for (let i = 0; i <= text1.length - windowSize; i++) {
    hashes1.add(hash(text1.slice(i, i + windowSize)));
  }
  let matchCount = 0;
  for (let i = 0; i <= text2.length - windowSize; i++) {
    if (hashes1.has(hash(text2.slice(i, i + windowSize)))) matchCount++;
  }
  return matchCount / Math.max(1, text2.length - windowSize + 1);
}

async function runAllChecks(text, options) {
  const chunks = options.chunkType === 'sentence' ? text.split(/(?<=[.!?])\s+/) : text.split('\n');
  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    for (let j = i + 1; j < chunks.length; j++) {
      const chunk1 = chunks[i], chunk2 = chunks[j];
      const scores = {
        tfidf: tfidfCosine(chunk1, chunk2),
        jaccard: jaccard(chunk1, chunk2),
        levenshtein: 1 - levenshtein(chunk1, chunk2) / Math.max(chunk1.length, chunk2.length),
        lcs: lcs(chunk1, chunk2),
        rabin: rabinKarp(chunk1, chunk2)
      };
      results.push({ chunk1, chunk2, scores });
    }
  }
  return results;
}

module.exports = { runAllChecks };