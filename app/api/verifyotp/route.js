// Import required modules
import { NextResponse } from "next/server";

// POST handler for /api/verifyOTP
export async function POST(req) {
  // Ensure only POST requests are allowed
  if (req.method !== "POST") {
    return NextResponse.error(new Error("Method Not Allowed"), { status: 405 });
  }

  try {
    // Retrieve email and OTP from the request body
    const { email: reqEmail, otp: reqOTP } = await req.json();

    // Retrieve OTP from the session storage
    const storedOTP = sessionStorage.getItem(otp);
    console.log(storedOTP);

    // Check if OTP exists in session storage
    if (!storedOTP) {
      // If OTP is not available in session storage, return an error response
      return NextResponse.json(
        { message: "OTP not found in session storage" },
        { status: 400 }
      );
    }

    // Compare the OTP from session storage with the OTP received in the request body
    if (storedOTP !== reqOTP) {
      // If OTPs don't match, return an error response
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // If OTP is valid, return a success response
    return NextResponse.json(
      { message: "OTP validated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // If an error occurs during OTP verification, log the error and return an error response
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
