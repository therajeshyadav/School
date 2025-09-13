import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getConnection } from "@/lib/database";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const conn = await getConnection();

    // 1. Check if user exists
    const [users] = await conn.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found, please signup first" },
        { status: 404 }
      );
    }

    // 2. Delete any old OTPs for this email
    await conn.execute("DELETE FROM otps WHERE email = ?", [email]);

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Save OTP in DB
    await conn.execute(
      "INSERT INTO otps (email, otp, expires_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0)",
      [email, otp]
    );

    // 5. Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 6. Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp} . It is valid for 10 minutes.`,
    });

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
