import { createUser } from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getCurrentDateTime } from "@/utils/DateTime";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const {
      name,
      email,
      password,
      AUTH_TYPE,
      cloudAssurance,
      kpi,
      allocation,
    } = await req.json();

    if (!name || !email || !password || !AUTH_TYPE) {
      throw new Error("All fields are necessary.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isActive = true;
    const lastLoggedIn = getCurrentDateTime();

    const id = uuidv4();

    let group = "";
    if (cloudAssurance) {
      group += "Cloud Assurance, ";
    }
    if (kpi) {
      group += "KPI, ";
    }
    if (allocation) {
      group += "Allocation, ";
    }
    group = group.slice(0, -2);
    console.log(group);

    await createUser({
      id,
      name,
      email,
      role: "User",
      group,
      AUTH_TYPE,
      access_type: null,
      password: hashedPassword,
      last_logged_in: lastLoggedIn,
      is_active: isActive,
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
