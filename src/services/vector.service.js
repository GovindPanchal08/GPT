const { Pinecone } = require("@pinecone-database/pinecone");
const pc = new Pinecone({ apiKey: process.env.PINECONE_KEY });
const gptIndex = pc.Index("cohort-gpt");

async function createMemory({ vector, metadata, messageId }) {
  await gptIndex.upsert([
    { id: messageId, values: vector, metadata: metadata },
  ]);
}

async function queryMemory({ vector, topK = 3, metadata }) {
  const res = await gptIndex.query({
    vector: vector,
    topK: topK,
    includeValues: true,
    filter: metadata ? { metadata } : undefined,
    includeMetadata: true,
  });
  return res.matches;
}

module.exports = {
  createMemory,
  queryMemory,
};
