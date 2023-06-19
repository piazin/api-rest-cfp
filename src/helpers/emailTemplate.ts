import path from 'path';
import fs from 'fs/promises';

enum emailTemplatesAvailable {
  uniqueCode = 'uniqueCodeEmailTemplate.html',
}

export class GetEmailTemplate {
  async uniqueCode(user_name: string, code: number) {
    try {
      const emailTemplate = await this.readEmailTemplate(emailTemplatesAvailable.uniqueCode);

      const replacements = {
        '{user_name}': user_name,
        '{code}': String(code),
      };

      return Object.entries(replacements).reduce(
        (template, [placeholder, replacement]) => template.replace(new RegExp(placeholder, 'g'), replacement),
        emailTemplate
      );
    } catch (err) {
      throw err;
    }
  }

  private async readEmailTemplate(templateName: emailTemplatesAvailable): Promise<string> {
    const emailTemplate = await fs.readFile(path.resolve(`./src/public/${templateName}`), { encoding: 'utf-8' });

    return emailTemplate;
  }
}
