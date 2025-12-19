import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto, @Request() req) {
    console.log({ __createChatDto: createChatDto });
    const user = req.user;
    return this.chatService.create(createChatDto, user.first_name);
  }
}
