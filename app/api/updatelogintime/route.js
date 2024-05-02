import { updateLoginTime } from "@/models/user"; // Adjust the path as per your project structure
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    console.log(userId);

    if (!userId) {
      throw new Error("User ID is required.");
    }

    await updateLoginTime(userId);

    return NextResponse.json(
      { message: "Login time updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating login time:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
