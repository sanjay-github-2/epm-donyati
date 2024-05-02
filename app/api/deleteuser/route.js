import { deleteUserById } from "@/models/user"; // Adjust the path as per your project structure
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { userId } = await req.json(); // Assuming the ID of the user to delete is provided in the request body
    console.log(userId);
    // Call the deleteUserById function to delete the user
    const deletedUser = await deleteUserById(userId);

    return NextResponse.json(
      { message: "User deleted successfully.", user: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
