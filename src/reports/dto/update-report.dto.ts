import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ReportType } from '@prisma/client';

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsDateString()
  reportDate?: string;
}

