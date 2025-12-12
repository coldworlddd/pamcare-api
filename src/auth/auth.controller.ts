import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('send-otp')
    async sendOtp(@Body() sendOtpDto: SendOtpDto) {
        return this.authService.sendOtp(sendOtpDto.email);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.code);
    }

    @Post('complete-registration')
    @UseInterceptors(FileInterceptor('profile_image'))
    async completeRegistration(
        @Body() completeRegistrationDto: CompleteRegistrationDto,
        @UploadedFile() profileImage?: Express.Multer.File,
    ) {
        return this.authService.completeRegistration(
            completeRegistrationDto.email,
            completeRegistrationDto.first_name,
            completeRegistrationDto.last_name,
            profileImage,
        );
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req) {
        return req.user;
    }
}
