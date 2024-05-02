import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log(req.body);
    const { criteria } = await req.json();
    console.log(criteria); // Get filter criteria from request body

    const client = await pool.connect();
    let query = "SELECT * FROM public.user_table ORDER BY email ASC ";

    // Modify the query based on filter criteria
    if (criteria === "Active") {
      query =
        "SELECT * FROM public.user_table WHERE is_active = true ORDER BY email ASC";
    } else if (criteria === "Registered") {
      query =
        "SELECT * FROM public.user_table WHERE is_active = false ORDER BY email ASC";
    }

    const result = await client.query(query);
    client.release();
    console.log(result.rows);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user details." },
      { status: 500 }
    );
  }
}
