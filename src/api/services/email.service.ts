import path from 'path';
import fs from 'fs/promises';
import config from '../../config';
import nodemailer from 'nodemailer';
import { RequestEmail } from './interfaces/email';

export class SendEmailService {
  async execute({ user_email, user_name, code }: RequestEmail): Promise<boolean> {
    try {
      let trasporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });

      let mailConfig = {
        from: {
          name: 'Equipe CFP',
          address: 'financeinnovcfp@gmail.com',
        },
        to: user_email,
        subject: 'Seu codigo de uso unico',
        html: await this.uniqueCodeEmailTemplate(user_name, code),
      };

      await trasporter.sendMail(mailConfig);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  private async uniqueCodeEmailTemplate(user_name: string, code: number): Promise<string> {
    const emailTemplate = await fs.readFile(path.resolve('./src/public/uniqueCodeEmailTemplate.html'), { encoding: 'utf-8' });

    const replacements = {
      '{user_name}': user_name,
      '{code}': String(code),
    };

    return Object.entries(replacements).reduce(
      (template, [placeholder, replacement]) => template.replace(new RegExp(placeholder, 'g'), replacement),
      emailTemplate
    );
  }
}
