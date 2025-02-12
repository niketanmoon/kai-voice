"use server";
import { AzureOpenAI } from "openai";

async function transcript(prevState: any, formData: FormData) {
  const id = Math.random().toString(36);

  console.log("PREVIOUS STATE:", prevState);
  if (
    process.env.AZURE_CHAT_API_KEY === undefined ||
    process.env.AZURE_SPEECH_API_KEY === undefined ||
    process.env.AZURE_SPEECH_ENDPOINT === undefined ||
    process.env.AZURE_CHAT_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined ||
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
  ) {
    console.error("Azure credentials not set");
    return {
      sender: "",
      response: "Azure credentials not set",
    };
  }

  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  console.log(">>", file);

  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);

  // ---   get audio transcription from Azure OpenAI Whisper ----

  console.log("== Transcribe Audio Sample ==");

  const deployment = process.env.AZURE_DEPLOYMENT_NAME;
  const apiVersion = "2024-06-01";
  const speechClient = new AzureOpenAI({
    apiVersion,
    apiKey: process.env.AZURE_SPEECH_API_KEY,
    endpoint: process.env.AZURE_SPEECH_ENDPOINT,
  });

  const result = await speechClient.audio.transcriptions.create({
    file: file,
    model: process.env.AZURE_DEPLOYMENT_NAME,
  });
  console.log(`Transcription: ${result.text}`);

  // ---   get chat completion from Azure OpenAI ----
  const chatAPIVersion = "2024-05-01-preview";
  const chatClient = new AzureOpenAI({
    apiVersion: chatAPIVersion,
    apiKey: process.env.AZURE_CHAT_API_KEY,
    endpoint: process.env.AZURE_CHAT_ENDPOINT,
    deployment: process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
  });

  const completions = await chatClient.chat.completions.create({
    model: process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
    messages: [
      {
        role: "system",
        content:
          "Your name is Kai. You are a helpful assistant. You will answer questions and reply I cannot answer that if you dont know the answer.",
      },
      { role: "user", content: result.text },
    ],
    max_tokens: 800,
    stream: false,
  });
  console.log(completions.choices[0].message.content);

  const response = completions.choices[0].message?.content;

  console.log(prevState.sender, "+++", result.text);
  return {
    sender: result.text,
    response: response,
    id: id,
  };
}

export default transcript;
