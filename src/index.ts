import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from "readline";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function corrigirTexto(texto: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
  });

  const prompt = `
Você é um corretor ortográfico.
Retorne APENAS o JSON abaixo, sem comentários e sem markdown:

{
  "corrigido": "",
  "erros": [
     { "errada": "", "correta": "" }
  ]
}

Texto: "${texto}"
`;

  const result = await model.generateContent(prompt);
  let resposta = result.response.text();

  resposta = resposta.replace(/```json/g, "").replace(/```/g, "").trim();

  return JSON.parse(resposta);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite uma frase: ", async (frase) => {
  try {
    const res = await corrigirTexto(frase);
    console.log("\n Correção:\n", res);
  } catch (err) {
    console.error("\n Erro:", err);
  }
  rl.close();
});
