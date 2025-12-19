import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) { }

  create(createAppointmentDto: CreateAppointmentDto) {
    return this.prisma.appointments.create({
      data: {
        appointment_date: createAppointmentDto.appointment_date,
        reason: createAppointmentDto.reason,
      },
    });
  }

  findAll() {
    return this.prisma.appointments.findMany();
  }

  findOne(id: number) {
    return this.prisma.appointments.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.appointments.update({
      where: { id },
      data: {
        ...(updateAppointmentDto.appointment_date && { appointment_date: updateAppointmentDto.appointment_date }),
        ...(updateAppointmentDto.reason && { reason: updateAppointmentDto.reason }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.appointments.delete({
      where: { id },
    });
  }
}
