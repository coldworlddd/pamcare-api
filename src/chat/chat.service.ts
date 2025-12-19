import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateChatDto } from './dto/create-chat.dto';
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class ChatService {
  private model: GenerativeModel;
  private genAI: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async create(createChatDto: CreateChatDto, userName: string) {
    const personalizedModel = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a medical assistant for a mobile app called Pamcare AI. You are currently assisting ${userName}. You give clients and users the best medical advice and care. You must never give responses outside the medical field. You must never give prescriptions, only medical advice. You may advise users to book an appointment on Pamcare AI. your responses must be concise and straight to the point`
    });

    const result = await personalizedModel.generateContent(createChatDto.message);
    const response = result.response.text();

    return {
      userMessage: createChatDto.message,
      aiResponse: response,
    };
  }

}
