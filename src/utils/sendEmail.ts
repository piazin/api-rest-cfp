import nodemailer from 'nodemailer';
import config from '../config/index';

export default async function sendEmail(user_email: string, user_name: string, code: number) {
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
      html: `
      <p>Olá <strong>${user_name}</strong></p>
      <p>Nós recebemos uma solicitação para um código de uso único para a sua conta.</p>
      <p>Seu código de uso único é: <strong>${code}</strong></p>
      <p>Obrigado,</p>
      <p>Equipe de contas CFP</p>
      `,
    };

    await trasporter.sendMail(mailConfig);
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}
