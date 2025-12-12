import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    async sendOtpEmail(email: string, code: string): Promise<void> {
        const mailOptions = {
            from: this.configService.get<string>('SMTP_FROM'),
            to: email,
            subject: 'Your OTP Code - Pamcare AI',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #4CAF50;
              text-align: center;
              letter-spacing: 8px;
              margin: 20px 0;
              padding: 15px;
              background-color: #f0f0f0;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pamcare AI</h1>
            </div>
            <div class="content">
              <h2>Your One-Time Password</h2>
              <p>Hello,</p>
              <p>You requested to sign in to your Pamcare AI account. Please use the following OTP code to complete your authentication:</p>
              <div class="otp-code">${code}</div>
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
              <p>Best regards,<br>The Pamcare AI Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
