import { EmailService } from '../interfaces/emailService';
import { GetEmailTemplate, emailTemplatesAvailable } from '@helpers';

export class SendEmailService {
  private emailService: EmailService;
  private readonly getEmailTemplate: GetEmailTemplate;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
    this.getEmailTemplate = new GetEmailTemplate();
  }

  async execute<T>(to: string, subject: string, optionalData?: T): Promise<boolean> {
    try {
      const emailTemplate = await this.readTemplate(emailTemplatesAvailable.uniqueCode, optionalData);

      let mailConfig = {
        from: 'cfp@lucasouza.tech',
        to: process.env.NODE_ENV === 'development' ? 'delivered@resend.dev' : to,
        subject,
        html: emailTemplate,
      };

      await this.emailService.sendEmail(mailConfig);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  private async readTemplate(templateName: emailTemplatesAvailable, optionalData?: any): Promise<string> {
    switch (templateName) {
      case emailTemplatesAvailable.uniqueCode:
        return await this.getEmailTemplate.uniqueCode(optionalData.userName, optionalData.code);
      default:
        return null;
    }
  }
}
