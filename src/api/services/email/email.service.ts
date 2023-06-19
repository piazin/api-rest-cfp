import { RequestEmail } from '../interfaces/email';
import { EmailService } from '../interfaces/emailService';
import { GetEmailTemplate } from '../../../helpers/emailTemplate';

export class SendEmailService {
  private emailService: EmailService;
  private readonly getEmailTemplate: GetEmailTemplate;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
    this.getEmailTemplate = new GetEmailTemplate();
  }

  async execute({ user_email, user_name, code }: RequestEmail): Promise<boolean> {
    try {
      const emailTemplate = await this.getEmailTemplate.uniqueCode(user_name, code);

      let mailConfig = {
        from: 'cfp@lucasouza.tech',
        to: user_email,
        subject: 'Seu codigo de uso unico',
        html: emailTemplate,
      };

      await this.emailService.sendEmail(mailConfig);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}
