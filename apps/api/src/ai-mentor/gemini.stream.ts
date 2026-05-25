import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '@nestjs/common';
import { Response } from 'express';

export interface GeminiStreamOptions {
  apiKey: string;
  model: string;
}

function writeSseText(res: Response, text: string): void {
  res.write(`data: ${JSON.stringify({ text })}\n\n`);
}

export async function streamViaGemini(
  systemPrompt: string,
  userMessage: string,
  res: Response,
  options: GeminiStreamOptions,
  logger: Logger,
): Promise<void> {
  try {
    const genAI = new GoogleGenerativeAI(options.apiKey);
    const model = genAI.getGenerativeModel({
      model: options.model,
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContentStream(userMessage);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        writeSseText(res, text);
      }
    }
  } catch (err) {
    logger.error('Gemini API error', err);
    writeSseText(
      res,
      '\n\n[Error communicating with AI Mentor. Please try again.]',
    );
  }
}
