import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async chat(messages: Array<{ role: 'user' | 'assistant'; content: string }>) {
    const systemPrompt = `You are Pam Care AI, a helpful healthcare assistant. 
    You provide medical information, answer health-related questions, and assist with healthcare management.
    Always remind users to consult with healthcare professionals for serious medical concerns.
    Be empathetic, clear, and professional in your responses.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0].message.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get AI response. Please try again later.');
    }
  }
}

