import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAppointmentDto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
        userId,
      },
    });
  }

  async findAll(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { appointmentDate: 'desc' },
      }),
      this.prisma.appointment.count({ where: { userId } }),
    ]);

    return {
      data: appointments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException('You do not have access to this appointment');
    }

    return appointment;
  }

  async update(id: string, userId: string, updateAppointmentDto: UpdateAppointmentDto) {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...updateAppointmentDto,
        ...(updateAppointmentDto.appointmentDate && {
          appointmentDate: new Date(updateAppointmentDto.appointmentDate),
        }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}

