import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { ClientReferenceManifestPlugin } from "next/dist/build/webpack/plugins/flight-manifest-plugin";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { chatWithOllama, ollamaEmb } from "./ollamaConfig";
import { addEmbeddingToDb, getAllDbData, searchByText } from "./chromaDbConfig";
import { Questrial } from "next/font/google";
const internalLinks: Set<string> = new Set();
const externalLinks: Set<string> = new Set();
const scrapWebsite = async (url: string) => {
  const res = await fetch(url);
  const page = await res.text();
  const $ = cheerio.load(page);
  const head = $("head").html() || "";
  const body = $("body").html() || "";

  $("a").each((_index, el) => {
    const link = $(el).attr("href") || "";
    if (link.includes("https://tirnu.com/")) {
      internalLinks.add(link);
    } else {
      externalLinks.add(link);
    }
  });
  return { head, body };
};

const chunkText = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 100,
    chunkSize: 1800,
    separators: ["|", "##", ">", "-"],
  });
  return await splitter.createDocuments([text]);
};

const ingest = async (url: string) => {
  console.log("!!! Ingesting " + url);
  const { head, body } = await scrapWebsite(url);
  const chuckDocs = await chunkText("testing for embedding");
  for (const c of chuckDocs) {
    const { embeddings } = await ollamaEmb(c.pageContent!!);
    console.log("eme", embeddings);
    const dbRes = await addEmbeddingToDb({
      head,
      body,
      url,
      embedding: embeddings,
    });
    console.log("dbRes", dbRes);
  }

  console.log("!!! Finished Ingesting " + url);
};
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("data", data.url);
    const question = "What is tirnu all about?";
    const emSearchKey = await ollamaEmb(question);
    const queryResult = await searchByText(emSearchKey.embeddings, "At TIRNU");
    const body = queryResult.metadatas[0].map((e) => {
      const parsedDetail = e as {
        body: string;
        head: string;
        url: string;
      };
      return parsedDetail.body;
    });
    const head = queryResult.metadatas[0].map((e) => {
      const parsedDetail = e as {
        body: string;
        head: string;
        url: string;
      };
      return parsedDetail.head;
    });
    const url = queryResult.metadatas[0].map((e) => {
      const parsedDetail = e as {
        body: string;
        head: string;
        url: string;
      };
      return parsedDetail.url;
    });
    const chatResp = await chatWithOllama(
      body.join(","),
      url.join(","),
      head.join(","),
      question
    );
    console.log("chatres", chatResp);
    // await ingest("https://tirnu.com/");
    // for (const link of internalLinks) {
    //   await ingest(link);
    // }
    // await embeddedToVectorAndStore(body!!);
    return NextResponse.json({ message: "post request success" });
  } catch (err) {
    console.log(err);
  }
}
export async function GET(request: NextRequest) {
  console.log("Web scraping route hit!"); // Check the console
  return NextResponse.json({ message: "Hello from web scraping route!" });
}
