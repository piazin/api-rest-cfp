import nodemailer from 'nodemailer';

export default async function sendEmail() {
  try {
    let trasporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '',
      },
    });
  } catch (error) {}
}
