import { Resend } from 'resend';
import config from '../../../config';
import { EmailService } from '../interfaces/emailService';

export class ResendEmailService implements EmailService {
  private readonly transporter: Resend;

  constructor() {
    this.transporter = new Resend(config.email.api_key_resend);
  }

  async sendEmail(mailConfig: any): Promise<void> {
    await this.transporter.emails.send(mailConfig);
  }
}
