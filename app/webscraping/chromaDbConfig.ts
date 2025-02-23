import { ChromaClient } from "chromadb";

const chormaClient = new ChromaClient({ path: "http://localhost:8000" });
const a = await chormaClient.heartbeat();
console.log("chcking ", a);

const WEB_COLLECTION = "WEB_SCRAPPING_V1";
// const WEB_COLLECTION = "testing1233";
const collection = await chormaClient.getOrCreateCollection({
  name: WEB_COLLECTION,
});

const addEmbeddingToDb = async ({
  url,
  body,
  head,
  embedding,
}: {
  url: string;
  body: string;
  head: string;
  embedding: number[][];
}) => {
  console.log("embedding", embedding);
  const res = await collection.add({
    ids: [url],
    embeddings: embedding,
    metadatas: [{ url, body, head }],
  });
  return res;
};

const searchByText = async (searchKeyEm: number[][], searchKey: string) => {
  const result = await collection.query({
    queryEmbeddings: searchKeyEm,
    nResults: 5,
    include: ["embeddings", "metadatas"],
  });
  return result;
};

const getAllDbData = async () => {
  const result = await collection.get();
  console.log("asd", await collection.peek());
  return result.embeddings;
};
export { collection, addEmbeddingToDb, searchByText, getAllDbData };
