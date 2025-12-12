import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import OpenAI from "openai";


@Injectable()
export class ChatService {
  constructor(private configService: ConfigService) { }

  async create(createChatDto: CreateChatDto) {
    console.log({ createChatDto });
    const response = await this.generateResponse(createChatDto.message);
    return {
      userMessage: createChatDto.message,
      aiResponse: response,
    };
  }

  async generateResponse(message: string): Promise<string> {
    const client = new OpenAI();
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }
    try {
      const response = await client.responses.create({
        model: "gpt-5",
        input: message,
      });
      return response.output_text;
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error}`);

    }

  }

  findAll() {
    return `This action returns chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
