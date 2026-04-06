import nodemailer from 'nodemailer';
import { config } from '../../core/config/index.js';
import logger from '../../core/config/logger.js';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.smtp.service,
      host: config.smtp.host,
      port: config.smtp.port,
      auth: config.smtp.auth,
    });
  }

  /**
   * Sends an email using the configured SMTP transporter.
   * @param options Email details (to, subject, text, html)
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: config.fromEmail,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error('Email sending failed:', { error });
      // We don't throw here to avoid breaking the main request flow,
      // but in production you might want to log this to a monitoring service.
    }
  }

  /**
   * Sends an OTP for registration verification.
   * @param email User's email address
   * @param otp 6-digit OTP code
   */
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - Finance App',
      text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p>Thank you for registering with <strong>Finance App</strong>! Please use the following 6-digit code to complete your registration:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #007bff; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">Best regards,<br>The Finance App Team</p>
        </div>
      `,
    });
  }
}

export const emailService = new EmailService();
