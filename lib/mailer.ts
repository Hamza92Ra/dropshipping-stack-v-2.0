import nodemailer from 'nodemailer';

export function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS // Gmail App Password, same one used with PHPMailer
    }
  });
}

export async function sendMail(to: string, subject: string, html: string) {
  const transport = getTransport();
  await transport.sendMail({
    from: `"DropshippingStack" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
}
