import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: config.get<number>('SMTP_PORT') ?? 587,
        secure: config.get<boolean>('SMTP_SECURE') ?? false,
        auth: {
          user: config.get<string>('SMTP_USER'),
          pass: config.get<string>('SMTP_PASS'),
        },
      });
    } else {
      // Fall back to Ethereal (catches emails in dev without real SMTP)
      nodemailer.createTestAccount().then(account => {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: { user: account.user, pass: account.pass },
        });
        this.logger.warn(`No SMTP_HOST set — using Ethereal test account: ${account.user}`);
      });
    }
  }

  async sendPasswordReset(to: string, token: string, frontendUrl: string): Promise<void> {
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    if (!this.transporter) {
      this.logger.warn(`[DEV] Password reset link for ${to}: ${resetUrl}`);
      return;
    }

    const info = await this.transporter.sendMail({
      from: `"TypeForge" <${this.config.get('SMTP_FROM') ?? 'noreply@typeforge.dev'}>`,
      to,
      subject: 'Reset your TypeForge password',
      text: `Click the link below to reset your password (valid for 1 hour):\n\n${resetUrl}`,
      html: `
        <p>Click the button below to reset your TypeForge password. This link expires in <strong>1 hour</strong>.</p>
        <p><a href="${resetUrl}" style="background:#6366f1;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Reset password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    this.logger.log(`Password reset email sent to ${to} (messageId: ${info.messageId})`);
  }
}
