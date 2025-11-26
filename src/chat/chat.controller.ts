import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sessions')
  createSession(@CurrentUser() user: any, @Body('title') title?: string) {
    return this.chatService.createSession(user.id, title);
  }

  @Get('sessions')
  getSessions(@CurrentUser() user: any, @Query() paginationDto: PaginationDto) {
    return this.chatService.getSessions(user.id, paginationDto);
  }

  @Get('sessions/:id')
  getSession(@Param('id') id: string, @CurrentUser() user: any) {
    return this.chatService.getSession(id, user.id);
  }

  @Post('messages')
  sendMessage(@CurrentUser() user: any, @Body() createMessageDto: CreateMessageDto) {
    return this.chatService.sendMessage(user.id, createMessageDto);
  }

  @Delete('sessions/:id')
  deleteSession(@Param('id') id: string, @CurrentUser() user: any) {
    return this.chatService.deleteSession(id, user.id);
  }
}

