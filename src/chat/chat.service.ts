import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import OpenAI from "openai";


@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async create(createChatDto: CreateChatDto) {
    const response = await this.generateResponse(createChatDto.message, createChatDto.context);
    return {
      userMessage: createChatDto.message,
      aiResponse: response,
    };
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

      if (context) {
        messages.push({ role: 'system', content: context });
      }

      messages.push({ role: 'user', content: message });

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
      });

      return response.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
