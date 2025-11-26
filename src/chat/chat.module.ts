import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenAIService } from './openai.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, OpenAIService],
})
export class ChatModule {}

