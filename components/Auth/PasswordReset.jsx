"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button } from "@mui/material";
import Link from "next/link";
import VideoLogo from "../common/Video-Logo";

export default function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Handle password reset logic here
      // You can use the NextAuth.js API to send a password reset email
      // Example: await sendPasswordResetEmail(email);

      // After sending the password reset email, redirect the user to a confirmation page
      router.push("/password-reset-confirmation");
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Failed to reset password");
    }
  };

  return (
    <div className="relative h-screen">
      <VideoLogo />
      <div className="absolute inset-0 flex items-center justify-end">
        <div className="bg-white p-8 rounded-md shadow-lg z-20 mr-20">
          <h1 className="text-xl font-bold mb-4">Reset Password</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="contained" className="bg-green-500">
              Reset Password
            </Button>

            {error && <div className=" text-red-500 px-4  ">{error}</div>}
          </form>
          <Link href="/">
            <p className="text-right text-sm mt-3 underline">Sign In</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
