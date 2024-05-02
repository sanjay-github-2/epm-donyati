import { updateUser } from "@/models/user"; // Adjust the path as per your project structure
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, role, group, accessType } = await req.json();
    console.log(accessType);

    if (!email || !role || !group) {
      throw new Error("Email, role, and group are required.");
    }

    const updatedUser = await updateUser({ email, role, group, accessType });

    return NextResponse.json(
      { message: "User updated successfully.", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
