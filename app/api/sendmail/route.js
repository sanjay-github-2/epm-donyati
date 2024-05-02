import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generalTemplate } from "@/utils/MailTemplate";
import emailData from "@/utils/emailData";

export async function POST(req) {
  const { name, email } = await req.json();
  const url = process.env.NEXTAUTH_URL;
  const { subject, content, buttonLabel } = emailData["welcome"];
  console.log(content);

  console.log(email);

  const transporter = nodemailer.createTransport({
    // Set up your email service provider configuration here
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  try {
    await transporter.sendMail({
      from: `Cloud Assurance <${process.env.EMAIL_ID}>`,
      to: email,
      subject: subject,
      html: generalTemplate(url, name, content, buttonLabel),
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
