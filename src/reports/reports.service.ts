import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createReportDto: CreateReportDto) {
    return this.prisma.patientReport.create({
      data: {
        ...createReportDto,
        ...(createReportDto.reportDate && {
          reportDate: new Date(createReportDto.reportDate),
        }),
        userId,
      },
    });
  }

  async findAll(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      this.prisma.patientReport.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { reportDate: 'desc' },
      }),
      this.prisma.patientReport.count({ where: { userId } }),
    ]);

    return {
      data: reports,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const report = await this.prisma.patientReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.userId !== userId) {
      throw new ForbiddenException('You do not have access to this report');
    }

    return report;
  }

  async update(id: string, userId: string, updateReportDto: UpdateReportDto) {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.patientReport.update({
      where: { id },
      data: {
        ...updateReportDto,
        ...(updateReportDto.reportDate && {
          reportDate: new Date(updateReportDto.reportDate),
        }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.patientReport.delete({
      where: { id },
    });
  }
}

