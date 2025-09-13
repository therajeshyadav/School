import { NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP required" },
        { status: 400 }
      );
    }

    const conn = await getConnection();

    // 1. Get the latest unused OTP for this email
    const [rows] = await conn.execute(
      "SELECT * FROM otps WHERE email=? AND expires_at > NOW() AND used=0 ORDER BY id DESC LIMIT 1",
      [email]
    );

    if (rows.length === 0 || rows[0].otp !== otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // 2. Mark OTP as used
    await conn.execute("UPDATE otps SET used=1 WHERE id=?", [rows[0].id]);

    // 3. Generate JWT token
    const token = generateToken({ email });

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
