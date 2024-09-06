import { defineEventHandler, readBody } from "h3";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("Email body:", body);

const config = useRuntimeConfig();
console.log(config, 'config')

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'jmcclung3509@gmail.com',
      pass: config.private.EMAIL_PSWRD
    },

  });

  try {
    await transporter.sendMail({
      from: 'Fantasy Wingman <jmcclung3509@gmail.com>',
      to: body.to,
      subject: body.subject || "No Subject",
      text: body.text || "No content provided",
      html: body.html || "",
    });
    return {
      status: "success",
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      status: "error", 
      message: "Failed to send email",
      error: error.message,
    };
  }
});
