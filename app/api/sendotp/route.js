// Import required modules
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import OTPGenerator from "otp-generator";
import { setCookie } from "nookies"; // Import setCookie from nookies

// POST handler for /api/sendmail
export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.error(new Error("Method Not Allowed"), { status: 405 });
  }

  const { name, email } = await req.json();
  console.log("name", name);
  console.log("email", email);

  const otp = OTPGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  console.log(otp);

  try {
    // Set the OTP in a cookie

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailContent = `Hello ${name},\n\nYour OTP for registration is: ${otp}\n\nPlease use this OTP to complete your registration.\n\nThank you,\nYour Application Name`;

    await transporter.sendMail({
      from: `Your Application Name <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "OTP for Registration",
      text: emailContent,
    });

    // Return the OTP in the response
    return NextResponse.json(
      { message: "OTP sent successfully", otp },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.error(new Error("Failed to send OTP"), { status: 500 });
  }
}
