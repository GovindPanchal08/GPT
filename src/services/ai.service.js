const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

async function aiChat(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response.text;
}

async function generateEmbeddings(content) {
  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768,
    },
  });
  return res.embeddings[0].values;
}

module.exports = { aiChat, generateEmbeddings };
