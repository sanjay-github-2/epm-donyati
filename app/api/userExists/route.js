import { pool } from "@/lib/db"; // Import the PostgreSQL connection pool
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Query to select user by email
    const query = {
      text: 'SELECT * FROM public."user_table" WHERE email = $1', // Adjust table name as per your database schema
      values: [email],
    };

    // Connect to PostgreSQL and execute the query
    const client = await pool.connect();
    const result = await client.query(query);

    // Release the client back to the pool
    client.release();

    // Check if user exists
    const user = result.rows[0];
    console.log("user: ", user);

    // Return the user data
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
