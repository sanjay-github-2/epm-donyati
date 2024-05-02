"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  FaGoogle,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";
import VideoLogo from "../common/Video-Logo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { encryptData, decryptData } from "@/utils/Crypto";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSSO, setShowSSO] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cloudAssurance, setCloudAssurance] = useState(false);
  const [kpi, setKpi] = useState(false);
  const [allocation, setAllocation] = useState(false);
  const router = useRouter();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const storeOTP = (otp) => {
    console.log(otp);
    const encryptedOTP = encryptData(otp);
    console.log(encryptedOTP); // Encrypt OTP before storing
    localStorage.setItem("otp", encryptedOTP);
  };

  // Function to securely retrieve OTP
  const retrieveOTP = () => {
    const encryptedOTP = localStorage.getItem("otp"); // Await the promise
    console.log(encryptedOTP);
    if (encryptedOTP) {
      const d = decryptData(encryptedOTP);
      console.log(d);
      return d; // Decrypt OTP before returning
    }
    return null;
  };

  const handleVerifyEmail = async () => {
    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        toast.error("User already exists.");
        setError("User already exists.");
        return;
      }
      const response = await fetch("/api/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        const otp = responseData.otp;
        console.log("inside");
        storeOTP(otp);
        setOtpSent(true);
        setError(""); // Clear any previous errors
      } else {
        toast.error("Failed to send OTP. Please try again.");
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Error sending OTP. Please try again later.");
      setError("Error sending OTP. Please try again later.");
    }
  };

  const handleValidateOTP = async () => {
    try {
      const storedEncryptedOTP = retrieveOTP();
      console.log(storedEncryptedOTP);

      if (storedEncryptedOTP) {
        // Your existing code to compare OTPs
        if (otp === storedEncryptedOTP) {
          setOtpVerified(true);
          localStorage.removeItem("otp");
          toast.success("OTP verified");
          // OTP validated successfully
        } else {
          toast.error("Invalid OTP. Please enter the correct OTP.");
          setError("Invalid OTP. Please enter the correct OTP.");
          // Invalid OTP handling
        }
      } else {
        toast.error("no otp in storage");
        // No OTP found in storage
      }
    } catch (error) {
      toast.error("Error validating OTP. Please try again later.");
      setError("Error validating OTP. Please try again later.");
      console.error("Error validating OTP:", error);
    }
  };

  const handleSuccess = () => {
    setRegistrationSuccess(true);
    toast.success("Registrtion successfull");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!otp) {
        toast.info("Verify Email First");
        setError("Verify Email First");
        return;
      } else if (!name || !email || !password) {
        toast.info("All fields are necessary.");
        setError("All fields are necessary.");
        return;
      }

      if (showSSO) {
        await handleSSORegistration({ name, email });
      } else {
        console.log("inside else handle submit");
        handleVerifyEmail();
        await handleNativeRegistration({ name, email, password });
      }
    } catch (error) {
      toast.error("Error during registration: ", error);
      console.log("Error during registration: ", error);
    }
  };

  const handleSSORegistration = async ({ name, email }) => {
    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        toast.error("User already exists.");
        setError("User already exists.");
        return;
      }

      const password = "sso";
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          AUTH_TYPE: "SSO",
          cloudAssurance,
          kpi,
          allocation,
        }),
      });

      if (res.ok) {
        console.log("added");
        handleSuccess();
      } else {
        toast.error("SSO registration failed.");
        console.log("SSO registration failed.");
      }
    } catch (error) {
      toast.error("Error during SSO registration: ", error);
      console.log("Error during SSO registration: ", error);
    }
  };

  const handleNativeRegistration = async ({ name, email, password }) => {
    try {
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          AUTH_TYPE: "NATIVE",
          cloudAssurance,
          kpi,
          allocation,
        }),
      });

      if (res.ok) {
        handleSuccess();
        try {
          console.log(email); // Log the email before sending the request for debugging
          const response = await fetch("/api/sendmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }), // Ensure email is correctly included in the request body
          });

          if (response.ok) {
            toast.success("Email sent successfully");
            console.log("Email sent successfully");
            router.push("/");
          } else {
            toast.error("Failed to send email");
            console.error("Failed to send email");
          }
        } catch (error) {
          toast.error("Error sending email:", error);
          console.error("Error sending email:", error);
        }

        // router.push("/");
      } else {
        toast.error("Native registration failed.");
        console.log("Native registration failed.");
      }
    } catch (error) {
      console.log("Error during native registration: ", error);
    }
  };

  const handleSignIn = async (provider) => {
    const result = await signIn(provider);
    if (result?.error) {
      setError(result.error);
    } else {
      toast.success("Sign Up successfull");
      console.log("Sign Up successfull");
    }
  };

  return (
    <div className="relative h-screen">
      <VideoLogo />

      <div className="absolute inset-0 flex items-center justify-end mr-20">
        <div className="bg-white p-8 rounded-md shadow-lg z-50">
          <div>
            {registrationSuccess && (
              <div className=" text-center ">
                <p className="text-sm font-semibold uppercase tracking-widest text-green-500 mb-2">
                  Registration Successfull
                </p>
              </div>
            )}
          </div>
          {/* SSO Toggle Button */}
          <div className="flex justify-center items-center mb-4 space-x-4">
            <span className="text-gray-700 text-md font-bold">Native User</span>
            <label
              htmlFor="AcceptConditions"
              className={`relative h-4 w-8 cursor-pointer rounded-full bg-gray-300 transition-colors ${
                showSSO ? "bg-green-500" : ""
              }`}
            >
              <input
                type="checkbox"
                id="AcceptConditions"
                className="peer sr-only"
                onChange={() => setShowSSO(!showSSO)}
              />

              <span
                className={`absolute inset-y-0 start-0 w-4 h-4  rounded-full bg-white shadow-md transition-all ${
                  showSSO ? "translate-x-full bg-green-500" : ""
                }`}
              ></span>
            </label>
            <span className="text-gray-700 text-md font-bold">SSO User</span>
          </div>

          <h1 className="text-xl font-bold mb-4">
            {showSSO ? "Register with SSO" : "Register"}
          </h1>

          {/* Conditionally render registration form */}
          {showSSO ? (
            <>
              <div className="py-4">
                <div className="flex flex-row gap-2  ">
                  <div className="flex flex-col gap-4 my-auto mr-4">
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <TextField
                      type="email"
                      label="Email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="my-auto"
                    />
                  </div>
                  <div className="flex flex-col gap-3 my-auto">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={cloudAssurance}
                          onChange={(e) => setCloudAssurance(e.target.checked)}
                        />
                      }
                      label="Cloud Assurance"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={kpi}
                          onChange={(e) => setKpi(e.target.checked)}
                        />
                      }
                      label="KPI"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={allocation}
                          onChange={(e) => setAllocation(e.target.checked)}
                        />
                      }
                      label="Allocation"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-3 mt-5">
                  <Button
                    onClick={() => {
                      handleSignIn("google");
                      handleSSORegistration({ name, email });
                    }}
                    variant="contained"
                    className="bg-blue-500"
                  >
                    <FaGoogle className="mr-3" />
                    Sign up with Google
                  </Button>
                  <Button
                    onClick={() => {
                      handleSignIn("github");
                      handleSSORegistration({ name, email });
                    }}
                    variant="contained"
                    className="bg-black"
                  >
                    <FaGithub className="mr-3" />
                    Sign up with GitHub
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                {error && <div className=" text-red-500 px-4 ">{error}</div>}
                <Link
                  href="/"
                  className="text-md  mt-3 jusify-end text-right font-bold"
                >
                  Already Have an Account?{" "}
                  <span className="underline text-md font-bold">Login</span>
                </Link>{" "}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-row px-1">
                <div className="flex flex-col gap-2 mr-4">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: "230px" }}
                  />
                  <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "230px" }}
                  />
                  {/* <Button
                    variant="contained"
                    onClick={handleVerifyEmail}
                    className={`${
                      otpSent ? "bg-green-500" : "bg-red-500"
                    } text-white rounded-full w-0 p-1 m-0`}
                  >
                    {otpSent ? <FaCheckCircle /> : <FaEnvelope />}
                  </Button> */}
                  {otpSent ? (
                    <div>
                      <TextField
                        type="text"
                        label="Enter OTP"
                        variant="outlined"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        style={{ width: "190px" }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleValidateOTP}
                        className="bg-green-500 mt-2 ml-2 p-1 rounded-full min-w-min" // Add rounded-full class for circular shape and remove unnecessary padding
                      >
                        <FaCheckCircle
                          style={{ height: "2em", width: "2em" }}
                          className="text-white"
                        />{" "}
                        {/* Style the icon color */}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleVerifyEmail}
                      className="bg-green-500"
                    >
                      Verify Email
                    </Button>
                  )}

                  <TextField
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    label="Password"
                    value={password}
                    style={{ width: "230px" }}
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
                </div>

                <div className="flex flex-col gap-3 my-auto">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={cloudAssurance}
                        onChange={(e) => setCloudAssurance(e.target.checked)}
                      />
                    }
                    label="Cloud Assurance"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={kpi}
                        onChange={(e) => setKpi(e.target.checked)}
                      />
                    }
                    label="KPI"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allocation}
                        onChange={(e) => setAllocation(e.target.checked)}
                      />
                    }
                    label="Allocation"
                  />
                </div>
              </div>

              <Button variant="contained" type="submit" className="bg-blue-500">
                Register
              </Button>

              {/* {error && <div className=" text-red-500 px-4 ">{error}</div>} */}

              <Link href="/" className="text-sm  mt-3 text-right text-gray-600">
                Already Have an Account?{" "}
                <span className="underline text-sm">Login</span>
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
