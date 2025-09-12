import { NextResponse } from "next/server";
import { getConnection } from "@/lib/database";

export async function POST(req) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const conn = await getConnection();

    // Check if user already exists by email
    const [rows] = await conn.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists. Please login." },
        { status: 400 }
      );
    }

    // Insert new user (only name, email, phone)
    await conn.execute(
      "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
