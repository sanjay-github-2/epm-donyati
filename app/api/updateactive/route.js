import { updateUserActiveStatus } from "@/models/user"; // Adjust the path as per your project structure
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { id, is_active } = await req.json();
    console.log(id);
    console.log(is_active);

    if (typeof is_active !== "boolean") {
      throw new Error("isActive must be a boolean value.");
    }

    const updatedUser = await updateUserActiveStatus(id, is_active);
    console.log(updatedUser);

    return NextResponse.json(
      { message: "User status updated successfully.", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
