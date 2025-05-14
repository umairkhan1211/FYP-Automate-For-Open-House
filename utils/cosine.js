// utils/cosine.js

// utils/cosine.js

export function cosineSimilarity(text1, text2) {
  const getTermFreqMap = (str) => {
    const words = str.toLowerCase().match(/\w+/g) || [];
    const freqMap = {};
    words.forEach(word => {
      freqMap[word] = (freqMap[word] || 0) + 1;
    });
    return freqMap;
  };

  const dotProduct = (vecA, vecB) => {
    let product = 0;
    for (const key in vecA) {
      if (vecB[key]) {
        product += vecA[key] * vecB[key];
      }
    }
    return product;
  };

  const magnitude = (vec) => {
    let sum = 0;
    for (const key in vec) {
      sum += vec[key] * vec[key];
    }
    return Math.sqrt(sum);
  };

  const vecA = getTermFreqMap(text1);
  const vecB = getTermFreqMap(text2);

  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB) || 1);
}
