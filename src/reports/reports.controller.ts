import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private configService: ConfigService,
  ) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(user.id, createReportDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/reports',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadReport(
    @CurrentUser() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10485760, // 10MB default
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createReportDto: CreateReportDto,
  ) {
    const baseUrl = this.configService.get<string>('BASE_URL') ?? 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/reports/${file.filename}`;

    return this.reportsService.create(user.id, {
      ...createReportDto,
      fileUrl,
    });
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query() paginationDto: PaginationDto) {
    return this.reportsService.findAll(user.id, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reportsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, user.id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reportsService.remove(id, user.id);
  }
}

