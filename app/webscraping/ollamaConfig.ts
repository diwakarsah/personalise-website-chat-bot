import ollama from "ollama";

export const ollamaEmb = async (textToEmb: string) => {
  const res = await ollama.embed({
    model: "llama3-groq-tool-use:latest",
    input: textToEmb,
  });
  return res;
};

export const chatWithOllama = async (
  body: string,
  url: string,
  head: string,
  question: string
) => {
  const res = await ollama.chat({
    model: "llama3-groq-tool-use:latest",
    messages: [
      {
        role: "system",
        content: `You are a chat support agent expert for a given website. you will get the website body,head and url. Search through the the provide website details and answer user questions. Body:${body} , Url:${url}, head:${head}. `,
      },
      {
        role: "user",
        content: `Here is the user question:${question}`,
      },
    ],
    format: "json",
  });
  return res;
};