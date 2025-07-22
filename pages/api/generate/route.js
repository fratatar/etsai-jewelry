import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // ⚡ Daha hızlı ve daha ucuz
      messages: [
        {
          role: "system",
          content: `
You are an Etsy content assistant. Respond ONLY in this exact JSON format:

{
  "title": "...",
  "description": "...",
  "tags": "...",
  "materials": "...",
  "techniques": "...",
  "style": "...",
  "usage": "...",
  "category": "...",
  "faq": "..."
}

Do NOT include any explanation, extra text, markdown, or formatting. Keep it short and clean.
          `.trim()
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 600  // Daha kısa sürede cevap versin
    });

    const content = completion.choices[0]?.message?.content;

    let parsed = {};
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      const lines = content.split("\n").filter(line => line.includes(":"));
      for (let line of lines) {
        const [key, ...rest] = line.split(":");
        parsed[key.trim().toLowerCase()] = rest.join(":").trim();
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
