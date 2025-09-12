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
    const [rows] = await conn.execute(
      "SELECT * FROM otps WHERE email=? AND otp=? AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
      [email, otp]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // OTP valid -> delete from table
    await conn.execute("DELETE FROM otps WHERE email=?", [email]);

    // JWT token
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
