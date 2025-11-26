import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PharmacyService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicationDto: CreateMedicationDto) {
    return this.prisma.medication.create({
      data: createMedicationDto,
    });
  }

  async findAll(paginationDto: PaginationDto, search?: string) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [medications, total] = await Promise.all([
      this.prisma.medication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.medication.count({ where }),
    ]);

    return {
      data: medications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const medication = await this.prisma.medication.findUnique({
      where: { id },
    });

    if (!medication) {
      throw new NotFoundException('Medication not found');
    }

    return medication;
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.medication.update({
      where: { id },
      data: updateMedicationDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.medication.delete({
      where: { id },
    });
  }
}

