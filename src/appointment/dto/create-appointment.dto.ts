import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
    @IsDateString()
    appointment_date: string;

    @IsString()
    @IsNotEmpty()
    reason: string;
}

