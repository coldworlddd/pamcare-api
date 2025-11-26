import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAIService } from './openai.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private openAIService: OpenAIService,
  ) {}

  async createSession(userId: string, title?: string) {
    return this.prisma.chatSession.create({
      data: {
        userId,
        title: title || 'New Chat',
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async getSessions(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      this.prisma.chatSession.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      }),
      this.prisma.chatSession.count({ where: { userId } }),
    ]);

    return {
      data: sessions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSession(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    if (session.userId !== userId) {
      throw new NotFoundException('Chat session not found');
    }

    return session;
  }

  async sendMessage(userId: string, createMessageDto: CreateMessageDto) {
    const { content, sessionId } = createMessageDto;

    let session;
    if (sessionId) {
      session = await this.getSession(sessionId, userId);
    } else {
      session = await this.createSession(userId);
    }

    // Save user message
    const userMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content,
      },
    });

    // Get conversation history
    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
    });

    // Format messages for OpenAI
    const conversationHistory = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Get AI response
    const aiResponse = await this.openAIService.chat(conversationHistory);

    // Save AI message
    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    // Update session timestamp
    await this.prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    return {
      sessionId: session.id,
      userMessage,
      assistantMessage,
    };
  }

  async deleteSession(sessionId: string, userId: string) {
    await this.getSession(sessionId, userId); // Check ownership

    return this.prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }
}

