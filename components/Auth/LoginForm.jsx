"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { TextField, Button, IconButton } from "@mui/material";
import VideoLogo from "../common/Video-Logo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("All fields are required");
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        toast.error("Invalid Credentials");
        return;
      }

      toast.success("Login Successful");
      router.replace("dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Error during login. Please try again later.");
    }
  };

  const updateLoginTime = async (userId) => {
    try {
      const res = await fetch("/api/updateLoginTime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Failed to update login time");
      }
    } catch (error) {
      console.error("Error updating login time:", error);
    }
  };

  const handleSignIn = async (provider) => {
    try {
      const result = await signIn(provider);
      if (result?.error) {
        setError(result.error);
      } else {
        // Store the ID of the logged-in user
        setLoggedInUsers([...loggedInUsers, result?.session?.user?.id]);
        console.log(setLoggedInUsers);
        toast.success("Login Successfull");
        router.replace("dashboard");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      // setError("Failed to sign in with Google");
    }
  };

  return (
    <div className="relative h-screen">
      <VideoLogo />
      <div className="absolute inset-0 flex items-center justify-end">
        <div className="bg-white p-8 rounded-md shadow-lg z-20 mr-20">
          <h1 className="text-xl font-bold mb-4">Log In</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              variant="outlined"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    className="focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent form submission
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                ),
              }}
            />
            <div>
              {" "}
              <Link href="/reset-password">
                <p className="text-sm justify-end items-end text-right ">
                  Forgot Password?
                </p>
              </Link>
            </div>

            <Button type="submit" variant="contained" className="bg-green-500">
              Log In
            </Button>

            {/* {error && <div className=" text-red-500 px-4  ">{error}</div>} */}

            <Link href="/register" className="text-sm text-bold  text-right">
              Don't Have an Account?{" "}
              <span className="underline text-blue-400">Register</span>
            </Link>
          </form>
          <hr className="border border-black my-3" />

          <div className="flex flex-row mt-4 gap-6">
            <button
              onClick={() => handleSignIn("google")}
              className="bg-blue-600 text-white p-1 flex   items-center rounded-full  justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaGoogle className="" />
            </button>
            <button
              onClick={() => handleSignIn("github")}
              className="bg-gray-800 text-white p-1   flex items-center rounded-full justify-center hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 "
            >
              <FaGithub className="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
