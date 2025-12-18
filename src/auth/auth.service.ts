import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async sendOtp(email: string): Promise<{ message: string; code: string }> {
    // Generate 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the OTP for security
    const hashedCode = await bcrypt.hash(code, 10);

    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing unverified OTPs for this email
    await this.prisma.otp_codes.deleteMany({
      where: {
        email,
        verified: false,
      },
    });

    // Store the OTP in database
    await this.prisma.otp_codes.create({
      data: {
        email,
        code: hashedCode,
        expires_at: expiresAt,
        verified: false,
      },
    });

    // Send OTP via email
    await this.emailService.sendOtpEmail(email, code);

    return { message: 'OTP sent successfully', code };
  }

  async verifyOtp(
    email: string,
    code: string,
  ): Promise<{ userExists: boolean; token?: string; message?: string }> {
    // Find the most recent OTP for this email
    const otpRecord = await this.prisma.otp_codes.findFirst({
      where: {
        email,
        verified: false,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expires_at) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Verify the OTP code
    const isValidCode = await bcrypt.compare(code, otpRecord.code);
    if (!isValidCode) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    // Mark OTP as verified
    await this.prisma.otp_codes.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Check if user exists
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (user) {
      // User exists, generate token and log them in
      const token = this.generateToken(user);
      return {
        userExists: true,
        token,
      };
    } else {
      // User doesn't exist, prompt for registration
      return {
        userExists: false,
        message: 'Please complete registration',
      };
    }
  }

  async completeRegistration(
    email: string,
    firstName: string,
    lastName: string,
    profileImage?: Express.Multer.File,
  ): Promise<{ token: string; user: any }> {
    // Check if there's a verified OTP for this email
    const verifiedOtp = await this.prisma.otp_codes.findFirst({
      where: {
        email,
        verified: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!verifiedOtp) {
      throw new UnauthorizedException(
        'Please verify your email with OTP first',
      );
    }

    // Check if user already exists
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Upload profile image to Cloudinary if provided
    let profileImageUrl: string | null = null;
    if (profileImage) {
      try {
        profileImageUrl =
          await this.cloudinaryService.uploadImage(profileImage);
      } catch (error) {
        throw new BadRequestException('Failed to upload profile image');
      }
    }

    // Create new user
    const user = await this.prisma.users.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        profile_image: profileImageUrl,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user);

    // Clean up used OTP
    await this.prisma.otp_codes.deleteMany({
      where: { email },
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
      },
    };
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(userId: number): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_image: user.profile_image,
    };
  }
}
